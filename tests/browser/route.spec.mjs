import {test,expect} from '@playwright/test';

// The browser performs actual game DOM input/UI/Canvas/physics. Only rAF scheduling
// is virtualized for reproducibility; no warps or direct update() calls are allowed.
async function driveBrowserRoute(page,{assist}={}){
 // Both modes use the same game and input driver, with no test shortcuts.

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
 if(assist){
  await page.locator('#pause-btn').click();
  await page.locator('#assist-check').check();
  await page.locator('#resume-btn').click();
 }
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().settings.assist)).toBe(assist);
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
  const history=[],checkpointWrites=[];let highestCheckpoint=0;
  for(let frames=0;frames<4600;frames++){
   const game=window.__SHAKEDOWN_QA.inspectState();
   if(game.mode==='victory'){
    release();return {reached:true,frames,steps:pilot.climbed.size,stage:pilot.stage,
     retries:pilot.retries,pitResets:pilot.pitResets,shakes:game.shakeCount,bossHP:game.boss.hp,
     seconds:game.elapsed,assist:game.settings.assist,history,checkpoint:game.checkpoint,
     checkpointWrites,
     saved:JSON.parse(localStorage.getItem('shakedown:birthday:v1')||'{}'),
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
   if(game.checkpoint>highestCheckpoint){
    highestCheckpoint=game.checkpoint;
    const record=JSON.parse(localStorage.getItem('shakedown:birthday:v1')||'{}');
    checkpointWrites.push({index:highestCheckpoint,stored:record.progress?.index??null});
   }
   if(frames%450===0)history.push({frame:frames,x:Math.round(game.player.x),
     y:Math.round(game.player.y),stage:pilot.stage,segment:pilot.segment});
  }
  release();const state=window.__SHAKEDOWN_QA.inspectState();
  return{reached:false,error:'4600 simulated browser frames exhausted',stage:pilot.stage,
   position:[state.player.x,state.player.y],retries:pilot.retries,history};
 });
 console.log('BROWSER_FULL_ROUTE_'+(assist?'ASSIST':'NORMAL'),JSON.stringify(result));
 expect(result.reached,JSON.stringify(result)).toBe(true);
 expect(result.stage).toBe(23);
 if(assist)expect(result.steps).toBe(23);
 else expect(result.steps).toBeGreaterThanOrEqual(18);
 expect(result.assist).toBe(assist);
 expect(result.bossHP).toBe(0);
 expect(result.shakes).toBeGreaterThan(0);
 expect(result.victoryText).toContain('MAVERICK');
 expect(result.checkpointWrites.length).toBeGreaterThanOrEqual(2);
 expect(result.checkpointWrites.every(x=>x.index===x.stored)).toBe(true);
 expect(result.checkpointWrites.some(x=>x.index===5)).toBe(true);
 expect(result.saved.completed).toBe(true);
 expect(result.saved.progress).toBeNull();
 await expect(page.locator('#victory-overlay')).not.toHaveClass(/hidden/);
 await page.locator('#replay-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
}
test('browser-executed deterministic assisted full route, birthday and replay',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop-chromium','Full-route desktop validation; mobile interaction tests run separately');
 test.setTimeout(90000);
 await driveBrowserRoute(page,{assist:true});
});
test('browser-executed deterministic NORMAL difficulty full route, birthday and replay',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop-chromium','Full-route desktop validation; mobile interaction tests run separately');
 test.setTimeout(90000);
 await driveBrowserRoute(page,{assist:false});
});
