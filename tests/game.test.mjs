import test from 'node:test';import assert from 'node:assert/strict';
import {buildLevel,pulseActive,WORLD,DOME_ARENA_Y} from '../src/game/world.mjs';
import {newGame,startGame,update,resetToCheckpoint,pauseGame,DT,snapshot} from '../src/game/engine.mjs';
function ticks(s,n,input={}){for(let i=0;i<n;i++)update(s,typeof input==='function'?input(i):input,DT)}
test('Dome occupies at least half of the authored route',()=>{assert.ok(WORLD.domeEnd-WORLD.campusEnd>=WORLD.campusEnd,'Dome should be >=50% route')});
test('level has platforms, distinct threats, beacons, secrets, and checkpoints',()=>{
 const l=buildLevel();assert.ok(l.platforms.length>25);assert.ok(l.checkpoints.length>=5);assert.ok(l.shakes.length>=32);
 assert.ok(l.enemies.length>=4);assert.ok(l.hazards.length>=2);assert.ok(l.beacons.length>=3);
 assert.equal(new Set(l.platforms.map(p=>p.id)).size,l.platforms.length);
});
test('spawn remains on solid ground while idle',()=>{let s=newGame();startGame(s);ticks(s,200);assert.equal(s.player.grounded,true);assert.ok(Math.abs(s.player.y-382)<1);assert.equal(s.player.hp,3)});
test('ground jump and double jump work; held input creates no extra jumps',()=>{let s=newGame();startGame(s);ticks(s,3);update(s,{jumpPressed:true,jumpHeld:true},DT);assert.equal(s.player.jumpsUsed,1);const y=s.player.y;
 ticks(s,8,{jumpHeld:true});assert.ok(s.player.y<y);update(s,{jumpPressed:true,jumpHeld:true},DT);assert.equal(s.player.jumpsUsed,2);ticks(s,10,{jumpHeld:true});assert.equal(s.player.jumpsUsed,2)});
test('pulse cycle and manual beacon affect traversal',()=>{assert.equal(pulseActive(1,0),true);assert.equal(pulseActive(4,0),false);assert.equal(pulseActive(4,2),true);
 let s=newGame();startGame(s);s.player.x=1840;s.player.y=382;s.player.facing=1;update(s,{swishPressed:true},DT);
 assert.ok(s.pulseOverride>2);assert.equal(s.activePulse,true)});
test('collectibles are physically picked up, not fabricated counts',()=>{let s=newGame();startGame(s);let q=s.level.shakes.find(x=>x.id==='quad-shake-1');s.player.x=q.x-s.player.w/2;s.player.y=q.y-s.player.h/2;
 update(s,{},DT);assert.equal(s.shakeCount,1);assert.ok(q.taken);update(s,{},DT);assert.equal(s.shakeCount,1)});
test('checkpoint recovery preserves collection and respawns safely',()=>{let s=newGame();startGame(s);s.checkpoint=2;s.shakeCount=8;s.player.x=8000;s.player.y=900;resetToCheckpoint(s);
 assert.equal(s.mode,'playing');assert.equal(s.shakeCount,8);assert.equal(s.player.hp,3);assert.ok(s.player.invulnerable>0);assert.equal(s.player.x,s.level.checkpoints[2].x+8)});
test('pause freezes authoritative time',()=>{let s=newGame();startGame(s);ticks(s,12);let t=s.time;pauseGame(s);ticks(s,12);assert.equal(s.time,t);pauseGame(s);ticks(s,1);assert.ok(s.time>t)});
test('Fox has telegraphed charge and a real three-hit victory',()=>{let s=newGame();startGame(s);s.player.x=7441;s.player.y=DOME_ARENA_Y-60;update(s,{},DT);assert.equal(s.boss.triggered,true);assert.equal(s.boss.mode,'tell');
 for(let i=0;i<3;i++){
  s.boss.mode='rest';s.boss.timer=99;s.boss.hurtTime=0;s.player.x=s.boss.x-65;s.player.y=s.boss.y+18;s.player.facing=1;s.player.attackCooldown=0;
  update(s,{swishPressed:true},DT);assert.equal(s.boss.hp,2-i);
 }
 assert.equal(s.mode,'victory');assert.equal(s.birthdayReady,true);assert.ok(s.events.some(e=>e.type==='victory'));
});
test('unique viewport and camera never expose NaN',()=>{let s=newGame();startGame(s);ticks(s,300,i=>({right:true,jumpPressed:i%65===0,jumpHeld:i%65<13}));let q=snapshot(s);
 for(let v of [q.player.x,q.player.y,q.camera.x,q.camera.y])assert.ok(Number.isFinite(v));});
