import {test,expect} from '@playwright/test';

test('meaningful pickups before first checkpoint create resumable progress',async({page})=>{
 await page.goto('./?qa=1&art=classic');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),q=s.level.shakes.find(q=>q.id==='quad-shake-1');
  qa.warp(q.x-s.player.w/2,q.y-s.player.h/2);
 });
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().shakeCount)).toBeGreaterThan(0);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1'))?.progress?.index)).toBe(0);
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await page.locator('#continue-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().shakeCount)).toBeGreaterThan(0);
});

test('bell progress and enemy defeats save between checkpoints without autosave spamming',async({page})=>{
 await page.addInitScript(()=>{
  window.__birthdaySaveWrites=0;
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(key==='shakedown:birthday:v1')window.__birthdaySaveWrites++;
   return original.call(this,key,value);
  };
 });
 await page.goto('./?qa=1&art=classic');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),cp=s.level.checkpoints[1];
  qa.warp(cp.x+3,cp.footY-s.player.h);s.player.grounded=true;
 });
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1'))?.progress?.index)).toBe(1);
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),post=s.level.rallyPosts[0];
  qa.warp(post.x-s.player.w/2,post.footY-s.player.h);
  s.player.grounded=true;s.cheerCooldown=0;
 });
 await page.locator('#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1'))?.progress?.rallies)).toContain('canopy-bell');
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),enemy=s.level.enemies.find(e=>e.id==='cup-lawn');
  qa.warp(enemy.x-72,enemy.y-5);
  s.player.facing=1;s.player.attackCooldown=0;
 });
 await page.keyboard.press('j');
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1'))?.progress?.defeated)).toContain('cup-lawn');
 const writes=await page.evaluate(()=>window.__birthdaySaveWrites);
 await page.waitForTimeout(320);
 expect(await page.evaluate(()=>window.__birthdaySaveWrites)).toBe(writes);
 await page.reload();
 await page.locator('#continue-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().level.rallyPosts[0].lit)).toBe(true);
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.inspectState().level.enemies.find(e=>e.id==='cup-lawn').alive)).toBe(false);
});

test('pause journal lists all four bells with real status and keyboard-openable details',async({page},testInfo)=>{
 await page.goto('./?qa=1&art=classic');
 await page.locator('#start-btn').click();
 await page.keyboard.press('p');
 await expect(page.locator('#pause-overlay')).toBeVisible();
 const summary=page.locator('#rally-journal summary');
 await summary.focus();
 await expect(summary).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.locator('#rally-journal')).toHaveAttribute('open','');
 await expect(page.locator('#rally-journal-list li')).toHaveCount(4);
 await expect(page.locator('#rally-journal-list li').first()).toContainText('CANOPY', {ignoreCase:true});
 await expect(page.locator('#rally-journal-list li').first()).toContainText('NOT YET RUNG');
 await expect(page.locator('#cheer-touch')).toBeDisabled();
 await page.locator('#resume-btn').click();
 await expect(page.locator('#cheer-touch')).toBeEnabled();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),post=s.level.rallyPosts[0];
  qa.warp(post.x-s.player.w/2,post.footY-s.player.h);
  s.player.grounded=true;s.cheerCooldown=0;
 });
 await page.locator('#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 await page.keyboard.press('p');
 await expect(page.locator('#rally-journal-list li').first()).toContainText('RUNG');
 await expect(page.locator('#rally-journal-note')).toContainText('Best run: 1/4');
 if(testInfo.project.name==='mobile-chromium'){
  await expect(page.locator('#rally-journal')).toHaveAttribute('open','');
  await page.locator('#rally-journal-list li').last().scrollIntoViewIfNeeded();
  await expect(page.locator('#rally-journal-list li').last()).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('omni-rally-journal-mobile.png')});
 }
});

test('earned bell best is visible on fresh title while new round clears current bell state',async({page})=>{
 await page.goto('./?qa=1&art=classic');
 await expect(page.locator('#rally-personal-best')).toBeHidden();
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState(),post=s.level.rallyPosts[0];
  qa.warp(post.x-s.player.w/2,post.footY-s.player.h);s.player.grounded=true;
 });
 await page.locator('#game').focus();
 await page.keyboard.press('c');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(1);
 await page.reload();
 await expect(page.locator('#rally-personal-best')).toContainText('1/4');
 await page.locator('#start-btn').click();
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().rallyCount)).toBe(0);
 await page.keyboard.press('p');
 await expect(page.locator('#rally-journal-note')).toContainText('Best run: 1/4');
});

test('a deliberately delayed game module leaves Start inert until input handlers are ready',async({page})=>{
 let releaseModule=null;
 await page.route('**/src/game/engine.mjs',async route=>{
  await new Promise(resolve=>{releaseModule=resolve;});
  await route.continue();
 });
 await page.goto('./?qa=1&art=classic',{waitUntil:'commit'});
 const start=page.locator('#start-btn');
 await expect(start).toBeDisabled();
 await expect(page.locator('#art-director-title-open')).toBeDisabled();
 await expect.poll(()=>Boolean(releaseModule),{timeout:8000}).toBe(true);
 releaseModule();
 await expect(start).toBeEnabled({timeout:12000});
 await start.click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.snapshot().mode)).toBe('playing');
});

test('a real same-tick fatal collision cannot erase a Shake earned earlier in that frame',async({page})=>{
 await page.goto('./?qa=1&art=classic');
 await page.locator('#start-btn').click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
  const shake=s.level.shakes.find(q=>q.id==='quad-shake-1');
  qa.warp(shake.x-s.player.w/2,shake.y-s.player.h/2);
  s.player.hp=1;s.player.invulnerable=0;
  const enemy=s.level.enemies.find(e=>e.id==='cup-lawn');
  enemy.baseX=shake.x-enemy.w/2;enemy.range=0;enemy.x=enemy.baseX;
  enemy.y=s.player.y+10;
 });
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().mode)).toBe('dead');
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('shakedown:birthday:v1'))?.progress);
 expect(record?.checkpointId).toBe('Welcome Lawn');
 expect(record?.collected).toContain('quad-shake-1');
 await page.reload();
 await expect(page.locator('#continue-btn')).toBeVisible();
 await page.locator('#continue-btn').click();
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().shakeCount)).toBe(1);
});
