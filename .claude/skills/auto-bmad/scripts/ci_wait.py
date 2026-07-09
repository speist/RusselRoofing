#!/usr/bin/env python3
"""Deterministic CI wait + classification for auto-bmad's Phase 9 "CI link & wait".

Replaces the LLM-run ``gh pr checks`` polling loop (``git-and-pr.md`` -> "CI link &
wait") with one tested helper: poll ``gh pr checks`` until every check settles (capped),
classify the outcome, and optionally resolve the CI run URL for the pushed head SHA.

Usage:
    ci_wait.py --pr N --cap-minutes M [--interval-seconds 20] [--none-grace-seconds 120]
               [--repo-dir DIR] [--resolve-run-url --branch B --head-sha SHA]
    ci_wait.py --classify-json FILE|-     # pure classification of one payload; no polling
    ci_wait.py --self-test

Modes (ONE JSON object on stdout; polling mode adds exactly ONE progress line on stderr):

  * polling — runs ``gh pr checks N --json bucket,state,name`` (cwd = ``--repo-dir``
    when given) every ``--interval-seconds`` (default 20) until no check is
    pending/in_progress, capped at ``--cap-minutes`` (the sleep before the cap is
    truncated so a final poll lands on the cap boundary). Prints exactly one
    "waiting on CI (cap M min)…" line to stderr at start — stdout stays pure JSON.
    A poll with ZERO checks is held as pending until zero-checks has persisted for
    ``--none-grace-seconds`` (default 120) — the orchestrator calls this seconds
    after the push, before GitHub registers the check runs, so an early empty poll
    must not classify ``none``. A board that ever showed real checks is never
    ``none`` — mid-loop or at the cap — so a transient empty payload after real
    checks keeps polling instead of skipping draft clause 4; the cap clamps the
    grace (zero checks for the entire cap is a true ``none``, not a timeout).
    With ``--resolve-run-url``, after the wait it runs
    ``gh run list --branch B --limit 5 --json url,workflowName,status,headSha`` and
    picks the newest run (gh lists newest-first) whose ``headSha`` equals
    ``--head-sha``; no match / any gh hiccup there leaves ``ci_run_url: null``
    (the orchestrator has documented fallbacks for the link).
  * classify — ``--classify-json FILE|-``: pure classification of one
    ``gh pr checks --json bucket,state,name`` payload (a JSON array of checks);
    no polling, no gh calls. Checks still pending in the snapshot classify as
    ``timeout`` (the snapshot IS the cap), and zero checks classify ``none``
    directly — the registration grace applies only to the wait loop. A NON-empty
    payload containing no check objects is an exit-2 error, not a verdict.
  * ``--self-test`` — offline tests via an injectable runner + clock; no real gh calls.

Classification (shared by both modes), per check on ``bucket`` when it carries a known
token, else on the raw ``state`` — case-insensitive, so both gh's bucket vocabulary
(pass/fail/pending/skipping/cancel) and raw GitHub states (SUCCESS/FAILURE/…) work:
  failed  — ANY check in {fail, failure, cancelled, cancel, timed_out, action_required}
  passed  — ALL checks in {pass, success, neutral, skipped, skipping}
  none    — zero checks reported (or gh says "no checks reported"); in polling
            mode only once zero-checks has outlasted the registration grace
  timeout — cap reached with checks still pending/in_progress and none failed
            (a failure already on the board at the cap classifies ``failed``;
            unknown tokens count as pending, so the cap bounds them)

``gh pr checks`` exits non-zero on failed (1) or pending (8) checks — a non-zero exit
with parseable JSON on stdout is a verdict, never an invocation error.

Output JSON (keys fixed):
    {"ci_status": "passed"|"failed"|"timeout"|"none", "elapsed_seconds": int,
     "polls": int, "pending": [names…], "failed_checks": [names…],
     "ci_run_url": str|null}
The ``ci_status`` vocabulary is PINNED — ``state_plan.py --finalize`` and the state
schema (``state-and-resume.md``) consume it verbatim; do not invent values.

Exit codes: 0 = any resolved classification (failed/timeout are verdicts, not errors —
they feed draft-predicate clause 4); 2 = usage error, or gh missing / gh invocation
error on the FIRST checks call (the orchestrator treats that as "couldn't evaluate
CI", not as failed CI). After a first good poll, transient gh errors are tolerated
and polling continues against the last good payload until the cap; a missing gh
binary is fatal at any point.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Callable, Sequence

# Per-check vocabulary (covers gh's computed `bucket` AND raw GitHub `state`/conclusion
# strings — compared lowercase). Anything not matched counts as pending: the cap bounds it.
_FAILED_TOKENS = {"fail", "failure", "cancelled", "cancel", "timed_out", "action_required"}
_PASSED_TOKENS = {"pass", "success", "neutral", "skipped", "skipping"}
_PENDING_TOKENS = {"pending", "in_progress", "queued", "waiting", "expected", "requested"}

# The PINNED output schema (see docstring) — self-test asserts both modes emit exactly this.
_OUTPUT_KEYS = {"ci_status", "elapsed_seconds", "polls", "pending", "failed_checks", "ci_run_url"}

# runner(argv, cwd) -> (returncode, stdout, stderr); injectable for the self-test.
Runner = Callable[[Sequence[str], "str | None"], "tuple[int, str, str]"]


def _gh_runner(argv: Sequence[str], cwd: str | None = None) -> tuple[int, str, str]:
    """The real runner: execute gh and capture output. FileNotFoundError propagates."""
    p = subprocess.run(list(argv), capture_output=True, text=True, cwd=cwd)
    return p.returncode, p.stdout or "", p.stderr or ""


# --- pure classification ---

def _check_verdict(check: dict) -> str:
    """Classify ONE check -> failed|passed|pending, on bucket when it carries a known
    token, else on raw state (both vocabularies accepted, case-insensitive)."""
    for key in ("bucket", "state"):
        tok = check.get(key)
        if tok is None or not str(tok).strip():
            continue
        t = str(tok).strip().lower()
        if t in _FAILED_TOKENS:
            return "failed"
        if t in _PASSED_TOKENS:
            return "passed"
        if t in _PENDING_TOKENS:
            return "pending"
        # unknown token under this key: fall through and try the other vocabulary
    return "pending"  # unknown everywhere => treat as still-running; the cap bounds it


def classify(checks: list) -> dict:
    """Classify a full ``gh pr checks --json`` payload. Pure.

    Returns ``{"status": none|failed|passed|pending, "pending": [names],
    "failed_checks": [names]}``. ANY failed check dominates (even with others still
    pending); ``pending`` beats ``passed``; zero checks is ``none``.
    """
    pending: list[str] = []
    failed: list[str] = []
    for c in checks:
        if not isinstance(c, dict):
            continue
        name = str(c.get("name") or "<unnamed>")
        verdict = _check_verdict(c)
        if verdict == "failed":
            failed.append(name)
        elif verdict == "pending":
            pending.append(name)
    if not checks:
        status = "none"
    elif failed:
        status = "failed"
    elif pending:
        status = "pending"
    else:
        status = "passed"
    return {"status": status, "pending": pending, "failed_checks": failed}


def classify_payload_text(text: str) -> tuple[dict, int]:
    """--classify-json core: one payload -> (output dict, exit code). Pure, no gh.

    Still-pending checks classify as ``timeout`` (a snapshot has no more polling to
    do — the snapshot is the cap). Accepts the raw array or ``{"checks": [...]}``;
    a non-empty array with zero check objects is an exit-2 error, never a verdict.
    """
    try:
        data = json.loads(text)
    except (ValueError, TypeError) as e:
        return {"error": f"--classify-json payload is not valid JSON: {e}"}, 2
    if isinstance(data, dict) and isinstance(data.get("checks"), list):
        data = data["checks"]
    if not isinstance(data, list):
        return {"error": "--classify-json payload must be a JSON array of checks "
                         "(the `gh pr checks --json bucket,state,name` output)"}, 2
    if data and not any(isinstance(c, dict) for c in data):
        # Non-empty but zero check objects: malformed input, not a "passed" verdict
        # (and not "none" — that's reserved for a genuinely empty board).
        return {"error": "--classify-json payload has no check objects "
                         "(array items must be JSON objects)"}, 2
    res = classify(data)
    status = "timeout" if res["status"] == "pending" else res["status"]
    return {
        "ci_status": status,
        "elapsed_seconds": 0,
        "polls": 0,
        "pending": res["pending"],
        "failed_checks": res["failed_checks"],
        "ci_run_url": None,
    }, 0


# --- polling ---

def fetch_checks(pr: int, runner: Runner, repo_dir: str | None = None
                 ) -> tuple[list | None, str | None, bool]:
    """One ``gh pr checks`` call -> ``(checks, error, fatal)``.

    A non-zero gh exit with parseable JSON on stdout is a VERDICT (gh exits 1 on
    failed / 8 on pending checks), never an error. gh's "no checks reported" stderr
    message maps to an empty list (=> ``none``). ``fatal`` is True only when the gh
    binary itself is missing/unrunnable — that can't heal mid-loop.
    """
    argv = ["gh", "pr", "checks", str(pr), "--json", "bucket,state,name"]
    try:
        rc, out, err = runner(argv, repo_dir)
    except FileNotFoundError:
        return None, "gh not found on PATH (install the GitHub CLI, or run in git mode 'local')", True
    except OSError as e:
        return None, f"could not run gh: {e}"[:300], True
    data = None
    if out and out.strip():
        try:
            data = json.loads(out)
        except (ValueError, TypeError):
            data = None
    if isinstance(data, list):
        return [c for c in data if isinstance(c, dict)], None, False
    if "no checks" in (err or "").lower():  # "no checks reported on the '…' branch"
        return [], None, False
    detail = (err or out or "").strip()[:300] or "no output"
    return None, f"gh pr checks failed (exit {rc}): {detail}", False


def wait_for_checks(
    pr: int,
    cap_minutes: float,
    interval_seconds: float,
    runner: Runner,
    monotonic: Callable[[], float] = time.monotonic,
    sleep: Callable[[float], None] = time.sleep,
    repo_dir: str | None = None,
    err_stream=sys.stderr,
    none_grace_seconds: float = 120.0,
) -> tuple[dict, int]:
    """Poll until no check is pending/in_progress, capped -> (output dict, exit code).

    Exactly ONE progress line goes to ``err_stream``; the returned dict is the full
    pinned output schema (``ci_run_url`` is None here — main() overwrites it when
    ``--resolve-run-url`` is requested). Exit code 2 only for a first-call gh error
    or a missing gh binary; every resolved classification is 0. Zero-checks polls
    count as pending until they persist for ``none_grace_seconds`` (see docstring).
    """
    cap_disp = int(cap_minutes) if float(cap_minutes).is_integer() else cap_minutes
    err_stream.write(f"waiting on CI (cap {cap_disp} min)…\n")
    err_stream.flush()

    start = monotonic()
    deadline = start + float(cap_minutes) * 60.0
    polls = 0
    last: dict | None = None  # last good classification (for the cap-time verdict)
    none_since: float | None = None  # start of the current zero-checks streak
    saw_checks = False  # any poll ever returned real checks (cap-time none vs timeout)

    while True:
        checks, fetch_err, fatal = fetch_checks(pr, runner, repo_dir)
        polls += 1
        if fetch_err is not None and (fatal or polls == 1):
            return {"error": fetch_err}, 2
        now = monotonic()
        if fetch_err is None:
            last = classify(checks)
            if last["status"] == "none":
                # Registration grace: zero checks right after the push usually means
                # GitHub hasn't registered the check runs yet — keep polling until
                # zero-checks has persisted past the grace window. A board that ever
                # showed real checks is never "none" (same rule as the cap verdict):
                # a transient-empty streak after real checks keeps polling to the cap.
                if none_since is None:
                    none_since = now
                if now - none_since >= float(none_grace_seconds) and not saw_checks:
                    status = "none"
                    break
            else:
                none_since = None  # real checks appeared: the grace logic ends
                saw_checks = True
                if not last["pending"]:
                    status = last["status"]  # failed | passed (pending list is empty)
                    break
        if now >= deadline:
            # Cap reached with checks unsettled: zero checks for the ENTIRE run is a
            # true "none" (the cap clamps the grace) — but a board that ever showed
            # real checks is NOT none (a transient empty payload near the cap must
            # not fake a check-less repo); there, a failure in the LAST good poll is
            # a verdict ("failed" — ANY-failed dominates), otherwise it's a timeout
            # (which fires the same draft clause, so an earlier-seen failure that a
            # final empty poll wiped from `last` still drafts).
            if last is not None and last["status"] == "none" and not saw_checks:
                status = "none"
            elif last and last["failed_checks"]:
                status = "failed"
            else:
                status = "timeout"
            break
        sleep(min(float(interval_seconds), deadline - now))

    if last is None:  # unreachable in practice (a first-call error returned above)
        last = {"pending": [], "failed_checks": []}
    return {
        "ci_status": status,
        "elapsed_seconds": int(round(monotonic() - start)),
        "polls": polls,
        "pending": list(last["pending"]),
        "failed_checks": list(last["failed_checks"]),
        "ci_run_url": None,
    }, 0


# --- run-url resolution ---

def resolve_run_url(branch: str, head_sha: str, runner: Runner,
                    repo_dir: str | None = None) -> str | None:
    """Pick the newest workflow run on ``branch`` whose headSha == ``head_sha``.

    ``gh run list`` returns newest-first, so the first sha match wins. Any gh
    failure (missing binary, non-zero exit, unparseable output) or no match
    returns None — the orchestrator has documented fallbacks; this is never fatal.
    """
    argv = ["gh", "run", "list", "--branch", branch, "--limit", "5",
            "--json", "url,workflowName,status,headSha"]
    try:
        rc, out, _err = runner(argv, repo_dir)
    except (FileNotFoundError, OSError):
        return None
    if rc != 0 or not out.strip():
        return None
    try:
        runs = json.loads(out)
    except (ValueError, TypeError):
        return None
    if not isinstance(runs, list):
        return None
    for run in runs:  # newest-first => first match is the newest
        if isinstance(run, dict) and run.get("headSha") == head_sha and run.get("url"):
            return str(run["url"])
    return None


# --- self-test (injectable runner + clock; no real gh calls) ---

class _FakeRunner:
    """Scripted (rc, stdout, stderr) responses; the LAST one repeats. An Exception raises."""

    def __init__(self, responses):
        self.responses = list(responses)
        self.calls: list = []

    def __call__(self, argv, cwd=None):
        self.calls.append((list(argv), cwd))
        resp = self.responses.pop(0) if len(self.responses) > 1 else self.responses[0]
        if isinstance(resp, Exception):
            raise resp
        return resp


class _FakeClock:
    def __init__(self):
        self.t = 0.0

    def monotonic(self) -> float:
        return self.t

    def sleep(self, seconds: float) -> None:
        self.t += seconds


def _run_self_test() -> int:
    import io

    # --- classify(): every outcome + both vocabularies ---
    assert classify([]) == {"status": "none", "pending": [], "failed_checks": []}
    ok = classify([{"bucket": "pass", "name": "build"}, {"bucket": "skipping", "name": "lint"},
                   {"state": "NEUTRAL", "name": "optional"}])
    assert ok["status"] == "passed" and not ok["pending"] and not ok["failed_checks"], ok
    # raw state vocabulary (no bucket), case-insensitive: SUCCESS/TIMED_OUT/ACTION_REQUIRED
    bad = classify([{"state": "SUCCESS", "name": "a"}, {"state": "TIMED_OUT", "name": "b"},
                    {"state": "ACTION_REQUIRED", "name": "c"}])
    assert bad["status"] == "failed" and bad["failed_checks"] == ["b", "c"], bad
    # mixed buckets in one payload: ANY failure dominates, pending is still reported
    mx = classify([{"bucket": "cancel", "name": "e2e"}, {"state": "in_progress", "name": "deploy"},
                   {"bucket": "pass", "name": "unit"}])
    assert mx["status"] == "failed" and mx["pending"] == ["deploy"] and mx["failed_checks"] == ["e2e"], mx
    pend = classify([{"bucket": "pending", "name": "build"}, {"state": "QUEUED", "name": "lint"}])
    assert pend["status"] == "pending" and pend["pending"] == ["build", "lint"], pend
    # unknown tokens => pending (the cap bounds them); bucket wins when known, else state
    assert classify([{"bucket": "wat", "state": "wat2", "name": "x"}])["status"] == "pending"
    assert _check_verdict({"bucket": "pending", "state": "SUCCESS"}) == "pending"  # known bucket wins
    assert _check_verdict({"bucket": "???", "state": "SUCCESS"}) == "passed"       # unknown bucket -> state

    pending_payload = json.dumps([{"bucket": "pending", "name": "build"}])
    passed_payload = json.dumps([{"bucket": "pass", "name": "build"}])
    failed_payload = json.dumps([{"bucket": "fail", "name": "build"}, {"bucket": "pass", "name": "lint"}])

    # --- polling: passes after one pending poll; gh exit 8 (pending) is NOT an error ---
    clk, errs = _FakeClock(), io.StringIO()
    run = _FakeRunner([(8, pending_payload, ""), (0, passed_payload, "")])
    res, code = wait_for_checks(7, 1, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                repo_dir="/repo", err_stream=errs)
    assert code == 0 and res["ci_status"] == "passed", res
    assert res["polls"] == 2 and res["elapsed_seconds"] == 20, res
    assert res["pending"] == [] and res["failed_checks"] == [] and res["ci_run_url"] is None, res
    assert set(res) == _OUTPUT_KEYS, res  # pinned output schema
    # single-stderr-line discipline: exactly ONE progress line, nothing per-poll
    assert errs.getvalue() == "waiting on CI (cap 1 min)…\n", repr(errs.getvalue())
    assert all(cwd == "/repo" for _, cwd in run.calls)  # --repo-dir plumbed through
    assert run.calls[0][0][:4] == ["gh", "pr", "checks", "7"], run.calls[0]
    assert "--json" in run.calls[0][0] and "bucket,state,name" in run.calls[0][0], run.calls[0]

    # --- timeout via the fake clock: cap 1 min @ 20s => polls at t=0,20,40,60 ---
    clk, errs = _FakeClock(), io.StringIO()
    run = _FakeRunner([(8, pending_payload, "")])
    res, code = wait_for_checks(7, 1, 20, run, monotonic=clk.monotonic, sleep=clk.sleep, err_stream=errs)
    assert code == 0 and res["ci_status"] == "timeout", res
    assert res["polls"] == 4 and res["elapsed_seconds"] == 60, res
    assert res["pending"] == ["build"] and res["failed_checks"] == [], res
    assert errs.getvalue().count("\n") == 1, repr(errs.getvalue())

    # --- failure already on the board when the cap hits => failed, not timeout ---
    clk = _FakeClock()
    mixed = json.dumps([{"bucket": "fail", "name": "unit"}, {"bucket": "pending", "name": "e2e"}])
    run = _FakeRunner([(8, mixed, "")])
    res, code = wait_for_checks(7, 1, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "failed", res
    assert res["failed_checks"] == ["unit"] and res["pending"] == ["e2e"], res

    # --- resolved failure (nothing pending) ends immediately, exit 0 (verdict = deliverable) ---
    clk = _FakeClock()
    run = _FakeRunner([(1, failed_payload, "")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "failed" and res["polls"] == 1, res
    assert res["elapsed_seconds"] == 0 and res["failed_checks"] == ["build"], res

    # --- zero checks & the registration grace (default 120s): an empty poll right
    # after the push is registration lag, NOT "none" ---
    # (a) empty -> pending -> pass: the grace holds the early empty poll => passed
    clk = _FakeClock()
    run = _FakeRunner([(1, "", "no checks reported on the 'story/1-2' branch"),
                       (8, pending_payload, ""), (0, passed_payload, "")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "passed" and res["polls"] == 3, res
    # (b) empty for the whole grace => none only once it expires (polls at t=0..120 @ 20s)
    clk = _FakeClock()
    run = _FakeRunner([(0, "[]", "")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "none", res
    assert res["polls"] == 7 and res["elapsed_seconds"] == 120, res
    assert res["pending"] == [] and res["failed_checks"] == [], res
    # (c) grace >= cap: the cap clamps the grace — zero checks for the ENTIRE cap is a
    # true none, not a timeout (cap 1 min @ 20s, grace 600 => polls at t=0,20,40,60)
    clk = _FakeClock()
    run = _FakeRunner([(1, "", "no checks reported on the 'story/1-2' branch")])
    res, code = wait_for_checks(7, 1, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO(), none_grace_seconds=600)
    assert code == 0 and res["ci_status"] == "none", res
    assert res["polls"] == 4 and res["elapsed_seconds"] == 60, res
    # (d) a board that ever showed real checks is never "none" at the cap: pending@0,20
    # then empty@40,60 with cap 1 min => timeout (a transient empty payload near the
    # cap must not fake a check-less repo and skip the draft clause)
    clk = _FakeClock()
    run = _FakeRunner([(8, pending_payload, ""), (8, pending_payload, ""),
                       (0, "[]", ""), (0, "[]", "")])
    res, code = wait_for_checks(7, 1, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "timeout", res
    assert res["polls"] == 4 and res["elapsed_seconds"] == 60, res
    # (e) the mid-loop grace obeys the same rule as the cap: a board that ever showed
    # real checks is never "none" (empty@0, pending@20, then empty from t=40 with
    # grace 60 and cap 2 min => the streak expiring at t=100 must NOT break with
    # "none" and skip draft clause 4 — the loop runs to the cap and times out)
    clk = _FakeClock()
    run = _FakeRunner([(0, "[]", ""), (8, pending_payload, ""), (0, "[]", "")])
    res, code = wait_for_checks(7, 2, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO(), none_grace_seconds=60)
    assert code == 0 and res["ci_status"] == "timeout", res
    assert res["polls"] == 7 and res["elapsed_seconds"] == 120, res
    # grace 0 disables the hold: immediate none on the first empty poll
    run = _FakeRunner([(0, "[]", "")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=_FakeClock().monotonic,
                                sleep=lambda s: None, err_stream=io.StringIO(),
                                none_grace_seconds=0)
    assert code == 0 and res["ci_status"] == "none" and res["polls"] == 1, res

    # --- gh missing / gh error on the FIRST call => exit 2 with {"error": ...} ---
    run = _FakeRunner([FileNotFoundError("gh")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=_FakeClock().monotonic,
                                sleep=lambda s: None, err_stream=io.StringIO())
    assert code == 2 and "gh not found" in res["error"], res
    run = _FakeRunner([(4, "", "HTTP 401: Bad credentials")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=_FakeClock().monotonic,
                                sleep=lambda s: None, err_stream=io.StringIO())
    assert code == 2 and "exit 4" in res["error"] and "Bad credentials" in res["error"], res

    # --- transient gh error AFTER a good first poll is tolerated; polling continues ---
    clk = _FakeClock()
    run = _FakeRunner([(8, pending_payload, ""), (4, "", "HTTP 502"), (0, passed_payload, "")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 0 and res["ci_status"] == "passed" and res["polls"] == 3, res
    # ...but a vanishing gh binary is fatal at any point
    clk = _FakeClock()
    run = _FakeRunner([(8, pending_payload, ""), FileNotFoundError("gh")])
    res, code = wait_for_checks(7, 30, 20, run, monotonic=clk.monotonic, sleep=clk.sleep,
                                err_stream=io.StringIO())
    assert code == 2 and "gh not found" in res["error"], res

    # --- run-url resolution: newest match by headSha (gh lists newest-first) ---
    runs_payload = json.dumps([
        {"url": "https://gh/runs/3", "workflowName": "ci", "status": "in_progress", "headSha": "beef"},
        {"url": "https://gh/runs/2", "workflowName": "ci", "status": "completed", "headSha": "cafe"},
        {"url": "https://gh/runs/1", "workflowName": "ci", "status": "completed", "headSha": "cafe"},
    ])
    run = _FakeRunner([(0, runs_payload, "")])
    assert resolve_run_url("story/1-2", "cafe", run, repo_dir="/repo") == "https://gh/runs/2"
    argv, cwd = run.calls[0]
    assert argv[:3] == ["gh", "run", "list"] and cwd == "/repo", run.calls[0]
    assert argv[argv.index("--branch") + 1] == "story/1-2", argv
    assert argv[argv.index("--limit") + 1] == "5", argv
    assert argv[argv.index("--json") + 1] == "url,workflowName,status,headSha", argv
    assert resolve_run_url("b", "beef", _FakeRunner([(0, runs_payload, "")])) == "https://gh/runs/3"
    # fallbacks: no sha match / gh failure / missing binary / junk output => None, never fatal
    assert resolve_run_url("b", "0000", _FakeRunner([(0, runs_payload, "")])) is None
    assert resolve_run_url("b", "cafe", _FakeRunner([(1, "", "boom")])) is None
    assert resolve_run_url("b", "cafe", _FakeRunner([FileNotFoundError("gh")])) is None
    assert resolve_run_url("b", "cafe", _FakeRunner([(0, "not json", "")])) is None

    # --- --classify-json core: snapshot classification, no polling ---
    res, code = classify_payload_text(json.dumps([{"bucket": "pass", "name": "a"}]))
    assert code == 0 and res["ci_status"] == "passed", res
    assert res["polls"] == 0 and res["elapsed_seconds"] == 0 and res["ci_run_url"] is None, res
    assert set(res) == _OUTPUT_KEYS, res  # pinned output schema in classify mode too
    res, code = classify_payload_text(json.dumps([{"state": "FAILURE", "name": "a"},
                                                  {"bucket": "pending", "name": "b"}]))
    assert code == 0 and res["ci_status"] == "failed" and res["pending"] == ["b"], res
    res, code = classify_payload_text("[]")
    assert code == 0 and res["ci_status"] == "none", res
    res, code = classify_payload_text(json.dumps([{"bucket": "pending", "name": "a"}]))
    assert code == 0 and res["ci_status"] == "timeout" and res["pending"] == ["a"], res  # snapshot cap
    res, code = classify_payload_text('{"checks": [{"bucket": "pass", "name": "a"}]}')
    assert code == 0 and res["ci_status"] == "passed", res
    res, code = classify_payload_text("not json")
    assert code == 2 and "error" in res, res
    res, code = classify_payload_text('"a string"')
    assert code == 2 and "error" in res, res
    # non-empty payload with ZERO check objects => exit 2 ("couldn't evaluate CI"),
    # never a "passed" verdict; a stray non-object beside real checks stays tolerated
    res, code = classify_payload_text('["oops", 42]')
    assert code == 2 and "no check objects" in res["error"], res
    res, code = classify_payload_text('[{"bucket": "pass", "name": "a"}, "stray"]')
    assert code == 0 and res["ci_status"] == "passed", res

    print("SELF-TEST PASSED (all assertions)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Deterministic CI wait + classification for auto-bmad Phase 9."
    )
    parser.add_argument("--self-test", action="store_true", help="Run internal tests and exit.")
    parser.add_argument("--pr", type=int, help="PR number to poll with `gh pr checks`.")
    parser.add_argument("--cap-minutes", type=float,
                        help="Max total wait in minutes (git.ci_wait_minutes).")
    parser.add_argument("--interval-seconds", type=float, default=20.0,
                        help="Seconds between polls (default 20).")
    parser.add_argument("--none-grace-seconds", type=float, default=120.0,
                        help="Hold a zero-checks poll as pending until zero-checks has "
                             "persisted this long (default 120; the cap clamps it). "
                             "Covers the push -> check-registration lag.")
    parser.add_argument("--repo-dir", help="Working directory for the gh calls.")
    parser.add_argument("--resolve-run-url", action="store_true",
                        help="Also resolve ci_run_url via `gh run list` (needs --branch + --head-sha).")
    parser.add_argument("--branch", help="Branch for --resolve-run-url.")
    parser.add_argument("--head-sha", help="Pushed head SHA for --resolve-run-url.")
    parser.add_argument("--classify-json", metavar="FILE|-",
                        help="Classify one `gh pr checks --json` payload (file or '-' for stdin); no polling.")
    args = parser.parse_args()

    if args.self_test:
        return _run_self_test()

    def usage_error(msg: str) -> int:
        print(json.dumps({"error": msg}, indent=2))
        return 2

    if args.classify_json:
        if args.pr is not None or args.resolve_run_url:
            return usage_error("--classify-json is exclusive; it takes no --pr / --resolve-run-url")
        if args.classify_json == "-":
            text = sys.stdin.read()
        else:
            path = Path(args.classify_json)
            if not path.is_file():
                return usage_error(f"--classify-json file not found: {path}")
            text = path.read_text(encoding="utf-8")
        result, code = classify_payload_text(text)
        print(json.dumps(result, indent=2))
        return code

    if args.pr is None or args.cap_minutes is None:
        return usage_error("polling mode requires --pr and --cap-minutes "
                           "(or use --classify-json / --self-test)")
    if args.resolve_run_url and not (args.branch and args.head_sha):
        return usage_error("--resolve-run-url requires --branch and --head-sha")
    if args.cap_minutes < 0 or args.interval_seconds <= 0:
        return usage_error("--cap-minutes must be >= 0 and --interval-seconds must be > 0")
    if args.none_grace_seconds < 0:
        return usage_error("--none-grace-seconds must be >= 0")

    result, code = wait_for_checks(args.pr, args.cap_minutes, args.interval_seconds,
                                   _gh_runner, repo_dir=args.repo_dir,
                                   none_grace_seconds=args.none_grace_seconds)
    if code != 0:
        print(json.dumps(result, indent=2))
        return code
    if args.resolve_run_url:
        # After the wait, so the run has had time to register; any miss stays null
        # (the orchestrator has documented fallbacks for the link).
        result["ci_run_url"] = resolve_run_url(args.branch, args.head_sha, _gh_runner, args.repo_dir)
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
