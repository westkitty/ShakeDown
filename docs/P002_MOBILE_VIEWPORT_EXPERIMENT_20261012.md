# P002 — Portrait readability experiment, acceptance evidence

## Change

The original Canvas world remains 960×540 logical pixels, same DPR cap, fixed-step movement, camera ownership, save schema, and collider geometry. On portrait viewports up to 630 CSS px, the Canvas is displayed at an aspect-preserved taller size (clamp 248px–380px, target 44dvh) and its **CSS transform only** is horizontally panned to follow the player's already-calculated screen position. Viewport clips the excess artwork. Landscape and desktop preserve the full 16:9 display.

This trades side visibility for larger characters and hazards. It is an EXPERIMENT, not permission to redesign world coordinates or claim final mobile acceptance.

## Matched Big Mac / Chromium evidence at 390×844

| Measure | Baseline at P001 | P002 experiment |
|---|---:|---:|
| Visible playfield size (CSS px) | 372×209.25 | 372×371.36 |
| Underlying Canvas scene ratio | 16:9 | 16:9 |
| Drawn Canvas CSS width | 372px | 660.19px (cropped) |
| Browser rAF p95 | 100ms | 100.1ms |
| Same-context empty-page rAF p95 | 100ms | 100ms |
| Canvas render p95 | 1.3ms | 1.5ms |
| Uncaught page errors | 0 | 0 |

The visible playfield is ~77.5% taller, with more than 2× apparent area occupied by the stage. Remote Big Mac's 100ms empty-page limit prevents valid target-device FPS conclusions; 0.2ms render variation is not a causal performance measurement.

## Gameplay and art protection

- Desktop and mobile route/scene tests preserve player motion, two optional NPC encounters, scripted Fox victories, checkpoints and asset validation.
- Portrait test checks that the 16:9 Canvas is not distorted, horizontal pan stays within stage bounds, Cinnamon remains visible during movement, and there is no page-width overflow.
- Narrow 320×568 controls and landscape 844×390 layout tests remain passing.
- Real portrait phone/tablet touch ergonomics, boss warning visibility under natural human control, and Safari remain to be approved through hands-on testing before shipping.
- Local feature checkout was temporarily served to a physically connected Android 16 Galaxy Tab S9 Ultra through a private localhost-only SSH/ADB tunnel, and the title was visibly received in landscape. It was not a portrait performance/playthrough test. Tunnel, ADB port forwarding and HTTP server were removed after inspection.

## Rejection criterion

Rollback the CSS crop and pan if a real player cannot read distant attacks in the Fox arena, if the main route becomes noticeably harder, if mobile sustained frame time worsens on target hardware, or if screen-reader/touch focus is impaired. The original 16:9 presentation remains available on landscape and desktop as a nonbreaking fallback.
