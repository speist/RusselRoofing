# Module Setup

Standalone module self-registration. This file is loaded when:
- The user passes `setup`, `configure`, or `install` as an argument
- The module is not yet provisioned for this project (its runtime config `{output_folder}/auto-bmad/config.yaml` is absent **and** no `ab-*` delegate agents are rendered)
- The skill's first-run init flow detects this is a fresh installation (e.g., agent memory doesn't exist yet)

## Overview

Registers this standalone module into a project. Module identity (name, code, version) comes from `./assets/module.yaml` (sibling to this file). Setup collects user preferences, then registers the module and provisions delegate agents:

- **`{project-root}/_bmad/module-help.csv`** — registers module capabilities for the help system (anti-zombie: existing `abm` rows are replaced before fresh ones are written, so stale values never persist).
- **Delegate agent files** (`.claude/agents/ab-*.md`, `.codex/agents/ab-*.toml`, `.opencode/agent/ab-*.md`) — rendered for the selected `target_tools` (see "Provision Delegate Agents" below).

auto-bmad's install answer (`target_tools`) and **all** runtime settings live exclusively in auto-bmad's own config, `{output_folder}/auto-bmad/config.yaml`, written by the skill's **first-run flow** (`references/state-and-resume.md`) — **not** by this setup file.

**auto-bmad never writes the central BMAD config.** That file is installer-owned: on BMAD 6.8.x+ it is TOML (`_bmad/config.toml` plus the never-installer-touched `_bmad/custom/`, resolved via `resolve_config.py`); on older installs it is the unified `_bmad/config.yaml`. auto-bmad neither reads nor writes an `abm` section in it — registering there would be inert (BMAD ignores it) and, on a TOML install, confusingly shadow the installer's own `[modules.abm]`.

`{project-root}` is a **literal token** in config values — never substitute it with an actual path. It signals to the consuming LLM that the value is relative to the project root, not the skill root.

## Check Existing Config

1. Read `./assets/module.yaml` for module metadata and variable definitions (the `code` field is the module identifier)
2. Check whether auto-bmad is already set up here — its runtime config `{output_folder}/auto-bmad/config.yaml` exists, or `ab-*` delegate agents are already rendered. If so, inform the user this is an update (reconfiguration). (Don't key this off an `abm` row in `_bmad/module-help.csv` — the BMAD `--custom-source` installer pre-merges that row, so it would false-positive on a fresh auto-bmad setup.)

If the user provides arguments (e.g. `accept all defaults`, `--headless`, or inline values like `user name is BMAD, I speak Swahili`), map any provided values to config keys, use defaults for the rest, and skip interactive prompting. Still display the full confirmation summary at the end.

## Collect Configuration

Ask the user for values. Show defaults in brackets. Present all values together so the user can respond once with only the values they want to change (e.g. "change language to Swahili, rest are fine"). Never tell the user to "press enter" or "leave blank" — in a chat interface they must type something to respond.

**Default priority** (highest wins): existing config values > `./assets/module.yaml` defaults.

### Core Config

**Don't collect or write core settings.** auto-bmad runs on top of an existing BMAD install (Step 0 requires `_bmad/bmm/config.yaml`), so `user_name`, `communication_language`, `document_output_language`, and `output_folder` are already set by the installer in the central BMAD config. auto-bmad reads `output_folder` (and the BMM artifact paths) from there at runtime and never re-writes them.

### Module Config

Read each variable in `./assets/module.yaml` that has a `prompt` field. The module.yaml supports several question types:

- **Text input**: Has `prompt`, `default`, and optionally `result` (template), `required`, `regex`, `example` fields
- **Single-select**: Has a `single-select` array of `value`/`label` options — present as a choice list
- **Multi-select**: Has a `multi-select` array — present as checkboxes, default is an array
- **Confirm**: `default` is a boolean — present as Yes/No

Ask using the prompt with its default value. Apply `result` templates when storing (e.g. `{project-root}/{value}`). auto-bmad's only such variable is `target_tools` — it drives delegate-agent provisioning below and is persisted to the runtime config `{output_folder}/auto-bmad/config.yaml` by the first-run flow (not written here).

## Write Files

Register auto-bmad's help entries into the shared help CSV:

```bash
python3 ./scripts/merge-help-csv.py --target "{project-root}/_bmad/module-help.csv" --source ./assets/module-help.csv --module-code {module-code}
```

It outputs JSON to stdout (anti-zombie: existing `abm` rows are replaced). If it exits non-zero, surface the error and stop. Run `./scripts/merge-help-csv.py --help` for full usage.

**Do not write the central BMAD config — there is no config write here.** This is deliberate, not an omission:

- auto-bmad's install answer (`target_tools`) and runtime settings are persisted to `{output_folder}/auto-bmad/config.yaml` by the **first-run flow**, which runs right after this file returns (see `references/state-and-resume.md`). Don't pre-write it here.
- The central `_bmad/config.*` is **installer-owned**. On BMAD 6.8.x+ it is TOML (`_bmad/config.toml` + the never-touched `_bmad/custom/`); writing a unified `_bmad/config.yaml` there is inert (BMAD's `resolve_config.py` never reads it) and shadows the installer's layout. On older installs it is the unified `_bmad/config.yaml`; auto-bmad's `abm` section there was only ever an inert marker. Either way, **skip it.**
- If auto-bmad was installed through BMAD's `--custom-source` installer, that installer has **already** registered `[modules.abm]` in `_bmad/config.toml` (and a per-module `_bmad/abm/config.yaml`). Leave those untouched — do not duplicate or rewrite them.

(`./scripts/merge-config.py` ships only to satisfy the standalone-module validator; auto-bmad does **not** invoke it. Don't reintroduce a call to it.)

## Create Output Directories

auto-bmad defines **no** path-type install variables and no `directories` array in `./assets/module.yaml`, so there is nothing to create here. `output_folder` already exists from the BMAD install, and the first-run flow plus the state writers create `{output_folder}/auto-bmad/` (config, state, reports, retro-notes) on demand. Skip this step.

## Provision Delegate Agents (auto-bmad)

auto-bmad delegates each pipeline step to a model/effort-tuned subagent. Those subagents are
tool-native files that must be generated into the host's agent directory. Do this here so the
module is ready to run immediately after setup.

1. **Determine `target_tools` — default to the AIs this BMAD install targets, then confirm.**
   Detect from where the `auto-bmad` skill is installed (the tools that can actually invoke it):
   - `claude-code` if `.claude/skills/auto-bmad/` exists;
   - `codex` if `.agents/skills/auto-bmad/` exists (BMAD installs Codex skills under `.agents/`),
     or if `.codex/skills/auto-bmad/` / `~/.codex/skills/auto-bmad/` exists.
   - `opencode` if `.opencode/skills/auto-bmad/` or `~/.config/opencode/skills/auto-bmad/` exists.

   Use that detected set as the **default** for the `target_tools` question (fall back to
   `[claude-code]` if nothing matches), then **still ask** — the user confirms, drops one, or adds
   a tool they plan to install later. Provisioning is independent of which tool *runs* the
   pipeline (that's auto-detected each run).
2. **Confirm a supported host is present** (informational — `delegation.host`/`mode` stay `auto`
   and are re-detected on every run, not pinned here): Claude Code if `${CLAUDE_PLUGIN_ROOT}` is
   set or a `.claude/` dir exists; opencode if `${OPENCODE_SESSION_ID}` is set or a `.opencode/` dir
   or the `opencode` CLI is present; Codex if a `.codex/` dir or the `codex` CLI is present.
   Claude Code, Codex and opencode support `custom-subagents`; a host with only a generic subagent
   mechanism uses `general-subagents`, and one with none uses `inline` (see
   `references/delegation-runtime.md`).
3. **Render the delegate files** for the selected tools (resolve `{project-root}` to the real
   path; defaults come from `./assets/agents/profiles.yaml`):

   ```bash
   python3 ./scripts/render-agents.py --project-root "{project-root}" --tools "<comma-joined target_tools>"
   ```

   This writes `.claude/agents/ab-*.md`, `.codex/agents/ab-*.toml` and/or `.opencode/agent/ab-*.md`
   (note: opencode's dir is singular `agent/`). Surface the JSON result; if it exits non-zero or
   reports warnings, show them.
4. Claude Code and Codex profiles ship with real model defaults that need no change. Model names
   are environment-specific, so if a tool's install exposes different names the user can retune the
   `profiles` block in `{output_folder}/auto-bmad/config.yaml` and run `/auto-bmad reprovision` —
   but don't flag this as a required manual step. **opencode is different:** its `model` ships BLANK,
   so opencode delegates inherit the user's opencode default model and run out of the box — but for
   per-phase model tiering and cross-vendor review diversity (e.g. point `ab-alt-*` at a different
   provider), the user sets `opencode.model` per profile. Mention this as optional, not required.
   The user can also **add custom profiles** to the config's `profiles` block (same field set;
   the name must start with `ab-`) and map phases to them — `reprovision` renders every `ab-*`
   profile it finds. Also optional; don't volunteer it beyond this.

**Reprovision-only path:** if the user invoked with `reprovision` (or asked only to regenerate
agents after editing profiles), skip config collection entirely and run just step 3 above,
reading the live profiles with `--profiles "{output_folder}/auto-bmad/config.yaml"` (fall back to
the shipped defaults if that file doesn't exist yet). The orchestrator also auto-reprovisions at
preflight when agents are stale — see `references/delegation-runtime.md` → "Resolving host &
mode", so users rarely have to run this by hand. On `custom-subagents` hosts the (re)rendered
agents become invokable only after a full tool restart; see `references/delegation-runtime.md` →
"Newly-rendered agents need a process restart" before telling the user what to do next.

## Confirm

Use the script JSON output to display what was registered — help entries added (`module-help.csv`), the delegate agents rendered for the selected `target_tools`, and fresh install vs update. Note that `target_tools` and runtime settings are persisted to `{output_folder}/auto-bmad/config.yaml` by the first-run flow that follows.

If `./assets/module.yaml` contains `post-install-notes`, display them (if conditional, show only the notes matching the user's selected config values).

Then display the `module_greeting` from `./assets/module.yaml` to the user.

## Return to Skill

Setup is complete (help registered, agents rendered). Resume the main skill's normal activation flow. If this was a `setup`/`configure`/`reprovision`-only invocation, stop here (already reported). If it was a run-intent invocation that triggered setup only because the module wasn't set up yet, continue into the Procedure — the first-run flow there writes the runtime config `{output_folder}/auto-bmad/config.yaml` — then **stop for a fresh session** per the first-run stop in `references/state-and-resume.md` — the pipeline must not run on the same context that just did configuration.
