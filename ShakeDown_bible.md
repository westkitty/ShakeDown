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

## 2026-10-12 — Secret Smudge/Dexter encounter reconstruction (branch: feat/secret-npc-reconstruction-20261012)

- The earlier statement that 62 tests had passed for the secret encounters was an **unverified external completion claim**. The expansion source, tests and character sprite directories were absent from the known GitHub main and checked-out feature worktree. This branch **reconstructs** the requested work against main `e1f98f3`; it does not claim to recover the missing worker's original source.
- Verified local user-supplied inputs: `/Users/andrew/gemini_spark/smudge_spritesheet (1).png` and `dexter_spritesheet (1).png` (each RGBA 960×640), plus the corresponding four-frame 280×200 illustrated idle GIFs. Authored transparent PNG frames, retained source sheets and emitted physical-byte SHA-256 manifests at `assets/sprites/{smudge,dexter}/`.
- The original Canvas 2D player, 23-step Dome ascent, rally route, authored checkpoints, Fox showdown, shader-free rendering and schema-1 saves remain intact. Two optional bidirectional authored detours, cheering Gothic Smudge alcove, solitary starlit Dexter summit, manifest-driven idle animation, proximity dialogue, idempotent achievements and gold discovery UI are integrated. Discovery state persists through checkpoints, storage reload, victory and replay.
- Added seven encounter test cases (two-way real-input platform reachability, asset SHA/dimensions, trigger/idempotence, schema-1 compatibility, alcove/summit camera) plus an explicit eighth regression fixture enforcing zero camera Y offset on the normal campus. Found and corrected a real camera regression that had shifted the old campus cup: only the lower secret alcove may use positive camera Y; the original campus clamp remains zero.
- Recovery baseline: GitHub main `e1f98f35c092159018e05604141d818ba5a356a6`; reconstructed feature head before final review `936fb5507fe27729a66bd6db45aaa0f6cb64e592`. Independent review found four release gaps: hosted/static NPC asset parity, dialogue accessibility/occlusion, missing-frame animation fallback and a summit night layer narrower than the viewport. The branch now SHA-256 verifies every NPC frame in the browser and release artifact, includes all NPC files in Pages parity, announces actual dialogue, suppresses the global chant banner inside encounter scenes, falls back only to another verified frame of the same character, and paints the night sky across the full summit viewport.
- Final local candidate evidence: `npm run validate` 65/65; release preflight PASS with 263 physically hashed files and no missing entry; installed-Chrome Playwright 112 passed / 10 intentional project skips across desktop and mobile emulation; four real-time performance scenarios passed with no page errors, about 60 measured frames per second and 44 CSS-pixel-or-larger touch targets. Desktop and mobile Smudge/Dexter screenshots were inspected after the repair. Exact feature-head GitHub Actions, merge commit, post-merge main Actions and public Pages byte/browser parity remain separate release gates until recorded below.
- Not claimed: unassisted complete two-secret human playthrough, physical Android device rendering, or final owner sprite/artistic approval. The encounter geometry segment tests perform bounded per-platform simulated input; visual screenshots use developer QA camera teleport only for rendering/trigger assertions. The two evidence types are not interchangeable.

### Secret encounter release receipt

- Feature release candidate `1e7f9ed7a1e447bdb78aadabe4ea0c557a601d18` passed both content runs `38314028876` / `38314033511` and both full browser runs `38314028868` / `38314033615`. PR #12 was then merged normally into main as `a8b3f5f31eec8e568649545dec9b0f5b677082f8`; the remote feature branch was deleted only after the merge.
- Exact merge-SHA Actions passed: content `38314483899`; desktop/mobile browser `38314483870` with 112 passes and 10 deliberate project skips; Pages deployment `38314483861`; public Pages byte/browser smoke `38314483915` with 13 passes and one deliberate project skip. The public verifier independently matched SHA-256 for 42 authoritative files and observed correct HTML, JavaScript, JSON and PNG response content types at `https://westkitty.github.io/ShakeDown/`.
- A wider 122-case Pages run exposed seven test portability assumptions rather than deployed encounter defects: localhost-only unverified-art preview was correctly unavailable on the public origin, two studio cases raced their asynchronous hosted contract load, and one static-pixel comparison left decorative motion active. The test-only follow-up waits for the contract, asserts the public-origin preview prohibition and freezes decoration for that invariant. Its focused matrix passed 8/8 on localhost and 8/8 on Pages; the complete public desktop/mobile matrix then passed 112 with 10 deliberate project skips.
- Asset fidelity limitation: each 960×640 supplied character sheet produced four retained 280×200 RGBA timing frames, but only two unique frame hashes per character. Smudge alternates `0df75f…` / `db8fb6…`; Dexter alternates `b258c2…` / `de9079…`. No additional poses were fabricated. Owner artistic approval and unassisted physical-device play remain open human gates, not release proof.

## 2026-10-12 — OMNI accepted P003: fractional assist health visibility

- Scope: exactly P003; fixes existing fractional damage HUD discrepancy without changing actual health, physics, saves, or difficulty.
- Baseline: isolated clone at main e3dfeac8; fresh Big Mac working tree clean; `npm run validate` 65/65 before edits.
- Source proof: assist damage uses 0.5 health; old HUD rounded upward with Math.ceil, concealing the first hit.
- Change: half-heart visual states and explicit numerical accessible name; seven deterministic state regressions plus browser UI regression.
- Preserve: Canvas engine, checkpoint schema, other four accepted proposals for later individual commits, all art/source files.
- CI/browser run receipts and Git commit identity are recorded in external delivery summary. No Pages/main deployment authorized.

## 2026-10-12 — OMNI accepted P004: responsible browser and target-device baseline instrumentation

- Starting point: P003 implementation/push 49fda00bcd96351cd0140f9cf1a75dbcab90c990.
- Scope: extend the existing real-wall-clock performance audit with same-context empty-page rAF calibration, optional classic/curated mode, p99 intervals, Canvas width, network resource bytes and asset availability; no render or collision optimization.
- Hardware discovery: Galaxy Tab S9 Ultra SM-X910, Android 16, Chrome 154.0.8037.126 physically reachable through MacBook ADB; Chrome DevTools HTTP endpoint over ADB tunnel returned empty responses despite a socket. Android gfxinfo after a seven-second game sample yielded one Android UI frame, which is NOT a measure of Canvas frame pacing and must not be labeled FPS proof.
- Physical phone/tablet FPS, game input latency, audio, heat, memory drift, and 30-minute play remain evidence gaps until on-device JavaScript tracing is available. Empty browser slowdown must not be misattributed to the game.
- Browser and Node validation details and Git hash are recorded in the delivery summary. Push to feature branch only; no main deployment.

## 2026-10-12 — OMNI accepted P001: player-first shell with opt-in workshop

- Starting point: P004 feature commit 2364ee78960ff09acbd59c3094cd1eef27d619cc, pushed to feature branch.
- Problem: live title and HUD prominently exposed development Art Director, 194-image review, provisional-art status and eleven alternate-screen selectors; first-time invitation was visually crowded.
- Change: title and pause place the existing (unmodified) art director, gallery, curated toggles, status and raster-title selector behind keyboard-operable Workshop details. Gameplay HUD no longer exposes development-only button. Reduced title copy avoids spoiling secret NPCs.
- Safety: boot failure automatically opens Workshop so Retry Loading remains reachable. Gallery deep links, standalone Asset Control Room, Art Jury, hash-only approval gate and QA endpoints remain available.
- Existing tests updated to explicitly open the workshop when exercising tools; a new player-first regression prevents restored HUD/title clutter. No physics, music, art images, or save schema changes.

## 2026-10-12 — OMNI accepted P002: bounded portrait viewport experiment

- Starting point: P001 feature commit 1f69ff7e2b167b9d2aff59e1399a3b574a055483.
- Hypothesis: a portrait playfield around 44dvh high, aspect-preserved and horizontally panned to the player, is more readable than a 200px 16:9 strip without rewriting the 960×540 authoritative game.
- Approach: CSS-only enlarged display height, clipped canvas composition; compositor translate3d based on existing authoritative player/camera coordinates. No physics, camera position, checkpoint, boss timing, asset or engine modification.
- Baseline 390×844 Big Mac mobile-emulated Chromium: canvas 372×209.25 CSS pixels, empty-page/game rAF p95 both 100ms (host-constrained), Canvas draw p95 1.3ms. Measurements after change must use identical conditions and distinguish host throttling from game cost.
- Guardrails: desktop and landscape remain 16:9; portrait player stays onscreen after motion and source Canvas ratio remains 16:9; restore CSS fallback if cropping loses boss telegraphs or fails actual-device play.
- Real physical Android performance still requires on-device JS tracing, not Chrome gfxinfo UI frames.

## 2026-10-12 — OMNI accepted P019: shipped-art acceptance evidence and gated release status

- Scope: read-only project-aware audit of the 63 selected provisional production PNGs, Cinnamon canonical sheet/26 frames, Smudge/Dexter source+animation, and current title/result plates. Every selected PNG is hash/dimension verified against manifests; no artwork, review source records, or runtime approval ledger changed.
- Critical provenance distinction: `assets/production/approvals.json` has historic FOX-01 project-owner character **design** approval, but it is NOT SHA-bound to `assets/production/fox/fox_01.png` and does not establish runtime final acceptance. Preserve that decision without elevating it to a false file-specific approval.
- Added `npm run art:acceptance` for a deterministic JSON report, optional 63-source Markdown checklist and `--require-approved` release gate (exit 2 while final human art acceptance remains incomplete; 3 on integrity errors). This gate is opt-in and does not falsely invalidate existing gameplay or static CI.
- Review handoff: `docs/P019_OWNER_ART_ACCEPTANCE_20261012.md`. Separates technical validity from actual visual judgment and owner signoff, calls out absent original pre-handoff Cinnamon ZIP, and requires explicit source-bound final integration later.
- Outcome: automation and review handoff implemented, artistic signoff BLOCKED pending owner. Game engine, save schema, assets, source hashes, provenance records and default artwork unchanged. P019 source-verified is NOT P019 artistically complete.
- Browser QA observation: one broad-suite run sampled the title Canvas before post-load source frames were painted, giving a misleading blocked-art pixel delta. The isolated test passed. Strengthened the pixel invariant to sample only after two frames following sprite readiness; rerun passed all 7 desktop Art Director/product-shell checks.


## 2026-10-12 — QQQ Smudge facial-overlay removal

- **Correction:** During the "SMUDGE #1" encounter, `src/game/secret-actors.mjs` drew two translucent dark, gold-stroked rounded rectangles, with specular bars, **after** the authentic Smudge sprite. This runtime Canvas overlay, not the PNG source, produced the apparent electronic visor obscuring his face.
- **Source evidence:** `assets/sprites/smudge/frames.json` maps all four idle frames to two unique 280x200 RGBA poses. Both distinct PNG poses were examined and already contain Smudge's intact blue eyes, muzzle, and Siamese markings. Their source sheet, hashes, dimensions, and animation anchors remain untouched.
- **Repair:** Delete only the unauthorized facial rectangles/specular bars in `paintSmudge`. Preserve manifest-driven frame selection, image placement and scaling, crowd, scenery, interaction, Cinnamon's black glasses, and all other character artwork.
- **Regression:** Add `tests/browser/smudge-face.spec.mjs`, sampling **real running Canvas pixels** over Smudge's face for two animation poses in desktop and mobile Chromium. Before correction it failed with **584 exact #dfbf71 visor pixels** in the first desktop pose. After correction it passed 2/2 focused cases, requiring zero visor-color pixels, visible blue eyes, eight loaded NPC sprites, and no page errors or missing sprite responses. Each run captures desktop/mobile encounter screenshots.
- **Validation from isolated Big Mac repair branch:** `npm run validate` PASS (73/73 Node tests). `npm run release:preflight` PASS (265 files, zero missing; dirty-tree warning expected before commit). Combined secret-encounter + facial regression browser matrix PASS (9 passed, one intentional project skip; 37.6s), including persistence, collision-discovery flow, mobile journaling, and SHA-integrity rejection.
- **Art integrity:** No PNG, frame manifest, curated art, dependency, config, or `assets/production/approvals.json` edits. Existing P019 approval ledger preserved byte-for-byte (SHA-256 `7dd54003a72232c0fb7659a7d68949c56c9936e1d301f1a4387f82d62b00e0bb`). No artistic approval was invented.
- **Git baseline:** `main` `37d83b5286de6ce2b7741d4077081aa19fa4d0f3`; isolated local branch `fix/smudge-face-unobstructed-20261012`, created from a clean checkout. GitHub PR checks, main merge, Pages deployment and exact live-site smoke remain separate gates and must not be labeled complete until independently verified.

## 2026-10-12 — October Shamrock Shake opening / title sequence

- **Story lock:** Cinnamon Fuzzbutt finally obtains a normally seasonal Shamrock Shake **in October**. It is rare because of the calendar, not because it is a pumpkin-flavored or Halloween shake. A Fox steals the green shake; Cinnamon pursues. Three sequential independent generated cards are stored as optimized 960×720 WebP with source and byte hashes in `assets/intro/manifest.json`.
- **Uploaded title source:** `1000223350.mp4` (SHA-256 `fd6e9a2aaac7ff8f0247ad3c09099bbe559d08dd0f594b9c3614ddcbdd1d6d80`, approx. four seconds, original black background). An alpha-keyed, silent VP9 WebM of Cinnamon's animated title is displayed over the **previously unused normal-gameplay** Golden Dome still `assets/level1/backgrounds/bg_05_golden_dome_hero_backdrop.png`; a compact MP4 and transparent poster are supplied as display fallbacks. The video has been tested to decode in Chromium; the corner alpha is zero in WebM.
- **Behavior:** Existing title UI remains navigable, including its previous eleven selectable title plates and Classic option. An explicit first keyboard/pointer gesture unlocks a dedicated title song (`campus-untitled.mp3`); Start switches to a different existing campus track. No new downloaded music, audio provenance changes, or additional audio dependencies. Story screen automatically advances every 4.3 seconds, supports Next and Skip, accessible captions/alt text, keyboard ArrowRight/Escape, visibility pause, reduced-motion fallback, and image load fallback. Physics, checkpoint persistence, input ownership, boss cues, and other audio remain unchanged. Game mode remains `title` while viewing story cards. Continue from existing checkpoint skips the prologue; legacy browser gameplay tests use `?skip-intro=1` or existing `?qa` bypass; `?qa=1&intro=1` exercises actual new journey.
- **Asset governance:** The six intro media assets (three panels, WebM, MP4, poster) are byte-verified by `npm run release:preflight` (SHA-256, safe paths, container signatures). Independent supplied animation and revised generated cards have provenance recorded; they are not silently counted as reviewed P019 production art. Existing `assets/production/approvals.json`, Smudge/Dexter sprite hashes, and user-provided 26 Cinnamon frames are untouched.
- **Local validation:** `npm run validate`: **73/73** PASS; `npm run release:preflight`: PASS, 274 referenced files, zero missing; `tests/browser/intro-story.spec.mjs` as of second full run 10/10 desktop+mobile PASS; additional real WebM alpha-decode checks 2/2 desktop+mobile PASS. Legacy desktop title/smoke tests 10 PASS, one intentional project skip. Broad CI, merge revision, hosted Pages verification and real physical Android remain separate gates, report only after evidenced.
- **Commit/delivery status:** Feature branch `feat/shakedown-shamrock-intro-20261012` staged media on GitHub `75e6a825`, poster addition `c48a8e7b`. Source implementation and documentation commit, subsequent CI, PR merge, and hosted deploy evidence should be appended after completion; do not claim them until independently observed.


## 2026-10-13 — Stinky Weasel branding before title (owner video)

- **Sequence lock:** On an ordinary page visit, show the owner's uploaded Stinky Weasel **Entertainment** CRT ident before displaying the existing animated Golden Dome/Cinnamon title and its selectable title art. Clicking Start still plays the three corrected October Shamrock Shake story screens before activating the unchanged platformer. The bumper's wording is preserved as supplied; no reinterpretation as game lore or replacement of established Stinky Weasel Productions naming.
- **Source and provenance:** User upload `1000223481.mp4`, SHA-256 `9a1850ddbc60e5f72df377a3130c25b20584db98d9a3c3e64f0a23f1b95b268f` (1280×720, 30fps, 8.010998 seconds, H.264/AAC, 7,650,158 original bytes). The exact supplied video is re-encoded as `assets/branding/stinky-weasel-brand.mp4` (H.264 + AAC; 1,169,865 bytes; SHA-256 `2508268e0f785a7e3a781565281d25cbc22585b0ffa1e329152b08125e729782`), plus a 960×540 WebP still `assets/branding/stinky-weasel-brand-poster.webp` (21,012 bytes; SHA-256 `de2d667724a9fc3b02530b7432177153815aca3a8548ce0afacfa134d209cd03`). All source data and runtime contracts are stored separately in `assets/branding/manifest.json`.
- **Playback contract:** Full-viewport 16:9 letterboxed branding overlay appears on initial load, without user action; clip autoplay is muted to satisfy browser restrictions. PLAY WITH SOUND is an explicit user-gesture toggle that rewinds and enables the soundtrack; SKIP INTRO and Escape provide immediate release. On video end, restore game title and focus; the ident never starts gameplay, interferes with collision input, overwrites saves, nor plays simultaneously with title/campus recorded music. The global mute setting is respected for game audio, while ident audio is user-requested separately. A failed media request falls through to title; a bounded watchdog protects against stalled playback. Reduced-motion users see a short still-card brand cue instead of unsolicited video animation.
- **Opt-outs:** `?skip-brand=1` explicitly omits branding; existing `?skip-intro=1` also omits branding and narrative for gameplay-only browser tests; `?qa=1` skips branding unless `brand=1` is explicitly set. Only `?qa=1&brand=1&intro=1` exercises the complete new QA journey. Bypassed routes do not fetch the movie.
- **Integrity and scope:** The release-preflight checker validates branding image/video SHA-256, byte lengths, signatures, source geometry and narrative ordering. Its fixture copies the branding files and checks the actual media reachability. No P019 art approval records, original sprite bytes, collision logic, title cards, music recordings, dependencies, checkpoint schema, or shamrock intro assets are altered.
- **Verification evidence (pre-merge):** `npm run validate` PASS (73/73), `npm run release:preflight` PASS (278 reachable files, zero missing), `tests/browser/branding.spec.mjs` PASS (14/14 in desktop + mobile Chromium), including first-load decoding, gesture sound, Skip/Escape, video-error fallback, reduced-motion, and full title/story/play handoff. Additional CI results, merged SHA and public Pages verification must be collected and must not be inferred from local passes.
- **Slow-decoder QA correction:** The original fixed wall-clock cutoff interrupted active media in software-decoded Chromium (~0.2× playback speed). The bumper now monitors media-time progress with a 7.5-second stall detector and a 65-second hard ceiling; paused/hidden states suspend both budgets. Desktop full-clip end-to-title observation PASS (44.2 seconds under slow software decode). Final local rerun: 73/73 Node tests, release preflight 278 referenced assets/zero missing, 14/14 focused desktop/mobile branding tests, and 10/10 pre-existing title, narrative, and Smudge regressions PASS.
- **GitHub CI corrective pass:** The full push-browser suite caught a startup-import failure regression: the new ident blocked the existing `RETRY LOADING` button when a required ES module failed to import. Fixed the classic inline boot watchdog to expose the title/retry path independently of any ES module, and to honor `?skip-brand=1`, `?skip-intro=1`, and QA bypass before import. Added an explicit module-failure-then-retry test in `tests/browser/branding.spec.mjs`; both the original `tests/browser/boot.spec.mjs` and the new recovery test now PASS in desktop Chromium. Original navigation, media, and screenshot tests remain enabled; no tests were disabled to clear CI.


## 2026-10-13 — AAA visual finishing pass and fullscreen mobile regression repair

- **Scope and authorization:** A bounded overhaul of the **existing playable** Canvas 2D ShakeDown; not a reconstruction. Baseline was local worktree from `6c0f95e` on existing `feature/landscape-gesture-pad-20261013`; isolated session branch `feature/aaa-visual-20261013`. Source, tests, styles and documentation were modified in place. This task did not authorize pushing, merging, or deploying.
- **Preservation:** Existing 960×540 game simulation, 23-stage ascent, Cinnamon/Fox/Smudge/Dexter identities, Cheer, hazards, collisions, checkpoints, saves, birthday/victory sequence, branding, audio, and SHA-bound provisional art status remain authoritative. No image, asset-approval ledger, dependency, save format or game-physics mutation. Classic/curated presentation stays reversible.
- **Visible changes:** New `src/game/visual-finish.mjs` draws atmosphere, campus leaf drift, summit dust, restrained vignette, cull-bounded architectural/ground material depth, and contact shadows. `src/game/render.mjs` adds more structured opening shake stand, camera-culling and impact/pickup effects, dash afterimage, compact chant plaque and segmented Fox HP display; Fox warning remains independently drawn. `src/styles.css` unifies navy/brass UI, focus states and translucent mobile overlays. `index.html` has a small silver shamrock in the existing **square** D-pad. Swipe input now coexists with held keyboard controls; down gesture still means existing Dash, not new slide physics.
- **Performance and accessibility:** Soft ambience is cached as half-resolution Canvas layers; repeated effects are deterministic, bounded and culled. Reduced Motion retains its established gameplay clock, disabling environmental decorative movement. A new touch colour-transition briefly prevented the required high-contrast solid Jump state; fixed by removing touch background tweening. Desktop/mobile high-contrast regression subsequently passed 2/2.
- **QQQ test repair:** The *parent gesture branch* changed landscape gameplay to a full-viewport panel with `object-fit:contain` artwork and hid the old directional/Jump buttons. Two inherited tests still expected a 16:9 outer viewport and measured hidden buttons as interactive targets. Updated `tests/browser/mobile-framing.spec.mjs` and `tests/browser/readability.spec.mjs` to check intrinsic 16:9, full-screen cover, active 44px+ targets, gesture pad 100px+, accessible launch and no overflow. Focused regression: 7 passed, 3 intentionally skipped.
- **Validation:** `npm run validate`: 73/73 passed. `npm run release:preflight`: PASS, 279 referenced files, 0 missing, dirty worktree warning (therefore not a frozen artifact). Three deterministic full gameplay routes, assisted/normal/curated, each reached the actual Fox defeat, birthday and replay. Three-zone + landscape `scripts/visual-quality-audit.mjs` passed with zero page errors and live movement. First full browser suite: 154 passes/14 skips/2 legacy-layout failures. **Final rerun: 156 passed, 14 intentional skips, 0 failures out of 170 desktop/mobile cases.**
- **Performance measurement limit:** Real-clock Chromium desktop and emulated landscape short samples had Canvas draw p95 ≈1.4ms, but remote rAF p95 ≈116–133ms; this is *not* measured iPhone/Android FPS or control latency. No physical Android ADB device was available for hardware verification. Screen captures are local diagnostic files, not a product dependency.
- **Defect ledger:** high-contrast transition **fixed and verified**; stale full-bleed/mobile touch assertions **fixed and verified**; transient visual-cache initialization errors encountered during implementation were repaired, with final live Canvas/browser passes. P019 owner art acceptance, real iPhone Safari touch/rotation, long-run device performance, post-commit CI and Pages parity remain **unverified / deferred**.
- **Artifacts:** `docs/AAA_VISUAL_FINISH_20261013.md` describes visual scope, checks and limits; tests added in `tests/browser/visual-finish.spec.mjs`. No new generated source artwork was introduced or licensed externally. Delivery: local isolated feature worktree only, **not committed or pushed**, not deployed to Pages.

### 2026-10-13 — Visual finish delivery provenance
- Exact implementation and regression-test commit: `66e062b9adaff579507d1c7cf0cfd64d3e05038d` on `feature/aaa-visual-20261013`. This entry identifies the implementation commit without changing its contents.
- Local verification before delivery: 73/73 Node tests, 156/156 applicable desktop/mobile browser tests (14 deliberate skips), and release preflight success with 279 referenced files and no missing bytes. Remote CI, pull request merge, Pages deployment, and live-site parity require independent subsequent receipts; no result is presumed in this entry.
