# ShakeDown Project Bible — Additive Development Ledger

Operational State, the current user corrections, implementation plan and complete asset JSON remain governing. This is an append-only engineering log, not a replacement contract.

## 2026-10-11 — Round 2 continuous gameplay proof and art review bench

### Baseline, scope and design
- Target: westkitty/ShakeDown, prep/asset-ready-20261011; start SHA 553be7d56cf7a61466fb146b378a6eac8830caf5, worktree clean.
- Preserve existing Canvas 2D, physics, player and Fox, complete Notre Dame birthday story, 26 real Cinnamon sources, and 220 image/21 audio generation requests.
- Three bounded groups: continuous route proof, isolated browser-local review workbench, validation/docs evidence. No dependency or renderer replacement.

### Implemented and validated
- Pure RoutePilot reads state and directs game input in Node; browser tests send normal DOM keys and click existing UI, while virtualizing only rAF timing for deterministic speed.
- Standalone HTML/CSS/JS review UI retrieves canonical IDs and existing approvals, checks local candidate pixels/alpha/hash and basic audio containers without uploads or approvals.
- Node and Playwright regression assertions distinguish a scripted assisted full path from human play and physical-device verification. See docs/VALIDATION.md.

### Risks and next gates
- Normal-difficulty route and human-player responsiveness; physical iPhone/Android touch and actual speaker audio; LM Arena-generated Fox identity approval and visual QA; hosted SHA and actual frame pacing remain unverified.
- Never mark generated images complete from specs, copy a binary without review, or rewrite game architecture to accommodate this test.

### Git evidence
- Implementation commit: pending.
- Documentation follow-up hash: append implementation hash after the implementation commit if authorized.

## 2026-10-11 — implementation delivery hash
- Round 2 code implementation commit: `602a87ebb98d72b4a2a01110a38a061efb099f68`.
- Local `npm run validate`: 20/20 Node tests PASS.
- Local Playwright on BigMac / Brave with two workers: 21 browser tests PASS, 1 intended mobile-duplicate route SKIP; real HTTP site and synthetic deterministic route clearly differentiated.
- No source art, compiled generation prompts or runtime-approved images changed.


## 2026-10-11 — Round 3: asset gate, normal route, input ownership

### Exact baseline and scope
- Target: westkitty/ShakeDown, prep/asset-ready-20261011 at 7cecff2f321b474fa029a3163b956f02698f9757, cloned to a clean separate BigMac worktree.
- Three bounded change groups: keep artistic source approval separate from visual activation; prove normal-difficulty completion by the real physics/DOM input path; correct overlapping physical keyboard/touch ownership.
- Preserve the 2D Canvas engine, actual 26 Cinnamon source frames, fixed-step mechanics, Notre Dame setting, Fox encounter, Shamrock Shake birthday ending, master 220-visual/21-audio output requirements. No new npm dependency, asset content invention, engine replacement, or main-branch merge.

### Reproduced defects
- **P0 art activation leak:** renderer selected reviewer-attested records still marked unverified for integration. Corrected with explicit verified-only runtime gate and localhost-only preview.
- **P1 preview UX race:** independent Cinnamon image-loader completion overwrote the persistent local preview warning. Corrected via combined source/art status readout.
- **P1 multi-input ownership:** releasing right-arrow cleared the logical right action even when D or touch still held. Corrected with individual key-code and pointer ownership tracking.
- **P2 review UX mismatch:** studio previously conflated reviewed and activated items; clarified actual counts, ID labels, preview links and activation template. Hash-fragment changes now update the currently inspected asset.
- **Normal mode input regression:** the original scripted driver was unable to recover after a genuine checkpoint reset or safety-ledge route; recorded in the test driver and repaired without changing game collision, enemy damage, or level data.

### Implemented systems
- Reviewer source approval remains dormant until a separate activation command checks renderer mapping, exact approved source SHA, reviewer attestation and actual screenshot under docs/assets/qa. Screenshot integrity is validated, but its depicted contents are a required human review.
- Local-only preview-art logical ID can be inspected in the real Canvas game without activating the image on a public URL. Procedural fallback is retained if missing.
- Isolated test fixtures validate approve -> dormant -> activate, tampered screenshot rejection and required evidence; no fixture art or mock reviewer becomes a production record.
- Continuous normal-difficulty tests in Node and Playwright use existing movement, hazards, checkpoint recovery, Fox hit windows and replay. Assistant/normal routes remain separate and accurately labeled.

### Executed verification
- BigMac npm run validate: 21/21 passed, including both scripted routes and evidence tamper checks.
- BigMac Playwright against actual localhost HTTP using installed Brave: 29 passed, three intentionally skipped (mobile-duplicate full route and desktop-only touch source).
- Normal difficulty, Node: 2,782 fixed ticks, 21 steps physically contacted, 31 pickups, checkpoint retry and pit reset, natural Fox victory.
- Normal difficulty, desktop browser with virtual rAF: 2,786 callbacks, 21 steps, 32 pickups, natural Fox victory and replay.
- BigMac ADB unavailable; MacBook ADB found zero connected/discoverable devices. No physical-device audio/touch or user-played normal-speed completion has been established.

### Remaining acceptance gates
- Reviewer-approved real LM Arena outputs and Fox identity, source licensing, in-game visual acceptance, independent physical phone audio/touch, actual-frame pacing and human-paced full route.
- Exact commit SHA CI and optional eventual GitHub Pages merge/deployment proof.
- Do not mislabel these automated virtual-frame completions as a real player performing the game or the current public Pages version.

### Round 3 implementation commit receipt
- Round 3 implementation and verification commit: 6c432d60a633143fe920c8ec61b8d9001d28b6ca.
- Local BigMac baseline: npm run validate PASS 21/21; served-HTTP Brave Playwright PASS 29/29 executed, 3 intentional skips. The synthetic virtual-frame route, real mobile emulation and zero art approval boundaries remain intact.
- This commit is on the existing preparation branch, not merged to main.


## 2026-10-11 — Round 4: checkpoint-safe birthday completion, Reduced Motion and dialog controls

### Authority and baseline
- Repository: westkitty/ShakeDown, branch prep/asset-ready-20261011, starting at exact clean SHA b50d16c4d46c9ba90a49b3e2c0deb613c1993231.
- Preserved: Canvas 2D state/render split, complete South Quad/Golden Dome 23-stage layout, existing Fox encounter, Shamrock Shake birthday finale, original 26 Cinnamon sprite sources, all 220 visual and 21 audio LM Arena generator requests, approved-art intake and activation gate.
- Scope frozen to three cohesive groups: (1) save correctness/checkpoint Continue, (2) functional Reduced Motion, (3) keyboard/focus accessibility. No engine rewrite, dependency change, external generated art, or main-branch merge.

### Reproduced defect and repair
- Baseline browser test reproduced an earned birthday completed record flipping back to false after replay and mute change. Main saved a stale snapshot in memory and never updated it after a successful write. Fixed by maintaining current in-memory record and monotonic earned completion/best Shake fields, with no legacy schema break.
- Reload previously discarded in-progress checkpoint progress entirely. Added optional versioned checkpoint records with authored IDs/validation, no arbitrary engine or browser DOM serialization. Continue restores collected shakes, secrets, defeated enemies, proper camera and legitimate checkpoint reset. A fresh Start clears unfinished checkpoint; victory clears it while retaining earned completion. Restricted storage still allows play without a durable guarantee.
- Reduced Motion setting existed but did not alter the Canvas renderer. Decorative visual animation now uses a separate presentation time and disables nonessential particles/flashes while physical moving platforms, collision timing, Fox cues and player inputs stay authoritative.
- Title Enter interception was confirmed to start fresh even when Continue was focused; fixed. Pause-key repeated keydown and globally stolen Space on focused buttons were corrected; dialogs now have focus containment and restore keyboard control to the canvas. Keyboard-operated mobile touch action buttons are supported.

### Executed evidence and caveats
- Original preparation baseline npm run validate passed 21/21.
- New Node tests cover valid/invalid checkpoint records and re-derived collectible/secret counts.
- Playwright desktop/mobile emulation tested completion persistence, Continue/reset, malformed saves, Reduced Motion pixel equality vs animated scene, OS preference override, Tab containment, Enter Continue, P-repeat, native Space on mute and keyboard touch Jump.
- Both complete browser deterministic scripted assisted and normal routes observed all five authored checkpoint writes in localStorage, natural Fox victory and no pending checkpoint after completion. Scripted rAF routes are not human-paced play.
- Final full-suite validation and exact remote GitHub PR CI outcomes must be recorded after execution.
- No physical device or speaker tests, final LM Arena assets, human-paced completion or production Pages branch deployment were proven.


### Round 4 local verification and handoff

- Baseline before edits: npm run validate 21/21 passed, clean working tree at b50d16c4d46c9ba90a49b3e2c0deb613c1993231.
- New completed local checks: npm run validate 24/24 passed; 23/23 executed desktop-browser checks passed with 2 skips; 23/23 executed mobile-emulated browser checks passed with 2 skips. Total 46 browser passed, 4 deliberate skips.
- Source art hashes checked by canonical content validator; no external generated visuals/audio, production dependencies, game level rewrites, renderer migration, or main-branch updates.
- Safe delivery scope: source/renderer/progress, 3 new browser test modules, Node checkpoint tests, existing route-checkpoint integration tests, source HTML/CSS, approved docs and append-only operational state. Temporary local patch scripts are not delivery artifacts.
- Implementation commit SHA and exact GitHub CI will be appended only after verified delivery; main remains unchanged until separate release decision.


### Round 4 final checkpoint-safety verification extension
Following the initial full sweep, the authored geometry safety check was extended to every checkpoint. The final Node suite is **25 passed, zero failures** after this additional test. All five checkpoint spawn points were exercised through actual game physics without QA warps or geometry edits. Existing local Playwright desktop and mobile-emulated results remain 23 passed each, two intentionally skipped per project. Remote same-SHA CI and production release evidence remain distinct gates.
