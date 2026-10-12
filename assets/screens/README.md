# Exact source ZIP screen art

This directory contains the **twelve original PNG outputs** from the user-supplied
`ShakeDown_Screens_2026-10-11.zip`, reproduced byte-for-byte using its own
`build/build_screens.py` with portable filesystem paths:

| Screen | Scene | Interactive use |
|---|---|---|
| 01 | Start / level title | Default Start background (clean plate) |
| 02 | Game Over / Continue | Game Over background (clean plate) |
| 03 | Victory / credits | Victory background (clean plate) |

For each scene there is a **960×540** runtime source and **1920×1080** full-size master,
each in two variants: labeled `_clean_` (no baked text, used by the actual game)
and the display-ready texted version. All twelve are committed in this directory,
not left as unreferenced attachments.

## Production truth

- Source ZIP generator SHA-256: `2634be093b2a42249233962324047d68b80f81e2bb16fda1d5152d62bf7dfc64`
- A readable path-corrected copy lives at `scripts/build_uploaded_screens.py`.
- `scripts/reconstruct_uploaded_screens.py` reconstructs images from the pinned
  original source and versioned game assets using SHA-verified Google Fonts.
- Pixel/dimension/hash parity across **all twelve** images is enforced by
  `tests/screen-art.test.mjs`.
- The original ZIP's additional contact sheet was for review only; the twelve
  independent screen outputs are the deployable assets.
- The other ten generated title artworks remain in `assets/title/`, and all
  194 inventoried scene candidates remain available through the Art Director.
- All images are **provisional visually**, not human-approved final artwork.
- No SVG assets or runtime SVG references were imported.
