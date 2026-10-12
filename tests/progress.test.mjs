import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,DT,update} from '../src/game/engine.mjs';
import {checkpointRecord,validCheckpointRecord,restoreCheckpoint} from '../src/game/progress.mjs';

test('checkpoint records are absent at spawn and use authored IDs once reached',()=>{
 const s=newGame({assist:true});
 assert.equal(checkpointRecord(s),null);
 s.checkpoint=2;s.elapsed=22.35781;
 s.level.shakes.find(q=>q.id==='quad-shake-1').taken=true;
 s.level.shakes.find(q=>q.id==='quad-shake-6').taken=true;
 s.level.enemies.find(e=>e.id==='cup-lawn').alive=false;
 const record=checkpointRecord(s);
 assert.deepEqual(record,{schema:1,index:2,checkpointId:'Dome Approach',
  elapsed:22.358,collected:['quad-shake-1','quad-shake-6'],defeated:['cup-lawn'],rallies:[]});
 assert.equal(validCheckpointRecord(record,s.level),true);
});

test('safe checkpoint resume re-derives scores and restores only actual level assets',()=>{
 const s=newGame();
 s.checkpoint=4;s.elapsed=88.45;
 s.level.shakes.find(q=>q.id==='quad-shake-6').taken=true;
 s.level.shakes.find(q=>q.id==='dome-shake-7').taken=true;
 s.level.enemies.find(e=>e.id==='cup-lawn').alive=false;
 const progress=checkpointRecord(s);
 const resumed=newGame({assist:false,mute:true});
 assert.equal(restoreCheckpoint(resumed,progress),true);
 assert.equal(resumed.mode,'playing');
 assert.equal(resumed.checkpoint,4);
 assert.equal(resumed.player.x,resumed.level.checkpoints[4].x+8);
 assert.equal(resumed.player.hp,3);
 assert.equal(resumed.shakeCount,2);
 assert.equal(resumed.secretCount,2);
 assert.equal(resumed.level.enemies.find(e=>e.id==='cup-lawn').alive,false);
 assert.equal(resumed.level.shakes.find(q=>q.id==='quad-shake-1').taken,false);
 assert.equal(resumed.boss.triggered,false);
 assert.equal(resumed.settings.mute,true);
 assert.ok(resumed.camera.x>0&&resumed.camera.y<0,'Camera should start near recovered player');
 const before=resumed.elapsed;
 update(resumed,{},DT);
 assert.ok(resumed.elapsed>before,'Restored game still advances normally');
});

test('invalid or obsolete records never mutate the game',()=>{
 const s=newGame(),valid={schema:1,index:3,checkpointId:'Bell Gallery',
  elapsed:31.2,collected:['quad-shake-1'],defeated:['cup-lawn']};
 const broken=[
  null,{...valid,schema:9},{...valid,index:-1},{...valid,index:100},
  {...valid,checkpointId:'Another level'},
  {...valid,elapsed:Infinity},{...valid,elapsed:-30},
  {...valid,collected:['quad-shake-1','quad-shake-1']},
  {...valid,collected:['missing-shake']},{...valid,defeated:['not-real']},
  {...valid,collected:'not-an-array'},{...valid,defeated:null},
  {...valid,rallies:['unknown-bell']},{...valid,rallies:['canopy-bell','canopy-bell']},
  {...valid,rallies:'not-an-array'}
 ];
 for(const bad of broken){
  const next=newGame();
  assert.equal(validCheckpointRecord(bad,next.level),false,JSON.stringify(bad));
  assert.equal(restoreCheckpoint(next,bad),false);
  assert.equal(next.mode,'title');
  assert.equal(next.player.x,70);
  assert.equal(next.shakeCount,0);
 }
 assert.equal(validCheckpointRecord(valid,s.level),true);
});

test('all five authored checkpoint positions resume to stable traversable geometry',()=>{
 for(let index=1;index<=5;index++){
  const source=newGame({assist:false});source.checkpoint=index;source.elapsed=12.7;
  const record=checkpointRecord(source);
  const resumed=newGame({assist:false});
  assert.equal(restoreCheckpoint(resumed,record),true,record.checkpointId);
  for(let frame=0;frame<55;frame++)update(resumed,{},DT);
  assert.equal(resumed.mode,'playing',record.checkpointId);
  assert.equal(resumed.player.grounded,true,record.checkpointId+' should have supporting platform geometry');
  assert.ok(resumed.player.hp>0,record.checkpointId+' should start safely');
  assert.equal(resumed.checkpoint,index,record.checkpointId);
 }
});


test('old schema-1 checkpoint saves without relays remain valid',()=>{
 const s=newGame();
 const legacy={schema:1,index:2,checkpointId:'Dome Approach',elapsed:14.3,
  collected:['quad-shake-1'],defeated:[]};
 assert.equal(validCheckpointRecord(legacy,s.level),true);
 assert.equal(restoreCheckpoint(s,legacy),true);
 assert.equal(s.rallyCount,0);
 assert.ok(s.level.rallyPosts.every(post=>!post.lit));
 assert.ok(s.level.shakes.filter(shake=>shake.locked).length===4);
});
test('cheer rally reward and activation survive checkpoint resume',()=>{
 const s=newGame();s.mode='playing';
 const post=s.level.rallyPosts[0];s.player.x=post.x-s.player.w/2;
 s.player.y=post.footY-s.player.h;s.player.grounded=true;
 update(s,{cheerPressed:true},DT);
 assert.equal(s.rallyCount,1);assert.equal(post.lit,true);
 assert.equal(s.level.shakes.find(q=>q.id===post.reward).locked,false);
 s.checkpoint=2;s.elapsed=18.6;
 const save=checkpointRecord(s);
 assert.deepEqual(save.rallies,[post.id]);
 const restored=newGame();assert.equal(restoreCheckpoint(restored,save),true);
 assert.equal(restored.rallyCount,1);
 assert.equal(restored.level.rallyPosts[0].lit,true);
 assert.equal(restored.level.shakes.find(q=>q.id===post.reward).locked,false);
 assert.ok(restored.level.rallyPosts.slice(1).every(p=>!p.lit));
});
