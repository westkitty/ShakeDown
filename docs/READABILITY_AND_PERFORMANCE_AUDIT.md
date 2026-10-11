# ShakeDown - Real-time performance and small-screen readability audit

**Environment:** October 11, 2026, authorized BigMac node, installed Brave Browser through Playwright, locally served static site. Desktop, emulated phone portrait, narrow portrait and landscape browser viewports. Browser window launched in headed mode. **No actual physical phone was connected.**

## Method and evidence boundaries

- The repeatable script scripts/perf-audit.mjs uses the actual browser clock and requestAnimationFrame callbacks. It does not virtualize simulation time or teleport the player.
- It records observed rAF median/p95/max intervals, DOM geometry, initial Start position, touch target sizes, uncaught JavaScript exceptions, approximate input-to-movement automation latency, optional heap bytes and Canvas render p95.
- A real 60 Hz simulation interval is not an observed 60 FPS. Remote display/window scheduling, runner contention, device hardware and OS power policy can dramatically alter rAF cadence. The observed throttling has not been conclusively attributed to the game.
- The metrics do not prove iPhone Safari, Fire tablet or other real touchscreen performance; separate hardware checks remain essential.

## Reproduced layout failures and measured corrections

| Scenario | Before | After CSS correction |
|---|---|---|
| 320x568 narrow portrait | Browser layout widened to 345 CSS pixels for a 320 px viewport | Browser width and scroll width both 320 px |
| 844x390 landscape title | Start button bottom at 448 px, below first visible 390 px viewport | Start button bottom at 236 px |
| 844x390 landscape controls | Touch controls bottom at 682 px | Touch controls bottom at 380 px (within 390 px viewport) |
| Mobile action targets | Many were already around 60 px tall; mast buttons smaller than 44 px | Visible touch controls are at least 44 px in width/height; coarse-pointer mast/status buttons also receive a 44 px minimum height |

Regression tests also verify mobile dialog scrolling/interaction, narrow width without horizontal overflow and at least 4.5:1 contrast for three critical solid-background control text pairs. This is **not** a full perceptual contrast, screen-reader or actual-device inspection.

## Observed performance diagnostics

Four headed-browser scenarios each collected a short, real-wall-clock sample.

| Scenario | Measured rAF p95 after changes | Canvas render p95 | Interpretation |
|---|---:|---:|---|
| Desktop 1280x800 | about 214 ms | 0.9 ms | Coarse remote browser pacing; not an acceptable-playability claim |
| Portrait 390x844 | about 213 ms | 1.2 ms | Same scheduling limit under mobile emulation |
| Landscape 844x390 | about 205 ms | 1.2 ms | Layout fixed; pacing uncertainty unchanged |
| Narrow 320x568 | about 216 ms | 1.1 ms | Width fixed; pacing uncertainty unchanged |

An additional **12-second headed desktop audit** recorded 78 rAF callbacks, p95 about 214.9 ms, Canvas render p95 about 1.1 ms, no page exceptions and a sampled JavaScript heap of approximately 3.34 MB. This is a single memory sample, not evidence of no memory leaks or a representative target-device FPS.

A script can have low Canvas render time but still appear sluggish when the browser/remote-display scheduling provides only five or six animation callbacks per second. Changing the game engine or collision model based only on this environment would be unjustified.

## Gameplay and accessibility proof

- Normal and assisted scripted routes remain available as separate browser regressions; they use a deliberately virtualized frame scheduler, which **cannot** supply real-time FPS evidence.
- The baseline Fox telegraph/recovery text and readable shapes are preserved. Artwork integration remains blocked until genuine generated assets are reviewed in-game with a human.
- Reduced Motion keeps movement/collision timing while disabling decorative visual flashing, per previous verified work.
- Newly added browser tests verify the game still starts/moves/pauses without image manifests and continues playing with the network disabled **after required files have loaded**. This is not offline cold-start support and no service worker was added.
- Repeated pause, resize and focus loss left zero outstanding audio voices and did not produce page errors in the browser tests.

## Required follow-up on real hardware

- Repeat the same scenarios in iPhone Safari and at least one intended Android/Fire tablet or phone, with both portrait and landscape and real safe-area insets.
- Use a screen recording or OS performance trace to measure actual device FPS, input latency, audio quality and battery/performance behavior. Any performance threshold must be set against those measurements rather than remote Mac throttling.
- Check the Fox telegraphs, player collision silhouette and HUD legibility with the actual delivered artwork; procedural placeholders are not sufficient visual acceptance.
