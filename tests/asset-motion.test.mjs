import test from 'node:test';
import assert from 'node:assert/strict';
import {crawlerFrame,visibleDefeatAge,DEFEAT_POSE_SECONDS} from '../src/game/asset-motion.mjs';
import {newGame,startGame,update,DT} from '../src/game/engine.mjs';

test('Cup Crawler uses both physical walk frames; reduced motion and stun freeze pose',()=>{
 const e={x:1000,baseX:1000};
 assert.equal(crawlerFrame(0,e),'EN-01');
 assert.equal(crawlerFrame(.23,e),'EN-02');
 assert.equal(crawlerFrame(.40,e),'EN-01');
 assert.equal(crawlerFrame(.23,e,{stunned:true}),'EN-01');
 assert.equal(crawlerFrame(.23,e,{reducedMotion:true}),'EN-01');
});
test('defeat pose is bounded and ignores unrelated events',()=>{
 const event={type:'enemy',t:5,x:100,y:200};
 assert.equal(visibleDefeatAge(event,5),0);
 assert.ok(visibleDefeatAge(event,5.3)>0);
 assert.equal(visibleDefeatAge(event,5+DEFEAT_POSE_SECONDS+.001),null);
 assert.equal(visibleDefeatAge(event,4.8),null);
 assert.equal(visibleDefeatAge({...event,type:'collect'},5),null);
});
test('real tail swish records actual enemy coordinates without changing game collision rules',()=>{
 const s=newGame();startGame(s);
 const e=s.level.enemies[0];
 const at={x:e.x+e.w/2,y:e.y+e.h/2};
 Object.assign(s.player,{x:e.x-75,y:e.y-5,facing:1,attackCooldown:0,invulnerable:1});
 update(s,{swishPressed:true},DT);
 assert.equal(e.alive,false);
 const event=s.events.find(item=>item.type==='enemy');
 assert.ok(event);
 assert.equal(event.x,at.x);assert.equal(event.y,at.y);
 assert.equal(event.detail,'Cup Crawler defeated');
 assert.equal(s.player.hp,3);
 assert.equal(s.player.attackTime>0,true);
});
