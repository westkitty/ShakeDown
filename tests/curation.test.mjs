import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {previewEntries} from '../src/game/curated-assets.mjs';
const source=JSON.parse(fs.readFileSync('assets/production/manifest.json','utf8'));
const curation=JSON.parse(fs.readFileSync('assets/production/curation.json','utf8'));
const contract=JSON.parse(fs.readFileSync('docs/assets/ShakeDown_Complete_Asset_Contract.json','utf8'));
const original=JSON.parse(fs.readFileSync('assets/runtime/manifest.json','utf8'));
const hash=data=>createHash('sha256').update(data).digest('hex');

test('Arena consolidation records all actual 194 files without pretending source review is final',()=>{
 assert.equal(curation.generatedCount,194);assert.equal(source.count,194);
 assert.equal(Object.keys(source.assets).length,194);assert.equal(Object.keys(curation.entries).length,194);
 assert.equal(curation.knownOriginalSourceCount,26);assert.equal(curation.audioStillMissing,21);
 assert.deepEqual(curation.summary,{preview:28,alternate:131,revise:11,blocked:24});
 assert.equal(Object.keys(original.assets).length,0,'Provisional Arena files cannot auto-activate the accepted-art manifest');
 for(const [id,entry] of Object.entries(curation.entries)){
  const src=source.assets[id];assert.ok(src,id);
  assert.equal(entry.sha256,src.sha256,id);assert.equal(entry.sourcePath,src.path,id);
  assert.equal(entry.finalHumanApproval,false,id);
  assert.equal(src.review_status,'AWAITING_HUMAN_VISUAL_REVIEW',id);
 }
});
test('all 194 art source bytes and dimensions match their immutable SHA-256 contracts',()=>{
 const rows=new Map(contract.assets.map(x=>[x.id,x]));
 const hashes=new Set(),blocking=[];
 for(const [id,entry] of Object.entries(source.assets)){
  assert.ok(rows.has(id),'Unexpected art ID '+id);
  const bytes=fs.readFileSync(entry.path),decoded=PNG.sync.read(bytes,{checkCRC:true});
  assert.equal(hash(bytes),entry.sha256,'Byte-level tampering '+id);
  assert.deepEqual([decoded.width,decoded.height],entry.actual_px);
  assert.deepEqual(entry.actual_px,rows.get(id).target_px);
  assert.ok(!hashes.has(entry.sha256),'Duplicate exact image under more than one ID '+id);
  hashes.add(entry.sha256);
  if(curation.entries[id].verdict==='blocked')blocking.push(id);
 }
 assert.equal(blocking.length,24);
});
test('the 28 curator recommendations are preview-only and never bypass source acceptance gates',()=>{
 const list=previewEntries(curation,source),ids=new Set(list.map(([id])=>id));
 assert.equal(ids.size,28);
 for(const id of ['FOX-02','FOX-05','FOX-09','CO-03','BD-01','BG-01','CIN-N04','CIN-N06'])
  assert.ok(ids.has(id),id+' should be opt-in preview');
 for(const id of ['FX-01','PK-03','TL-01','BG-04','UX-01','PR-01'])
  assert.ok(!ids.has(id),id+' should not be previewed');
 for(const [id,entry] of Object.entries(curation.entries))
  if(entry.verdict==='blocked')assert.ok(!ids.has(id),'Blocked source cannot be previewed '+id);
 const altered=structuredClone(curation);altered.entries['FOX-05'].sha256='0'.repeat(64);
 assert.ok(!previewEntries(altered,source).some(([id])=>id==='FOX-05'),'SHA drift must disable preview');
 const falselyApproved=structuredClone(source);falselyApproved.assets['FOX-05'].review_status='reviewer-attested';
 assert.ok(!previewEntries(curation,falselyApproved).some(([id])=>id==='FOX-05'),'Source status must be strictly checked');
 const invented=structuredClone(curation);invented.entries['FOX-05'].sourcePath='../secrets.png';
 assert.ok(!previewEntries(invented,source).some(([id])=>id==='FOX-05'),'Traversal must never be served');
});
