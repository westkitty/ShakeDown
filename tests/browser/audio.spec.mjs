import {test,expect} from '@playwright/test';

test('WebAudio context is deferred until the first play gesture and silenced on pause/restart',async({page})=>{
 const faults=[];page.on('pageerror',e=>faults.push(e.message));
 await page.goto('./');
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.audio().created)).toBe(false);
 await page.locator('#start-btn').click();
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().created)).toBe(true);
 await page.waitForTimeout(350);
 await page.keyboard.press('p');
 const paused=await page.evaluate(()=>window.__SHAKEDOWN_QA.audio());
 expect(paused.paused).toBe(true);expect(paused.activeVoices).toBe(0);
 await page.locator('#mute-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).enabled).toBe(false);
 await page.locator('#mute-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).paused).toBe(true);
 await page.locator('#resume-btn').click();
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().paused)).toBe(false);
 await page.keyboard.press('j');
 await page.keyboard.press('p');
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).activeVoices).toBe(0);
 expect(faults).toEqual([]);
});

test('muted stored preference starts without an AudioContext and unmutes only with interaction',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>localStorage.setItem('shakedown:birthday:v1',JSON.stringify({
  schema:1,settings:{mute:true,reducedMotion:true},bestShakes:0,completed:false,progress:null
 })));
 await page.reload();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).created).toBe(false);
 await page.locator('#start-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.audio())).created).toBe(false);
 await page.locator('#mute-btn').click();
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.audio().created)).toBe(true);
 await page.locator('#pause-btn').click();
 const state=await page.evaluate(()=>window.__SHAKEDOWN_QA.audio());
 expect(state.activeVoices).toBe(0);
 expect(state.paused).toBe(true);
});
