import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,startGame,update,resetToCheckpoint,DT} from '../src/game/engine.mjs';
import {RoutePilot} from './helpers/route-pilot.mjs';

test('ONE continuous no-warp player-input path reaches birthday ending via all 23 Dome steps',()=>{
 const game=newGame({assist:true}),pilot=new RoutePilot();
 startGame(game);
 let frames=0;
 for(;frames<14000 && game.mode!=='victory';frames++){
  const input=pilot.next(game);
  if(input.retry)resetToCheckpoint(game);
  else update(game,input,DT);
 }
 assert.equal(game.mode,'victory',JSON.stringify({segment:pilot.segment,stage:pilot.stage,
  attempts:pilot.retries,position:[game.player.x,game.player.y],trace:pilot.trace.slice(-10)}));
 assert.equal(pilot.climbed.size,23,'All 23 Dome steps were touched during one continuous run');
 assert.equal(game.boss.hp,0);
 assert.equal(game.birthdayReady,true);
 assert.ok(game.shakeCount>=1,'The player must actually collect at least one shake');
 assert.ok(pilot.retries<=5,'The scripted assist route should not require excessive resets');
 assert.ok(frames>1500,'No instantaneous/teleport completion is allowed');
 console.log('Full-route input proof:',JSON.stringify({frames,seconds:Number(game.elapsed.toFixed(1)),
  climbSteps:pilot.climbed.size,checkpoint:game.checkpoint,shakes:game.shakeCount,
  retries:pilot.retries,bossHP:game.boss.hp}));
});
