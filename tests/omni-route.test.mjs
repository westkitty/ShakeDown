import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,startGame,update,DT} from '../src/game/engine.mjs';

test('continuous default-difficulty input actually climbs high road and earns Canopy Bell shake without warp',()=>{
 const s=newGame();startGame(s);
 const stages=['quad-training-1','rally-quad-01','rally-quad-02','rally-quad-03'];
 const touched=[];
 let stage=0,phase='approach',phaseFrame=0;
 for(let frame=0;frame<640&&stage<stages.length;frame++){
  const p=s.player,target=s.level.platforms.find(x=>x.id===stages[stage]);
  if(p.onPlatform===target.id){
   touched.push(target.id);stage++;phase='approach';phaseFrame=0;
   if(stage===stages.length)break;
  }
  const input={};
  if(stage===0){
   input.right=true;input.jumpHeld=true;
   input.jumpPressed=p.grounded&&p.x>310&&p.jumpsUsed===0;
  }else{
   const from=s.level.platforms.find(x=>x.id===stages[stage-1]);
   const to=s.level.platforms.find(x=>x.id===stages[stage]);
   if(phase==='approach'){
    const launchX=from.x+from.w*.52;
    if(p.grounded&&p.x>=launchX-4){phase='jump';phaseFrame=0}
    else input.right=p.x<launchX;
   }
   if(phase==='jump'){
    phaseFrame++;
    const dx=to.x+Math.min(to.w*.6,110)-p.x;
    input.right=dx>9;input.left=dx< -12;
    input.jumpHeld=phaseFrame<62;
    input.jumpPressed=phaseFrame===1||
     (phaseFrame===26&&p.jumpsUsed===1&&Math.abs(dx)>75);
   }
   // Ordinary available cheer makes the timed second upper bridge solid.
   if(stage===2&&s.cheerCooldown<.1)input.cheerPressed=true;
  }
  update(s,input,DT);
  assert.equal(s.mode,'playing','No death/retry or virtual route jump');
 }
 assert.deepEqual(touched,stages);
 assert.equal(s.player.hp,3,'All authored enemies and cannons are active during test');
 let recharge=0;
 while(s.cheerCooldown>.01&&recharge<480){update(s,{},DT);recharge++}
 assert.ok(recharge<480,'Cooldown actually finishes without bypass');
 update(s,{cheerPressed:true},DT);
 const reward=s.level.shakes.find(q=>q.id==='rally-shake-canopy');
 assert.equal(s.rallyCount,1);
 assert.equal(s.level.rallyPosts[0].lit,true);
 assert.equal(reward.locked,false);
 assert.equal(reward.taken,true,'Shamrock Shake physically collected in the same live collision frame');
 assert.ok(s.shakeCount>0);
 assert.equal(s.mode,'playing');
});
