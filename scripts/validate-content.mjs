import {readFileSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {createHash} from 'node:crypto';
const plan=readFileSync('docs/IMPLEMENTATION_PLAN.md','utf8');
const status=readFileSync('docs/PROJECT_STATUS.md','utf8');
const handoff=readFileSync('docs/ASSET_HANDOFF.md','utf8');
for(const term of ['Golden Dome','Fox','Shamrock Shake','Birthday'])assert.ok(plan.toLowerCase().includes(term.toLowerCase()),`Missing revised contract ${term}`);
assert.ok(handoff.includes('NOT cat'),'Missing identity lock');
assert.ok(status.includes('implemented'),'Status does not reflect actual implementation');
for(const f of ['index.html','src/main.mjs','src/game/engine.mjs','src/game/world.mjs','src/game/render.mjs','assets/references/cinnamon_actions_sheet.png'])assert.ok(existsSync(f),`Missing runtime file ${f}`);
const sprites=JSON.parse(readFileSync('assets/sprites/cinnamon/frames.json','utf8'));
assert.equal(Object.keys(sprites.frames).length,26,'Sprite manifest must list exactly 26 physically created cut-outs');
for(const [id,frame] of Object.entries(sprites.frames)){
 assert.ok(existsSync(frame.file),`Missing real sprite ${id}`);const bytes=readFileSync(frame.file);
 assert.ok(bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),`Bad PNG ${id}`);
 assert.equal(bytes.readUInt32BE(16),240,`Width mismatch ${id}`);assert.equal(bytes.readUInt32BE(20),160,`Height mismatch ${id}`);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),frame.sha256,`Changed sprite bytes ${id}`);
}
console.log('ShakeDown contract + 26 verified sprites: PASS');
// The comprehensive LM Arena contract is real project documentation, not fake art.
const spec=JSON.parse(readFileSync('docs/assets/ShakeDown_Complete_Asset_Contract.json','utf8'));
const rows=spec.assets;
assert.equal(rows.length,220,'Unexpected comprehensive visual-contract coverage count');
assert.equal(new Set(rows.map(x=>x.id)).size,rows.length,'Duplicate logical asset IDs');
assert.equal(new Set(rows.map(x=>x.path)).size,rows.length,'Duplicate intended output paths');
const GENERATED=['NORMALIZED_VERIFIED','INTEGRATED_BROWSER_CHECKED','APPROVED'];
const generatedRows=rows.filter(x=>GENERATED.includes(x.status));
const sourceRows=rows.filter(x=>x.status==='VERIFIED_IN_REPO_LOCAL_BROWSER');
assert.equal(sourceRows.length,26,'Source-derived Cinnamon frame count changed');
const manifest=JSON.parse(readFileSync('assets/production/manifest.json','utf8')).assets;
for(const r of generatedRows)assert.ok(manifest[r.id],'Generated asset missing from manifest '+r.id);
for(const [id,rec] of Object.entries(manifest))assert.ok(rows.some(x=>x.id===id),'Manifest holds unknown asset '+id);
// Candidates that have real bytes but are deliberately withheld from promotion
// (Fox identity pending human signoff) must be declared as such.
const withheld=rows.filter(x=>manifest[x.id]&&!GENERATED.includes(x.status));
for(const r of withheld)assert.equal(r.status,'PROVISIONAL_MISSING_APPROVAL','Asset with bytes must be promoted or explicitly withheld '+r.id);
const approved=rows.filter(x=>x.status==='APPROVED');
for(const r of approved)assert.ok(manifest[r.id],'Approved asset without measured bytes '+r.id);
for(const x of rows){
 assert.ok(x.prompt.includes(x.id) && x.prompt.includes(x.path),'Incomplete self-contained asset prompt '+x.id);
 assert.ok(x.acceptance&&x.rejection&&x.integration&&x.references.length>=1,'Missing production QA contract '+x.id);
 assert.ok(Array.isArray(x.target_px)&&x.target_px.every(n=>Number.isInteger(n)&&n>0),'Invalid target pixel dimensions '+x.id);
 if(x.status.startsWith('VERIFIED'))assert.ok(existsSync(x.path),'Existing output path missing '+x.id);
 else if(GENERATED.includes(x.status)){
  assert.ok(existsSync(x.path),'Promoted asset has no file on disk '+x.id);
  const rec=manifest[x.id];
  assert.equal(createHash('sha256').update(readFileSync(x.path)).digest('hex'),rec.sha256,'Promoted asset bytes drifted from manifest '+x.id);
  assert.deepEqual(rec.actual_px,x.target_px,'Promoted asset size differs from contract target '+x.id);
  if(x.transparent)assert.equal(rec.alpha.mode,'straight RGBA','Transparent asset lacks real alpha '+x.id);
 }
 else if(manifest[x.id]){
  // Withheld candidate: bytes exist and are measured, but identity approval is
  // still open, so it must not be reported as generated-verified.
  assert.equal(x.status,'PROVISIONAL_MISSING_APPROVAL','Asset with bytes must be promoted or explicitly withheld '+x.id);
  assert.ok(existsSync(x.path),'Withheld candidate has no file '+x.id);
  assert.equal(createHash('sha256').update(readFileSync(x.path)).digest('hex'),manifest[x.id].sha256,'Withheld candidate bytes drifted '+x.id);
 }
 else assert.ok(!existsSync(x.path),'Generation-only asset unexpectedly present without manifest promotion '+x.id);
}
assert.equal(spec.audio.length,21,'Missing original audio contracts');
const md=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.md','utf8');
for(const x of rows)assert.ok(md.includes('#### '+x.id+' — '+x.name),'Editable master missing prompt '+x.id);
const pdf=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf');
assert.equal(pdf.subarray(0,5).toString('ascii'),'%PDF-','Master PDF missing PDF signature');
assert.ok(pdf.length>500000,'Master PDF suspiciously small; embedded references missing?');
console.log('220 asset prompts + 21 audio contracts + PDF/Markdown/source checks: PASS');

