#!/usr/bin/env python3
"""Deterministic mechanics for the Phase 8 deferred-work archive.

At epic end (pipeline.md Phase 8 step 3) the orchestrator trims the active
deferral ledger ``<impl>/deferred-work.md``: entries that vouch for their own
full resolution move to the sibling archive ``deferred-work-resolved.md`` so
create-story stops re-folding finished work into future stories. The
KEEP-vs-MOVE **judgment stays with the LLM** (the self-vouching rule and the
keep-on-doubt asymmetry are normative in pipeline.md); this script owns the
mechanics that must not be left to a generative rewrite of two markdown files:
reading the ledger into addressable entries, and moving exactly the chosen
entries atomically.

An **entry** is one top-level bullet — plus its continuation lines and nested
bullets — under a ``## Deferred from: <source> (<date>)`` heading (the format
the code-review delegate appends; see delegation.md). Bullets in the title/
intro or under any other heading are never entries; they are preserved
verbatim. A section ends at the next heading at its own level or shallower;
a DEEPER heading (``### context`` under a ``##`` section) is section-internal
structure and the bullets after it are still entries. Fenced code blocks (``` or ~~~, CommonMark-style) are tracked:
``## …`` / ``- …`` lines inside a fence are literal content, never a section
or entry boundary, and an unclosed fence runs to end of file as content of
the current entry/section.

Usage:
    deferred_ledger.py plan    --ledger PATH
    deferred_ledger.py archive --ledger PATH --archive PATH --ids 2,5,9
                               --expect-sha SHA
    deferred_ledger.py --self-test

``plan`` (read-only) prints::

    {"ledger_present": bool, "ledger_sha256": str|null,
     "entries": [{"id": int, "heading": str, "text": str,
                  "marker_hint": "resolved"|"partial"|"open"}]}

``id`` is a stable integer index in document order — valid only against this
``ledger_sha256``. ``marker_hint`` is a HEURISTIC AID ONLY, computed from the
entry's OWN text (an entry is never hinted ``resolved`` because a *different*
entry mentions it): ``resolved`` if the entry carries a resolution marker (a
leading ``✅``, ``RESOLVED``, "resolved in", "closed", "addressed in",
"done in" — case-insensitive) and no open-remainder signal; ``partial`` if it
has both a marker and a remainder signal ("remainder", "still open",
"portion", "owned by", "partially"); else ``open``. The LLM makes the final
call per pipeline.md; the hint just focuses its read. A missing or empty
ledger prints ``{"ledger_present": false, "entries": []}`` and exits 0.

``archive`` moves the entries named by ``--ids`` from the ledger to the
archive: each is appended under a matching ``## Deferred from:`` heading there
(the archive is created with a one-line H1 title if absent; an existing
identical heading is reused, else the heading is appended), removed from the
ledger, and any ledger ``## Deferred from:`` heading left with zero entries is
dropped. The ledger's title and intro prose are preserved verbatim. Both files
are written via temp-file + ``os.replace`` (archive first, so a crash between
the two writes leaves the entry in both files, never lost). Re-running the
same ``archive`` after such a crash is safe: an entry whose text (normalized
for trailing whitespace) already sits under the target archive heading is not
appended again — it counts in ``deduped`` (and still in ``moved``) and the
ledger-side removal proceeds. ``--expect-sha`` must equal the current ledger
sha256 (take it from ``plan``); a mismatch — the file changed since planning —
or an unknown id exits 1 with NO writes. Prints::

    {"moved": int, "deduped": int, "headings_created": int,
     "headings_removed": int, "ledger_sha256_after": str}

Exit codes: 0 ok; 1 stale sha / unknown id / missing ledger; 2 usage.
Dependency-free (stdlib only). Output is a single JSON object on stdout.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import tempfile

# A ledger section heading: `## Deferred from: code review of story-3.3 (2026-03-18)`.
DEFER_HEADING_RE = re.compile(r"^#{1,4}\s+deferred\s+from:", re.IGNORECASE)
# Any ATX heading at level 1-4 — a section-end candidate. Level-aware: only a
# heading at the section's own level or shallower closes it; a DEEPER heading
# (`### context` under a `## Deferred from:`) is section-internal structure and
# the entries after it still belong to the section (the same rule as
# review_findings.py's parse_deferred_work — one entry grammar for this file).
ANY_HEADING_RE = re.compile(r"^#{1,4}\s+\S")


def _heading_level(line):
    """Number of leading ``#`` on a line ``ANY_HEADING_RE`` matched."""
    return len(line) - len(line.lstrip("#"))
# A top-level bullet (column 0) — starts a new entry inside a deferral section.
TOP_BULLET_RE = re.compile(r"^[-*+]\s+\S")
# An indented, non-blank line — a continuation / nested bullet of the entry.
INDENTED_RE = re.compile(r"^\s+\S")
# Fenced code blocks (CommonMark-style, kept simple): a fence OPENS on a line
# whose content — at ANY indent, optionally right after a single bullet marker
# (`- ```py` is CommonMark-legal) — starts with 3+ backticks or tildes (an
# info string may follow); it CLOSES on a later line with the SAME fence char,
# at LEAST as many of them, any indent, and nothing else. One rule for every
# position (intro, section text, entry bullets, nested bullets): tracking the
# opener and the closer with the SAME indent tolerance is what prevents the
# state-inversion class of bug, where an untracked opener's closing line is
# read as an OPENER and the rest of the document is swallowed as fence
# content. While inside a fence NO line is a heading or a bullet — `## …` /
# `- …` lines in there are literal content, never section/entry boundaries.
# (Backtick branch: CommonMark forbids backticks in a backtick fence's info
# string, so requiring no later backtick keeps inline code spans — ```x``` —
# from reading as fence openers. Tilde info strings may contain anything.)
FENCE_OPEN_RE = re.compile(r"^\s*(?:[-*+]\s+)?(`{3,}(?!.*`)|~{3,})")


def _fence_open(line):
    """Return ``(char, length)`` if ``line`` opens a fence, else ``None``."""
    m = FENCE_OPEN_RE.match(line)
    return (m.group(1)[0], len(m.group(1))) if m else None


def _fence_closes(line, char, length):
    """True if ``line`` closes a fence opened with ``length`` × ``char``."""
    return bool(re.match(r"^\s*%s{%d,}\s*$" % (re.escape(char), length), line))

# Resolution markers (entry's OWN text only — the self-vouching rule). Word
# boundaries keep e.g. "disclosed" from reading as "closed".
RESOLUTION_RE = re.compile(
    r"(?:\bresolved\b|\bclosed\b|\baddressed\s+in\b|\bdone\s+in\b)", re.IGNORECASE
)
# A leading ✅ right after the bullet marker (optional checkbox/emphasis tolerated).
LEADING_CHECK_RE = re.compile(r"^[-*+]\s+(?:\[[ xX]\]\s+)?(?:\*\*|__)?\s*✅")
# Open-remainder signals — a partial resolution still carries open work.
REMAINDER_RE = re.compile(
    r"(?:\bremainder\b|\bstill\s+open\b|\bportion\b|\bowned\s+by\b|\bpartial(?:ly)?\b)",
    re.IGNORECASE,
)

ARCHIVE_TITLE = "# Deferred Work — Resolved"


def classify_hint(entry_text: str) -> str:
    """Heuristic marker hint for ONE entry, from its own text only."""
    first_line = entry_text.split("\n", 1)[0]
    has_resolution = bool(RESOLUTION_RE.search(entry_text)) or bool(
        LEADING_CHECK_RE.match(first_line)
    )
    if not has_resolution:
        return "open"
    return "partial" if REMAINDER_RE.search(entry_text) else "resolved"


def parse_document(text: str):
    """Parse a ledger/archive into ``(segments, entries, next_section)``.

    ``segments`` is an ordered, lossless model of the document:
    ``{"kind": "text", "section": int|None, "lines": [...]}`` |
    ``{"kind": "heading", "section": int, "line": str}`` |
    ``{"kind": "entry", "section": int, "id": int, "lines": [...]}``.
    Text outside any ``## Deferred from:`` section has ``section: None`` and is
    always reproduced verbatim. Entry lines include attached blank lines (so a
    removal also removes its separator); the entry's ``text`` is rstripped.
    """
    lines = text.splitlines()
    segments = []
    entries = []
    section = None
    section_level = 0  # level of the current section's `## Deferred from:` heading
    cur_heading = None
    next_section = 0
    n = len(lines)

    def add_text(chunk):
        if segments and segments[-1]["kind"] == "text" and segments[-1]["section"] == section:
            segments[-1]["lines"].extend(chunk)
        else:
            segments.append({"kind": "text", "section": section, "lines": list(chunk)})

    i = 0
    fence = None  # (char, length) of an open fence in title/intro/section text
    while i < n:
        line = lines[i]
        if fence is not None:
            # Inside a fenced code block: the line is verbatim text, never a
            # heading or a bullet.
            add_text([line])
            if _fence_closes(line, *fence):
                fence = None
            i += 1
            continue
        if DEFER_HEADING_RE.match(line):
            section = next_section
            next_section += 1
            cur_heading = line.strip()
            section_level = _heading_level(line)
            segments.append({"kind": "heading", "section": section, "line": line})
            i += 1
            continue
        if ANY_HEADING_RE.match(line):
            if section is not None and _heading_level(line) > section_level:
                # Deeper than the section heading: internal structure, not a
                # boundary — the section stays open and later bullets are
                # still entries. The heading travels as section text (so it
                # vanishes with an emptied section, like any section prose).
                add_text([line])
                i += 1
                continue
            # A heading at the section's level or shallower closes it.
            section = None
            cur_heading = None
            add_text([line])
            i += 1
            continue
        if section is not None and TOP_BULLET_RE.match(line):
            # Checked BEFORE the fence-open test: a column-0 bullet that opens
            # a fence (`- ```py`) starts a NEW entry whose first line opens the
            # entry's fence — it is not intro/section fence text.
            entry_lines = [line]
            # The entry's own bullet may open a fence (`- ```py`): track it so
            # its closing line isn't mistaken for an opener.
            entry_fence = _fence_open(line)  # (char, length) of an open fence in the entry
            i += 1
            while i < n:
                nxt = lines[i]
                if entry_fence is not None:
                    # Inside a fence every line (blank, `## …`, `- …`) is
                    # entry content. With no closing fence this runs to EOF —
                    # deliberate: "end of section" is itself heading-detected,
                    # and inside a fence nothing is a heading, so the rest of
                    # the document stays with this entry (lossless reading).
                    entry_lines.append(nxt)
                    if _fence_closes(nxt, *entry_fence):
                        entry_fence = None
                    i += 1
                    continue
                if not nxt.strip():
                    # Blank line(s): attach only if followed by an indented
                    # continuation; otherwise they are the section separator.
                    j = i
                    while j < n and not lines[j].strip():
                        j += 1
                    if j < n and INDENTED_RE.match(lines[j]):
                        entry_lines.extend(lines[i:j])
                        i = j
                        continue
                    break
                if ANY_HEADING_RE.match(nxt) or TOP_BULLET_RE.match(nxt):
                    # Break BEFORE the fence test: a column-0 `- ```py` is a
                    # sibling entry (whose own first line opens ITS fence).
                    break
                opened = _fence_open(nxt)
                if opened is not None:  # any indent — nested bullet fences too
                    entry_fence = opened
                    entry_lines.append(nxt)
                    i += 1
                    continue
                if INDENTED_RE.match(nxt):
                    entry_lines.append(nxt)
                    i += 1
                    continue
                # Top-level prose directly after entry content (no blank line
                # between): markdown lazy continuation — part of the entry.
                entry_lines.append(nxt)
                i += 1
            entry_text = "\n".join(entry_lines).rstrip()
            eid = len(entries)
            segments.append({"kind": "entry", "section": section, "id": eid, "lines": entry_lines})
            entries.append(
                {
                    "id": eid,
                    "section": section,
                    "heading": cur_heading,
                    "text": entry_text,
                    "marker_hint": classify_hint(entry_text),
                }
            )
            continue
        opened = _fence_open(line)
        if opened is not None:
            fence = opened  # any non-entry line (bullet or indented) may open a fence
        add_text([line])
        i += 1
    return segments, entries, next_section


def render(segments, skip_entry_ids=frozenset(), skip_sections=frozenset()) -> str:
    """Reassemble a document, dropping the named entries and emptied sections."""
    out = []
    for seg in segments:
        if seg["kind"] == "entry":
            if seg.get("id") in skip_entry_ids:
                continue
            out.extend(seg["lines"])
        elif seg["kind"] == "heading":
            if seg["section"] in skip_sections:
                continue
            out.append(seg["line"])
        else:  # text — section-internal text vanishes with its emptied section
            if seg["section"] is not None and seg["section"] in skip_sections:
                continue
            out.extend(seg["lines"])
    body = "\n".join(out).rstrip()
    return body + "\n" if body else ""


def _last_line(segments):
    for seg in reversed(segments):
        seg_lines = [seg["line"]] if seg["kind"] == "heading" else seg["lines"]
        if seg_lines:
            return seg_lines[-1]
    return None


def _norm_entry_text(lines):
    """Entry text normalized for trailing whitespace — the dedupe comparison."""
    return "\n".join(ln.rstrip() for ln in lines).rstrip()


def _insert_entries(segments, next_section, moved):
    """Insert moved entries into the archive's segment model. Returns
    ``(headings_created, deduped)``: identical existing headings are reused,
    and an entry whose normalized text already sits under the target heading
    is NOT appended again (``deduped`` — the crash-recovery re-run case)."""
    created = 0
    deduped = 0
    for entry in moved:  # document order — stable regardless of --ids order
        lines = entry["text"].split("\n")
        target = None
        for seg in segments:
            if seg["kind"] == "heading" and seg["line"].strip() == entry["heading"]:
                target = seg["section"]
                break
        if target is None:
            last = _last_line(segments)
            if last is not None and last.strip():
                segments.append({"kind": "text", "section": None, "lines": [""]})
            segments.append({"kind": "heading", "section": next_section, "line": entry["heading"]})
            segments.append({"kind": "text", "section": next_section, "lines": [""]})
            segments.append({"kind": "entry", "section": next_section, "lines": lines})
            next_section += 1
            created += 1
            continue
        if _norm_entry_text(lines) in {
            _norm_entry_text(seg["lines"])
            for seg in segments
            if seg["kind"] == "entry" and seg["section"] == target
        }:
            deduped += 1  # already archived (e.g. crash before the ledger write)
            continue
        insert_at = None
        for idx in range(len(segments) - 1, -1, -1):  # after the section's last entry
            if segments[idx]["kind"] == "entry" and segments[idx]["section"] == target:
                insert_at = idx + 1
                break
        if insert_at is None:  # heading with no entries yet
            for idx, seg in enumerate(segments):
                if seg["kind"] == "heading" and seg["section"] == target:
                    insert_at = idx + 1
                    nxt = segments[insert_at] if insert_at < len(segments) else None
                    if (
                        nxt is not None
                        and nxt["kind"] == "text"
                        and nxt["section"] == target
                        and not any(ln.strip() for ln in nxt["lines"])
                    ):
                        insert_at += 1  # keep the blank line after the heading
                    break
        segments.insert(insert_at, {"kind": "entry", "section": target, "lines": lines})
    return created, deduped


def _atomic_write(path: str, content: str) -> None:
    directory = os.path.dirname(os.path.abspath(path))
    os.makedirs(directory, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=directory, prefix=".deferred-ledger.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            fh.write(content)
        try:
            # mkstemp creates 0600; carry an existing target's mode so the
            # replace doesn't silently drop group/other bits from a user file.
            os.chmod(tmp, os.stat(path).st_mode & 0o7777)
        except OSError:
            pass  # fresh target (e.g. a new archive file): keep mkstemp's default
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def build_plan(ledger_path: str):
    if not os.path.isfile(ledger_path):
        return {"ledger_present": False, "ledger_sha256": None, "entries": []}
    with open(ledger_path, "rb") as fh:
        raw = fh.read()
    sha = hashlib.sha256(raw).hexdigest()
    text = raw.decode("utf-8")
    if not text.strip():
        return {"ledger_present": False, "ledger_sha256": sha, "entries": []}
    _segments, entries, _next = parse_document(text)
    return {
        "ledger_present": True,
        "ledger_sha256": sha,
        "entries": [
            {"id": e["id"], "heading": e["heading"], "text": e["text"],
             "marker_hint": e["marker_hint"]}
            for e in entries
        ],
    }


def do_archive(ledger_path: str, archive_path: str, ids, expect_sha: str):
    """Returns ``(result_dict, exit_code)``. No writes on any failure."""
    if not os.path.isfile(ledger_path):
        return {"error": f"ledger not found: {ledger_path}"}, 1
    with open(ledger_path, "rb") as fh:
        raw = fh.read()
    actual_sha = hashlib.sha256(raw).hexdigest()
    if actual_sha != expect_sha.strip().lower():
        return (
            {
                "error": "stale --expect-sha: ledger changed since planning (re-run `plan`)",
                "expected_sha": expect_sha,
                "actual_sha": actual_sha,
            },
            1,
        )
    segments, entries, _next = parse_document(raw.decode("utf-8"))
    known = {e["id"] for e in entries}
    wanted = sorted(set(ids))
    unknown = [i for i in wanted if i not in known]
    if unknown:
        return {"error": f"unknown entry id(s): {unknown}", "known_ids": sorted(known)}, 1
    move_set = set(wanted)
    moved = [e for e in entries if e["id"] in move_set]  # document order

    # Sections this move empties (a heading that had no entries to begin with
    # is left untouched — only emptied-by-the-move headings are dropped).
    totals, removed = {}, {}
    for e in entries:
        totals[e["section"]] = totals.get(e["section"], 0) + 1
    for e in moved:
        removed[e["section"]] = removed.get(e["section"], 0) + 1
    emptied = {sec for sec, total in totals.items() if removed.get(sec, 0) == total}

    new_ledger = render(segments, skip_entry_ids=move_set, skip_sections=emptied)

    if os.path.isfile(archive_path):
        with open(archive_path, "r", encoding="utf-8") as fh:
            a_segments, _a_entries, a_next = parse_document(fh.read())
    else:
        a_segments = [{"kind": "text", "section": None, "lines": [ARCHIVE_TITLE]}]
        a_next = 0
    created, deduped = _insert_entries(a_segments, a_next, moved)
    new_archive = render(a_segments)

    # Archive first: a crash between the two atomic writes can then only
    # duplicate an entry (it sits in both files), never lose one.
    _atomic_write(archive_path, new_archive)
    _atomic_write(ledger_path, new_ledger)
    return (
        {
            "moved": len(moved),
            "deduped": deduped,
            "headings_created": created,
            "headings_removed": len(emptied),
            "ledger_sha256_after": hashlib.sha256(new_ledger.encode("utf-8")).hexdigest(),
        },
        0,
    )


# --------------------------------------------------------------------------- #
# Self-test
# --------------------------------------------------------------------------- #
_LEDGER = """\
# Deferred Work

Intro prose that must survive archiving verbatim.

- intro bullet outside any `## Deferred from:` heading — NOT an entry

## Deferred from: code review of story-1-1 (2026-03-10)

- ✅ Tidy the legacy import shim [src/old.py:3]
- RESOLVED — bump the linter baseline [tooling/lint.cfg]
- Quarantine the flaky pre-existing test [tests/t.py:9]
  - nested: needs the CI quarantine label first
- Auth hardening: token portion resolved in story 1-4; remainder owned by story 2-1
- Improve the disclosed-config docs [docs/config.md]

## Deferred from: quick-dev of story-1-2 (2026-03-18)

- Addressed in story 1-5 — paginate the admin list [src/admin.py:77]
  follow-up note that travels with the entry
- Resolved in story 1-5 — that fix also closed the flaky pre-existing test [tests/t.py:9] above
- Done in story 1-6 — bump the dep,
lazy continuation line of the same entry
- Migration partially done in story 1-6; the data backfill is still open

## Notes

Free-form notes that must survive archiving untouched.
"""

_ARCHIVE_SEED = """\
# Deferred Work — Resolved

## Deferred from: code review of story-1-1 (2026-03-10)

- ✅ Previously archived entry [src/prev.py:1]
"""

_H1 = "## Deferred from: code review of story-1-1 (2026-03-10)"
_H2 = "## Deferred from: quick-dev of story-1-2 (2026-03-18)"

# F1 fixture: a column-0 fenced block inside an entry, whose body fakes a
# heading and a bullet, followed by a REAL sibling entry; plus a fenced block
# in the intro that fakes a `## Deferred from:` heading.
_FENCED_LEDGER = """\
# Deferred Work

Intro with a fenced example that must never become a section:

```md
## Deferred from: fake intro section (2026-01-01)
- not an entry, just fence content
```

## Deferred from: code review of story-2-1 (2026-04-02)

- Resolved in story 2-2 — repro snippet kept verbatim [src/repro.py:1]
```text
## fake heading inside the fence
- fake bullet inside the fence
```
  indented note after the fence
- Open follow-up: port the repro to the e2e suite [tests/e2e.py:4]

## Notes

Outside prose that must survive.
"""

_HF = "## Deferred from: code review of story-2-1 (2026-04-02)"


def _run_self_test():
    import contextlib
    import io

    failures = []

    def check(name, cond):
        if not cond:
            failures.append(name)

    def run_main(argv):
        buf = io.StringIO()
        try:  # capture stderr too: argparse usage noise is expected output here
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(io.StringIO()):
                code = main(argv)
        except SystemExit as exc:
            code = exc.code
        return code, buf.getvalue()

    def read(path):
        with open(path, "r", encoding="utf-8") as fh:
            return fh.read()

    with tempfile.TemporaryDirectory() as td:
        def fresh(name):
            p = os.path.join(td, name)
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(_LEDGER)
            return p

        # ---- plan: ids, headings, hint classification --------------------- #
        la = fresh("ledger-a.md")
        plan = build_plan(la)
        check("plan: ledger present", plan["ledger_present"] is True)
        check("plan: 9 entries (intro bullet excluded)", len(plan["entries"]) == 9)
        check("plan: ids are document order", [e["id"] for e in plan["entries"]] == list(range(9)))
        check("plan: heading attached", plan["entries"][0]["heading"] == _H1)
        check("plan: second section heading", plan["entries"][5]["heading"] == _H2)
        hints = [e["marker_hint"] for e in plan["entries"]]
        check("hint: leading checkmark => resolved", hints[0] == "resolved")
        check("hint: RESOLVED word => resolved", hints[1] == "resolved")
        check("hint: unmarked => open", hints[2] == "open")
        check("hint: resolved-in + remainder/portion => partial", hints[3] == "partial")
        check("hint: 'disclosed' does not read as 'closed'", hints[4] == "open")
        check("hint: addressed-in => resolved", hints[5] == "resolved")
        check("hint: resolved/closed, no remainder => resolved", hints[6] == "resolved")
        check("hint: done-in + lazy continuation => resolved", hints[7] == "resolved")
        check("hint: partially + still-open => partial", hints[8] == "partial")
        # The trap: entry 6 says it "closed the flaky pre-existing test" — that
        # vouches only for ITSELF; entry 2 (the flaky test) must stay open.
        check("hint: other entry vouching never resolves this one", hints[2] == "open")
        check("plan: nested bullet kept in text", "nested: needs the CI" in plan["entries"][2]["text"])
        check("plan: lazy continuation kept in text", "lazy continuation" in plan["entries"][7]["text"])

        # ---- archive: absent archive file gets created with a title ------- #
        arch_a = os.path.join(td, "resolved-a.md")
        res, code = do_archive(la, arch_a, [0, 0], plan["ledger_sha256"])  # dupes dedupe
        check("create: exit 0", code == 0)
        check("create: moved 1 (duplicate ids deduped)", res["moved"] == 1)
        check("create: nothing already archived", res["deduped"] == 0)
        check("create: one heading created", res["headings_created"] == 1)
        check("create: no heading removed", res["headings_removed"] == 0)
        arch_text = read(arch_a)
        check("create: archive starts with H1 title", arch_text.startswith(ARCHIVE_TITLE + "\n"))
        check("create: heading appended", _H1 in arch_text)
        check("create: entry moved in", "Tidy the legacy import shim" in arch_text)
        check("create: entry gone from ledger", "Tidy the legacy" not in read(la))
        check("create: sha-after matches disk",
              res["ledger_sha256_after"] == hashlib.sha256(read(la).encode("utf-8")).hexdigest())

        # ---- archive preserves the ledger's file mode (mkstemp is 0600) --- #
        import stat as _stat
        lm = fresh("ledger-mode.md")
        wide = _stat.S_IRUSR | _stat.S_IWUSR | _stat.S_IRGRP | _stat.S_IWGRP | _stat.S_IROTH
        os.chmod(lm, wide)
        pm = build_plan(lm)
        res, code = do_archive(lm, os.path.join(td, "resolved-mode.md"), [0], pm["ledger_sha256"])
        check("mode: exit 0", code == 0)
        check("mode: ledger mode preserved", os.stat(lm).st_mode & 0o7777 == wide)

        # ---- archive: multi-heading move, reuse + creation, emptied heading #
        lb = fresh("ledger-b.md")
        arch_b = os.path.join(td, "resolved-b.md")
        with open(arch_b, "w", encoding="utf-8") as fh:
            fh.write(_ARCHIVE_SEED)
        sha_b = build_plan(lb)["ledger_sha256"]
        res, code = do_archive(lb, arch_b, [7, 0, 6, 1, 5, 8], sha_b)  # shuffled ids
        check("move: exit 0", code == 0)
        check("move: moved 6", res["moved"] == 6)
        check("move: reused story-1-1 heading, created quick-dev", res["headings_created"] == 1)
        check("move: emptied quick-dev heading removed", res["headings_removed"] == 1)
        led = read(lb)
        check("move: ledger title preserved", led.startswith("# Deferred Work\n"))
        check("move: intro prose preserved", "Intro prose that must survive" in led)
        check("move: intro bullet preserved", "intro bullet outside any" in led)
        check("move: kept heading stays", _H1 in led)
        check("move: emptied heading dropped", _H2 not in led)
        check("move: open entry kept (with nested line)",
              "Quarantine the flaky" in led and "nested: needs the CI" in led)
        check("move: partial entry kept", "Auth hardening" in led)
        check("move: other open entry kept", "disclosed-config" in led)
        check("move: moved entries gone",
              "Tidy the legacy" not in led and "bump the linter" not in led
              and "lazy continuation" not in led)
        check("move: trailing non-deferral section untouched",
              "## Notes" in led and "Free-form notes that must survive" in led)
        check("move: sha-after matches disk",
              res["ledger_sha256_after"] == hashlib.sha256(led.encode("utf-8")).hexdigest())
        arch = read(arch_b)
        check("reuse: identical heading not duplicated", arch.count(_H1) == 1)
        check("reuse: appended after existing entries",
              arch.index("Previously archived") < arch.index("Tidy the legacy"))
        check("create: new heading appears once", arch.count(_H2) == 1)
        check("order: document order despite shuffled --ids",
              arch.index("Addressed in story 1-5")
              < arch.index("Done in story 1-6")
              < arch.index("Migration partially"))
        check("move: continuation lines travel",
              "follow-up note that travels" in arch and "lazy continuation line" in arch)

        # ---- idempotency: re-planning shows the entries gone -------------- #
        replan = build_plan(lb)
        check("replan: 3 entries remain", len(replan["entries"]) == 3)
        check("replan: ids renumbered in document order",
              [e["id"] for e in replan["entries"]] == [0, 1, 2])
        check("replan: hints open/partial/open",
              [e["marker_hint"] for e in replan["entries"]] == ["open", "partial", "open"])

        # ---- F1: fenced code blocks never split or truncate entries ------- #
        lf1 = os.path.join(td, "ledger-fenced.md")
        with open(lf1, "w", encoding="utf-8") as fh:
            fh.write(_FENCED_LEDGER)
        pf = build_plan(lf1)
        check("fence: exactly the two real entries", len(pf["entries"]) == 2)
        check("fence: intro fence never becomes a section",
              all(e["heading"] == _HF for e in pf["entries"]))
        e0 = pf["entries"][0]["text"] if len(pf["entries"]) == 2 else ""
        check("fence: fake heading stays inside the entry",
              "## fake heading inside the fence" in e0)
        check("fence: fake bullet stays inside the entry",
              "- fake bullet inside the fence" in e0)
        check("fence: continuation after the closing fence kept",
              "indented note after the fence" in e0)
        check("fence: sibling entry visible after the fence",
              len(pf["entries"]) == 2
              and "Open follow-up: port the repro" in pf["entries"][1]["text"])
        check("fence: hints unaffected by fence content",
              [e["marker_hint"] for e in pf["entries"]] == ["resolved", "open"])
        arch_f1 = os.path.join(td, "resolved-fenced.md")
        res, code = do_archive(lf1, arch_f1, [0], pf["ledger_sha256"])
        check("fence archive: exit 0, moved 1", code == 0 and res["moved"] == 1)
        led = read(lf1)
        check("fence archive: heading kept (sibling remains)", _HF in led)
        check("fence archive: sibling untouched", "Open follow-up: port the repro" in led)
        check("fence archive: intro fence preserved verbatim",
              "## Deferred from: fake intro section (2026-01-01)" in led)
        check("fence archive: moved entry fully gone",
              "repro snippet" not in led and "fake heading inside" not in led)
        arch_f1_text = read(arch_f1)
        check("fence archive: entry moved whole (fence + tail)",
              "## fake heading inside the fence" in arch_f1_text
              and "- fake bullet inside the fence" in arch_f1_text
              and "indented note after the fence" in arch_f1_text)
        aplan = build_plan(arch_f1)
        check("fence archive: archive re-parses as one whole entry",
              len(aplan["entries"]) == 1
              and "fake bullet inside the fence" in aplan["entries"][0]["text"])

        # ---- F1: fence close rules + unclosed fence runs to EOF ----------- #
        _segs, ents, _ = parse_document(
            _HF + "\n\n- fence closed by a longer fence\n```\nbody\n`````\n- sibling after close\n"
        )
        check("fence: longer same-char fence closes", len(ents) == 2)
        lf2 = os.path.join(td, "ledger-unclosed.md")
        with open(lf2, "w", encoding="utf-8") as fh:
            fh.write(
                "# Deferred Work\n\n"
                + _HF + "\n\n"
                "- Entry with an unclosed fence\n"
                "````\n"
                "~~~\n"  # wrong fence char: not a close
                "```\n"  # too short for a 4-backtick fence: not a close
                "## swallowed heading\n"
                "- swallowed bullet\n"
            )
        pu = build_plan(lf2)
        check("unclosed fence: single entry runs to EOF",
              len(pu["entries"]) == 1
              and "## swallowed heading" in pu["entries"][0]["text"]
              and "- swallowed bullet" in pu["entries"][0]["text"])

        # ---- a fence opened on the entry's OWN bullet line (`- ```py`) ----- #
        # Without tracking it, the closing line would read as an OPENER and the
        # sibling entry + everything to EOF would be swallowed into entry 0.
        _segs, ents, _ = parse_document(
            _HF + "\n\n"
            "- ```py\n"
            "  print('repro')\n"
            "  ```\n"
            "- Sibling entry still visible\n"
        )
        check("bullet fence: sibling survives", len(ents) == 2)
        check("bullet fence: fence body stays in entry 0",
              "print('repro')" in ents[0]["text"]
              and "Sibling entry" in ents[1]["text"])
        # Same shape in the intro (outside any section): the closing line must
        # not flip fence state and hide the real section heading that follows.
        _segs, ents, _ = parse_document(
            "# Deferred Work\n\n- ```\n  intro fence\n  ```\n\n"
            + _HF + "\n\n- Real entry\n"
        )
        check("intro bullet fence: section still parses", len(ents) == 1
              and "Real entry" in ents[0]["text"])
        # The SAME inversion at 1-3 spaces of indent (regression): a bullet
        # fence indented 1 space inside an entry, closed at 3 spaces. The old
        # column-0-only bullet-fence rule left the opener untracked while the
        # closer matched the opener regex — everything to EOF (live sibling,
        # next section, its entry) was swallowed into entry 0.
        _segs, ents, _ = parse_document(
            _HF + "\n\n"
            "- Entry with an indented bullet fence:\n"
            " - ```py\n"
            "   print('repro')\n"
            "   ```\n"
            "- Live sibling entry one\n\n"
            "## Deferred from: quick-dev (2026-03-20)\n\n"
            "- Live entry two\n"
        )
        check("indented bullet fence: all three entries survive", len(ents) == 3)
        check("indented bullet fence: fence body stays in entry 0",
              "print('repro')" in ents[0]["text"]
              and "Live sibling entry one" in ents[1]["text"]
              and "Live entry two" in ents[2]["text"])
        # And in the intro: ' - ```md' at indent 1 must not invert state and
        # hide the real heading that follows.
        _segs, ents, _ = parse_document(
            "# Deferred Work\n\n - ```md\n   intro fence\n   ```\n\n"
            + _HF + "\n\n- Real entry\n"
        )
        check("indented intro bullet fence: section still parses",
              len(ents) == 1 and "Real entry" in ents[0]["text"])
        # A NESTED bullet fence (indent >= 2, closer at the nested content
        # indent) is tracked too: its fenced fake bullet/heading stay inside
        # the entry and the sibling survives.
        _segs, ents, _ = parse_document(
            _HF + "\n\n"
            "- Entry with a nested fence:\n"
            "  - ```\n"
            "    - fake bullet in nested fence\n"
            "    ## fake heading in nested fence\n"
            "    ```\n"
            "- Sibling entry\n"
        )
        check("nested bullet fence: sibling survives, fakes stay inside",
              len(ents) == 2
              and "fake bullet in nested fence" in ents[0]["text"]
              and "fake heading in nested fence" in ents[0]["text"]
              and "Sibling entry" in ents[1]["text"])
        # An inline code SPAN is not a fence (CommonMark: a backtick fence's
        # info string may not contain backticks) — neither on a bullet line
        # nor on a continuation line.
        _segs, ents, _ = parse_document(
            _HF + "\n\n"
            "- ```fix``` the rendering bug\n"
            "  note: see ```render()``` for context\n"
            "- Sibling entry\n"
        )
        check("inline code span: not a fence, sibling survives",
              len(ents) == 2 and "Sibling entry" in ents[1]["text"])

        # ---- a DEEPER heading inside a section is structure, not a boundary - #
        _segs, ents, _ = parse_document(
            _HF + "\n\n"
            "- Entry before the subheading\n\n"
            "### context subheading\n\n"
            "- Entry after the subheading\n\n"
            "## Notes\n\n"
            "- not an entry (same-level heading closed the section)\n"
        )
        check("subheading: entries on both sides counted", len(ents) == 2)
        check("subheading: both attach to the deferral heading",
              all(e["heading"] == _HF for e in ents))
        lsub = os.path.join(td, "ledger-subheading.md")
        with open(lsub, "w", encoding="utf-8") as fh:
            fh.write(
                "# Deferred Work\n\n" + _HF + "\n\n"
                "- ✅ Resolved entry before the subheading\n\n"
                "### context subheading\n\n"
                "- Open entry after the subheading\n"
            )
        psub = build_plan(lsub)
        res, code = do_archive(lsub, os.path.join(td, "resolved-sub.md"), [0],
                               psub["ledger_sha256"])
        led_sub = read(lsub)
        check("subheading archive: open entry and subheading survive",
              code == 0 and "### context subheading" in led_sub
              and "Open entry after" in led_sub
              and "Resolved entry" not in led_sub)

        # ---- F2: crash-recovery re-run dedupes the archive ----------------- #
        lf3 = fresh("ledger-f2.md")
        arch_f3 = os.path.join(td, "resolved-f2.md")
        sha_f3 = build_plan(lf3)["ledger_sha256"]
        pre_crash = read(lf3)
        res, code = do_archive(lf3, arch_f3, [1], sha_f3)
        check("crash: first run inserts (no dedupe)", code == 0 and res["deduped"] == 0)
        # Simulate a crash between the archive write and the ledger write:
        # the entry sits in BOTH files and the ledger sha still matches.
        with open(lf3, "w", encoding="utf-8") as fh:
            fh.write(pre_crash)
        res, code = do_archive(lf3, arch_f3, [1], sha_f3)
        check("crash rerun: exit 0", code == 0)
        check("crash rerun: still reported moved", res["moved"] == 1)
        check("crash rerun: reported deduped", res["deduped"] == 1)
        check("crash rerun: no new heading", res["headings_created"] == 0)
        arch_f3_text = read(arch_f3)
        check("crash rerun: exactly one archived copy",
              arch_f3_text.count("bump the linter baseline") == 1)
        check("crash rerun: ledger entry removed", "bump the linter" not in read(lf3))
        # Dedupe match is trailing-whitespace-normalized.
        with open(lf3, "w", encoding="utf-8") as fh:
            fh.write(pre_crash)
        with open(arch_f3, "w", encoding="utf-8") as fh:
            fh.write(arch_f3_text.replace("baseline [tooling/lint.cfg]",
                                          "baseline [tooling/lint.cfg]  "))
        res, code = do_archive(lf3, arch_f3, [1], sha_f3)
        check("crash rerun: trailing-whitespace tolerant",
              code == 0 and res["deduped"] == 1
              and read(arch_f3).count("bump the linter baseline") == 1)

        # ---- refusals: stale sha, unknown id — no writes ------------------ #
        lc = fresh("ledger-c.md")
        arch_c = os.path.join(td, "resolved-c.md")
        before = read(lc)
        res, code = do_archive(lc, arch_c, [0], "0" * 64)
        check("stale sha: exit 1", code == 1 and "stale" in res["error"])
        check("stale sha: ledger untouched", read(lc) == before)
        check("stale sha: archive not created", not os.path.exists(arch_c))
        sha_c = build_plan(lc)["ledger_sha256"]
        res, code = do_archive(lc, arch_c, [0, 42], sha_c)
        check("unknown id: exit 1", code == 1 and "unknown" in res["error"])
        check("unknown id: ledger untouched", read(lc) == before)
        check("unknown id: archive not created", not os.path.exists(arch_c))

        # ---- absent / empty ledger ---------------------------------------- #
        gone = os.path.join(td, "no-such-ledger.md")
        p = build_plan(gone)
        check("absent: not present, no entries, null sha",
              p == {"ledger_present": False, "ledger_sha256": None, "entries": []})
        res, code = do_archive(gone, arch_c, [0], "0" * 64)
        check("absent: archive refuses", code == 1)
        empty = os.path.join(td, "empty.md")
        with open(empty, "w", encoding="utf-8") as fh:
            fh.write("\n\n")
        pe = build_plan(empty)
        check("empty: not present, no entries",
              pe["ledger_present"] is False and pe["entries"] == [])

        # ---- CLI surface ---------------------------------------------------#
        code, out = run_main(["plan", "--ledger", la])
        check("cli plan: exit 0 + valid JSON",
              code == 0 and json.loads(out)["ledger_present"] is True)
        code, _ = run_main([])
        check("cli: no sub-command => usage exit 2", code == 2)
        code, _ = run_main(["plan"])
        check("cli: plan without --ledger => exit 2", code == 2)
        code, _ = run_main(
            ["archive", "--ledger", lc, "--archive", arch_c, "--ids", "a,b", "--expect-sha", sha_c]
        )
        check("cli: malformed --ids => exit 2", code == 2)
        code, out = run_main(
            ["archive", "--ledger", lc, "--archive", arch_c, "--ids", "0", "--expect-sha", "0" * 64]
        )
        check("cli: stale sha => exit 1 + JSON error",
              code == 1 and "error" in json.loads(out))

    if failures:
        print("SELF-TEST FAILED:", ", ".join(failures), file=sys.stderr)
        return 1
    print("SELF-TEST PASSED (all assertions)")
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="auto-bmad Phase 8 deferred-work ledger mechanics (plan / archive)"
    )
    parser.add_argument("--self-test", action="store_true", help="run built-in fixtures and exit")
    sub = parser.add_subparsers(dest="cmd")
    p_plan = sub.add_parser("plan", help="read-only: parse the ledger into entries + marker hints")
    p_plan.add_argument("--ledger", required=True, help="path to the active deferred-work.md")
    p_arch = sub.add_parser("archive", help="atomically move chosen entries ledger -> archive")
    p_arch.add_argument("--ledger", required=True, help="path to the active deferred-work.md")
    p_arch.add_argument("--archive", required=True, help="path to deferred-work-resolved.md")
    p_arch.add_argument("--ids", required=True, help="comma-separated entry ids from `plan`")
    p_arch.add_argument("--expect-sha", required=True, help="`ledger_sha256` from `plan`")
    args = parser.parse_args(argv)

    if args.self_test:
        return _run_self_test()
    if args.cmd == "plan":
        print(json.dumps(build_plan(args.ledger), indent=2))
        return 0
    if args.cmd == "archive":
        try:
            ids = [int(token.strip()) for token in args.ids.split(",") if token.strip()]
            if not ids:
                raise ValueError
        except ValueError:
            parser.error("--ids must be a non-empty comma-separated list of integers")
        result, code = do_archive(args.ledger, args.archive, ids, args.expect_sha)
        print(json.dumps(result, indent=2))
        return code
    parser.error("a sub-command is required: plan | archive (or --self-test)")


if __name__ == "__main__":
    raise SystemExit(main())
