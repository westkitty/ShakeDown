# P004 — Baseline-first performance evidence (2026-10-12)

## Provenance and limitations

- Repo: westkitty/ShakeDown, feature branch `feat/omni-approved-20261012`, rooted at main `e3dfeac8` with P003 applied.
- Big Mac: macOS arm64, Brave via Playwright, static localhost, real requestAnimationFrame timing (no synthetic QA clock), 1280×800 viewport, 3-second gameplay samples and 2-second same-context empty-page calibration.
- Android target available: Samsung Galaxy Tab S9 Ultra SM-X910, Android 16, Chrome 154.0.8037.126. ADB launched the public hosted game successfully and captured visual evidence (not committed, because private on-screen overlays are unrelated to the project). Chrome remote-debugging socket appeared but its forwarded HTTP endpoint returned empty replies.
- `adb shell dumpsys gfxinfo com.android.chrome reset` followed by starting ShakeDown and seven seconds of observation produced only **one Android UI frame**. Therefore the 7ms value is NOT web game FPS, Canvas timing, or proof that the game ran at a stable rate. Do not infer performance from it.
- iPhone Safari testing, on-device JS timings, long-session heap and thermal measurement remain **unverified**.

## Repeatable local baseline (observed, not target-device FPS)

| Mode | Empty-page rAF p95 | Game rAF p95 | Canvas render p95 | Resource encoded bytes | Console errors |
|---|---:|---:|---:|---:|---|
| Curated/default | 200.1 ms | 200.1 ms | 1.3 ms | 9,917,324 | none |
| Classic | 216.7 ms | 216.7 ms | 1.6 ms | 3,204,233 | none |

These samples were performed sequentially on a heavily scheduled remote browser. A 200–217 ms p95 interval already occurs with **no game rendering**; no game-caused FPS regression is established. Canvas measurements are not GPU time. Resource encoded sizes are Performance API readings for that one run, not cold-network transfer guarantees.

Reproduce on a real browser with:

```sh
SHAKEDOWN_BROWSER_PATH='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' npm run perf:audit -- --seconds 3 --scenario desktop --calibrate --art curated
SHAKEDOWN_BROWSER_PATH='/Applications/Brave Browser.app/Contents/MacOS/Brave Browser' npm run perf:audit -- --seconds 3 --scenario desktop --calibrate --art classic
```

For physical-device closure, collect Chrome DevTools/Web Inspector performance traces on the actual target browser while actively playing at campus, Dome, and boss. Include hardware, OS, browser, target resolution, battery/power state, warm/cold cache, 1% lows or p95/p99 frame times, input-to-movement latency, memory deltas after a sustained run, and screen/audio responsiveness. Calibrate with an empty page in the **same browser/environment**. Repeat after P002 camera scaling before claiming uplift.

## Decision

**P004 is implemented for benchmark tooling and baseline evidence; real target-device FPS certification remains blocked** by unavailable Chrome CDP and absent iPhone testing. No performance optimization was attempted from invalid evidence.
