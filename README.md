# ShakeDown — Cinnamon Fuzzbutt's Shamrock Shake Caper

A playable, static-hosted Canvas 2D birthday platformer for **Maverick**. Cinnamon Fuzzbutt (a red panda, not a cat) chases the Fox across Notre Dame's South Quad, climbs a playable Golden Dome, beats the Fox, and celebrates with cake and Shamrock Shakes.

## Play

**[Open the birthday game](https://westkitty.github.io/ShakeDown/)** (live only after GitHub Pages is enabled and deployment is verified).

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
- `assets/sprites/cinnamon/*.png` and `frames.json` contain 26 reproducible cut-outs physically produced from `cinnamon_actions_sheet.png`; they are **real, loaded sprites**, but not a claim of individually newly hand-drawn animations. See `scripts/extract_cinnamon.py`.
- The Fox, backgrounds, terrain, collectibles, UI and cake currently use explicit procedural Canvas illustrations. They are playable **temporary integrated drawings**, not LM Arena final artwork.
- `docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf` is the expanded 220-visual-asset / 21-audio-request LM Arena production master; its editable Markdown source, machine-readable JSON and reproducible compiler are committed alongside. 26 existing Cinnamon frames are verified; 194 final visual requests are still **not generated**. A specification never stands in for verified bytes.

## Validation

`npm test` runs deterministic movement/interaction/boss tests. `npm run validate` also checks asset manifest entries and planning invariants. Visual playback has been exercised in headless Chromium using an injected bundle because this container forbids browser URL navigation; that **does not** constitute live-site proof. See `docs/VALIDATION.md` for precise evidence boundaries.

## Project and authority

This is **westkitty/ShakeDown**. Cloud Chaser (`westkitty/c_chase`) was inspected strictly as a movement/UX reference and has not been modified. The Modern 2D Browser Game Architecture Toolkit v2.0 governs the static game architecture and evidence labels.
