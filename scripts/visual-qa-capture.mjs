#!/usr/bin/env node
// Repeatable, QA-only camera inspection of the actual existing Canvas runtime.
// Screenshots are diagnostics; position fixtures do not establish a playthrough.
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
const output=process.argv[2];
if(!output||!output.startsWith('/'))throw Error('Provide absolute screenshot output directory');
const port=8892,server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try{
 for(let n=0;n<35;n++){
  try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok)break}catch{}
  await new Promise(done=>setTimeout(done,120));
 }
 browser=await chromium.launch({
  headless:true,
  executablePath:process.env.SHAKEDOWN_BROWSER_PATH||undefined
 });
 const page=await browser.newPage({viewport:{width:1280,height:850},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+port+'/?qa=1&art=curated',{waitUntil:'domcontentloaded'});
 await page.locator('#start-btn').click();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.assets().loaded>=25,{timeout:30000});
 await page.waitForTimeout(2000);
 await fs.mkdir(output,{recursive:true});
 const cases=[
  ['01-lawn',270,382,'playing',null],
  ['02-quad',1860,382,'playing',null],
  ['03-rally',1115,177,'playing',null],
  ['04-dome',5240,-430,'playing',null],
  ['05-cornice',6420,-955,'playing',null],
  ['06-boss',7810,-1230,'playing','tell'],
  ['07-victory',7810,-1230,'victory','defeated']
 ];
 for(const [name,x,y,mode,boss] of cases){
  await page.evaluate(({x,y,mode,boss})=>{
   const qa=window.__SHAKEDOWN_QA,s=qa.inspectState();
   qa.warp(x,y);
   s.player.grounded=true;s.player.vx=0;s.player.vy=0;s.player.invulnerable=0;
   s.elapsed=15;s.time=15;s.cheerWave=0;s.shakePickup=0;
   s.boss.triggered=Boolean(boss);s.boss.mode=boss||'sleep';
   s.mode=mode;
  },{x,y,mode,boss});
  await page.waitForTimeout(260);
  await page.locator('#game').screenshot({path:output+'/'+name+'.png'});
  if(name==='07-victory')
   await page.screenshot({path:output+'/07-victory-full.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.evaluate(()=>{const s=window.__SHAKEDOWN_QA.inspectState();
  s.mode='playing';s.boss.triggered=false;window.__SHAKEDOWN_QA.warp(1115,177);});
 await page.waitForTimeout(260);
 await page.screenshot({path:output+'/08-mobile-portrait.png',fullPage:true});
 await fs.writeFile(output+'/metadata.json',JSON.stringify({
  screenshots:cases.map(x=>x[0]),worldAssets:await page.evaluate(()=>window.__SHAKEDOWN_QA.assets()),
  errors
 },null,2));
 console.log('VISUAL_CAPTURE_OK '+output+' ERRORS='+errors.length);
 if(errors.length)process.exitCode=2;
}finally{await browser?.close();server.kill()}
