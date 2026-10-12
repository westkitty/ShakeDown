# Shakedown — Cheer Relay / Playable Level Expansion
Date: 2026-10-12
Target: existing Canvas 2D engine and fixed-step simulation on westkitty/ShakeDown.

## Problem, not merely decoration

The original "GO IRISH!" chant automatically cycled every 5.6 seconds, with a 2.9-second active pulse opening timed banner bridges; tail-swishing a Drum Beacon extended the pulse. There was no direct player cheer action, no cooldown/status clarity, no reward for reaching the upper side paths, and little clear distinction between solid/inactive authored banners. The original ground route, fixed 23-stage ascent, Fox recovery/attack battle and checkpoints were functioning and must remain so.

## New playable areas

This is a branch-and-elevation expansion inside the original 8350-wide playable world, not a claim that the campaign's horizontal world length was tripled.

- **South Quad Pep Rally:** 14 new elevated platforms, real jumping/landing collision, four optional pulse bridges, one moving traverse and a connected rejoin. A player can remain on the safe original ground route.
- **Bell Gallery:** 5 new elevated detour platforms off the mid-Dome ascent; one cheer relay unlocks a bonus Shamrock Shake.
- **Upper Cornice:** 6 new optional platforms near the high Dome; a second Dome relay unlocks a secret shake.
- **In total:** 25 physically collision-enabled platforms, four reachable relay bells, four locked-until-cheered secret Shamrock Shakes, two additional Cup Crawlers and one additional confetti cannon. Existing six checkpoints, 23-step ascent, Fox arena and ordinary victory route remain in place.
- Every added path is optional; the authored pulse route has a solid fallback route. No existing platform, checkpoint, boss coordinate or collision rule was removed or rewritten.

## A real CHEER action

Keyboard **C** or touch **CHEER** issues an edge-triggered input to the authoritative 60Hz update loop. It cannot be spammed while held and has a 6.4-second cooldown. The cheer:

1. Immediately turns on all timed banner bridges for 2.2 seconds, or 3.7 seconds when used near a real Drum Beacon. Existing beacon tail-swish action remains available.
2. Emits a single gameplay event with a localized gold/teal sound-wave effect and a four-note synthesized cheer cue (no newly invented recorded crowd-track asset).
3. Stuns nearby Cup Crawlers for 1.45 seconds and quiets nearby confetti cannons for 2.1 seconds; it neither damages nor trivializes the Fox boss.
4. If Cinnamon is physically close to an optional rally bell, lights the bell and releases that bell's genuine Shake collectible exactly once. Each post may only be claimed once.
5. Displays player-action cooldown, natural chant/pulse countdown derived from the **same** world timing owner as collision, relay count, and clear active/inactive banner outlines even if optional generated art is loaded.
6. Shows fixed/readable feedback without moving or flashing camera effects when Reduced Motion is enabled. Screen-reader status remains textual and keyboard/touch controls remain real HTML buttons.

## State and save invariants

- Runtime counters, cheer cooldown, bell lighting, enemy stun and wave owner live in authoritative game state, not renderer side effects.
- The existing schema-1 checkpoint format remains accepted. Optional rallies IDs persist the new bell claims and unlock the correct rewards on resume. Old records with no rally field remain valid.
- Classic-art opt-out remains a gameplay-compatible visual fallback; the 194 generated images remain governed by their actual review metadata. Existing assets and Cinnamon sprite source files are untouched.

## Validation levels

- Unit: source checks, 56/56 Node tests including new cheer timing, cooldown, relay ownership, reward gating, nearby enemy suppression and pair-wise jump reachability across all 25 new steps.
- Integration: desktop and mobile Chromium emulation both send actual keyboard cheer events; mobile taps real CHEER button at 320px without horizontal overflow, and reduced-motion behavior is tested. Targeted cheer/lifecycle/motion rerun: 13 passed, one intentional desktop touch-only skip.
- Gameplay: preserve assisted/normal full-route tests including all Dome stages, Fox three-hit win and checkpoint storage. No new teleports or physics bypasses were used for the standard route.
- Visual inspection: actual-browser diagnostic screenshots inspected: [Pep Rally desktop](qa/cheer-rally-desktop.jpg) and [320px mobile controls](qa/cheer-rally-mobile-320.jpg). Images are diagnostic, not user visual acceptance.
- Regression found and repaired: when a cheer quiets a cannon, the artwork must not still show an imminent-fire `!`; it now displays a distinct `Z` marker. Reduced Motion uses static chant text rather than a second-by-second changing pixel readout, and the offline regression checks the configured origin rather than hard-coding port 8765.

## Honest limitations

- Vertical optional paths deepen the level but do not move the existing 8350px outer world bound.
- Source images used by art playback are still provisional pending visual owner acceptance; this feature does not fabricate new asset approval.
- Automated browsers prove browser-executed behavior on the tested systems, not human-paced physical Android performance or external speaker listening.

## Release checkpoints

Final source branch and exact GitHub Pages proof are recorded by subsequent GitHub Actions receipts. The local exploratory full-browser run initially had 101 passes, 9 intentional skips and 4 failures limited to the reduced-motion countdown and hard-coded test origin; both corrections subsequently passed all 13 targeted desktop/mobile cases. Do not substitute that targeted rerun for a complete exact-commit CI gate.
