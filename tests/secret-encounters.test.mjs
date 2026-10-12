import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {buildLevel,DOME_ARENA_Y} from '../src/game/world.mjs';
import {newGame,startGame,update,DT,resetToCheckpoint} from '../src/game/engine.mjs';
import {validCheckpointRecord,checkpointRecord,restoreCheckpoint} from '../src/game/progress.mjs';
import {npcFrameEntries} from '../src/game/secret-assets.mjs';
import {secretNpcFrame} from '../src/game/secret-actors.mjs';

const level=buildLevel();
const byId=id=>{
 const platform=level.platforms.find(p=>p.id===id);
 assert.ok(platform,'Missing '+id);return platform;
};
const smudge=[
 'quad-vendor',...Array.from({length:3},(_,i)=>'secret-smudge-0'+(i+1)),
 'secret-smudge-sign','secret-smudge-alcove',
 ...Array.from({length:3},(_,i)=>'secret-smudge-return-0'+(i+1)),
 'quad-festival'
];
const dexter=[
 'dome-step-21',...Array.from({length:10},(_,i)=>'secret-dexter-'+String(i+1).padStart(2,'0')),
 'secret-dexter-summit'
];

test('both secret paths and the original critical path coexist with unique IDs',()=>{
 const ids=level.platforms.map(p=>p.id);
 assert.equal(new Set(ids).size,ids.length);
 assert.equal(level.platforms.filter(p=>p.id.startsWith('dome-step-')).length,23);
 assert.equal(byId('secret-dexter-summit').y,-2185);
 assert.equal(byId('secret-smudge-alcove').y,705);
 assert.ok(705-(-2185)>2800);
 assert.equal(byId('secret-smudge-alcove').x,1365);
 assert.equal(byId('secret-dexter-summit').x,4750);
 assert.deepEqual(level.secretNpcs.map(n=>n.id),['smudge','dexter']);
 for(const id of [...smudge,...dexter])byId(id);
 for(const n of [4,8])byId('secret-dexter-safety-'+String(n).padStart(2,'0'));
 assert.equal(DOME_ARENA_Y,-1174);
});

function traverseSegment(fromId,toId){
 const a=byId(fromId),b=byId(toId),s=newGame({assist:true});startGame(s);
 s.level.enemies=[];s.level.hazards=[];
 const crossingRestingBanner=fromId==='quad-vendor'||toId==='quad-vendor'||
  (fromId==='quad-festival'&&toId==='secret-smudge-return-03');
 s.pulseOverride=crossingRestingBanner?0:1000;
 if(crossingRestingBanner)s.elapsed=3.1;
 const dir=Math.sign(b.x+b.w/2-(a.x+a.w/2));
 const x=fromId==='quad-vendor'?a.x+a.w-72:fromId==='quad-festival'&&dir<0?a.x+60:fromId==='secret-smudge-alcove'&&dir>0?a.x+a.w-130:dir>0?a.x+a.w*.56:a.x+a.w*.32;
 Object.assign(s.player,{x,y:a.y-s.player.h,vx:0,vy:0,
   grounded:true,jumpsUsed:0,onPlatform:a.id,invulnerable:100,facing:dir||1});
 let touched=false,trace=[];
 for(let i=0;i<200;i++){
  const center=s.player.x+s.player.w/2;
  const target=fromId==='secret-dexter-01'&&toId==='dome-step-21'?b.x+b.w*.88:b.x+b.w/2;
  const delta=target-center;
  const movingRight=delta>12,movingLeft=delta< -12;
  const uphill=b.y<a.y-2;
  const jumpPressed=uphill&&(i===0||(a.y-b.y>97&&i===23&&s.player.jumpsUsed===1&&s.player.onPlatform!==b.id));
  update(s,{right:movingRight,left:movingLeft,jumpHeld:i<85,jumpPressed},DT);
  if(i%12===0)trace.push([i,Math.round(s.player.x),Math.round(s.player.y),s.player.onPlatform,s.player.jumpsUsed]);
  if(i>3&&(s.player.onPlatform===b.id||
   (fromId==='secret-dexter-01'&&toId==='dome-step-21'&&s.player.onPlatform==='dome-step-22'))){touched=true;break}
  if(s.player.x<0||s.player.x>8350||s.mode!=='playing')break;
 }
 if(!touched&&process.env.SHAKEDOWN_TRACE==='1')console.log('TRACE',fromId,toId,JSON.stringify(trace));
 return touched;
}

test('Smudge route is reachable both outward and on return',()=>{
 for(let i=0;i<smudge.length-1;i++){
  assert.ok(traverseSegment(smudge[i],smudge[i+1]),smudge[i]+' -> '+smudge[i+1]);
 }
 for(let i=smudge.length-1;i>0;i--){
  assert.ok(traverseSegment(smudge[i],smudge[i-1]),smudge[i]+' -> '+smudge[i-1]);
 }
});

test('Dexter summit detour is traversable in both directions',()=>{
 for(let i=0;i<dexter.length-1;i++)
  assert.ok(traverseSegment(dexter[i],dexter[i+1]),dexter[i]+' -> '+dexter[i+1]);
 for(let i=dexter.length-1;i>0;i--)
  assert.ok(traverseSegment(dexter[i],dexter[i-1]),dexter[i]+' -> '+dexter[i-1]);
});

test('NPC discoveries are approach gated, idempotent, and emit named events',()=>{
 const s=newGame();startGame(s);
 assert.deepEqual(s.achievements,[]);
 const sm=level.secretNpcs[0],dex=level.secretNpcs[1];
 s.player.x=sm.x-s.player.w/2;s.player.y=sm.footY-s.player.h;
 for(let i=0;i<5;i++)update(s,{},DT);
 assert.deepEqual(s.achievements,['smudge']);
 assert.equal(s.events.filter(e=>e.type==='discovery').length,1);
 assert.equal(s.discoveryToast.title,sm.title);
 assert.equal(s.status,sm.dialogue);
 s.player.x=dex.x-s.player.w/2;s.player.y=dex.footY-s.player.h;
 update(s,{},DT);
 assert.deepEqual(s.achievements,['smudge','dexter']);
 assert.equal(s.events.filter(e=>e.type==='discovery').length,2);
 const before=s.events.filter(e=>e.type==='discovery').length;
 resetToCheckpoint(s);
 s.player.x=dex.x-s.player.w/2;s.player.y=dex.footY-s.player.h;
 update(s,{},DT);
 assert.equal(s.events.filter(e=>e.type==='discovery').length,before);
});

test('a failed animation frame falls back within the same NPC without inventing art',()=>{
 const smudge={approved:'smudge-00'};
 const art={'NPC-smudge-idle_00':smudge.approved,'NPC-dexter-idle_00':'dexter-00'};
 assert.equal(secretNpcFrame(art,'smudge',1),smudge.approved);
 assert.equal(secretNpcFrame(art,'smudge','03'),smudge.approved);
 assert.equal(secretNpcFrame({},'smudge',0),null);
});

test('schema-1 saves extend to discoveries without invalidating old records',()=>{
 const s=newGame();startGame(s);
 const sm=level.secretNpcs[0];
 s.player.x=sm.x-s.player.w/2;s.player.y=sm.footY-s.player.h;
 update(s,{},DT);
 const record=checkpointRecord(s);
 assert.ok(record&&record.index===0,'first discovery saves even before first checkpoint');
 assert.deepEqual(record.discoveries,['smudge']);
 assert.equal(validCheckpointRecord(record,s.level),true);
 const resumed=newGame();
 assert.equal(restoreCheckpoint(resumed,record),true);
 assert.deepEqual(resumed.achievements,['smudge']);
 assert.equal(resumed.discoveryToast,null);
 assert.equal(validCheckpointRecord({...record,discoveries:['nonexistent']},resumed.level),false);
 assert.equal(validCheckpointRecord({...record,discoveries:['smudge','smudge']},resumed.level),false);
 assert.equal(validCheckpointRecord({...record,discoveries:[]},resumed.level),false);
 const old={schema:1,index:2,checkpointId:'Dome Approach',elapsed:14.3,
   collected:['quad-shake-1'],defeated:[],rallies:[]};
 assert.equal(validCheckpointRecord(old,resumed.level),true);
});

test('low alcove does not fire a false pit reset; summit camera targets the crest',()=>{
 const s=newGame();startGame(s);
 const sm=level.secretNpcs[0];
 s.player.x=sm.x-s.player.w/2;s.player.y=sm.footY-s.player.h;
 for(let i=0;i<45;i++)update(s,{},DT);
 assert.equal(s.mode,'playing');assert.ok(s.player.y>580);
 assert.ok(s.camera.y>0,'camera tracks alcove below the main route');
 const dex=level.secretNpcs[1],summit=byId('secret-dexter-summit');
 Object.assign(s.player,{x:dex.x-s.player.w/2,y:summit.y-s.player.h,
  vx:0,vy:0,grounded:true,onPlatform:summit.id,invulnerable:100});
 for(let i=0;i<100;i++)update(s,{},DT);
 assert.ok(s.camera.y<-1900,'camera sees isolated summit');
 assert.ok(s.camera.y>=-2450&&s.camera.y<=520);
});

test('generated sprite manifests match real RGBA frames and source sheets',()=>{
 for(const npc of ['smudge','dexter']){
  const m=JSON.parse(fs.readFileSync(`assets/sprites/${npc}/frames.json`,'utf8'));
  const entries=npcFrameEntries(m,npc);
  assert.equal(entries.length,4);
  const sheet=fs.readFileSync(m.source.path);
  assert.equal(createHash('sha256').update(sheet).digest('hex'),m.source.sha256);
  for(const [key,item] of entries){
   assert.ok(key.includes(npc));
   const b=fs.readFileSync(item.file);
   assert.equal(createHash('sha256').update(b).digest('hex'),item.sha256);
   assert.equal(b.readUInt32BE(16),280);
   assert.equal(b.readUInt32BE(20),200);
   assert.equal(b[25],6,'RGBA color type');
  }
 }
});

test('expanded camera preserves zero vertical offset on the original campus path',()=>{
 const s=newGame();startGame(s);
 for(let i=0;i<90;i++)update(s,{},DT);
 assert.equal(s.player.y,382);
 assert.equal(s.camera.y,0,'ordinary campus HUD/cup alignment must not drift');
});
