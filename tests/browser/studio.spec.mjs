import {test,expect} from '@playwright/test';
import {PNG} from 'pngjs';

test('asset control room reads exactly the canonical real contract and empty approved registry',async({page})=>{
 const uploads=[];
 page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))uploads.push(r.url())});
 await page.goto('./tools/asset-review.html#asset=BG-01');
 await expect(page.locator('#total-visual')).toHaveText('220');
 await expect(page.locator('#source-count')).toHaveText('26');
 await expect(page.locator('#approved-count')).toHaveText('0');
 await expect(page.locator('#pending-count')).toHaveText('215');
 await expect(page.locator('#detail-id')).toHaveText('BG-01');
 await expect(page.locator('#detail-size')).toContainText('960 × 540');
 expect(uploads).toEqual([]);
 await page.locator('#search').fill('birthday cake');
 await page.locator('#priority-filter').selectOption('all');
 await expect(page.locator('#filtered-count')).toContainText('matching');
 expect(await page.locator('#asset-list .asset-option').count()).toBeGreaterThan(0);
 await page.locator('#type-filter').selectOption('audio');
 await page.locator('#search').fill('');
 await expect(page.locator('#filtered-count')).toHaveText('21 matching');
 await page.locator('#priority-filter').selectOption('all');
 await expect(page.locator('#filtered-count')).toHaveText('21 matching');
});
test('private candidate intake checks true PNG bytes, exact pixels and alpha without production promotion',async({page})=>{
 await page.goto('./tools/asset-review.html#asset=BG-01');
 await expect(page.locator('#detail-id')).toHaveText('BG-01');
 const valid=new PNG({width:960,height:540});
 for(let i=0;i<valid.data.length;i+=4){valid.data[i]=80;valid.data[i+1]=160;valid.data[i+2]=210;valid.data[i+3]=255;}
 await page.locator('#candidate').setInputFiles({name:'BG-01-local.png',mimeType:'image/png',buffer:PNG.sync.write(valid)});
 await expect(page.locator('#candidate-result')).toContainText('STRUCTURE CHECK PASSED');
 await expect(page.locator('#candidate-result')).toContainText('NOT ART APPROVAL');
 await expect(page.locator('#preview img')).toBeVisible();
 const wrong=new PNG({width:32,height:32});
 await page.locator('#candidate').setInputFiles({name:'wrong-dimensions.png',mimeType:'image/png',buffer:PNG.sync.write(wrong)});
 await expect(page.locator('#candidate-result')).toContainText('REJECTED');
 await expect(page.locator('#candidate-result')).toContainText('Dimensions differ from contract');
 await expect(page.locator('#approved-count')).toHaveText('0');
});
test('studio is legible on phone emulation and supports deep-linkable asset IDs',async({page},testInfo)=>{
 await page.goto('./tools/asset-review.html#asset=FOX-05');
 await expect(page.locator('#detail-id')).toHaveText('FOX-05');
 await expect(page.locator('#detail-name')).toContainText('Fox charge tell');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
 await expect(page.locator('#candidate')).toBeVisible();
 await page.locator('#search').fill('Cinnamon');
 await page.locator('#status-filter').selectOption('all');
 await page.locator('#priority-filter').selectOption('all');
 expect(await page.locator('.asset-option').count()).toBeGreaterThan(0);
 console.log('Asset review viewport',testInfo.project.name);
});


test('studio rejects truncated WAV and checks real PCM chunks before manual listening',async({page})=>{
 await page.goto('./tools/asset-review.html#asset=AU-01');
 await expect(page.locator('#detail-id')).toHaveText('AU-01');
 const fake=Buffer.alloc(12);fake.write('RIFF',0);fake.write('WAVE',8);
 await page.locator('#candidate').setInputFiles({
  name:'misleading.wav',mimeType:'audio/wav',buffer:fake
 });
 await expect(page.locator('#candidate-result')).toContainText('REJECTED');
 await expect(page.locator('#candidate-result')).toContainText('WAV shorter');
 const audioBytes=800;
 const wav=Buffer.alloc(44+audioBytes);
 wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVE',8);
 wav.write('fmt ',12);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);
 wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);
 wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
 wav.write('data',36);wav.writeUInt32LE(audioBytes,40);
 await page.locator('#candidate').setInputFiles({
  name:'synthetic-test.wav',mimeType:'audio/wav',buffer:wav
 });
 await expect(page.locator('#candidate-result')).toContainText('STRUCTURE CHECK PASSED');
 await expect(page.locator('#candidate-result')).toContainText('WAV 1 ch / 8000 Hz');
 await expect(page.locator('#candidate-result')).toContainText('human review');
 await expect(page.locator('#approved-count')).toHaveText('0');
});


test('copying a staging template shell-quotes hostile filenames rather than executing them',async({page})=>{
 await page.goto('./tools/asset-review.html#asset=BG-01');
 await expect(page.locator('#detail-id')).toHaveText('BG-01');
 const hostile="red'$(echo SHOULD_NOT_RUN).png";
 const p=new PNG({width:32,height:32});
 await page.locator('#candidate').setInputFiles({
  name:hostile,mimeType:'image/png',buffer:PNG.sync.write(p)
 });
 await expect(page.locator('#candidate-result')).toContainText('REJECTED');
 await page.evaluate(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
   writeText:async value=>{window.__copiedReviewCommand=value}
  }});
 });
 await page.locator('#copy-command').click();
 const command=await page.evaluate(()=>window.__copiedReviewCommand);
 expect(command).toContain('node scripts/asset-intake.mjs stage --id BG-01');
 expect(command).toContain("red'\\''$(echo SHOULD_NOT_RUN).png'");
 expect(await page.evaluate(()=>window.__SHAKEDOWN_QA)).toBeUndefined();
});


test('studio never conflates human-reviewed art with active in-game integration',async({page})=>{
 const record=(path,integrationStatus)=>({
  path,reviewStatus:'reviewer-attested',integrationStatus,width:64,height:96
 });
 const ledger={schemaVersion:1,assets:{
  'BG-01':record('assets/level1/backgrounds/bg_01.png','unverified'),
  'CO-03':record('assets/level1/collectibles/co_03_shamrock_shake_cup.png','verified')
 },audio:{}};
 await page.route('**/assets/runtime/manifest.json',route=>route.fulfill({json:ledger}));
 await page.goto('./tools/asset-review.html#asset=BG-01');
 await expect(page.locator('#approved-count')).toHaveText('2');
 await expect(page.locator('#activated-count')).toHaveText('1');
 await expect(page.locator('#pending-count')).toHaveText('213');
 await expect(page.locator('#detail-state')).toHaveText('REVIEWED, NOT ACTIVE');
 const local=await page.evaluate(()=>['localhost','127.0.0.1'].includes(location.hostname));
 if(local)await expect(page.locator('#preview-in-game')).toBeVisible();
 else await expect(page.locator('#preview-in-game')).toBeHidden();
 await expect(page.locator('#preview-in-game')).toHaveAttribute('href','../index.html?preview-art=BG-01');
 await expect(page.locator('#copy-activation')).toBeEnabled();
 await page.goto('./tools/asset-review.html#asset=CO-03');
 await expect(page.locator('#detail-state')).toHaveText('ACTIVE IN GAME');
 await expect(page.locator('#preview-in-game')).toHaveAttribute('href','../index.html');
 await expect(page.locator('#copy-activation')).toBeDisabled();
});
