# P019 — Artwork used in ShakeDown: acceptance and release fence

**Date:** 2026-10-12
**Repository:** `westkitty/ShakeDown`
**Source branch:** `feat/omni-approved-20261012`
**Authority:** Existing owner-supplied character/screen references and manually reviewed, hash-bound runtime integration evidence. This report does **not** supply new author approval.

## Machine-verifiable evidence — passed

Run from the checkout:

```sh
npm run art:acceptance
node scripts/art-acceptance-audit.mjs --markdown
```

The first emits a JSON report containing the exact 63 provisionally displayed candidate IDs, original file paths, exact SHA-256 digests, dimensions, and human-review state. The second emits a 63-row reviewer-ready checklist with the same hash identifiers.

Results at audit time:

| Surface | Physically checked | Interpretation |
|---|---:|---|
| 194 candidate art sources catalogued | 194 in manifests | Candidate inventory, **not** 194 shipped images |
| Default preview artwork | 28 | Structurally eligible / source-verified; still provisional |
| Additional default environmental artwork | 35 | Structurally eligible / source-verified; still provisional |
| **Total default candidate images** | **63 / 63** | SHA-256 and dimensions match their source manifest |
| Candidate sources requiring revision | 11 | Not selected for default preview |
| Candidate sources blocked structurally | 24 | Not selected for default preview |
| Cinnamon source-derived frames | 26 / 26 | 25 used in gameplay; `run_03` kept but skipped because clipped |
| Smudge and Dexter encounter frames | 4 + 4 | SHA-verified, each has 2 unique frame hashes |
| Supplied player-facing title, loss, victory plates | 3 | Physical source-verified; screen/artistic review is separate |
| Alternate raster titles | 10 | Available inside Workshop; not required for the main run |
| Integrated final runtime artwork | 0 | `assets/runtime/manifest.json` is empty |
| Final human approvals for 63 default candidates | 0 | Do not count technical review as artistic signoff |

The results are reproducible with `node scripts/art-acceptance-audit.mjs --require-approved`. This **returns exit code 2** until the final artwork contract is satisfied. The default report command returns 0 if integrity checks pass, because generating a truthful report must not be confused with release acceptance. Missing/corrupted art returns exit code 3. Neither command edits any approval manifest, artwork, browser save, or Git state.

## Recorded decision needing careful reconciliation: FOX-01

`assets/production/approvals.json` records a project-owner decision `FOX-01: APPROVED` and an explicit bipedal, purple-scarfed, style-matched character design. **Preserve this historical approval** rather than overwriting it with a contradictory false assertion.

However, that decision carries **no SHA-256 of the current `assets/production/fox/fox_01.png`**, no rendered integration acceptance screenshot, and no authorization to mark all dependent animation states final. The separate curator record still has `finalHumanApproval:false`, and runtime-approved artwork remains absent.

Conclusion: **character-design direction is approved; this specific candidate PNG and its game integration are not certified as final**. The distinction must be resolved by real owner review, not inferred from filenames, curation scores or CI.

## Actual review path (not another 194-asset production quota)

1. Open the current feature build and inspect representative **South Quad**, **Pep Rally**, **Dome**, **Fox fight**, **Smudge alcove**, **Dexter summit** and **birthday finale** scenes at normal gameplay scale. Compare `?art=classic` with default selected art.
2. Use the existing **Workshop & Extras → Art Director** to view source IDs in live context, and **Art Jury** (`tools/asset-gallery.html`) for side-by-side review, KEEP/REVISE/REJECT notes, and downloadable hash-bound review JSON. These votes remain **review input**, not automatic production activation.
3. Review Cinnamon against owner source sheets (burnt orange/cream red panda, black circular glasses, blue headband, gray shirt, olive cargo shorts, striped tail). Do **not** invent a restored original `ShakeDown_Cinnamon_Art_PreHandoff.zip`: recorded expected SHA-256 `e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb` is still not verified in this checkout.
4. Compare the Fox against approved FOX-01 **design** (bipedal; purple scarf; no red-panda face mask, headband, glasses or ringed tail). Inspect actual attack tells and STUNNED cues before approving any specific frame.
5. Inspect ground/platform seams, transparency, player silhouette/collider alignment, architecture layering, camera cropping, boss attack warnings, legibility and art consistency on desktop **and a physical Android device**. Check reduced motion and high contrast.
6. Review the supplied title/loss/victory plates separately; preserve original source bytes. Review Smudge/Dexter against their supplied sheet provenance and examine actual encounter compositions, not merely sprite hash success.
7. Have the project owner make a per-source (or well-defined scene batch) KEEP, REVISE, or REJECT decision **with source file, exact SHA, reviewer, date, and screenshot/gameplay context**. No silent or inferred approval.
8. Only once signed decisions exist, separately implement **supported verified runtime mapping** and run the existing production intake/activation test gates for those exact bytes. Do **not** simply flip `finalHumanApproval` in curation: the current provisional loader intentionally accepts `false` and would stop showing such a candidate without proper final integration.
9. Rerun the strict gate, mobile/desktop visual QA and full normal/assisted route; assess the exact final Git SHA and actual published version separately before declaring art/release-ready.

## Open decisions

- Which of the **63 actually displayed** candidate images are final, require replacement, or are intentionally adequate as provisional? The audit does not make subjective decisions.
- Whether to restore the original pre-handoff Cinnamon archive to prove exact provenance. The present 26 derived sprites remain a verified, working fallback.
- Whether the Fox candidate and all attack cues match the already approved FOX-01 **design**.
- Physical mobile artistic legibility and a genuine player-paced release signoff.

**Outcome: P019 audit and release evidence tooling implemented; source hashes verified; final owner art acceptance remains BLOCKED.** This is not a missing software feature that an agent may invent away.
