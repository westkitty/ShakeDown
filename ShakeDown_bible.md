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
