# ShakeDown — Mobile Platformer Comfort Pass
**Date:** 2026-10-13
**Target:** existing Canvas 2D birthday platformer, not a remake
**Implementation branch:** `feature/shakedown-touch-comfort-20261013` from `7b9b808`

## 2026-10-14 complete-PWA follow-up

This is the historical touch-comfort report. Its original no-service-worker/no-offline statement was accurate **for that earlier stage** and is superseded by the [complete-game PWA release work](FULL_GAME_PWA_20261014.md). Every original game asset, film, music track and art tool is now in the opt-in offline download. No APK or iPhone-specific release requirement is included in the current delivery plan.

## Benchmark — what fits and what does not

| Reference | Documented approach | Appropriate for ShakeDown | Deliberately not copied |
| --- | --- | --- | --- |
| [Dead Cells mobile](https://apps.apple.com/us/app/dead-cells/id1389752090) | Adjustable touch-button size/position, touch options and controller support | Size, opacity, alternative movement scheme, controller support | Auto-hit would change intended Fox combat |
| [Prince of Persia: The Lost Crown mobile](https://news.ubisoft.com/en-us/article/7HvHq2SIDTcXg6ap0v4QgD/prince-of-persia-the-lost-crown-mobile-accessibility-spotlight) | Move/resize touch controls, transparency, layout presets, optional automation and gamepad | Handedness, raised thumb layout, immediate presets and optional simplified HUD | No automatic parry/potion: those mechanics do not exist |
| [Super Mario Run](https://www.nintendo.com/en-ca/store/products/super-mario-run-mobile/) | Mario is always running; the player times touch jumps | Opt-in Auto-Run remains useful for easy stretches | **Not** default forced running: ShakeDown needs intentional stopping |
| [Dandara](https://apps.apple.com/us/app/dandara-trials-of-fear-edition/id1168013926) | Touch-first platforming with touchscreen and gamepad support | Touch gesture support without removing an alternate gamepad option | No 360° movement overhaul to a game with left/right physics |
| [Mikey Shorts control study](https://www.gamedeveloper.com/design/mikey-shorts-a-case-study-of-optimizing-controls-for-mobile-platformers) | Reduce directional ambiguity for precise mobile platforming | Allow two large discrete left/right buttons instead of an uncertain virtual joystick | A complex multi-axis thumbstick |
| [Microsoft 2D platformer touch layout](https://learn.microsoft.com/en-us/gaming/gdk/docs/features/common/game-streaming/building-touch-layouts/samples/game-streaming-touch-tak-sample-platformer) | Movement on one side, high-priority jump and interaction actions clustered on the opposite side | Keep Jump large; use independent Dash/Swish/Cheer; mirror entire clusters for left-handed play | One-size-fits-all static coordinates |

## 31 implemented quality-of-life improvements

Each row identifies a user-visible behavior or guard, not a mockup or speculative feature.

1. **Hold-to-move manual steering:** only a physically active pad pointer owns manual direction.
2. **Immediate left/right touch zones:** tapping the outside third of the square starts movement without an initial swipe.
3. **Mid-drag direction reversal:** steering left/right can change with the same held thumb.
4. **Immediate pointer release:** lifting the thumb clears manual steering; no direction latch when Auto-Run is OFF.
5. **Explicit Auto-Run ownership:** only the visibly pressed ON toggle may persist direction after release.
6. **Auto-Run direction steering:** a left/right touch changes the run direction while Auto-Run is ON.
7. **Safe Auto-Run OFF:** turning it off stops automatic input while preserving any physically held manual input.
8. **Upward swipe to jump:** a vertical gesture queues Jump without requiring a second button.
9. **Downward swipe to dash:** a vertical gesture queues existing Dash rather than inventing slide physics.
10. **Independent simultaneous movement and jump/dash:** vertical actions do not release horizontal thumb input.
11. **At-most-once vertical trigger per touch:** prevents accidental repeated jumps or dashes from a held finger.
12. **Multiple pointer support:** one thumb can steer while a separate touch supplies a directional/vertical action.
13. **Capture-loss and pointer-cancel cleanup:** pointer capture revocation, cancellations and window release cannot leave the character running.
14. **Focus/pause/retry cleanup:** accidental tab switching, pause, restart and leaving gameplay disable Auto-Run and held inputs.
15. **Three touch sensitivity presets:** responsive, balanced, deliberate gesture thresholds.
16. **Alternative movement layout:** replace the square with fixed left/right physical button hit areas if preferred.
17. **Adaptive starting layout:** landscape defaults to the shamrock pad; portrait retains familiar left/right buttons.
18. **Three real button-size presets:** touches expand or contract in hit geometry, not merely decorative scale.
19. **Three opacity presets:** subtle, balanced, and high visibility with legible labels.
20. **Left-handed layout:** switches the real action and movement clusters.
21. **Raised thumb-rest option:** lifts both clusters from the bottom edge while respecting device safe areas.
22. **Compact HUD option:** reduce duplicate status pills without hiding health; `H` toggles quickly.
23. **Opt-in haptics:** guarded Android vibration on supported actions, without requiring it on iOS.
24. **External gamepad support:** left stick/D-pad move; A Jump, B Dash, X Swish, Y Cheer.
25. **Gamepad Start pause/resume:** edge-triggered to avoid repeated toggling while held.
26. **Optional controller-only presentation:** hide touch overlays while a gamepad is connected, with full input still active.
27. **Native Fullscreen API toggle:** available from title, pause or gameplay, with synced labels and Escape/F keyboard support.
28. **Honest Safari immersive fallback:** if element fullscreen is unsupported, the game still expands into an edge-to-edge layout and explains Add to Home Screen for removing browser bars.
29. **Device-local control presets and reset:** versioned storage separate from checkpoints, strict value validation, safe restricted-storage fallback, restore-default button, and cross-tab sync.
30. **Accessible controls/help/settings:** native modal dialog, keyboard-focusable controls, 44px minimum target intent, a discoverable help reference, portrait rotation hint, viewport resize without unnecessary Canvas allocations, and readable full-screen state announcements.
31. **iPhone Home Screen application mode:** same-origin standalone manifest, iOS home-screen meta tags and two polished 192/512 home-screen icons derived from the game's authored Cinnamon sprite; no service worker or offline promise.

## Protected game invariants

- Cinnamon's authored identity and poses, the Fox boss, 23-stage Dome climb, Smudge and Dexter discoveries, Cheer, saved checkpoints, story/movie/soundtrack, Curator preview, and source-verified art remain authoritative.
- No replacement physics, save migration, new production dependency, dynamic third-party asset, or unapproved art promotion.
- The full-screen appearance remains an expansion of **actual world rendering**, not a blurred stretched image.
- Fullscreen cannot forcibly remove iPhone Safari browser chrome where the API is unsupported. The app now declares standalone mode: Safari → Share → Add to Home Screen → Open as Web App (where offered). Browser-dependent standalone support still requires a real iPhone test.
- Haptic API and orientation locking are feature-detected; non-support is a normal fallback.
- No change to published Pages is implied by an uncommitted feature worktree.

## Verification receipts

- Final \`npm run validate\`: **97 passed, zero failed**; includes 20 explicit steering/comfort unit cases plus four install contract cases.
- Final \`npm run release:preflight\`: **285 fingerprinted runtime files, none missing**; contains the new manifest and both Home Screen icons and a failing missing-icon fixture. Dirty worktree warning is expected until a future authorized Git delivery.
- Final desktop/mobile Playwright: **179 passed, 25 intentional skips, 0 failed, 204 total**. Initial full run caught two stale portrait/overlay assertions, both fixed before the clean rerun.
- Real Canvas screenshot audit: five desktop-emulated landscape states (title, control settings, campus play, Smudge, left-handed large controls), no page errors and no horizontal page overflow at 844 px.
- Physical iPhone Safari, Android vibration and actual Gamepad hardware: **not tested on physical devices**. The installed Home Screen browser mode was verified by configuration, contract tests and simulated browser behavior only.

- Pure unit tests: pointer lifetime, multi-touch priority, gesture dead zones, Auto-Run toggling, release/cancel cleanup, settings validation, persistence and restricted storage.
- Browser tests: actual motion while held vs after release; full-screen native/fallback; 844×390 landscape, portrait, left-handed positions; visible hit areas; settings persist and reset; gamepad move/jump/pause; title/dialog exclusivity; media still plays.
- Full regression: Node validation, complete desktop/mobile Playwright suite, game routes, release preflight, live render screenshots and performance diagnostics.
- Physical iPhone Safari and Android hardware behavior remain **unverified** until tested on-device.

## Limitations and choices

- The current fixed-height Canvas renderer, stage collision geometry, and real-time movement physics remain unchanged. A browser-managed viewport cannot always attain true OS-level fullscreen. Installed Home Screen standalone layout is separate from the element Fullscreen API.
- Layout customization uses intentional presets rather than arbitrary dragging (which can put essential controls over hazards or outside safe tap bounds).
- One-hand auto-run remains fully optional; nothing silently turns it on after a restart, focus loss or pause.
