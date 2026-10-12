import {test,expect} from '@playwright/test';

async function waitForReady(page){
 try{await expect(page.locator('#start-btn')).toBeEnabled({timeout:12000})}
 catch{
  await expect(page.locator('#retry-load-btn')).toBeVisible({timeout:6000});
  await page.locator('#retry-load-btn').click();
  await expect(page.locator('#start-btn')).toBeEnabled({timeout:17000});
 }
}
async function waitForCandidateArt(page){
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets().worldLoaded),{timeout:60000}).toBe(41);
 const assets=await page.evaluate(()=>window.__SHAKEDOWN_QA.assets());
 expect(assets.curatedLoaded).toBe(28);
 expect(assets.worldSelected).toBe(41);
 expect(assets.worldErrors).toEqual([]);
 expect(assets.productionLoaded).toBe(0);
}

test('pixel heart sprites reflect gameplay health and remain accessible',async({page},testInfo)=>{
 test.setTimeout(100000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1&art=curated');
 await waitForReady(page);
 await waitForCandidateArt(page);
 await page.locator('#start-btn').click();
 const hud=page.locator('#hud-health'),surface=hud.locator('canvas');
 await expect(surface).toBeVisible();
 await expect(hud).toHaveAttribute('role','img');
 await expect(hud).toHaveAttribute('aria-label','Health 3 of 3 hearts');
 const before=await surface.evaluate(c=>Array.from(c.getContext('2d').getImageData(58,7,4,6).data));
 await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().player.hp=1);
 await expect(hud).toHaveAttribute('aria-label','Health 1 of 3 hearts');
 const after=await surface.evaluate(c=>Array.from(c.getContext('2d').getImageData(58,7,4,6).data));
 expect(after).not.toEqual(before);
 await page.screenshot({path:testInfo.outputPath('curated-real-hearts.png')});
 await page.locator('#pause-btn').click();
 await page.locator('#art-preview-pause').uncheck();
 await page.locator('#resume-btn').click();
 await expect(hud.locator('canvas')).toHaveCount(0);
 await expect(hud).toContainText('♥');
 expect(errors).toEqual([]);
});

test('tail swish shows sourced defeat at actual enemy location',async({page},testInfo)=>{
 test.setTimeout(100000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1&art=curated');
 await waitForReady(page);
 await waitForCandidateArt(page);
 await page.locator('#start-btn').click();
 const at=await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),e=s.level.enemies.find(e=>e.id==='cup-lawn');
  qa.warp(e.x-75,e.y-5);s.player.facing=1;s.player.grounded=true;s.player.invulnerable=8;
  e.stunnedUntil=s.elapsed+20;
  return {x:e.x+e.w/2,y:e.y+e.h/2};
 });
 await page.locator('#game').screenshot({path:testInfo.outputPath('crawler-live.png')});
 await page.locator('#game').focus();await page.keyboard.press('j');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().level.enemies.find(e=>e.id==='cup-lawn').alive)).toBe(false);
 const event=await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().events.findLast(e=>e.type==='enemy'));
 expect(event.x).toBe(at.x);expect(event.y).toBe(at.y);
 expect(event.detail).toBe('Cup Crawler defeated');
 await page.locator('#game').screenshot({path:testInfo.outputPath('crawler-defeated.png')});
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
 expect(errors).toEqual([]);
});

test('classic fallback never opts unapproved art into the runtime',async({page})=>{
 await page.goto('./?qa=1&art=classic');
 await waitForReady(page);
 await page.locator('#start-btn').click();
 await expect(page.locator('#hud-health')).toContainText('♥');
 await expect(page.locator('#hud-health canvas')).toHaveCount(0);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.assets().worldLoaded)).toBe(0);
});
