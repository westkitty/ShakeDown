import {test,expect} from '@playwright/test';

async function enterGame(page){
 await page.goto('./?qa=1&skip-brand=1&art=curated');
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.warp==='function');
 await page.locator('#start-btn').click();
 if(await page.locator('#intro-skip').isVisible())await page.locator('#intro-skip').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().worldLoaded),{timeout:45000}).toBe(35);
}

test('premium render is part of the active 3-zone Canvas journey without scene or input errors',async({page})=>{
 test.setTimeout(70000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await enterGame(page);
 const sample=async(x,y)=>{
  await page.evaluate(({x,y})=>window.__SHAKEDOWN_QA.warp(x,y),{x,y});
  await page.waitForTimeout(130);
  return page.evaluate(()=>{
   const c=document.querySelector('#game'),ctx=c.getContext('2d'),pixels=ctx.getImageData(0,0,960,540).data;
   let sig=2166136261;const unique=new Set();
   for(let y=180;y<525;y+=17)for(let x=35;x<925;x+=24){
    const i=(y*960+x)*4,rgb=(pixels[i]<<16)|(pixels[i+1]<<8)|pixels[i+2];
    unique.add(rgb);sig=Math.imul(sig^rgb,16777619)>>>0;
   }
   const panel=ctx.getImageData(313,106,1,1).data;
   return{hash:sig,palette:unique.size,panel:[...panel]};
  });
 };
 const quad=await sample(280,335),ascent=await sample(5150,-540);
 await page.evaluate(()=>{const b=window.__SHAKEDOWN_QA.inspectState().boss;b.triggered=true;b.mode='tell';b.timer=900;b.hp=3});
 const summit=await sample(7720,-1270);
 for(const scene of [quad,ascent,summit]){
  expect(scene.palette).toBeGreaterThan(35);
  expect(scene.panel[3]).toBe(255); // Opaque Canvas even when a secret encounter suppresses status
 }
 expect(new Set([quad.hash,ascent.hash,summit.hash]).size).toBe(3);
 expect(errors).toEqual([]);
 const loaded=await page.evaluate(()=>window.__SHAKEDOWN_QA.assets());
 expect(loaded.productionLoaded).toBe(0);
 expect(loaded.worldErrors).toEqual([]);
});

test('classic fallback and reduced motion retain playable runtime without rendering errors',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1&skip-brand=1&art=classic');
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.warp==='function');
 await page.locator('#start-btn').click();
 if(await page.locator('#intro-skip').isVisible())await page.locator('#intro-skip').click();
 await page.locator('#pause-btn').click();
 await page.locator('#motion-check').check();
 await page.locator('#resume-btn').click();
 const position=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.keyboard.down('ArrowRight');
 await page.waitForTimeout(300);
 await page.keyboard.up('ArrowRight');
 const after=await page.evaluate(()=>({x:window.__SHAKEDOWN_QA.snapshot().player.x,art:window.__SHAKEDOWN_QA.assets(),reducedMotion:window.__SHAKEDOWN_QA.inspectState().settings.reducedMotion}));
 expect(after.x).toBeGreaterThan(position+3);
 expect(after.art.worldLoaded).toBe(0);
 expect(after.reducedMotion).toBe(true);
 expect(errors).toEqual([]);
});

test('landscape gesture pad preserves directional latch, action buttons and HUD separation',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium');
 test.setTimeout(70000);
 await page.setViewportSize({width:844,height:390});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await enterGame(page);
 const initial=await page.evaluate(()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
  return{pad:rect(document.querySelector('#gesture-pad')),
   pause:rect(document.querySelector('#pause-btn')),zone:rect(document.querySelector('#hud-zone')),
   viewport:rect(document.querySelector('#viewport')),screenWidth:document.documentElement.scrollWidth};
 });
 expect(initial.pad.w).toBeGreaterThanOrEqual(100);
 expect(initial.screenWidth).toBe(844);
 expect(initial.viewport.h).toBeGreaterThanOrEqual(388);
 expect(initial.pause.y).toBeGreaterThan(initial.zone.bottom);
 const center={x:initial.pad.x+initial.pad.w/2,y:initial.pad.y+initial.pad.h/2};
 async function swipe(dx,dy){
  await page.mouse.move(center.x,center.y);
  await page.mouse.down();
  await page.mouse.move(center.x+dx,center.y+dy,{steps:3});
  await page.mouse.up();
 }
 await swipe(48,0);
 await expect(page.locator('#gesture-pad')).toHaveAttribute('data-direction','right');
 const before=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(240);
 const after=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 expect(after).toBeGreaterThan(before+5);
 await swipe(-48,0);
 await expect(page.locator('#gesture-pad')).toHaveAttribute('data-direction','left');
 await page.waitForTimeout(120);
 const leftStart=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(190);
 const leftEnd=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 expect(leftEnd).toBeLessThan(leftStart-2);
 await swipe(0,-46);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().player.jumpsUsed),{timeout:1500}).toBeGreaterThan(0);
 await swipe(0,48);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().player.dashCooldown),{timeout:1500}).toBeGreaterThan(0);
 await page.locator('#cheer-touch').tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().cheerCooldown),{timeout:1500}).toBeGreaterThan(0);
 expect(errors).toEqual([]);
});
