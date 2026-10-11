# Historical asset batches

> **HISTORICAL / SUPERSEDED:** This file describes the earlier four-world/Level-1 production concept. It is retained for provenance only. The current Golden Dome single-adventure birthday game is governed by docs/IMPLEMENTATION_PLAN.md, docs/PRODUCTION_READINESS.md, and docs/assets/ShakeDown_Complete_Asset_Contract.json. The master has 220 image IDs and 21 audio contracts; 26 source Cinnamon cut-outs exist, while remaining generated assets await inspection and approval.

# Asset batches — pre-handoff order

These are production requests; none are yet generated or approved.

| Batch | Output | Approval gate |
|---|---|---|
| A0 | Cinnamon master sprite, front/profile/3-4 consistency | species, glasses, headband, clothing, striped tail |
| A1 | Cinnamon idle / locomotion / jump animation source frames | foot position and scale invariance; test 64px preview |
| A2 | Cinnamon dash / swish / hurt / victory / expressions | pose readability, individual alpha frames |
| F0 | Fox approved turnaround and silhouette | user approval of existing Fox canon |
| F1 | Fox attacks, tells, hit, defeat frames | enemy clearly not Cinnamon; readable attack tells |
| E1 | Notre Dame Golden Dome scenery, layered background, platforms, campus props | legibility behind collisions |
| E2 | St Joseph River environment, water, moving platforms and springs | distinct silhouette palette |
| E3 | Eddy Street night skyline, storefronts, roofs, switches | mobile foreground clarity |
| E4 | Fox shake factory, contraptions, boss arena, finale | telegraphs separable from scenery |
| O1 | Shake icons, token pickups, collectibles, FX atlases | consistent icon sizes and alphas |
| U1 | title, cards, HUD, touch buttons, victory graphics | minimum touch sizes; high contrast |
| S1 | music loops and SFX | licensing, loop integrity and muted fallback |

Start with A0, then prepare one small animated slice from A1 before mass-producing the remaining assets. Source images stay separate; the assembler is responsible for mechanical atlas packing.
