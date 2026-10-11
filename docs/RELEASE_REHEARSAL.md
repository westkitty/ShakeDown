# ShakeDown - Release rehearsal and reversible delivery

This is a **dry-run procedure** for a static GitHub Pages game. Preparing or validating a release does not authorize merging to main, replacing production files, uploading art, or deploying the unfinished PR.

## Candidate authority

- Existing working public baseline: main @ 80d388828bfcad0cf454fe0b2b166e6528ac5e6d at start of the preparation program.
- Preparation development: prep/asset-ready-20261011 and its open PR #1.
- Preserve fixed simulation state, authored Notre Dame/Golden Dome layout, Cinnamon master references, player controls, Fox hit windows, original PNGs, complete generator contracts and the existing Pages publishing mechanism.
- Treat source approval, gameplay integration and user-play acceptance as separate gates.

## 1. Verify the candidate before changing main

In a clean checkout of the candidate SHA:

    npm ci
    npm run validate
    npm run release:preflight
    npm run test:browser

The release preflight resolves runtime imports, HTML links, the original Cinnamon manifest and frame files, and physically approved art/evidence paths. It constructs a deterministic list of runtime bytes, sizes and SHA-256 hashes. A missing imported module blocks the rehearsal. This is a static package inspection, **not** a browser-playback, hardware, visual-quality, license, or audio-proof test.

In GitHub Actions, the browser workflow stores the per-run JSON in the named shakedown-static-preflight artifact. Compare the exact SHA of the checks to the reviewed PR head. Do not treat a successful earlier SHA as a pass for later changes.

## 2. Validate the actual game journey

- Open title and Start/Continue with both keyboard and mobile-emulated touch.
- Confirm the original Cinnamon silhouette and independent Shamrock Shake pickups.
- Cross South Quad, all authored Golden Dome routes, checkpoints, moving/hazardous platforms and the final Fox encounter.
- Confirm readable red/shape/text attack tells, stagger/recovery cues, boss health and a genuine 3-hit victory.
- Confirm the separate birthday cake, shakes, exact birthday message, replay, and durable achievement/progress state.
- Test mute, pause, browser visibility/focus transitions and Reduced Motion with actual user interactions.
- Record an **ordinary human-paced route**; a virtualized rAF script or test-only boss warp cannot substitute for it.

## 3. Inspect mobile responsiveness and accessibility

- Test narrow 320 px portrait, common 390 px portrait and 844x390 landscape sizes, including a notch/safe area on real hardware.
- Keep first-use Start and movement/touch buttons visible in the initial viewport; coarse-pointer actions must have at least a 44x44 CSS-pixel target.
- Check font size and text wrapping, modal scrolling, HUD and status contrast, focus containment, keyboard Enter/Space and screen-reader labels.
- Test on actual mobile hardware and audio output before claiming a phone pass. Browser emulation is valuable, but distinct evidence.

## 4. Performance reality checks

The non-mutating command below launches an actual browser and gathers wall-clock rAF cadence, Canvas render time, input-to-movement observation, layout overflow, uncaught page errors and optional captured screenshots:

    npm run perf:audit -- --headed --seconds 4

For BigMac, set SHAKEDOWN_BROWSER_PATH to the locally installed Brave executable before running. You can constrain to one scenario using --scenario desktop, portrait, landscape or narrow.

A 60 Hz game simulation is **not evidence of 60 rendered frames per second**. Remote/headed BigMac testing in this preparation round experienced around 200 ms rAF gaps despite approximately 1 ms render cost. Treat that as a genuine environment/platform uncertainty, not proof of production FPS. Repeat on the intended target devices.

## 5. Asset gate before approving any release

Read docs/ASSET_BATCH_INTAKE_RUNBOOK.md. Do not mark a generated image delivered until the actual bytes are physically present. Do not mark it accepted without human review. Do not activate it without a corresponding authored runtime mapping and real in-game screenshot evidence.

Check original source identity, alpha, pivot/registration, 1x scale clarity, correct Notre Dame visual authority, Fox identity and the birthday cake/Shamrock Shake separation.

## 6. Proposed merge and deployment approval

Only after all required acceptance gates pass and the user authorizes release:
- Confirm the pull request is mergeable and current CI, including SHA-256 preflight artifact, is green.
- Record main SHA before merge and merged SHA afterward. Do not force-push or rewrite shared history.
- Let existing GitHub Pages publishing rebuild the merged static content.
- Confirm the deployed exact SHA via the publishing workflow, then open the actual hosted URL in a browser and exercise title, movement, sound, checkpoints and the full user journey.
- Preserve the last accepted source artifacts and checksum evidence as rollback anchors.

## 7. Safe rollback procedure (rehearsed, not executed against main)

If a later production change breaks launch or the game route:
- Preserve failed-browser logs, exact deployed commit SHA and relevant screenshot evidence.
- Keep current generated master references and unrelated user changes untouched.
- Use GitHub's Revert action for the specific merged PR, or create a new guarded rollback PR that reverts only the known bad merge via a normal Git commit. If the merge was a merge commit, explicitly identify its first parent before issuing any revert command.
- Run the same preflight, Node and Playwright checks on the rollback candidate.
- Merge the rollback PR through the normal GitHub review process and verify the resulting Pages deployment and gameplay.
- Do **not** reset main, delete source assets, push with force, replace the renderer or claim rollback succeeded based only on a file diff.

### Current blockers

Final LM Arena art has not yet arrived. Physical phone touch and speakers, actual-human full gameplay and verified public deployment of this preparation branch remain open. A passing static manifest cannot resolve these acceptance requirements.
