import {test,expect} from '@playwright/test';
import {PNG} from 'pngjs';

test('title, authentic sprites, movement, double jump, pause and persisted mute',async({page},testInfo)=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('./');
 await expect(page.locator('#title-heading')).toContainText('SHAMROCK SHAKE');
 try{
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().loaded),{timeout:12000}).toBe(25);
 }catch(error){console.log('SPRITE_LOAD_DEBUG',JSON.stringify(await page.evaluate(()=>window.__SHAKEDOWN_QA.assets())));throw error;}
 const initial=await page.evaluate(()=>window.__SHAKEDOWN_QA.assets());
 expect(initial.productionLoaded).toBe(0); // current baseline: no LM Arena final art
 await page.locator('#start-btn').click();
 await expect(page.locator('#title-overlay')).toHaveClass(/hidden/);
 await page.keyboard.down('ArrowRight');
 await page.waitForTimeout(450);
 await page.keyboard.up('ArrowRight');
 const moved=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot());
 expect(moved.player.x).toBeGreaterThan(70);
 await page.locator('canvas#game').focus();
 await page.keyboard.down('Space');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.y),{timeout:2000,intervals:[80,100,120]}).toBeLessThan(382);
 await page.keyboard.up('Space');
 await page.keyboard.press('j');
 await page.keyboard.press('p');
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 const paused=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().time);
 await page.waitForTimeout(220);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().time)).toBe(paused);
 await page.locator('#resume-btn').click();
 await expect(page.locator('#pause-overlay')).toHaveClass(/hidden/);
 await page.locator('#mute-btn').click();
 await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed','true');
 await page.reload();
 await expect(page.locator('#mute-btn')).toHaveAttribute('aria-pressed','true');
 const performance=await page.evaluate(()=>window.__SHAKEDOWN_QA.metrics());
 expect(Number.isFinite(performance.devicePixelRatio)).toBe(true);
 expect(errors).toEqual([]);
 console.log(testInfo.project.name,JSON.stringify({movedX:moved.player.x,metrics:performance}));
});

test('visual/canvas frame stays responsive and touch controls fit',async({page},testInfo)=>{
 await page.goto('./');
 await expect(page.locator('canvas#game')).toBeVisible();
 const dimensions=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,width:window.innerWidth,
  canvasWidth:document.querySelector('canvas').width}));
 expect(dimensions.doc).toBeLessThanOrEqual(dimensions.width+2);
 expect(dimensions.canvasWidth).toBeGreaterThanOrEqual(960);
 if(testInfo.project.name.startsWith('mobile')){
  await expect(page.locator('.touch-controls')).toBeVisible();
  await page.locator('#start-btn').tap();
  await page.locator('[data-action=jump]').tap();
  expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
  const button=page.locator('[data-action=right]'),rect=await button.boundingBox();
  expect(rect).not.toBeNull();
  const cdps=await page.context().newCDPSession(page);
  const pos={x:rect.x+rect.width/2,y:rect.y+rect.height/2,id:1};
  await cdps.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[pos]});
  await page.waitForTimeout(320);
  await cdps.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x))).toBeGreaterThan(70);
  await page.setViewportSize({width:844,height:390});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 }
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.waitForTimeout(450);
 expect(errors).toEqual([]);
 const metrics=await page.evaluate(()=>window.__SHAKEDOWN_QA.metrics());
 expect(metrics.frames).toBeGreaterThan(0);
 expect(metrics.renderMsP95).toBeGreaterThanOrEqual(0);
 console.log(testInfo.project.name,JSON.stringify({viewport:dimensions,metrics}));
});

test('test-assisted boss state reaches the true birthday overlay without claiming a full traverse',async({page})=>{
 await page.goto('./?qa=1');
 await page.locator('#start-btn').click();
 for(let hit=0;hit<3;hit++){
  await page.evaluate(()=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
   s.boss.triggered=true;s.boss.mode='rest';s.boss.timer=999;s.boss.hurtTime=0;
   s.player.x=s.boss.x-65;s.player.y=s.boss.y+18;s.player.facing=1;
   s.player.attackCooldown=0;
  });
  await page.keyboard.press('j');
  await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().boss.hp)).toBe(2-hit);
 }
 await expect(page.locator('#victory-heading')).toContainText('MAVERICK');
 await page.locator('#replay-btn').click();
 await expect(page.locator('#victory-overlay')).toHaveClass(/hidden/);
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
});


test('synthetic accepted-cup fixture loads by logical ID and actually replaces vector cup',async({page})=>{
 // This magenta PNG is a test response, never approved production artwork.
 const png=new PNG({width:64,height:96});
 for(let y=0;y<96;y++)for(let x=0;x<64;x++){
  const i=(y*64+x)*4;
  png.data[i]=250;png.data[i+1]=0;png.data[i+2]=255;png.data[i+3]=(x>7&&x<56&&y>8&&y<87)?255:0;
 }
 const file='assets/level1/collectibles/co_03_shamrock_shake_cup.png';
 const manifest={schemaVersion:1,audio:{},assets:{'CO-03':{path:file,width:64,height:96,
  reviewStatus:'reviewer-attested',integrationStatus:'unverified'}}};
 await page.route('**/assets/runtime/manifest.json',route=>route.fulfill({json:manifest}));
 await page.route('**/assets/level1/collectibles/co_03_shamrock_shake_cup.png',
  route=>route.fulfill({body:PNG.sync.write(png),contentType:'image/png'}));
 await page.goto('./');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().productionLoaded)).toBe(1);
 await page.locator('#start-btn').click();
 await page.waitForTimeout(300);
 const rgb=await page.evaluate(()=>{
  const canvas=document.querySelector('canvas'),dpr=canvas.width/960;
  return Array.from(canvas.getContext('2d').getImageData(Math.round(260*dpr),Math.round(395*dpr),1,1).data);
 });
 expect(rgb[0]).toBeGreaterThan(225);
 expect(rgb[1]).toBeLessThan(60);
 expect(rgb[2]).toBeGreaterThan(220);
});

test('real frame and render timing collected over a named idle/title scenario',async({page},testInfo)=>{
 await page.goto('./');
 await page.waitForTimeout(4200);
 const perf=await page.evaluate(()=>window.__SHAKEDOWN_QA.metrics());
 expect(perf.frames).toBeGreaterThan(20);
 expect(Number.isFinite(perf.frameMsP95)).toBe(true);
 expect(Number.isFinite(perf.renderMsP95)).toBe(true);
 console.log('PERF_TITLE_IDLE_'+testInfo.project.name,JSON.stringify(perf));
});
