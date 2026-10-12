import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLevel,pulseState,WORLD} from '../src/game/world.mjs';
import {newGame,startGame,update,DT,CHEER_COOLDOWN,movingPosition} from '../src/game/engine.mjs';

test('substantial new optional routes coexist with the intact 23-step Dome and Fox endpoint',()=>{
 const level=buildLevel();
 const names=level.platforms.map(p=>p.id);
 const branches=names.filter(id=>id.startsWith('rally-'));
 assert.equal(branches.length,25);
 assert.equal(level.rallyPosts.length,4);
 assert.equal(level.shakes.filter(q=>q.locked).length,4);
 assert.equal(level.shakes.filter(q=>q.id.startsWith('rally-shake-')).length,4);
 assert.ok(level.platforms.some(p=>p.id==='dome-step-23'));
 assert.ok(level.platforms.some(p=>p.id==='summit-arena'));
 assert.ok(level.checkpoints[5].id==='Summit Gate');
 assert.equal(WORLD.width,8350);
 assert.equal(new Set(names).size,names.length);
 assert.equal(new Set(level.shakes.map(q=>q.id)).size,level.shakes.length);
 assert.equal(new Set(level.rallyPosts.map(p=>p.reward)).size,4);
 assert.ok(level.platforms.filter(p=>branches.includes(p.id)&&p.pulse).length>=6);
});
test('cheer physically activates a resting chant, plays once, and observes cooldown',()=>{
 const s=newGame();startGame(s);
 s.elapsed=4;s.time=4;s.activePulse=false;
 const held={cheerPressed:true};
 update(s,held,DT);
 assert.equal(s.activePulse,true);assert.ok(s.pulseOverride>2);
 assert.ok(s.cheerWave>.5);
 assert.ok(s.cheerCooldown>CHEER_COOLDOWN-.1);
 assert.ok(s.events.some(e=>e.type==='cheer'));
 const count=s.events.filter(e=>e.type==='cheer').length;
 update(s,held,DT);
 assert.equal(s.events.filter(e=>e.type==='cheer').length,count);
 assert.equal(s.rallyCount,0);
 for(let i=0;i<150;i++)update(s,{},DT);
 assert.ok(s.cheerCooldown>0);
 assert.ok(s.pulseOverride===0);
});
test('relay demands nearby player-cheer; rewards cannot be taken while locked',()=>{
 const s=newGame();startGame(s);
 const post=s.level.rallyPosts[0],prize=s.level.shakes.find(q=>q.id===post.reward);
 assert.equal(prize.locked,true);
 s.player.x=prize.x-s.player.w/2;s.player.y=prize.y-s.player.h/2;
 update(s,{},DT);
 assert.equal(prize.taken,false);
 s.player.x=post.x-s.player.w/2;s.player.y=post.footY-s.player.h;
 update(s,{cheerPressed:true},DT);
 assert.equal(post.lit,true);assert.equal(prize.locked,false);
 assert.equal(s.rallyCount,1);
 assert.ok(s.events.some(e=>e.type==='rally'&&e.detail===post.id));
 update(s,{cheerPressed:true},DT);
 assert.equal(s.rallyCount,1);
 assert.equal(s.level.rallyPosts.filter(p=>p.lit).length,1);
});
test('cheer dampens nearby enemy and cannon, not remote threats or boss health',()=>{
 const s=newGame();startGame(s);
 const enemy=s.level.enemies.find(e=>e.id==='cup-rally');
 const gun=s.level.hazards.find(h=>h.id==='confetti-rally');
 s.player.x=enemy.x-15;s.player.y=enemy.y-5;
 const previousBossHP=s.boss.hp;
 update(s,{cheerPressed:true},DT);
 assert.ok(enemy.stunnedUntil>s.elapsed);
 assert.equal(s.boss.hp,previousBossHP);
 assert.ok(!s.level.enemies.find(e=>e.id==='cup-gallery').stunnedUntil);
 const t=s.elapsed;
 update(s,{},DT);
 assert.equal(enemy.x,enemy.baseX,'Stunned robot stops moving until effect expires');
 assert.equal(s.player.hp,3,'Stunned robot does not deal contact damage');
 s.cheerCooldown=0;s.player.x=gun.x;s.player.y=gun.y-10;
 update(s,{cheerPressed:true},DT);
 assert.ok(gun.quietUntil>s.elapsed);
 assert.ok(t<s.elapsed);
});
test('natural chant boundary is described by the same phase used for actual collision',()=>{
 assert.equal(pulseState(2.8).active,true);
 assert.equal(pulseState(3.0).active,false);
 assert.ok(pulseState(2.8).remaining<.11);
 assert.ok(pulseState(3.0).remaining>2.5);
 assert.equal(pulseState(3.0,1.5).active,true);
 assert.ok(pulseState(3.0,1.5).remaining>=1.5);
});
function jumpTo(s,target,frame){
 const p=s.player,targetX=target.x+Math.min(target.w*.6,110);
 const dx=targetX-p.x;
 const jumpPressed=frame===0||(frame===26&&p.jumpsUsed===1&&Math.abs(dx)>78);
 return {right:dx>13,left:dx< -13,jumpHeld:frame<70,jumpPressed};
}
test('each of 25 optional platform steps is actually jump-reachable, never teleported',()=>{
 const level=buildLevel();
 const groups=[
  ['quad-training-1',...Array.from({length:14},(_,i)=>'rally-quad-'+String(i+1).padStart(2,'0'))],
  ['dome-step-11',...Array.from({length:5},(_,i)=>'rally-gallery-'+String(i+1).padStart(2,'0'))],
  ['dome-step-17',...Array.from({length:6},(_,i)=>'rally-cornice-'+String(i+1).padStart(2,'0'))]
 ];
 for(const names of groups)for(let i=1;i<names.length;i++){
  const from=level.platforms.find(p=>p.id===names[i-1]);
  const to=level.platforms.find(p=>p.id===names[i]);
  assert.ok(from&&to,names[i-1]+' -> '+names[i]);
  const s=newGame({assist:true});startGame(s);
  s.level.enemies=[];s.level.hazards=[];
  // A later, higher optional ledge may be reached before the immediately
  // preceding one. Isolate this directed pair to measure true jump reach.
  s.level.platforms=s.level.platforms.filter(p=>!p.id.startsWith('rally-')||
   p.id===from.id||p.id===to.id);
  s.pulseOverride=1000;
  Object.assign(s.player,{
   x:from.x+from.w*.56,y:movingPosition(from,0).y-60,
   vy:0,vx:0,grounded:true,onPlatform:from.id,
   invulnerable:100,jumpsUsed:0
  });
  let landed=false;
  for(let frame=0;frame<180;frame++){
   update(s,jumpTo(s,to,frame),DT);
   if(frame>3&&s.player.onPlatform===to.id){landed=true;break;}
  }
  assert.ok(landed,from.id+' -> '+to.id+' must be playable with real jump/double jump');
 }
});
