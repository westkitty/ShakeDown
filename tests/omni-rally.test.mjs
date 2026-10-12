import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLevel,DOME_ARENA_Y} from '../src/game/world.mjs';
import {newGame,startGame,update,DT,CHEER_COOLDOWN} from '../src/game/engine.mjs';
import {rallyGuidance} from '../src/game/rally-guidance.mjs';

test('Four authentic optional rally signs and bell names are uniquely authored, without changing collision',()=>{
 const level=buildLevel();
 assert.equal(level.rallySigns.length,4);
 assert.equal(new Set(level.rallySigns.map(s=>s.id)).size,4);
 assert.equal(new Set(level.rallyPosts.map(s=>s.label)).size,4);
 assert.ok(level.rallySigns.every(s=>Number.isFinite(s.x)&&Number.isFinite(s.footY)&&s.label&&s.detail));
 assert.equal(level.platforms.filter(p=>p.id.startsWith('rally-')).length,25);
 assert.equal(level.checkpoints.length,6);
});

test('rally directions teach at spawn, distinguish approach, readiness, cooldown, then completion',()=>{
 const s=newGame();startGame(s);
 assert.equal(rallyGuidance(s).kind,'intro');
 const bell=s.level.rallyPosts[0];
 Object.assign(s.player,{x:bell.x-300,y:bell.footY-60});
 assert.equal(rallyGuidance(s).kind,'trail');
 assert.match(rallyGuidance(s).text,/CANOPY BELL/);
 Object.assign(s.player,{x:bell.x-s.player.w/2,y:bell.footY-s.player.h});
 assert.equal(rallyGuidance(s).kind,'ready');
 assert.match(rallyGuidance(s).text,/C \/ CHEER NOW/);
 s.cheerCooldown=2.4;
 assert.equal(rallyGuidance(s).kind,'cooling');
 assert.match(rallyGuidance(s).text,/3s/);
 for(const post of s.level.rallyPosts)post.lit=true;
 s.rallyCount=s.level.rallyPosts.length;
 assert.equal(rallyGuidance(s).kind,'complete');
});

test('Cheer can distract nearby recovering Fox but cannot damage him, chain stun, or skip tail swishes',()=>{
 const s=newGame();startGame(s);
 const b=s.boss;
 b.triggered=true;b.mode='rest';b.timer=1.2;
 Object.assign(s.player,{x:b.x-69,y:b.y+18,vx:0,vy:0,grounded:true,onPlatform:'summit-arena',facing:1});
 const initialHP=b.hp;
 update(s,{cheerPressed:true},DT);
 assert.equal(b.hp,initialHP);
 assert.equal(b.mode,'rest');
 assert.ok(b.timer>1.6&&b.timer<1.8,b.timer);
 assert.ok(s.cheerCooldown>CHEER_COOLDOWN-.1);
 assert.equal(s.events.filter(e=>e.type==='bossCheer').length,1);
 assert.match(s.status,/SWISH/);
 const timer=b.timer;
 update(s,{cheerPressed:true},DT);
 assert.ok(b.timer<timer,'Repetition during cooldown cannot prolong stun');
 assert.equal(s.events.filter(e=>e.type==='bossCheer').length,1);
 update(s,{swishPressed:true},DT);
 assert.equal(b.hp,initialHP-1,'Real swish in recovery is still required to damage the Fox');
 assert.equal(b.mode,'hit');
});

test('Boss windup is immune to cheer interruption and three swishes remain necessary',()=>{
 const s=newGame();startGame(s);
 s.player.x=7441;s.player.y=DOME_ARENA_Y-60;
 update(s,{},DT);
 const b=s.boss;assert.equal(b.mode,'tell');
 const hp=b.hp,oldTimer=b.timer;
 update(s,{cheerPressed:true},DT);
 assert.equal(b.mode,'tell');assert.equal(b.hp,hp);
 assert.ok(b.timer<oldTimer);
 assert.equal(s.events.filter(e=>e.type==='bossCheer').length,0);
 assert.equal(rallyGuidance(s).kind,'boss');
 assert.match(rallyGuidance(s).text,/DODGE/);
});
