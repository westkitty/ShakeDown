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
