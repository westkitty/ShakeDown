# ShakeDown — Art Jury and combined-branch release

Date: 2026-10-11

## Source reconciliation

The verified preparation branch was merged through PR #1 into main at `adf6a55fb468733b6db88807e8c38973f01d39a2`. The Arena branch `arena/34b09180-shakedown` at `57c45560fd389dc873a2debc05700c7eb4801e3e` produced 194 real normalized PNG assets. The consolidation branch contains an ancestry-preserving two-parent merge of both histories, with conflicts in only `.gitignore` and `scripts/validate-content.mjs` explicitly reconciled.

All 194 generated source images physically matched their recorded SHA-256 and target dimensions in the initial BigMac audit. The 26 original Cinnamon cutouts remain unchanged. The original generator contracts cover 220 visuals and 21 recorded audio requests. High-resolution raw image inputs referenced in `.artifact-cache/raw` remain missing. Six later user-provided MP3s now cover campus, Dome and boss background-music roles; they do not silently satisfy the other 18 named audio contracts.

**Authority conflict:** Arena's updated master document says some outputs are normalized or approved, but all 194 actual physical candidate manifest entries still say `AWAITING_HUMAN_VISUAL_REVIEW`, and the canonical runtime approval ledger has zero externally accepted production assets. This integration does not manufacture final owner signoff.

## Independent visual jury

The complete SHA-bound ledger `assets/production/curation.json` rates every one of the 194 real PNGs:

| Decision | Count | Meaning |
|---|---:|---|
| Curator-selected opt-in previews | 28 | Strongest selections, context-tested in real Canvas |
| Preserved alternatives | 131 | Keep originals for comparison and future choices |
| Explicit revision requested | 11 | Visual identity, meaning, silhouette or crop needs correction |
| Structurally blocked | 24 | Missing the transparent pixels demanded by original contracts |
| **Total** | **194** | All source variants retained, none automatically accepted |

**FOX vs FX:** The newer FOX-02/03/05/06/08/09/11/12 action set has one consistent orange bipedal Fox wearing a purple scarf, with distinctive tells, charge, volley, stagger and hurt poses. Older FX models omit the accepted costume and do not clearly show the stolen shake. Keep the families separate. Do not mix a sprite from FX into the FOX animation.

**Cake vs shake:** CO-03 is the side-on Shamrock Shake collectible with straw and cream. BD-01 is a visually distinct tiered pink *birthday cake*, not the stolen drink. BD-05 supplies a separate final milkshake. Cinnamon's main 26 source sprites stay canonical; CIN-N04 and CIN-N06 are only supplemental pickup/victory reactions.

**Notre Dame environment:** BG-01 is quieter and more readable as a pixel sky. Selected non-colliding Quad decorations are PR-03/06/09/12. Reject the soft, photographic scenery and blurry 32px tiles for collidable environment replacement unless they become properly transparent, seam-safe and sharp at native size. Original physics and 23 Golden Dome platform stages remain authoritative.

**Known revision examples:** UX-06 looks like left/right arrows instead of Pause; PK-03 fails as a distinct third rotation; CIN-N07's sip pose lacks a convincing cup; PR-01 contains checkerboard-style background contamination; PR-08 and MC-09 lack clear silhouettes; EN-07 reads like blurry fire. Twenty-four image IDs are hard-blocked by transparency mismatch, and none enter the default game.

## Real runtime delivery

The game now has an opt-in **Curator's Cut** from title/Pause or via `?art=curated`. It fetches exactly 28 independently chosen actual source files, validates SHA-256 against the underlying Arena source manifest, checks dimensions, and decodes with bounded concurrency. It then draws them in the matching player/gameplay contexts. Failed hashes, missing images and other transport errors preserve the functioning original Canvas fallback. The option is reversible within the session and **off by default**.

The separately accessible `tools/asset-gallery.html` **Art Jury** presents all 194 files on checkerboard backgrounds with IDs, source hashes, per-asset reasons, grades, compare collections, full search, filters, and KEEP / REVISE / REJECT voting. Notes are stored in the user's own browser and can be exported as a SHA-bound review JSON. Those votes **do not modify GitHub or mark art accepted**.

Runtime integration has been deliberately limited to safe scene roles: background, Shamrock Shake, two separate finale props, purple-scarf boss action/tell/stagger/defeat, Cannon/Cup Crawler states, beacons, checkpoints, supplemental Cinnamon reactions, non-colliding campus scenery. Boss timing, collisions, persistence and original player controller remain untouched.

## Verification boundaries

Earlier on the combined local checkout, Node validation reached 34/34, runtime preflight inventoried 238 required files with no missing files, desktop curated gallery/preview tests passed, mobile-emulated gallery tests passed, and normal/assisted/curated scripted full routes reached the birthday victory through gameplay inputs. The local build Mac then lost its connector connection. These are **local** receipts, not proof of publication or physical-phone acceptance.

The exact final GitHub branch commit must pass CI before merging. GitHub Pages deployment and actual hosted playback must be separately verified. Still missing are human art approval, reworked 24 alpha failures/11 recommended revisions, raw generator originals, 18 non-covered recorded-audio contracts and physical-device audio/FPS/human gameplay acceptance.

The user's judgement overrides the curator's provisional assessment. All 194 candidate source images have been preserved for that purpose.
