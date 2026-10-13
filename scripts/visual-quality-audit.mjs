import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';
const dir=process.argv[2]||'/tmp/shakedown-visual-qa';
const port=8789,root=process.cwd();
fs.mkdirSync(dir,{recursive:true});
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
const errors=[],result={source:root,scenes:[],errors};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitServer(){
 for(let n=0;n<40;n++){try{if((await fetch('http://127.0.0.1:'+port+'/')).ok)return}catch{}await sleep(150)}
 throw Error('Local HTTP server failed');
}
async function start(page){
 await page.goto('http://127.0.0.1:'+port+'/?qa=1&skip-brand=1&art=curated',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.warp==='function');
 await page.locator('#start-btn').click();
 if(await page.locator('#intro-skip').isVisible())await page.locator('#intro-skip').click();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.snapshot().mode==='playing',{timeout:8000});
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.assets().worldLoaded===35,{timeout:30000});
}
try{
 await waitServer();
 browser=await chromium.launch({headless:true,...(process.env.SHAKEDOWN_BROWSER_PATH?{executablePath:process.env.SHAKEDOWN_BROWSER_PATH}:{})});
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'no-preference'});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await start(page);
 const startX=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(270);await page.keyboard.up('ArrowRight');
 result.keyboardDelta=Number(((await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x))-startX).toFixed(2));
 for(const item of [{name:'quad',x:280,y:335},{name:'ascent',x:5150,y:-540},{name:'summit',x:7720,y:-1270,boss:true}]){
  await page.evaluate(({x,y,boss})=>{
   const qa=window.__SHAKEDOWN_QA;
   qa.warp(x,y);
   if(boss){const b=qa.inspectState().boss;b.triggered=true;b.mode='tell';b.timer=999;b.hp=3}
  },item);
  await page.waitForTimeout(280);
  await page.locator('#viewport').screenshot({path:path.join(dir,item.name+'.png'),animations:'disabled'});
  result.scenes.push({name:item.name,shot:item.name+'.png',state:await page.evaluate(()=>{const s=window.__SHAKEDOWN_QA.snapshot();return{mode:s.mode,playerX:s.player.x,playerY:s.player.y,zone:s.zone}}),metrics:await page.evaluate(()=>window.__SHAKEDOWN_QA.metrics())});
 }
 await context.close();
 const mobile=await browser.newContext({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const landscape=await mobile.newPage();
 landscape.on('pageerror',e=>errors.push(e.message));
 await start(landscape);
 await landscape.locator('#viewport').screenshot({path:path.join(dir,'landscape.png')});
 result.landscape=await landscape.evaluate(()=>{
  const pad=document.getElementById('gesture-pad').getBoundingClientRect();
  const viewport=document.getElementById('viewport').getBoundingClientRect();
  return{innerWidth,scrollWidth:document.documentElement.scrollWidth,pad:{x:pad.x,y:pad.y,w:pad.width,h:pad.height},viewport:{x:viewport.x,y:viewport.y,w:viewport.width,h:viewport.height},mode:window.__SHAKEDOWN_QA.snapshot().mode};
 });
 await mobile.close();
 result.pass=result.keyboardDelta>4&&result.scenes.length===3&&result.landscape.pad.w>=95&&errors.length===0;
}finally{
 await browser?.close();
 server.kill();
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(result,null,2)+'\n');
}
console.log(JSON.stringify(result,null,2));
if(!result.pass)process.exitCode=2;
