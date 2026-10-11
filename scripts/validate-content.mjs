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
assert.equal(rows.filter(x=>x.status.startsWith('VERIFIED')).length,26,'Planned files misrepresented as generated');
const runtime=JSON.parse(readFileSync('assets/runtime/manifest.json','utf8'));
assert.equal(runtime.schemaVersion,1,'Runtime asset manifest incompatible');
for(const x of rows){
 assert.ok(x.prompt.includes(x.id) && x.prompt.includes(x.path),'Incomplete self-contained asset prompt '+x.id);
 assert.ok(x.acceptance&&x.rejection&&x.integration&&x.references.length>=1,'Missing production QA contract '+x.id);
 assert.ok(Array.isArray(x.target_px)&&x.target_px.every(n=>Number.isInteger(n)&&n>0),'Invalid target pixel dimensions '+x.id);
 if(x.status.startsWith('VERIFIED'))assert.ok(existsSync(x.path),'Existing output path missing '+x.id);
 else if(runtime.assets?.[x.id]){
  assert.equal(runtime.assets[x.id].path,x.path,'Approved runtime path deviates from master contract '+x.id);
  assert.ok(existsSync(x.path),'Approved production image missing '+x.id);
 }else assert.ok(!existsSync(x.path),'Unapproved generation asset unexpectedly present '+x.id);
}
assert.equal(spec.audio.length,21,'Missing original audio contracts');
const md=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.md','utf8');
for(const x of rows)assert.ok(md.includes('#### '+x.id+' — '+x.name),'Editable master missing prompt '+x.id);
const pdf=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf');
assert.equal(pdf.subarray(0,5).toString('ascii'),'%PDF-','Master PDF missing PDF signature');
assert.ok(pdf.length>500000,'Master PDF suspiciously small; embedded references missing?');
console.log('220 asset prompts + 21 audio contracts + PDF/Markdown/source checks: PASS');

