# OMNI follow-through — Shakedown
Date: 2026-10-12

## Baseline and preservation
- Repository: `westkitty/ShakeDown`, starting `main@e1f98f35c092159018e05604141d818ba5a356a6`.
- Existing Canvas 2D + 60Hz state simulation, physics, five ordinary route transitions/six checkpoints, 23 Dome steps, the Fox's three mandatory swish hits, source-preserved Cinnamon sprites, art-review authority and `?art=classic` remain authoritative.
- Original baseline `npm ci`, `npm run validate` **56/56 PASS**, `npm run release:preflight` PASS.
- No new runtime dependencies, engine/renderer migration, SVGs, external replacement character art, or changes to private reference bytes.

## Bounded improvement groups

### 1. Make the new routes discoverable, not merely present
- Four physical-looking, noncolliding campus/Dome rally signposts authored at actual route entrances.
- Pure, read-only rally guidance picks the nearest unlit bell in the current region, reveals approach/readiness/recharge/achievement states, and announces non-spammy textual instructions outside the Canvas. The signs and legend also work with classic fallback artwork.
- The original ground route remains a fully playable nonoptional escape from timed banner bridges. The player is not required to finish a bonus rally to reach the Fox.

### 2. Extend the cheer into the finale without trivializing it
- Player cheer **near the Fox during recovery** extends that recovery by at most 0.48s and no more than 2.1s total.
- The same 6.4s cooldown prevents repeatedly keeping the Fox helpless. Windup, charge, volley and hit states are not cancelled; no boss HP is changed by cheering.
- Extra audible crowd-inspired two-note cue plus a typed VFX event, both using the current AudioBox/WebAudio and existing effect-budget limits.
- HUD instruction tells players to dodge windup, swish on recovery, and optionally cheer to lengthen the window.

### 3. Give the optional bells a payoff players can see and keep
- Birthday ending displays `X/4` rally bells, `RALLY LEGEND` when all are lit and an invitation to complete them on another run otherwise.
- Monotonic optional `bestRallies` persisted in the existing schema-1 localStorage settings snapshot, with preservation across replay, ordinary stale-tab settings writes, and legacy records.
- Four bell names, presentation cues, exact 25 optional platforms and previous six checkpoints remain unchanged.

## Verification

- New Node tests: rally sign/name integrity, contextual instruction state, cooldown, boss-cheer strict mode gating, 0-damage policy, actual still-required boss swish.
- **No-warp default-difficulty gameplay proof:** ordinary starting spawn, physically jump to Quad Training 1, successive Rally Quad 01/02/03 platforms, use naturally available C cheer to open a pulse bridge, wait real 6.4s cooldown, cheer at the actual Canopy Bell, physically collect `rally-shake-canopy`. No teleport, enemy removal, hazard removal, fake score, overridden physics or bypassed boss/level exit.
- Desktop and mobile Playwright browser test verifies DOM input, scene state, actual cheer action, narrow CSS, clue appearance, Fox interaction, four QA-positioned relay events and persistent Victory score. Fixture-assisted positioning only tests specific interactions, **not** an unwarped four-relay campaign completion.
- Evidence screenshots: [desktop Canopy](qa/omni-rally-canopy-desktop.jpg), [320px mobile guidance](qa/omni-rally-guide-mobile.jpg). Screenshots prove pixels, not human readability or frame rate.
- The full existing browser matrix and exact remote CI/deployment are distinct gates; do not claim PASS without subsequent receipts.

## External precedent (advisory, not project authority)

- [Yacht Club Games: Check Point Design](https://www.yachtclubgames.com/blog/check-point-design/): authored, discoverable checkpoint cues inform preserving existing checkpoint identity.
- [Microsoft Xbox Accessibility Guideline 116](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/116): accessibility risk from tightly timed input informs the retained untimed ground route.
- [Celeste published changelog](https://www.celestegame.com/changelog.html): visibility tweaks to checkpoint icons and optional collectible progression are examples of signposting, not source for Shakedown behavior.

## Unverified or deferred
- Physical Android/desktop human-paced gameplay and acoustic speaker verification.
- All-four-bell continuous natural campaign; one complete unwarped Canopy trail was verified.
- No direct user visual-identity signoff on remaining provisional environmental assets or Fox master art.
- Structural frame `run_03` remains excluded because the original action sheet crop is clipped.

## Final local evidence and performance comparison

- `npm run validate`: **61/61 Node tests passed**, no skips or failures. `npm run release:preflight`: success.
- Entire local one-worker Brave/Playwright browser matrix: **111 passed, ten intentional skips and one failure**, limited to mobile initial Start-button focus. That exact pre-existing focus test subsequently **passed 5/5 repeated mobile runs** without a code change. Root cause was not determined; classify as intermittent/unresolved rather than a repaired failure. Exact-commit remote CI is the release gate.
- The three unwarped original scripted full-route desktop variants (assisted, normal difficulty and provisional curated art) passed through the Fox victory and checkpoint persistence.
- New rally-specific desktop/mobile browser checks passed 7/7 applicable; the separate standard-difficulty no-warp route to the Canopy Bell and physical reward passed with enemies/cannons active.
- Matched BigMac Brave/Playwright two-second idle/entry audits over desktop, portrait, landscape and 320px narrow: **before** p95 canvas render times [1.7,1.5,1.6,1.1] ms; **after** [1.4,1.9,1.3,1.4] ms respectively. Differences are too small/inconsistent to claim performance uplift or regression. Both runs observed ~200ms rAF spacing in a remote throttled/headless environment and **cannot prove playable physical-device FPS**. All eight scenarios recorded zero page errors; no new production dependencies.
- Full public deployment, same-commit CI and MacBook synchronization are separate, subsequently verifiable operations, not inferred from this local report.
