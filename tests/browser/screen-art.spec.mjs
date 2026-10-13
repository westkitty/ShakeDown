import {test,expect} from '@playwright/test';

test('owner start plate and ten alternate raster titles load in-game; Start works',async({page})=>{
 test.setTimeout(90000);
 await page.goto('./?skip-intro=1');
 const art=page.locator('#title-scene-art');
 await page.locator('#workshop-title > summary').click();
 await expect(art).toHaveAttribute('src',/assets\/screens\/01_start_level_clean_960x540\.png/);
 await expect.poll(()=>art.evaluate(img=>img.complete?img.naturalWidth:0),{timeout:15000}).toBe(960);
 await expect(page.locator('#title-overlay')).toHaveClass(/owner-art-ready/);
 for(let i=2;i<=11;i++){
  await page.locator('#title-art-next').click();
  await expect(page.locator('#title-art-status')).toContainText(String(i).padStart(2,'0')+' / 11');
  await expect(art).toHaveAttribute('src',/assets\/title\/canvas\/title_/);
  await expect.poll(()=>art.evaluate(img=>img.complete?img.naturalWidth:0),{timeout:15000}).toBe(960);
 }
 await page.locator('#title-art-next').click();
 await expect(page.locator('#title-art-status')).toContainText('01 / 11');
 await expect(art).toHaveAttribute('src',/assets\/screens\/01_start_level_clean_960x540\.png/);
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('real game-over and victory overlays use the shipped clean raster plates',async({page})=>{
 await page.goto('./?qa');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{window.__SHAKEDOWN_QA.inspectState().mode='dead'});
 await expect(page.locator('#dead-overlay')).not.toHaveClass(/hidden/);
 const dead=page.locator('#dead-scene-art');
 await expect(dead).toHaveAttribute('src',/02_game_over_continue_clean_960x540\.png/);
 await expect.poll(()=>dead.evaluate(img=>img.naturalWidth),{timeout:15000}).toBe(960);
 await expect(page.locator('#dead-overlay')).toHaveClass(/owner-art-ready/);
 await page.locator('#retry-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await page.evaluate(()=>{window.__SHAKEDOWN_QA.inspectState().mode='victory'});
 await expect(page.locator('#victory-overlay')).not.toHaveClass(/hidden/);
 const victory=page.locator('#victory-scene-art');
 await expect(victory).toHaveAttribute('src',/03_victory_credits_clean_960x540\.png/);
 await expect.poll(()=>victory.evaluate(img=>img.naturalWidth),{timeout:15000}).toBe(960);
 await expect(page.locator('#replay-btn')).toBeVisible();
 await page.locator('#replay-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('classic opt-out keeps old menu and avoids ALL title and screen image downloads',async({page})=>{
 const titleRequests=[];
 page.on('request',request=>{if(/\/assets\/(title|screens)\//.test(request.url()))titleRequests.push(request.url())});
 await page.goto('./?art=classic&skip-intro=1');
 await expect(page.locator('#title-scene-art')).toHaveCount(0);
 await expect(page.locator('#title-art-next')).toHaveCount(0);
 expect(titleRequests).toHaveLength(0);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.assets().curatedEnabled)).toBe(false);
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
});
