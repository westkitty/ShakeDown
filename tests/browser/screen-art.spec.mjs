import {test,expect} from '@playwright/test';

test('raster title artwork loads in-game, all ten can be browsed, start remains operable',async({page})=>{
 await page.goto('./');
 const art=page.locator('#title-scene-art');
 await expect(art).toHaveAttribute('src',/title_01_dawn-quad-hero_960x540\.png/);
 await expect.poll(()=>art.evaluate(img=>img.complete?img.naturalWidth:0),{timeout:15000}).toBe(960);
 await expect(page.locator('#title-overlay')).toHaveClass(/screen-art-ready/);
 for(let i=2;i<=10;i++){
  await page.locator('#title-art-next').click();
  const num=String(i).padStart(2,'0');
  await expect(page.locator('#title-art-status')).toContainText(num+' / 10');
  await expect.poll(()=>art.evaluate(img=>img.complete?img.naturalWidth:0),{timeout:15000}).toBe(960);
 }
 await page.locator('#title-art-next').click();
 await expect(page.locator('#title-art-status')).toContainText('01 / 10');
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('classic opt-out keeps the original menu and avoids new image downloads',async({page})=>{
 const titleRequests=[];
 page.on('request',request=>{if(request.url().includes('/assets/title/'))titleRequests.push(request.url())});
 await page.goto('./?art=classic');
 await expect(page.locator('#title-scene-art')).toHaveCount(0);
 await expect(page.locator('#title-art-next')).toHaveCount(0);
 expect(titleRequests).toHaveLength(0);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.assets().curatedEnabled)).toBe(false);
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
});
