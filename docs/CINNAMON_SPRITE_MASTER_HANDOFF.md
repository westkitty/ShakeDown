# Cinnamon Fuzzbutt — selected Modern Pixel sprite masters

**State on 2026-10-11: art-source and normalized-subset handoff; full runtime pack not yet complete.**

## Authority and fidelity
- User selected modern pixel Candidate B for Cinnamon Fuzzbutt. The five supplied original model sheets outrank later generated images when traits conflict.
- Locked: anthropomorphic red panda, burnt-orange/cream fur, dark brown paws, broad striped tail, round dark glasses, blue headband, grey T-shirt, olive cargo shorts.
- Game setting: South Bend and Notre Dame; Shamrock Shake finale; Fox antagonist; no Bethel campus and no birthday-cake quest.
- Master reference illustration and expanded pose-source were produced, along with corrected transparency and physically extracted movement frames, **outside the GitHub repository**.
- Do not mistake an image-generation contact sheet for a mechanically aligned sprite atlas.

## Exact off-repository artifact snapshot
- Package: `ShakeDown_Cinnamon_Art_PreHandoff.zip`
- SHA-256: `e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb`
- 29 file entries with source-art, QA, normalized PNG frames, atlas, JSON metadata, and GIF previews, plus directory SHA manifest.
- Source reference sheet `master-reference-sheet.png`, SHA-256: `fbe4afbb8443f4881a2bc6543a175405b7f1af0bffc0f2d07707f0d732081fcf`
- Generated expanded pose source `expanded-pose-source-original.png`, SHA-256: `124481c14c7c02843c7d1c813a32ff5f5e503ba726782e462598e80bc0ea41f2`
- Normalized 4x4 atlas `atlas.png`, SHA-256: `144f927407602018a580e24a6d2d6fcc9fef9645c22ac295b7d8df4ea85704c1`

The package is available as a ChatGPT conversation artifact, not from a permanent public URL. Its ZIP **has not been copied into this repository**. Never claim those images are on GitHub until the exact binary hashes are verified there.

## Verified narrow art integrity
- 16 physically cut transparent PNG frames from the earlier Option B package.
- Each 320x320 normalized frame is a translation-only copy of the 256x256 source art.
- Per-frame PNG SHA-256 recorded in `normalized/atlas.json`.
- Atlas pixel data matches the cut frames by construction and was locally validated; ZIP readback/hash checks passed.
- Shared frame origin pixel: (205, 260).
- Sequences declared: idle 4 frames @180ms, walk 6 @110ms, run 5 @90ms.
- Original `run_03.png` retains an edge crop; present in archival 16 but excluded from the five-frame runtime run sequence.

## Pending requirements
1. Get exact master archive bytes into GitHub at `assets/sprites/cinnamon/` using a binary-capable Git client or equivalent.
2. Verify in-repository image hashes against this handoff's `files.sha256.json`.
3. Confirm no alpha halos or misalignment in actual game render, not just a contact-sheet preview.
4. Extract, normalize, and separately approve jump, dash, tail-swish attack, hurt, climbing, interactions, celebration, and the Shamrock Shake sipping animation.
5. Separate VFX and environmental platform tiles from character frames.
6. Create and test hitboxes, animation transitions, input handling, mobile animation readability, and atlas loader.
7. Only after browser-played inspection promote these to `verified-integrated`.

## Transfer principle
No invented filenames, pivots, timings, animation counts, or checksums. Source images and physically generated runtime assets have separate status. The requested push includes this truthful handoff text **only**, not binary sprite art.
