# ShakeDown Operational State

<!-- operational-state:metadata
{
  "schema_version": 1,
  "project_id": "shakedown",
  "project_name": "ShakeDown",
  "project_root": "westkitty/ShakeDown",
  "artifact_path": "",
  "state_revision": 1,
  "last_updated": "2026-10-11T17:55:00Z",
  "current_baseline": {
    "identity": "main@0836473342088d406a089be2e5badd783bc4aff9 (before handoff metadata commit)",
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
Phase 0 project documents exist. A generated sprite-art handoff is available as a separate verified ZIP, but its binary contents are not in the repository.

## 3. Artifact Contract
Modern pixel art, clean transparent PNG sprite frames, reproducible atlas JSON, accurate provenance and asset hashes, eventual browser gameplay test.

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
Expanded pose-source alpha remapping; no individual approved gameplay frames for new action families and no browser animation viewer.

## 8. Unknown or Evidence-Stale State
Final sprite frame sizes and pixel hitboxes in ShakeDown runtime; fidelity after rendering at 960x540 mobile viewport.

## 9. Pending Work
Binary GitHub upload; hash check on actual branch; action-frame extraction; palette consistency/alpha QA; source-tested platformer; gameplay browser QA.

## 10. Active Decisions, Defaults, and Prohibitions
Modern Pixel Candidate B selected. Do not overwrite Cloud Chaser. Do not claim art source sheets are game-ready animation atlases. No Bethel setting; Notre Dame / South Bend story only.

## 11. Validation and Evidence Matrix
| ID | Claim | Evidence class | Remaining check |
|---|---|---|---|
| VER-001 | ZIP hash / normalized frame integrity | Tested local file bytes | Verify remote binaries after upload |
| BRK-001 | run_03 source edge crop | Inspected raster alpha boundary | Regenerate/repair source |
| PND-001 | Gameplay animation | Not implemented | Browser execution + visual and control QA |

## 12. Current Change Scope and Impact Radius
Add truthful sprite-master handoff metadata and operational state; do not mutate gameplay code, renderer, Cloud Chaser, or production deployment.

## 13. Compact Revision Log
- Revision 1: established asset-state boundary, verified local artifact hashes, protected missing animation/binary-transfer gates.
