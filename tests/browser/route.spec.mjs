import {test,expect} from '@playwright/test';

// The browser performs actual game DOM input/UI/Canvas/physics. Only rAF scheduling
// is virtualized for reproducibility; no warps or direct update() calls are allowed.
test('browser-executed deterministic unwarped route: campus, Dome, Fox, birthday, replay',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop-chromium','One full browser route; mobile has separate interaction coverage');
 test.setTimeout(90000);
 await page.addInitScript(()=>{
  let time=0,next=1;const callbacks=new Map();
  window.requestAnimationFrame=cb=>{const id=next++;callbacks.set(id,cb);return id};
  window.cancelAnimationFrame=id=>callbacks.delete(id);
  window.__QA_FRAME_TICK=()=>{
   time+=1000/60;const batch=[...callbacks.values()];callbacks.clear();
   for(const cb of batch)cb(time);
  };
 });
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await page.locator('#assist-check').check();
 await page.locator('#resume-btn').click();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().settings.assist)).toBe(true);
 const result=await page.evaluate(async()=>{
  const {RoutePilot}=await import('./tests/helpers/route-pilot.mjs');
  const pilot=new RoutePilot(),active=new Set();
  const keyName={ArrowRight:'ArrowRight',ArrowLeft:'ArrowLeft',Space:' ',KeyJ:'j'};
  const send=(code,down)=>{
   dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{
    code,key:keyName[code],bubbles:true,cancelable:true
   }));
   if(down)active.add(code);else active.delete(code);
  };
  const hold=(code,want)=>{
   if(want&&!active.has(code))send(code,true);
   else if(!want&&active.has(code))send(code,false);
  };
  const release=()=>{for(const code of [...active])send(code,false)};
  const history=[];
  for(let frames=0;frames<4600;frames++){
   const game=window.__SHAKEDOWN_QA.inspectState();
   if(game.mode==='victory'){
    release();return {reached:true,frames,steps:pilot.climbed.size,
     retries:pilot.retries,shakes:game.shakeCount,bossHP:game.boss.hp,
     seconds:game.elapsed,history,checkpoint:game.checkpoint,
     victoryText:document.querySelector('#victory-heading').textContent};
   }
   let action;
   try{action=pilot.next(game)}catch(error){
    return{reached:false,frames,stage:pilot.stage,error:error.message,
      position:[game.player.x,game.player.y],trace:pilot.trace.slice(-25)};
   }
   if(action.retry){release();document.getElementById('retry-btn').click()}
   else{
    hold('ArrowLeft',!!action.left);hold('ArrowRight',!!action.right);
    const jump=!!action.jumpHeld||!!action.jumpPressed;
    if(action.jumpPressed&&active.has('Space'))send('Space',false);
    hold('Space',jump);
    if(action.swishPressed){send('KeyJ',true);send('KeyJ',false)}
   }
   window.__QA_FRAME_TICK();
   if(frames%450===0)history.push({frame:frames,x:Math.round(game.player.x),
     y:Math.round(game.player.y),stage:pilot.stage,segment:pilot.segment});
  }
  release();const state=window.__SHAKEDOWN_QA.inspectState();
  return{reached:false,error:'4600 simulated browser frames exhausted',stage:pilot.stage,
   position:[state.player.x,state.player.y],retries:pilot.retries,history};
 });
 console.log('BROWSER_FULL_ROUTE',JSON.stringify(result));
 expect(result.reached,JSON.stringify(result)).toBe(true);
 expect(result.steps).toBe(23);
 expect(result.bossHP).toBe(0);
 expect(result.shakes).toBeGreaterThan(0);
 expect(result.victoryText).toContain('MAVERICK');
 await expect(page.locator('#victory-overlay')).not.toHaveClass(/hidden/);
 await page.locator('#replay-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
});
