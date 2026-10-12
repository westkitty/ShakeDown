import {test,expect} from '@playwright/test';

test('premium Canvas layers stay bounded, materially shade terrain and follow live Fox health',async({page})=>{
 test.setTimeout(65000);
 await page.goto('./?qa=1&art=classic');
 try{await expect(page.locator('#start-btn')).toBeEnabled({timeout:12000})}
 catch{
  // Recover an intermittent blocked module request through the shipped
  // startup watchdog, never by bypassing the game's real input handlers.
  await expect(page.locator('#retry-load-btn')).toBeVisible({timeout:6000});
  await page.locator('#retry-load-btn').click();
  await expect(page.locator('#start-btn')).toBeEnabled({timeout:17000});
 }
 await page.locator('#start-btn').click();
 const out=await page.evaluate(async()=>{
  const {paintPlatformFinish,paintPulseReadout,paintBossHealth}=await import('./src/game/visual-finish.mjs');
  const {newGame}=await import('./src/game/engine.mjs');
  const make=()=>{const c=document.createElement('canvas');c.width=960;c.height=540;return c.getContext('2d')};
  const state=newGame();state.mode='playing';
  const pulse=make();
  paintPulseReadout(pulse,state,{active:true,remaining:2.0});
  const panel=pulse.getImageData(28,62,1,1).data[3];
  const clearCenter=pulse.getImageData(480,120,1,1).data[3];
  const terrain=make();
  paintPlatformFinish(terrain,{id:'test',x:10,y:310,w:600,h:140,kind:'grass'},
   10,310,true);
  const samples=[];
  for(let y=325;y<437;y+=7)
   for(let x=29;x<580;x+=13){
    const d=terrain.getImageData(x,y,1,1).data;
    samples.push([...d].join(':'));
   }
  const health=make();state.boss.triggered=true;state.boss.hp=3;
  paintBossHealth(health,state);
  const three=Array.from(health.getImageData(535,88,1,1).data);
  health.clearRect(0,0,960,540);state.boss.hp=1;paintBossHealth(health,state);
  const one=Array.from(health.getImageData(535,88,1,1).data);
  return {panel,clearCenter,colors:new Set(samples).size,thirdBarThree:three,thirdBarOne:one};
 });
 expect(out.panel).toBeGreaterThan(0);
 expect(out.clearCenter).toBe(0);
 expect(out.colors).toBeGreaterThan(5);
 expect(out.thirdBarThree).not.toEqual(out.thirdBarOne);
});

test('same playable game shows art-directed campus, Dome, Fox and victory without runtime errors',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='desktop-chromium','Desktop multi-scene visual QA');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().loaded),{timeout:15000}).toBe(25);
 const scenes=[
  {id:'campus',x:300,y:382,boss:null},
  {id:'rally',x:1210,y:175,boss:null},
  {id:'dome',x:5290,y:-430,boss:null},
  {id:'cornice',x:6420,y:-925,boss:null},
  {id:'fox',x:7780,y:-1233,boss:'tell'}
 ];
 for(const scene of scenes){
  await page.evaluate(scene=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
   qa.warp(scene.x,scene.y);
   s.mode='playing';s.boss.triggered=Boolean(scene.boss);
   s.boss.mode=scene.boss||'sleep';
   s.player.grounded=true;s.player.invulnerable=0;
   s.elapsed=15;
  },scene);
  await page.waitForTimeout(210);
  await page.locator('#game').screenshot({path:testInfo.outputPath('aaa-'+scene.id+'.png')});
  expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 }
 // This is only an actual state/renderer check, not a claimed complete traverse.
 await page.evaluate(()=>{const s=window.__SHAKEDOWN_QA.inspectState();s.mode='victory';s.boss.hp=0;});
 await page.locator('#game').screenshot({path:testInfo.outputPath('aaa-victory.png')});
 expect(errors).toEqual([]);
});

test('mobile chant status is readable in native CSS text and leaves touch input enabled',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Requires touch-viewport emulation');
 await page.setViewportSize({width:320,height:680});
 await page.goto('./?qa=1');
 await page.locator('#start-btn').tap();
 const text=page.locator('#chant-status');
 await expect(text).toBeVisible();
 await expect(text).toContainText(/BRIDGES OPEN|NEXT CHANT/);
 const layout=await page.evaluate(()=>{
  const element=document.querySelector('#chant-status');
  const rect=element.getBoundingClientRect();
  const control=document.querySelector('#cheer-touch').getBoundingClientRect();
  return {font:parseFloat(getComputedStyle(element).fontSize),width:rect.width,
   doc:document.documentElement.scrollWidth,viewport:innerWidth,cheerWidth:control.width};
 });
 expect(layout.font).toBeGreaterThanOrEqual(11);
 expect(layout.cheerWidth).toBeGreaterThanOrEqual(44);
 expect(layout.doc).toBeLessThanOrEqual(layout.viewport+2);
 await page.locator('#cheer-touch').tap();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().cheerCooldown)).toBeGreaterThan(5);
 await expect(text).toContainText('BRIDGES OPEN');
 await page.screenshot({path:testInfo.outputPath('aaa-mobile.png'),fullPage:true});
});
