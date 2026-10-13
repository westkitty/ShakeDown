import {test,expect} from '@playwright/test';

test('title clip over Golden Dome, distinct title music, and three Shamrock Shake cards lead into play',async({page},testInfo)=>{
 test.setTimeout(75000);
 const errors=[],badAssets=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{
  if(response.status()>=400&&response.url().includes('/assets/intro/'))
   badAssets.push(response.url());
 });
 await page.goto('./?qa=1&intro=1');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.titleCinematic().visible),{timeout:15000}).toBe(true);
 await expect(page.locator('#title-intro-stage')).toHaveCSS('background-image',/bg_05_golden_dome_hero_backdrop/);
 await expect(page.locator('#title-intro-video source')).toHaveCount(2);
 // A real user click is needed to unlock audible music in modern browsers.
 await page.locator('#title-overlay').click({position:{x:14,y:14}});
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode)).toBe('title');
 const titleTrack=await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicTrack);
 await page.locator('#start-btn').click();
 await expect(page.locator('#intro-overlay')).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.intro().index)).toBe(0);
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicMode)).toBe('campus');
 const chaseTrack=await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicTrack);
 expect(chaseTrack).not.toBe(titleTrack);
 for(const [index,filename] of [[0,'panel_01.webp'],[1,'panel_02.webp'],[2,'panel_03.webp']]){
  await expect(page.locator('#intro-image')).toHaveAttribute('src',new RegExp(filename.replace('.','\\.')));
  await expect.poll(()=>page.locator('#intro-image').evaluate(img=>img.naturalWidth)).toBe(960);
  await expect(page.locator('#intro-counter')).toContainText((index+1)+' / 3');
  expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
  if(index<2)await page.locator('#intro-next').click();
 }
 await page.screenshot({path:testInfo.outputPath('october-shamrock-story-last-card.png')});
 await page.locator('#intro-next').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await expect(page.locator('#intro-overlay')).toBeHidden();
 await expect(page.locator('#title-overlay')).toBeHidden();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().musicTrack)).toBe(chaseTrack);
 expect(badAssets).toEqual([]);
 expect(errors).toEqual([]);
});

test('Skip story transitions exactly once into gameplay',async({page})=>{
 await page.goto('./?qa=1&intro=1');
 await page.locator('#start-btn').click();
 await expect(page.locator('#intro-overlay')).toBeVisible();
 await page.locator('#intro-skip').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.intro().active)).toBe(false);
});

test('the normal public-facing Start action does not skip narrative cards',async({page})=>{
 await page.goto('./');
 await page.locator('#start-btn').click();
 await expect(page.locator('#intro-overlay')).toBeVisible();
 await expect(page.locator('#intro-caption')).toContainText('Shamrock Shake in October');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
 await page.locator('#intro-skip').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('story auto-advances all three panels before enabling the gameplay loop',async({page})=>{
 test.setTimeout(35000);
 await page.goto('./?qa=1&intro=1');
 await page.clock.install();
 await page.locator('#start-btn').click();
 for(let i=0;i<3;i++){
  await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.intro().index)).toBe(i);
  expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('title');
  await page.clock.fastForward(4350);
 }
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await expect(page.locator('#intro-overlay')).toBeHidden();
});

test('keyboard can advance the story, and Escape skips without moving the player',async({page})=>{
 await page.goto('./?qa=1&intro=1');
 await page.locator('#start-btn').click();
 await page.keyboard.press('ArrowRight');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.intro().index)).toBe(1);
 await page.keyboard.press('Escape');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('the uploaded title animation decodes and its black matte is truly keyed away',async({page})=>{
 await page.goto('./?qa=1&intro=1');
 const video=page.locator('#title-intro-video');
 await expect.poll(()=>video.evaluate(v=>v.readyState),{timeout:15000}).toBeGreaterThanOrEqual(2);
 await expect.poll(()=>video.evaluate(v=>v.currentTime),{timeout:15000}).toBeGreaterThan(0.12);
 const result=await video.evaluate(v=>{
  const canvas=document.createElement('canvas');
  canvas.width=v.videoWidth;canvas.height=v.videoHeight;
  const ctx=canvas.getContext('2d');ctx.drawImage(v,0,0);
  return {src:v.currentSrc,width:v.videoWidth,height:v.videoHeight,
   cornerAlpha:ctx.getImageData(1,1,1,1).data[3]};
 });
 expect(result.width).toBe(960);
 expect(result.height).toBe(540);
 if(result.src.endsWith('.webm'))expect(result.cornerAlpha).toBe(0);
});
