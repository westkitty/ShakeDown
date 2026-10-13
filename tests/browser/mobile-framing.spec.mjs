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
test('landscape mobile uses a full-bleed touch frame without distorting the 16:9 scene',async({page},testInfo)=>{
 await page.setViewportSize({width:844,height:390});
 await page.goto('./?skip-intro=1');
 const result=await page.evaluate(()=>{
  const frame=document.querySelector('#viewport'),canvas=document.querySelector('#game');
  const fr=frame.getBoundingClientRect(),cr=canvas.getBoundingClientRect();
  return {
   frame:{left:fr.left,top:fr.top,width:fr.width,height:fr.height},
   canvas:{width:cr.width,height:cr.height,intrinsicWidth:canvas.width,intrinsicHeight:canvas.height},
   imageFit:getComputedStyle(canvas).objectFit,
   documentWidth:document.documentElement.scrollWidth
  };
 });
 expect(result.canvas.intrinsicWidth/result.canvas.intrinsicHeight).toBeCloseTo(16/9,2);
 expect(result.canvas.width).toBeCloseTo(result.frame.width,0);
 expect(result.canvas.height).toBeCloseTo(result.frame.height,0);
 if(testInfo.project.name==='mobile-chromium'){
  // The swipe-pad layout intentionally fills the phone, letterboxing the game
  // *within* its CSS canvas via object-fit rather than changing world coordinates.
  expect(result.frame.left).toBeCloseTo(0,0);
  expect(result.frame.top).toBeCloseTo(0,0);
  expect(result.frame.width).toBeCloseTo(844,0);
  expect(result.frame.height).toBeCloseTo(390,0);
  expect(result.imageFit).toBe('contain');
  expect(result.documentWidth).toBeLessThanOrEqual(844);
 }else{
  expect(result.frame.width/result.frame.height).toBeCloseTo(16/9,1);
 }
});
