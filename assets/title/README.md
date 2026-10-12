# ShakeDown title screens

Ten standalone, full-size **1920×1080** title-screen images for
*ShakeDown — Cinnamon Fuzzbutt's Shamrock Shake Caper*, plus **960×540**
canvas-ready copies that drop straight into the game's 960×540 logical viewport.

`contact-sheet.jpg` is a review sheet only — it is not one of the ten.

## The ten screens

| # | File (master) | Chapter caption | Scene |
|---|---|---|---|
| 01 | `title_01_dawn-quad-hero.png` | THE SHAKE SNATCH | Golden-hour South Quad vista; Cinnamon sprints, the Fox flees with the shake |
| 02 | `title_02_the-last-shake.png` | THE LAST SHAKE | Close vignette at the shake stand: the theft itself |
| 03 | `title_03_golden-ascent.png` | THE GOLDEN ASCENT | Cinnamon climbing the Golden Dome's cornices at sunset |
| 04 | `title_04_summit-showdown.png` | SUMMIT SHOWDOWN | Boss standoff on the dome summit at dusk |
| 05 | `title_05_birthday-finale.png` | THE BIRTHDAY FINALE | Night celebration: cake, shakes, fireworks |
| 06 | `title_06_pep-rally-midnight.png` | PEP RALLY MIDNIGHT | Stadium-lit pep rally, confetti cannons, drummers |
| 07 | `title_07_quad-pursuit.png` | QUAD PURSUIT | Low-angle chase down the quad path, Cup Crawlers scattering |
| 08 | `title_08_blue-hour-on-the-dome.png` | BLUE HOUR ON THE DOME | Minimal backlit silhouette against the glowing dome |
| 09 | `title_09_the-long-way-up.png` | THE LONG WAY UP | Epic storybook vista of the whole route |
| 10 | `title_10_the-prize.png` | THE PRIZE | Hero macro of the Shamrock Shake, Fox escaping in the bokeh |

960×540 copies live in `canvas/` with a `_960x540` suffix.

## How they were made

1. **Key art generation.** Ten separate generation prompts, one image each —
   never a collage or contact sheet. Every prompt used the game's own art as
   reference input, so Cinnamon, the Fox and the campus stay on model:
   - Cinnamon: `assets/sprites/cinnamon/*.png` (the 26 physically present
     source frames) and `assets/production/cinnamon/*.png`
   - Fox: `assets/production/fox/fox_02.png`, `fox_03.png`, `fox_05.png` (the
     curator-selected purple-scarf poses)
   - Shamrock Shake: `assets/level1/collectibles/co_03_shamrock_shake_cup.png`,
     `assets/production/birthday/bd_05.png`
   - Cake: `assets/production/birthday/bd_01.png`
   - Scenery: `assets/level1/backgrounds/bg_01`, `bg_03`, `bg_05` and
     `assets/production/dome/backgrounds/dm_bg01`, `dm_bg04`, `dm_bg05`, `dm_bg07`
   - Props/enemies: `pr_01`, `pr_04`, `pr_12`, `en_01`, `en_06`, `mc_06`

   Raw generator output (1376×768) is kept in `.artifact-cache/title/raw/`,
   which is git-ignored, matching the existing `.artifact-cache/raw` convention.

2. **Crop and upscale to 16:9** — 1365×768 → 1920×1080 with a mild unsharp mask.

3. **Logo placement.** `scripts/build_title_screens.py` scores each frame for
   local edge energy and places the lockup in the calmest window near an
   art-directed anchor, so the lettering never lands on Cinnamon, the Fox or
   the dome. The chosen anchor and the measured background luminance are printed
   for every screen.

4. **Lockup compositing.** Chapter caption, `SHAKEDOWN!` logo, subtitle with
   flanking rules, HUD nod (hearts / shakes / zone), control legend,
   `PRESS START` prompt, scrims and vignette. The logo fill adapts to the sky it
   sits on (light face on a bright dawn sky, saturated gold on a navy night one).
   Lettering is composited as real vector type, not AI-drawn, so nothing is
   misspelled.

## Rebuilding

```sh
pip install pillow                 # only needed to rebuild; not a runtime dep
python3 scripts/build_title_screens.py
```

Fonts are vendored in `scripts/title-fonts/` (Archivo Black and Press Start 2P,
both SIL Open Font License 1.1 — licenses included).

## Integration status (2026-10-12)

- These are **presentation art**, not part of the 220-visual / 21-audio LM
  Arena production master and not in the 194-image production manifest.
- **All ten runtime-size PNGs are actively wired to the title browser** in
  `src/game/screen-art.mjs`; the independent supplied birthday Start clean
  plate is the first/default selection. The original semantic HTML Start and
  Continue controls remain interactive; the original procedural look is
  retained with `?art=classic`.
- They are **not human-approved final artwork.** Per the project's own asset
  rules, a generated image never stands in for owner visual sign-off.
- The character identity follows the immutable canon (Cinnamon is a red panda
  with round black glasses, blue headband, gray shirt, olive cargo shorts and
  one ringed tail; the Fox is a russet fox with a deep-purple scarf) and the
  palette uses campus navy `#22477F`, cream gold `#EBC666` and shake mint
  `#A8EFAD` — but the ten raw artworks have not been visually inspected by the
  project owner.

## Integrated on 2026-10-12

The title has a keyboard/touch-accessible previous/next artwork selector and continues to use the existing semantic Start/Continue buttons, Art Director, and independent game engine. Game Over and Victory use context-specific PNG plates. `?art=classic` keeps the original lightweight screens. None of these generated PNGs is silently marked artist-approved; visual sign-off remains pending. No SVG is imported.
