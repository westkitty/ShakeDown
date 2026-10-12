import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('Smudge and Dexter scenes render real sprites, discover once, and restore from saved state',async({page},testInfo)=>{
 test.setTimeout(65000);
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./?qa=1&art=classic');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().npcLoaded),{timeout:15000}).toBe(8);
 await page.locator('#start-btn').click();
 async function warpTo(npcId){
  await page.evaluate(id=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
   const npc=s.level.secretNpcs.find(n=>n.id===id);
   qa.warp(npc.x+(id==='smudge'?-150:115)-s.player.w/2,npc.footY-s.player.h);
   s.player.grounded=true;s.player.jumpsUsed=0;s.player.vy=0;
   s.player.onPlatform=id==='smudge'?'secret-smudge-alcove':'secret-dexter-summit';
  },npcId);
  await expect.poll(()=>page.evaluate(id=>window.__SHAKEDOWN_QA.snapshot().achievements.includes(id),npcId)).toBe(true);
 }
 await warpTo('smudge');
 await expect(page.locator('#discovery-toast')).toContainText('Oh my God, I got to see Smudge');
 await page.screenshot({path:testInfo.outputPath('smudge-encounter.png')});
 await warpTo('dexter');
 await expect(page.locator('#discovery-toast')).toContainText('Unimpressed Stinkweasel');
 const dexter=await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
  return {dialog:s.level.secretNpcs[1].dialogue,cam:s.camera.y,
   count:s.events.filter(e=>e.type==='discovery').length};
 });
 expect(dexter.dialog).toContain("I'm not impressed");
 expect(dexter.cam).toBeLessThan(-1900);
 expect(dexter.count).toBe(2);
 await page.screenshot({path:testInfo.outputPath('dexter-encounter.png')});
 await page.locator('#pause-btn').click();
 await expect(page.locator('#pause-discoveries')).toContainText('Unimpressed Stinkweasel');
 await expect(page.locator('#pause-discoveries')).toContainText('Oh my God, I got to see Smudge');
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await page.locator('#continue-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().achievements)).toEqual(['smudge','dexter']);
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),npc=s.level.secretNpcs[0];
  qa.warp(npc.x-s.player.w/2,npc.footY-s.player.h);
 });
 await page.waitForTimeout(100);
 const before=await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().events.filter(e=>e.type==='discovery').length);
 expect(before).toBe(0);
 expect(errors).toEqual([]);
});

test('mobile encounter, pause journal and accessibility survive on narrow viewport',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='mobile-chromium','Phone-only viewport case');
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./?qa=1&art=classic');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().npcLoaded),{timeout:15000}).toBe(8);
 await page.locator('#start-btn').tap();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),npc=s.level.secretNpcs[0];
  qa.warp(npc.x-150-s.player.w/2,npc.footY-s.player.h);
  s.player.grounded=true;s.player.onPlatform='secret-smudge-alcove';
 });
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().achievements)).toContain('smudge');
 await page.screenshot({path:testInfo.outputPath('smudge-mobile.png')});
 await page.locator('#pause-btn').tap();
 await expect(page.locator('.discovery-journal summary')).toBeVisible();
 await page.locator('.discovery-journal summary').tap();
 await expect(page.locator('#pause-discoveries')).toContainText('Oh my God, I got to see Smudge');
 await page.setViewportSize({width:320,height:730});
 const sizes=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(sizes.page).toBeLessThanOrEqual(sizes.viewport+3);
 expect(errors).toEqual([]);
});

test('global discoveries remain earned through victory, replay and full reload',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('./?qa=1&art=classic');
 await page.locator('#start-btn').click();
 for(const id of ['smudge','dexter']){
  await page.evaluate(id=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
   const npc=s.level.secretNpcs.find(n=>n.id===id);
   qa.warp(npc.x-s.player.w/2,npc.footY-s.player.h);
   s.player.grounded=true;s.player.onPlatform=id==='smudge'?'secret-smudge-alcove':'secret-dexter-summit';
  },id);
  await expect.poll(()=>page.evaluate(id=>window.__SHAKEDOWN_QA.snapshot().achievements.includes(id),id)).toBe(true);
 }
 await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().mode='victory');
 await expect(page.locator('#victory-overlay')).toBeVisible();
 await expect(page.locator('#victory-discoveries')).toContainText('Unimpressed Stinkweasel');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1')).discoveries)).toEqual(['smudge','dexter']);
 await page.locator('#replay-btn').click();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().achievements)).toEqual(['smudge','dexter']);
 await page.reload();
 await expect(page.locator('#start-btn')).toBeEnabled();
 await page.locator('#start-btn').click();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().achievements)).toEqual(['smudge','dexter']);
 expect(errors).toEqual([]);
});

test('same-size tampered NPC art is rejected by SHA-256 while other frames remain usable',async({page})=>{
 const replacement=await fs.readFile('assets/sprites/smudge/idle_00.png');
 await page.route('**/assets/sprites/smudge/idle_01.png',route=>route.fulfill({
  status:200,contentType:'image/png',body:replacement
 }));
 await page.goto('./?qa=1&art=classic');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().npcLoaded),{timeout:15000}).toBe(7);
 const errors=await page.evaluate(()=>window.__SHAKEDOWN_QA.assets().npcErrors);
 expect(errors).toContain('NPC-smudge-idle_01: SHA-256 mismatch');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),npc=s.level.secretNpcs[0];
  qa.warp(npc.x-150-s.player.w/2,npc.footY-s.player.h);
  s.player.grounded=true;s.player.onPlatform='secret-smudge-alcove';s.elapsed=.3;
 });
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().achievements)).toContain('smudge');
});
