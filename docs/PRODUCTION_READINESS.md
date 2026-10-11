# ShakeDown — Production-readiness contract

Updated 2026-10-11. **Canon: one self-contained birthday adventure, not the old four-world draft.** Cinnamon Fuzzbutt is a red panda, not a cat. The Fox steals the last Shamrock Shake, *not* the birthday cake. The chase runs through South Bend / Notre Dame South Quad, climbs the Golden Dome, confronts the Fox, and celebrates Maverick with a cake and Shamrock Shakes.

## Source-of-truth hierarchy

1. Newest explicit user corrections and approved Cinnamon visual references.
2. docs/IMPLEMENTATION_PLAN.md — current playable routes, mechanics, and story.
3. docs/assets/ShakeDown_Complete_Asset_Contract.json — 220 design requirements and 21 audio requests; requests do not prove files exist.
4. assets/runtime/manifest.json — verified and reviewer-approved final files only (initially empty).
5. assets/sprites/cinnamon/frames.json — 26 real, source-derived Cinnamon pose cut-outs.
6. docs/ASSET_HANDOFF.md, docs/ASSET_BATCHES.md, docs/level1/ — earlier four-world and prototype documents, retained for provenance but superseded where inconsistent.

The LM Arena PDF, source Markdown, and comprehensive JSON are a versioned trio. Do not rewrite the active prompts while outside models are creating the assets they specify. This sprint does not alter any of the 220 requests.

## Protected existing behavior

- Static Canvas 2D + semantic DOM UI, fixed 60Hz authoritative game loop, AABB one-way platform collision, procedural fallback graphics.
- South Quad and Golden Dome travel, the 23-step ascent, GO IRISH pulse, pickups, checkpoints, hazards and the Fox three-hit telegraph/recovery battle.
- Birthday finale and exact HAPPY BIRTHDAY, MAVERICK! greeting; cake is a celebration, not a rescue objective.
- All 26 Cinnamon source-cutout PNGs, including the clipped run_03 preserved for source provenance. The runtime animation intentionally skips run_03; never silently replace it.
- Cloud Chaser is a read-only precedent, never a work target.

## Incoming assets: automated validity + human approval

Development-only tools: Node 20 or later, npm ci. Browser/game deployment still has no runtime package dependencies.

1. Receive each independent file with its LM Arena logical asset ID, model/source provenance, and rights statement. Keep unreviewed candidates outside the repository or under ignored .asset-staging/.
2. Inspect the master JSON contract for the exact logical ID, expected path and target_px. Never assume guessed filenames, sizes or animations.
3. Inspect without modifying production:

       node scripts/asset-intake.mjs inspect --id CO-03 --file /path/to/candidate.png

4. Candidate must have exact requested PNG dimensions, actual decodable pixels and alpha matching the contract. Stage under an immutable SHA-derived candidate path:

       node scripts/asset-intake.mjs stage --id CO-03 --file /path/to/candidate.png

5. Inspect the returned stagedPath at actual gameplay scale. Character fidelity, spelling, visual legibility, outline style, intentional transparency, alpha-edge/crop warnings, and canon correctness require an actual reviewer. Once approved:

       node scripts/asset-intake.mjs approve --id CO-03 --file .asset-staging/CO-03/HASH.png --reviewer Andrew --visual-approved

6. Approval copies bytes to the exact master-contract output path (without overwriting an accepted revision) and updates assets/runtime/manifest.json with real dimensions, hash, reviewer, provenance and **integrationStatus: unverified**. Approval is not browser proof.
7. Run npm run validate and npm run test:browser. Inspect real rendering in desktop/mobile layouts, including boss visual tells and shadow/collider alignment; document interaction proof separately.
8. Fox artwork FOX-02 onward requires reviewed FOX-01 identity source before approval; provisional procedural Fox remains in the game until then.
9. Audio AU-01 through AU-21 accepts genuine WAV or OGG containers through the same intake command. Container validity is not proof of licensing/originality, loudness, seamless loops, or actual speaker playback. Keep the existing WebAudio synth fallback until those matters and playback integration are verified.

Do not promote specs, thumbnails, prompts, art descriptions, staged candidate bytes, or successful compiler logs to verified assets.

## Renderer plug-in points

The browser loader only attempts user-approved files with real manifest entries. It can replace visuals (never collisions or game-state values) for BG-01 sky, CO-03 shake cup, BD-01 birthday cake, and FOX-02/03/05/06/07/08/09/10/11/12, retaining existing telegraph and recovery warnings. Future production IDs can enter the manifest but still need deliberate in-game placements after evidence; the runtime does not pretend 194 candidate assets are already integrated.

## Priority order while generation proceeds

- **P0:** keep approved Cinnamon identity; approve Fox identity before FOX animations; ensure readable boss tells and recovery; daylight/campus sky, Dome backdrop with collider-safe layering; Shamrock Shakes, birthday cake and critical touch/HUD visuals.
- **P1:** enemies, physical ground/platform skins, effect sprites, collectible effects and provenance-cleared audio.
- **P2:** distant decoration, optional dialogue portraits, nonessential flourishes.
- The comprehensive JSON priority field remains authoritative. The order above prioritizes integration dependencies; it does not rewrite the external job queue.

## Verification and publishing gates

Run, in order:

    npm ci
    npm run validate
    npm run test:browser

Browser automation tests both real localhost HTTP requests and desktop/mobile-emulated Chromium interactions: launch, sprite loading, movement, jumping, pause, mute persistence, touch visibility, boss flow via **test-only warp**, birthday overlay and replay. Run with SHAKEDOWN_BROWSER_PATH set to the full local Brave binary path if a Playwright-installed Chromium build is unavailable. Offline player tests remain a separate requirement.

**A true full-journey PASS requires a no-teleport traverse from campus through Dome steps to boss recovery and replay.** Test-only QA warp proves the conclusion transitions but not a playable complete route. Physical-phone touch tests, real audio audition, long-session p95 sampling, and hosted URL player journeys remain distinct proof gates. Do not call a 60Hz simulation update rate an observed 60fps renderer.

## Release and rollback policy

Do not merge this preparation branch until npm run validate and all browser tests pass. The existing GitHub Pages workflow should remain unchanged; release checks compare deployed SHA, HTTP response, required asset files, and live player interaction. Keep asset approvals and source originals on separate candidate revisions. If reviewed art regresses the game, roll back only that artwork/manifest promotion to the last accepted revision; never wipe unrelated source work or force-push shared history.

## Explicit remaining limits

The final LM Arena artwork is still missing. Run_03 remains clipped on disk, deliberately skipped at runtime. Headless browser/device emulation does not equal real touchscreen QA. Complete unassisted route, audible sound quality and actual-phone performance are not automatically established by this preparation sprint.
