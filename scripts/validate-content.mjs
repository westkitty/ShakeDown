// Unified source / generated-candidate / owner-activated gates.
// A generated file or Arena commit is not itself visual approval.
import {readFileSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {createHash} from 'node:crypto';
const sha256=b=>createHash('sha256').update(b).digest('hex');
const plan=readFileSync('docs/IMPLEMENTATION_PLAN.md','utf8');
const status=readFileSync('docs/PROJECT_STATUS.md','utf8');
const handoff=readFileSync('docs/ASSET_HANDOFF.md','utf8');
for(const term of ['Golden Dome','Fox','Shamrock Shake','Birthday'])
 assert.ok(plan.toLowerCase().includes(term.toLowerCase()),'Missing revised contract '+term);
assert.ok(handoff.includes('NOT cat'),'Missing identity lock');
assert.ok(status.includes('implemented'),'Status does not reflect actual implementation');
for(const f of ['index.html','src/main.mjs','src/game/engine.mjs','src/game/world.mjs','src/game/render.mjs','assets/references/cinnamon_actions_sheet.png'])
 assert.ok(existsSync(f),'Missing runtime file '+f);
const sprites=JSON.parse(readFileSync('assets/sprites/cinnamon/frames.json','utf8'));
assert.equal(Object.keys(sprites.frames).length,26,'Source cut-out count changed');
for(const [id,frame] of Object.entries(sprites.frames)){
 assert.ok(existsSync(frame.file),'Missing original sprite '+id);
 const bytes=readFileSync(frame.file);
 assert.ok(bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),'Bad PNG '+id);
 assert.equal(bytes.readUInt32BE(16),240,'Source sprite width '+id);
 assert.equal(bytes.readUInt32BE(20),160,'Source sprite height '+id);
 assert.equal(sha256(bytes),frame.sha256,'Canonical Cinnamon source changed '+id);
}
console.log('26 original canonical Cinnamon cut-outs: PASS');
const spec=JSON.parse(readFileSync('docs/assets/ShakeDown_Complete_Asset_Contract.json','utf8'));
const rows=spec.assets,original=rows.filter(r=>r.status==='VERIFIED_IN_REPO_LOCAL_BROWSER');
assert.equal(rows.length,220,'Unexpected master contract visual count');
assert.equal(original.length,26,'Original source count changed');
assert.equal(new Set(rows.map(r=>r.id)).size,220,'Duplicate logical art ID');
assert.equal(new Set(rows.map(r=>r.path)).size,220,'Duplicate master output path');
assert.equal(spec.audio.length,21,'21 audio requests changed');
const external=JSON.parse(readFileSync('assets/production/manifest.json','utf8'));
assert.equal(external.count,194,'Arena claimed output count changed');
const art=external.assets;
assert.equal(Object.keys(art).length,194,'Physical candidate registry incomplete');
const runtime=JSON.parse(readFileSync('assets/runtime/manifest.json','utf8'));
assert.equal(runtime.schemaVersion,1,'Accepted-art registry incompatible');
for(const row of rows){
 assert.ok(row.prompt.includes(row.id)&&row.prompt.includes(row.path),'Prompt missing ID/path '+row.id);
 assert.ok(row.acceptance&&row.rejection&&row.integration&&row.references.length>=1,'QA contract incomplete '+row.id);
 assert.ok(Array.isArray(row.target_px)&&row.target_px.every(n=>Number.isInteger(n)&&n>0),'Invalid contract size '+row.id);
 if(row.status==='VERIFIED_IN_REPO_LOCAL_BROWSER'){
  assert.ok(existsSync(row.path),'Source missing '+row.id);
  continue;
 }
 const rec=art[row.id];
 assert.ok(rec,'No physical candidate manifest entry '+row.id);
 assert.equal(rec.id,row.id,'Candidate identity drift');
 assert.equal(rec.path,row.path,'Candidate path drift '+row.id);
 assert.deepEqual(rec.actual_px,row.target_px,'Candidate target dimensions drift '+row.id);
 assert.equal(rec.review_status,'AWAITING_HUMAN_VISUAL_REVIEW','Candidate source silently promoted '+row.id);
 const data=readFileSync(rec.path);
 assert.equal(sha256(data),rec.sha256,'Source candidate checksum drift '+row.id);
 assert.ok(data.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),'Invalid candidate PNG '+row.id);
 assert.equal(data.readUInt32BE(16),row.target_px[0],'Candidate actual width '+row.id);
 assert.equal(data.readUInt32BE(20),row.target_px[1],'Candidate actual height '+row.id);
}
for(const id of Object.keys(art))assert.ok(rows.some(r=>r.id===id),'Unknown Arena candidate '+id);
for(const [id,record] of Object.entries(runtime.assets)){
 const match=rows.find(r=>r.id===id);
 assert.ok(match,'Unknown final production art in accepted registry '+id);
 assert.equal(record.path,match.path,'Final accepted asset path mismatch '+id);
 assert.equal(record.reviewStatus,'reviewer-attested','Final art lacks human source attestation '+id);
}
const md=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.md','utf8');
for(const row of rows)assert.ok(md.includes('#### '+row.id+' — '+row.name),'Editable generator master incomplete '+row.id);
const pdf=readFileSync('docs/assets/ShakeDown_Complete_LM_Arena_Master.pdf');
assert.equal(pdf.subarray(0,5).toString('ascii'),'%PDF-','Generator master PDF broken');
assert.ok(pdf.length>500000,'Generator master PDF suspiciously small');
console.log('220 visual specs / 194 unapproved physical candidates / 21 audio specs / source SHA: PASS');
