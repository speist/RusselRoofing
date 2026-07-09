# TEA selection policy

Applies only when `tea.enabled` is true in config.

## 1. Epic-level skills — ALWAYS ON (when TEA enabled)
- **Epic start** (`is_first_in_epic`): `bmad-testarch-test-design` (epic level).
- **Epic end** (`is_last_in_epic`): `bmad-testarch-trace` (gate) → `bmad-testarch-nfr` → `bmad-testarch-test-review`.

## 2. Per-story skills — RISK-BASED (triage in Phase 0)
Per story, the matrix below selects from two skills:
- `bmad-testarch-atdd` — runs before dev.
- `bmad-testarch-automate` — runs after dev.

### Risk classification
Score the signals from the story's epic entry, acceptance criteria, and described scope:

**High** — any of:
- authentication, authorization, sessions, secrets, crypto, or permissions
- money/payments/billing, or other irreversible side effects
- data integrity: schema/DB migrations, deletes, bulk mutations
- public/external API surface or contract changes
- security-sensitive input handling (uploads, parsing, deserialization, SSRF/XSS/SQLi surface)
- concurrency, scheduling, or other hard-to-reproduce behavior

**Medium** — none of the above, but the story:
- adds/changes business logic or non-trivial branching
- adds an internal endpoint/service method or stateful UI flow
- touches multiple modules

**Low (trivial)** — copy/docs, config/constants, styling-only, comments, dependency bumps with no behavior change, or pure scaffolding with no logic.

### Selection matrix
| Risk | atdd (pre-dev) | automate (post-dev) |
|------|----------------|---------------------|
| High | yes | yes |
| Medium | no | yes |
| Low | no | no |

Record in state:
- `tea_risk` (`low|med|high`) — the classified level.
- `tea_selected` — the chosen set.
- A one-line rationale — which signal drove the level.

Keep `tea_risk` explicit; don't re-derive it from `tea_selected` — the §3 advisory gates on it.

## 3. Long-epic trace advisory — per-story, NON-BLOCKING (opt-out)
A story-scope `bmad-testarch-trace` pass at the **tail of Phase 7** — after the code-review loop converges.
- Surfaces this story's uncovered acceptance criteria while the dev context is fresh.
- **Advisory only**: it records gaps. It never halts, remediates, asks, or forces a draft PR.
- The blocking gate stays at epic end (§1).

Select `trace-advisory` (add it to `tea_selected`) at Phase-0 triage **iff all** of these hold:
- `tea.enabled` is true **and** `tea.story_trace_advisory.enabled` (default true).
- `tea_risk == high` — because only high-risk stories make an uncovered AC costly enough for the extra pass.
- `stories_after_in_epic >= tea.story_trace_advisory.skip_last_stories` (default 3) — because an advisory on the epic's last few stories near-duplicates their imminent epic-end gate.
  - `stories_after_in_epic` = how many stories in this epic come after this one: 0 for the last, 1 for second-to-last, and so on.
  - So `>= 3` skips the last three stories.
- `epic_story_count >= tea.story_trace_advisory.min_epic_stories` (default 6) — the **long-epic gate**: dormant on short epics (their epic-end gate is already near), self-activating on long ones.

`epic_story_count` and `stories_after_in_epic` come from the same `story_plan.py` read that sets `is_first_in_epic`/`is_last_in_epic`. Record both in state alongside `tea_risk`.

### Notes
- Low risk ⇒ `tea_selected = []` and Phases 4 & 6 are skipped — the story still gets full code review.
- `framework` / `ci` are one-time project setup — handled (or skipped) by the first-run flow (`state-and-resume.md`), never per story.
- When in doubt between two tiers, pick the higher one.
