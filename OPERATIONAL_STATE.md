# ShakeDown Operational State

<!-- operational-state:metadata
{
  "schema_version": 1,
  "project_id": "shakedown",
  "project_name": "ShakeDown",
  "project_root": "westkitty/ShakeDown",
  "artifact_path": "",
  "state_revision": 5,
  "last_updated": "2026-10-11T20:26:21Z",
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
| PND-002 | Full birthday route | Complete scripted assist-mode Node route + real browser DOM-input route under virtual rAF, no warps | Human normal-difficulty, physical device remain unverified |
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


## 15. Preparation Round 2 — revision 4

<!-- operational-state:entry
{"id":"VER-004","title":"Continuous assist-mode route browser proof","state":"partially-verified","scope":"Round 2 on prep/asset-ready-20261011","evidence":"Node input route and browser DOM/Canvas route with virtual rAF: 23/23 Dome steps, 31 shakes, 1 checkpoint retry, 3 natural Fox hits, birthday/replay","last_verified":"2026-10-11"}
-->
### VER-004
Verified continuous scripted assisted gameplay from initial spawn through full Dome to victory in Node and browser DOM/Canvas. Browser input uses test-driven keys and a virtual rAF schedule; no warp, direct physics call or authoritatively mutable QA aid. Human-paced/default-difficulty/real hardware not verified.

<!-- operational-state:entry
{"id":"VER-005","title":"Client-side asset review UI","state":"partially-verified","scope":"tools/asset-review.html","evidence":"Browser desktop/mobile emulation checks 220 visual +21 audio,26 source frames,0 approved outputs, PNG alpha/dimension/hash, WAV validity, rejected corrupt files","last_verified":"2026-10-11"}
-->
### VER-005
Browser-local intake/review UI reads canonical source contracts and approval manifest and examines candidates without upload or art approval. Original generated-art truth unchanged: zero newly approved final output files.

### Revision 4 release boundaries
PR #1 SHA 553be7d passed GitHub CI; Round 2 changes need independent tests and CI. Human-paced normal-difficulty route, real mobile/audio, generated art approval and deployed live-SHA playthrough remain open. Preserve all existing Cinnamon source frames and unchanged LM Arena instructions.


## 16. Preparation Round 3 — revised image activation and normal difficulty (revision 5)

<!-- operational-state:entry
{"id":"VER-006","title":"Approved images remain inactive until separately accepted into gameplay","state":"partially-verified","scope":"prep/asset-ready-20261011 Round 3","evidence":"Synthetic isolated full-lifecycle tests, two-stage renderer filter, localhost preview browser checks and screenshot SHA tamper rejection","last_verified":"2026-10-11"}
-->
### VER-006 — Source approval is not production activation
A verified technical source and reviewer-attested image do not enter ordinary gameplay automatically. The approved manifest records unverified integration until a distinct reviewer activation with the exact source hash and physically present QA screenshot hash. Only already-mapped renderer IDs can activate. Local previews can display a reviewed image without activating it on the hosted game. No externally generated final art has been delivered, approved or activated. Hashes cannot establish character fidelity; human review remains necessary.

<!-- operational-state:entry
{"id":"VER-007","title":"Normal-difficulty scripted full route","state":"partially-verified","scope":"Round 3 on prep/asset-ready-20261011","evidence":"Node normal-mode game input and browser DOM-key virtual-rAF normal full route, hazards on, checkpoint retry, Fox victory and replay","last_verified":"2026-10-11"}
-->
### VER-007 — Normal difficulty has a verified scripted solution
No-warp normal-mode Node route: 2,782 ticks, 21 Dome steps physically touched, 31 Shake pickups, a checkpoint retry and pit auto-reset, natural Fox 3-hit victory. Browser DOM route: 2,786 synthetic-rAF callbacks, 21 named steps, 32 pickups, normal Fox battle, birthday and replay. Legitimate jumps bypassed two steps. This is scripted mechanical solvability, NOT a human-paced player journey.

<!-- operational-state:entry
{"id":"VER-008","title":"Multiple physical input ownership","state":"partially-verified","scope":"Keyboard aliases and simultaneous keyboard/emulated touch","evidence":"Browser tests prove right-arrow/D ownership, keyboard+touch overlapping input, blur pause and input release","last_verified":"2026-10-11"}
-->
### VER-008 — Input ownership corrected
Physical keyboard codes and touch pointer identifiers now independently own logical game actions, so releasing one alias does not cancel another. Test assertions cover simultaneous sources and focus-loss pause. Emulated touch is not physical Android or iPhone validation.

### Round 3 delivery and release boundary
- 21/21 Node checks and 29/29 executed browser checks passed locally (3 planned skips).
- Starting PR commit 7cecff2 previously passed GitHub contract and browser CI; Round 3 exact-SHA delivery/CI remains pending.
- BigMac ADB unavailable, MacBook Air ADB detected zero devices, so there was no physical Android test; iPhone/speaker QA also remains unverified.
- Final generated assets, reviewed Fox identity, human-paced normal play, genuine mobile audio/touch, hosted exact-SHA game route and representative FPS remain outstanding.
- Main remains the existing playable birthday build, not this pending candidate.

### Revision log
- Revision 5: separated artwork approval and gameplay activation, proved scripted normal difficulty, corrected simultaneous control ownership, preserved visible preview warning and clarified source/reviewed/active states.
