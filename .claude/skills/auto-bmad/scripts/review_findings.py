#!/usr/bin/env python3
"""Deterministic reader for a story file's ``### Review Findings`` section.

The code-review step is supposed to persist its triage into the story file as
``[Review][Patch]`` / ``[Review][Decision]`` / ``[Review][Defer]`` bullets. The
downstream Phase 7 loop (the human decision-ask and the fix delegate) reads
*that section*, not the reviewer's chat report — so when the skill silently runs
in its ``no-spec`` mode (story file never bound as the spec), it reports findings
to chat while the section stays empty and the loop fixes nothing.

This script lets the orchestrator reconcile what the reviewer *claimed* against
what is actually in the file, deterministically (no LLM re-read). It parses the
``### Review Findings`` section and counts each triage type by checked state.

The *rendering* of those bullets (a `[ ]`/`[x]` checkbox, ``**bold**``/``__emphasis__``
around the tag, a trailing `[Med]` severity) is owned by the upstream
``bmad-code-review`` skill and produced by a non-deterministic LLM, so the parser
keys only on the semantic ``[Review][Type]`` tag and treats everything around it
as optional. A finding with no checkbox counts as ``open`` (the safe default).
The section heading is matched at any level ``#``–``####``, and the section ends
only at a heading of the SAME level or shallower — a deeper heading (e.g.
``#### Patches`` grouping bullets under a ``###`` section) is internal structure
and its findings keep counting.

The parser also reads the optional **severity tag** directly after the type —
``[Review][Patch][High]`` (the auto-bmad triage contract) or the upstream
``[Patch] [Med]`` spacing — and buckets the OPEN, NON-DEFERRED bullets into
``open_severity`` (``critical/high/medium/low/untagged``) plus the scalar
``open_crit_high``. This is what lets Phase 7's convergence rule ("no
non-deferred Critical/High") gate on the file instead of the reviewer's chat
counts; an ``untagged`` finding should be treated as Critical/High by the
caller (conservative — the triage prompt mandates tagging, so it is rare).

It also reconciles the durable, cross-story deferral ledger
(``{implementation_artifacts}/deferred-work.md``): the code-review step is
supposed to append every ``[Review][Defer]`` finding there under a
``## Deferred from: …`` heading, but auto-bmad's delegation prompt historically
emphasized only the story-file section, so that side-effect got dropped. With
``--deferred-work-file`` the gate confirms each defer finding in the story
actually reached the ledger.

Dependency-free. Output is a single JSON object on stdout.

Fenced code blocks (``` or ~~~) are tracked with the SAME grammar as
``deferred_ledger.py`` (the self-test pins the two patterns equal): a fenced
``- [ ] [Review][Patch]`` example is literal content, never a phantom finding,
and a fenced ``## …`` never ends the section or fakes a ledger heading.

Usage:
    review_findings.py --story-file PATH [--expect-min N] [--baseline M]
                       [--deferred-work-file PATH [--story-key KEY]]
    review_findings.py --self-test

With ``--expect-min N`` the process also exits non-zero (and sets
``reconciled: false``) when the section is absent or has gained fewer than N
bullets since ``--baseline M`` (default 0) — pass the reviewer's reported
finding count as N, and the section's total from a run of this script taken
BEFORE the pass as M. The section accumulates bullets across review
iterations, so gating on the raw total would let iteration 1's bullets
vacuously satisfy iteration 2's persistence claim; the baseline scopes the
gate to what THIS pass actually wrote. ``--expect-min 0`` reconciles even when
the section is absent: a perfectly clean pass may legitimately write no
section, so absence matches the claim.

With ``--deferred-work-file PATH`` the process additionally fails reconciliation
when the ledger holds fewer ``## Deferred from:`` bullets than the story has
``[Review][Defer]`` findings. Pass ``--story-key KEY`` to scope the ledger count
to this story's heading (the ledger is append-only across stories, so an unscoped
count is trivially satisfied once history accumulates).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys

# `### Review Findings` at any level 1-4 (tolerant of trailing text/whitespace,
# case-insensitive). The captured hashes give the section's level: the section
# ends only at a heading of the SAME level or shallower — a DEEPER heading is
# internal structure (the triage LLM sometimes groups bullets under e.g.
# `#### Patches`) and must not truncate the count.
HEADING_RE = re.compile(r"^(?P<level>#{1,4})\s+review\s+findings\b", re.IGNORECASE)
# Any ATX heading at level 1-4 — a section-end candidate (level-aware: see
# _heading_level; only same-or-shallower headings actually close a section).
ANY_HEADING_RE = re.compile(r"^#{1,4}\s+\S")


def _heading_level(line):
    """Number of leading ``#`` on a line ``ANY_HEADING_RE`` matched."""
    return len(line) - len(line.lstrip("#"))
# A triage bullet. The semantic signal is the `[Review][Type]` tag; the rendering
# around it is owned by the upstream `bmad-code-review` skill and produced by a
# non-deterministic LLM, so match flexibly. All of these count as one finding:
#   - [ ] [Review][Patch] ...        (checkbox form)
#   * [x] [Review][Defer] ...        (checked checkbox)
#   - **[Review][Decision] [Med]** ..(bold prose, no checkbox — real BMAD output)
#   - __[Review][Patch]__ ...        (underscore emphasis)
# The checkbox is OPTIONAL: when absent the finding defaults to `open` (the safe
# state — an unmarked finding is one still needing attention). Bold/emphasis
# markers (`**`/`__`) before the tag are tolerated and ignored.
BULLET_RE = re.compile(
    r"^\s*[-*+]\s+"                  # list bullet
    r"(?:\[(?P<mark>[ xX])\]\s+)?"   # optional checkbox (open/checked state)
    r"(?:\*\*|__)?\s*"               # optional bold/emphasis marker
    r"\[Review\]\[(?P<type>Patch|Decision|Defer)\]"
    # Optional severity tag, only directly after the type — `[Patch][High]` (the
    # auto-bmad triage contract) or `[Patch] [Med]` / `**…** [Med]` / a
    # bold-wrapped `[Patch] **[High]**` (upstream bold-prose renderings; the
    # emphasis marker may sit on either side of the space). Anchored here so a
    # later location bracket (`[src/app.py:42]`) can never be misread as a
    # severity — the alternation only admits the five severity words.
    r"(?:\s*(?:\*\*|__)?\s*\[(?P<sev>(?i:critical|high|med|medium|low))\])?",
)
# Normalize severity spellings to the canonical four buckets.
SEVERITY_CANON = {"critical": "critical", "high": "high", "med": "medium",
                  "medium": "medium", "low": "low"}
# A ledger section heading: `## Deferred from: code review of story-3.3 (2026-03-18)`.
DEFER_HEADING_RE = re.compile(r"^#{1,4}\s+deferred\s+from:", re.IGNORECASE)
# A ledger ENTRY bullet: top-level (column 0) only — the same entry grammar as
# deferred_ledger.py, so the Phase 7 reconciliation count and the Phase 8 plan
# count agree on one file. Indented bullets are entry continuations, not entries.
LEDGER_BULLET_RE = re.compile(r"^[-*+]\s+\S")

# Fenced code blocks — the SAME grammar as deferred_ledger.py (the self-test
# asserts the two patterns are identical, the lockstep pattern from
# config_plan.py): a fence opens on a line whose content — at any indent,
# optionally right after a single bullet marker — starts with 3+ backticks or
# tildes, and closes on a later line with the same char, at least as many, any
# indent, nothing else. While inside a fence NO line is a heading or a bullet:
# a fenced `- [ ] [Review][Patch]` example is literal content, never a phantom
# finding; a fenced `## …` never truncates the section or fakes a ledger heading.
# (Backtick branch: no later backtick on the line, so inline code spans —
# ```x``` — never read as fence openers.)
FENCE_OPEN_RE = re.compile(r"^\s*(?:[-*+]\s+)?(`{3,}(?!.*`)|~{3,})")


def _fence_open(line):
    """Return ``(char, length)`` if ``line`` opens a fence, else ``None``."""
    m = FENCE_OPEN_RE.match(line)
    return (m.group(1)[0], len(m.group(1))) if m else None


def _fence_closes(line, char, length):
    """True if ``line`` closes a fence opened with ``length`` × ``char``."""
    return bool(re.match(r"^\s*%s{%d,}\s*$" % (re.escape(char), length), line))


def _empty_counts():
    return {t: {"open": 0, "checked": 0} for t in ("patch", "decision", "defer")}


def _empty_severity():
    return {"critical": 0, "high": 0, "medium": 0, "low": 0, "untagged": 0}


def parse_deferred_work(text: str, story_key=None):
    """Count deferral bullets in the ledger under ``## Deferred from:`` headings.

    Returns ``(present, count)``. ``present`` is True if any ``## Deferred from:``
    heading exists at all. When ``story_key`` is given, only bullets under a
    heading whose text contains that key (case-insensitive) are counted — the
    ledger is append-only across stories, so scoping keeps the count meaningful.
    """
    present = False
    count = 0
    counting = False
    block_level = 0  # level of the current `## Deferred from:` heading
    fence = None
    for raw in text.splitlines():
        if fence is not None:
            # Inside a fenced code block: never a heading, never an entry.
            if _fence_closes(raw, *fence):
                fence = None
            continue
        if DEFER_HEADING_RE.match(raw):
            present = True
            counting = story_key is None or story_key.lower() in raw.lower()
            block_level = _heading_level(raw)
            continue
        if ANY_HEADING_RE.match(raw):
            # A heading at the block's level or shallower closes it; a DEEPER
            # heading is internal structure and the block stays open (the same
            # rule as deferred_ledger.py's parse_document — one entry grammar).
            if counting and _heading_level(raw) > block_level:
                continue
            counting = False
            continue
        if LEDGER_BULLET_RE.match(raw):
            # A top-level entry bullet — which may itself open a fence
            # (`- ```py`), exactly as in deferred_ledger.py's entry grammar.
            if counting:
                count += 1
            fence = _fence_open(raw)
            continue
        opened = _fence_open(raw)
        if opened is not None:
            fence = opened
        # Indented lines (incl. nested bullets) are entry continuations.
    return present, count


def parse_section(text: str):
    """Return (section_present, by_type-counts, open_severity) for the section.

    ``open_severity`` buckets only the OPEN, NON-DEFERRED bullets (Patch +
    Decision — the findings that drive the convergence rule); a bullet with no
    severity tag lands in ``untagged`` so the orchestrator can treat it
    conservatively. Checked and Defer bullets never count here.
    """
    lines = text.splitlines()
    by_type = _empty_counts()
    open_severity = _empty_severity()
    in_section = False
    section_level = 0  # set when the section heading is found
    section_present = False
    fence = None
    for raw in lines:
        if fence is not None:
            # Inside a fenced code block: a fenced `### Review Findings` /
            # `## …` is literal content (never opens or closes the section)
            # and a fenced `- [ ] [Review][…]` example is never a finding.
            if _fence_closes(raw, *fence):
                fence = None
            continue
        opened = _fence_open(raw)
        if opened is not None:
            fence = opened
            continue
        if not in_section:
            m = HEADING_RE.match(raw)
            if m:
                in_section = True
                section_present = True
                section_level = len(m.group("level"))
            continue
        # Inside the section: a heading at the section's own level or
        # shallower ends it; a DEEPER heading (`#### Patches` under a `###`
        # section) is internal grouping and its bullets keep counting.
        if ANY_HEADING_RE.match(raw) and _heading_level(raw) <= section_level:
            break
        m = BULLET_RE.match(raw)
        if not m:
            continue
        ftype = m.group("type").lower()
        checked = m.group("mark") in ("x", "X")
        by_type[ftype]["checked" if checked else "open"] += 1
        if not checked and ftype in ("patch", "decision"):
            sev = m.group("sev")
            open_severity[SEVERITY_CANON[sev.lower()] if sev else "untagged"] += 1
    return section_present, by_type, open_severity


def build_result(story_file: str, expect_min, deferred_work_file=None, story_key=None,
                 baseline=0):
    result = {
        "story_file": story_file,
        "section_present": False,
        "total": 0,
        "baseline": baseline,
        "new_since_baseline": 0,
        "by_type": _empty_counts(),
        "open_patch": 0,
        "open_decision": 0,
        "open_defer": 0,
        "open_nondeferred": 0,
        "open_severity": _empty_severity(),
        "open_crit_high": 0,
        "deferred_work_file": deferred_work_file,
        "deferred_work_present": False,
        "deferred_work_logged": 0,
        "deferred_work_expected": 0,
        "reconciled": True,
        "expect_min": expect_min,
        "error": None,
    }

    if not os.path.isfile(story_file):
        result["error"] = f"story file not found: {story_file}"
        result["reconciled"] = expect_min in (None, 0)
        return result

    with open(story_file, "r", encoding="utf-8") as fh:
        text = fh.read()

    section_present, by_type, open_severity = parse_section(text)
    total = sum(c["open"] + c["checked"] for c in by_type.values())
    story_defer = by_type["defer"]["open"] + by_type["defer"]["checked"]
    result.update(
        {
            "section_present": section_present,
            "total": total,
            "new_since_baseline": max(total - baseline, 0),
            "by_type": by_type,
            "open_patch": by_type["patch"]["open"],
            "open_decision": by_type["decision"]["open"],
            "open_defer": by_type["defer"]["open"],
            "open_nondeferred": by_type["patch"]["open"] + by_type["decision"]["open"],
            "open_severity": open_severity,
            "open_crit_high": open_severity["critical"] + open_severity["high"],
            "deferred_work_expected": story_defer,
        }
    )

    section_ok = True
    if expect_min is not None:
        # A perfectly clean pass (expect_min 0) may legitimately write no
        # `### Review Findings` section at all — absence then matches the claim.
        # Any positive claim still requires the section to exist. The claim is
        # gated on the bullets NEW since ``baseline`` (the section's total
        # before this pass) — the section accumulates across iterations, so the
        # raw total would let a prior pass's bullets vacuously satisfy a later
        # pass's persistence claim.
        new_total = total - baseline
        section_ok = new_total >= expect_min if section_present else expect_min == 0

    # Ledger reconciliation: every story defer finding must reach deferred-work.md.
    ledger_ok = True
    if deferred_work_file is not None:
        if os.path.isfile(deferred_work_file):
            with open(deferred_work_file, "r", encoding="utf-8") as fh:
                ledger_present, logged = parse_deferred_work(fh.read(), story_key)
        else:
            ledger_present, logged = False, 0
        result["deferred_work_present"] = ledger_present
        result["deferred_work_logged"] = logged
        ledger_ok = logged >= story_defer

    result["reconciled"] = section_ok and ledger_ok
    return result


# --------------------------------------------------------------------------- #
# Self-test
# --------------------------------------------------------------------------- #
_WITH_FINDINGS = """\
# Story 1-2

## Tasks / Subtasks

- [x] Build the thing

### Review Findings

- [ ] [Review][Decision] Token TTL — pick 15m vs 60m, affects UX
- [ ] [Review][Patch][High] Null deref on empty list [src/app.py:42]
- [ ] [Review][Patch] [Low] Off-by-one in pager [src/page.py:13]
- [x] [Review][Defer][Critical] Pre-existing flaky test [tests/t.py:9] — deferred

## Dev Notes

Not a finding: [Review][Patch] mentioned in prose should not count.
"""

# Real `bmad-code-review` output: bold-prose bullets, no checkboxes, optional
# severity tag — plus one already-checked item and one underscore-emphasis item.
# The gate must count all of these and default the un-checkboxed ones to `open`.
_WITH_BOLD_FINDINGS = """\
# Story 1-4

### Review Findings

- **[Review][Decision] [Med]** Token TTL — pick 15m vs 60m, affects UX
- **[Review][Patch] [Low]** Null deref on empty list [src/app.py:42]
- [x] **[Review][Patch]** Off-by-one already fixed this pass [src/page.py:13]
- __[Review][Defer]__ Pre-existing flaky test [tests/t.py:9]

## Dev Notes

Not a finding: **[Review][Patch]** mentioned in prose should not count.
"""

_NO_SECTION = """\
# Story 1-3

## Tasks / Subtasks

- [x] Build the thing

## Dev Notes

Nothing was persisted here.
"""

# Ledger that logged the one defer finding from story 1-2, plus an older story's.
_LEDGER_WITH_DEFER = """\
# Deferred Work

## Deferred from: code review of story-1-1 (2026-03-10)

- Tidy the legacy import shim [src/old.py:3] — pre-existing

## Deferred from: code review of story-1-2 (2026-03-18)

- Pre-existing flaky test [tests/t.py:9] — deferred, not caused by this change
"""

# Ledger missing story 1-2's defer entirely (only the older story present).
_LEDGER_MISSING_DEFER = """\
# Deferred Work

## Deferred from: code review of story-1-1 (2026-03-10)

- Tidy the legacy import shim [src/old.py:3] — pre-existing
"""


def _run_self_test():
    import tempfile

    failures = []

    def check(name, cond):
        if not cond:
            failures.append(name)

    def write(text):
        f = tempfile.NamedTemporaryFile("w", suffix=".md", delete=False)
        f.write(text)
        f.close()
        return f.name

    p1 = write(_WITH_FINDINGS)
    r1 = build_result(p1, None)
    check("section detected", r1["section_present"] is True)
    check("total counts 4 bullets", r1["total"] == 4)
    check("two open patches", r1["open_patch"] == 2)
    check("one open decision", r1["open_decision"] == 1)
    check("defer checked not open", r1["by_type"]["defer"]["checked"] == 1 and r1["open_defer"] == 0)
    check("prose mention excluded", r1["by_type"]["patch"]["open"] == 2)
    check("no expect-min => reconciled", r1["reconciled"] is True)
    # Severity: adjacent [High], spaced [Low], untagged decision; the deferred
    # [Critical] must NOT reach open_crit_high (deferral is a logged human call).
    check("severity: adjacent [High] counted", r1["open_severity"]["high"] == 1)
    check("severity: spaced [Low] counted", r1["open_severity"]["low"] == 1)
    check("severity: untagged decision counted", r1["open_severity"]["untagged"] == 1)
    check("severity: deferred Critical excluded", r1["open_crit_high"] == 1)
    check("open_nondeferred = open patch+decision", r1["open_nondeferred"] == 3)
    # A location bracket right after an untagged type must not read as severity.
    ploc = write("### Review Findings\n\n- [ ] [Review][Patch] [src/app.py:42] title\n")
    check("severity: location bracket not misread", build_result(ploc, None)["open_severity"]["untagged"] == 1)
    os.unlink(ploc)

    # A bold-wrapped severity AFTER the space (`[Patch] **[High]**`) must not
    # read as untagged (untagged is treated as Crit/High and forces iterations).
    pbold = write("### Review Findings\n\n- [ ] [Review][Patch] **[High]** title\n")
    rbold = build_result(pbold, None)
    check("severity: bold after space counted", rbold["open_severity"]["high"] == 1
          and rbold["open_severity"]["untagged"] == 0)
    os.unlink(pbold)

    # expect-min satisfied / shortfall.
    check("expect-min 4 ok", build_result(p1, 4)["reconciled"] is True)
    check("expect-min 5 shortfall", build_result(p1, 5)["reconciled"] is False)

    # --baseline scopes expect-min to THIS pass's new bullets: with 4 bullets
    # all from a prior iteration (baseline 4), a pass claiming 2 persisted
    # nothing new => NOT reconciled; the raw total must not vacuously satisfy it.
    r_base = build_result(p1, 2, baseline=4)
    check("baseline: stale bullets don't satisfy the claim",
          r_base["reconciled"] is False and r_base["new_since_baseline"] == 0)
    check("baseline: delta satisfies the claim",
          build_result(p1, 2, baseline=2)["reconciled"] is True)
    check("baseline: 0 keeps iteration-1 behavior",
          build_result(p1, 4, baseline=0)["reconciled"] is True)

    # Fenced examples are literal content: the fenced finding bullet is never a
    # phantom finding, the fenced `## heading` doesn't end the section (the real
    # finding after the fence still counts), and a fenced `### Review Findings`
    # in another section never opens it.
    pfence = write(
        "# Story 1-5\n\n"
        "## Dev Notes\n\n"
        "```md\n"
        "### Review Findings\n"
        "- [ ] [Review][Patch] fenced example, not a finding\n"
        "```\n\n"
        "### Review Findings\n\n"
        "- [ ] [Review][Patch][High] real finding one\n"
        "- ```md\n"
        "  - [ ] [Review][Patch] fenced inside a bullet fence\n"
        "  ## fenced heading must not end the section\n"
        "  ```\n"
        "- [ ] [Review][Decision] real finding two, after the fence\n"
    )
    rf = build_result(pfence, None)
    check("fence: phantom findings excluded, real ones kept",
          rf["total"] == 2 and rf["open_patch"] == 1 and rf["open_decision"] == 1)
    check("fence: fenced heading doesn't truncate the section",
          rf["open_nondeferred"] == 2)
    os.unlink(pfence)

    # Heading levels: the section heading is accepted at any level 1-4, and a
    # DEEPER heading inside the section (`#### Patches` under `###`) is internal
    # grouping — its bullets keep counting; only a same-or-shallower heading
    # (`## Dev Notes`) ends the section.
    psub = write(
        "# Story 1-6\n\n"
        "### Review Findings\n\n"
        "- [ ] [Review][Patch][High] before any subheading\n\n"
        "#### Patches\n\n"
        "- [ ] [Review][Patch] [Low] grouped under a subheading\n\n"
        "#### Decisions\n\n"
        "- [ ] [Review][Decision] also grouped\n"
        "- [x] [Review][Defer] grouped defer\n\n"
        "## Dev Notes\n\n"
        "- [ ] [Review][Patch] after the section ended — not a finding\n"
    )
    rs = build_result(psub, None)
    check("subheadings: grouped findings all counted", rs["total"] == 4)
    check("subheadings: severities reach the gate",
          rs["open_crit_high"] == 1 and rs["open_severity"]["low"] == 1)
    check("subheadings: shallower heading still ends the section",
          rs["open_patch"] == 2 and rs["by_type"]["defer"]["checked"] == 1)
    os.unlink(psub)
    ph1 = write("# Review Findings\n\n- [ ] [Review][Patch] H1-rendered section\n")
    rh1 = build_result(ph1, None)
    check("H1 section heading detected", rh1["section_present"] is True and rh1["total"] == 1)
    os.unlink(ph1)
    ph4 = write(
        "#### Review Findings\n\n- [ ] [Review][Patch] inside\n\n"
        "#### Next section\n\n- [ ] [Review][Patch] outside\n"
    )
    check("same-level heading ends a #### section", build_result(ph4, None)["total"] == 1)
    os.unlink(ph4)

    # Ledger side: fenced bullets under a `## Deferred from:` heading are
    # content, not entries — they must not inflate deferred_work_logged (the
    # defer-reached-the-ledger gate would pass vacuously); nested bullets are
    # continuations, not extra entries (deferred_ledger.py's entry grammar).
    led_fenced = write(
        "# Deferred Work\n\n"
        "## Deferred from: code review of story-1-2 (2026-03-18)\n\n"
        "- Real deferral entry\n"
        "  - nested continuation bullet, not an entry\n"
        "  ```md\n"
        "  - fenced bullet, not an entry\n"
        "  ```\n"
    )
    r_ledf = build_result(p1, None, led_fenced, "story-1-2")
    check("ledger fence: one real entry counted", r_ledf["deferred_work_logged"] == 1)
    check("ledger fence: reconciled on the real entry", r_ledf["reconciled"] is True)
    os.unlink(led_fenced)

    # Lockstep with deferred_ledger.py: ONE fence grammar owns this file format.
    import importlib.util as _ilu
    _dl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "deferred_ledger.py")
    _spec = _ilu.spec_from_file_location("deferred_ledger", _dl_path)
    assert _spec is not None and _spec.loader is not None, _dl_path
    _dl = _ilu.module_from_spec(_spec)
    _spec.loader.exec_module(_dl)
    check("lockstep: fence-open pattern equals deferred_ledger.py's",
          _dl.FENCE_OPEN_RE.pattern == FENCE_OPEN_RE.pattern)
    _close_probe = [("```", "`", 3), ("   ````", "`", 3), ("~~~", "~", 3),
                    ("``` trailing", "`", 3), ("````", "`", 4), ("\t```", "`", 3)]
    check("lockstep: fence-close rule equals deferred_ledger.py's",
          all(_fence_closes(s, c, n) == _dl._fence_closes(s, c, n)
              for s, c, n in _close_probe))

    # Ledger side of the same rule: a deeper heading inside a `## Deferred
    # from:` block is internal structure — entries after it still count; a
    # same-level heading closes the block. Pinned against deferred_ledger.py's
    # parse_document so the Phase 7 and Phase 8 counts stay one grammar.
    _led_sub_text = (
        "# Deferred Work\n\n"
        "## Deferred from: code review of story-1-2 (2026-03-18)\n\n"
        "- entry before the subheading\n\n"
        "### context\n\n"
        "- entry after the subheading\n\n"
        "## Notes\n\n"
        "- not an entry (same-level heading closed the block)\n"
    )
    led_sub = write(_led_sub_text)
    check("ledger subheading: entries on both sides counted",
          build_result(p1, None, led_sub, "story-1-2")["deferred_work_logged"] == 2)
    check("lockstep: subheading entry count equals deferred_ledger.py's",
          len(_dl.parse_document(_led_sub_text)[1]) == 2)
    os.unlink(led_sub)

    # Bold-prose / no-checkbox rendering (real BMAD output) must count the same.
    pb = write(_WITH_BOLD_FINDINGS)
    rb = build_result(pb, None)
    check("bold: section detected", rb["section_present"] is True)
    check("bold: total counts 4 bullets", rb["total"] == 4)
    check("bold: no-checkbox decision => open", rb["open_decision"] == 1)
    check("bold: one open + one checked patch", rb["open_patch"] == 1 and rb["by_type"]["patch"]["checked"] == 1)
    check("bold: underscore-emphasis defer => open", rb["open_defer"] == 1)
    check("bold: prose mention in other section excluded", rb["by_type"]["patch"]["open"] == 1)
    check("bold: expect-min 4 reconciled (was the false-fail)", build_result(pb, 4)["reconciled"] is True)
    check("bold: [Med] normalized to medium", rb["open_severity"]["medium"] == 1)
    check("bold: open low counted", rb["open_severity"]["low"] == 1)
    check("bold: checked patch excluded from severity", rb["open_severity"]["untagged"] == 0)
    check("bold: no crit/high", rb["open_crit_high"] == 0)
    os.unlink(pb)

    # Ledger reconciliation: p1 has one [Review][Defer] finding (story 1-2).
    led_ok = write(_LEDGER_WITH_DEFER)
    led_missing = write(_LEDGER_MISSING_DEFER)
    r_led = build_result(p1, None, led_ok, "story-1-2")
    check("ledger present detected", r_led["deferred_work_present"] is True)
    check("ledger expects 1 defer", r_led["deferred_work_expected"] == 1)
    check("ledger scoped count 1", r_led["deferred_work_logged"] == 1)
    check("ledger satisfied => reconciled", r_led["reconciled"] is True)
    # Same ledger, wrong story key => that story's deferral isn't logged.
    check(
        "ledger scoped to absent key => NOT reconciled",
        build_result(p1, None, led_ok, "story-9-9")["reconciled"] is False,
    )
    # Defer finding never reached the ledger.
    r_miss = build_result(p1, None, led_missing, "story-1-2")
    check("ledger missing defer logged 0", r_miss["deferred_work_logged"] == 0)
    check("ledger missing defer => NOT reconciled", r_miss["reconciled"] is False)
    # Ledger file absent but a defer exists => NOT reconciled.
    check(
        "ledger file absent + defer => NOT reconciled",
        build_result(p1, None, "/no/such-ledger.md", "story-1-2")["reconciled"] is False,
    )
    # Unscoped count tolerates history (counts all `## Deferred from:` bullets).
    check("ledger unscoped counts all", build_result(p1, None, led_ok, None)["deferred_work_logged"] == 2)
    for p in (led_ok, led_missing):
        os.unlink(p)

    p2 = write(_NO_SECTION)
    r2 = build_result(p2, None)
    check("no section flagged", r2["section_present"] is False)
    check("no section total 0", r2["total"] == 0)
    check("no section, no expectation => reconciled", r2["reconciled"] is True)
    # The failure the gate must catch: reviewer claimed findings, file has none.
    check("no section + expect 3 => NOT reconciled", build_result(p2, 3)["reconciled"] is False)
    # A perfectly clean pass: reviewer claims 0 persisted and wrote no section.
    check("no section + expect 0 => reconciled (clean pass)", build_result(p2, 0)["reconciled"] is True)

    # Missing file with an expectation is a reconciliation failure.
    check("missing file + expect 1 => NOT reconciled", build_result("/no/such.md", 1)["reconciled"] is False)
    check("missing file no expectation => reconciled", build_result("/no/such.md", None)["reconciled"] is True)

    for p in (p1, p2):
        os.unlink(p)

    if failures:
        print("SELF-TEST FAILED:", ", ".join(failures), file=sys.stderr)
        return 1
    print("SELF-TEST PASSED (all assertions)")
    return 0


def main(argv=None):
    parser = argparse.ArgumentParser(description="auto-bmad review-findings reader")
    parser.add_argument("--story-file", help="path to the story markdown file")
    parser.add_argument(
        "--expect-min",
        type=int,
        default=None,
        help="reviewer's reported finding count THIS pass; exit 1 if the file "
             "gained fewer bullets than this since --baseline",
    )
    parser.add_argument(
        "--baseline",
        type=int,
        default=0,
        help="the section's total bullet count BEFORE this pass (capture it by "
             "running this script pre-review); --expect-min gates on the delta",
    )
    parser.add_argument(
        "--deferred-work-file",
        default=None,
        help="path to deferred-work.md; exit 1 if it holds fewer deferrals than the story",
    )
    parser.add_argument(
        "--story-key",
        default=None,
        help="scope the ledger count to this story's `## Deferred from:` heading",
    )
    parser.add_argument("--self-test", action="store_true", help="run built-in fixtures and exit")
    args = parser.parse_args(argv)

    if args.self_test:
        return _run_self_test()

    if not args.story_file:
        parser.error("--story-file is required (or use --self-test)")
    if args.baseline < 0:
        parser.error("--baseline must be >= 0")

    result = build_result(
        args.story_file, args.expect_min, args.deferred_work_file, args.story_key,
        args.baseline,
    )
    print(json.dumps(result, indent=2))
    return 0 if result["reconciled"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
