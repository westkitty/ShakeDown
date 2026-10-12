# ShakeDown Operational State

<!-- operational-state:metadata
{
  "schema_version": 1,
  "project_id": "shakedown",
  "project_name": "ShakeDown",
  "project_root": "westkitty/ShakeDown",
  "artifact_path": "",
  "state_revision": 12,
  "last_updated": "2026-10-12T04:44:00Z",
  "current_baseline": {
    "identity": "main@528a27fc96d5962c4a0b7d90765b10c78306d970",
    "state": "current-baseline",
    "last_verified": "2026-10-12"
  },
  "scope_boundaries": ["ShakeDown 2D browser game", "Cinnamon Fuzzbutt sprite masters"],
  "linked_parent_state": null
}
-->

## 1. Project Identity and Scope
ShakeDown: birthday platformer for Maverick, Cinnamon Fuzzbutt as playable red panda; South Bend / Notre Dame, Shamrock Shakes, Fox antagonist.

## 2. Current Baseline
Main contains the playable static Canvas 2D runtime, 26 canonical Cinnamon source-derived frames, all 194 generated image candidates, the Curator's Cut, Art Jury and in-game Asset Director. Generated images remain candidates unless individually approved; classic procedural rendering remains the fallback. The soundtrack integration described in revision 11 is feature-branch work until its exact commit is merged and deployed.

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


## 17. Preparation Round 4 — durable checkpoint, Reduced Motion, keyboard operation (revision 6)

<!-- operational-state:entry
{"id":"VER-009","title":"Monotonic birthday completion and validated checkpoint persistence","state":"partially-verified","scope":"Round 4 prep branch candidate","evidence":"Baseline browser saved-completion regression reproduced; Node versioned checkpoint validation; browser saved checkpoint Continue/new Start/reload/legacy cases; assisted and normal full routes autosaved checkpoints 1-5 before clearing at victory","last_verified":"2026-10-11"}
-->
### VER-009 — Saves preserve earned achievements and support local checkpoint Continue
The stale saved-completion bug was directly reproduced: winning, replaying and toggling mute erased completed. Save updates now retain earned completion and best Shakes throughout settings changes and replays. Optional versioned checkpoint data stores authored checkpoint ID/index, elapsed time and physically collected/defeated IDs; it is validated before restore. The title offers Continue only when this record is safe. Start clears unfinished progress; victory clears unfinished progress without erasing completion. Restricted browser storage or switching devices prevents guaranteed restore. All five authored checkpoint writes were observed during BOTH real-HTTP scripted full-route tests using the normal game update path.

<!-- operational-state:entry
{"id":"VER-010","title":"Functional reduced-motion renderer preference","state":"partially-verified","scope":"Render decoration and automatic OS preference only","evidence":"Desktop and mobile browser pixel comparisons with distinct simulation times; decorative pixels static in reduced mode and animated in normal; existing moving platforms still use authoritative elapsed time","last_verified":"2026-10-11"}
-->
### VER-010 — Reduced Motion is functional
User setting disables or freezes nonessential drifting, confetti animation, hit flashing and event particles, while player input and collision timing remain unchanged. The OS reduced-motion preference initializes the option for a new profile; explicit player choice persists. Browser comparison tests verify real Canvas output under reduced and normal modes.

<!-- operational-state:entry
{"id":"VER-011","title":"Keyboard dialog accessibility and shortcut handling","state":"partially-verified","scope":"Title, pause, death and victory DOM overlays plus keyboard-operated touch buttons","evidence":"Browser tests for focus containment/return, repeat-safe P, Enter on Continue, Space on focused mute and mobile touch Jump key activation","last_verified":"2026-10-11"}
-->
### VER-011 — Keyboard operation corrected
Dialog overlays now provide explicit dialog semantics, focus management and Tab containment. Native Enter and Space on focused controls are preserved; holding the pause shortcut cannot toggle repeatedly. Keyboard focus on mobile touch controls can activate the intended game action. The browser tests are not a substitute for VoiceOver/TalkBack audits.

### Round 4 release boundaries
- The changes are a prep-branch candidate only until exact-SHA GitHub CI passes; do not mark main or Pages as updated.
- Original 26 Cinnamon source cut-outs, Fox placeholder, Golden Dome platforms, 220 image/21 audio LM Arena job contracts and all previously verified art-approval protections remain unchanged.
- Remaining: live user paced phone/desktop testing, real hardware audio and switch/screen reader QA, generated final art review and explicit in-game visual approval, public GitHub Pages release validation.
- Earlier revisions remain append-only; correction of stale Round 3 pending-CI wording is additive rather than rewritten.

### Revision log
- Revision 6: fixed lost birthday completion, added checkpoint Continue, proved genuine checkpoint writes during full routes, made Reduced Motion effective and hardened keyboard/dialog navigation.


### Round 4 local verification receipt — amendment

Baseline checks: 21/21 Node passed. Round 4 local candidate: **24/24 Node** passed. Real served-HTTP Brave Playwright, two-worker desktop run: **23 passed, 2 skipped**; separate two-worker Pixel-7 emulated mobile run: **23 passed, 2 skipped**. Total **46 executed browser checks passed, 4 intentionally skipped, 0 failed**. The existing assisted and normal scripted browser game routes both remain successful. Full physical hardware, genuine frame pacing, audible audio and outside-generated art remain outside the claimed evidence.


### Round 4 latest Node evidence correction (additive)
The earlier local receipt of 24/24 preceded one additional authored-checkpoint geometry test. The latest executed full Node suite is **25/25 passed**, including safe recovery at each of the five actual checkpoints. Browser evidence stays **46 passed, 4 deliberately skipped** on desktop and mobile emulation. This additive correction does not rewrite prior run evidence.

## 18. Preparation Round 5 — asset-independent production readiness (revision 7)

<!-- operational-state:entry
{"id":"VER-012","title":"Audio lifecycle and bounded scheduled voices","state":"partially-verified","scope":"Round 5 on prep/asset-ready-20261011","evidence":"Fake AudioContext unit tests plus actual served-Brave gesture, mute/pause/restart and context-state tests; no physical-speaker audition","last_verified":"2026-10-11"}
-->
### VER-012
The browser no longer instantiates AudioContext on page launch. Explicit game gesture creates it; pause/mute/restart stop scheduled oscillators, close/dispose cleans context, simultaneous sound effects are capped to 24 live voices, and absent WebAudio never prevents gameplay. Synthetic unit/browser tests passed. Audible speaker quality, music-loop seams, licensing and real mobile sound remain unverified.

<!-- operational-state:entry
{"id":"VER-013","title":"Cross-tab localStorage preservation","state":"partially-verified","scope":"Round 5 user settings and birthday progress","evidence":"Stale-title-tab settings save reproduced deleting newer victory record before fix; desktop/mobile browser tests pass with pre-write merge, updated title Continue and storage-denial stress","last_verified":"2026-10-11"}
-->
### VER-013
The stale tab's settings save used to erase another tab's earned birthday completion. Read-before-write reconciliation now retains monotonic completion/best values; storage events refresh a title-screen checkpoint Continue. Storage denial and rapid replay are non-crashing. Atomic simultaneous multi-tab writes remain an unresolved narrow race because localStorage has no compare-and-swap semantics.

<!-- operational-state:entry
{"id":"VER-014","title":"Batch asset intake without promotion","state":"partially-verified","scope":"scripts/batch-intake.mjs plus governing 220/21 contracts","evidence":"Isolated files test real PNG dimensions, SHA duplicates, canonical filenames/IDs, wrong WAV, symlink, ZIP ignoring, no-approval stage operation; 215 outstanding jobs","last_verified":"2026-10-11"}
-->
### VER-014
An actual batch intake dry-run reports 220 visual requests, 21 audio, 26 existing Cinnamon cutouts, zero external approvals and 215 awaiting review. Explicit --stage copies only unique valid files to ignored candidate staging, without writing approval or activation. No received art has been accepted; artistic fidelity remains a human gate.

<!-- operational-state:entry
{"id":"VER-015","title":"Measured responsive fixes and high-contrast preference","state":"partially-verified","scope":"CSS-only narrow/landscape and presentation controls","evidence":"Headed Brave measured 320px width overflow 345 to 320; landscape Start bottom 448 to 236, touch bottom 682 to 380; contrast and 44px target browser tests","last_verified":"2026-10-11"}
-->
### VER-015
Real browser layout probes found and corrected narrow horizontal overflow and landscape first-fold controls without changing 960x540 Canvas physics or state. High Contrast is now a visible persisted setting with actual HUD/menu/touch styling. Browser tests verify contrasts and dimensions. Real screen readers/physical devices are not yet tested.

<!-- operational-state:entry
{"id":"VER-016","title":"Static release rehearsal, runtime resilience and honest performance diagnosis","state":"partially-verified","scope":"read-only release preflight, gameplay boot fallback and headed browser performance script","evidence":"Deterministic 38-file static manifest, intentionally missing module negative control, direct ESM request failure/retry, network loss and resize checks, remote headed rAF p95 205-216ms while Canvas ~1ms","last_verified":"2026-10-11"}
-->
### VER-016
The static preflight fingerprints physically present runtime files and fails when an import is absent; GitHub browser CI is configured to upload this artifact. A classic-script startup guard shows Retry Loading after a failed module import, proven by real injected network failure/recovery. Fallback art remains playable when source manifests fail, and loaded sessions continue offline without cold-start support. Remote Mac rAF was substantially throttled (~205–216ms p95); Canvas draw cost was ~0.9–1.2ms p95. This is not 60fps proof or a reason to rewrite the renderer.

### Round 5 release boundaries
- Baseline clean branch a584f03d3c6240de803ad3cc352b441d3e25de2f; existing 25/25 Node tests.
- Preliminary local candidate validation after batch/audio/release implementation: 31/31 Node passed; 38 runtime files physically present.
- One-worker split desktop browser suites: 14+20 executed passed, 4 deliberate skips. Mobile suites: 14+21 executed passed, 3 deliberate skips. Separate High Contrast tests desktop+mobile passed, with focused accessibility regression rechecked. No remaining failures in those controlled runs.
- Original upstream source PNGs, game physics/engine and master generator specifications unchanged. External final art approved count still zero.
- Remaining: true physical iPhone/Android touch/speaker tests, human-paced full route, actual generated art identity/visual approval, representative target device FPS and exact deployed production SHA check.
- Changes remain on the preparation branch until an authorized, tested PR merge; no main merge or Pages release is claimed.

### Revision log
- Revision 7: audio lifecycle, two-tab save repair, bulk candidate intake, static release preflight, startup retry, measured phone layout, high contrast and honest browser performance boundaries.

### Round 5 tested candidate receipt

Final local candidate before Git delivery: npm run validate **31/31 PASS**, release-preflight 38 physical runtime files and no missing paths. Browser tests run in bounded one-worker groups: **desktop 35 executed passed, four expected skips; mobile-emulated 36 executed passed, three expected skips**. Remote headed rAF p95 stayed around 205-216ms despite roughly 1ms Canvas render cost; this is not normal target-device performance proof. The original 26 Cinnamon source frames, untouched asset generator contracts and zero-final-production-art state remain preserved. GitHub CI and delivery receipts to be appended only after actual commits and runs.

## 2026-10-11: Unified Arena asset integration and Art Jury (revision 8)

**Verified source:** Original source cutouts for Cinnamon remain hash-locked (26); the separate Arena branch contributed 194 physically present normalized images with recorded exact dimensions and SHA-256, no duplicate source SHA hashes. The generator contract has 220 visuals total and 21 recorded audio requests. Raw generator inputs are missing. The Arena contract's claimed approval statuses conflict with the actual 194 candidate records (`AWAITING_HUMAN_VISUAL_REVIEW`) and the empty authoritative accepted-runtime ledger. No new user approval is invented.

**Curation:** All 194 original images remain available, recorded as 28 context-selected previews, 131 alternate options, 11 visual revision requests, 24 structurally blocked missing required alpha. Individual rationale and source hash under `assets/production/curation.json`. Distinct cakes and Shamrock Shakes; the newer purple-scarf FOX series beats the older FX set. 

**Runtime:** SHA/dimension verified `?art=curated` opt-in overlay, checkbox in title and Pause. Original physics, platforms, authoritative state, old source sprites and default display preserved. Broken source art falls back gracefully. Browser Art Jury supports manual, source-hash-bound KEEP/REVISE/REJECT judgement, notes and JSON export; votes cannot automatically approve assets.

**Evidence:** In the local combined BigMac checkout, npm validate **34/34 PASS**, static preflight **238/238 physical runtime files**, classic and curated scripted full routes completed, and desktop/mobile-emulated gallery tests passed. The BigMac connector then went offline; GitHub exact-commit CI and hosted Pages proof are separate. Missing actual mobile device, user artistic acceptance, audio and raw source evidence are not falsely claimed.

**Architecture decision:** Preserve Canvas 2D and original running game, do not convert to a new engine. Two-parent git history is preserved, with only validator and ignore conflicts resolved explicitly. All final art remains candidate-only until individual user approvals.


## 2026-10-11 — All 194-image in-game Asset Director (revision 9)

**Explicit user mandate:** Wire in all assets. Authoritative available output: 194 physically generated PNGs (not 194 human-accepted game sprites), original 26 Cinnamon source-derived frames, 21 outstanding audio specifications with no recordings physically delivered. Preserve 220-image contract and authoritative accepted-runtime ledger.

**Implementation:** Added src/game/art-runtime.mjs with twelve role mappings covering all 194 unique source IDs, source SHA and pixel checks, bounded lazy decoded-image cache and corruption fallback. Added src/game/art-director.mjs, a semantic native dialog that exposes all 194 by role, quality verdict and search, renders the exact selected image in an in-game Canvas context, and gives a reversible TRY IN GAME control. Added src/game/art-scene.mjs and five real render phases to project a selected image into its corresponding role without mutating saved gameplay or collision. 170 structurally eligible assets can be applied; 24 alpha-failing sources are always reference-card only. Each Art Jury image has an exact-source link into the runtime audition. The classic and 28-choice curated editions remain intact.

**Governance:** source or alternate does not equal owner approval. No originals, game rules, generated output contracts, runtime approved-image entries or recorded-audio files are deleted/replaced/fabricated. Source artifacts remain physically SHA-bound.

**Verification at implementation checkpoint:** Added complete source-role unit tests and real-browser director/focus/route tests. Exact-commit CI and deployed site interaction still need to run. No tests falsely called passed before execution.

**Open:** physical device and sustained performance, owner visual signoff, 24 transparency corrections, 11 previously recommended artist revisions and 21 undelivered recorded audio outputs.

## 2026-10-11 — Asset Director post-integration visual safety (revision 10)

**QA finding:** The early Asset Director preview path drew a labeled blocked-source reference card over the lower-right gameplay viewport (where it could cover threats); it also drew the birthday scene test card during active gameplay rather than only at victory. These were not physics changes, but they undermined the promise that source artifacts never obscure player hazards.

**Bounded repair:** Removed all blocked-source and premature-finale cards from the live Canvas. Contract-invalid images remain visually inspected in the native Asset Director itself and retain their SHA provenance and user-review deep links. In-game valid birthday variants render only during victory. Optional boss visual effects redraw code-owned ATTACK INCOMING and STUNNED cues on top of any art, preserving mechanical legibility. A bfcache pagehide preserves the inspector UI so returning from the Art Jury need not leave a detached dialog. No image files or game state were changed.

**Regression tests:** Added a real browser pixel no-occlusion comparison and simulated persisted-pagehide inspection journey, plus Node source invariant checks. At this writing those additional checks are pending exact-GitHub-commit CI; original integration PR #3 already passed prior full checks and merged to main.

## 2026-10-12 — Drive soundtrack integration and local final QA (revision 11)

**Baseline:** remote `main@9135fc8dae875e9b1dbc0afd4d08b737fa667f6f`, containing the four merged artwork and visual-safety pull requests. Work is isolated on `feat/shakedown-final-qa-20261011`; this section does not claim merge or deployment.

**Recorded soundtrack:** Six user-authorized MP3 files from Google Drive `MacBook/Shakedown music` are copied into `assets/audio/music/` with public-safe provenance, measured duration/loudness/peak/SHA-256 data and a deterministic manifest. A run selects one of three campus tracks and one of two Dome tracks; the Fox track is dedicated. Recorded music is created only after player gesture, loaded one track at a time, loops, follows campus/Dome/boss state, pauses and mutes with the game, and fails over within a role before retaining the synthesized score fallback. The existing synthesized sound effects and victory fanfare remain.

**Scope boundary:** Those six files satisfy three background-music roles, not the entire 21-item audio contract. The other 18 named recordings remain undelivered. File/container/decoder checks do not prove artistic fit, speaker quality or a seamless loop boundary.

**Local evidence:** `npm run validate` passed 41/41. The complete installed-Chrome Playwright matrix collected 102 tests: 94 passed, eight intentional project-specific skips and zero failures across desktop and mobile emulation. A short real-wall-clock performance audit passed desktop, portrait, landscape and 320px narrow scenarios at approximately 59.9 FPS, 16.7–16.8 ms p95 rAF and 0.3–0.4 ms p95 Canvas rendering. Visual captures of gameplay, finale, Asset Director and Art Jury were inspected at desktop/mobile widths. Static preflight found 248 physical runtime files, no missing paths and six MP3s across three roles.

**Remaining gates:** exact commit, GitHub CI, merge, GitHub Pages publication and hosted smoke are pending. Physical phone controls/performance, physical speaker listening, human-paced completion, owner visual acceptance, 24 alpha repairs and 11 recommended art revisions remain unverified.


## 2026-10-12 — Raster-art screen integration and main merge (revision 12)

**Verified main baseline:** `528a27fc96d5962c4a0b7d90765b10c78306d970` through PR #6; the merged commit includes both title-source branch ancestries without any SVG file in the checked-out tree. Seven earlier feature/art branches have no commits ahead of main. No force-push or previous game source removal occurred.

**Physically present and activated:** 12 user-supplied Start/Game Over/Victory PNG images (each design includes clean/texted and 960×540/1920×1080 versions) recreated from source and matched byte-for-byte with the uploaded ZIP. Eleven playable title selections include the new default original screen and ten generated alternates (20 PNG files total); supplied clean loss/victory plates are visible in their actual gameplay overlays. All main actions remain live semantic buttons, not baked-image hotspots. Original 26 Cinnamon source-derived sprites, 194 inventoried candidate images, six soundtrack files, game physics, saves, input, and `?art=classic` remain preserved.

**Art activation truth:** 28 curator-selected structurally safe previews now display by default after SHA-256 checks; these are explicitly provisional, not owner-approved final visuals. All 194 generated candidates have real Art Director draw paths and user-controlled auditions; 24 blocked-alpha files remain reference-only, and other unselected alternates are not automatically layered into the game.

**Exact GitHub CI:** main contract job 38204739793 SUCCESS. Main desktop/mobile Playwright job 38204739823 SUCCESS: 99 passed, 8 skipped, one audio test classified flaky because it passed only on retry. Prior exact code commit Playwright run also returned 100 passes/8 skips. Neither recorded outcome establishes physical-device music playback or visual owner approval.

**Open verification:** Hosted Pages content was not independently retrieved for the new SHA; real mobile device UI/performance, physical speaker/loop listening, human-paced full route, 24 transparency corrections and owner art sign-off remain unverified. Keep these gates open; never infer success from committed art alone.

### Revision log
- Revision 11: imported and integrated the six user-selected Drive tracks, added soundtrack validation/failover/browser coverage, hardened blocked-art pixel regression sampling and completed local desktop/mobile visual and performance QA.

- Revision 12: PR #6 merged into main, all supplied raster artwork reproduced from ZIP and wired, 7/7 original branches contained in main, no SVG outputs, final CI evidence recorded with one audio retry flake.
