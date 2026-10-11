# ShakeDown evidence ledger

## Confirmed executed work
- `node --test tests/*.test.mjs`: 12 passing platforming/mechanics/boss/event-ledger/step-reachability tests on Oct 11, 2026.
- `node --check`: production JavaScript modules parsed without syntax errors.
- Chromium runtime: the real ES module source was concatenated for test injection into an empty Chromium DOM because host navigation is blocked (`ERR_BLOCKED_BY_ADMINISTRATOR` on localhost, file and data URLs). The HTML/CSS, 26 real PNG source cut-outs, Canvas renderer and interaction logic executed with **0 uncaught page errors** at 1280px desktop and 390px mobile viewport. Screenshots inspected for opening scene, quad, Dome ascent, summit, Fox battle and birthday finale. See `docs/PROJECT_STATUS.md` for limitations.
- Fox phase and victory via test-only `?qa=1` equivalent warp/recovery controls plus actual J swish presses: 3 HP to 0 and game state `victory`; this proves battle transitions, **not traversal of the entire route**.
- `frames.json` contains real existing files and SHA256; deterministic extractor regenerates the same cut-outs from the supplied source art.

- `docs/assets/` master document: 220 asset specs, 21 audio contracts, 273-page PDF with both embedded reference sheets; 0 missing asset IDs in extracted PDF text, 0 blank pages; full editable Markdown and JSON; PDF final art is NOT generated.

- Adjacent Golden Dome platform reachability: deterministic isolated physics simulations passed 23/23 consecutive authored step pairs, using normal jump/double-jump inputs, preserved moving-platform physics and a forced pulse-on test condition. This is NOT a full human game run; enemies and cannon hazards were disabled for this geometry-only test.

## Deliberate evidence limits
- Browser test-bundle injection is NOT normal URL navigation or proof that GitHub Pages works.
- Passing scripted boss state is NOT a complete manual skill-playthrough through the Dome.
- No real-phone touch-device test, audible audio QA, or long-session p95 frame profiling yet.
- Final LM Arena art is not created merely because the production PDF specifies it.

## Reproduce
- `npm run validate` for deterministic tests and asset checks.
- `python3 -m http.server 8765` for local static hosting.
- Normal-browser manual checklist: title, keyboard jump/double jump/swish/dash, bridge pulse, beacon activation, collectibles, Dome climb, checkpoint, boss charge telegraph, swish on rest, victory, replay, pause, mute, loss/retry, touch portrait and landscape.


## 2026-10-11 — preparation candidate verification (not main)

Project: westkitty/ShakeDown; branch: prep/asset-ready-20261011; baseline: main@80d388828bfcad0cf454fe0b2b166e6528ac5e6d; execution: BigMac arm64 macOS, Node v26.11.1, browser executable Brave Browser through Playwright Chromium engine.

- npm run validate: PASS; **19/19 Node tests**, including original 12 behavior/reachability checks, 6 asset-unit guards, and one temporary-directory real asset intake/approval/rejection test. The 26 original Cinnamon file hashes remain valid; 25 are eligible for runtime playback because run_03 source remains clipped and is deliberately excluded from loading and animation.
- npm run test:browser: PASS; **10/10** served-HTTP Playwright tests: desktop Chromium-compatible Brave and Pixel-7-sized mobile emulation; title, movement, jump, pause, persistent mute, touch input, landscape resize, status instrumentation, synthetic approved-image pixel integration, test-assisted boss victory and replay. The source-image loader performs bounded concurrent load and retry for intermittent mobile-emulation failures.
- Candidate production manifest is **empty**: no externally generated LM Arena final artwork has been received or approved. The browser image-swap test uses a synthetic PNG intercepted at request time and does not create or approve any production file.
- Performance diagnostic: headless Brave idle-title scenario, approximately 4.2-second sampling, observed frameMsP95 approximately 200ms on both desktop and mobile emulation while renderMsP95 was approximately 0.8–1ms. Headless frame pacing is throttled; this does **not** establish 60fps or target-device gameplay performance.
- The prior main GitHub Actions contract workflow run 38165872650 and Pages workflow run 38165872137 completed successfully for SHA 80d3888. Hosted index returned HTTP 200 from BigMac. These results apply to the **preparation baseline**, not this unmerged candidate branch.
- git diff --check and node --check performed on edited JS; do not claim CI or release status until exact branch is pushed and independently passes.

**Unverified:** natural player completion of every section in one continuous, no-warp browser session; physical iPhone/Android touch, audible audio quality, animation and level visual approval; long-session representative frame-budget data; live deployed new code; external generated final art. Tests using QA warps are specifically **not** full-route skill-playthrough evidence. Generated assets require actual source-file inspection and reviewer approval before source-to-runtime promotion.


## 2026-10-11: Round 2 proof boundary (unmerged candidate)

- Starting preparation PR #1 SHA 553be7d56cf7a61466fb146b378a6eac8830caf5 passed both contract and browser GitHub workflows. This is not CI evidence for subsequent local modifications.
- Node scripted assisted route: initial spawn; all 23 actual Dome steps; normal hazards; one checkpoint retry; 31 Shamrock Shakes; three natural Fox hits; birthday victory. No teleport, direct position mutation or disabled collisions.
- Actual-browser scripted assisted route: DOM keyboard events through real game listeners, visible pause/assist/retry/replay UI, Canvas rendering; 2,238 virtualized requestAnimationFrame callbacks, 23 steps, 31 shakes, one retry, natural Fox defeat and victory. Simulated elapsed time about 37.3 seconds. The QA query parameter supplies read-only state; mutating helpers were not called.
- Browser Asset Control Room: canonical 220 image + 21 audio contracts, 26 source-derived frames, 0 approved outputs, 215 pending visual/audio requests; local valid/invalid PNG alpha/dimension/hash, WAV truncated vs synthetic PCM, desktop/mobile and deep links. No upload or runtime manifest mutation.
- Limitation: virtualized browser frame scheduling is not ordinary pacing, a human-played route or hardware FPS measurement. Normal-difficulty route, physical mobile/speakers, final external art approvals and hosted exact-SHA proof remain open.

### Round 2 final local validation receipt
- `npm run validate`: **20/20 passed, 0 failed** (includes one full assist-mode, no-warp input journey).
- `SHAKEDOWN_BROWSER_PATH=/Applications/Brave Browser.app/Contents/MacOS/Brave Browser npx playwright test --workers=2 --reporter=list`: **21 passed, 1 intentionally skipped**, zero failures (real localhost HTTP, desktop and mobile emulation, studio, virtual-rAF full-route browser interaction).
- Code commit: `602a87ebb98d72b4a2a01110a38a061efb099f68`. GitHub Actions for this code and this documentation follow-up must be checked independently before any merge.


## 2026-10-11 — Round 3 candidate: physical approval gate and normal-difficulty route

**Starting known-good branch:** prep/asset-ready-20261011 @ 7cecff2f321b474fa029a3163b956f02698f9757. That commit's contract and browser GitHub CI checks were independently SUCCESS. A new Round 3 commit and its CI must be checked separately.

**Confirmed code defect, fixed in candidate:** Before this round, the renderer loaded any artwork with reviewer-attested status even when its integrationStatus was unverified. That made artistic/source approval itself activate a replacement image in ordinary gameplay. The renderer now requires an explicitly verified integration status; the activation CLI accepts only renderer-mapped assets, checks the exact approved SHA, requires a real hashed screenshot under docs/assets/qa and explicit reviewer attestation, and records that screenshot hash bound to the accepted art. PNG validity cannot prove screenshot subject correctness, so visual fidelity still needs a real human.

**Real preview:** local-only game query preview-art=ID loads one reviewer-attested, nonactivated image while normal gameplay preserves Canvas fallbacks. Desktop and mobile-emulated regression tests prove the gate and fallback, including a repaired asynchronous race that had hidden the preview warning after Cinnamon's frames finished loading.

**Normal difficulty:** Node real fixed-step continuous scripted route from spawn, no warp, hazards on, assist false: 2,782 frames, 21 physically contacted Dome steps, 31 shakes, one manual checkpoint retry plus one real pit reset, three legitimate Fox hits, victory. Browser DOM-input normal-mode virtual-frame route: 2,786 rAF callbacks, 21 named steps physically contacted, 32 shakes, one manual retry and one pit reset, natural Fox victory, birthday overlay and replay. Bypassing two steps by ordinary movement is legitimate and is **not** claimed as 23 physically touched.

**Input correctness:** Game input ownership now tracks each physical key and touch pointer. Releasing one of two simultaneously held movement sources no longer cancels the other. Browser tests assert keyboard aliases and concurrent keyboard/touch movement; normal blur/visibility cleanup still pauses and releases controls.

**User-facing review studio:** source/reviewed-but-inactive/activated labels and counts are independently represented; reviewed supported IDs expose a localhost game-preview link and explicit activation command template. Hash-fragment changes select the correct asset without silently leaving a stale inspector view.

**Local validation:** npm run validate **21 passed, 0 failed**, including complete assisted and normal scripted Node player routes and synthetic-only screenshot tamper tests. Served localhost Brave Playwright, two workers: **29 passed, 3 intentionally skipped, 0 failed**; both scripted routes pass on desktop, mobile-emulated keyboard/touch/studio tests pass. These are local BigMac tests on the preparation candidate.

**Hardware probe:** DEX BigMac ADB unavailable (adb not installed on that node); MacBook Air ADB available but reported 0 devices and 0 mDNS wireless-debug services. Consequently **no physical Android test was performed**. No real physical iPhone test or speaker/audio playback proof was performed. Headless FPS and real-world sustained frame pacing remain unverified. LM Arena still has 0 independently generated production images/audio in the approved manifest.

**No launch claim:** These fixes remain on the preparation branch until committed and validated on the exact GitHub SHA. main and the hosted GitHub Pages game are not claimed to contain them.

### Round 3 delivery receipt
- GitHub implementation commit 6c432d60a633143fe920c8ec61b8d9001d28b6ca on branch prep/asset-ready-20261011.
- Local evidence already recorded above; GitHub exact-SHA workflows were queued when this receipt was appended. Their final status must be verified separately.


## 2026-10-11 — Round 4 candidate: durable records, visible motion preference, and keyboard access

Baseline: clean clone from unmerged preparation PR #1 at b50d16c4d46c9ba90a49b3e2c0deb613c1993231. Baseline npm run validate passed 21/21. No external final art was imported. Existing Canvas 2D, game world, Fox encounter, source sprites and 220-image/21-audio contract are unchanged.

**Confirmed before repair:** a real Playwright regression test won the game, replayed and changed mute; saved completed erroneously flipped from true to false. The in-memory saved.completed was stale. The targeted test failed before repair and passed after; this is a reproduced data integrity bug.

**Checkpoint durability:** versioned bounded checkpoints serialize real world object IDs, not mutable engine objects. Node tests reject unknown, repeated or outdated records and re-derive collected/secret counts. Real served-HTTP browser tests cover Start/Continue, reload recovery and invalid/legacy save fallback on desktop/mobile emulation. Both complete scripted gameplay routes (assisted and normal difficulty) separately verified 5/5 checkpoint writes as the player physically crossed the authored level and that final victory clears unfinished progress.

**Reduced Motion:** pixel comparison of the same rendered scene at two simulated elapsed times demonstrates decorative visuals remain unchanged in reduced mode and change in normal mode. Moving platform rendering still uses true simulation time; collision and gameplay do not pause. OS media preference initializes the setting only if no explicit user choice has been saved.

**Keyboard/dialog:** browser tests exercise focus containment inside modal overlays, correct Enter activation of focused Continue, P auto-repeat suppression, native Space activation on focused sound button without jumping, keyboard-operated touch Jump, and Escape focus restoration.

Evidence boundaries: these are local served-HTTP tests in Chromium-compatible Brave on BigMac. The full-route tests use virtualized requestAnimationFrame timing, not human-paced movement or verified real-time FPS. No physical phone, speaker, screen reader, final generated art or hosted preparation-branch deployment has been verified.


### Round 4 final executed local validation receipt

- Original baseline: npm run validate **21 passed** on starting SHA b50d16c4d46c9ba90a49b3e2c0deb613c1993231.
- Final BigMac npm run validate: **24/24 passed, 0 failures** (new persistence-record tests included).
- Final BigMac installed Brave / Playwright desktop Chromium: **23 passed, 2 deliberate skips, 0 failures**, using localhost HTTP.
- Final BigMac installed Brave / Playwright Pixel-7 mobile emulation: **23 passed, 2 deliberate skips, 0 failures**, using localhost HTTP.
- Total browser executed tests **46 passed, 4 deliberate skips**, zero failures. Compared with prior 29 passed and 3 skips. The desktop and mobile configurations ran separately, each with two Playwright workers; the normal and assisted full routes remained browser-executed under a synthetic rAF clock.
- The original failing completion-reset reproduction, normal checkpoint save-from-gameplay, resumed collected/defeated state, OS reduced-motion preference, 2-timestamp Canvas pixel invariance, modal focus behavior, keyboard shortcut repeat guards and touch-keyboard activation all passed.
- GitHub exact-SHA CI and any user-facing remote release remain pending this local receipt. No final generated art or device proof was invented.


### Final checkpoint geometry extension — latest local status
A fourth independent progress unit test exercised **all five** authored checkpoint positions after restoring the new versioned record. Each remained in playing mode, landed on supporting geometry, retained positive health, and preserved the correct checkpoint index over 55 real fixed-step updates. Following that addition, the **latest full npm run validate passed 25/25 Node checks**, zero failures. Desktop Brave and Pixel-7-emulated Playwright results remain 23/23 executed each (46 total), with four deliberate skips across both projects.

### Round 4 implementation hash receipt
The exact tested code and documentation were delivered at commit 4be648f53e3c03c5a11e084b0bf093c65731e3d0 on prep/asset-ready-20261011. The live public main remains unchanged pending release review. GitHub CI for the final PR head is a separate verification gate.


## 2026-10-11 — Round 5 asset-independent verification (local candidate)

Baseline: clean clone of prep/asset-ready-20261011 @ a584f03d3c6240de803ad3cc352b441d3e25de2f, npm ci successful, npm run validate **25/25 passed**. Existing Canvas 2D simulation, authored 23-step Notre Dame climb, source sprites and 220/21 generation specs preserved. No external art bytes fabricated, received, approved or activated.

Confirmed defect: a second browser tab could overwrite a completed birthday achievement obtained in another tab by saving older settings. Browser stress test failed against the baseline. Fix: the writer reconciles most recently stored completed/best values with this tab on each save and observes storage events to refresh Continue in the title. Both cross-tab browser tests pass after the change. **Truly simultaneous localStorage writes are not transactional**, so the narrow race remains unverified.

Audio: deferred user-gesture AudioContext creation, explicit pause/mute/restart silence, 24-voice maximum, cleanup and recovery are tested by synthetic unit doubles and true served-HTTP browser events. No actual speaker listening was possible. ESM dependency network reset under parallel Mac load was identified from a Playwright trace (src/game/progress.mjs request failed with net::ERR_CONNECTION_RESET). A classic-script 8-second boot watchdog displays Retry Loading instead of an inert game; deliberate import abort and subsequent successful browser retry passed. Browser source and collision engine unchanged.

Bulk report: scripts/batch-intake.mjs reads master requirements (220 visuals/21 audio, 26 original Cinnamon sources, 0 approved finals, 215 outstanding contracts). An isolated temporary input batch exercises accepted transparent/opaque PNGs, wrong dimensions, malformed WAV, unknown IDs, ZIP ignored, unsafe symlink, duplicate ID, protected stage and no approval mutation. npm run release:preflight enumerated 38 actual runtime files, zero missing static byte dependencies, stable SHA-256 content inventory and a dirty-worktree warning; a temporary broken module dependency correctly returned a blocking failure. Neither report establishes generated art quality.

Browser performance: real wall-clock headed Brave, short samples in desktop1280x800, portrait390x844, landscape844x390, narrow320x568, plus 12-second desktop sample. Remote rAF p95 measured roughly 205–216ms and p95 Canvas draw work roughly 0.9–1.2ms. The remote host scheduling was throttled; this is not a 60 FPS claim. Actual target iPhone/Android hardware remains unverified. The corrected narrow layout reduced scroll width from 345px to 320px; landscape Start bottom from ~448px to ~236px, touch controls from ~682px to ~380px at 844x390. Browser tests check zero horizontal overflow and >=44px action targets. Headed desktop long sample: 78 frames in a 12-second audit, p95 ~214.9ms, one heap sample ~3.34MB; this does not prove absence of leaks.

Mobile/accessibility and gameplay: desktop/mobile emulation confirms correct keyboard/mute/focus behavior; new High Contrast setting changes real HUD/menu/touch styling, persists and is independently tested. Continuous assisted and normal simulated-clock browser routes still reach natural Fox victory without warps and explicitly observe boss tell, charge, volley, rest and hit states. Fallback tests cover missing sprite and production manifests, offline already-loaded session, repeated resize, focus-loss pause and no lingering voices. Offline cold-start was not claimed.

The first oversubscribed 3-worker browser suite exposed a genuine transient local Python HTTP server connection reset for the game's imported progress module, traced to the request, not a failed visual-art gate. An existing preview test also read window.__SHAKEDOWN_QA before the module initialized; its read was made optional-chain-safe. The new startup recovery UI is a deliberate defense for that class of import failure. Final validation uses the configured one-worker Playwright profile, divided into equivalent bounded file groups to avoid the remote command timeout; group-level results are recorded below after running.

### Round 5 final local check receipt

- Final npm run validate: **31/31 Node tests passed**, 0 skipped and 0 failures. Static release-preflight PASS (38 unique runtime file entries and zero missing); dirty-worktree warning expected before committing.
- Desktop Chromium-compatible Brave, single-worker suites: Group A **14 passed, 1 skipped**; Group B **20 passed, 3 skipped**. A separate desktop High Contrast test **1 passed**. **35 unique desktop tests passed, 4 intentional skips.**
- Pixel-7-sized mobile Chromium emulation, single-worker suites: Group A **14 passed, 1 skipped**; Group B **21 passed, 2 skipped**. Separate mobile High Contrast test **1 passed**. **36 unique mobile-emulated tests passed, 3 intentional skips.**
- Focused accessibility regression rechecked after adding the Contrast checkbox: **5 passed, 1 mobile-only skip** across both configurations; results overlap prior tests and are not double-counted.
- Thus **71 distinct executed browser scenarios passed and seven expected skips** across desktop and mobile-emulated configurations. This was a bounded group-by-group local run, not one simultaneous 2-project command. All scheduled one-worker groups and follow-up focused runs were green.
- The one oversubscribed multi-worker run suffered an intermittent Python test HTTP connection reset and failed one visual-preview test; the request was traced to a missing game ES module under network failure. Bounded one-worker retests passed; a direct failed-module/retry browser test also passed. We do not label the earlier failed overloaded run as green.
- No physical device gameplay, real phone FPS or audio speaker audition, human-paced full-game journey or externally generated art has been verified.
