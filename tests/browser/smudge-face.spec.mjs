import {test,expect} from '@playwright/test';

// Inspect real Canvas pixels in the running game. The former face accessory
// painted gold (#dfbf71) rounded-rectangle strokes over Smudge's blue eyes.
async function measureFace(page){
 return page.evaluate(()=>{
  const s=window.__SHAKEDOWN_QA.inspectState();
  const npc=s.level.secretNpcs.find(n=>n.id==='smudge');
  const canvas=document.querySelector('#game');
  const sx=canvas.width/960,sy=canvas.height/540;
  const x=Math.round((npc.x-46-s.camera.x)*sx);
  const y=Math.round((npc.footY-116-s.camera.y)*sy);
  const w=Math.round(92*sx),h=Math.round(46*sy);
  if(x<0||y<0||x+w>canvas.width||y+h>canvas.height)
   throw new Error('Smudge face is outside the game canvas');
  const data=canvas.getContext('2d').getImageData(x,y,w,h).data;
  let visor=0,eyes=0;
  for(let i=0;i<data.length;i+=4){
   const r=data[i],g=data[i+1],b=data[i+2];
   if(r===223&&g===191&&b===113)visor++;
   if(r<=125&&g>=100&&b>=140&&b-r>=38)eyes++;
  }
  return {visor,eyes,npcLoaded:window.__SHAKEDOWN_QA.assets().npcLoaded};
 });
}

test('Smudge has unobstructed blue eyes in both animation poses on desktop and mobile',async({page},testInfo)=>{
 test.setTimeout(60000);
 const errors=[],missing=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{
  if(r.status()>=400&&r.url().includes('/assets/sprites/'))missing.push(r.url());
 });
 await page.goto('./?qa=1&art=classic');
 await expect.poll(()=>page.evaluate(()=>window.__SHAKEDOWN_QA?.assets?.().npcLoaded),{timeout:15000}).toBe(8);
 const start=page.locator('#start-btn');
 if(testInfo.project.name==='mobile-chromium')await start.tap();
 else await start.click();
 await page.evaluate(()=>{
  const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
  const npc=s.level.secretNpcs.find(n=>n.id==='smudge');
  qa.warp(npc.x-150-s.player.w/2,npc.footY-s.player.h);
  s.player.grounded=true;s.player.jumpsUsed=0;s.player.vy=0;
  s.player.onPlatform='secret-smudge-alcove';
 });
 for(const [pose,t] of [['idle-a',0.05],['idle-b',0.33]]){
  await page.evaluate(v=>{window.__SHAKEDOWN_QA.inspectState().elapsed=v},t);
  await page.waitForTimeout(110);
  const face=await measureFace(page);
  expect(face.npcLoaded).toBe(8);
  expect(face.visor,'Gold visor pixels obscure Smudge: '+pose).toBe(0);
  expect(face.eyes,'Smudge blue eyes invisible: '+pose).toBeGreaterThan(4);
  await page.screenshot({path:testInfo.outputPath('smudge-'+pose+'.png')});
 }
 expect(errors).toEqual([]);
 expect(missing).toEqual([]);
});
