# Complete birthday asset-generation contract

Editable source: `ShakeDown_Complete_LM_Arena_Master.md` (fully standalone prompts).

Delivery: `ShakeDown_Complete_LM_Arena_Master.pdf` (273-page PDF with two embedded source visual references).

Machine contract: `ShakeDown_Complete_Asset_Contract.json` (220 visual IDs and 21 audio briefs, status truth).

Rebuild (offline documentation tooling, not production game dependencies):

```bash
python3 -m pip install --user reportlab pillow
python3 scripts/build_complete_asset_packet.py
npm run validate
```

The compiler reads the 73 approved legacy Level 1 requests, 26 source-derived Cinnamon frames physically committed to the repository, and the updated Golden Dome/Fox/birthday design. It does not generate final external game artwork. Fox design is pending visual approval; procedural runtime illustration is provisional. All 194 missing final visual assets remain specifications until LM Arena or another actual artist produces, inspects, normalizes and integrates them.

The PDF and Markdown must not be manually edited independently; update the code's locked source/asset manifest, rerun the compiler, inspect rendered pages and commit the resulting files together.
