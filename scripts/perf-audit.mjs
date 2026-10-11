#!/usr/bin/env node
// Actual wall-clock requestAnimationFrame and Canvas timing audit.
// This is browser automation, NOT physical-phone or human-paced play proof.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';
const ROOT=process.cwd(),PORT=8797;
function args(argv){
 const out={seconds:4,headed:false,screenshots:false};
 for(let i=0;i<argv.length;i++){
  const arg=argv[i];
  if(arg==='--headed'||arg==='--screenshots'){out[arg.slice(2)]=true;continue}
  if(['--seconds','--base-url','--output','--scenario'].includes(arg)){out[arg.slice(2)]=argv[++i];continue}
  throw Error('Usage: node scripts/perf-audit.mjs [--seconds 4] [--headed] [--scenario desktop|portrait|landscape|narrow] [--base-url URL] [--screenshots] [--output FILE]');
 }
 out.seconds=Number(out.seconds);
 if(!Number.isFinite(out.seconds)||out.seconds<2||out.seconds>20)throw Error('--seconds must be between 2 and 20');
 if(out.scenario&&!['desktop','portrait','landscape','narrow'].includes(out.scenario))throw Error('Unknown scenario');
 return out;
}
function scenario(name,width,height,isMobile){
 return{name,width,height,isMobile,hasTouch:isMobile,deviceScaleFactor:isMobile?2:1};
}
const SCENARIOS=[
 scenario('desktop',1280,800,false),
 scenario('portrait',390,844,true),
 scenario('landscape',844,390,true),
 scenario('narrow',320,568,true)
];
async function waitForServer(url){
 for(let attempt=0;attempt<40;attempt++){
  try{const response=await fetch(url,{signal:AbortSignal.timeout(1500)});
   if(response.ok)return;
  }catch{}
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 throw Error('Could not reach local static server: '+url);
}
async function run(){
 const options=args(process.argv.slice(2));
 let server=null,browser=null;
 const url=options['base-url']||process.env.SHAKEDOWN_BASE_URL||'http://127.0.0.1:'+PORT+'/';
 try{
  if(!options['base-url']&&!process.env.SHAKEDOWN_BASE_URL){
   server=spawn('python3',['-m','http.server',String(PORT),'--bind','127.0.0.1'],
    {cwd:ROOT,stdio:'ignore'});
  }
  await waitForServer(url);
  browser=await chromium.launch({
   headless:!options.headed,
   ...(process.env.SHAKEDOWN_BROWSER_PATH?
    {executablePath:process.env.SHAKEDOWN_BROWSER_PATH}:{})
  });
  const readings=[];
  for(const preset of SCENARIOS.filter(x=>!options.scenario||x.name===options.scenario)){
   const context=await browser.newContext({
    viewport:{width:preset.width,height:preset.height},
    isMobile:preset.isMobile,hasTouch:preset.hasTouch,
    deviceScaleFactor:preset.deviceScaleFactor
   });
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   try{
    const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:15000});
    await page.locator('#start-btn').waitFor({state:'visible'});
    const before=await page.evaluate(()=>({
     innerWidth:window.innerWidth,scrollWidth:document.documentElement.scrollWidth,
     primary:(()=>{const r=document.querySelector('#start-btn').getBoundingClientRect();
       return{top:r.top,bottom:r.bottom,width:r.width,height:r.height}})(),
     touchTargets:[...document.querySelectorAll('.touch')].map(e=>{
       const r=e.getBoundingClientRect();
       return{name:e.dataset.action,width:r.width,height:r.height,bottom:r.bottom}
     }).filter(x=>x.width>0)
    }));
    await page.locator('#start-btn').click();
    await page.locator('#game').focus();
    const x0=await page.evaluate(()=>window.__SHAKEDOWN_QA.snapshot().player.x);
    const start=Date.now();
    await page.keyboard.down('ArrowRight');
    let latencyMs=null;
    try{
     await page.waitForFunction(x=>window.__SHAKEDOWN_QA.snapshot().player.x>x+3,x0,{timeout:2500});
     latencyMs=Date.now()-start; // Includes automation and event-loop overhead.
    }catch{}
    await page.keyboard.up('ArrowRight');
    const samples=await page.evaluate(async ms=>{
     const gaps=[];let last=null,frames=0;
     const end=performance.now()+ms;
     return new Promise(resolve=>{
      function tick(now){
       frames++;
       if(last!==null)gaps.push(now-last);
       last=now;
       if(now>=end){
        const sorted=gaps.sort((a,b)=>a-b);
        const at=q=>sorted.length?Number(sorted[Math.floor((sorted.length-1)*q)].toFixed(2)):null;
        resolve({frames,intervals:gaps.length,
         medianFrameMs:at(.5),p95FrameMs:at(.95),maxFrameMs:at(1),
         approxFps:at(.5)?Number((1000/at(.5)).toFixed(1)):null,
         longFramesOver50ms:sorted.filter(x=>x>50).length});
       }else requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
     });
    },options.seconds*1000);
    const after=await page.evaluate(()=>({
     mode:window.__SHAKEDOWN_QA.snapshot().mode,
     playerX:window.__SHAKEDOWN_QA.snapshot().player.x,
     instrumentation:window.__SHAKEDOWN_QA.metrics(),
     heapBytes:performance.memory?.usedJSHeapSize??null
    }));
    let screenshot=null;
    if(options.screenshots){
     const folder=path.join(ROOT,'test-results','perf-audit');
     fs.mkdirSync(folder,{recursive:true});
     screenshot=path.join(folder,preset.name+'.png');
     await page.screenshot({path:screenshot,fullPage:true,animations:'disabled'});
    }
    const warnings=[];
    if(before.scrollWidth>preset.width+2)warnings.push('Horizontal layout exceeds physical viewport width');
    if(before.primary.top>=preset.height||before.primary.bottom<=0)
     warnings.push('Start button is outside first viewport; scrolling required');
    if(before.touchTargets.some(x=>x.width<44||x.height<44))
     warnings.push('Some touch targets are below 44 CSS pixels');
    if(samples.p95FrameMs>80)
     warnings.push('Browser requestAnimationFrame pacing throttled; not evidence of playable FPS');
    if(latencyMs===null)warnings.push('Input movement not observed within automation timeout');
    if(errors.length)warnings.push('Uncaught browser runtime errors');
    readings.push({name:preset.name,viewport:{width:preset.width,height:preset.height},
     httpStatus:response.status(),layout:before,movement:{initialX:x0,finalX:after.playerX,
      automationToMotionMs:latencyMs},rAF:samples,game:after,
      pageErrors:errors,warnings,screenshot});
   }finally{await context.close()}
  }
  const report={schemaVersion:1,measuredAt:new Date().toISOString(),
   environment:'Playwright-controlled desktop Chromium or Brave; mobile layouts are emulated',
   timing:'Real wall-clock rAF, not a virtualized clock. May be throttled on remote/headless Macs.',
   scenarios:readings,passing:readings.every(x=>!x.pageErrors.length&&x.httpStatus===200)};
  if(options.output){
   const destination=path.resolve(options.output);
   fs.mkdirSync(path.dirname(destination),{recursive:true});
   fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
  }
  console.log(JSON.stringify(report,null,2));
  if(!report.passing)process.exitCode=2;
 }finally{await browser?.close();server?.kill()}
}
run().catch(error=>{console.error('Performance audit unavailable: '+error.message);process.exitCode=1});
