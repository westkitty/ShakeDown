import {test,expect} from '@playwright/test';

test('missing image manifests keep the procedural birthday game playable',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/sprites/cinnamon/frames.json',route=>route.abort('failed'));
 await page.route('**/assets/runtime/manifest.json',route=>route.abort('failed'));
 await page.goto('./?skip-intro=1');
 await expect(page.locator('#load-status')).toContainText('Sprite source unavailable');
 await page.locator('#start-btn').click();
 await page.keyboard.down('ArrowRight');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x),{timeout:4000})
  .toBeGreaterThan(74);
 await page.keyboard.up('ArrowRight');
 await page.keyboard.press('p');
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 expect(errors).toEqual([]);
});

test('already-loaded session can continue on network loss without remote resources',async({page},testInfo)=>{
 const errors=[];const remote=[];
 const localOrigin=new URL(testInfo.project.use.baseURL).origin;
 page.on('pageerror',e=>errors.push(e.message));
 // A local dev server is not an external request, regardless of its test port.
 page.on('request',r=>{if(new URL(r.url()).origin!==localOrigin)remote.push(r.url())});
 await page.goto('./?skip-intro=1');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().loaded),
  {timeout:12000}).toBe(25);
 await page.context().setOffline(true);
 try{
  await page.locator('#start-btn').click();
  await page.keyboard.down('ArrowRight');
  await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x),
   {timeout:3500}).toBeGreaterThan(74);
  await page.keyboard.up('ArrowRight');
  await page.keyboard.press('p');
  await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
  expect(remote).toEqual([]);
  expect(errors).toEqual([]);
 }finally{await page.context().setOffline(false)}
});

test('repeated resize, pause and focus-loss cycles do not crash or leak active sound voices',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?skip-intro=1');
 await page.locator('#start-btn').click();
 const viewports=[[1280,800],[320,568],[844,390],[390,844],[800,600],[375,667]];
 for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  await page.keyboard.press('j');
  await page.keyboard.press('p');
  await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
  await page.locator('#resume-btn').click();
 }
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 const state=await page.evaluate(()=>({
  audio:window.__SHAKEDOWN_QA.audio(),timing:window.__SHAKEDOWN_QA.metrics(),
  canvas:[document.getElementById('game').width,document.getElementById('game').height]
 }));
 expect(state.audio.activeVoices).toBe(0);
 expect(state.audio.paused).toBe(true);
 expect(state.timing.frames).toBeLessThanOrEqual(240);
 expect(state.canvas[0]).toBeLessThanOrEqual(1920);
 expect(state.canvas[1]).toBeLessThanOrEqual(1080);
 expect(errors).toEqual([]);
});
