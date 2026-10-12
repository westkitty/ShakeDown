# ShakeDown Release Checklist — Birthday Edition

**Deployment target:** westkitty/ShakeDown → GitHub Pages. This is a static site, not an installed app. No runtime npm dependencies. **Source of truth:** docs/IMPLEMENTATION_PLAN.md and docs/PRODUCTION_READINESS.md.

## Candidate preflight

- [ ] Branch includes only reviewed modifications, expected files and explicit asset provenance.
- [ ] Original Cinnamon masters and the 26 source cut-outs are unchanged.
- [ ] No generated-but-unverified art was checked in under the intended output path.
- [ ] Asset file output manifest has valid dimensions/hashes and truthful review state.
- [ ] Browser still works with zero production-art files (Canvas fallback).
- [ ] All final Fox art references the approved FOX-01 master.
- [ ] No Bethel setting, no cake-guardian quest, no false claims that the Fox is original final art.

## Automated gates

- [ ] npm ci
- [ ] npm run validate
- [ ] npm run test:browser (desktop + mobile-emulated Chromium via served HTTP).
- [ ] CI for exact candidate SHA succeeds; tests match local results.
- [ ] New PR diff has no accidental secrets, dependency/runtime rewrites or destructive asset replacements.

## Required real-player acceptance

- [ ] Title/menu loads correctly and playable input works.
- [ ] Keyboard and touch input independently tested; focus-loss and pause release held actions.
- [ ] Normal unassisted campus journey (no QA warp), collectibles and checkpoints.
- [ ] All 23 Golden Dome jumps plus normal hazards and a recoverable loss/retry.
- [ ] Clear Fox telegraph/charge/volley/readable recovery, three genuine hit windows.
- [ ] Birthday cake *and independent Shamrock Shakes* visibly appear after boss defeat.
- [ ] Exact HAPPY BIRTHDAY, MAVERICK! message and replay restore correct state.
- [ ] Sound only starts after user interaction; mute/reload behavior; speaker listening check.
- [ ] Physical mobile device portrait/landscape, touch, safe areas, no clipped controls, useful p95 frame sampling.

## Deployment checks

- [ ] Deploy exact approved merge SHA.
- [ ] GitHub Pages workflow passes at that SHA.
- [ ] Hosted index and each required module/asset path respond 200.
- [ ] Perform live-URL complete gameplay and check browser console, not just page reachability.
- [ ] Check persistence/replay after reload.
- [ ] Compare representative performance to the recorded before-state with same browser/device/scenario.
- [ ] Record known remaining partials clearly in OPERATIONAL_STATE.md; no unsupported COMPLETE label.

## Rollback policy

Keep the last accepted commit and asset record immutable. On failure, repair via a new candidate PR; if a specific approved-art candidate regresses fidelity/gameplay, revert only its manifest promotion and generated file. Never force-push main, delete unrelated images, change the original 220 prompts during in-progress LM Arena generation, or replace the working Canvas engine.

**Evidence discipline:** Node pass ≠ browser pass. Playwright pass ≠ physical phone pass. GitHub Pages build pass ≠ complete hosted gameplay pass. Asset hash ≠ visual fidelity. A 60Hz simulation interval ≠ 60fps performance measurement.


## Round 2 additional proof

- [x] Continuous automated no-warp assist-mode route through all 23 Dome steps and natural Fox victory in Node.
- [x] Browser Canvas + real DOM-input route with synthetic frame timing, visible assist toggle, checkpoint retry and replay.
- [x] Local-only Asset Control Room with true master-manifest inventory and corrupt-file rejection on desktop/mobile emulation.
- [ ] Human-paced and normal-difficulty full route.
- [ ] Physical phone touch/audio, final art identity approval and representative performance.
- [ ] After any merge, exact SHA Pages deployment and full hosted URL player journey.


## Round 3 — image activation safety, normal difficulty, and simultaneous-input correctness

- [x] **Regression:** approved source art remains inactive until explicit integration attestation backed by a physically present PNG screenshot and its SHA-256 checksum. A screenshot being structurally valid does not prove what it depicts.
- [x] **Regression:** localhost-only art preview can display reviewer-accepted but unactivated art. Ordinary gameplay does not load it; if absent, the existing Canvas artwork remains.
- [x] **Regression:** synthetic intake fixture verifies approve -> dormant -> activation, rejects activation without an actual evidence file or reviewer attestation, prevents duplicate activation, and rejects tampered screenshot evidence.
- [x] **Node scripted run:** normal difficulty (assist OFF), no warps, hazards and natural checkpoint recovery, reached summit and defeated the Fox. Valid jumps bypassed two intermediate steps; 21 different named Dome platforms were physically touched.
- [x] **Browser scripted run:** assist OFF via the default UI, real keyboard/Canvas/game state with a synthetic rAF clock, no warps, actual boss victory and replay.
- [x] **Browser interaction:** overlapping right-arrow and D key ownership; simultaneous keyboard + touch input with focus loss; local preview banner survives asynchronous sprite-loading completion.
- [x] **Asset Studio:** separate Source/Reviewed (inactive)/Active states, actual status counts, local preview deep link, and explicit integration command template.
- [ ] **Human and hardware:** a continuous player-performed run under real clock pacing, final art quality, original source provenance, real phone audio and touch controls.
- [ ] **Release:** exact SHA deployment to GitHub Pages and live-site gameplay, after authorized merge. Keep main unchanged until release gates pass.


## Round 4 — persistence, reduced motion, and keyboard usability

- [x] Automated: earned birthday-completion flag survives replay and settings changes (reproduced failing before repair).
- [x] Automated: checkpoint persists across reload with Continue; pickup/enemy IDs reconcile to level; fresh Start clears unfinished progress, not earned records.
- [x] Automated: older or malformed checkpoint records do not crash, invent gameplay objects or show unusable Continue.
- [x] Automated: both assisted and normal-difficulty continuous input routes write all five authored checkpoints and clear unfinished progress after victory.
- [x] Automated: Reduced Motion freezes decorative pixels without changing simulation time or moving collision platforms; saved user choice overrides OS default.
- [x] Automated: Tab-contained modal overlays, keyboard Enter on Continue, repeat-safe pause, native Space on sound button and keyboard-operated touch Jump.
- [ ] Device/assistive tech: physical iPhone/Android, screen reader/switch control, audible sound, long-term localStorage behavior and normal-paced player run.
- [ ] Deployment: exact merge SHA on GitHub Pages and complete hosted browser route only after explicit merge and release acceptance.


## Round 5 — seven-area pre-art hardening gates

- [x] Real wall-clock browser audit tool measured original and corrected mobile geometry, requestAnimationFrame pacing, Canvas cost and input-to-motion observation. The output explicitly labels remote scheduling uncertainty; it is not phone FPS proof.
- [x] Audio lifecycle unit/browser tests cover no autoplay context creation, pause/mute/restart stop, bounded 24 live voices, context recovery and graceful device failure.
- [x] Six user-provided MP3 source hashes, byte sizes and three runtime roles are validated; campus and Dome pools load lazily and Fox music replaces them only at the fight.
- [ ] Physical-speaker listening, long-form loop seams and real-phone media playback remain human/hardware acceptance gates.
- [x] Bulk incoming-art dry-run and stage-only tool verifies unique exact contract IDs, dimensions, alpha and hashes; rejects ambiguous/duplicate/symlink/corrupted files; never writes approval manifest.
- [x] Visual/gameplay legibility: first-viewport Start and touch controls fit 320px portrait and 844x390 landscape; critical solid-button contrast >=4.5:1; both complete scripted routes exercise Fox tell, charge, volley, recovery, hit and birthday.
- [x] Save stress: cross-tab completion and checkpoint retention, storage restriction behavior, repeated restart/mute/pause without corruption.
- [x] Accessibility: user High Contrast setting now has visible effect and persists; existing Reduced Motion/keyboard UI remains tested; new coarse-pointer minimum 44x44 for visible touch targets.
- [x] Read-only static release preflight inventories actual runtime files and prevents packaging a missing imported module; named CI artifact and non-destructive rollback steps documented in docs/RELEASE_REHEARSAL.md.
- [x] Bonus: ESM boot failure offers Retry Loading, and network loss after loading or missing optional art doesn't crash gameplay.
- [ ] Physical iPhone/Android touch/speaker/screen-reader and actual normal-speed gameplay and FPS measurement.
- [ ] Final LM Arena output file delivery, character identity signoff, in-game screenshot review and staged-to-active integration per existing contract.
- [ ] Explicitly approved merge, Pages build for the exact new SHA and hosted game full journey. All pre-art work remains on prep/asset-ready-20261011 until authorized release.
