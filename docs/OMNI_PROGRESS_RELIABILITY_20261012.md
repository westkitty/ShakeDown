# OMNI II — Progress integrity, rally journal and startup readiness
Date: 2026-10-12

## Authority, baseline and protected behavior

- Target: existing `westkitty/ShakeDown` local feature branch `feat/omni-rally-followthrough-20261012`, starting at `6608537c6f397a0a6555267f4ef808b14846d3b4`. Verified public `main` remains `e1f98f35c092159018e05604141d818ba5a356a6` at the time of intake.
- Clean tracked baseline, separate three **untracked MacBook planning artifacts preserved**. 61/61 Node tests and release-preflight passed before editing.
- Protected: Canvas 2D and the 60Hz simulation, actual moving/timed-platform collision, six authored checkpoints, all existing 23 Golden Dome steps, Fox three-hit victory, existing animation/audio flows, original owner-created Cinnamon art bytes, 194 candidate assets and approvals, same-origin local-only checkpoint storage, `?art=classic`, mobile support, and old schema-1 save compatibility.
- Bound to three cohesive groups: reliable meaningful-progress autosave; discoverable, accessible four-bell journal; startup/focus/readiness controls. No new runtime dependency, renderer change or unauthorized art approval.

## Finding O2-01 — earned progress silently lost before next checkpoint (high)

**Reproduced before fix.** Desktop browser regression tests failed for both (1) collecting a Shake on the Welcome Lawn without triggering the first checkpoint and (2) ringing the Canopy Bell after checkpoint 1 but before checkpoint 2. Both produced no valid updated `saved.progress` for the earned event. Source owner `src/main.mjs` only called `saveCheckpointIfNew()` if `state.checkpoint>lastSavedCheckpoint`; previously awarded pickups, defeated bots and bells were not persisted unless the next checkpoint was reached.

**Correction.** Add `progressToken(s)` (checkpoint index, actual count of collected shakes, lit bells and defeated Cup Crawlers). The UI writes only when the token changes. This avoids 60Hz storage writes while stationary, and keeps persisted data a minimal authored `checkpointRecord` rather than serializing the live engine. A meaningful first-lawn pickup creates a valid index-0 Welcome Lawn resume, while an untouched spawn cannot create a fake Continue. Existing 1..5 checkpoints and restoration positions are unchanged. Saved records still use schema 1.

**Integrity.** Validation rejects a forged collected rally reward whose specific bell is not lit. Restoring old schema-1 saves without any new rally field remains valid. Persisted gameplay can be unavailable if browser storage rejects writes; the game continues and presents a truthful warning, not fabricated durability.

## Finding O2-02 — optional objectives not reviewable on demand (medium)

Previous dynamic rally directions and end-screen 4/4 summary did not provide an always-available breakdown of individual bell/reward states. Pause now includes an expandable `<details>` **Rally Journal** with canonical Canopy, Parade, Gallery and Cornice labels, region, earned status, and whether the resulting Shake was actually taken. Keyboard focus containment includes the native `<summary>` interaction. The title shows a genuine persisted best-bells tally only when one has been earned. Touch controls are disabled while the game is not playing, not left as apparent but inert buttons behind modal overlays.

This follows the objective-review principle in [Microsoft Xbox Accessibility Guideline 109](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109). The frequent-save principle in [Xbox Accessibility Guideline 108](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108) supports minimizing progress loss. Those guidelines are advisory, not proof that this game's on-device UX is accessible.

## Finding O2-03 — possible inert Start before module readiness (medium)

**Observed** on a mobile-emulated cold load during regression: the title and Start button appeared while `window.__SHAKEDOWN_QA` and gameplay listeners had not initialized. A tap could therefore do nothing. This can happen in slow or disrupted module loading and is distinct from a healthy player input transition.

**Correction.** Initial static title Start, Art Director launch and curated-art toggle are disabled until the corresponding module handlers are registered. Startup explicitly enables them before normal interactive title focus. A one-shot first-animation-frame focus recovery operates only while still on the title screen and only if focus is on the document body (it does not steal focus from another interactive element or the Art Director). Native focus traps continue to preserve Pause controls.

A targeted browser regression deliberately delays an actual imported engine module. It proves Start and the title tools are inert/disabled during loading, then become enabled and function after the dependency resolves. A separate real failed-import retry remains available from the existing 8-second startup watchdog.

## Validation and honest bounds

- Added Node tests for Welcome Lawn index-0 checkpoint, progress-fingerprint stability, recovered rewards, real bell/reward invariants, and malformed-record rejection.
- Browser integration: initial red regression **2/2 failed before repair**, then targeted desktop checks passed. Later combined desktop + mobile checks for persistence, Pause journal, best score, touch disabled states and delayed bootstrap passed 10/10.
- Existing QA fixtures may reposition a player to reach specific interactions quickly; this is not a human-paced full campaign proof. The earlier no-warp default-difficulty Canopy test remains independent and authoritative for organic reachability.
- A concurrent Playwright test run momentarily collided with an ongoing matrix's shared `test-results` directory and lost a trace file; this was **test-runner interference, not game behavior**. Future concurrent invocations must set unique Playwright `--output` destinations or serialize the runs. Any affected full-matrix result must be rechecked cleanly.
- No new raster, audio, textures, synthetic approved artwork, mechanical level coordinates or checkpoints were created.

## Release boundary

This is a local candidate while GitHub's account-level requirement of at least one verified email remains unresolved. The previous remote feature ref was created at the public main base and did **not** receive the local OMNI implementation commit. Do not claim any new public Pages deployment or GitHub exact-commit CI until independently observed. The MacBook already holds the previous `6608537` implementation and its three precious untracked planning files must not be overwritten.

## Remaining limits

- Physical Android touch, audible speaker, human-paced full route, and final human visual-art acceptance are not proven by Playwright.
- `localStorage` is origin/browser/device-specific and cannot promise cross-device or crash-proof recovery. Concurrent competing tab writes are not transactional.
- `run_03` remains omitted from the runtime animation sequence because its original crop cannot be recovered by padding.

## Subsequent clean full-matrix verification

The combined OMNI II and visual-finishing source candidate completed the final entire Playwright suite **128 passed / 12 intentionally skipped / 0 failed**, covering actual mobile save/reload, frame-fatal pickup persistence, offline and stale-tab scenarios, startup recovery, native rally journal, and original route victories. The earlier separate Playwright-results collision is a retained historical test-harness incident and is not the final release verdict. MacBook source transfer/validation is tracked separately.
