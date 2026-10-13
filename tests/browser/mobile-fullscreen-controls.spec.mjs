import {test,expect} from '@playwright/test';

const activeUrl='./?qa=1&skip-brand=1&art=curated';
const qa=page=>page.evaluate(()=>window.__SHAKEDOWN_QA.controls());
async function enterGame(page){
 await page.goto(activeUrl);
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.inspectState==='function');
 await page.locator('#start-btn').tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
}
test('real landscape world fills the screen, with no blue gutters, UI over title, or stretched physics',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium','Coarse landscape runtime');
 await page.setViewportSize({width:844,height:390});
 const faults=[];page.on('pageerror',e=>faults.push(e.message));
 await page.goto(activeUrl);
 await expect(page.locator('#title-music-btn')).toBeVisible();
 await expect(page.locator('#touch-controls')).toBeHidden();
 await expect(page.locator('#pause-btn')).toBeHidden();
 await page.locator('#start-btn').tap();
 await expect(page.locator('#touch-controls')).toBeVisible();
 const stage=await page.evaluate(()=>{
  const v=document.querySelector('#viewport'),c=document.querySelector('#game');
  const vr=v.getBoundingClientRect(),cr=c.getBoundingClientRect();
  const pad=document.querySelector('#gesture-pad').getBoundingClientRect();
  const run=document.querySelector('#auto-run-toggle').getBoundingClientRect();
  const jump=document.querySelector('.touch-jump').getBoundingClientRect();
  const ctx=c.getContext('2d');
  const rgba=x=>Array.from(ctx.getImageData(Math.round(x),Math.round(c.height*.55),1,1).data);
  return {view:{w:vr.width,h:vr.height,x:vr.x,y:vr.y},canvas:{w:cr.width,h:cr.height,sourceW:c.width,sourceH:c.height,fit:getComputedStyle(c).objectFit},
   run:{x:run.x,bottom:run.bottom,w:run.width,h:run.height},
   pad:{x:pad.x,top:pad.top,w:pad.width,h:pad.height},
   jump:{x:jump.x,y:jump.y,w:jump.width,h:jump.height},
   firstPixel:rgba(c.width*.02),lastPixel:rgba(c.width*.98),
   documentWidth:document.documentElement.scrollWidth};
 });
 expect(stage.view.w).toBeCloseTo(844,0);
 expect(stage.view.h).toBeCloseTo(390,0);
 expect(stage.canvas.fit).toBe('fill');
 expect(stage.canvas.sourceW/stage.canvas.sourceH).toBeCloseTo(844/390,2);
 expect(stage.canvas.w).toBeCloseTo(844,0);
 expect(stage.canvas.h).toBeCloseTo(390,0);
 expect(stage.firstPixel[3]).toBe(255);
 expect(stage.lastPixel[3]).toBe(255);
 expect(stage.pad.w).toBeGreaterThanOrEqual(100);
 expect(stage.run.bottom).toBeLessThan(stage.pad.top);
 expect(stage.run.h).toBeGreaterThanOrEqual(44);
 expect(stage.jump.w).toBeGreaterThanOrEqual(60);
 expect(stage.jump.h).toBeGreaterThanOrEqual(60);
 expect(stage.jump.x).toBeGreaterThan(600);
 expect(stage.documentWidth).toBeLessThanOrEqual(844);
 expect((await qa(page)).renderWidth).toBeGreaterThan(960);
 await page.evaluate(()=>window.__SHAKEDOWN_QA.warp(1390,600));
 await page.waitForTimeout(200);
 await page.screenshot({path:'/tmp/shakedown-mobilefix-smudge-actual.png'});
 expect(faults).toEqual([]);
});
test('auto-run genuinely moves, toggles off, and separate Jump still jumps',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await enterGame(page);
 const toggle=page.locator('#auto-run-toggle');
 const jump=page.locator('.touch-jump');
 await expect(toggle).toHaveAttribute('aria-pressed','false');
 const x0=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await toggle.tap();
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x),{timeout:2000}).toBeGreaterThan(x0+22);
 expect((await qa(page)).autoRun).toBe(true);
 await toggle.tap();
 await expect(toggle).toHaveAttribute('aria-pressed','false');
 expect((await qa(page)).autoRun).toBe(false);
 await page.waitForTimeout(350);
 const resting=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(250);
 const after=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 expect(after-resting).toBeLessThan(5);
 await jump.tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().player.jumpsUsed),{timeout:1500}).toBeGreaterThan(0);
 await expect(toggle).toHaveAttribute('aria-pressed','false');
});
test('title audio is an explicit, working media gesture, not merely a printed note',async({page})=>{
 await page.goto('./?qa=1&skip-brand=1');
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.audio);
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).musicCreated).toBe(false);
 const titleMusic=page.locator('#title-music-btn');
 await expect(titleMusic).toBeVisible();
 await titleMusic.click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode)).toBe('title');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicPlaying),{timeout:9000}).toBe(true);
 await expect(titleMusic).toHaveAttribute('aria-pressed','true');
 const source=await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicTrack);
 expect(source).toContain('campus-untitled.mp3');
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode)).toBe('campus');
});
test('skipping owner branding unlocks title soundtrack through that same user gesture',async({page})=>{
 await page.goto('./?qa=1&brand=1&intro=1');
 await expect(page.locator('#brand-splash')).toBeVisible();
 await page.locator('#brand-skip').click();
 await expect(page.locator('#brand-splash')).toBeHidden();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode),{timeout:9000}).toBe('title');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicPlaying),{timeout:9000}).toBe(true);
});
