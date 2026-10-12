# ShakeDown Project Bible — Additive Development Ledger

Operational State, the current user corrections, implementation plan and complete asset JSON remain governing. This is an append-only engineering log, not a replacement contract.

## 2026-10-11 — Round 2 continuous gameplay proof and art review bench

### Baseline, scope and design
- Target: westkitty/ShakeDown, prep/asset-ready-20261011; start SHA 553be7d56cf7a61466fb146b378a6eac8830caf5, worktree clean.
- Preserve existing Canvas 2D, physics, player and Fox, complete Notre Dame birthday story, 26 real Cinnamon sources, and 220 image/21 audio generation requests.
- Three bounded groups: continuous route proof, isolated browser-local review workbench, validation/docs evidence. No dependency or renderer replacement.

### Implemented and validated
- Pure RoutePilot reads state and directs game input in Node; browser tests send normal DOM keys and click existing UI, while virtualizing only rAF timing for deterministic speed.
- Standalone HTML/CSS/JS review UI retrieves canonical IDs and existing approvals, checks local candidate pixels/alpha/hash and basic audio containers without uploads or approvals.
- Node and Playwright regression assertions distinguish a scripted assisted full path from human play and physical-device verification. See docs/VALIDATION.md.

### Risks and next gates
- Normal-difficulty route and human-player responsiveness; physical iPhone/Android touch and actual speaker audio; LM Arena-generated Fox identity approval and visual QA; hosted SHA and actual frame pacing remain unverified.
- Never mark generated images complete from specs, copy a binary without review, or rewrite game architecture to accommodate this test.

### Git evidence
- Implementation commit: pending.
- Documentation follow-up hash: append implementation hash after the implementation commit if authorized.

## 2026-10-11 — implementation delivery hash
- Round 2 code implementation commit: `602a87ebb98d72b4a2a01110a38a061efb099f68`.
- Local `npm run validate`: 20/20 Node tests PASS.
- Local Playwright on BigMac / Brave with two workers: 21 browser tests PASS, 1 intended mobile-duplicate route SKIP; real HTTP site and synthetic deterministic route clearly differentiated.
- No source art, compiled generation prompts or runtime-approved images changed.


## 2026-10-11 — Round 3: asset gate, normal route, input ownership

### Exact baseline and scope
- Target: westkitty/ShakeDown, prep/asset-ready-20261011 at 7cecff2f321b474fa029a3163b956f02698f9757, cloned to a clean separate BigMac worktree.
- Three bounded change groups: keep artistic source approval separate from visual activation; prove normal-difficulty completion by the real physics/DOM input path; correct overlapping physical keyboard/touch ownership.
- Preserve the 2D Canvas engine, actual 26 Cinnamon source frames, fixed-step mechanics, Notre Dame setting, Fox encounter, Shamrock Shake birthday ending, master 220-visual/21-audio output requirements. No new npm dependency, asset content invention, engine replacement, or main-branch merge.

### Reproduced defects
- **P0 art activation leak:** renderer selected reviewer-attested records still marked unverified for integration. Corrected with explicit verified-only runtime gate and localhost-only preview.
- **P1 preview UX race:** independent Cinnamon image-loader completion overwrote the persistent local preview warning. Corrected via combined source/art status readout.
- **P1 multi-input ownership:** releasing right-arrow cleared the logical right action even when D or touch still held. Corrected with individual key-code and pointer ownership tracking.
- **P2 review UX mismatch:** studio previously conflated reviewed and activated items; clarified actual counts, ID labels, preview links and activation template. Hash-fragment changes now update the currently inspected asset.
- **Normal mode input regression:** the original scripted driver was unable to recover after a genuine checkpoint reset or safety-ledge route; recorded in the test driver and repaired without changing game collision, enemy damage, or level data.

### Implemented systems
- Reviewer source approval remains dormant until a separate activation command checks renderer mapping, exact approved source SHA, reviewer attestation and actual screenshot under docs/assets/qa. Screenshot integrity is validated, but its depicted contents are a required human review.
- Local-only preview-art logical ID can be inspected in the real Canvas game without activating the image on a public URL. Procedural fallback is retained if missing.
- Isolated test fixtures validate approve -> dormant -> activate, tampered screenshot rejection and required evidence; no fixture art or mock reviewer becomes a production record.
- Continuous normal-difficulty tests in Node and Playwright use existing movement, hazards, checkpoint recovery, Fox hit windows and replay. Assistant/normal routes remain separate and accurately labeled.

### Executed verification
- BigMac npm run validate: 21/21 passed, including both scripted routes and evidence tamper checks.
- BigMac Playwright against actual localhost HTTP using installed Brave: 29 passed, three intentionally skipped (mobile-duplicate full route and desktop-only touch source).
- Normal difficulty, Node: 2,782 fixed ticks, 21 steps physically contacted, 31 pickups, checkpoint retry and pit reset, natural Fox victory.
- Normal difficulty, desktop browser with virtual rAF: 2,786 callbacks, 21 steps, 32 pickups, natural Fox victory and replay.
- BigMac ADB unavailable; MacBook ADB found zero connected/discoverable devices. No physical-device audio/touch or user-played normal-speed completion has been established.

### Remaining acceptance gates
- Reviewer-approved real LM Arena outputs and Fox identity, source licensing, in-game visual acceptance, independent physical phone audio/touch, actual-frame pacing and human-paced full route.
- Exact commit SHA CI and optional eventual GitHub Pages merge/deployment proof.
- Do not mislabel these automated virtual-frame completions as a real player performing the game or the current public Pages version.

### Round 3 implementation commit receipt
- Round 3 implementation and verification commit: 6c432d60a633143fe920c8ec61b8d9001d28b6ca.
- Local BigMac baseline: npm run validate PASS 21/21; served-HTTP Brave Playwright PASS 29/29 executed, 3 intentional skips. The synthetic virtual-frame route, real mobile emulation and zero art approval boundaries remain intact.
- This commit is on the existing preparation branch, not merged to main.


## 2026-10-11 — Round 4: checkpoint-safe birthday completion, Reduced Motion and dialog controls

### Authority and baseline
- Repository: westkitty/ShakeDown, branch prep/asset-ready-20261011, starting at exact clean SHA b50d16c4d46c9ba90a49b3e2c0deb613c1993231.
- Preserved: Canvas 2D state/render split, complete South Quad/Golden Dome 23-stage layout, existing Fox encounter, Shamrock Shake birthday finale, original 26 Cinnamon sprite sources, all 220 visual and 21 audio LM Arena generator requests, approved-art intake and activation gate.
- Scope frozen to three cohesive groups: (1) save correctness/checkpoint Continue, (2) functional Reduced Motion, (3) keyboard/focus accessibility. No engine rewrite, dependency change, external generated art, or main-branch merge.

### Reproduced defect and repair
- Baseline browser test reproduced an earned birthday completed record flipping back to false after replay and mute change. Main saved a stale snapshot in memory and never updated it after a successful write. Fixed by maintaining current in-memory record and monotonic earned completion/best Shake fields, with no legacy schema break.
- Reload previously discarded in-progress checkpoint progress entirely. Added optional versioned checkpoint records with authored IDs/validation, no arbitrary engine or browser DOM serialization. Continue restores collected shakes, secrets, defeated enemies, proper camera and legitimate checkpoint reset. A fresh Start clears unfinished checkpoint; victory clears it while retaining earned completion. Restricted storage still allows play without a durable guarantee.
- Reduced Motion setting existed but did not alter the Canvas renderer. Decorative visual animation now uses a separate presentation time and disables nonessential particles/flashes while physical moving platforms, collision timing, Fox cues and player inputs stay authoritative.
- Title Enter interception was confirmed to start fresh even when Continue was focused; fixed. Pause-key repeated keydown and globally stolen Space on focused buttons were corrected; dialogs now have focus containment and restore keyboard control to the canvas. Keyboard-operated mobile touch action buttons are supported.

### Executed evidence and caveats
- Original preparation baseline npm run validate passed 21/21.
- New Node tests cover valid/invalid checkpoint records and re-derived collectible/secret counts.
- Playwright desktop/mobile emulation tested completion persistence, Continue/reset, malformed saves, Reduced Motion pixel equality vs animated scene, OS preference override, Tab containment, Enter Continue, P-repeat, native Space on mute and keyboard touch Jump.
- Both complete browser deterministic scripted assisted and normal routes observed all five authored checkpoint writes in localStorage, natural Fox victory and no pending checkpoint after completion. Scripted rAF routes are not human-paced play.
- Final full-suite validation and exact remote GitHub PR CI outcomes must be recorded after execution.
- No physical device or speaker tests, final LM Arena assets, human-paced completion or production Pages branch deployment were proven.


### Round 4 local verification and handoff

- Baseline before edits: npm run validate 21/21 passed, clean working tree at b50d16c4d46c9ba90a49b3e2c0deb613c1993231.
- New completed local checks: npm run validate 24/24 passed; 23/23 executed desktop-browser checks passed with 2 skips; 23/23 executed mobile-emulated browser checks passed with 2 skips. Total 46 browser passed, 4 deliberate skips.
- Source art hashes checked by canonical content validator; no external generated visuals/audio, production dependencies, game level rewrites, renderer migration, or main-branch updates.
- Safe delivery scope: source/renderer/progress, 3 new browser test modules, Node checkpoint tests, existing route-checkpoint integration tests, source HTML/CSS, approved docs and append-only operational state. Temporary local patch scripts are not delivery artifacts.
- Implementation commit SHA and exact GitHub CI will be appended only after verified delivery; main remains unchanged until separate release decision.


### Round 4 final checkpoint-safety verification extension
Following the initial full sweep, the authored geometry safety check was extended to every checkpoint. The final Node suite is **25 passed, zero failures** after this additional test. All five checkpoint spawn points were exercised through actual game physics without QA warps or geometry edits. Existing local Playwright desktop and mobile-emulated results remain 23 passed each, two intentionally skipped per project. Remote same-SHA CI and production release evidence remain distinct gates.

### Round 4 implementation delivery
- Tested implementation commit: 4be648f53e3c03c5a11e084b0bf093c65731e3d0.
- Local BigMac final npm run validate 25/25 passed; desktop browser 23 executed passed and 2 expected skipped; mobile browser 23 executed passed and 2 expected skipped.
- This implementation commit remains on the PR preparation branch; no main merge or public-site deployment is claimed. Final GitHub CI status must be checked independently.

## 2026-10-11 - Round 5: Asset-independent production reliability and release preparation

### Repository state and authority
- Target: westkitty/ShakeDown, prep/asset-ready-20261011; starting Git HEAD a584f03d3c6240de803ad3cc352b441d3e25de2f, clean before this session.
- Capability: authorized BigMac repo read/write, node/npm, locally served browser, installed Brave headed and headless; GitHub connector for guarded, reviewable fast-forward PR updates. No physically connected Android/iPhone and no physically received LM Arena final art.
- Scope grouped into (1) audio/startup/save resilience, (2) deterministic bulk intake and release evidence, and (3) mobile/readability/accessibility/performance checks, preserving the Canvas 2D game, physics/world, original source sprites and active 220 visual/21 audio generation requests. No new dependencies, engine migration, external art or changes to main.

### Baseline and defects confirmed
- Baseline npm ci and npm run validate: 25/25 Node passed.
- Confirmed (high): two-tab settings save could erase the other tab's earned birthday completion; reproduced failing before repair. LocalStorage provides no atomic cross-tab CAS, so simultaneous write collision remains a documented limitation.
- Confirmed (medium): AudioContext constructed before user gesture; pause/mute/restart did not guarantee clearing scheduled oscillator voices and had no outstanding-voice ceiling.
- Confirmed (medium): 320px phone layout overflowed to 345px; 844x390 mobile landscape had Start at bottom ~448px and touch actions at ~682px, both outside initial 390px viewport.
- Confirmed (medium): High Contrast existed as a saved field but had no actual UI/visual effect.
- Confirmed (medium): failed ES module dependency made title inert; a parallel BigMac browser test traced net::ERR_CONNECTION_RESET for the imported game progress module. An independent warning/reload retry now handles game-script-load failures.
- Confirmed gap: incoming generator files lacked safe multi-file inventory/stage flow; release had no static byte-graph identity report or reproducible real-time diagnostic measurement.

### Implemented
- AudioBox creates audio only after permitted user input, supports mute/pause/reset/dispose, caps live effect voices at 24, tracks/cleans oscillators, and never blocks gameplay when WebAudio fails. Main controls wire these operations and exposes read-only QA diagnostics.
- Storage reconciliation reads the current disk record before writing stale-tab settings, preserves earned completed/best score, and observes storage changes for on-title Continue updates.
- Added batch-intake CLI: exact logical-ID or canonical basename mapping, SHA-256 deduplication, PNG/WAV/OGG checks, unsafe path/symlink rejection, dry-run report and explicit --stage into ignored .asset-staging, never approval/activation.
- Added wall-clock perf-audit CLI with honest rAF, render timing, input observation, responsive bounds, browser errors, representative viewport scenarios and optional screenshots, explicitly distinct from synthetic-clock route tests.
- Added static release-preflight CLI with deterministic SHA-256 manifest, actual runtime-module/HTML/Cinnamon/approved-art checks; negative control removes a module in isolated fixture and ensures failure. CI browser workflow writes and uploads per-run static-preflight report.
- Fixed narrow 320px overflow and first-viewport landscape controls with CSS presentation only; no world/physics changes.
- Activated saved High Contrast preference: visible Pause checkbox, higher contrast HUD/menu/touch styles; persisted preference verified across reload.
- Added fixed-network-failure startup Retry Loading fallback; verified failure by aborting an actual imported module request.
- Browser tests expanded for source-art missing fallback, offline post-load, repeated resize/focus/voice lifecycle, two tabs and restricted storage, mobile action sizing/contrast, natural boss states in assisted/normal scripted routes and high contrast.

### Execution evidence
- After implementing CLI/audio/lifecycle changes: npm run validate 31/31 passed; release preflight 38 actual runtime files present, zero missing, deterministic SHA-256 byte inventory and a dirty-worktree warning as expected before commit.
- Isolated asset batch produced true 220+21 inventory, 26 source frames, zero external approved, 215 outstanding; tested malformed/ambiguous/symlink/duplicate and correct stage-only behavior.
- Browser tests run on actual localhost HTTP/Brave in separated 1-worker groups to fit bounded DEX execution: desktop group A 14 passed/1 skipped; desktop B 20 passed/3 skipped; mobile A 14 passed/1 skipped; mobile B 21 passed/2 skipped. High Contrast tested separately: desktop 1 and mobile 1 pass; accessibility rechecked after extra Pause option: 5 passed/1 skipped. No other browser failures in those bounded final passes.
- Remote headed browser rAF showed p95 roughly 205-216ms across responsive viewports, with Canvas render cost roughly 0.9-1.2ms. A 12-second sample observed 78 callbacks and roughly 3.34MB JavaScript heap at one point. This is remote-scheduling evidence, NOT proof of 60 FPS, leak freedom or mobile performance.
- Earlier oversubscribed (3 workers) browser runs failed a preview test when the local Python server reset the imported progress module connection. Trace confirmed the HTTP connection reset, not a failed art integration. Added classic-script recovery and tested Retry Loading. The single-worker grouped runs were green.
- Audio output has NOT been listened to through physical speakers. True cross-tab simultaneous writes, real user FPS, visual identity of pending art and in-person full-game play remain unverified.

### Architecture, protected identity and release gates
- No changes to original 26 Cinnamon images or their source hashes, 220 visual and 21 audio LM Arena job master, collision/camera/renderer ownership, the golden dome 23-step world or existing GitHub Pages config.
- No production final art intake, human Fox identity signoff, runtime activation of generated artwork or physical phone test. The user has not requested premature merge to main.
- Release docs: docs/ASSET_BATCH_INTAKE_RUNBOOK.md, docs/READABILITY_AND_PERFORMANCE_AUDIT.md, docs/RELEASE_REHEARSAL.md.
- Full exact-GitHub SHA CI and code review required after delivery before any release; rollback must be a normal reviewed revert PR, never force push.
- Implementation commit SHA to append once published; documentation followup separate. Existing Bible is additive.

### Round 5 final local execution receipt

The completed Round 5 static suite: **31/31 Node passed**, release-preflight checks 38 physically present runtime files. Final one-worker local browser groups: desktop 14+20+1 = **35 passed** with 4 intentional skips; mobile-emulated 14+21+1 = **36 passed** with 3 intentional skips. Follow-up mixed-project accessibility recheck after the High Contrast setting passed 5/5 executed checks with one duplicate desktop touch test skipped, not double-counted. No remaining failures in controlled final runs. This evidence is narrower than real-device FPS, speaker output, human gameplay, art approval, or hosted main deployment.

### Round 5 implementation commit receipt
- The seven-area Round 5 candidate was implemented and committed at SHA fb158f30fdb3a180325b4e0ca7770b8eeb5d1446.
- Final local verification before this commit: npm run validate 31/31 pass; 35 distinct desktop browser tests pass with four intentional skips; 36 mobile-emulated browser tests pass with three intentional skips. Browser tests were run as bounded 1-worker groups and two additional contrast checks. The static release preflight reported 38 actual runtime files with no missing files.
- This hash identifies the preparation branch, **not** a merged or deployed main release. GitHub CI must verify the final documentation follow-up SHA independently.

## 2026-10-11 — The Art Jury: unified source and playable curation 

PR #1 delivered the verified engineering baseline to main. The separate Arena branch contained 194 real PNG assets in a distinct source family. They were physically audited for hashes, pixel dimensions, identity/semantics and strict alpha. 170 pass the initial transparency contract, 24 do not. Every candidate is preserved. Actual user approval is still pending.

The new `?art=curated` switch provides an opt-in Canvas rendering layer using 28 personally chosen, SHA-verified candidates: coherent purple-scarf FOX action poses, green Shamrock Shake, a clearly independent birthday cake and hero shake, supplemental Cinnamon reaction poses, Quad scenery, cannon, Cup Crawler, beacons/checkpoints and boss indicators. The default source-art rendition, controller, level platforms and Fox behavior are unchanged.

A 194-entry gallery at `tools/asset-gallery.html` presents independent per-image reasons (28 selected, 131 alternatives, 11 revisions, 24 blocked), source bytes/hashes, compare sets and KEEP/REVISE/REJECT owner judgement with export. This is an art-direction aid rather than a synthetic approval. Original audio generation has not delivered the 21 requested recordings; procedural WebAudio remains the honest working fallback. See docs/ASSET_CURATION_REPORT.md.

Earlier true BigMac localhost candidate tests: Node 34/34 pass, static package inspection 238 files, actual browser UI/gallery/play checks pass, 23-stage assisted/normal/curated scripted gameplay reached victory. Remote builder became temporarily disconnected before final GitHub publication; exact GitHub CI must be rechecked independently.


## 2026-10-11 — Full image collection wired, original world preserved

The user requested that all assets be wired, not merely the initial curator picks. Every one of the 194 source-backed generated PNG candidates now has an explicit and testable game Canvas role (12 scene categories) and a source-verified on-demand Asset Director audition pathway. Safe candidates may be applied into the actual running scene context one per role; unsafe nontransparent candidates can only appear as labeled QA references, never as misleading collidable scenery. All 194 originals remain intact for independent review.

The Asset Director is opened from title, Pause, game HUD or an exact source ID from Art Jury. Source SHA/pixel validation, limited decoded cache, role-specific scene drawing, native dialog focus and reversible audition are deliberate architecture requirements. The old 26 source Cinnamon frames, 23-stage physics, Fox timing, checkpoint/saved state, original Canvas game and 28-image curated preview remain unchanged.

21 requested recorded audio files remain undelivered. None of the 194 generated PNGs is automatically promoted to human-approved final artwork. New Node/browser acceptance gates must prove full coverage and no regressions before merge; these claims are pending exact-GitHub-commit verification.

## 2026-10-11 — Alpha-invalid art is for review, never live visual obstruction

The full Asset Director source registry remains 194/194, one playable-context route per physically committed PNG and 12 scene categories. A postmerge adversarial pass clarified an invariant: a contract-invalid alpha source may only be inspected inside the Art Director's labeled QA Canvas, never painted as a popup inside the live game viewport. Likewise birthday finale illustrations should appear in the actual birthday state, not cover active play before victory. Boss attack telegraphs and STUNNED labels remain on top of all optional effects. Keep native inspector reachable after a persisted browser pagehide. Physical SHA manifests, user visual judgments, 26 Cinnamon reference frames, gameplay/physics and checkpoint saves are unchanged.

## 2026-10-12 — raster branch consolidation and real gameplay art visibility

- Baseline GitHub main `323dc75c89f82f3a08cf08cdec30ba98e22e7e0b`; five stale branches already contained in main. `arena/83855d4e-shakedown` provided ten separate PNG title sources (both 960x540 and 1920x1080). `art/shakedown-four-title-screens-20261011` contained SVG files only; its artwork changes were deliberately rejected under the user's explicit no-SVG production constraint while retaining ancestry in the merge commit.
- Added lazy title-image browser plus PNG-backed Game Over and Victory, keeping real Start/Continue/Retry/Replay buttons, HUD, focus and Canvas collision separate. `?art=classic` keeps the original lightweight fallback.
- Made the existing SHA-verified, structural-review-safe 28 Curator's Cut previews the default visible in-game presentation, without granting final art approval. 194 candidate IDs remain source-verified and accessible through the native Art Director, 24 structurally blocked images remain QA-only.
- Added Node PNG dimension and integration assertions plus actual browser title/selector/classic fallback journeys. CI proof to be recorded separately; mobile physical testing and human art acceptance still pending.
- Git delivery: implementation SHA to be appended after CI and merge.

## 2026-10-12 — imported uploaded three-screen artwork (same-day continuation)

- Inspected attached `ShakeDown_Screens_2026-10-11.zip`: start/level title, Game Over/Continue, Victory/Credits, each texted and clean in 960×540 and 1920×1080, totaling 12 unique PNG files plus a review contact sheet and original generator.
- Reproduced all 12 exact bytes inside GitHub Actions from the source SHA256 `2634be093b2a42249233962324047d68b80f81e2bb16fda1d5152d62bf7dfc64`; each output's SHA matched its original uploaded counterpart. The updated portable source remains in `scripts/build_uploaded_screens.py` and its reconstruction helper ensures font SHA integrity.
- Wired clean original start, Game Over, and Victory plates into the semantic title/result overlays while keeping all ten alternative title scenes selectable. Provisional visual approval, no-SVG rule, gameplay mechanics, menu/button focus, and classic art opt-out remain unchanged.
- Added PNG-byte-equality and dimension regression assertions plus real-browser checks for the title gallery, Game Over retry, and Victory replay. New final CI and live deployment pending.

## 2026-10-12 — verified main merge and post-merge CI receipt

- **PR #6 merged successfully** into main as `528a27fc96d5962c4a0b7d90765b10c78306d970`. Implementation/screens/tests are in branch ancestor `d2d9356c86bd967c6a6c3bf6851e33df8d8ee9ba`; feature head `67115fa151fd296fb730fe0a82188763519e6227`. No rebases, force-pushes or source-image deletions.
- **All seven pre-existing non-main feature/art branches** compare against main with 0 ahead commits. The SVG-only branch was absorbed as history/ancestry, not as deployed files; recursive main tree contains exactly zero SVG files.
- **Source integrity:** 12 delivered PNG Start/Game Over/Victory plates match all twelve corresponding uploaded-ZIP SHA-256 hashes. The main tree also retains 20 raster alternate-title PNG files, 26 source-derived Cinnamon PNG frames, 194 inventory-backed Arena images, six recorded MP3s and the 194-entry Art Director. The 28 physically verified preview-safe images render by default; 24 failed-alpha candidates remain QA-only; `?art=classic` remains functional.
- **GitHub main CI:** Game and asset contract SUCCESS, run 38204739793. Browser desktop/mobile SUCCESS, run 38204739823: 99 passed, 8 intentional skips, and one retry-passing flaky audio test (`tests/browser/audio.spec.mjs`). Do not interpret the retry as an audio defect fix.
- **Delivery scope:** exact GitHub main commit and automated browser/input/gameplay flows verified. Pages live-site content, unassisted human play, physical Android/iPhone and speaker output, and final visual sign-off remain not independently verified.

## 2026-10-12 — recorded-audio pause/resume race repair

- GitHub `main` artwork merge `528a27fc96d5962c4a0b7d90765b10c78306d970` passed the browser workflow with 99 direct passes, 8 intentional skips and one retry-only audio flake. The intermittent assertion was `musicPlaying` false following Pause/Resume on the boss track.
- Root cause: `HTMLMediaElement.play()` may reject asynchronously with `AbortError` after an intentional `pause()`; the old catch unconditionally marked any rejection except `NotAllowedError` as a broken MP3. A stale rejected promise could thereby blacklist the sole boss track while a new play had already resumed.
- Change: scope errors to the exact active play attempt and current media element, ignore expected `AbortError` cancellation, retain `NotAllowedError` handling and genuine hard failure quarantine. No MP3 bytes, sound mix, game physics or event semantics change.
- Deterministic delayed-play unit test simulates pause/rejection/resume before the prior promise settles and verifies no track blacklist, no fresh Audio element and successful replay. Latest CI after merge to be recorded separately.

## 2026-10-12 — Provisional world-art runtime repair (branch: fix/production-art-world-20261012)

- Baseline `7103b7e987678d0c376ce04b5a6d5a9a2a03b4f2`; retained Canvas 2D engine, all level coordinates, checkpoint/physics/boss timing, sound, original 26 physically extracted Cinnamon frames and 12 supplied screen PNGs.
- Explicit 35-ID alternate shortlist added **only to the provisional curated scene path**, alongside the unchanged 28 preview images. Each image is source/path/SHA-256/dimension checked before decoding. All blocked/revise entries stay excluded; `assets/runtime/manifest.json` stays empty, with zero final owner approvals claimed.
- Live Canvas game now draws Notre Dame campus/dome/summit backgrounds, real masonry windows, columns, dome/statue/railings, outdoor furniture, banner bridges, moving decks, drums/checkpoints, event effects and birthday scene decorations. Original `?art=classic` is unaffected.
- Verified: `npm run validate` 47/47; `tests/browser/world-scenes.spec.mjs` 2/2 desktop/mobile; `curated.spec.mjs` 8/8; `route.spec.mjs` 3 desktop completions and 3 intentional mobile skips; `screen-art/accessibility/boot` 12 passes and 2 intentional skips. Test runtime = locally served BigMac Brave/Playwright, not physical phone/hosted site. Diagnostic gameplay screenshots: `docs/qa/art-repair-{quad,ascent,summit}.png`. Exact GitHub CI and Pages are **pending** in this checkpoint.
- Not resolved: full original `ShakeDown_Cinnamon_Art_PreHandoff.zip` binary (SHA-256 `e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb`) is not in this checkout or available as a raw restored package. Preserve the original source requirement; no visual-fidelity signoff until it can be compared and approved.
- See `docs/ART_RUNTIME_REPAIR_20261012.md` for the evidence and limitations.

## 2026-10-12 — OMNI guided rally, cheer-counterplay and recognition

### Repository state
- Starting source: `westkitty/ShakeDown` `main@e1f98f35c092159018e05604141d818ba5a356a6`, clean BigMac clone; MacBook has independent synchronized checkout and three untouched untracked asset-planning files.
- The user said OMNI as a continuation of Shakedown improvement. Original Canvas/physics/animation/audio/persistence/art authority stays intact; no rewrite, SVG import or new package.

### Goals, bounded design and comparative precedents
- Accepted three groups: (1) legible wayfinding for 25 previously built optional rally platforms, (2) one narrowly timed Fox-cheer interaction without health change, (3) real in-game end-screen/high-score reward for four optional rally bells.
- External scout favored clear mechanic teaching and nonmandatory timed bonuses: Yacht Club's authored checkpoint lessons, Celeste's checkpoint-icon visibility, and Microsoft XAG 116 timing alternatives. These are advisory; gameplay facts come from Shakedown source.
- Rejected speculative renderer replacement, extra uncited art generation, new level-width expansion, migrating localStorage and new audio dependencies. Performance changes require a measured bottleneck.

### Baseline and implementation
- Baseline `npm ci` and `npm run validate` 56/56 PASS, `npm run release:preflight` PASS.
- Four distinct non-colliding rally signs in South Quad/Gallery/Cornice areas, a read-only dynamic rally guidance module, responsive textual cue and recovery-window prompt.
- At Fox recovery, nearby cheer adds at most 0.48s (2.1s cap), using the original 6.4s cooldown, no boss damage/cancel, with WebAudio and VFX event cues.
- Victory now reads actual relay count and sets RALLY LEGEND only on 4/4. Existing schema-1 saves gain optional monotonic bestRallies; earlier settings/records still work.

### Validation and evidence
- Local focused Node proof for signs, guidance, cooldown, Fox-state restrictions passed.
- Continuous no-warp default-difficulty simulation traversed from normal spawn through quad-training-1 and rally-quad-01/02/03, rung the actual Canopy Bell and physically collected its SHA-backed Shake with enemies/cannons active.
- Desktop/mobile browser direct tests: 7 PASS, 1 intentional touch-only desktop skip; includes real keyboard/touch interaction, mobile layout and QA-positioned four-bell ending.
- Further full browser suite and remote exact-commit GitHub checks must be evaluated separately before delivery claims.

### Important limitations
- No physical device/speaker test or human-paced complete playthrough; fixture-assisted four-bell setup is not a natural four-bell route proof.
- Earlier Cinnamon run_03 crop defect persists. Provisional generated art is not automatically approved. No existing checkpoint IDs, 23 Dome steps or Fox three-hit win are deleted.
- Implementation notes: `docs/OMNI_FOLLOWTHROUGH_20261012.md`; screenshots `docs/qa/omni-rally-*.jpg`.

### Git delivery
- This is an append-only source-bible checkpoint before final release; actual commit, GitHub CI, main merge, MacBook sync and Pages publication require independent receipts.

### OMNI final local QA note
- 61/61 Node PASS; release preflight PASS. Full local Brave browser matrix 111 PASS/10 deliberate SKIP/1 FAIL (mobile focus at initial Start); that focus test then passed 5 of 5 targeted repeated reruns, no speculative fix. Pending exact commit CI.
- Matched four-viewport render p95 ms before [1.7,1.5,1.6,1.1] and after [1.4,1.9,1.3,1.4]. Headless remote rAF ~200ms: cannot infer physical-device FPS or measurable performance uplift. No browser JS errors.

## 2026-10-12 — OMNI II meaningful autosave and startup resilience (local continuation)

### Intake and fixed scope
- Continuation branch `feat/omni-rally-followthrough-20261012`, starting commit `6608537c6f397a0a6555267f4ef808b14846d3b4`. Public main at intake: `e1f98f35c092159018e05604141d818ba5a356a6`. Tracked work clean; MacBook separately retains three untracked LM Arena asset production files.
- Three bounded groups: meaningful earned-progress durability, native accessible optional-objective journal, and startup/title-focus readiness. No new dependencies, SVGs, sprite bytes, renderer, physics, checkpoint location, Fox damage semantics, or asset approvals.
- Baseline `npm run validate` **61/61 pass**, release preflight pass.

### Reproduced defects
- Checkpoint persistence wrote only after a new checkpoint index. Two new desktop browser tests reproduced absent index-0 Welcome Lawn save after a meaningful item and absent rally-bell persistence after checkpoint 1 until the next checkpoint was reached (red tests 2/2).
- Mobile browser load exhibited the Start control visible while its module handler was not yet initialized. A tap during that window could be inert; a deliberately delayed import now has an automated guard.
- Optional objectives could be viewed in dynamic on-field guidance and the end screen but lacked an on-demand four-item status ledger at Pause.

### Corrections
- New `progressToken` over checkpoint, collected Shakes, lit bell count, defeated Cup Crawlers; write a minimal schema-1 checkpoint record only on meaningful changes (not each simulation frame). Early actual earned progress permits an index-0 Welcome Lawn Continue; blank spawn cannot. Reject saved locked relay prize without the actual lit bell. Storage denial is surfaced as warning while gameplay remains playable.
- Add native `<details>` Rally Journal within Pause, four canonical label/status/region rows, collected-vs-unclaimed reward status, a title best-rallies tally, and nonplaying native disabled touch buttons. Pause Tab focus containment includes native summary.
- Gate visible Start, title Art Director and curator toggle until actual handlers are installed; one-shot initial focus recovery avoids hijacking a separately focused control. Deliberately delayed-module test verifies no inert early-click path.
- Retain every asset, 23 Dome steps, six checkpoints, current level geography and Fox fight.

### Local evidence and gaps
- New Node progress tests and existing suites **64/64 pass**; release preflight pass.
- Targeted desktop/mobile browser tests covering persistence, journal and delayed startup **10/10 pass**, with earlier red reproduction retained in the separate report.
- One separate concurrent Playwright invocation collided with an active runner's shared test-results directory (missing trace ENOENT), a QA-environment mistake, not an application defect; subsequent browser runs must serialize or isolate output.
- Full matrix, exact-commit GitHub CI and live Pages release are separate final gates, not claimed before their receipts.
- See `docs/OMNI_PROGRESS_RELIABILITY_20261012.md`; remaining external GitHub verified-email requirement and physical-device/human art approval limits unchanged.


## 2026-10-12 — AAA Canvas visual finishing, source-preserving candidate

- User-approved purpose: improve Shakedown's actual existing Canvas game visuals, not create images/mockups or rewrite the engine. Starting tree feature branch `feat/omni-rally-followthrough-20261012` at `6608537` already contained uncommitted OMNI II autosave and Rally Journal work; all prior changes and source visual-identity locks retained.
- Three cohesive improvements: (A) material-specific platform grounds, low-cost campus/Dome light grading and depth; (B) visually subordinate chant timing UI, real-state boss segmented HP, original-Cinnamon-sprite dash/landing accents and bounded event particles; (C) cohesive blue/brass UI, focus/pressed/touch states and readable native mobile timing. `src/game/visual-finish.mjs` caches procedural visual surfaces once per Canvas context; no new production dependencies and no physical PNG source modification.
- Actual 8-scene screenshots before and after: `/Users/bigmac/shakedown-visual-qa-20261012/{before,final}`; in-game source and fixture report `docs/AAA_VISUAL_FINISH_20261012.md`.
- Node and asset: 64/64 pass. Focused browser: 13 passes/3 skips. Full browser: 126 passes/12 skips/2 intermittent fails (initial title focus during delayed loading and forbidden-art pixel comparison). Both cases passed twice independently, 4/4 reruns; cause not fully determined. Do not claim full matrix PASS.
- Render p95 matched audit before -> after (ms): desktop 1.1->1.2, portrait 1.1->1.5, landscape 1.4->1.8, narrow 1.2->1.7; 0 browser page errors. Remote headless rAF ~200ms cannot prove real phone FPS; this is measured visual expense, not an FPS uplift.
- No commits, remote pushes or live Pages deployment requested or done by this pass. Previous `run_03` clipped source, provisional Fox/art approvals, and physical Android validation remain unresolved. Existing UI/save/gameplay/test contracts preserved.

### 2026-10-12 — AAA finishing final QA supersession

- Final **140-case** desktop/mobile Playwright browser run **128 passed / 12 intentionally skipped / 0 failed**, exit 0. Underlying log `/tmp/shakedown-aaa-full-final.log` on Big Mac.
- Explicit previous 126/12/2 run is retained as a valid earlier exploratory failure record. Two intermittent cases subsequently passed repeated focused tests, and the full final matrix has now passed without weakened asset approval assertions.
- 64/64 Node/asset and preflight PASS; measured Canvas p95 render changes before/after are documented in `docs/AAA_VISUAL_FINISH_20261012.md`.
- No automatic Git commit/push/deploy; the verified candidate is a local tree with cumulative preserved OMNI II reliability changes.

### Final device receipt — AAA visual candidate

- The full 16-file local source candidate now exists on Big Mac and MacBook at `/Users/andrew/shakedown` (case-insensitive canonical `/Users/andrew/Shakedown`). Verified transfer tar `84bfbed9...`, per-file SHA manifest and three protected asset-planning document hashes match.
- Big Mac entire desktop/mobile browser suite: **128 pass, 12 expected skip, 0 fail**. MacBook: **64/64 Node/asset PASS**, preflight PASS and **3/3 focused Brave browser smoke PASS**.
- Locally served at `http://127.0.0.1:8765/`, HTTP 200 with verified renderer source hash. No Git commit, push, deploy or claim of physical-device FPS.
