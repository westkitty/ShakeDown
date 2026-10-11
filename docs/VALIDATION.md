# ShakeDown evidence ledger

## Confirmed executed work
- `node --test tests/*.test.mjs`: 10 passing platforming/mechanics/boss tests on Oct 11, 2026.
- `node --check`: production JavaScript modules parsed without syntax errors.
- Chromium runtime: the real ES module source was concatenated for test injection into an empty Chromium DOM because host navigation is blocked (`ERR_BLOCKED_BY_ADMINISTRATOR` on localhost, file and data URLs). The HTML/CSS, 26 real PNG source cut-outs, Canvas renderer and interaction logic executed with **0 uncaught page errors** at 1280px desktop and 390px mobile viewport. Screenshots inspected for opening scene, quad, Dome ascent, summit, Fox battle and birthday finale. See `docs/PROJECT_STATUS.md` for limitations.
- Fox phase and victory via test-only `?qa=1` equivalent warp/recovery controls plus actual J swish presses: 3 HP to 0 and game state `victory`; this proves battle transitions, **not traversal of the entire route**.
- `frames.json` contains real existing files and SHA256; deterministic extractor regenerates the same cut-outs from the supplied source art.

## Deliberate evidence limits
- Browser test-bundle injection is NOT normal URL navigation or proof that GitHub Pages works.
- Passing scripted boss state is NOT a complete manual skill-playthrough through the Dome.
- No real-phone touch-device test, audible audio QA, or long-session p95 frame profiling yet.
- Final LM Arena art is not created merely because the production PDF specifies it.

## Reproduce
- `npm run validate` for deterministic tests and asset checks.
- `python3 -m http.server 8765` for local static hosting.
- Normal-browser manual checklist: title, keyboard jump/double jump/swish/dash, bridge pulse, beacon activation, collectibles, Dome climb, checkpoint, boss charge telegraph, swish on rest, victory, replay, pause, mute, loss/retry, touch portrait and landscape.
