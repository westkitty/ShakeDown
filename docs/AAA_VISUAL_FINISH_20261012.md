# SHAKEDOWN — AAA visual finishing pass (2026-10-12)

## Authority, target and existing work

- Target: **existing** Canvas 2D birthday platformer on branch \`feat/omni-rally-followthrough-20261012\`, HEAD \`6608537c6f397a0a6555267f4ef808b14846d3b4\` when this pass started. Public \`main\` is separate and was not treated as if it contained this branch's local work.
- Big Mac source working directory: \`/Users/bigmac/shakedown-omni-20261012\`.
- Important preserved state: this tree was already dirty with unfinished **OMNI II autosave / Rally Journal / startup-readiness** changes in README, Bible, HTML, progress module, main, styles and tests. This visual pass did **not** reset, clean, stash, drop, rebase, or overwrite those changes.
- Protected invariants: 960x540 Canvas playfield, fixed 60Hz physics, authored collision and 8350px world, 23 Golden Dome steps, 25 high-ground rally platforms, six checkpoints, Fox three-hit finish, input and assist/reduced-motion/high-contrast choices, all sprites and image review authority, local save compatibility, Art Director, Curator's Cut and classic fallback.
- Baseline visual screenshots and measured render cost were captured **before** the changes from the actual existing running game; not synthetic mockups.

## Cohesive visual direction and implemented groups

**Art-direction lock: South Bend, modern illustrated pixel/retro 2D, Notre Dame blue + aged brass/gold + Shamrock green, burnt-orange Cinnamon, coral Fox danger.** Distinctive silhouettes, the user-created transparent Cinnamon action frames and all original licensed/source assets remain untouched.

### Group A — Authored environmental depth and lightweight atmosphere

- New \`src/game/visual-finish.mjs\` owns a reusable, presentation-only cache of 96px terrain tiles, warm/cool lighting stamps, static campus/Dome/summit grade plates and a gentle vignette.
- Add layered ground sections with brick/soil seams, material-dependent top edges, modest underside drop-shadows, moving-platform detail and pulse bridge highlights. These draw over **actual cull-tested collision platforms**, never new fake geometry.
- Add readable architectural shaft/column light cues in the Dome, warm glows anchored to authored campus lantern positions and low-density deterministic motes that respect Reduced Motion.
- Introduce world-space collectible glows and a Fox-state-driven arena spotlight. The same world state controls both art and collision; inactive pickups are not drawn.
- No shader/post-process pipeline, WebGL renderer, download, dependency, license risk, texture replacement or engine migration.

### Group B — Character/action/readability polish inside actual gameplay

- Remove the obstructive full-width floating **CHANT RESTING / GO IRISH** text from the middle of the playfield. Replace it with a compact timed state panel and fill indication sourced from the **same \`pulseState\` that controls collision**.
- Add an actual readable native CSS \`#chant-status\` label for portrait touchscreen layouts so the 960 logical-pixel canvas readout is not the only timing cue.
- Subtle ground-contact shadow and cool/warm separation halo around the original Cinnamon sprite, tiny idle breathing, landing squash and two low-opacity dash echoes that always reuse the **same exact original image** and never change the hitbox or animation choice.
- Bounded world-space impact accents keyed to actual event types (pickup, attack, hurt, rally, checkpoint, dash). Projectiles, scoring, controls and event timings unchanged.
- Fox battle uses a three-segment health HUD tied to actual \`boss.hp\` plus state label for windup, recovery or attack. Existing danger telegraph and mandatory three authentic tail-swishes remain authoritative.

### Group C — Cohesive interface and low-cost polish

- Matching campus-blue/brass styles on the real game frame, title, pause/victory cards, HUD, touch buttons, status line, Curator controls and objective journal; explicit hover/pressed/focus/cooling/disabled states remain usable.
- Reduced Motion keeps static grade and static pulse text with no decorative motes, echo/landing motion, animated incident accents or moving status-bar fill.
- High Contrast CSS precedence preserved. Touch target sizes and mobile/landscape layouts remain measurable, not merely visually assumed.
- Performance strategy: the visual resource bank is constructed **once per Canvas context** and stored in a WeakMap; terrain CanvasPatterns are reused; world lighting is culled and particle fields are fixed-count. No allocation growth proportional to uptime.

## Benchmark protocol and honesty

Exactly matched Big Mac Brave/Playwright performance audit command before/after:
\`SHAKEDOWN_BROWSER_PATH=... npm run perf:audit -- --seconds 2 --output ...\`

| Viewport | Before Canvas p95 | After Canvas p95 | Errors |
| --- | ---: | ---: | ---: |
| Desktop | 1.1 ms | 1.2 ms | 0 |
| Mobile portrait | 1.1 ms | 1.5 ms | 0 |
| Mobile landscape | 1.4 ms | 1.8 ms | 0 |
| 320px narrow | 1.2 ms | 1.7 ms | 0 |

The extra 0.1–0.5ms is measurable, acceptable for the new lighting/materials, and **not** a performance improvement claim. All four environments' requestAnimationFrame intervals were roughly **200ms** due to remote/headless throttling; none establishes physical-device FPS. On-device thermal and long-session memory behavior remain unmeasured.

## Visual evidence and validation

- Before/final diagnostic captures from the actual game, not composited artwork: campus spawn, mid Quad, elevated rally, mid Dome, cornice, Fox battle, birthday ending and portrait mobile. Local off-repository folders:
  - \`/Users/bigmac/shakedown-visual-qa-20261012/before\`
  - \`/Users/bigmac/shakedown-visual-qa-20261012/final\`
- Each screenshot comes from running original game via \`scripts/visual-qa-capture.mjs\`; camera positioning in these diagnostic captures is a **QA fixture**, not proof of an organically completed campaign.
- Source inspect + actual Browser tests: Node asset and gameplay tests, reduced-motion pixel freeze, contrast, 320px and landscape touch dimensions, native chant status, action input, Fox health output, cached-material color variation and clean multi-scene browser renders.
- Browser full matrix and final exact results are separate gates; attach them only after completion.

## Explicit deferrals and remaining limitations

- User-authored sprite identity is immutable here. We did not invent missing \`run_03\` pixels; that physically clipped frame remains excluded from active animation.
- Provisional artwork candidates (including a final approved Fox replacement) remain subject to human review; a visual treatment is not retroactive approval.
- No photorealism, GPU bloom, expensive shader graph, heavy weather particles, new audio library, or unsolicited gameplay/camera-physics rewrite.
- Existing unfinished OMNI II autosave work is preserved rather than conflated with this visual pass.
- This user's current request authorizes local game modifications and validation, **not automatic commit, push or Pages deployment**; public repo and hosted version are unchanged unless subsequently authorized and verified.


## Final regression receipt (same candidate, 2026-10-12)

- \`npm run validate\`: 64/64 tests passed; initial focused desktop/mobile visual/contrast/reduced-motion/cheer checks 13 passed and three intentional skips.
- A one-worker **full matrix** of 140 desktop/mobile Playwright cases, on isolated output \`/Users/bigmac/shakedown-visual-qa-20261012/full-browser-artifacts\`, completed in 8.1 minutes: **126 passed, 12 intentional skips, 2 failures**. All three original full-route desktop victories, checkpoint/persistence, ordinary mobile gameplay, curated/classic asset views, and new visual-finish cases passed in that run.
- Failure A: initial title Start focus was not established while its JS module was briefly still loading in the headless desktop browser. This is an observed readiness race; the initial button is safely disabled until its handler registers. In a separate clean run the same exact accessible dialog-focus case passed **2/2**.
- Failure B: the blocked-asset Art Director pixel-sampling assertion exceeded its delta tolerance once, without an art-selection gate violation being proven. Source inspection confirms the \`ArtRuntime.active()\` entry for a contract-blocked image is marked \`blocked\` and \`paintArtOverrides\` explicitly refuses it. The identical browser test then passed **2/2** in isolation, so the discrepancy is **intermittent/unresolved**, not a demonstrated approved-source leak or a repaired regression.
- Both failing cases were rerun after the full suite stopped, **four clean applicable reruns passed** with no parallel Playwright process and independent artifact destination. **Do not relabel the original full run as green.**
- Baseline and final visual screenshots in \`/Users/bigmac/shakedown-visual-qa-20261012/{before,final}\`; 8 representative original game states captured, 0 page errors. This is source-verified live Canvas output, not proof of human-quality acceptance.
- Remaining full-clean CI, exact-commit GitHub release, user acceptance, physical-device screen/audio/FPS tests require separate proof. Current requested scope does **not** authorize staging, commit, push or release.

## Final serialized release-candidate browser matrix — clean

After stabilizing the test harness without weakening the contract-blocked-artwork pixel threshold or bypassing the module-ready state, the **entire 140-case Playwright matrix completed successfully** on the same Big Mac candidate:

- **128 passed, 12 intentional skips, 0 failures** (8.4 minutes).
- Command: `SHAKEDOWN_BROWSER_PATH="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" npx playwright test --config=playwright.config.mjs --output /Users/bigmac/shakedown-visual-qa-20261012/full-browser-final --reporter=line`.
- Audit log: `/tmp/shakedown-aaa-full-final.log`; exit code recorded as **0** in `/tmp/shakedown-aaa-full-final.exit`.
- Scope includes desktop and mobile original routes, actual keyboard/touch gameplay, three authentic Fox damage phases, SHA/source-art integrity, all review/blocked-artwork cases, normal and reduced motion, high contrast, responsiveness, milestone progress, storage and recovery.
- The previous 126/12/2 exploratory run and its six-case isolated retest remain recorded above for historical honesty; the new clean run supersedes it as the final whole-suite result.
- Node/asset tests previously passed **64/64** and visual performance audits showed modest p95 Canvas render expense, not verified on-device FPS.

This is a verified **local** game source candidate. Source changes are not automatically approved artwork, a GitHub publication or a user-accepted commercial release.

## Verified MacBook handoff — 2026-10-12

- The final 16-file source/QA/documentation candidate was transferred from Big Mac to the user's existing MacBook Shakedown checkout, preserving `HEAD 6608537c6f397a0a6555267f4ef808b14846d3b4`, branch `feat/omni-rally-followthrough-20261012`, and all three untracked user-authored asset-production documents.
- Final transfer tar SHA-256 `84bfbed9e17edc79939ff360ed260ceeab038205bb3e2e0734d22d93be7d3619`; each of the 16 installed files matched Big Mac's SHA-256 manifest. All three protected planning documents matched their independently recorded before/after hashes.
- MacBook `npm run validate`: **64 passed, 0 failed**; `npm run release:preflight`: PASS; exact local Brave/Playwright smoke subset: **3 passed, 0 failed** (actual keyboard/player movement, bounded procedural material/Boss HP presentation, runtime campus/Dome/Fox/victory scene inspection).
- MacBook loopback-only local play server started from the game directory on port **8765**. `HTTP 200` was observed and the served `src/game/visual-finish.mjs` SHA-256 `f6209ced1f6938f82bbed4d4826c9c63c9dbaf44b20cad02a3184d3f4eceeb42` matched the installed source file. Open `http://127.0.0.1:8765/` on the MacBook.
- This is a locally applied, immediately playable **uncommitted** visual candidate. No GitHub commit/push or Pages deployment was made; public Pages still reflects its previous main release. On-device prolonged FPS, human visual-art approval, and corrected original clipped `run_03` remain outside verified scope.
