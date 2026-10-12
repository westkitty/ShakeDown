import {test,expect} from '@playwright/test';

async function canvasSignature(page,x,y){
 await page.evaluate(({x,y})=>window.__SHAKEDOWN_QA.warp(x,y),{x,y});
 await page.waitForTimeout(160);
 return page.evaluate(()=>{
  const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  const w=canvas.width,h=canvas.height;
  let acc=2166136261,distinct=new Set();
  for(let yy=40;yy<h-40;yy+=Math.max(12,Math.floor(h/17)))
   for(let xx=40;xx<w-40;xx+=Math.max(12,Math.floor(w/25))){
    const i=(yy*w+xx)*4;
    const rgb=(pixels[i]<<16)|(pixels[i+1]<<8)|pixels[i+2];
    distinct.add(rgb);acc=Math.imul(acc^rgb,16777619)>>>0;
   }
  return {hash:acc,palette:distinct.size};
 });
}
test('the actual Canvas renders sourced quad, modular dome, summit and reversible classic fallback',async({page},testInfo)=>{
 test.setTimeout(75000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./?qa=1&art=curated');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().worldLoaded),{timeout:45000}).toBe(35);
 const status=await page.evaluate(()=>window.__SHAKEDOWN_QA.assets());
 expect(status.worldSelected).toBe(35);
 expect(status.worldErrors).toEqual([]);
 expect(status.productionLoaded).toBe(0);
 expect(status.curatedLoaded).toBe(28);
 await page.locator('#start-btn').click();
 const quad=await canvasSignature(page,280,335);
 await page.screenshot({path:testInfo.outputPath('sourced-quad.png')});
 const dome=await canvasSignature(page,5150,-540);
 await page.screenshot({path:testInfo.outputPath('sourced-ascent.png')});
 const summit=await canvasSignature(page,7720,-1270);
 await page.screenshot({path:testInfo.outputPath('sourced-summit.png')});
 for(const item of [quad,dome,summit])expect(item.palette).toBeGreaterThan(25);
 expect(new Set([quad.hash,dome.hash,summit.hash]).size).toBe(3);
 await page.goto('./?qa=1&art=classic');
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.assets())).worldLoaded).toBe(0);
 await page.locator('#start-btn').click();
 const classic=await canvasSignature(page,5150,-540);
 expect(classic.hash).not.toBe(dome.hash);
 expect(errors).toEqual([]);
});
