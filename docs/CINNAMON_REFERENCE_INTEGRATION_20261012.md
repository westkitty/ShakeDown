# Cinnamon Fuzzbutt — user-supplied sprite source integration (2026-10-12)

The user supplied three images in-chat. Sources are not generative replacements.

| Supplied image | SHA-256 | Repo role |
| --- | --- | --- |
| Transparent 1448x1086 gameplay action sheet | `124481c14c7c02843c7d1c813a32ff5f5e503ba726782e462598e80bc0ea41f2` | Exact existing `assets/references/cinnamon_actions_sheet.png`, source of the 26 reproducible gameplay frame cutouts |
| First 1536x1152 master turnaround/expressions | `9a781c6febf032b6000274c312718cb1e6533aec5500da384d2dda9c81262a4d` | Exact existing `assets/references/cinnamon_master_sheet.png` |
| Second 1229x1536 master turnaround/expressions | `11616d7a7cabb3d394c789beda4c209150b844dc9030d1ce2f5514b8c97b5000` | Newly added as `assets/references/cinnamon_master_alt_20261012.png` |

All three source bytes are preserved at their native sizes, with no subjective recoloring or generated substitutes. Player renders continue using sprites cut deterministically from the original transparent sheet, preserving original tail, glasses, headband and clothing. The 26 existing cutouts are not replaced merely to change filenames. The existing source-derived shake-drinking pose is now selected during actual shake pickup; the user-reviewed master sheets remain fidelity references rather than incorrectly displayed whole-sheet images.

The preexisting `run_03` is physically clipped in the action sheet: its run pose touches the source rectangle edge and cannot be reliably reconstructed by cropping more of the same packed source without overlapping adjacent art. It remains physically archived and intentionally omitted from runtime instead of being falsely declared repaired. `?art=classic` and fallback rendering are retained. The previous 29-asset prehandoff ZIP is still not present as an exact original package; the supplied three files are independent, verified source authority.

Tests must check source SHA-256 identities, PNG dimensions, all existing generated sprite hashes, actual renderer use of shake_00 when a pickup is active, and real-browser player state before closing this change.
