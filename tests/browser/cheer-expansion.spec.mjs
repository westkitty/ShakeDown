import {test,expect} from '@playwright/test';

test('C cheer opens bridges, animates, cools down and unlocks a real high-route relay',async({page},testInfo)=>{
 test.setTimeout(70000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1&art=curated');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().loaded),{timeout:20000}).toBe(25);
 await page.locator('#start-btn').click();
 await page.locator('#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().cheerCooldown)).toBeGreaterThan(5);
 let data=await page.evaluate(()=>({
  state:window.__SHAKEDOWN_QA.snapshot(),
  cheerEvents:window.__SHAKEDOWN_QA.inspectState().events.filter(e=>e.type==='cheer').length
 }));
 expect(data.state.activePulse).toBe(true);
 expect(data.state.cheerWave).toBeGreaterThan(0);
 expect(data.cheerEvents).toBe(1);
 await expect(page.locator('#hud-cheer')).toContainText('CHEER');
 await page.keyboard.press('c');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().events.filter(e=>e.type==='cheer').length)).toBe(1);
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),post=s.level.rallyPosts[0];
  qa.warp(post.x-s.player.w/2,post.footY-s.player.h);
  s.player.grounded=true;s.player.onPlatform='rally-quad-03';
  s.cheerCooldown=0;s.elapsed=4;s.pulseOverride=0;s.activePulse=false;
 });
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 await expect(page.locator('#cheer-progress')).toContainText('1/4');
 const prize=await page.evaluate(()=>{
  const s=window.__SHAKEDOWN_QA.inspectState();
  return {bell:s.level.rallyPosts[0].lit,
   locked:s.level.shakes.find(q=>q.id==='rally-shake-canopy').locked,
   pulse:s.activePulse,
   wave:s.cheerWave,
   x:s.player.x,y:s.player.y};
 });
 expect(prize.bell).toBe(true);
 expect(prize.locked).toBe(false);
 expect(prize.pulse).toBe(true);
 expect(prize.wave).toBeGreaterThan(0);
 await page.screenshot({path:testInfo.outputPath('rally-bell-cheer.png')});
 expect(errors).toEqual([]);
});

test('on-screen CHEER pointer and reduced-motion UI remain usable on phone',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Touch layout is mobile-only');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1');
 await page.locator('#start-btn').tap();
 const cheer=page.locator('[data-action="cheer"]');
 await expect(cheer).toBeVisible();
 const bounds=await cheer.boundingBox();
 expect(bounds.width).toBeGreaterThanOrEqual(44);
 expect(bounds.height).toBeGreaterThanOrEqual(44);
 await cheer.tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().cheerCooldown)).toBeGreaterThan(5);
 await expect(page.locator('#cheer-touch')).toHaveClass(/cooling/);
 await page.locator('#pause-btn').tap();
 await page.locator('#motion-check').check();
 await page.locator('#resume-btn').tap();
 await page.evaluate(()=>{
  const s=window.__SHAKEDOWN_QA.inspectState();
  s.cheerCooldown=0;
 });
 await cheer.tap();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().settings.reducedMotion)).toBe(true);
 await page.setViewportSize({width:320,height:730});
 await expect(cheer).toBeVisible();
 const layout=await page.evaluate(()=>({
  docWidth:document.documentElement.scrollWidth,
  viewport:innerWidth,
  width:document.querySelector('#cheer-touch').getBoundingClientRect().width,
  left:document.querySelector('.touch-left').getBoundingClientRect().width
 }));
 expect(layout.docWidth).toBeLessThanOrEqual(layout.viewport+2);
 expect(layout.width).toBeGreaterThanOrEqual(44);
 await page.screenshot({path:testInfo.outputPath('cheer-mobile-narrow.png')});
 expect(errors).toEqual([]);
});
