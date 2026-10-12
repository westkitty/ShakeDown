import {test,expect} from '@playwright/test';

test('the game exposes all 194 physical candidates without eagerly downloading 194 images',async({page})=>{
 const imageRequests=[];
 page.on('request',request=>{
  if(request.url().includes('/assets/production/')&&request.url().endsWith('.png'))
   imageRequests.push(request.url());
 });
 await page.goto('./?art=classic');
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector())).available).toBe(0);
 expect(imageRequests.length).toBe(0,'Classic mode must retain lightweight startup');
 await page.locator('#art-director-title-open').click();
 await expect(page.locator('#art-director-dialog')).toBeVisible();
 await expect(page.locator('#art-director-list option')).toHaveCount(194,{timeout:13000});
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector())).available).toBe(194);
 await expect.poll(async()=>page.locator('#art-director-apply').isEnabled()).toBe(true);
 expect(imageRequests.length).toBeLessThanOrEqual(2,'Only the selected candidate should be fetched');
 await page.locator('#art-director-role').selectOption('fox');
 await expect(page.locator('#art-director-list option')).toHaveCount(20);
 await page.locator('#art-director-role').selectOption('terrain');
 await expect(page.locator('#art-director-list option')).toHaveCount(26);
 await page.locator('#art-director-verdict').selectOption('blocked');
 const found=await page.locator('#art-director-list option').count();
 expect(found).toBeGreaterThan(0);
 await page.locator('#art-director-role').selectOption('');
 await expect(page.locator('#art-director-list option')).toHaveCount(24);
});

test('all twelve art families can be applied to their live game roles and removed',async({page})=>{
 test.setTimeout(75000);
 await page.goto('./?art=all');
 await page.locator('#art-director-title-open').click();
 await expect(page.locator('#art-director-list option')).toHaveCount(194);
 const cases=[
  ['backdrop','BG-01'],['terrain','TL-06'],['scenery','PR-03'],
  ['mechanism','MC-05'],['enemy','EN-01'],['pickup','CO-03'],
  ['cinnamon','CIN-N04'],['fox','FOX-05'],['bossFx','BS-VF01'],
  ['effect','EX-VF01'],['interface','UI-04'],['birthday','BD-01']
 ];
 for(const [role,id] of cases){
  await page.locator('#art-director-role').selectOption(role);
  await page.locator('#art-director-list').selectOption(id);
  await expect.poll(async()=>page.locator('#art-director-name').textContent()).toContain(id);
  await expect.poll(async()=>page.locator('#art-director-apply').isEnabled(),{timeout:14000}).toBe(true);
  await page.locator('#art-director-apply').click();
  await expect.poll(async()=>page.evaluate(r=>window.__SHAKEDOWN_QA.artDirector().selected[r],role)).toBe(id);
 }
 const stats=await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector());
 expect(stats.available).toBe(194);
 expect(Object.keys(stats.selected)).toHaveLength(12);
 expect(stats.loaded).toBeLessThanOrEqual(24);
 await page.locator('#art-director-clear').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector())).selected.birthday).toBeUndefined();
 await page.locator('#art-director-close').click();
 await expect(page.locator('#art-director-dialog')).not.toBeVisible();
 await page.locator('#start-btn').click();
 await page.keyboard.down('ArrowRight');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x),{timeout:3000}).toBeGreaterThan(74);
 await page.keyboard.up('ArrowRight');
 await page.locator('#pause-btn').click();
 await page.locator('#art-director-pause-open').click();
 await expect(page.locator('#art-director-dialog')).toBeVisible();
});

test('all 24 contract-blocked images remain viewable as reference but never become live scenery',async({page})=>{
 test.setTimeout(45000);
 await page.goto('./?art=classic');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.assets().loaded)).toBe(25);
 // Wait until the real title frame has finished its independent PNG/module
 // requests. A late source image must not masquerade as a forbidden Art
 // Director overlay appearing during the before/after comparison.
 await page.waitForLoadState('networkidle');
 const sample=()=>page.evaluate(()=>{
  const ctx=document.querySelector('#game').getContext('2d'),pixels=[];
  for(let y=16;y<540;y+=32)for(let x=16;x<960;x+=32)
   pixels.push(Array.from(ctx.getImageData(x,y,1,1).data));
  return pixels;
 });
 // Verify a stable title baseline, not a frame captured mid asset load.
 await expect.poll(async()=>{
  const previous=await sample();
  await page.waitForTimeout(120);
  const current=await sample();
  return JSON.stringify(previous)===JSON.stringify(current);
 },{timeout:8000}).toBe(true);
 const gameBefore=await sample();
 await page.locator('#art-director-title-open').click();
 await expect(page.locator('#art-director-list option')).toHaveCount(194);
 await page.locator('#art-director-role').selectOption('backdrop');
 await page.locator('#art-director-list').selectOption('BG-04');
 await expect.poll(async()=>page.locator('#art-director-apply').isEnabled(),{timeout:14000}).toBe(true);
 await expect(page.locator('#art-director-status')).toContainText('FAILED required transparency');
 await page.locator('#art-director-apply').click();
 const diagnostics=await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector());
 expect(diagnostics.selected.backdrop).toBe('BG-04');
 await expect(page.locator('#art-director-status')).toContainText('labeled QA inspection stage');
 await page.locator('#art-director-close').click();
 const gameAfter=await sample();
 const deltas=gameBefore.map((pixel,index)=>Math.max(...pixel.map((value,channel)=>
  Math.abs(value-gameAfter[index][channel]))));
 expect(Math.max(...deltas)).toBeLessThanOrEqual(16);
 expect(deltas.filter(delta=>delta>16)).toHaveLength(0,
  'Structurally blocked art must not produce any substantive live-playfield pixel change');
 await page.locator('#start-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector().selected.backdrop)).toBe('BG-04');
});

test('director captures keyboard focus, keeps pause state and dismisses with Escape',async({page})=>{
 await page.goto('./');
 await page.locator('#start-btn').click();
 if(await page.locator('#art-director-play-open').isVisible()){
  await page.locator('#art-director-play-open').click();
 }else{
  // Narrow phones reach the same native inspector from Pause, leaving the
  // live HUD uncluttered and retaining a 44px touch target.
  await page.locator('#pause-btn').click();
  await page.locator('#art-director-pause-open').click();
 }
 await expect(page.locator('#art-director-dialog')).toBeVisible();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('pause');
 await page.keyboard.press('Escape');
 await expect(page.locator('#art-director-dialog')).not.toBeVisible();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('pause');
 await page.locator('#resume-btn').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot())).mode).toBe('playing');
});


test('Art Jury links each specific original to its matching in-game runtime audition',async({page})=>{
 await page.goto('./tools/asset-gallery.html');
 await expect(page.locator('article[data-id="FOX-07"]')).toHaveCount(1);
 const target=page.locator('article[data-id="FOX-07"] a').filter({hasText:'AUDITION IN THE ACTUAL GAME'});
 await expect(target).toHaveAttribute('href','../?art=all&inspect=FOX-07');
 await page.goto('./?art=all&inspect=FOX-07');
 await expect(page.locator('#art-director-dialog')).toBeVisible();
 await expect.poll(async()=>page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector().current)).toBe('FOX-07');
 await expect.poll(async()=>page.locator('#art-director-apply').isEnabled(),{timeout:15000}).toBe(true);
 await page.locator('#art-director-apply').click();
 expect((await page.evaluate(()=>window.__SHAKEDOWN_QA.artDirector())).selected.fox).toBe('FOX-07');
});


test('a browser back-forward cache pagehide preserves the native art inspector',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>{
  const event=new Event('pagehide');
  Object.defineProperty(event,'persisted',{value:true});
  window.dispatchEvent(event);
 });
 await page.locator('#art-director-title-open').click();
 await expect(page.locator('#art-director-dialog')).toBeVisible();
 await expect(page.locator('#art-director-list option')).toHaveCount(194,{timeout:15000});
 await page.locator('#art-director-close').click();
 await expect(page.locator('#start-btn')).toBeVisible();
});
