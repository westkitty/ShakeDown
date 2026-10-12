# ShakeDown — Cinnamon Fuzzbutt's Shamrock Shake Caper

A playable, static-hosted Canvas 2D birthday platformer for **Maverick**. Cinnamon Fuzzbutt (a red panda, not a cat) chases the Fox across Notre Dame's South Quad, climbs a playable Golden Dome, beats the Fox, and celebrates with cake and Shamrock Shakes.

## Play

**[Open the birthday game](https://westkitty.github.io/ShakeDown/)**. The October 11 main-branch Pages workflow passed and the hosted index returned HTTP 200; a full hosted playthrough remains unverified.

Run locally from the repository root with `npm run serve` and open `http://localhost:8765` in a normal browser. No production packages or build step. The app is `index.html` with JavaScript modules in `src/`.

## Controls

- Move: A/D or left/right arrows.
- Jump: Space, W or up arrow. Tap twice for double jump; variable height, coyote time and input buffering.
- Tail-swish: J or X. Stun the Fox during recovery; hit Drum Beacons to activate the GO IRISH pulse.
- **Cheer / GO IRISH!: C.** Immediately energize timed banner bridges, stun nearby Cup Crawlers, briefly hush close confetti cannons, and ring four optional rally bells for hidden shakes. Near a Drum Beacon the cheer is stronger. During the Fox's recovery, a nearby cheer extends the tail-swish opening by up to 0.48 seconds but does not deal damage. Cooldown: 6.4 seconds.
- Dash: Shift or K.
- Pause: P or Esc. M toggles audio.
- On touch screens: accessible move, dash, swish, **cheer**, and jump buttons; narrow portrait layouts use a compact two-row action pad.

## Gameplay

- **Campus (0–3770 world px):** shake stand theft, banner bridges, safe pulse tutorial, concession robots, confetti cannons, moving platform, secrets and checkpoints. A new **14-platform elevated Pep Rally** offers an optional timed bridge route, two bell relays, new enemies, and bonus Shamrock Shakes, with the ground route preserved.
- **Golden Dome (3770–8350 px):** intact 23-stage architectural ascent plus **11 new optional platforms** forming Bell Gallery and upper-cornice detours. Two additional cheer relays unlock secret shakes, and both side routes reconnect to the original ascent, checkpoints and boss arena.
- **The Fox:** an explicitly *provisional* illustrated runtime stand-in pending an approved antagonist sheet. Three-hit fight with charge and projectile patterns, visible telegraphs and recovery windows.
- **Finale:** cake, shakes, confetti, exact HAPPY BIRTHDAY, MAVERICK! text and replay. The ending recognizes all four earned cheer bells as RALLY LEGEND; best-bell progress persists alongside the existing best Shake count.

The original four-stage campaign plan is superseded by the user's October 11 complete-birthday-game directive. Prior documents are retained in `docs/level1/` as historical design artifacts.

## Asset truth

- `assets/references/` preserves all three user-provided Cinnamon sheets (two image files have JPEG-encoded source bytes, including the legacy `.png` filename; provenance documented in `docs/CINNAMON_REFERENCE_INTEGRATION_20261012.md`).
- `assets/sprites/cinnamon/*.png` and `frames.json` contain 26 reproducible cut-outs physically produced from `cinnamon_actions_sheet.png`; they are **real, physically present sprites** (25 eligible for playback; the clipped run_03 is skipped at runtime), but not a claim of individually newly hand-drawn animations. See `scripts/extract_cinnamon.py`.
- The classic edition retains explicit procedural Canvas illustrations. The repository also contains 194 generated image candidates: 28 curator previews, 131 alternatives, 11 revision requests and 24 transparency-blocked sources. Candidate delivery is not owner approval.
- `docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf` is the expanded 220-visual-asset / 21-audio-request production master. All 194 non-Cinnamon image requests now have physical candidates, while the 26 Cinnamon source frames remain hash-locked.
- Six user-provided MP3s are integrated as three randomized campus tracks, two randomized Golden Dome tracks and a dedicated Fox boss track. They cover three music roles; the other 18 named audio contracts remain undelivered. Synthesized effects and score fallback remain available.

## Reviewing LM Arena artwork

The game remains playable without final outside artwork. The **default** now draws 28 SHA-checked Curator's Cut previews plus 35 separately checked, structurally safe environmental alternatives directly in actual gameplay. The added art includes illustrated campus backgrounds, composited Main Building windows/columns, real Golden Dome and statue sprites, railings, banners, moving lifts, props, birthday decoration and gameplay VFX. The ten selectable raster titles and the original clean Game Over/Victory plates remain. The 63 loaded scene assets are **provisional visual previews, not human-approved replacements**. These remain **provisional, not human-approved**. Use `?art=classic` for the original lightweight procedural presentation. Source approval stores files and provenance **without activating them as final production-approved assets**. Promoting a provisional candidate to **final, production-approved replacement art** still requires independent artist/reviewer evidence; turning on an explicitly provisional preview never forges that approval.

    npm ci
    node scripts/asset-intake.mjs inspect --id CO-03 --file /path/to/your-cup.png
    node scripts/asset-intake.mjs stage --id CO-03 --file /path/to/your-cup.png
    npm run validate
    npm run test:browser

See docs/PRODUCTION_READINESS.md and docs/RELEASE_CHECKLIST.md. The 194 imported images remain review candidates; none is silently promoted to owner-approved production art.

## Asset Control Room

Open http://localhost:8765/tools/asset-review.html after starting the local server. The standalone review bench reads the 220-visual / 21-audio master and the actual approved manifest. Search/filter by ID, priority, category and state; distinguish **source / pending / reviewed / active**; inspect PNG geometry/alpha/hash and WAV/OGG containers; open a local in-game preview for eligible reviewed art; then copy separate staging and activation command templates. Nothing is uploaded or approved by the page. Human visual/audio review remains mandatory.

## Validation

Node and real-HTTP browser regressions now prove **both assisted and normal-difficulty scripted routes** from the initial spawn through the Golden Dome to genuine Fox victory, using real keyboard/UI handlers and a test-only virtual requestAnimationFrame scheduler. Tests also cover independent keyboard and touch input ownership, local preview separation from activation, and screenshot-evidence integrity. These are synthetic-clock automated player routes, not human-paced or physical-phone proof. Real phone touch/audio, human play, final generated-art approval and exact-SHA hosted-site checks remain release gates.

See docs/PRODUCTION_READINESS.md and docs/VALIDATION.md for exact evidence.

## Project and authority

This is **westkitty/ShakeDown**. Cloud Chaser (`westkitty/c_chase`) was inspected strictly as a movement/UX reference and has not been modified. The Modern 2D Browser Game Architecture Toolkit v2.0 governs the static game architecture and evidence labels.


## Save and resume the birthday chase

ShakeDown saves **checkpoint progress locally in this browser** after each reached checkpoint. Returning to the title screen after a reload presents a **Continue from [checkpoint]** option. It restores the authored checkpoint position, previously collected Shamrock Shakes and defeated Cup Crawlers, and normal game physics. The Fox battle starts fresh from the summit checkpoint rather than preserving a half-finished attack.

**Start the Shakedown** deliberately begins a new journey and clears the unfinished checkpoint. It does **not** erase an earned birthday completion, best shake record, mute preference or accessibility choices. Winning clears the no-longer-needed unfinished checkpoint while retaining the completion record. Progress is local to that browser profile; private browsing, manual site-data clearing, restricted storage and switching devices can prevent recovery. Malformed or outdated checkpoints are safely ignored.

## Accessible controls

Reduced Motion now changes the actual Canvas visuals: it reduces decorative animation, flashing, particle trails and invulnerability blinking without freezing gameplay physics, hazards or moving platforms. On first use it respects the operating system's reduced-motion setting; a player's explicit checkbox choice persists across reloads. Pause, loss, victory and title overlays have keyboard focus handling, Tab containment and Escape/pause-key recovery. Pressing Space on a focused button activates that button rather than unexpectedly jumping, and keyboard-accessible touch controls also trigger their labeled actions.


## Round 5 — reliable audio, incoming-art batches, and release rehearsal

The browser game no longer creates WebAudio before the first user gesture. Pause/mute/restart stop scheduled voices, a 24-voice cap prevents runaway effect overlap, and a failed audio device never blocks gameplay. Browser failures to load the game's ES module graph now show a useful Retry Loading action rather than an indefinitely inert title screen. A browser test deliberately aborts a module import, verifies the recovery UI, and successfully retries after restoring the request.

The new High Contrast toggle in Pause changes the actual HUD, touch buttons and dialogue chrome. Unlike the earlier dormant saved preference, it now works and persists. Narrow 320px portrait and 844x390 landscape layouts were adjusted without changing the 960x540 logical game canvas or collider geometry.

The batch intake reports physical generator outputs against the actual 220-image / 21-audio master, detects duplicates and incompatible bytes, and can explicitly stage valid independent files without approving them. See docs/ASSET_BATCH_INTAKE_RUNBOOK.md. Use npm run asset:batch -- --dir /ABSOLUTE/PATH/TO/FILES (dry run) or append --stage only after reviewing the dry-run findings.

For asset-independent release evidence, use npm run release:preflight (deterministic static bytes, import and original sprite checks) and npm run perf:audit -- --seconds 4 (real browser frame pacing, render cost, input observation, layout checks). See docs/RELEASE_REHEARSAL.md and docs/READABILITY_AND_PERFORMANCE_AUDIT.md. On the authorized BigMac node, set SHAKEDOWN_BROWSER_PATH to the absolute installed Brave executable when running Playwright locally.

Two browser tabs now reconcile earned completion/best Shake records when an older tab saves settings; checkpoint Continue stays visible across tab changes. Browser storage has no transaction/compare-and-swap facility, so simultaneous racing writes on different tabs remain an acknowledged limitation. No external LM Arena artwork was approved or activated in this pass.

## SHAKE DOWN: Art Jury and Curator's Cut

**Play with the curated generated art:** the 28 SHA-verified curated previews and 35 independently vetted scene-art alternatives are now the default provisional visual layer. You can also launch `?art=curated` or toggle **Curator's Cut** in the title/Pause menu. The original fully functioning procedural presentation remains available with `?art=classic`, without changing saves, physics or boss timing. Previewing is not final art acceptance.

**Judge all the candidates:** [Open the Art Jury](tools/asset-gallery.html). All **194** physical Arena images are available for visual comparison, category and ID search, original image/hash inspection, and KEEP/REVISE/REJECT voting. Add notes and export your hash-bound JSON review. Votes persist locally in the browser and **never automatically activate art**. The curator's current classification is **28 preview, 131 alternatives, 11 revise, 24 transparency-blocked**.

The source-hash manifest is `assets/production/manifest.json`; individual reasons and owner-review fields are in `assets/production/curation.json`. Read [docs/ASSET_CURATION_REPORT.md](docs/ASSET_CURATION_REPORT.md) for visual comparisons and provenance limits. Six user-provided MP3s now cover campus, Dome and boss background music; 18 other named audio contracts remain undelivered.


## All generated images: Asset Director

The in-game **ART DIRECTOR · ALL 194 ASSETS** opens from the title, Pause, or the game HUD. All 194 physically committed generated PNGs have a scene-specific Canvas role; source bytes are SHA-256 checked and decoded on demand. Select an artwork, inspect it in representative context, press **TRY IN THE ACTUAL GAME** to audition it, and **REMOVE THIS LAYER** to restore the classic/curated fallback. You can keep one temporary variant per role. No physics, checkpoints or owner-approval records change.

The 24 source images lacking required transparency are inspectable and may appear only as labeled QA reference cards, never as real background/platform art. The other 170 sources can be tried in game roles, although source validity does not mean artistic approval.

The [Art Jury](tools/asset-gallery.html) now offers a direct link for each asset to the matching in-game audition. Complete 12-role wiring and limitations: [All-asset runtime guide](docs/ALL_ASSET_RUNTIME_INTEGRATION.md). Recorded background music is documented in `assets/audio/music/manifest.json`; 18 non-covered named audio contracts remain missing.

## Raster presentation branch consolidation (2026-10-12)

The ten separate title PNGs are available inside the playable title screen (◀/▶), with scene-specific result art on Game Over and Victory. The masters stay in `assets/title/`; 960×540 runtime copies are in `assets/title/canvas/`. The obsolete four-SVG artwork branch was resolved without importing its SVG files. The 194 source candidates are still reviewable in the Art Director: 28 curated previews are visible in gameplay by default; the remaining candidate/revision/blocked sources require deliberate individual audition and human art review rather than undisclosed auto-approval.

## Owner-supplied title, game-over, and victory artwork

The uploaded `ShakeDown_Screens_2026-10-11.zip` supplied **three original screen compositions**, each as texted and clean PNG plates at 960×540 and 1920×1080: **12 byte-for-byte SHA-verified image files** now in `assets/screens/`. The playable default Start screen uses the original **clean start plate**, Game Over uses the **clean continuation plate**, and Victory uses the **clean birthday/credits plate**. The words and action buttons remain real HTML, not noninteractive pixels. The title-image arrows browse the original plate and all ten additional title-screen PNG alternatives. The corresponding texted masters remain in the repository for independent standalone presentation.

The original `build/build_screens.py` is retained as a readable, path-corrected `scripts/build_uploaded_screens.py`, with a SHA-checked reproduction helper (`scripts/reconstruct_uploaded_screens.py`); actual rendered PNG SHA-256 values are enforced in `tests/screen-art.test.mjs`. The SVG-only branch remains excluded, including any runtime references to SVG. The old preview/fallback, input, checkpoint, and art-review boundaries remain in force.

### October 12 — scene art repair

The source-grounded scene-art replacement and its limited approval boundaries are recorded in [the visual runtime repair report](docs/ART_RUNTIME_REPAIR_20261012.md), with desktop screenshot evidence in `docs/qa/`. The separate previously selected `ShakeDown_Cinnamon_Art_PreHandoff.zip` is **not present as a usable binary in the repository**; none of the 35 additional scene candidates substitutes for that missing canonical source. Do not mark character fidelity or the 194-image production manifest approved without recovering it and obtaining the user's visual review.

### Playable rally expansion (2026-10-12)

The timed GO IRISH chant still opens every original banner on its 5.6s cycle (2.9s active). Press **C** or touch **CHEER** to deliberately activate a short, 2.2s pulse (3.7s near a Drum Beacon), with a visible cooldown, local ring/tune, readable countdown and reduced-motion static feedback. Four physically traversable optional rally bells unlock genuine SHA-verified source-art Shamrock Shake gameplay rewards. Schema-1 checkpoint saves remain compatible and now preserve lit rally relays. See [Cheer rally expansion report](docs/CHEER_RALLY_EXPANSION_20261012.md). These routes expand **playable elevation/content**, not the existing world-width or the original 23 Dome steps.

### OMNI rally and cheer follow-through (2026-10-12)

Four readable, non-colliding signs introduce the optional high road before the timed bridges. Context-aware directions identify nearby unlit Canopy, Parade, Gallery and Cornice bells, and when to cheer; a reduced-motion-safe, keyboard-readable objective is displayed outside the canvas. An organically controlled default-difficulty regression now proves the path from the real spawn to the first elevated bell, the cheer action, and physical Shake collection with hazards active and without QA warps. A nearby cheer during the Fox's recovery adds a bounded 0.48-second tactical opening, but cannot damage the boss or cancel his windup. Victory displays earned bell progress, with monotonic persisted `bestRallies` compatible with old saves. The original Canvas runtime, 23 Dome steps, controls and user-supplied art are unchanged. See [OMNI development report](docs/OMNI_FOLLOWTHROUGH_20261012.md).
