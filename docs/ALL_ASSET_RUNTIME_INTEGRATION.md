# ShakeDown — all 194 physical artwork files wired into the game

## What "all" means technically

The original game remains a Canvas 2D action platformer with an independent, authoritative level and physics engine. The previously curated preview draws 28 static, source-verified images. This change adds an **in-game Asset Director** that can route **every one of the 194 real generated PNGs** to a representative Canvas role, load and examine it from actual manifest-backed bytes, and try its image in a reversible live gameplay render layer.

All 194 IDs are registered and selectable in the running game; all can be previewed in their semantic/gameplay context. **170 structurally eligible art files can be applied to live visuals.** **The other 24 are contract-blocked for missing required transparency:** those can still be loaded, checked, and displayed **only in a labeled, non-colliding QA reference frame**, so they cannot silently obscure gameplay hazards or overwrite production art.

"Wire" does not mean all 194 decoded full-size bitmaps are simultaneously displayed on a 390 px phone. That would be a bad asset architecture. The Asset Director loads **only the selected image on demand**, source-SHA-checks before decode, caches a bounded pixel budget, retains pinned audition choices, and releases unpinned decoded images. Multiple game-layer auditions (one per role) may be active together, and the currently selected candidate for each role can be swapped or cleared without changing saved game state.

None of this acts as a hidden artistic approval. The source production candidate records continue to read AWAITING_HUMAN_VISUAL_REVIEW. The accepted-runtime manifest assets/runtime/manifest.json is not overwritten. The default game remains playable with its original art. The optional Curator's Cut retains its separate 28 approved-direction *preview* selections.

## Complete role coverage and presentation hooks

| Live Canvas role | Physical IDs | Count | Game context |
|---|---|---:|---|
| Birthday finale | BD-01..14 | 14 | Cake, separate shakes, confetti and UI props at the result scene |
| Campus and Dome backgrounds | BG-01..06, DM-BG01..08 | 14 | Parallax/backdrop behind real platforms and actors |
| Fox boss effects | BS-VF01..12 | 12 | Boss telegraph, warning, stagger and other visual effects |
| Cinnamon supplementary poses | CIN-N01..07 | 7 | Rendered at Cinnamon's player-world pose, with original 26 canonical frames retained |
| Milkshake and pickup variations | CO-01..04, PK-01..06 | 10 | Actual visible Shamrock Shake location, not a new collectible/collider |
| Tile surfaces | TL-01..10, DM-TL01..16 | 26 | Actual existing platform footprints with their original collision outlines kept |
| Bridges, lifts, drums, checkpoints | MC-01..09, DM-MC01..10 | 19 | Existing visible mechanism and relay surroundings, never new platform physics |
| Fox portraits and action variants | FOX-01..16, FX-01..04 | 20 | Existing Fox battle space, with the red telegraph and STUNNED words retained |
| Non-colliding campus and Dome scenery | PR-01..14, DM-PR01..10 | 24 | Decorative world-world placement with explicit NO COLLIDER cues |
| Cup and cannon enemy variants | EN-01..07 | 7 | Existing active enemy or cannon encounter location |
| Player and world effects | EX-VF01..08, VF-01..10 | 18 | Visual-only jump/event sampling; Reduced Motion suppresses this live layer |
| HUD and interface experiments | UI-01..09, UX-01..14 | 23 | A game-safe Canvas HUD test region, never a silent replacement of semantic DOM buttons |
| **Total** | | **194** | All available inside the game |

The role mapping is code-defined from the physically verified source ID prefixes: src/game/art-runtime.mjs. It rejects missing/extra IDs, alias paths, duplicate source SHA, wrong dimensions, malformed source status and any mismatch between the curated catalog and the concrete source manifest.

Actual draw hooks live in src/game/art-scene.mjs and src/game/render.mjs for five phases: **backdrop**, **world**, **actors**, **birthday** and **HUD**. The editor opens over the existing game on title, Pause, or directly from a running game (which pauses safely). The Art Jury links an individual candidate to the exact Asset Director selection via ?art=all&inspect=ID. No extra engine or renderer was introduced.

### Direct user workflow

1. Play the **Classic** game or the existing **Curator's Cut**. Both remain intact.
2. Press **ART DIRECTOR · ALL 194 ASSETS** on the title, Pause, or game status bar.
3. Search by image name/ID, filter by the twelve roles or original verdict, and browse source-verified originals with Next/Previous.
4. Inspect the actual PNG in a representative Canvas 2D game context, including warnings and the exact source SHA.
5. Press **TRY IN THE ACTUAL GAME** to apply that candidate to its specific role. The game carries on with unchanged colliders, boss timing, input, audio and checkpoint state. Other roles remain unchanged.
6. Use **REMOVE THIS LAYER** to return that game role to the original/curated fallback. The audition is intentionally **not** a permanent gameplay save.
7. For your artistic judgment, use the separate Art Jury's KEEP/REVISE/REJECT controls and export the SHA-identified JSON review. No implicit production approval is granted.

Blocked sources may be auditioned **as labeled QA reference cards**, never as false physical scenery. This is a real runtime drawing path rather than silently pretending invalid outputs are good. Revisions can replace the source through the separately documented physical intake/QA process, retaining the original source and its hash provenance.

## Performance, lifecycle and failure containment

- Image source verification: SHA-256 against the exact Arena physical asset manifest, then pixel dimension validation.
- Load policy: one selected source when requested, no 194-image eager decode, with de-duplication of in-flight requests.
- Cache: up to six million unpinned decoded source pixels (configurable). Pinned user-active per-role choices remain retained until cleared.
- Browser context: safe fallback when image, manifest, Web Crypto or decode fails; a bad candidate cannot erase the saved game or rewrite the original source sprite manifest.
- Modal: native HTML dialog with Escape dismissal, keyboard focus and coarse-pointer controls. The game pauses when opened from gameplay, preserving existing input/focus behavior.
- Reduced Motion: hides live extra particle/effect auditions, while role selection and source comparison still work.
- Source scope: generated PNGs only. The **21 recorded audio requests remain undelivered**, so these cannot truthfully be installed or auditioned as recorded music/SFX.
- All 194 image candidates and the earlier 26 source-derived Cinnamon frames remain present. No source re-generation, deletion, force-push, or art-style rewrite is required.

## Verification contract

- Unit: 194 IDs and unique real source paths/SHA; exactly twelve roles; each role has an actual Canvas render hook; malicious IDs, SHA drift or path traversal are rejected; source fetching/PNG decode are demand-driven and hash-checked.
- Browser: classic startup does not fetch the 194 assets; opening Asset Director displays all 194; all twelve roles can be applied and cleared without changing gameplay state; 24 invalid alpha sources remain safely reference-only; Escape, pause and input survive; Art Jury exact-image deep-link opens the game audition.
- Existing game regression: Node validation, original normal/assist/curated 23-stage player-input routes, mobile-emulated responsive controls, local data storage, and release preflight physical hash inventory.
- Independent proof boundary: GitHub exact-SHA CI and Pages deployment are separate tests; source inspection is not a browser pass, and browser emulation is not physical iPhone/Android performance proof.
