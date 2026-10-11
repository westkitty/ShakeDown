import {test,expect} from '@playwright/test';

test('320 px narrow phone has no horizontal scrolling or clipped launch and touch controls',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Phone layout audit uses mobile emulation');
 await page.setViewportSize({width:320,height:568});
 await page.goto('./');
 const audit=await page.evaluate(()=>{
  const box=selector=>{const r=document.querySelector(selector).getBoundingClientRect();
   return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
  return{scroll:document.documentElement.scrollWidth,inner:innerWidth,
   title:box('.mast h1'),start:box('#start-btn'),
   touch:[...document.querySelectorAll('.touch')].map(b=>box('.touch[data-action="'+b.dataset.action+'"]'))};
 });
 expect(audit.scroll).toBeLessThanOrEqual(322);
 expect(audit.inner).toBeLessThanOrEqual(322);
 expect(audit.title.right).toBeLessThanOrEqual(320);
 expect(audit.start.bottom).toBeLessThanOrEqual(568);
 expect(audit.touch.every(r=>r.width>=44&&r.height>=44&&r.bottom<=568)).toBe(true);
 await page.locator('#start-btn').tap();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
});

test('landscape phone keeps launch and accessible controls above the physical bottom edge',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Landscape audit needs coarse pointer');
 await page.setViewportSize({width:844,height:390});
 await page.goto('./');
 const layout=await page.evaluate(()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return{bottom:r.bottom,top:r.top,width:r.width,height:r.height}};
  return{viewport:innerHeight,scrollWidth:document.documentElement.scrollWidth,
   launch:rect(document.querySelector('#start-btn')),
   touch:[...document.querySelectorAll('.touch')].map(rect)};
 });
 expect(layout.launch.bottom).toBeLessThanOrEqual(390);
 expect(layout.touch.every(x=>x.bottom<=390&&x.width>=44&&x.height>=44)).toBe(true);
 expect(layout.scrollWidth).toBeLessThanOrEqual(844);
 await page.locator('#start-btn').tap();
 await page.locator('#pause-btn').tap();
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 await page.locator('#motion-check').scrollIntoViewIfNeeded();
 await page.locator('#motion-check').check();
 await page.locator('#resume-btn').tap();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
});

test('critical solid-background status buttons meet standard contrast, not just color cues',async({page})=>{
 await page.goto('./');
 const ratios=await page.evaluate(()=>{
  function channels(text){const a=text.match(/[\d.]+/g)?.map(Number)||[];return a.slice(0,3).map(v=>v/255)}
  function brightness(rgb){
   const linear=channels(rgb).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
   return linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
  }
  return ['#mute-btn','#pause-btn','.secondary'].map(sel=>{
   const c=getComputedStyle(document.querySelector(sel));
   const a=brightness(c.color),b=brightness(c.backgroundColor);
   return{selector:sel,ratio:Math.round((Math.max(a,b)+.05)/(Math.min(a,b)+.05)*100)/100};
  });
 });
 for(const entry of ratios)expect(entry.ratio,entry.selector+' contrast '+entry.ratio).toBeGreaterThanOrEqual(4.5);
});
