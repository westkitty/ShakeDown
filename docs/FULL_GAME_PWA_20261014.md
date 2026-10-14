# ShakeDown — Complete-Game Installable PWA
**Implementation:** 2026-10-14
**Base:** westkitty/ShakeDown, `feature/shakedown-touch-comfort-20261013`, derived from deployed `main` at `7b9b808`.
**Delivery objective:** One GitHub Pages game, installable as a full-screen-capable PWA. **No APK, Android Studio, app store pipeline, or iPhone-specific release gate.**

## The full game, not a reduced offline edition

The reproducible offline inventory is `offline-assets.json`. The checked-in generator `scripts/generate-offline-assets.mjs` inventories and SHA-256 fingerprints **every physical asset** under `assets/`, every art-workshop file under `tools/`, the in-game contract JSON, the live HTML/CSS, all production ES modules, and the app icons.

| Package | Files | Bytes | Approx. MiB |
| --- | ---: | ---: | ---: |
| Instantiation shell (HTML, styles, modules, icons, posters) | 33 | 1,114,087 | 1.06 |
| Complete original game, cinematics, and workshop | 297 | 82,719,591 | 78.89 |
| **Complete PWA** | **330** | **83,833,678** | **79.95** |

Original media and content **all** included: 23-stage platformer, Cinnamon/Fox/Smudge/Dexter sprites, source/reference character sheets, level backgrounds and tiles, all generated/provisional art and curation metadata, all six original recorded music tracks, branding MP4, title MP4, transparent title WebM, three narrative panels, all title-card canvases and larger original title artwork, entire game-over/victory screens, art gallery, asset reviewer, and their underlying canonical contract data.

The film files are cached as **actual media**. They are not downgraded to poster images. Everything is served under the site's existing GitHub Pages scope without a CDN, API key, backend or added runtime dependency.

## What players do

1. Open **`https://westkitty.github.io/ShakeDown/`** in a supported browser.
2. Select **DOWNLOAD COMPLETE GAME**. This explicitly confirms the approximately 79 MiB storage/network transfer. Nothing initiates the large download silently on page load.
3. Keep the game open while the counter shows file counts/progress. SHA verification checks each downloaded file. Cancel leaves already verified files ready to resume; a later attempt skips files whose hashes remain correct.
4. Wait for **ENTIRE SHAKE DOWN OFFLINE** readiness. Only then does the title's main button offer the native install prompt or browser-menu installation guidance. The site's normal online game remains playable without downloading.
5. Install from the supported browser prompt/menu. The installed PWA launches in standalone mode, with an in-game Fullscreen button (native Fullscreen API where supported, truthful immersive CSS otherwise).
6. Play without a network connection. The installed page, source modules, game art, audio, original videos, and both art tools are cache-served. Device-local game saves and control preferences remain separate from Cache Storage.

## Offline architecture

- `manifest.webmanifest`: `id: "./"`, `scope: "./"`, `start_url: "./"`, `display: "standalone"`, and source-derived Cinnamon 192/512 PNG icons. The in-game Fullscreen toggle provides more immersion on compatible runtimes without requiring a separate application.
- `service-worker.js`: versioned service-worker scope rooted at the deployed Pages subdirectory, not the origin root. Installation validates and precaches the ~1.06 MiB boot shell. The explicitly requested full-game download verifies 297 more files by SHA-256, size, and same-origin path. The offline-ready marker appears **only after every file is available**.
- **Actual video seeking:** `Range: bytes=...` requests for cached MP4/WebM/MP3 are answered with correct HTTP 206, `Content-Range`, `Content-Length`, `Accept-Ranges` and media type. Range/suffix and invalid-range semantics are handled; partial 206 network responses are never stored as complete media.
- **Installation safety:** Download concurrency is bounded to three assets, with a storage-quota estimate, Data Saver warning, cancel/resume, and no automatic huge fetch when the title loads.
- **Updates:** New worker versions wait until the player requests an update rather than reloading mid-level. Valid unchanged game assets can be reused across worker revisions without an unnecessary full redownload. Corrupt/outdated records fail source-hash verification and can be selectively replaced. Browser cache eviction can still invalidate offline availability; the app checks readiness and offers a repeat download.
- **State integrity:** Removing an offline pack never clears the user's checkpoint saves or touch-control preferences. No new gameplay, physics, scoring, character, art-approval or save-schema mutation.

## Build and release gates

These are deterministic, local and dependency-free (except Playwright for browser tests):

```bash
npm run pwa:inventory          # Regenerate full hashed file index if any live asset changes
npm run pwa:check              # Fail if inventory is stale
npm run validate               # Game integrity + PWA contracts + unit tests
npm run release:preflight      # SHA-check all runtime/film/music/art/worker bytes
npm run test:browser           # Normal desktop + mobile-emulated game routes
npm run pwa:audit              # Heavy, opt-in complete download plus disconnected playback proof
```

**Version rule:** A release that changes any core/game asset or service-worker behavior must update `PACK_VERSION` in the generator and `REV` in the service worker **to the same new string**, regenerate `offline-assets.json`, and rerun the full offline audit. The release preflight blocks version/hash drift, missing source films, missing songs, omitted art-workshop files, and missing source icons.

## Verified evidence

- SHA index: **330 files / 83,833,678 bytes**, every `assets/` and `tools/` file physically present and hashed.
- Unit/content suite: **107 tests passed** prior to final browser sweep. Release preflight: **332 fingerprinted runtime files, zero missing**, with expected local dirty-worktree warning (not a published-release receipt).
- Actual local Chromium full-offline audit deliberately hosted the project at **`/ShakeDown/`**, downloaded the complete pack, disconnected the browser, reloaded the title, started the real game, fetched original media and reference artwork, navigated to both original art tools, and played the 1280×720 original branding MP4 fully offline. **No console errors, failed requests, missing files, or runtime page exceptions.** Explicit MP4, WebM, and MP3 byte-range requests returned correct HTTP 206 responses.
- App entry/inventory/update UI tested on desktop and mobile-emulated Chromium, with full-pack download behind a player confirmation.
- Complete default-serial browser regression: **187 passed, 25 intentional skips, zero failures, 212 total**. Five landscape screenshot states have no page errors or document overflow.
- A separate hosted-style /ShakeDown/ browser server ran the full PWA installation/manifest checks on both desktop and mobile emulation: **8/8 passed**. The hosted Pages SHA verifier was exercised against the same public-style subpath and checked the entire source package. Corrupting the original title MP4 deliberately caused parity failure, confirming the release gate. The GitHub Pages deployment workflow now blocks upload when the media hash index or release preflight fails. Actual public-hosted parity remains unverified until the branch is published.
- The isolated feature branch is ready for a frozen local commit. **No public GitHub Pages publication is evidenced**: pushing, merging and deploying are separate actions. Physical installed-app play on a real device is still not independently verified.

## User decisions preserved

**One complete PWA only. No APK.** GitHub Pages remains the host; the manifest and worker contain every local game file for eventual disconnected play. iPhone support is not a delivery constraint. No unsupported offline promises are made before the complete SHA-verified pack is downloaded.
