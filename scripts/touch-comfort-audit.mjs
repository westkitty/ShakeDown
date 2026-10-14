// QA-only screenshot and layout sampler for mobile touch comfort.
// No production dependencies or external network calls.
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from '@playwright/test';
const root=process.cwd(),port=8791;
const output=process.argv[2]||'/tmp/shakedown-touch-comfort-audit';
fs.mkdirSync(output,{recursive:true});
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{cwd:root,stdio:'ignore'});
let browser;
const snapshots=[],faults=[];
const url='http://127.0.0.1:'+port+'/?qa=1&skip-brand=1&art=curated';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 for(let i=0;i<45;i++){
  try{const r=await fetch('http://127.0.0.1:'+port+'/');if(r.ok)break}catch{}
  await wait(120);
 }
 browser=await chromium.launch({headless:true,...(process.env.SHAKEDOWN_BROWSER_PATH?{executablePath:process.env.SHAKEDOWN_BROWSER_PATH}:{})});
 const ctx=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 const page=await ctx.newPage();
 page.on('pageerror',err=>faults.push(err.message));
 await page.goto(url);
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA?.controls);
 const capture=async(name)=>{
  await page.screenshot({path:path.join(output,name+'.png'),animations:'disabled'});
  const layout=await page.evaluate(()=>{
   const box=id=>{const el=document.querySelector(id);if(!el)return null;
    const r=el.getBoundingClientRect(),style=getComputedStyle(el);
    return{x:Math.round(r.x),y:Math.round(r.y),width:Math.round(r.width),height:Math.round(r.height),
     visible:style.display!=='none'&&style.visibility!=='hidden'};
   };
   return{mode:document.body.dataset.gameMode,full:window.__SHAKEDOWN_QA.controls().fullscreen,
    bodyWidth:document.documentElement.scrollWidth,viewport:box('#viewport'),frame:box('#game-frame'),
    pad:box('#gesture-pad'),auto:box('#auto-run-toggle'),jump:box('.touch-jump'),
    menu:box('#title-overlay .hero-panel'),settings:box('#touch-settings-dialog')};
  });
  snapshots.push({name,layout});
 };
 await capture('01-title');
 await page.locator('#controls-title-btn').tap();
 await capture('02-comfort-settings');
 await page.locator('#comfort-done').tap();
 await page.locator('#start-btn').tap();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.snapshot().mode==='playing');
 await page.waitForTimeout(240);
 await capture('03-gameplay-default');
 await page.evaluate(()=>window.__SHAKEDOWN_QA.warp(1390,600));
 await page.waitForTimeout(220);
 await capture('04-smudge-wide');
 await page.locator('#controls-game-btn').tap();
 await page.locator('#comfort-hand').selectOption('left');
 await page.locator('#comfort-size').selectOption('large');
 await page.locator('#comfort-height').selectOption('raised');
 await page.locator('#comfort-done').tap();
 await page.locator('#resume-btn').tap();
 await page.waitForTimeout(150);
 await capture('05-left-handed-large');
 await ctx.close();
 console.log(JSON.stringify({pass:faults.length===0,errors:faults,snapshots},null,2));
 if(faults.length)process.exitCode=2;
}finally{
 await browser?.close();
 server.kill();
}
