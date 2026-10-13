# ShakeDown Gameplay Visual Finish — 2026-10-13

## Scope

Existing 960×540 Canvas 2D birthday platformer, starting at commit `6c0f95e`. Visual changes are isolated on `feature/aaa-visual-20261013`, based on the inherited landscape gesture-pad branch. Preserve Cinnamon, Fox, Smudge, Dexter, the authored level, camera and collider geometry, 23-stage Dome climb, checkpoint and save state, Cheer, ending, intro, and audio. No new dependencies or unapproved image assets.

## Gameplay improvements

- Existing game renderer: cached half-resolution atmospheric colour layers, autumn leaves, cull-bounded airborne dust, warm/cool architectural depth, foreground finish and ground-contact shadow.
- Camera-visible fallbacks: detailed grass/stone/wood/gold platforms and a finished vendor stand; source-verified images continue to override suitable procedural fallbacks.
- Effects: a bounded dash afterimage, more coherent pickup and combat sparks, refined Fox warning ring, compact segmented boss health, compact legible navy-and-gold chant plaque. Encounter-specific caption suppression remains.
- UI: navy/brass/ivory colour tokens, pressed/focus states, legible HUD and responsive overlays, tiny silver shamrock within a transparent **square** directional gesture region. It is not a giant clover.
- Input ownership: swiping no longer discards held keyboard direction. Down swipe is the existing dash, **not** invented slide physics.
- Reversible `?art=classic` mode and existing SHA-verified provisional art policy remain unchanged; no human art approval invented.

## Observed verification

`npm run validate` passes 73/73. `npm run release:preflight` found 279 static referenced files, none missing, but correctly warned the tree was dirty. Three real-browser input-driven deterministic playthroughs (normal, assisted, curated assisted) reached 23 stages, Fox defeat, birthday and replay. The dedicated visual audit captured real Quad, ascent, summit and mobile landscape Canvas gameplay with no page exceptions.

Local short real-time Chromium samples measured approximately 1.4 ms p95 Canvas draw time on desktop and emulated landscape, **not** a representative physical-device FPS. rAF scheduling on this host was inconsistent. Do not claim 60 FPS or iPhone/Android validation from desktop emulation.

The first broad browser run had 154 passes, 14 intentional skips and 2 obsolete layout-test assertions. The inherited full-bleed gesture branch intentionally uses a full-viewport frame with aspect-contained 16:9 game artwork and hides older direction/Jump buttons. Both corrected layout tests passed locally, 7 passes/3 intentional skips. High-contrast touch colour tweening was removed; high-contrast desktop/mobile tests passed.

Final full-suite result belongs in the project Bible after completion.

## Pending

Physical iPhone Safari touchscreen/rotation and Android profiling, long-run memory/frame pacing, owner approval of provisional source art, and any hosted Pages parity validation. This branch is not a deployed release; no push, merge or Pages update is claimed.
