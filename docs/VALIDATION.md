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
