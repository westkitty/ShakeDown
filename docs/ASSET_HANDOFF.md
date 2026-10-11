# LM Arena asset handoff contract

## Roles
Asset agent: produce named independent image/audio output files, preserve style/character fidelity, include generation provenance.
Game agent: own game logic, dimensions verification, trimming, packing, manifests, and integration. Never pretend generated art exists.

## Required references
Five user-supplied Cinnamon Fuzzbutt/Maverick character sheets govern identity. Red panda (NOT cat), round black glasses, blue headband, grey tee, olive shorts, fluffy striped tail. Fox antagonist model sheet pending; obtain user-approved source before final Fox art.

## Draft technical contracts (not verified outputs)
- Canvas logical size: 960x540 (proposed to align Cloud Chaser precedent).
- Character sprite source art: one pose/frame per PNG with true alpha, centered safe region and consistent foot anchor; source art at 256x256 recommended for high-resolution painting, then process to 64x64 runtime frames only if visual QA passes. Never assume AI-created sprite grids align mechanically.
- Characters: idle, run, takeoff, ascend, fall, land, double jump, dash, tail-swish, hurt, defeat, victory; matched left/right via safe flipping after checking asymmetry and markings.
- Fox: idle, walk, taunt, windup, attack, hit, retreat, defeat; approve actual Fox appearance before batching.
- Background paintings: 960x540 visual composition with fore/mid/far layers where practical, landmark-correct Notre Dame/South Bend inspiration without claiming photographic mapping.
- Props/collectibles/VFX/UI created as independent transparent assets or controlled sprites.
- Audio requests require license/provenance, loudness inspection, loop-point validation, and explicit mute/availability fallback.

## Full asset work packages
A. CIN: Cinnamon master sprite, 11 action groups, expression/portrait, tail silhouettes, glasses/headband fidelity QA.
B. FOX: Fox master concept/turnaround, boss poses, enemy reactions, tell markers; pending user reference.
C. W1: Notre Dame campus landmarks, platforms, props, signs, collectibles and parallax backgrounds.
D. W2: South Bend riverwalk, water, bridges, ramps, springs, moving platform skin, parallax.
E. W3: Eddy Street storefronts and rooftops, neon/readable nighttime palettes, switches/gates.
F. W4: Fox lair/shake machine, 3-phase boss tell graphics, objective shrine and victory effects.
G. UI: title and level cards, touch controls, HUD, score markers, dialogues, settings and accessibility symbols.
H. SFX/MUSIC: 4 loops, title/victory stings, jump/land/swish/dash/collect/hit/boss/clear sounds.

See the separate LM Arena Asset Production Bible and 134-item JSON request register from the production package. Their job IDs are design requests until physically delivered.

## Intake gate for each asset
1. Record approved canonical reference and generation prompt.
2. Receive real files, not just description/screenshot.
3. Inspect art visually (readability at target screen size, silhouettes, composition, species and costume).
4. Verify dimensions, real transparent alpha, cropping, format, animated frame identity, sequence numbering.
5. Normalize origin/pivot and source/derived naming in a script.
6. Generate manifest from actual files, not from the request register.
7. Recheck hash, missing paths, bounds, and browser load.
8. Promote to approved only after a representative in-game screenshot and source-to-runtime trace.
9. Reject/revise mismatched variants; never replace an approved reference with a prettier generic one.

## Suggested pre-handoff production order
1. CIN master model with 3/4, side and readable silhouette; sign off.
2. FOX canonical antagonist design; user sign-off required.
3. CIN 11 animation poses as separate images, cleaned and sprite-packed deterministically.
4. FOX boss attacks/tells and 3-phase readable animations.
5. Four background key art compositions and palette boards.
6. Tiles/props per world; normalize all to exact physics layout contacts.
7. UI kit and pickup/VFX passes.
8. Audio only after gameplay cadence exists.

## Critical prohibitions
No collage requested as multiple independent source images. No pretend character sheets from single frames. No unverified atlas coordinates or fabricated SHA hashes. No transcription of ASL as arbitrary hand gestures; verify sign accuracy if depicting specific words.
