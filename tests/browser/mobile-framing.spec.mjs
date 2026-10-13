import {test,expect} from '@playwright/test';

test('phone portrait view enlarges the scene without distorting canvas or losing player',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium','Portrait touch-viewport experiment');
 await page.setViewportSize({width:390,height:844});
 await page.goto('./?skip-intro=1');
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.snapshot);
 const frame=page.locator('#viewport'),canvas=page.locator('#game');
 const initialFrame=await frame.boundingBox(),initialCanvas=await canvas.boundingBox();
 expect(initialFrame.height).toBeGreaterThan(310);
 expect(initialCanvas.width/initialCanvas.height).toBeCloseTo(16/9,1);
 expect(initialCanvas.width).toBeGreaterThan(initialFrame.width);
 await expect(page.locator('#start-btn')).toBeVisible();
 await page.locator('#start-btn').click();
 await page.keyboard.down('ArrowRight');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x),{timeout:3200}).toBeGreaterThan(150);
 await page.keyboard.up('ArrowRight');
 const after=await canvas.boundingBox(),view=await frame.boundingBox();
 const center=await page.evaluate(()=>{
  const s=window.__SHAKEDOWN_QA.snapshot();const canvas=document.getElementById('game').getBoundingClientRect();
  return canvas.left+(s.player.x-s.camera.x+19)*canvas.height/540;
 });
 expect(center).toBeGreaterThan(view.x+20);
 expect(center).toBeLessThan(view.x+view.width-25);
 expect(after.x).toBeLessThanOrEqual(view.x+1);
 expect(after.x+after.width).toBeGreaterThanOrEqual(view.x+view.width-1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
test('landscape and desktop preserve uncropped 16:9 stage',async({page})=>{
 await page.setViewportSize({width:844,height:390});
 await page.goto('./?skip-intro=1');
 const frame=await page.locator('#viewport').boundingBox();
 const canvas=await page.locator('#game').boundingBox();
 expect(frame.width/frame.height).toBeCloseTo(16/9,1);
 expect(canvas.width).toBeCloseTo(frame.width,0);
 expect(canvas.height).toBeCloseTo(frame.height,0);
});
