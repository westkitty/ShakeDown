import {test,expect} from '@playwright/test';

const withBrand='./?qa=1&brand=1&intro=1';

test('Stinky Weasel ident is the true first screen and plays before title',async({page})=>{
 test.setTimeout(45000);
 const errors=[],bad=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&r.url().includes('/assets/branding/'))bad.push(r.url())});
 await page.goto(withBrand);
 await expect(page.locator('#brand-splash')).toBeVisible();
 await expect(page.locator('#game-shell')).toHaveAttribute('inert','');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.brand().active)).toBe(true);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
 await expect.poll(()=>page.locator('#brand-video').evaluate(v=>v.readyState),{timeout:12000}).toBeGreaterThanOrEqual(2);
 await expect.poll(()=>page.locator('#brand-video').evaluate(v=>v.currentTime),{timeout:12000}).toBeGreaterThan(.12);
 const m=await page.locator('#brand-video').evaluate(v=>({
  width:v.videoWidth,height:v.videoHeight,duration:v.duration,muted:v.muted,
  url:v.currentSrc
 }));
 expect(m.width).toBe(1280);
 expect(m.height).toBe(720);
 expect(m.duration).toBeGreaterThan(7.9);
 expect(m.muted).toBe(true);
 expect(m.url).toContain('stinky-weasel-brand.mp4');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.titleCinematic().visible)).toBe(false);
 await page.locator('#brand-skip').click();
 await expect(page.locator('#brand-splash')).toBeHidden();
 await expect(page.locator('#game-shell')).not.toHaveAttribute('inert','');
 await expect(page.locator('#title-overlay')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.titleCinematic().visible)).toBe(true);
 expect(bad).toEqual([]);
 expect(errors).toEqual([]);
});

test('sound requires an explicit gesture, does not overlap title music, and remains reversible',async({page})=>{
 await page.goto(withBrand);
 await page.locator('#brand-sound').click();
 await expect(page.locator('#brand-video')).toHaveJSProperty('muted',false);
 await expect(page.locator('#brand-sound')).toHaveText('MUTE INTRO');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode)).not.toBe('title');
 await page.locator('#brand-sound').click();
 await expect(page.locator('#brand-video')).toHaveJSProperty('muted',true);
 await page.locator('#brand-skip').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode),{timeout:15000}).toBe('title');
});

test('video ending restores title and then the complete existing story and gameplay',async({page})=>{
 await page.goto(withBrand);
 await expect.poll(()=>page.locator('#brand-video').evaluate(v=>v.readyState),{timeout:12000}).toBeGreaterThanOrEqual(2);
 await page.locator('#brand-video').evaluate(v=>v.dispatchEvent(new Event('ended')));
 await expect(page.locator('#brand-splash')).toBeHidden();
 await page.locator('#start-btn').click();
 await expect(page.locator('#intro-overlay')).toBeVisible();
 for(let i=0;i<3;i++){
  await expect(page.locator('#intro-counter')).toContainText((i+1)+' / 3');
  if(i<2)await page.locator('#intro-next').click();
 }
 await page.locator('#intro-next').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await expect(page.locator('#intro-overlay')).toBeHidden();
});

test('Escape skips the ident without starting gameplay, and QA bypass avoids media requests',async({page})=>{
 await page.goto(withBrand);
 await page.keyboard.press('Escape');
 await expect(page.locator('#brand-splash')).toBeHidden();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
 const media=[];
 page.on('request',r=>{if(r.url().endsWith('stinky-weasel-brand.mp4'))media.push(r.url())});
 await page.goto('./?qa=1');
 await expect(page.locator('#brand-splash')).toBeHidden();
 await expect(page.locator('#start-btn')).toBeVisible();
 expect(media).toEqual([]);
});

test('missing branding movie fails open to the playable title',async({page})=>{
 await page.route('**/assets/branding/stinky-weasel-brand.mp4',route=>route.abort());
 await page.goto(withBrand);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.brand().active),{timeout:7000}).toBe(false);
 await expect(page.locator('#title-overlay')).toBeVisible();
});

test('reduced-motion starts with a brief still ident, no auto-decoding video',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const videoRequests=[];
 page.on('request',r=>{if(r.url().includes('stinky-weasel-brand.mp4'))videoRequests.push(r.url())});
 await page.goto(withBrand);
 await expect(page.locator('#brand-splash')).toBeVisible();
 await expect(page.locator('#brand-sound')).toBeHidden();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.brand().reason)).toBe('reduced-motion');
 await expect(page.locator('#brand-splash')).toBeHidden({timeout:6500});
 await expect(page.locator('#title-overlay')).toBeVisible();
 expect(videoRequests).toEqual([]);
});

test('normal no-query launch displays the branding before Start and the Shake story',async({page})=>{
 await page.goto('./');
 await expect(page.locator('#brand-splash')).toBeVisible();
 await page.locator('#brand-skip').click();
 await expect(page.locator('#start-btn')).toBeVisible();
 await page.locator('#start-btn').click();
 await expect(page.locator('#intro-overlay')).toBeVisible();
 await expect(page.locator('#intro-caption')).toContainText('Shamrock Shake in October');
});

test('the complete owner ident reaches its authentic media end before revealing the title',async({page},testInfo)=>{
 if(testInfo.project.name==='mobile-chromium')test.skip();
 test.setTimeout(58000);
 await page.goto(withBrand);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.brand().reason),
  {timeout:53000}).toBe('ended');
 await expect(page.locator('#brand-splash')).toBeHidden();
 await expect(page.locator('#title-overlay')).toBeVisible();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
});
