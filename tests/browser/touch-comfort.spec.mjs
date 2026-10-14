import {test,expect} from '@playwright/test';

const launch='./?qa=1&skip-brand=1&art=classic';
async function enter(page){
 await page.goto(launch);
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.controls==='function');
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
}
const current=page=>page.evaluate(()=>window.__SHAKEDOWN_QA.controls());

test('fullscreen can be entered and exited from the title without losing the game',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.goto(launch);
 const btn=page.locator('#fullscreen-title-btn');
 await expect(btn).toBeVisible();
 await btn.tap();
 await expect.poll(async()=>(await current(page)).fullscreen.active).toBe(true);
 const state=await current(page);
 expect(state.fullscreen.native||state.fullscreen.fallback).toBe(true);
 const frame=await page.locator('#game-frame').boundingBox();
 expect(frame.width).toBeCloseTo(844,0);
 expect(frame.height).toBeGreaterThan(380);
 await btn.tap();
 await expect.poll(async()=>(await current(page)).fullscreen.active).toBe(false);
 await expect(page.locator('#start-btn')).toBeVisible();
});
test('unsupported native fullscreen shows an honest browser-install fallback',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.goto(launch);
 await page.evaluate(()=>{const shell=document.getElementById('game-shell');shell.requestFullscreen=undefined;shell.webkitRequestFullscreen=undefined});
 await page.locator('#fullscreen-title-btn').tap();
 await expect.poll(async()=>(await current(page)).fullscreen.fallback).toBe(true);
 await expect(page.locator('#immersive-status')).toContainText('install ShakeDown');
 await page.locator('#fullscreen-title-btn').tap();
 await expect.poll(async()=>(await current(page)).fullscreen.active).toBe(false);
});
test('settings remain local, survive reload, and preserve birthday save schema',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.goto(launch);
 const settings=page.locator('#touch-settings-dialog');
 await page.locator('#controls-title-btn').tap();
 await expect(settings).toBeVisible();
 await page.locator('#comfort-size').selectOption('large');
 await page.locator('#comfort-opacity').selectOption('strong');
 await page.locator('#comfort-hand').selectOption('left');
 await page.locator('#comfort-height').selectOption('raised');
 await page.locator('#comfort-sensitivity').selectOption('responsive');
 await page.locator('#comfort-hud').selectOption('compact');
 await page.locator('#comfort-haptics').check();
 await page.locator('#comfort-hideForGamepad').check();
 await page.locator('#comfort-done').tap();
 await expect(settings).toBeHidden();
 await page.reload();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.controls);
 const prefs=(await current(page)).comfort;
 expect(prefs).toMatchObject({size:'large',opacity:'strong',hand:'left',height:'raised',
  sensitivity:'responsive',hud:'compact',haptics:true,hideForGamepad:true});
 expect(await page.evaluate(()=>localStorage.getItem('shakedown:birthday:v1'))).toBeNull();
 await page.locator('#controls-title-btn').tap();
 await expect(page.locator('#comfort-size')).toHaveValue('large');
 await page.locator('#comfort-reset').tap();
 await expect(page.locator('#comfort-size')).toHaveValue('standard');
 await expect(page.locator('#comfort-hand')).toHaveValue('right');
 await page.locator('#comfort-done').tap();
 expect((await current(page)).comfort.size).toBe('standard');
});
test('player can choose discrete left/right buttons rather than a swipe pad',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.goto(launch);
 await page.locator('#controls-title-btn').tap();
 await page.locator('#comfort-movement').selectOption('buttons');
 await page.locator('#comfort-done').tap();
 await page.locator('#start-btn').tap();
 await expect(page.locator('#gesture-pad')).toBeHidden();
 const right=page.locator('.touch-left [data-action="right"]');
 await expect(right).toBeVisible();
 const r=await right.boundingBox();
 const xBefore=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();
 await page.waitForTimeout(270);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x)).toBeGreaterThan(xBefore+14);
 await page.mouse.up();
 await page.waitForTimeout(400);
 const xStop=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(240);
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x))-xStop).toBeLessThan(5);
});
test('left-handed settings physically swap the movement and action clusters',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.goto(launch);
 await page.locator('#controls-title-btn').tap();
 await page.locator('#comfort-hand').selectOption('left');
 await page.locator('#comfort-done').tap();
 await page.locator('#start-btn').tap();
 const pad=await page.locator('#gesture-pad').boundingBox();
 const jump=await page.locator('.touch-jump').boundingBox();
 expect(pad.x).toBeGreaterThan(500);
 expect(jump.x).toBeLessThan(300);
 expect(jump.width).toBeGreaterThan(44);
});
test('control-size and raised position presets change real tap geometry',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await enter(page);
 const before=await page.locator('#gesture-pad').boundingBox();
 await page.locator('#controls-game-btn').tap();
 await expect(page.locator('#pause-overlay')).not.toHaveClass(/hidden/);
 await page.locator('#comfort-size').selectOption('large');
 await page.locator('#comfort-height').selectOption('raised');
 await page.locator('#comfort-done').tap();
 await page.locator('#resume-btn').tap();
 const after=await page.locator('#gesture-pad').boundingBox();
 expect(after.width).toBeGreaterThan(before.width+15);
 expect(after.y+after.height).toBeLessThan(before.y+before.height-10);
 const right=await page.locator('.touch-jump').boundingBox();
 expect(right.height).toBeGreaterThanOrEqual(80);
});
test('HUD compact shortcut preserves hearts while clearing redundant text',async({page})=>{
 await enter(page);
 await expect(page.locator('#hud-health')).toBeVisible();
 await expect(page.locator('#hud-cheer')).toBeVisible();
 await page.keyboard.press('h');
 await expect(page.locator('#hud-cheer')).toBeHidden();
 await expect(page.locator('#hud-zone')).toBeHidden();
 await expect(page.locator('#hud-health')).toBeVisible();
 await page.keyboard.press('h');
 await expect(page.locator('#hud-cheer')).toBeVisible();
});
test('gamepad moves, jumps, pauses and can hide touch overlays by preference',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>window.__testPad?[window.__testPad]:[]});
 });
 await page.goto(launch);
 await page.locator('#controls-title-btn').tap();
 await page.locator('#comfort-hideForGamepad').check();
 await page.locator('#comfort-done').tap();
 await page.locator('#start-btn').tap();
 await page.evaluate(()=>{window.__testPad={
  connected:true,axes:[0],buttons:Array.from({length:16},()=>({pressed:false}))
 }});
 await expect(page.locator('#touch-controls')).toBeHidden();
 const before=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.evaluate(()=>{window.__testPad.axes[0]=.9});
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x)).toBeGreaterThan(before+16);
 await page.evaluate(()=>{window.__testPad.axes[0]=0;window.__testPad.buttons[0].pressed=true});
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().player.jumpsUsed)).toBeGreaterThan(0);
 await page.evaluate(()=>{window.__testPad.buttons[0].pressed=false;window.__testPad.buttons[9].pressed=true});
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('pause');
 await page.evaluate(()=>{window.__testPad.buttons[9].pressed=false});
 await page.waitForTimeout(160);
 await page.evaluate(()=>{window.__testPad.buttons[9].pressed=true});
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});

test('real touchscreen drag releases manual direction while Auto-Run alone remains latched',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium','Chromium mobile touch-event simulation');
 await page.setViewportSize({width:844,height:390});
 await enter(page);
 const bounds=await page.locator('#gesture-pad').boundingBox();
 const cx=Math.round(bounds.x+bounds.width/2);
 const cy=Math.round(bounds.y+bounds.height/2);
 // A single persistent CDP session exercises pointer capture and actual
 // touchStart/touchMove/touchEnd (rather than mouse events with a touch viewport).
 const session=await page.context().newCDPSession(page);
 const dispatch=async(type,points)=>session.send('Input.dispatchTouchEvent',{type,touchPoints:points});
 const point=(id,x,y)=>({id,x,y,force:1});
 await dispatch('touchStart',[point(1,cx,cy)]);
 await dispatch('touchMove',[point(1,cx+50,cy)]);
 await expect.poll(async()=>(await current(page)).effectiveDirection).toBe('right');
 const start=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(230);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x)).toBeGreaterThan(start+7);
 await dispatch('touchEnd',[]);
 await expect.poll(async()=>(await current(page)).activePointers).toBe(0);
 await expect.poll(async()=>(await current(page)).effectiveDirection).toBeNull();
 await page.waitForTimeout(370);
 const stopped=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.waitForTimeout(230);
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x))-stopped).toBeLessThan(5);
 await page.locator('#auto-run-toggle').tap();
 await expect.poll(async()=>(await current(page)).autoRun).toBe(true);
 await page.waitForTimeout(240);
 expect((await current(page)).effectiveDirection).toBe('right');
 await page.locator('#auto-run-toggle').tap();
 await expect.poll(async()=>(await current(page)).effectiveDirection).toBeNull();
 await session.detach();
});

test('key F toggles an immersive view and its correct label',async({page})=>{
 await page.goto(launch);
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.controls);
 await page.keyboard.press('f');
 await expect.poll(async()=>(await current(page)).fullscreen.active).toBe(true);
 await expect(page.locator('#fullscreen-title-btn')).toHaveAttribute('aria-pressed','true');
 await page.keyboard.press('f');
 await expect.poll(async()=>(await current(page)).fullscreen.active).toBe(false);
});

test('installed app assets load from this site with correct manifests and PNG icon bytes',async({page})=>{
 await page.goto(launch);
 const result=await page.evaluate(async()=>{
  const link=document.querySelector('link[rel="manifest"]');
  const response=await fetch(link.href);
  const manifest=await response.json();
  const icons=await Promise.all(manifest.icons.map(async image=>{
   const response=await fetch(new URL(image.src,link.href));
   return {status:response.status,bytes:(await response.arrayBuffer()).byteLength};
  }));
  return {status:response.status,manifest,icons,iosMeta:document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content};
 });
 expect(result.status).toBe(200);
 expect(result.iosMeta).toBe('yes');
 expect(result.manifest.display).toBe('standalone');
 expect(result.icons).toHaveLength(2);
 for(const icon of result.icons){expect(icon.status).toBe(200);expect(icon.bytes).toBeGreaterThan(3000)}
});
test('installed standalone web app does not show an unnecessary install instruction',async({page},info)=>{
 test.skip(info.project.name!=='mobile-chromium');
 await page.setViewportSize({width:844,height:390});
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'standalone',{configurable:true,value:true});
 });
 await page.goto(launch);
 await page.evaluate(()=>{
  const shell=document.querySelector('#game-shell');
  shell.requestFullscreen=undefined;shell.webkitRequestFullscreen=undefined;
 });
 await page.locator('#fullscreen-title-btn').tap();
 expect((await current(page)).fullscreen).toMatchObject({fallback:true,installed:true});
 await expect(page.locator('#immersive-status')).toContainText('installed ShakeDown app');
});
test('settings dialog swallows game hotkeys until dismissed and does not accidentally resume gameplay',async({page})=>{
 await page.goto(launch);
 await page.locator('#controls-title-btn').click();
 const dialog=page.locator('#touch-settings-dialog');
 await expect(dialog).toBeVisible();
 await page.keyboard.press('f');
 expect((await current(page)).fullscreen.active).toBe(false);
 await page.keyboard.press('Escape');
 await expect(dialog).toBeHidden();
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
 await page.locator('#controls-game-btn').click();
 await expect(dialog).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('pause');
 await page.keyboard.press('p');
 await page.keyboard.press('f');
 expect((await current(page)).fullscreen.active).toBe(false);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('pause');
 await page.keyboard.press('Escape');
 await expect(dialog).toBeHidden();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('pause');
 await page.locator('#resume-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});
