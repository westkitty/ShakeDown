import {test,expect} from '@playwright/test';

test('Reduced Motion freezes decorative pixels, not the authoritative gameplay clock',async({page})=>{
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await page.locator('#motion-check').check();
 await page.locator('#resume-btn').click();
 const pixels=await page.evaluate(async()=>{
  const s=window.__SHAKEDOWN_QA.inspectState();
  const {render}=await import('./src/game/render.mjs');
  const canvas=document.createElement('canvas');canvas.width=960;canvas.height=540;
  const ctx=canvas.getContext('2d');
  // These are test-only cloned visual snapshots; the gameplay loop and platform
  // coordinate math remain unaltered by the actual reduced-motion preference.
  const before=s.elapsed;
  function hashAt(time,reducedMotion){
   s.elapsed=time;s.settings.reducedMotion=reducedMotion;
   render(ctx,s,{},0,{});
   const d=ctx.getImageData(0,0,960,540).data;
   let hash=2166136261;
   for(let i=0;i<d.length;i+=113){hash=Math.imul(hash ^ d[i],16777619)>>>0}
   return hash;
  }
  const stillA=hashAt(10,true),stillB=hashAt(11,true);
  const animatedA=hashAt(10,false),animatedB=hashAt(11,false);
  s.elapsed=before;s.settings.reducedMotion=true;
  return {stillA,stillB,animatedA,animatedB};
 });
 expect(pixels.stillA).toBe(pixels.stillB);
 expect(pixels.animatedA).not.toBe(pixels.animatedB);
 await page.locator('#pause-btn').click();
 await expect(page.locator('#motion-check')).toBeChecked();
 await page.reload();
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#motion-check')).toBeChecked();
});

test('system reduced-motion preference initializes the setting but explicit player choice wins',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#motion-check')).toBeChecked();
 await page.locator('#motion-check').uncheck();
 await page.reload();
 await page.locator('#start-btn').click();
 await page.locator('#pause-btn').click();
 await expect(page.locator('#motion-check')).not.toBeChecked();
});
