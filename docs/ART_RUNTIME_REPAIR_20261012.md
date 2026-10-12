# Shakedown — Visual Runtime Repair / 2026-10-12

**Working baseline:** public `main` at `7103b7e987678d0c376ce04b5a6d5a9a2a03b4f2`.
**Fix branch:** `fix/production-art-world-20261012`.

## Cause

The game had 194 generated raster candidates but gameplay was still dominated by hand-drawn placeholder architecture, featureless ground and basic campus furniture. Only 28 curated previews were default-loaded; other appropriate, physically present background, architecture, mechanism, scene prop and effects images were stranded in the review catalog. The approved-art runtime ledger is separate and intentionally empty. The original 29-entry prehandoff Cinnamon pack, previously selected as Modern Pixel Candidate B, was not imported as that binary and cannot be reconstructed from a README.

## Implementation

- Retain the actual Canvas 2D renderer, fixed-step game state, authored platform collision, boss timing, input mapping, save/checkpoint system, music, original screens and `?art=classic` rollback.
- The existing 28 verified preview entries remain exactly 28. A *separate*, static, explicit list of **35** additional currently non-blocked alternate images is validated by matching source manifest ID, filename, SHA-256, dimensions, source review status, and non-approval fields.
- On curated/default view, render the actual Notre Dame background, Golden afternoon ascent sky and summit panorama, with camera-progress fades rather than abrupt artwork pops. Remove the plain green/gray fill that had concealed the original illustrated campus lawn.
- Replace the 4,500px placeholder facade with camera-culled physical window, pilaster, dome, Mary statue, flag and summit-railing sprites. A missing required facade asset falls back to the exact old procedural path.
- Add actual source-backed quad trees, lampposts, signage, benches, fences, coolers and market props; the moving decks, pulsing banners, beacons, checkpoints, grounded summit parapet, milestone particles and birthday finishing art now resolve directly to committed image IDs.
- None of these art placements changes player/world coordinates, collision, checkpoints, difficulty, boss phases, audio or persistence.
- `?art=classic` still renders the original scene and prevents loading the 35 optional scene PNGs. All 24 structurally blocked images, 11 revise images, and any source whose hash/size/status changes remain excluded.
- The on-screen art status labels these images as **not approved**. `assets/runtime/manifest.json` remains unchanged; no final human art sign-off has been fabricated.

## Baseline and QA

- The untouched baseline returned 45 Node tests, 0 failures.
- After the repair, `npm run validate` returned 47 Node tests, 0 failures (includes two new physical-SHA/metadata regression cases).
- Desktop and Pixel 7 Chromium emulation each exercised three real Canvas gameplay locations and compared source-art rendering with the classic fallback; both passed. The browser tested rendering and real assets, not merely manifest contents.
- Existing curated visual-selector, Art Jury, owner-voting and corrupt-image fallback behavior passed in desktop and mobile Chromium emulation (8/8).
- The scripted desktop *curated art* route physically advanced the game using real DOM game input through all 23 ascent steps, five checkpoint writes, the boss attack/recovery phases, the three-hit victory and replay; passed.
- Original validation and browser smoke are not final owner visual acceptance. Browser emulation is not physical Android/iPhone QA.

## Screenshot receipts

All images were captured from a served local real-browser gameplay state with the updated renderer. They are *diagnostic examples* rather than user approval:

- [South Quad](qa/art-repair-quad.png)
- [Golden Dome ascent](qa/art-repair-ascent.png)
- [Summit Fox fight](qa/art-repair-summit.png)

## Unresolved

1. **Character source:** `ShakeDown_Cinnamon_Art_PreHandoff.zip`, SHA-256 `e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb`, is still absent as a usable exact binary in this GitHub checkout. The existing 26 extracted `cinnamon_actions_sheet.png` frames remain unchanged. Do not imply the 320x320 normalized original atlas was restored or the correct original character is now guaranteed.
2. **Human visual sign-off:** none of the 194 Arena PNGs is promoted from provisional art to approved-final.
3. **Known defective assets:** the 24 alpha-blocked and 11 revise entries are still excluded from main preview. They require separate source fixes and review.
4. **Mobile device/physical audio proof** is not established by Playwright emulation.
