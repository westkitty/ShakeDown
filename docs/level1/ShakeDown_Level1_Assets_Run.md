# SHAKEDOWN / LEVEL 1 ASSETS RUN / LM ARENA AGENT PROMPT

## MANDATORY EXECUTION CONTRACT
You are the asset-production agent for `westkitty/ShakeDown` Level 1, `Golden Dome Dash`. Treat this complete packet as task instructions, not advice. The two visual source sheets embedded in the PDF are authoritative style/identity references. **DO NOT GENERATE CINNAMON FUZZBUTT**: his approved sprite references already exist. Do not alter, recreate, relabel or embed player art as new runtime art. Generate every designated NON-PLAYER asset listed below as an independent output file. One requested output = one file, never a collage or contact sheet.

Prioritize P0 in the defined order and deliver an actually playable compatible asset collection today. P1 is optional polish only after P0 integration succeeds. The Fox is **a provisional candidate**, because no approved Fox reference was supplied; keep it consistent internally, flag it for approval, and do not call it canon. Do not spend today's scope inventing other bosses, enemies, or worlds.

Maintain 2D side view, near-SNES 16-bit pixel-art presentation: deliberate pixel clusters, crisp heavy dark brown outlines, limited 2-3 shades/material, flat graphic depth, orange/cream character reference, blue-and-gold collegiate scenery, warm daylight, readable silhouettes. Backgrounds are quieter than sprites. No stock photo realism, no soft painterly airbrush, no gradient-heavy vector effect, no text/watermark, no 3D, no extra characters, no baked collision platforms inside backdrops. Use only required perspective; if model output misses exact pixels, save native source then deterministically crop/resize and re-QA.

**Generation order:** BG and TL layout kit; P0 PR props; P0 MC paired gimmick states; P0 EN enemies; P0 FX candidate and CO collectibles; P0 VF and UI; P0 procedural audio; then P1 only if time. Each required output must be a unique transparent PNG except BG-01 opaque sky. Do not assume a source PNG has alpha: inspect pixels. Per-file dimensions are target export sizes, not facts until validated. Use a verified JSON manifest with physical dimensions, alpha bbox, pivot, frame relationship, SHA-256, source prompt, and source input IDs. Runtime references only verified generated manifest entries.

**Asset normalizer:** preserve full silhouettes including shadow and tail, use trim-with-padding inside fixed output canvas; center bottom anchor on mobile game sprites and props; collision regions come from the game layout, never derived by guessing image pixels. Source art for sprite/prop jobs is exactly 4x intended runtime width and height and downsampled/cleaned for crunchy 16-bit readability. Background sources exactly 2x runtime. Atlas sheets, if desired, MUST be packed by a script from approved individual frames with measured coordinates, never rendered as an AI guessed sprite sheet.

**Quality gate for every file:** file exists; readable RGBA; expected width/height; honest alpha background; no clipped silhouette; no unrelated elements; icon legible at 1x; correct side camera and anchor; exact pairwise identity for animation/state pairs; no glowing black/white halo on alpha; no extra text; no unlicensed marks/music. Run image assertions and representative 960x540 scene screenshot. Reject/rework specific failed output rather than pretending pass. If no image generator or audio renderer exists, mark BLOCKED per file and provide a deterministic fallback and final prompt; NEVER invent completed files or hashes.

**Runtime / map contract:** Canvas2D viewport 960x540, side-scroll world x=0..6620, 32px tile grid, 60Hz fixed-step physics. Scope only vendor opening, QUAD (about 69% of level), quick Golden Dome rise, Fox escape ending. Pulse: 5.0s global cycle, >=0.5s anticipatory visual cue, active 2.0s, a tail-swish on drum refreshes active for 2.3s with 5s cooldown, occupied bridges hold solid until safely left plus 0.65s. No music dependence or flashing-only cues, no locked routes based on hard perfect timing. Collectibles never gate exit. No playable riverwalk/stadium/boss. Use actual platform/collider data separate from art.

## ONE-SHOT OUTPUT RULE
For each record, use its own requested output path. Produce the named pixel dimensions, side-on camera, exact named visual description, variant/state relationship and gameplay constraints. Use the reference images in the PDF as stylistic supervision; never crop/Cinnamon-trace and pass that off as a new generated subject. Run QA and record P0 result after each independent output. Your final handoff must include generated files, approved/rejected per-file report, machine-readable manifest, asset viewer/960x540 proof screenshot, and source/provenance record. If browser integration is outside this agent's access, hand off assets with truthful UNVERIFIED-IN-BROWSER status.

## TARGET ASSET RECORDS

### BG-01 Daylight sky
Priority: P0 | category: BG | planned target: `assets/level1/backgrounds/bg_01_daylight_sky.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency false

**Generation prompt:** Side-view playable 2D game asset: Clean warm pale blue campus daylight sky; gentle white clouds only in upper third; no ground, no buildings, no playable objects. Opaque full-bleed non-tileable; camera scroll factor 0.08; top-left Usage: Opaque far background; all outdoor zones. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### BG-02 Campus approach silhouette
Priority: P1 | category: BG | planned target: `assets/level1/backgrounds/bg_02_campus_approach_silhouette.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: Side-scrolling backdrop of leafy collegiate lawn, distant generic masonry halls, low tree skyline; warm blue-gold pennants distant; ground plane visually quiet and flat at bottom; no recognizable foreground props. Separate from sky, transparent lower horizon; parallax 0.22 Usage: Vendor introduction and eastward chase. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### BG-03 South Quad architecture
Priority: P0 | category: BG | planned target: `assets/level1/backgrounds/bg_03_south_quad_architecture.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: Long collegiate brick and pale-stone facades, open windows, mild buttress and arch details, generous lawn; recognizable Notre Dame ambience without measured geography; no embedded jumpable stairs/platforms. Transparent layered silhouette; parallax 0.28 Usage: Majority of quad route. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### BG-04 Quad tree and lawn midground
Priority: P1 | category: BG | planned target: `assets/level1/backgrounds/bg_04_quad_tree_and_lawn_midground.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: Sparse stylized mature trees and low manicured hedges receding behind playfield; soft lawn, distant path, a few blue/gold pennants; leave middle 55% visually subdued so player/enemies stand out. Use transparency; place below collision/play layer; parallax 0.46 Usage: Readable quad depth and run route. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### BG-05 Golden Dome hero backdrop
Priority: P0 | category: BG | planned target: `assets/level1/backgrounds/bg_05_golden_dome_hero_backdrop.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: Recognizable gold-domed central campus building with broad pale stone/bricky facade and symmetric windows; dome centered in upper right half, golden statue suggestion as simple decorative shape, warm sunlight. No game platforms baked into paint. Strong focal silhouette, avoid tiny unreadable gothic details; parallax 0.18 Usage: Dome approach and ascent. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### BG-06 Escape horizon
Priority: P1 | category: BG | planned target: `assets/level1/backgrounds/bg_06_escape_horizon.png` | final 960x540 px | generator source 1920x1080 px | pivot top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: Campus walkway falling toward a distant tree-lined South Bend horizon, distant bridge hint; green milkshake trail belongs on gameplay layer, NOT in this backdrop. Transparent upper-mid layer for finale transition; parallax 0.25 Usage: Fox gets away after Dome. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 960x540 px with top-left origin.

Collision authoring guidance: `none`. Zone: all.

### TL-01 Grass top tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_01_grass_top_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: walkable 32 px grass strip with precise top edge, 5-7 px grassy cap over compact dark earth top edge y=0, repeat seamless left/right Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-02 Grass fill tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_02_grass_fill_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: earth fill with minimal pebble flecks and warm soil texture seamless four edges Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile fill`. Zone: all.

### TL-03 Stone path top tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_03_stone_path_top_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: light weathered limestone walkway paving top edge with slim top highlight repeat left/right Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-04 Stone path fill tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_04_stone_path_fill_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: masonry fill pattern beneath walkable top surface repeat four edges Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile fill`. Zone: all.

### TL-05 Stone ledge center tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_05_stone_ledge_center_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: pale stone horizontal ledge with bright lip and subdued undercarriage repeat left/right Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-06 Stone ledge left cap
Priority: P1 | category: TL | planned target: `assets/level1/tiles/tl_06_stone_ledge_left_cap.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: stone ledge left termination with readable edge and exact neighbor continuation on right align to TL-05 on right Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-07 Stone ledge right cap
Priority: P1 | category: TL | planned target: `assets/level1/tiles/tl_07_stone_ledge_right_cap.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: stone ledge right termination with exact continuation on left align to TL-05 on left Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-08 Stone step tile
Priority: P0 | category: TL | planned target: `assets/level1/tiles/tl_08_stone_step_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: pale stone stair-tread surface with clean 32 px read usable as 32x32 stair collider Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile authored AABB`. Zone: all.

### TL-09 Brick fill tile
Priority: P1 | category: TL | planned target: `assets/level1/tiles/tl_09_brick_fill_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: muted collegiate brick architectural fill not overly saturated repeat four edges Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile fill`. Zone: all.

### TL-10 Banner mount tile
Priority: P1 | category: TL | planned target: `assets/level1/tiles/tl_10_banner_mount_tile.png` | final 32x32 px | generator source 128x128 px | pivot tile-top-left | transparency true

**Generation prompt:** Side-view playable 2D game asset: non-walkable pale stone mounting block with blue-and-gold bolt sockets ornamental; no physics assigned Usage: Modular level geometry. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with tile-top-left origin.

Collision authoring guidance: `tile fill`. Zone: all.

### PR-01 Shamrock Shake stand
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_01_shamrock_shake_stand.png` | final 256x192 px | generator source 1024x768 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Cheerful small outdoor concession booth with green shamrock graphics, blue-and-gold awning accents and clear service counter; no readable text. solid scenery face; collider only under counter Usage: Opening theft kiosk. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 256x192 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-02 Folded menu board
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_02_folded_menu_board.png` | final 96x128 px | generator source 384x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: A chalkboard style upright A-frame sign with stylized unlettered green cup mark, pale stone sidewalk look. static decoration Usage: Opening vendor dressing. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x128 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-03 Campus bench
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_03_campus_bench.png` | final 128x80 px | generator source 512x320 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Old campus-style dark iron and wooden bench, side profile, clean flat top silhouette. can stand on seat if level geometry says so Usage: Quad seating obstacle. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x80 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-04 Campus lamppost
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_04_campus_lamppost.png` | final 96x256 px | generator source 384x1024 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Traditional ornate dark metal campus light post with one softly golden glowing lantern, side-view. thin non-colliding scenery Usage: Vertical landmark and obstacle. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x256 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-05 Mature quad tree
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_05_mature_quad_tree.png` | final 192x256 px | generator source 768x1024 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Large leafy deciduous tree with warm-green canopy, broad trunk and pixel-cluster highlights; tree fully visible and not cropped. only trunk collider if specified Usage: Depth and foreground framing. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 192x256 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-06 Low hedge
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_06_low_hedge.png` | final 128x64 px | generator source 512x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Neatly clipped dark green hedgerow section, stylized chunky foliage and clear baseline. decoration; no hurtbox Usage: Campus lawn edging. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x64 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-07 Campus directional sign
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_07_campus_directional_sign.png` | final 96x128 px | generator source 384x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Dark blue upright metal collegiate directional sign with empty cream panels and gold trim; NO legible generated lettering. text rendered by DOM/Canvas Usage: Diegetic hint / wayfinding. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x128 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-08 Blue-gold pennant pole
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_08_blue_gold_pennant_pole.png` | final 64x192 px | generator source 256x768 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Single vertical short flagpole and triangular deep-blue pennant with warm gold inset edge, readable at small scale. nonblocking decoration Usage: Notre Dame visual signal. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x192 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-09 Parade utility cart
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_09_parade_utility_cart.png` | final 192x112 px | generator source 768x448 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Playful four-wheeled rolling service cart painted blue/gold; side profile; flat clearly walkable upper deck and exposed circular wheels. platform top x16..176 y22 Usage: Moving platform in quad climax. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 192x112 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-10 Fallen campus sign
Priority: P0 | category: PR | planned target: `assets/level1/props/pr_10_fallen_campus_sign.png` | final 128x64 px | generator source 512x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Toppled blue-and-gold event wayfinding sign, chunky wood/metal frame lying diagonally, clean silhouette. short obstacle AABB 90x25 Usage: First jump obstacle. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x64 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-11 Concession cooler
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_11_concession_cooler.png` | final 96x80 px | generator source 384x320 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Large green plastic insulated drink cooler with lid, wheels and dark handles, closed; no brand marks. static short block Usage: Cup-crawler arena decoration. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x80 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-12 Festival pennant string
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_12_festival_pennant_string.png` | final 256x64 px | generator source 1024x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Five blue/gold triangular pennants suspended along a gently sagging thin cord; ends terminate fully in image, no background. non-colliding overhead Usage: Overhead quad festival dressing. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 256x64 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-13 Stone planter
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_13_stone_planter.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Low square pale limestone planter with leafy green bushes; side-view; strong readable silhouette. short solid if needed Usage: Dome approach dressing. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### PR-14 Collapsible rope barrier
Priority: P1 | category: PR | planned target: `assets/level1/props/pr_14_collapsible_rope_barrier.png` | final 128x80 px | generator source 512x320 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Two short dark metal posts with a thick blue rope between, low and chunky enough to read from 960x540. no hurtbox unless explicitly placed Usage: Optional jump obstacle. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x80 px with bottom-center origin.

Collision authoring guidance: `specified per placement`. Zone: all.

### MC-01 Banner bridge retracted
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_01_banner_bridge_retracted.png` | final 256x64 px | generator source 1024x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Blue-and-gold cloth bridge tightly rolled up against two stone supports, clearly not walkable. Must correspond precisely in supports/scale to MC-02; no collider Usage: Pulse bridge OFF. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 256x64 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### MC-02 Banner bridge extended
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_02_banner_bridge_extended.png` | final 256x64 px | generator source 1024x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Same blue-and-gold fabric bridge stretched taut between two stone anchors, top edge horizontal at local y=18 and readable as safe walking surface. Walkable top target x16..240,y18, never drop occupied player Usage: Pulse bridge ON. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 256x64 px with bottom-center origin.

Collision authoring guidance: `collider_top=16,18,224,12`. Zone: all.

### MC-03 Gold lift tucked
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_03_gold_lift_tucked.png` | final 128x64 px | generator source 512x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Compact gold-trimmed stone popup platform visibly recessed and non-walkable; mechanical slots visible. Same housing size/registration as MC-04 Usage: Pulse platform OFF. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x64 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### MC-04 Gold lift raised
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_04_gold_lift_raised.png` | final 128x64 px | generator source 512x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Gold-trimmed pale stone platform protrudes outward; crisp bright top surface across 104px central width. Walkable top target x12..116,y12; raise only in safe state Usage: Pulse platform ON. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x64 px with bottom-center origin.

Collision authoring guidance: `collider_top=12,12,104,12`. Zone: all.

### MC-05 Drum Beacon quiet
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_05_drum_beacon_quiet.png` | final 96x128 px | generator source 384x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: A single standing parade bass drum on golden feet with dark blue rim and central cream drumhead; not anthropomorphic; rim ring remains unlit. Interact via Cinnamon tail-swish within 72 world px Usage: Manual pulse activation. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x128 px with bottom-center origin.

Collision authoring guidance: `hitbox=20,35,56,70`. Zone: all.

### MC-06 Drum Beacon active
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_06_drum_beacon_active.png` | final 96x128 px | generator source 384x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Exactly same parade bass drum pose, scale, rim, feet, angle and camera as MC-05, now ringed with restrained golden notes and radiant blue/gold accent. Keep center/feet fixed; can layer glow independently Usage: Manual pulse feedback. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x128 px with bottom-center origin.

Collision authoring guidance: `hitbox=20,35,56,70`. Zone: all.

### MC-07 Checkpoint unlit
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_07_checkpoint_unlit.png` | final 64x128 px | generator source 256x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Vertical navy and gold pennant mounted into short campus-stone base, folded flag, unlit. Vertical stable post no invented letters Usage: Respawn marker. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x128 px with bottom-center origin.

Collision authoring guidance: `hitbox=18,12,28,114`. Zone: all.

### MC-08 Checkpoint lit
Priority: P0 | category: MC | planned target: `assets/level1/mechanics/mc_08_checkpoint_lit.png` | final 64x128 px | generator source 256x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Exactly same pennant and post as MC-07, flag now unfurled and rim catching warm gold light, small safe glow. Maintain exact base/pivot and scale Usage: Checkpoint confirmed. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x128 px with bottom-center origin.

Collision authoring guidance: `hitbox=18,12,28,114`. Zone: all.

### MC-09 Final route flag
Priority: P1 | category: MC | planned target: `assets/level1/mechanics/mc_09_final_route_flag.png` | final 64x128 px | generator source 256x512 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Blue and gold pennant tied to a small portable signpost, direction indicated by simple arrow shape, no letters. Do not replace invisible cutscene trigger Usage: Optional exit marker. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x128 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### EN-01 Cup Crawler walk A
Priority: P0 | category: EN | planned target: `assets/level1/enemies/en_01_cup_crawler_walk_a.png` | final 64x64 px | generator source 256x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Funny low mechanical stacked-paper-cup robot on two short gears, cream cups, dark blue chassis and vivid orange warning eye; side-on facing right, feet grounded, no arms. Animation base state frame A; same silhouette and foot point as EN-02 Usage: Ground enemy patrol. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with bottom-center origin.

Collision authoring guidance: `hurtbox=13,25,38,30`. Zone: all.

### EN-02 Cup Crawler walk B
Priority: P1 | category: EN | planned target: `assets/level1/enemies/en_02_cup_crawler_walk_b.png` | final 64x64 px | generator source 256x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: EXACT SAME Cup Crawler as EN-01, wheel/gear motion alternate frame and minor squash only; same camera, size, palette, face and foot anchor. Use EN-01 source conditioning; no redesign Usage: Ground enemy patrol. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with bottom-center origin.

Collision authoring guidance: `hurtbox=13,25,38,30`. Zone: all.

### EN-03 Cup Crawler defeated
Priority: P1 | category: EN | planned target: `assets/level1/enemies/en_03_cup_crawler_defeated.png` | final 64x64 px | generator source 256x256 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: EXACT SAME Cup Crawler collapsed into harmless small tipped cup and sparks, wheels bent inward, unmistakable defeated state. One-shot reaction, transparent Usage: Enemy hit reaction. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### EN-04 Confetti cannon idle
Priority: P0 | category: EN | planned target: `assets/level1/enemies/en_04_confetti_cannon_idle.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Fictional blue-and-gold parade confetti machine: compact squat metal base, short upward-angled tube facing left; orange caution accent on muzzle. Match 05,06 exactly in base/aim/size Usage: Stationary ranged hazard. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `hurtbox=18,34,60,58`. Zone: all.

### EN-05 Confetti cannon warning
Priority: P0 | category: EN | planned target: `assets/level1/enemies/en_05_confetti_cannon_warning.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: SAME cannon unchanged except small red warning lamp illuminated and paper peeking from barrel before discharge. Warning at least 0.75 s via code; no strobes Usage: Hazard readable anticipation. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `hurtbox=18,34,60,58`. Zone: all.

### EN-06 Confetti cannon firing
Priority: P1 | category: EN | planned target: `assets/level1/enemies/en_06_confetti_cannon_firing.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: SAME cannon unchanged with short paper burst at muzzle, crisp paper clumps projecting left, no huge smoke cloud. Game separately spawns independent EN-07 projectile Usage: Hazard burst release. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `hurtbox=18,34,60,58`. Zone: all.

### EN-07 Hazardous paper burst
Priority: P0 | category: EN | planned target: `assets/level1/enemies/en_07_hazardous_paper_burst.png` | final 32x32 px | generator source 128x128 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Compact tightly packed pointed cluster of orange-red paper confetti with contrasting white highlight; clear danger cue, not resembling harmless celebratory confetti. Projectile physics authored in code, collider=22x22 Usage: Cannon projectile. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with bottom-center origin.

Collision authoring guidance: `projectile=5,5,22,22`. Zone: all.

### FX-01 Fox thief holding shake
Priority: P0 | category: FX | planned target: `assets/level1/fox/fx_01_fox_thief_holding_shake.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: CANDIDATE only: lean rust-red cartoon fox, pointed triangular ears, cream pointed muzzle, dark charcoal paws and slim pointed tail, one forepaw shaped to grip an independently composited separate shake cup but CUP ITSELF ABSENT; clearly NOT a red panda, no glasses/headband or human clothing. Do not promote as canonical Fox until user approval Usage: Theft scene / silhouette read. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### FX-02 Fox escape sprint
Priority: P0 | category: FX | planned target: `assets/level1/fox/fx_02_fox_escape_sprint.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: SAME provisional fox identity from FX-01 sprinting right with long swept tail; one hand curled around an EMPTY space reserved for the independent CO-03 cup overlay; NO cup painted into this Fox image; readable silhouette and stable foot line. Can mirror only if markings allow; do not create boss animations Usage: Scripted first and final escape. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### FX-03 Fox mocking taunt
Priority: P1 | category: FX | planned target: `assets/level1/fox/fx_03_fox_mocking_taunt.png` | final 96x96 px | generator source 384x384 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: SAME provisional fox facing player three-quarter, smug eyebrow and small beckoning pose, cup omitted because the CO-03 cup is a separate runtime overlay; readable from platformer camera. Use briefly 0.5 s in no-interaction cutscene Usage: Final scripted decoy reveal. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x96 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### FX-04 Cardboard fox decoy
Priority: P1 | category: FX | planned target: `assets/level1/fox/fx_04_cardboard_fox_decoy.png` | final 96x112 px | generator source 384x448 px | pivot bottom-center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Obviously flimsy illustrated fox cutout on tiny springboard pedestal, with cartoon tongue drawn on cardboard; NOT an actual extra animal. Can be omitted without affecting level completion Usage: Optional getaway joke. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 96x112 px with bottom-center origin.

Collision authoring guidance: `none`. Zone: all.

### CO-01 Green shake token
Priority: P0 | category: CO | planned target: `assets/level1/collectibles/co_01_green_shake_token.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Bright readable green circular arcade token featuring central white shamrock silhouette; gold thin rim and subtle dark green inner shadow; no letters or numbers. Collision pickup radius12, stationary centre pivot Usage: Optional ordinary pickup. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `pickup_radius=12`. Zone: all.

### CO-02 Gold shake token
Priority: P1 | category: CO | planned target: `assets/level1/collectibles/co_02_gold_shake_token.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Same design dimensions as CO-01 but gold fill and emerald shamrock emblem, obvious distinction from green token at 1x. Optional bonus, never exit requirement Usage: Optional high-skill bonus. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `pickup_radius=12`. Zone: all.

### CO-03 Shamrock Shake cup
Priority: P0 | category: CO | planned target: `assets/level1/collectibles/co_03_shamrock_shake_cup.png` | final 64x96 px | generator source 256x384 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Tall translucent clear soda cup filled with pale mint-green blended shake, whipped top, striped white-green straw, small single shamrock sticker, no commercial trademarks or type. Rendered exactly once as separate overlay aligned to Fox empty grasp; never duplicate a cup painted into FX sprites; never appears as recoverable level reward Usage: Stolen prize used as independent overlay. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x96 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### CO-04 Green shake drip
Priority: P0 | category: CO | planned target: `assets/level1/collectibles/co_04_green_shake_drip.png` | final 24x32 px | generator source 96x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Single vivid pale mint-green milkshake droplet with strong dark green border and one highlight, reads as edible liquid not poison. Scripted 3-5 placed near finale; no pickup collider Usage: Exit breadcrumb tease. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 24x32 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-01 GO pulse halo
Priority: P0 | category: VF | planned target: `assets/level1/effects/vf_01_go_pulse_halo.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Single concentric thick blue and gold cartoon ripple ring with clean negative center; transparent; no symbols or text. T=0.5s expand 0.4x to 2.2x, fade alpha1..0; procedural allowed Usage: Pulse affordance. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-02 IRISH pulse settle
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_02_irish_pulse_settle.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Same outline thickness as GO pulse but contracting dull gold rings with muted blue echo, transparent central opening. T=0.45s contract 1.4x to 0.5x Usage: Pulse reset affordance. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-03 Drum strike spark
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_03_drum_strike_spark.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Three pointed golden pixel-cluster impact arcs offset around an empty center, readable on navy drum; do not depict hand/player. T=0.2s one-shot Usage: Manual pulse hit feedback. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-04 Token collect gleam
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_04_token_collect_gleam.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Four pointed bright cream/gold pixel star sparkles around empty center, not a medal or item. T=0.24s one-shot Usage: Pickup confirmation. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-05 Enemy stomp puff
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_05_enemy_stomp_puff.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Compact crisp smoke paper-dust radial impact with light cream center and brown border fragments. T=0.18s one-shot Usage: Enemy hit confirmation. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-06 Safe ambient confetti
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_06_safe_ambient_confetti.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Soft blue/gold rectangular harmless falling paper confetti loosely spaced, no red warning shapes. T=0.75s, alpha behind actors Usage: Background celebration, never damage. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-07 Projectile hit burst
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_07_projectile_hit_burst.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Short spiky orange-red impact with white paper shards, tightly localized, very different from gold pickup sparkle. T=0.17s one-shot Usage: Dangerous projectile contact. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-08 Checkpoint gleam
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_08_checkpoint_gleam.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Gentle golden diamond ring and sparse tiny blue sparks around empty center, no words. T=0.4s one-shot Usage: Checkpoint acceptance. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-09 Fox exit poof
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_09_fox_exit_poof.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Fast swirling cream dust curling toward right, few mint green drops suggested, no actual Fox or cup rendered in effect. T=0.3s one-shot Usage: Getaway cutscene accent. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### VF-10 Landing dust
Priority: P1 | category: VF | planned target: `assets/level1/effects/vf_10_landing_dust.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Small low cream dust cloud with two rounded plumes along baseline, clean silhouette. T=0.22s one-shot Usage: General impact. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-01 Filled heart icon
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_01_filled_heart_icon.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Chunky deep red pixel-art heart with cream highlight, thick dark contour, no numbers. readable at 16 px Usage: HUD health. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-02 Empty heart icon
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_02_empty_heart_icon.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Exact filled-heart outline/position but dark empty center in muted stone tone; no cracks. paired with UI-01 Usage: HUD damage. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-03 Token HUD icon
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_03_token_hud_icon.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Exact miniature silhouette and color as CO-01 green shake token; draw crisp and simplified to read 16 px. no text drawn Usage: HUD pickup counter. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-04 Jump button glyph
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_04_jump_button_glyph.png` | final 48x48 px | generator source 192x192 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: High-contrast simple stylized up-arrow inside dark navy circular button, gold trim, no written label. touch area provided by CSS 64x64 min Usage: Touch/key tutorial. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 48x48 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-05 Tail-swish glyph
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_05_tail_swish_glyph.png` | final 48x48 px | generator source 192x192 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Stylized orange sweeping curved tail shape and directional arc, NOT a Cinnamon character render or severed tail; white/gold on navy button. touch area provided by CSS 64x64 min Usage: Touch/key tutorial. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 48x48 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-06 Move arrows glyph
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_06_move_arrows_glyph.png` | final 48x48 px | generator source 192x192 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Pair of opposite horizontal white arrows arranged symmetrically over navy circular backing, no alphabet letters. touch area provided by CSS 64x64 min Usage: Touch/key tutorial. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 48x48 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-07 Pulse icon
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_07_pulse_icon.png` | final 32x32 px | generator source 128x128 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Navy-and-gold parade drum icon with two short outward wave lines, match MC-05 shape but simplified, no words. overlay near interactable Usage: Gimmick tutorial/indication. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 32x32 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-08 Fox dialogue portrait
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_08_fox_dialogue_portrait.png` | final 128x128 px | generator source 512x512 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Close crop bust portrait of provisional rust-red pointed-ear fox from FX-01, mischievous grin; no cup, no extra characters, consistent eyes/muzzle. Do not canonize until approved Usage: Intro/ending dialogue vignette. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 128x128 px with center origin.

Collision authoring guidance: `none`. Zone: all.

### UI-09 Level clear medal
Priority: P1 | category: UI | planned target: `assets/level1/ui/ui_09_level_clear_medal.png` | final 64x64 px | generator source 256x256 px | pivot center | transparency true

**Generation prompt:** Side-view playable 2D game asset: Gold scalloped arcade medal with centered simple shamrock engraving, deep navy inset outline, no rank lettering. UI rank glyph added in code Usage: Completion reward. Asset must remain consistent with master PDF character artwork and shared Notre Dame blue/gold warm retro palette; isolated item unless background. No player sprite, no random characters, no typography, no collage or text, no watermark, no extra objects. Exact final target 64x64 px with center origin.

Collision authoring guidance: `none`. Zone: all.

## AUDIO PRODUCTION / PROCEDURAL FALLBACK

- **AU-01 Level loop** | music | 18-28 s seamless | Light brisk 130-145 BPM original collegiate-style march groove: kick/snare, pizzicato bass, playful brass-like synth motif; no copyrighted school melody or chants. Output OGG or WAV plus provenance; fallback procedural sequencer; loop seam tested.
- **AU-02 Fox theft cue** | sfx | 0.45-0.8 s | Comic ascending muted brass + sliding plucked bass, brisk and cheeky.
- **AU-03 Jump** | sfx | 0.08-0.15 s | Short springy pitched ascending pop, under 0.15 s.
- **AU-04 Double jump** | sfx | 0.13-0.23 s | Second ascending chime over springy transient; distinguish from single jump.
- **AU-05 Tail swish** | sfx | 0.10-0.20 s | Compact brush whoosh with a short low pop, avoid sharp loud noise.
- **AU-06 Pickup** | sfx | 0.10-0.22 s | Tiny two-tone sparkle, bright but not shrill.
- **AU-07 Checkpoint** | sfx | 0.25-0.55 s | Gentle resolved major triad arcade chime.
- **AU-08 GO pulse** | sfx | 0.28-0.55 s | Two percussive drum hits and short cheerful brass swell; a visual substitute exists.
- **AU-09 IRISH reset** | sfx | 0.18-0.36 s | Downward paired drum rim taps, softer than GO.
- **AU-10 Cannon tell** | sfx | 0.20-0.45 s | Two warning clicks with small rattling paper shuffle.
- **AU-11 Cannon fire** | sfx | 0.15-0.35 s | Soft party pop and fluttering paper whoosh; restrained loudness.
- **AU-12 Damage** | sfx | 0.12-0.27 s | Soft but clear dissonant bump; never piercing.
- **AU-13 Fox escapes** | sfx | 0.55-1.0 s | Comic descending trombone-like slide or pluck, no speech required.
- **AU-14 Level clear** | sfx | 1.8-3.2 s | Original triumphant brass/chiptune cadence with playful final wrong-note chuckle.

## SCENE ZONES / TIMING

- **INTRO 0-640** The Shake Snatch: Fox steals the cup at vendor; move right; one 80 px high sign obstacle; 3 safe tokens. Enemies: none. Mechanic: move + jump. Safety: none. Checkpoint: spawn x=96.
- **QUAD-A 640-1420** Open Lawn: Run over gentle lawn ramps, bench jump, low hedge, generous landing; first GO wave seen on inactive bridge safely. Enemies: none. Mechanic: read beat telegraph. Safety: no damage. Checkpoint: none.
- **QUAD-B 1420-2260** Banner Crossing: First bridge at x1700 activates on pulse. Safe lower detour remains; upper route gives 4 bonus tokens. Enemies: 1 Cup Crawler at x2060. Mechanic: cross automatic bridge. Safety: soft pit resets to x1570. Checkpoint: x2240.
- **QUAD-C 2260-3090** Concession Trouble: Walk under banners; swish or stomp Cup Crawler, dodge obvious cannon fire; ground route stays available. Enemies: Cup Crawler x2460, Cannon x2880. Mechanic: tail swish and enemy tell. Safety: damage not death; recovery ledge. Checkpoint: previous.
- **QUAD-D 3090-4090** Drum Beacon Yard: First manual Drum Beacon at x3250 opens raised gold ledges; no hard locked gate; top route more fun, bottom route safe. Enemies: Cup Crawler x3800. Mechanic: swish beacon + platform. Safety: short recoverable falls. Checkpoint: x3120 optional in assist.
- **QUAD-E 4090-5180** Pep Rally Sprint: Parade utility cart travels 410 px on safe track; two timed gold lifts and cannon warning; optional upper token line. Fox visible in far distance. Enemies: Cannon x4530, Cup Crawler x4840. Mechanic: combine pulse + jump + moving cart. Safety: 2-step hazard sequence not bullet hell. Checkpoint: x4950.
- **DOME 5180-6210** Golden Dome Scramble: Golden Dome hero background enters; 3 tier step climb using one beacon and two familiar gold lifts; one clear high vantage payoff. Enemies: no new enemy classes; optional Cup Crawler x5520. Mechanic: master prior skills only. Safety: short slip resets to x5200. Checkpoint: x5210.
- **FINALE 6210-6620** The Fox Gets Away: Player nears thief; final cup and Fox in foreground; taunt, poof, green drips lead offscreen; LEVEL CLEAR; no boss. Enemies: none. Mechanic: scripted end trigger x6460. Safety: none. Checkpoint: none.

**Done means verified assets integrated and browser playable; a prompt output or nice illustration alone is not completion.**
