# ShakeDown Production-Art Integration Evidence

This directory contains **real screenshots from actual integration review**, once generated art has been received. It intentionally contains no placeholder screenshots.

## Two independent decisions

1. **Approve the source candidate:** accept an independent PNG after contract/dimension/alpha/canon inspection. This stores its real bytes and hash in the repository and records reviewer-attested review status with **unverified integration**. It **does not replace the Canvas fallback** in ordinary gameplay.
2. **Activate in the game:** use the **localhost-only preview** to view that approved-but-inactive file in the actual game scene. Inspect size, legibility, composition, collision alignment, boss telegraphs, and fidelity to approved Cinnamon/Fox identity. Capture an **actual full-game screenshot** in that scene. Independently attest to this screenshot and activate the exact approved asset version.

## Example: CO-03 Shake cup

These commands are templates. Replace paths and reviewer name with true values. Never execute approval or activation before personally inspecting the received source and integration preview.

    npm run serve
    # Visit: http://localhost:8765/tools/asset-review.html#asset=CO-03
    # Inspect/approve an actual CO-03 PNG using scripts/asset-intake.mjs.
    # Visit: http://localhost:8765/?preview-art=CO-03
    # Verify that CO-03 is visibly and correctly integrated.
    # Capture the real full-game screenshot as docs/assets/qa/CO-03/scene.png.
    node scripts/asset-intake.mjs activate --id CO-03 --reviewer REVIEWER_NAME --qa-evidence docs/assets/qa/CO-03/scene.png --visual-approved
    npm run validate
    npm run test:browser

The activation tool checks that the screenshot file exists inside this directory, is a decodable PNG at least 640x360, and remains unchanged according to its SHA-256 checksum. It binds the screenshot record to the *exact approved source SHA-256*, requires an explicit reviewer attestation, and refuses unsupported renderer logical IDs or duplicate activation.

**A valid image file and hash cannot prove what the image depicts.** Human review must determine whether the screenshot actually shows the named asset in the correct game scene. Visual QA screenshots and manifest activation are not substitutes for the complete browser/physical-device player journey.

## Current boundaries

- No final LM Arena images have been received, approved, or activated in this preparation sprint. Do not create synthetic production records from browser fixtures.
- The local preview query is disabled on hosted GitHub Pages and other non-localhost hosts.
- Future new visual IDs first require an authored, tested renderer mapping; source approval by itself never creates one.
- Final music, sound FX and physical device speaker checks still require genuine playback, licensing review and explicit audio integration; the two-stage visual gate does not pretend to integrate requested audio.
- Do not rewrite the source 220 visual or 21 audio job contracts to suit a conveniently shaped generator output.
