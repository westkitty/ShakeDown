# ShakeDown Operational State

<!-- operational-state:metadata
{
  "schema_version": 1,
  "project_id": "shakedown",
  "project_name": "ShakeDown",
  "project_root": "westkitty/ShakeDown",
  "artifact_path": "",
  "state_revision": 3,
  "last_updated": "2026-10-11T19:40:00Z",
  "current_baseline": {
    "identity": "main@80d388828bfcad0cf454fe0b2b166e6528ac5e6d (pre-preparation production baseline)",
    "state": "current-baseline",
    "last_verified": null
  },
  "scope_boundaries": ["ShakeDown 2D browser game", "Cinnamon Fuzzbutt sprite masters"],
  "linked_parent_state": null
}
-->

## 1. Project Identity and Scope
ShakeDown: birthday platformer for Maverick, Cinnamon Fuzzbutt as playable red panda; South Bend / Notre Dame, Shamrock Shakes, Fox antagonist.

## 2. Current Baseline
A playable static Canvas 2D runtime and 26 Cinnamon source-derived PNG frames are pushed to main. Fox, terrain, props and cake are honest procedural Canvas fallbacks pending the 220-visual/21-audio LM Arena specification packet, not final generated art. The historical separate ZIP remains an off-repo source and was not silently imported.

## 3. Artifact Contract
Modern pixel art, clean independent transparent source-derived Cinnamon PNG frames, actual frames.json hashes, full 273-page asset production PDF + editable Markdown + complete JSON contract, verified browser game interaction, and Pages deployment only when confirmed.

## 4. Active Invariants
<!-- operational-state:entry
{"id":"INV-001","title":"Cinnamon visual identity","state":"requested","rule":"Red panda with burnt-orange/cream fur, round dark glasses, blue headband, grey shirt, olive cargo shorts, large striped tail.","scope":"All player art","authority":"User-provided model sheets and approved Candidate B"}
-->
### INV-001 — Cinnamon visual identity
- **State:** requested
- **Rule:** Red panda; consistent glasses, band, shirt, shorts, markings, and tail.
<!-- /operational-state:entry -->

## 5. Verified Working Behavior
<!-- operational-state:entry
{"id":"VER-001","title":"Off-repository asset integrity","state":"verified","capability":"16 transparent Option B source frames translated into normalized slots; ZIP/hash readback passes.","scope":"Standalone art bundle only","verification_method":"Local PIL extraction, atlas pixel comparison, sha256 and ZIP readback","evidence":"ShakeDown_Cinnamon_Art_PreHandoff.zip sha256 e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb","artifact_revision":"art-handoff-2026-10-11","last_verified":"2026-10-11","recheck_trigger":"Any sprite manipulation, atlas repack, or binary transfer"}
-->
### VER-001 — Off-repository asset integrity
- **State:** verified only for file structures and hashes, not for in-game visuals.
<!-- /operational-state:entry -->

## 6. Known Not Working
<!-- operational-state:entry
{"id":"BRK-001","title":"Clipped original run_03","state":"known-broken","observed_failure":"Opaque source pixels touch original 256px right edge; cropped source cannot be recovered by padding.","workaround":"Do not include run_03 in runtime sequence.","affected_user_path":"Run-cycle animation"}
-->
### BRK-001 — Original run_03 is clipped
- **State:** known-broken, withheld from playback.
<!-- /operational-state:entry -->

## 7. Implemented but Unverified
The browser-executed game, controls, 26 image loads, Dome camera, Fox three-hit state machine and birthday finale were observed in injected Chromium harness; an unassisted full traversal, real mobile device testing, and live deployed URL navigation remain unverified.

## 8. Unknown or Evidence-Stale State
New candidate Fox identity is unapproved; visual final-generation count 0. Live Pages URL playback and physical-phone touch/audio performance still require proof.

## 9. Pending Work
Completed the 26-frame hash-backed upload, playable runtime, local Chromium injection checks, 12 deterministic tests and expanded asset specification. Remaining: commit this packet, enable Pages, validate public URL and actual player journey when feasible; LM Arena generates final assets as a separate future handoff.

## 10. Active Decisions, Defaults, and Prohibitions
Modern Pixel Candidate B selected. Do not overwrite Cloud Chaser. Do not claim art source sheets are game-ready animation atlases. No Bethel setting; Notre Dame / South Bend story only.

## 11. Validation and Evidence Matrix
| ID | Claim | Evidence class | Remaining check |
|---|---|---|---|
| VER-001 | ZIP hash / normalized frame integrity | Tested local file bytes | Verify remote binaries after upload |
| BRK-001 | run_03 source edge crop | Inspected raster alpha boundary | Regenerate/repair source |
| PND-001 | Gameplay animation | 26 real source cutouts browser loaded | Full live-site playthrough and more complete animations |
| PND-002 | Full birthday route | Unit tests + sampled browser scenes | Unassisted run and device tests |
| PND-003 | Production art library | 220 standalone specs, 26 source-existing | 194 missing generated visuals and Fox approval |

## 12. Current Change Scope and Impact Radius
After 8b39c32 runtime milestone: publish expanded LM Arena PDF/MD/JSON and fixed event ledger, preserve gameplay and original sprites, deploy to Pages only after CI pass. Cloud Chaser remains strictly read-only.

## 13. Compact Revision Log
- Revision 1: established asset-state boundary, verified local artifact hashes, protected missing animation/binary-transfer gates.
- Revision 2: recorded tested playable 8b39c32 milestone, 26 source-derived integrated frames, bounded browser proof, comprehensive art contract and remaining Pages/live-device/LM Arena gates.


## 14. Preparation candidate — 2026-10-11 (revision 3)

<!-- operational-state:entry
{"id":"VER-002","title":"Main-branch CI and hosted index availability","state":"partially-verified","scope":"main@80d3888 before preparation","evidence":"GitHub Actions contract run 38165872650 SUCCESS; Pages run 38165872137 SUCCESS; hosted index HTTP 200 by BigMac curl","last_verified":"2026-10-11"}
-->
### VER-002 — Main-branch availability
Main baseline 80d3888 had successful GitHub Actions contract and Pages workflows, plus an independent HTTP 200 for the hosted index. This establishes availability only, not a complete unassisted live-site gameplay experience.

<!-- operational-state:entry
{"id":"VER-003","title":"Local preparation branch acceptance","state":"partially-verified","scope":"prep/asset-ready-20261011","evidence":"Original 12 Node tests passed; preparation 18/18 unit tests, 6/6 Playwright HTTP+Brave tests in desktop/mobile emulation; isolated asset acceptance test later added; boss test-assisted warp cannot prove route","last_verified":"2026-10-11"}
-->
### VER-003 — Local candidate
The candidate adds image/audio acceptance, SHA256-based staging, reviewer attestation, immutable approved checkpoints, a runtime image loader with Canvas fallback, and tests. No newly generated LM Arena images were inserted. BRK-001 source run_03 remains clipped but is no longer selected or loaded for gameplay (25 usable of 26 original PNGs). Preserve all original PNG bytes.

### Outstanding release evidence
- GitHub CI for submitted preparation SHA; do not infer from local tests.
- Ordinary player journey from campus through all Dome steps and natural boss defeat without QA warp.
- Physical phone touch and audible speaker/mute validation; emulator screenshots do not qualify.
- Fox FOX-01 identity review and actual LM Arena output intake; all final generated art still awaits delivery.
- Hosted exact SHA full-journey proof and representative long-session performance measurements.

### Revision log addition
- Revision 3: reconciled current deployed baseline, documented asset intake and playable clip exclusion; tracked preparation browser evidence and remaining approvals/device/route gates.
