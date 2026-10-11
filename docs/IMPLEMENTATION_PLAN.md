# ShakeDown — Implementation contract

## Story and player objective
A deliberately absurd birthday quest. Cinnamon Fuzzbutt, Maverick's red-panda alter ego, pursues a stolen Shamrock Shake through South Bend. The Fox is the mischievous rival and final boss. Finishing the game unlocks a personal birthday greeting; no cakes, Bethel University or generic cats.

## Vertical slice
Start with playable placeholder movement and a single complete start-to-exit journey, not with 134 unverified art filenames.

## Four varied levels
1. **Golden Dome Dash** — Notre Dame campus: readable horizontal traversal, basic jumps, campus obstacles, collectible shake tokens, safe first checkpoint.
2. **Riverwalk Rush** — St. Joseph River: vertical routing, springs, moving platforms, short water hazards and alternate paths; no unearned instant deaths.
3. **Eddy Street After Hours** — storefront and rooftop route: precise short hops, switch/timing puzzles, illuminated signs, branching secrets, chase tension.
4. **The Fox Den** — Fox's secret shake facility: mechanic remix; a readable three-phase boss with telegraphs, punish windows, accessibility-safe effects; final Shake recovery.

## Gameplay contracts
- Left/right, jump/variable hold, buffered jump (0.13 s), coyote time (0.11 s), double jump.
- Short dash and close tail-swish move with cooldowns and deterministic hit validation.
- Collision: player AABB against tile/rect platforms; separate hurtboxes/hitboxes; no fake physics engine.
- Moving platforms, springboards, timed gates, switches, pickups, checkpoints, enemy patrols, knockback, invulnerability.
- World-anchored camera with bounded look-ahead; no nausea-inducing shake by default.
- Shake tokens are optional score collectibles; each level has a reachable exit without 100% collection.
- Accessible assist/practice mode, reduced motion, high contrast hazard cues, music/sound toggles, captions for important cues.
- Keyboard and pointer/touch mapping into ONE edge/held action stream; multi-touch jump+direction.
- Menus: title, play, level select after unlocking, pause, settings, death, retry, level clear, victory, credits.
- Persistence: versioned localStorage schema for unlocked stages, settings, best times, tokens and completed birthday greeting. Safe reset.
- Audio must begin only after user activation; never block play if muted/unavailable.
- Responsive 960x540 logical canvas as initial design target; scale via CSS and capped DPR; preserve aspect and touch target bounds.
- Freeze simulation during pause, hidden tab, and focus loss; reset update accumulator on resume.
- Asset fallback: display explicit placeholder / visible error for unavailable art, never silently substitute wrong characters.

## Module responsibilities
`src/game/loop.ts` simulation clock;
`src/game/state.ts` authoritative game state;
`src/game/input.ts` keyboard/touch/gamepad action transitions;
`src/game/physics.ts` movement and collision;
`src/game/levels.ts` declarative encounters;
`src/game/boss.ts` Fox state machine;
`src/game/assets.ts` manifest-driven loader;
`src/game/render.ts` Canvas presentation;
`src/game/audio.ts` WebAudio;
`src/game/save.ts` persistence;
`src/ui/` menus and accessibility;
`tests/` pure-system tests and browser journeys.

These module paths are **planned**, not claims that the files currently exist.

## Build sequence and phase gates
0. Repository contracts, documentation, asset intake and CI skeleton.
1. Greybox horizontal slice: launch, move, jump, touch, checkpoint, death, restart, level end; browser proof.
2. Character controller and camera polish; edge-case regression suite.
3. Declarative level system and all four greybox layouts with distinct mechanics.
4. Enemy/interaction systems, Fox phase machine, scripted birthday victory.
5. Asset intake: physically create, inspect, process, register and integration-test art; do not block gameplay code on unseen artwork.
6. Audio, UI/UX, feedback, accessibility, persistence.
7. Full campaign difficulty tuning with measured player paths and recovery affordances.
8. Visual polish and constrained mobile performance validation.
9. Browser QA: keyboard/touch/rotation/pause/refresh/save/boss/victory; clean diff; commit; deployment gate.
10. GitHub Pages publish after all required gates; direct link and device smoke proof.

## Acceptance matrix
- Player movement: gamepad/keyboard/touch input traces and frame-stable collision tests.
- Level variety: at least 1 exclusive mechanic and distinct visual grammar per level.
- Boss: visible tells for each phase, defeat/retry/reset without soft lock.
- Birthday: unique Maverick message shown on normal playthrough, and on replay.
- Integrity: no console errors, missing sprites, inaccessible exits, checkpoint respawn deaths, input double triggers.
- Performance: target stable play on midrange Android; record actual p95 frame time rather than claiming 60 fps without measurement.
- Publishing: GitHub Pages URL must be opened and played end-to-end before declaring complete.

## Non-goals for initial release
Multiplayer, accounts, monetization, 3D, advanced particle renderer, sprawling procedural generation, service backend, and 134-asset wait-before-play architecture.
