import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {TITLE_SCENES,titleScenePath,RESULT_SCENES,resultScenePath} from '../src/game/screen-art.mjs';
import {previewEntries} from '../src/game/curated-assets.mjs';

function dimensions(file){
 const bytes=fs.readFileSync(file);
 assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file+' PNG signature');
 assert.equal(bytes.subarray(12,16).toString(),'IHDR',file+' PNG header');
 return [bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
}
test('all eleven title plates have real 960x540 files and raster-only masters',()=>{
 assert.equal(TITLE_SCENES.length,11);
 assert.equal(new Set(TITLE_SCENES.map(x=>x.slug)).size,11);
 assert.equal(titleScenePath(0),'assets/screens/01_start_level_clean_960x540.png');
 for(let i=0;i<TITLE_SCENES.length;i++){
  const canvas=titleScenePath(i);
  assert.deepEqual(dimensions(canvas),[960,540],canvas);
  if(i===0)continue;
  const master='assets/title/title_'+TITLE_SCENES[i].slug+'.png';
  assert.deepEqual(dimensions(master),[1920,1080],master);
 }
 assert.deepEqual(RESULT_SCENES,{
  dead:'assets/screens/02_game_over_continue_clean_960x540.png',
  victory:'assets/screens/03_victory_credits_clean_960x540.png'
 });
 for(const mode of Object.keys(RESULT_SCENES)){
  assert.deepEqual(dimensions(resultScenePath(mode)),[960,540]);
 }
 assert.throws(()=>titleScenePath(11),RangeError);
 assert.throws(()=>titleScenePath(-1),RangeError);
 assert.throws(()=>resultScenePath('pause'),RangeError);
 assert.equal(fs.existsSync('assets/title-screens'),false,'Do not ship obsolete SVG-only title branch');
});
test('all twelve owner-supplied PNG files are byte-for-byte equal to the ZIP source',()=>{
 const hashes={
  "01_start_level_960x540.png": "e75560a0872150eee1fce3f7c830b408e75be8045a5e92af81cf777204f98e40",
  "01_start_level_1920x1080.png": "de21763da040859aad9704f46aff50e8c91b7e0168ded7ca6470448c2719ed46",
  "01_start_level_clean_960x540.png": "77b8e93cc64c05e61d4ed9facdfd9854a8696c6626198170912dd0dca66ea689",
  "01_start_level_clean_1920x1080.png": "02bcf2dd1538d5f1606b755061f7e7055220083ab8f3217c6898d7bd1df827ef",
  "02_game_over_continue_960x540.png": "a967656d23212609f966d9540005d3cee00f849d33910af627e6e498a4b7054a",
  "02_game_over_continue_1920x1080.png": "cc93038fa2070021fc37d7ae9223e24f83d2415354d8ccdfe34a670cc8590790",
  "02_game_over_continue_clean_960x540.png": "08dac550ae3b0408dcbb929e6b58ac53e940eb09c54ca7dcf550dbf211bd08ac",
  "02_game_over_continue_clean_1920x1080.png": "f1cad84b0a26a13d7d505554b1345835e156ccc46670322d1613734ed06fbd1d",
  "03_victory_credits_960x540.png": "23bdeed90a99bc5e8fb11e369f053ce94461ac0447f4676a0786bd6aad61f8b6",
  "03_victory_credits_1920x1080.png": "e4e8893f8e99411d4005800d6a7deea7bf918f6b6f4a761b2eab15a6f713e86e",
  "03_victory_credits_clean_960x540.png": "11f4b72772cac8149d7e44e1a332901b2e1a559dee976277a11f77474b1c4b36",
  "03_victory_credits_clean_1920x1080.png": "7ae1538eff5f1d17e0cd7aef67ef164f6742daa70eb54765559b5a29ae33363f"
};
 assert.equal(Object.keys(hashes).length,12);
 for(const [name,expected] of Object.entries(hashes)){
  const path='assets/screens/'+name;
  const bytes=fs.readFileSync(path);
  assert.deepEqual(dimensions(path),name.includes('1920x1080')?[1920,1080]:[960,540]);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),expected,name);
 }
 const actual=fs.readdirSync('assets/screens').filter(x=>x.endsWith('.png'));
 assert.deepEqual(actual.sort(),Object.keys(hashes).sort(),'No missing or extra user-supplied screens');
 const source=fs.readFileSync('scripts/reconstruct_uploaded_screens.py','utf8');
 assert.ok(source.includes('2634be093b2a42249233962324047d68b80f81e2bb16fda1d5152d62bf7dfc64'));
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
