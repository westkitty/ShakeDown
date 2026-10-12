import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {WORLD_SCENE_IDS,worldSceneEntries} from '../src/game/curated-assets.mjs';

const manifest=JSON.parse(fs.readFileSync('assets/production/manifest.json','utf8'));
const review=JSON.parse(fs.readFileSync('assets/production/curation.json','utf8'));

test('additional scene art has 35 verified source PNGs and no blocked/revise candidate',()=>{
 const rows=worldSceneEntries(review,manifest);
 const ids=rows.map(([id])=>id);
 assert.equal(WORLD_SCENE_IDS.length,35);
 assert.deepEqual(ids,WORLD_SCENE_IDS);
 assert.equal(new Set(ids).size,35);
 for(const [id,asset] of rows){
  assert.equal(review.entries[id].verdict,'alternate');
  assert.equal(review.entries[id].finalHumanApproval,false);
  assert.deepEqual(review.entries[id].structuralIssues,[]);
  assert.equal(asset.review_status,'AWAITING_HUMAN_VISUAL_REVIEW');
  const data=fs.readFileSync(asset.path);
  const sha=createHash('sha256').update(data).digest('hex');
  assert.equal(sha,asset.sha256,id);
  const png=PNG.sync.read(data,{checkCRC:true});
  assert.deepEqual([png.width,png.height],asset.actual_px,id);
 }
 for(const [id,entry] of Object.entries(review.entries))
  if(entry.verdict==='blocked'||entry.verdict==='revise')
   assert.ok(!ids.includes(id),'Unsafe art cannot enter game: '+id);
});
test('altered provenance, sizes or status remove scene entries rather than promoting them',()=>{
 const changed=structuredClone(review);
 changed.entries['DM-BG01'].verdict='blocked';
 assert.ok(!worldSceneEntries(changed,manifest).some(([id])=>id==='DM-BG01'));
 changed.entries['DM-BG01'].verdict='alternate';
 changed.entries['DM-BG01'].sourcePath='../wrong.png';
 assert.ok(!worldSceneEntries(changed,manifest).some(([id])=>id==='DM-BG01'));
 const fake=structuredClone(manifest);
 fake.assets['DM-PR04'].sha256='0'.repeat(64);
 assert.ok(!worldSceneEntries(review,fake).some(([id])=>id==='DM-PR04'));
 fake.assets['DM-PR04'].sha256=manifest.assets['DM-PR04'].sha256;
 fake.assets['DM-PR04'].actual_px=[-1,192];
 assert.ok(!worldSceneEntries(review,fake).some(([id])=>id==='DM-PR04'));
});
