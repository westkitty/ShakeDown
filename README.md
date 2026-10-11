# ShakeDown — Cinnamon Fuzzbutt's Shamrock Shake Caper

A playable, static-hosted Canvas 2D birthday platformer for **Maverick**. Cinnamon Fuzzbutt (a red panda, not a cat) chases the Fox across Notre Dame's South Quad, climbs a playable Golden Dome, beats the Fox, and celebrates with cake and Shamrock Shakes.

## Play

**[Open the birthday game](https://westkitty.github.io/ShakeDown/)**. The October 11 main-branch Pages workflow passed and the hosted index returned HTTP 200; a full hosted playthrough remains unverified.

Run locally from the repository root with `npm run serve` and open `http://localhost:8765` in a normal browser. No production packages or build step. The app is `index.html` with JavaScript modules in `src/`.

## Controls

- Move: A/D or left/right arrows.
- Jump: Space, W or up arrow. Tap twice for double jump; variable height, coyote time and input buffering.
- Tail-swish: J or X. Stun the Fox during recovery; hit Drum Beacons to activate the GO IRISH pulse.
- Dash: Shift or K.
- Pause: P or Esc. M toggles audio.
- On touch screens: five large accessible move, dash, tail-swish and jump controls.

## Gameplay

- **Campus (0–3770 world px):** shake stand theft, banner bridges, safe pulse tutorial, concession robots, confetti cannons, moving platform, secrets and checkpoints.
- **Golden Dome (3770–8350 px):** 23-stage architectural ascent, moving lifts, pulse platforms, safety ledges, Notre Dame-inspired building and dome, boss arena and checkpoint.
- **The Fox:** an explicitly *provisional* illustrated runtime stand-in pending an approved antagonist sheet. Three-hit fight with charge and projectile patterns, visible telegraphs and recovery windows.
- **Finale:** cake, shakes, confetti, exact HAPPY BIRTHDAY, MAVERICK! text and replay.

The original four-stage campaign plan is superseded by the user's October 11 complete-birthday-game directive. Prior documents are retained in `docs/level1/` as historical design artifacts.

## Asset truth

- `assets/references/` contains two physically present user-provided Cinnamon source sheets.
- `assets/sprites/cinnamon/*.png` and `frames.json` contain 26 reproducible cut-outs physically produced from `cinnamon_actions_sheet.png`; they are **real, physically present sprites** (25 eligible for playback; the clipped run_03 is skipped at runtime), but not a claim of individually newly hand-drawn animations. See `scripts/extract_cinnamon.py`.
- The Fox, backgrounds, terrain, collectibles, UI and cake currently use explicit procedural Canvas illustrations. They are playable **temporary integrated drawings**, not LM Arena final artwork.
- `docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf` is the expanded 220-visual-asset / 21-audio-request LM Arena production master; its editable Markdown source, machine-readable JSON and reproducible compiler are committed alongside. 26 existing Cinnamon frames are verified; 194 final visual requests are still **not generated**. A specification never stands in for verified bytes.

## Preparing for incoming LM Arena artwork

The game remains playable without final outside artwork. Source approval stores files and provenance **without activating them**. A separate, reviewer-attested gameplay integration step with a real screenshot is now required before regular gameplay loads replacement art; local previews do not activate anything.

    npm ci
    node scripts/asset-intake.mjs inspect --id CO-03 --file /path/to/your-cup.png
    node scripts/asset-intake.mjs stage --id CO-03 --file /path/to/your-cup.png
    npm run validate
    npm run test:browser

See docs/PRODUCTION_READINESS.md and docs/RELEASE_CHECKLIST.md. No final LM Arena images were imported in this preparation sprint.

## Asset Control Room

Open http://localhost:8765/tools/asset-review.html after starting the local server. The standalone review bench reads the 220-visual / 21-audio master and the actual approved manifest. Search/filter by ID, priority, category and state; distinguish **source / pending / reviewed / active**; inspect PNG geometry/alpha/hash and WAV/OGG containers; open a local in-game preview for eligible reviewed art; then copy separate staging and activation command templates. Nothing is uploaded or approved by the page. Human visual/audio review remains mandatory.

## Validation

Node and real-HTTP browser regressions now prove **both assisted and normal-difficulty scripted routes** from the initial spawn through the Golden Dome to genuine Fox victory, using real keyboard/UI handlers and a test-only virtual requestAnimationFrame scheduler. Tests also cover independent keyboard and touch input ownership, local preview separation from activation, and screenshot-evidence integrity. These are synthetic-clock automated player routes, not human-paced or physical-phone proof. Real phone touch/audio, human play, final generated-art approval and exact-SHA hosted-site checks remain release gates.

See docs/PRODUCTION_READINESS.md and docs/VALIDATION.md for exact evidence.

## Project and authority

This is **westkitty/ShakeDown**. Cloud Chaser (`westkitty/c_chase`) was inspected strictly as a movement/UX reference and has not been modified. The Modern 2D Browser Game Architecture Toolkit v2.0 governs the static game architecture and evidence labels.
