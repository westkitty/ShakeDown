import {test,expect} from '@playwright/test';

test('earned birthday completion remains saved after replay and subsequent setting changes',async({page})=>{
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
 await page.locator('#replay-btn').click();
 await page.locator('#mute-btn').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).completed)).toBe(true);
});

test('checkpoint progress survives reload and resume, while Start deliberately begins a clean chase',async({page})=>{
 await page.goto('./?qa=1');
 await expect(page.locator('#continue-btn')).toBeHidden();
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const state=window.__SHAKEDOWN_QA.inspectState();
  state.checkpoint=2;state.elapsed=24.5;
  state.level.shakes.find(q=>q.id==='quad-shake-1').taken=true;
  state.level.shakes.find(q=>q.id==='quad-shake-6').taken=true;
  state.level.enemies.find(e=>e.id==='cup-lawn').alive=false;
 });
 await expect.poll(async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).progress?.index)).toBe(2);
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await expect(page.locator('#continue-note')).toContainText('Dome Approach');
 await page.locator('#continue-btn').click();
 const resumed=await page.evaluate(()=>{
  const game=window.__SHAKEDOWN_QA.inspectState();
  return {mode:game.mode,checkpoint:game.checkpoint,x:game.player.x,
   count:game.shakeCount,secrets:game.secretCount,
   enemyAlive:game.level.enemies.find(e=>e.id==='cup-lawn').alive};
 });
 expect(resumed).toMatchObject({mode:'playing',checkpoint:2,x:3498,count:2,secrets:1,enemyAlive:false});
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await page.locator('#start-btn').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).progress)).toBeNull();
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeHidden();
});

test('malformed saved progress is ignored while legacy settings and records survive',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>localStorage.setItem('shakedown:birthday:v1',
  JSON.stringify({schema:1,settings:{mute:true,assist:true},completed:true,bestShakes:14,
   progress:{schema:1,index:999,checkpointId:'nonexistent',elapsed:0,collected:[],defeated:[]}})));
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeHidden();
 await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed','true');
 await page.locator('#start-btn').click();
 const settings=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot());
 expect(settings.mode).toBe('playing');
 await page.locator('#mute-btn').click();
 const save=await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')));
 expect(save.completed).toBe(true);
 expect(save.bestShakes).toBe(14);
 expect(save.progress).toBeNull();
});

test('keyboard Enter activates the focused Continue option instead of starting fresh',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>localStorage.setItem('shakedown:birthday:v1',JSON.stringify({
  schema:1,settings:{assist:true},completed:false,bestShakes:2,
  progress:{schema:1,index:2,checkpointId:'Dome Approach',elapsed:21,
   collected:['quad-shake-1'],defeated:[]}
 })));
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await page.locator('#continue-btn').focus();
 await page.keyboard.press('Enter');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().checkpoint)).toBe(2);
});
