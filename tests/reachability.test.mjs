import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLevel} from '../src/game/world.mjs';
import {newGame,startGame,update,DT} from '../src/game/engine.mjs';

test('all 23 consecutive Golden Dome ascents have physically reachable authored platforms',()=>{
 const level=buildLevel();
 const steps=[level.platforms.find(p=>p.id==='dome-approach'),
  ...Array.from({length:23},(_,i)=>level.platforms.find(p=>p.id===`dome-step-${String(i+1).padStart(2,'0')}`))];
 assert.ok(steps.every(Boolean),'Every named authored Dome step must exist');
 for(let i=0;i<steps.length-1;i++){
  const source=steps[i],target=steps[i+1],s=newGame({assist:true});startGame(s);
  s.level.enemies=[];s.level.hazards=[];s.pulseOverride=1000;
  // The test isolates each actual jump; no teleport during a candidate's simulation.
  // Combat is separately covered. Moving platforms retain their real simulation.
  Object.assign(s.player,{x:source.x+source.w*.56,y:source.y-60,vx:0,vy:0,grounded:true,onPlatform:source.id,invulnerable:100});
  let landed=false;
  for(let frame=0;frame<140;frame++){
   const right=s.player.x<target.x+Math.min(target.w*.65,110);
   const jumpPressed=frame===0||(frame===25&&s.player.onPlatform!==target.id&&s.player.jumpsUsed===1&&Math.abs(s.player.x-target.x)>85);
   update(s,{right,jumpHeld:frame<65,jumpPressed},DT);
   if(frame>3&&s.player.onPlatform===target.id){landed=true;break}
  }
  assert.ok(landed,`${source.id} -> ${target.id} must be physically reachable with normal jump/double-jump controls`);
 }
});
