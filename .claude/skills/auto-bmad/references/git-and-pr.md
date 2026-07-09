# Git & PR conventions

- All git work is performed by the **orchestrator directly** — never delegated (see "Ownership" below).
- Nothing ever lands on the base branch.
- Every phase is its own commit — so the pipeline is resumable and reviewable.

## Ownership

This file is the single source for everything the orchestrator owns directly (does not delegate to an `ab-*` profile) — other docs link here by name instead of restating the list.

Orchestrator-owned, never delegated:

- git preflight, branching, every per-phase commit, push, PR open.
- the Phase 9 **pre-push report write + commit** (`docs(story-{e}-{s}): pipeline report`) — the story-level report file is written and committed *before* push, so it ships in the PR diff.
- the **CI wait** + draft conversion — when `git.offer_merge` is on.
- the Phase 9 **BMAD-level status flip** on a clean completion (story file `Status:` + `sprint-status.yaml` → `done`).
- the Phase 9 **merge prompt + `gh pr merge` execution** — opt-in via `git.offer_merge` (default on), only on a clean completion.
- the Phase 7 **HITL-halt handling**:
  - detect external-review changes — a git-only check, never a code read.
  - commit them (`fix(story-{e}-{s}): external review changes`).
  - re-open the halt after the re-review.
  - the **re-review of those changes is delegated**, NOT orchestrator-owned — the normal code-review fan-out, full reviewer roster (see `pipeline.md` Phase 7 step 4).
- **epic mode** (`/auto-bmad epic`) owns the same git set at **epic scope**:
  - one `epic/{e}-{slug}` branch, the E0 base-readiness guard (git-only), the per-story commits on that branch, the batch BMAD-status flip, and the epic-anchor finalize.
  - epic mode has **no review halt** — `[Review][Decision]` findings are auto-resolved with the triage's recommendation, and an unconverged review ships a draft (no `AskUserQuestion`).
  - details: "Epic mode" below + `epic-pipeline.md`.

These stay orchestrator-owned because it already holds the full pipeline context. The **only** exception is the `inline` delegation tier (host with no subagent mechanism — see `delegation-runtime.md`), where the orchestrator runs *every* step itself.

## Mode detection (Phase 0)

- Evaluated by `scripts/preflight.py`.
- The orchestrator reads its JSON (`git.is_repo`, `git.base_branch`, `git.mode`, `git.tree_clean`/`dirty_files_count`) — never re-derives these in shell.
- The rules below are the normative definition the script implements:

- **Is it a git repo?** `git rev-parse --is-inside-work-tree`.
  - Not a repo → hard-stop (suggest `git init`).
- **Base branch** — store as `git.base_branch`:
  - the remote HEAD if present (`git symbolic-ref refs/remotes/origin/HEAD`);
  - else the current branch at start (commonly `main`/`master`).
- **Git mode:**
  - **`remote`** if `gh` is installed (`gh --version`), authenticated (`gh auth status`), AND a GitHub remote exists (`git remote -v` shows a github.com origin).
  - **`local`** otherwise.
- **Working tree must be clean at start** (`git status --porcelain` empty):
  - dirty AND on the base branch or an unrelated branch → hard-stop ("commit or stash first").
  - dirty on the correct story branch during a resume → fine; the in-flight phase will commit it.

## Branching (Phase 1)
- Branch name: `{git.branch_prefix}{e}-{s}-{slug}` (default prefix `story/`), e.g. `story/1-2-user-auth`.
  - Slug = the story-key title part (already kebab-case).
- Create it explicitly off base — `git switch -c <branch> <base_branch>`.
  - NEVER a bare `git switch -c <branch>` — because preflight allows a clean tree on an unrelated branch, and a bare `-c` would branch off it, leaking foreign commits into the PR.
  - On resume → `git switch <branch>` if it already exists.
- Never `commit`/`push` to the base branch.

## Commits (between phases)
- Use Conventional Commits, **in full** — never subject-only (see "Message body & footer"):
  - a `type(scope): subject` line;
  - **plus a body** (required on every commit);
  - **plus a footer** when relevant.
- Scope is the story or epic: `story-{e}-{s}` or `epic-{e}`.
- Type per phase (see `pipeline.md` for the exact strings):
  - `chore` — pipeline start, review-passed checkpoint, Phase 9 finalize (mark done + BMAD status)
  - `test` — TEA scaffolds/coverage, epic test design
  - `docs` — story creation, epic-end docs (gate/context/retro), Phase 9 pipeline report
  - `feat` — story implementation
  - `fix` — addressing code-review findings
- **The state update folds into the phase's commit — never standalone.**
  - A phase mutates the project artifacts *and* the auto-bmad state file (`<output_folder>/auto-bmad/state/{key}.yaml`); stage **both together** and make a **single** commit.
  - A phase with a documented multi-commit flow folds the state write into each such commit — Phase 7's per-iteration commits, Phase 8's separate remediation commit.
    - The rule is *no state-only commits*, not one-commit-per-phase-number.
  - **Never** emit a standalone bookkeeping commit whose only change is the state file — no `chore(story-{e}-{s}): record Phase N in pipeline state`, no `chore(...): update state/timestamps`.
  - Worked example: `pipeline.md` Phase 7's trace commit.
- **Recording each commit's own sha can't happen inside that same commit** — the sha doesn't exist yet.
  - So do **not** chase it with a second commit.
  - Append the just-made phase commit's short sha to `commits[]` on the **next** phase's folded-in state write (Phase 9's finalize write closes out the last one).
  - `commits[]` feeds the report only — resume keys off `completed_phases`, which the folded write keeps current — so a one-phase lag in `commits[]` is harmless.

### Message body & footer
- **Subject** — keep it imperative and ≤ ~72 chars.
  - The `feat` subject for dev-story comes from the agent's one-line summary of what it built.
- **Body — required on every commit.**
  - One blank line after the subject, then 1–4 wrapped lines saying *what this phase changed and why*.
  - Draw it from the context the orchestrator **already holds** for the phase (the delegate's report, finding/severity counts, resolved decisions, deviations, deferred work) — never invent.
  - **The body must add information the subject doesn't carry** — never just restate it.
  - By type:
    - `feat` (dev-story): what was built + notable decisions/deviations + any deferred work.
    - `fix` (code review): the findings addressed this iteration, by severity, and the reviewer/iter; note anything deferred or dismissed.
    - `test`: the scaffolds/coverage added (ATDD red, post-dev automation, epic test design).
    - `docs`: which artifact and its scope (story context, project-context, epic gate/context/retro, pipeline report).
    - `chore` start: story title, epic, branch, and the delegation tier/profiles in use.
    - `chore` checkpoint (`code review passed`): reviewer/model, iteration, verdict, and that the pass had 0 non-deferred findings.
    - `chore` finalize: clean-vs-caveated outcome, the BMAD-status flip, and PR URL / CI status / gate decision.
- **Footer — optional, only when relevant.**
  - One blank line after the body, Conventional Commits `token: value` form.
  - auto-bmad emits one only when it holds the data — chiefly `BREAKING CHANGE: <what broke + how to migrate>` when a delegate reports an incompatible change.
  - Equivalently mark the type, e.g. `feat(story-1-2)!: …`.
- **Emit the parts as separate `-m` args** so the blank-line separators are guaranteed: `git commit -m "<subject>" -m "<body>" [-m "<footer>"]`.
  - Each `-m` becomes its own blank-line-separated paragraph — i.e. exactly the subject / body / footer shape.
  - Stage the phase artifacts **and** the state file first — the single-commit rule above.

## PR (Phase 9, mode `remote` only)
- Push: `git push -u origin <branch>`.
- Open PR: `gh pr create --base <base_branch> --head <branch> --title "<title>" --body "<body>"`.
- Add `--draft` if **any** clause of the **draft predicate** holds (clauses 1–4 below):
  - Evaluated deterministically by `scripts/state_plan.py --finalize` from the story's state file.
  - Run it **twice**:
    - pre-create WITHOUT `--ci-status` — clauses 1–3 decide the initial `--draft`;
    - again after the CI wait WITH the live `--ci-status` — the full verdict that also drives the status flip.
  - The four clauses below remain the normative definition the script implements.

  **Draft predicate (clauses 1–4):**
  1. a blocker was recorded;
  2. `convergence_unverified` is `true` — any of (Phase 7):
     - the review loop hit `max_iterations` while the last pass still had not converged — > 3 non-deferred findings or ≥ 1 non-deferred Critical/High;
     - **or** a post-halt re-review of external changes surfaced meaningful findings and the user chose to **continue** with them open — see `pipeline.md` Phase 7 step 4;
     - **or** Phase 7 was skipped outright by the `skip code-review` override — zero review passes, see `overrides.md`;
  3. `gate_decision` is `WAIVED` (Phase 8: the epic trace gate did not pass and the user — or the trace skill — chose to ship despite the coverage gaps);
  4. **CI is red or timed out** when the CI wait below resolves — a required check failed, or the wait cap was hit with checks still running (see "CI wait" below).
     - This condition can only be evaluated *after* the push.
     - If it fires → the PR is **converted to draft after the fact** with `gh pr ready --undo <pr-number>` (the initial `gh pr create` is issued without `--draft` for clauses 1–3 only).

- **The negation of this same draft predicate is the "clean completion" test** that decides whether Phase 9 also flips the BMAD-level story status (story file `Status:` + `sprint-status.yaml`) to `done` (see `pipeline.md` Phase 9):
  - predicate false ⇒ flip;
  - any clause true ⇒ leave at `review`.
  - `state_plan.py --finalize` emits both verdicts coupled in one JSON — `draft` and `clean_completion`/`flip_bmad_status`.
  - It is the *predicate* that decides, NOT the PR's actual draft flag: the `no_pr_draft` override (`--no-pr-draft`) forces only `draft` false and never touches `clean_completion`.
  - Keep the two coupled if you edit it.
- Title: a conventional summary of the story, e.g. `feat(story-1-2): user authentication`.
- Body must include:
  - one-paragraph summary of what the story delivered;
  - a link to the story file (`<impl>/{key}.md`);
  - TEA outcomes / epic gate decision (if applicable);
  - a `## Needs attention` checklist of open questions, deferred work, and human-action items (empty section omitted);
  - a footer line: `🤖 Generated by auto-bmad`.
- Capture the returned PR URL into state (`pr_url`) for the **chat** report (chat-only artifact).
- **CI link & wait:**
  - If the repo has CI workflows, the push/PR will have triggered a run.
    - Test existence with `find .github/workflows -name '*.yml' -o -name '*.yaml'` or `test -d`.
    - Never a bare `ls .github/workflows/*` glob — unmatched it aborts under zsh/fish.
  - The URL capture and the wait are one `ci_wait.py` call (see "How to wait" below).
    - Store the returned `ci_run_url` in state.
    - When it is `null` → fall back to the branch's Actions tab (`<repo_url>/actions?query=branch:<branch>`).
  - Then evaluate `ci_status` and, when warranted, **wait for in-progress checks to finish**.

  - **When to wait:** only if the merge prompt is effectively enabled this run — `git.offer_merge: true` AND no `skip merge-prompt` override.
    - prompt off → do not wait; just link the run and leave `ci_status: unknown`.
    - clauses 1–3 already made the run caveated (the PR is already a draft, so the merge prompt can't fire) → skip the wait; link the run, leave `ci_status: unknown`.
  - **How to wait:** one deterministic call — `python3 {skill-root}/scripts/ci_wait.py --pr <pr-number> --cap-minutes <git.ci_wait_minutes> --resolve-run-url --branch <branch> --head-sha <sha>` — then read `ci_status` and `ci_run_url` from its single JSON object.
    - The script owns the poll cadence, cap, registration grace (zero checks just after the push is lag — held as pending, not `none`), and output discipline.
    - Exit 2 means it couldn't evaluate CI (gh missing/errored) — leave `ci_status: unknown`, never `failed`.
  - **Outcomes** — record in state as `ci_status`; this list is normative, and `ci_wait.py` pins these exact values:
    - `passed` — every required check is `success` (or `neutral`/`skipped`).
    - `failed` — any required check is `failure`/`cancelled`/`timed_out`/`action_required`.
    - `timeout` — cap reached with checks still running.
    - `none` — no CI workflows or no checks reported.
  - Effect on the draft predicate:
    - `failed` or `timeout` ⇒ draft-predicate clause 4 fires (draft conversion per clause 4; story stays at `review`).
    - `passed` or `none` ⇒ clause 4 does not fire — clauses 1–3 still decide.
  - **Inherent lag:** the verdict above is evaluated on the pre-finalize HEAD — the Phase 9 finalize commit pushed *after* it supersedes that SHA and may re-trigger CI.
    - That commit is bookkeeping-only (state/report/status files, no code), so the verdict remains meaningful for the story's code.
    - On a protected branch the pending-checks merge fallback below covers the gap.

## Merging the PR (Phase 9, only when clean) — orchestrator
- auto-bmad never merges automatically.
- The orchestrator **asks** the user whether to merge before reporting, then runs the chosen `gh` command on their behalf — only when ALL of:
  - the run is a **clean completion** (full draft predicate is false — clauses 1–4 above);
  - AND `git.offer_merge` is `true`;
  - AND the run has no `skip merge-prompt` override.

- **Prompt** (`AskUserQuestion`, 4 options, in this order — first is the default):
  - **Merge commit (recommended)** / Rebase and merge / Squash and merge / Don't merge.
  - Merge commit is the default because it preserves every per-phase commit — the richest signal for later `git log`/`blame`/`bisect`.
  - If a merge style is chosen → **ask a second question**: Delete branch? Yes / No.
- **Execute** (only if the user picked a merge style):
  - `gh pr merge <pr-number> --merge` *(or `--rebase` / `--squash`)* `[--delete-branch]`.
  - On success → `git switch <base_branch>` then `git pull --ff-only`, so the local tree matches `origin/<base_branch>` post-merge.
  - **Pending-checks fallback** — the merge fails because required checks are pending/expected on the head SHA (the finalize push superseded the CI-validated commit — the "inherent lag" above):
    - retry **once** with `--auto` added — the user already chose to merge, and auto-merge completes it when the checks pass; tell them that's what happened ("merge queued; completes when checks pass").
    - if the `--auto` retry also fails (e.g. auto-merge disabled in the repo) → fall through to the failure handling below.
  - On failure (branch protection, required reviews, conflict, CI required check missing, etc.):
    - don't retry, don't error out.
    - capture the `gh` stderr verbatim into the report under "Needs attention" ("PR merge failed: …; merge manually at `<pr_url>`") and leave the PR open.
    - the pipeline still ends `done` (the BMAD-status flip already happened) — a failed user-elected merge doesn't invalidate the completion.
- **Record** in state: `pr_merged: true|false`, `merge_method: squash|merge|rebase|null`, `branch_deleted: true|false`.
  - Surface the outcome in the **chat** report — a chat-only finalization artifact, one line: "Merged via merge commit; branch deleted." / "PR left open at user's request." / "Merge attempted but failed (`<reason>`); merge manually."
  - A *failed* merge also lands in the file's "⚠️ Needs human" — it's a genuine follow-up, not just an artifact echo.

- When the prompt is **off** for this run (`git.offer_merge: false` or `skip merge-prompt` override) → Phase 9 ends after the finalize bookkeeping; PR stays open for the human.

## Epic mode (`/auto-bmad epic`)
Epic mode produces **one** of each artifact for a whole epic (`epic-pipeline.md`):
- one branch → one PR → one CI wait → one merge prompt.

The run-level machinery above reuses **unchanged** — it all operates on the single epic PR:
- the **draft predicate** (clauses 1–4);
- the **CI wait**;
- the **merge prompt**.

Only the per-story-shaped items get an `epic-{e}` variant (below).

- **Branch (E1):**
  - Name: `{git.epic_branch_prefix}{e}-{slug}` (default prefix `epic/`), e.g. `epic/1-account-system`.
  - Create it explicitly off base — `git switch -c <branch> <base_branch>`.
  - Slug is resolved in E0 and stored as the anchor's `epic_slug` so resume reuses it.
    - Source order: planning epics doc → kebab; fallback to the first story's slug stem; else `epic-{e}`.
  - Per-story `feat(story-{e}-{s})` commits land on THIS branch; never on base.
- **Base-readiness guard (E0):** a git-only check — never a code read.
  - Epic mode branches off `{base}` and assumes already-`done` stories are in `{base}`.
  - The check: a `done` story has a `{git.branch_prefix}{e}-{s}-*` branch NOT merged into `{base}`.
    - Detect with `git branch --list "{git.branch_prefix}{e}-{s}-*"` then `git merge-base --is-ancestor <branch> <base_branch>`.
  - If that check holds → **ASK** before branching (`epic-pipeline.md` E0):
    - proceed off base — that story's work won't be in this epic's PR;
    - or stop and merge it first.
- **Commit taxonomy:**
  - Per-story commits keep their `story-{e}-{s}` scopes — they land on the epic branch unchanged.
  - Epic-scoped commit subjects:
    - `chore(epic-{e}): start auto-bmad epic pipeline` (E1);
    - `test(epic-{e}): …` (epic test design; trace-gate remediation);
    - `fix(epic-{e}): address code review (iter {i})` (E_review);
    - `docs(epic-{e}): gate, project context, deferred-work archive, retrospective` (E8b);
    - `docs(epic-{e}): pipeline report` (E_final);
    - `chore(epic-{e}): finalize (mark done + BMAD status)` (E_final).
  - Body + footer rules are unchanged.
- **PR title/body:**
  - Title: `feat(epic-{e}): <epic summary>`.
  - Body must include:
    - a one-paragraph epic summary;
    - a **per-story rollup** — one line per landed story (status + one-line outcome + thin-review verdict/counts), from the anchor's `stories_landed` + each per-story state;
    - links to each story file;
    - the integration-review verdict (E_review) + the epic gate decision (E8a);
    - a `## Needs attention` checklist aggregating:
      - the auto-decided findings (esp. the Critical/High that forced the draft);
      - deferred items across all stories;
      - E_review's open findings;
      - E8a gaps;
    - the `🤖 Generated by auto-bmad` footer.
- **Draft predicate (E_final):** the SAME predicate, evaluated on the **epic anchor**.
  - Call: `state_plan.py --finalize --state-dir {state} --scope epic --story-key epic-{e}`.
  - Its inputs must be **aggregated up** to the anchor during the run:
    - a story whose Tier-A thin review left a non-deferred Critical/High → epic `convergence_unverified`;
    - any per-story or E_review blocker → epic `blockers`;
    - E8a `WAIVED` → epic `gate_decision`;
    - the one CI wait → epic `ci_status`.
- **Batch BMAD-status flip (E_final):** on a **clean completion** (`flip_bmad_status: true`), flip **every story in `stories_landed`** to `done`.
  - One `story_plan.py --mark-done {key}` per story.
  - Skip a pre-existing `done`.
  - **Never** flip an un-verified adopted `review` story.
  - The flips + the anchor→`done` write fold into the one `chore(epic-{e}): finalize` commit.
- **The caveated-epic mirror (call out):** a **caveated** epic leaves **ALL** landed stories at `review`, not just the offending one — because the batch flip is gated by `flip_bmad_status`.
  - One story's open Critical/High (or any other clause) parks the whole epic at `review` until a human acts.
  - This is intended — a single PR is either mergeable or not.

## Mode `local`
- No push, no PR, no merge prompt — there's nothing to merge.
- Leave the branch checked out.
- The final report tells the user the branch name and that no GitHub remote/`gh` was found — so they can push/PR manually if they wish.
- Epic mode is the same — one `epic/{e}-{slug}` branch, no PR.
