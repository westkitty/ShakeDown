# ShakeDown - LM Arena batch intake runbook

**Objective:** accept real generated outputs into a review queue without inventing file identities, overwriting previously accepted files, or activating art before gameplay inspection.

**Authority:** the approved character references, docs/IMPLEMENTATION_PLAN.md, docs/assets/ShakeDown_Complete_Asset_Contract.json and assets/runtime/manifest.json. Do not change the 220 image and 21 audio requests while generation is underway.

## Current physical reality

There are 26 committed Cinnamon source cut-outs, including clipped run_03 preserved in the archive but omitted from playback. Zero final externally generated images or recorded audio have been approved. **194 additional images and 21 audio requests (215 jobs)** therefore await real files and independent acceptance.

FOX-01 is a human character-identity gate. No dependent Fox state may be declared final before it is approved.

## Receive an actual batch

Unpack ZIP archives using a trusted program **outside the repository**. The CLI deliberately does not extract ZIPs, execute scripts, or follow symlinks. Keep original files unchanged.

File-to-contract mapping is strict:
- Exact original contract basename, such as bg_01_daylight_sky.png.
- Leading logical ID followed by a separator, e.g. BG-01__sky.png, CO-03__cup.png or AU-01__music.wav.
- Wrong/unknown IDs, ambiguous or duplicated candidates, repeated identical bytes across different IDs, invalid PNG/WAV/OGG, missing transparency and wrong dimensions are flagged. **Names alone are never artistic evidence.**

## Dry-run report: no file changes

From the repository root, use a physically existing generated-file directory:

    npm run asset:batch -- --dir "/ABSOLUTE/PATH/TO/LM_ARENA_OUTPUTS"

Optional machine-readable, one-time JSON report:

    npm run asset:batch -- --dir "/ABSOLUTE/PATH/TO/LM_ARENA_OUTPUTS" --output "/ABSOLUTE/PATH/TO/shakedown-batch-report.json"

Reports show logical IDs, original file paths, SHA-256, byte counts, expected paths, decoded dimensions, violations, warnings and missing contracts. Report output cannot silently overwrite an earlier report or either master acceptance manifest.

## Explicit staging: no approval

After resolving duplicated/unknown entries:

    npm run asset:batch -- --dir "/ABSOLUTE/PATH/TO/LM_ARENA_OUTPUTS" --stage

This copies only unique structurally compliant files into ignored .asset-staging/ID/SHA256 paths with provenance metadata. It does not change assets/runtime/manifest.json or enable any generated art in-game.

## Human source approval

Compare the real original source to canonical character/campus references, contract pixel size, alpha/crop quality, license/provenance, and the at-scale gameplay silhouette. Only then, using the actual staged hash and reviewer:

    node scripts/asset-intake.mjs approve --id CO-03 --file ".asset-staging/CO-03/HASH.png" --reviewer "REVIEWER_NAME" --visual-approved

Source approval is **reviewed, not activated**. This gate refuses overwriting an accepted checkpoint, and requires FOX-01 approval before its dependent states.

## Separate in-game activation

Launch the local game:

    npm run serve

Inspect the reviewed art at http://localhost:8765/?preview-art=CO-03, including HUD readability, collision alignment, boss warning visibility and mobile layouts. Capture an actual in-game screenshot at docs/assets/qa/CO-03/scene.png and confirm it visually before running:

    node scripts/asset-intake.mjs activate --id CO-03 --reviewer "REVIEWER_NAME" --qa-evidence "docs/assets/qa/CO-03/scene.png" --visual-approved

Activation binds the screenshot checksum to the exact source hash. Structural correctness of the screenshot is **not proof of its depicted content**; genuine human review remains essential.

Unsupported renderer IDs require an authored, tested placement before activation. Accepted WAV/OGG bytes do not automatically become playable recorded sounds: licensing, loudness, seamless loops and actual playback remain separate gates.

## Release checks

    npm run validate
    npm run release:preflight
    npm run test:browser

Keep approved-art revisions independently reviewable. Never overwrite approved Cinnamon sources, silently adopt generator names as identifiers, or merge unverified art into main.

## Explicit limitations

Generated prompts and ZIP names do not establish physical file creation. Identical SHA-256 under unrelated IDs may indicate reused incorrect content, so the bulk gate blocks automatic staging. Neither a passing report nor an accepted file proves character identity, originality, microphone/speaker playback quality, complete gameplay or real-phone usability.
