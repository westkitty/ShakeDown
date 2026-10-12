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
  if(arg==='--headed'||arg==='--screenshots'||arg==='--calibrate'){out[arg.slice(2)]=true;continue}
  if(['--seconds','--base-url','--output','--scenario','--art'].includes(arg)){out[arg.slice(2)]=argv[++i];continue}
  throw Error('Usage: node scripts/perf-audit.mjs [--seconds 4] [--headed] [--scenario desktop|portrait|landscape|narrow] [--base-url URL] [--screenshots] [--output FILE]');
 }
 out.seconds=Number(out.seconds);
 if(!Number.isFinite(out.seconds)||out.seconds<2||out.seconds>20)throw Error('--seconds must be between 2 and 20');
 if(out.scenario&&!['desktop','portrait','landscape','narrow'].includes(out.scenario))throw Error('Unknown scenario');
 if(out.art&&!['classic','curated'].includes(out.art))throw Error('--art must be classic or curated');
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
// A same-context empty-page sample is a scheduling control, not a GPU benchmark.
async function sampleRaf(page,ms){
 return page.evaluate(async duration=>{
  const gaps=[];let last=null,frames=0;
  const end=performance.now()+duration;
  return new Promise(resolve=>{
   function tick(now){
    frames++;
    if(last!==null)gaps.push(now-last);
    last=now;
    if(now>=end){
     const sorted=gaps.sort((a,b)=>a-b);
     const at=q=>sorted.length?Number(sorted[Math.floor((sorted.length-1)*q)].toFixed(2)):null;
     resolve({frames,intervals:gaps.length,
      medianFrameMs:at(.5),p95FrameMs:at(.95),p99FrameMs:at(.99),
      maxFrameMs:at(1),approxFps:at(.5)?Number((1000/at(.5)).toFixed(1)):null,
      longFramesOver50ms:sorted.filter(x=>x>50).length});
    }else requestAnimationFrame(tick);
   }
   requestAnimationFrame(tick);
  });
 },ms);
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
   let blankBaseline=null;
   page.on('pageerror',e=>errors.push(e.message));
   try{
    if(options.calibrate){
     await page.goto('data:text/html,<title>Empty rAF control</title>');
     blankBaseline=await sampleRaf(page,2000);
    }
    const gameUrl=new URL(url);
    if(options.art)gameUrl.searchParams.set('art',options.art);
    const response=await page.goto(gameUrl.toString(),{waitUntil:'domcontentloaded',timeout:15000});
    await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.snapshot==='function');
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
    const samples=await sampleRaf(page,options.seconds*1000);
    const after=await page.evaluate(()=>({
     mode:window.__SHAKEDOWN_QA.snapshot().mode,
     playerX:window.__SHAKEDOWN_QA.snapshot().player.x,
     instrumentation:window.__SHAKEDOWN_QA.metrics(),
     heapBytes:performance.memory?.usedJSHeapSize??null,
     assets:window.__SHAKEDOWN_QA.assets(),
     network:{resourceCount:performance.getEntriesByType('resource').length,
      encodedBodyBytes:performance.getEntriesByType('resource').reduce((sum,entry)=>sum+(entry.encodedBodySize||0),0)},
     canvasCss:{width:document.querySelector('#game').getBoundingClientRect().width,
      height:document.querySelector('#game').getBoundingClientRect().height}
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
    if(samples.p95FrameMs>80){
     if(blankBaseline?.p95FrameMs>80)
      warnings.push('Empty-page control is also throttled; game-specific FPS attribution is not supported');
     else warnings.push('Game frame pacing is slow; compare representative hardware before attributing cause');
    }
    if(latencyMs===null)warnings.push('Input movement not observed within automation timeout');
    if(errors.length)warnings.push('Uncaught browser runtime errors');
    readings.push({name:preset.name,viewport:{width:preset.width,height:preset.height},
     httpStatus:response.status(),layout:before,movement:{initialX:x0,finalX:after.playerX,
      automationToMotionMs:latencyMs},rAF:samples,emptyPageControl:blankBaseline,game:after,
      pageErrors:errors,warnings,screenshot});
   }finally{await context.close()}
  }
  const report={schemaVersion:1,measuredAt:new Date().toISOString(),
   environment:'Playwright-controlled desktop Chromium or Brave; mobile layouts are emulated',
   timing:'Real wall-clock rAF. Empty-page control is same browser/context, not a physical device benchmark. Automation-to-motion includes runner overhead.',
   art:options.art||'default-curated',emptyPageCalibration:!!options.calibrate,
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
