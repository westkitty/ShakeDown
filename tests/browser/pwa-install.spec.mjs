import {test,expect} from '@playwright/test';
// This is the ONLY normal browser suite that opts into actual PWA workers.
test.use({serviceWorkers:'allow'});
const source='./?qa=1&qa-pwa=1&skip-brand=1';
test('PWA title advertises the entire downloadable game, without silently downloading',async({page})=>{
 test.setTimeout(60000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(source);
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.pwa?.()?.registered,null,{timeout:30000});
 await expect.poll(()=>page.evaluate(()=>document.getElementById('pwa-install-btn').disabled)).toBe(false);
 const initial=await page.evaluate(()=>window.__SHAKEDOWN_QA.pwa());
 expect(initial.offlineReady).toBe(false);
 expect(initial.downloaded).toBe(0);
 expect(initial.total).toBeGreaterThanOrEqual(290);
 expect(initial.packBytes).toBeGreaterThan(75*1024*1024);
 await expect(page.locator('#pwa-install-btn')).toContainText('DOWNLOAD COMPLETE GAME');
 await expect(page.locator('#pwa-options summary')).toContainText('FULL GAME');
 // User refusal cannot trigger a background 80 MB download.
 page.once('dialog',async dialog=>{expect(dialog.message()).toContain('ENTIRE ShakeDown');await dialog.dismiss()});
 await page.locator('#pwa-install-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.pwa())).downloading).toBe(false);
 expect(errors).toEqual([]);
});
test('manifest and worker remain same-origin under the game scope',async({page})=>{
 test.setTimeout(60000);
 await page.goto(source);
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.pwa?.()?.registered,null,{timeout:30000});
 const data=await page.evaluate(async()=>{
  const manifestURL=document.querySelector('link[rel="manifest"]').href;
  const manifest=await (await fetch(manifestURL)).json();
  const scope=(await navigator.serviceWorker.getRegistration()).scope;
  return {manifestURL,manifest,scope,origin:location.origin};
 });
 expect(data.manifest.display).toBe('standalone');
 expect(data.manifest.scope).toBe('./');
 expect(data.manifest.start_url).toBe('./');
 expect(data.scope).toBe(new URL('./',data.manifestURL).href);
 expect(data.manifestURL.startsWith(data.origin+'/')).toBe(true);
});
test('native install prompt remains a second intentional click after complete-game readiness',async({page})=>{
 await page.goto(source);
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.pwa?.()?.registered,null,{timeout:30000});
 const result=await page.evaluate(()=>{
  window.__installCalls=0;
  const event=new Event('beforeinstallprompt',{cancelable:true});
  event.prompt=()=>{window.__installCalls++;return Promise.resolve()};
  event.userChoice=Promise.resolve({outcome:'accepted'});
  window.dispatchEvent(event);
  navigator.serviceWorker.dispatchEvent(new MessageEvent('message',{
   data:{source:'shakedown-pwa',type:'STATUS',ready:true,downloading:false,
    downloaded:297,total:297,bytes:82719591}
  }));
  // This is a simulated READY event. Keep it in one JS turn so the real
  // not-yet-downloaded worker cannot overwrite the mock between actions.
  const label=document.getElementById('pwa-install-btn').textContent;
  document.getElementById('pwa-install-btn').click();
  return {label,calls:window.__installCalls};
 });
 expect(result.label).toContain('INSTALL FULL SHAKEDOWN');
 expect(result.calls).toBe(1);
});
test('PWA is disabled for deterministic gameplay QA unless explicitly selected',async({page})=>{
 await page.goto('./?qa=1&skip-brand=1');
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.pwa);
 const state=await page.evaluate(()=>window.__SHAKEDOWN_QA.pwa());
 expect(state.enabled).toBe(false);
 await expect(page.locator('#pwa-download-btn')).toBeDisabled();
 await page.locator('#start-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('playing');
});
