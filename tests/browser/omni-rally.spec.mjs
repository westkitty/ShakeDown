import {test,expect} from '@playwright/test';

test('real keyboard cheer follows visible rally direction and unlocks canopy bell',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await expect(page.locator('#rally-guide')).toBeVisible();
 await expect(page.locator('#rally-guide')).toHaveAttribute('data-kind','intro');
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),b=s.level.rallyPosts[0];
  qa.warp(b.x-s.player.w/2,b.footY-s.player.h);
  s.player.onPlatform='rally-quad-03';s.player.grounded=true;
 });
 await expect(page.locator('#rally-guide')).toContainText('CHEER NOW');
 await page.locator('canvas#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().level.rallyPosts[0].lit)).toBe(true);
 await expect(page.locator('#cheer-progress')).toHaveText('RELAYS 1/4');
 await page.screenshot({path:testInfo.outputPath('omni-canopy.png')});
 expect(errors).toEqual([]);
});

test('real cheer during Fox recovery grants a short tactical window but not a free hit',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),b=s.boss;
  b.triggered=true;b.mode='rest';b.timer=1.2;
  qa.warp(b.x-69,b.y+18);
  s.player.grounded=true;s.player.onPlatform='summit-arena';s.player.facing=1;
 });
 await expect(page.locator('#rally-guide')).toContainText('SWISH TO HIT');
 await page.locator('canvas#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().events.some(e=>e.type==='bossCheer'))).toBe(true);
 const before=await page.evaluate(()=>({hp:window.__SHAKEDOWN_QA.snapshot().boss.hp,
  state:window.__SHAKEDOWN_QA.snapshot().boss.mode}));
 expect(before.hp).toBe(3);expect(before.state).toBe('rest');
 await page.keyboard.press('j');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().boss.hp)).toBe(2);
 expect(errors).toEqual([]);
});

test('four separately earned rally bells appear in victory and persist through replay',async({page})=>{
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await page.locator('canvas#game').focus();
 for(let i=0;i<4;i++){
  await page.evaluate(index=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),b=s.level.rallyPosts[index];
   qa.warp(b.x-s.player.w/2,b.footY-s.player.h);
   s.player.grounded=true;s.player.onPlatform=null;s.cheerCooldown=0;
  },i);
  await page.keyboard.press('c');
  await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(i+1);
 }
 for(let hit=0;hit<3;hit++){
  await page.evaluate(()=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),b=s.boss;
   b.triggered=true;b.mode='rest';b.timer=99;b.hurtTime=0;
   qa.warp(b.x-69,b.y+18);
   s.player.facing=1;s.player.attackCooldown=0;
  });
  await page.keyboard.press('j');
  await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().boss.hp)).toBe(2-hit);
 }
 await expect(page.locator('#victory-score')).toContainText('4/4 rally bells');
 await expect(page.locator('#victory-rally')).toContainText('RALLY LEGEND');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).bestRallies)).toBe(4);
 await page.locator('#replay-btn').click();
 await page.locator('#mute-btn').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).bestRallies)).toBe(4);
});

test('narrow mobile rally guidance has no overflow or fake input controls',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Narrow mobile touch-capable viewport');
 await page.setViewportSize({width:320,height:720});
 await page.goto('./?qa=1');
 await page.locator('#start-btn').tap();
 await expect(page.locator('#rally-guide')).toBeVisible();
 const m=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,
  cheercss:document.querySelector('#cheer-touch').getBoundingClientRect().width,
  hint:document.querySelector('#rally-guide').textContent}));
 expect(m.scroll).toBeLessThanOrEqual(m.width+2);
 expect(m.cheercss).toBeGreaterThanOrEqual(44);
 expect(m.hint).toMatch(/BONUS HIGH ROAD/);
 await page.locator('#cheer-touch').tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().cheerCooldown)).toBeGreaterThan(5);
 await page.screenshot({path:testInfo.outputPath('omni-narrow-mobile.png')});
});
