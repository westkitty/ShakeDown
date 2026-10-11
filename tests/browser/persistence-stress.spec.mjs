import {test,expect} from '@playwright/test';

async function earnBirthday(page){
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 for(let hit=0;hit<3;hit++){
  await page.evaluate(()=>{
   const game=window.__SHAKEDOWN_QA.inspectState();
   game.boss.triggered=true;game.boss.mode='rest';game.boss.timer=999;game.boss.hurtTime=0;
   game.player.x=game.boss.x-65;game.player.y=game.boss.y+18;game.player.facing=1;
   game.player.attackCooldown=0;
  });
  await page.keyboard.press('j');
  await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().boss.hp)).toBe(2-hit);
 }
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).completed)).toBe(true);
}

test('two tabs cannot erase an earned birthday completion through an older settings save',async({context,page})=>{
 await page.goto('./');
 const other=await context.newPage();await other.goto('./');
 await earnBirthday(page);
 await other.locator('#mute-btn').click();
 const record=await other.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')));
 expect(record.completed).toBe(true);
 await other.close();
});

test('two tabs do not erase a checkpoint by changing mute on an older title screen',async({context,page})=>{
 await page.goto('./?qa=1');
 const other=await context.newPage();await other.goto('./');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const game=window.__SHAKEDOWN_QA.inspectState();
  game.checkpoint=3;game.elapsed=45;game.level.shakes[0].taken=true;
 });
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).progress?.index)).toBe(3);
 await other.locator('#mute-btn').click();
 const record=await other.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')));
 expect(record.progress?.index).toBe(3);
 await expect(other.locator('#continue-btn')).toBeVisible();
 await other.close();
});

test('private/restricted storage fails gracefully through start, pause, mute and restart',async({page})=>{
 await page.addInitScript(()=>{
  const originalGet=Storage.prototype.getItem,originalSet=Storage.prototype.setItem;
  Storage.prototype.getItem=function(...args){
   if(args[0]==='shakedown:birthday:v1')throw new DOMException('Storage disallowed','SecurityError');
   return originalGet.apply(this,args);
  };
  Storage.prototype.setItem=function(...args){
   if(args[0]==='shakedown:birthday:v1')throw new DOMException('Quota full','QuotaExceededError');
   return originalSet.apply(this,args);
  };
 });
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./');
 await page.locator('#start-btn').click();
 await page.keyboard.press('p');
 await page.locator('#mute-btn').click();
 await page.locator('#resume-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
 expect(errors).toEqual([]);
});

test('rapid restart and mute/pause toggles retain a valid bounded settings record',async({page})=>{
 await page.goto('./');
 for(let round=0;round<9;round++){
  await page.locator('#start-btn').click();
  await page.keyboard.press('p');
  await page.locator('#mute-btn').click();
  await page.locator('#pause-retry-btn').click();
  await page.keyboard.press('p');
  await page.locator('#pause-retry-btn').click();
  // The test intentionally reloads to return to title without mutating game state.
  await page.reload();
 }
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')));
 expect(record.schema).toBe(1);
 expect(typeof record.settings.mute).toBe('boolean');
 expect(record.completed).toBe(false);
 expect(record.progress).toBeNull();
});
