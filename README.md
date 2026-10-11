# ShakeDown: Cinnamon Fuzzbutt and the Shamrock Shake Caper

A short, mobile-first 2D birthday platformer set in South Bend, Indiana. Cinnamon Fuzzbutt (a red panda) pursues the stolen Shamrock Shake across Notre Dame, the riverfront, Eddy Street, and the Fox's lair.

## Current status
**Phase 0 scaffolding only.** This repository is not yet a finished playable game. All final character/environment art is pending an independently verified asset handoff. Do not represent placeholders as approved art.

## Authoritative references
- Cinnamon and Maverick sheets: user-supplied character reference images (retained in production bible).
- Technical precedent: [Cloud Chaser](https://github.com/westkitty/c_chase), not a codebase to modify.
- Modern 2D Browser Game Architecture Toolkit v2.0, Gaming Guides project.
- ShakeDown Master Development Blueprint and LM Arena Asset Production Bible (production documents, not yet copied into this repository).

## Production boundaries
- Do not overwrite or modify Cloud Chaser.
- Canvas 2D, fixed 60 Hz physics, interpolation as needed, DOM menus and accessibility.
- Character: burnt-orange and cream red panda; circular black glasses, blue headband, grey T-shirt, olive cargo shorts, dark paws, thick ringed tail.
- No Bethel campus, no birthday-cake rescue. Notre Dame / South Bend setting; Shamrock Shake prize; Fox antagonist.
- No invented assets: all generated files need inspection, dimensions, alpha checks, and manifest registration before being used.

## Local workflow
This repository will acquire a runnable app in implementation Phase 1. At Phase 0, validate planning files with `node scripts/validate-content.mjs`.

## Delivery acceptance
Keyboard and touch end-to-end journey; four different levels; Fox boss; actual victory and birthday message; pause/retry/checkpoints; no console or asset errors; deployment to GitHub Pages only once the game has been tested.

## Project documents
- [Scope and systems](docs/IMPLEMENTATION_PLAN.md)
- [Asset handoff](docs/ASSET_HANDOFF.md)
- [Build status](docs/PROJECT_STATUS.md)
