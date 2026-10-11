import test from 'node:test';
import assert from 'node:assert/strict';
import {PNG} from 'pngjs';
import {examinePng,examineAudio,safeRepoPath} from '../scripts/asset-intake.mjs';
import {frameForState,RUN_FRAMES} from '../src/game/animation.mjs';
import {imageEntries,loadApprovedArt} from '../src/game/production-assets.mjs';
function fixture({opaque=false,width=32,height=32,edge=false}={}){
 const png=new PNG({width,height,fill:false});
 for(let i=0;i<png.data.length;i+=4){png.data[i]=0;png.data[i+1]=0;png.data[i+2]=0;png.data[i+3]=opaque?255:0;}
 for(let y=edge?0:6;y<height-6;y++)for(let x=edge?0:6;x<width-6;x++){
  const i=(y*width+x)*4;png.data[i]=222;png.data[i+1]=106;png.data[i+2]=38;png.data[i+3]=255;
 }
 return PNG.sync.write(png);
}
test('generated sprite accepts correctly sized real RGBA and reports bounds',()=>{
 const r=examinePng(fixture(),{target_px:[32,32],transparent:true});
 assert.deepEqual(r.issues,[]);assert.deepEqual(r.bounds,[6,6,26,26]);assert.ok(r.clearPixels>0);
});
test('asset intake rejects mismatched geometry, absent alpha, invalid PNG and unexpectedly transparent backgrounds',()=>{
 assert.match(examinePng(fixture({width:30}),{target_px:[32,32],transparent:true}).issues.join(' '),/Wrong dimensions/);
 assert.match(examinePng(fixture({opaque:true}),{target_px:[32,32],transparent:true}).issues.join(' '),/transparent pixels/i);
 assert.match(examinePng(fixture(),{target_px:[32,32],transparent:false}).issues.join(' '),/Opaque asset/);
 assert.match(examinePng(Buffer.from('not-png'),{target_px:[32,32],transparent:true}).issues.join(' '),/PNG decode failed/);
 assert.match(examinePng(fixture({edge:true}),{target_px:[32,32],transparent:true}).warnings.join(' '),/touch source edge/);
});
test('asset manifest blocks unknown approved IDs and path traversal',()=>{
 const good={path:'assets/production/fox/fox_05.png',width:240,height:240,
  reviewStatus:'reviewer-attested',integrationStatus:'verified'};
 const ledger={schemaVersion:1,assets:{'FOX-05':good,'OTHER-01':good,'BG-01':{...good,path:'assets/../secret.png'}}};
 assert.deepEqual(imageEntries(ledger).map(([id])=>id),['FOX-05']);
 assert.deepEqual(imageEntries({schemaVersion:1,assets:{'FOX-05':{...good,integrationStatus:'unverified'}}}),[]);
 assert.deepEqual(imageEntries({schemaVersion:1,assets:{'FOX-05':{...good,integrationStatus:'unverified'}}},
  {previewUnverifiedId:'FOX-05'}).map(([id])=>id),['FOX-05']);
 assert.throws(()=>safeRepoPath('../outside.png'),/leaves project/);
});
test('runtime image loader gives explicit fallback when a reviewed image cannot load',async()=>{
 class BrokenImage{set src(_) {this.onerror()}};
 const approved={schemaVersion:1,assets:{'FOX-05':{path:'assets/production/fox/fox_05.png',
  width:240,height:240,reviewStatus:'reviewer-attested',integrationStatus:'verified'}}};
 const response=await loadApprovedArt({request:async()=>({ok:true,json:async()=>approved}),ImageCtor:BrokenImage});
 assert.deepEqual(Object.keys(response.images),[]);assert.deepEqual(response.errors,['FOX-05']);
});
test('clipped run_03 remains physically archived but is never selected by gameplay animation',()=>{
 assert.ok(!RUN_FRAMES.includes('run_03'));
 const selected=new Set(Array.from({length:1000},(_,i)=>frameForState('run',i/60)));
 assert.ok(selected.size>=4);assert.ok(!selected.has('run_03'));
 assert.equal(frameForState('idle',0),'idle_00');
 assert.equal(frameForState('victory',0),'victory_00');
});
test('malformed audio is rejected before human review',()=>{
 assert.match(examineAudio(Buffer.from('fake'),'.wav').issues.join(' '),/short|Invalid/);
 assert.match(examineAudio(Buffer.alloc(50),'.mp3').issues.join(' '),/Expected/);
});
