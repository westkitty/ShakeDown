import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {TITLE_SCENES,titleScenePath,RESULT_SCENES} from '../src/game/screen-art.mjs';
import {previewEntries} from '../src/game/curated-assets.mjs';

function dimensions(file){
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file+' PNG signature');
 assert.equal(bytes.subarray(12,16).toString(),'IHDR',file+' PNG header');
 return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
}
test('all ten independent raster presentations have both verified on-disk sizes',()=>{
 assert.equal(TITLE_SCENES.length,10);
 assert.equal(new Set(TITLE_SCENES.map(x=>x.slug)).size,10);
 for(let i=0;i<TITLE_SCENES.length;i++){
  const canvas=titleScenePath(i);
  assert.deepEqual(dimensions(canvas),[960,540],canvas);
  const master='assets/title/title_'+TITLE_SCENES[i].slug+'.png';
  assert.deepEqual(dimensions(master),[1920,1080],master);
 }
 assert.deepEqual(RESULT_SCENES,{dead:3,victory:4});
 assert.throws(()=>titleScenePath(10),RangeError);
 assert.throws(()=>titleScenePath(-1),RangeError);
 assert.equal(fs.existsSync('assets/title-screens'),false,'Do not ship obsolete SVG-only title branch');
});
test('28 physically declared, eligible previews map to actual game draw calls',()=>{
 const curator=JSON.parse(fs.readFileSync('assets/production/curation.json','utf8'));
 const source=JSON.parse(fs.readFileSync('assets/production/manifest.json','utf8'));
 const actual=previewEntries(curator,source);
 assert.equal(actual.length,28);
 const render=fs.readFileSync('src/game/render.mjs','utf8');
 for(const [id] of actual)assert.ok(render.includes("'"+id+"'"),id+' must be used in the live Canvas renderer');
 const main=fs.readFileSync('src/main.mjs','utf8');
 assert.ok(main.includes("get('art')!=='classic'"),'Curated images on by default with explicit classic escape');
 assert.ok(main.includes('initScreenArt()'));
 const scene=fs.readFileSync('src/game/screen-art.mjs','utf8');
 assert.ok(scene.includes("get('art')==='classic'"),'Classic mode must not fetch title artwork');
});
