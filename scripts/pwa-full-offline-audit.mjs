// Full ShakeDown PWA installation/real offline playback audit.
// Serves the exact Pages subdirectory shape (/ShakeDown/), installs ALL files,
// then disconnects the browser and verifies gameplay, music, videos and tools.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PREFIX='/ShakeDown/';
const reportFile=process.argv[2]||'/tmp/shakedown-pwa-full-offline-audit.json';
const timeout=Number(process.env.SHAKEDOWN_PWA_TIMEOUT_MS)||240000;
const contentTypes={
 '.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
 '.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8',
 '.json':'application/json','.webmanifest':'application/manifest+json',
 '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
 '.webp':'image/webp','.mp3':'audio/mpeg','.mp4':'video/mp4',
 '.webm':'video/webm','.md':'text/markdown','.pdf':'application/pdf'
};
const server=http.createServer((req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(!pathname.startsWith(PREFIX)){res.writeHead(404).end();return}
  const rel=decodeURIComponent(pathname.slice(PREFIX.length))||'index.html';
  if(!rel||rel.startsWith('/')||rel.split('/').some(item=>item==='..')||rel.includes('\\')){
   res.writeHead(403).end();return;
  }
  const filename=path.resolve(ROOT,rel);
  if(!filename.startsWith(ROOT+path.sep)){res.writeHead(403).end();return}
  const stat=fs.statSync(filename);
  if(!stat.isFile()){res.writeHead(404).end();return}
  const type=contentTypes[path.extname(filename)]||'application/octet-stream';
  const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');
  const head=req.method==='HEAD';
  const headers={'Content-Type':type,'Cache-Control':'public, max-age=0','Accept-Ranges':'bytes'};
  if(range){
   const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),stat.size-1):stat.size-1;
   if(start>=stat.size||end<start){
    res.writeHead(416,{...headers,'Content-Range':'bytes */'+stat.size}).end();return;
   }
   const length=end-start+1;
   res.writeHead(206,{...headers,'Content-Length':String(length),
    'Content-Range':`bytes ${start}-${end}/${stat.size}`});
   if(!head)fs.createReadStream(filename,{start,end}).pipe(res);else res.end();
  }else{
   res.writeHead(200,{...headers,'Content-Length':String(stat.size)});
   if(!head)fs.createReadStream(filename).pipe(res);else res.end();
  }
 }catch(error){res.writeHead(error.code==='ENOENT'?404:500).end()}
});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let browser=null;
const messages=[],faults=[],checks=[],badResponses=[],failedRequests=[];
const record=(step,result)=>checks.push({step,...result});
try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const address=`http://127.0.0.1:${server.address().port}${PREFIX}`;
 browser=await chromium.launch({headless:true,
  ...(process.env.SHAKEDOWN_BROWSER_PATH?{executablePath:process.env.SHAKEDOWN_BROWSER_PATH}:{})});
 const context=await browser.newContext({viewport:{width:844,height:390},
  isMobile:true,hasTouch:true,serviceWorkers:'allow'});
 const page=await context.newPage();
 page.on('pageerror',error=>faults.push(error.message));
 page.on('response',response=>{if(response.status()>=400)badResponses.push({url:response.url(),status:response.status()})});
 page.on('requestfailed',request=>failedRequests.push({url:request.url(),reason:request.failure()}));
 page.on('console',message=>{if(message.type()==='error')messages.push(message.text())});
 await page.goto(address+'?qa=1&qa-pwa=1&skip-brand=1',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.pwa==='function',{timeout:20000});
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.pwa().registered&&
  !document.getElementById('pwa-download-btn').disabled,null,{timeout:45000});
 const initial=await page.evaluate(()=>window.__SHAKEDOWN_QA.pwa());
 if(initial.offlineReady)throw Error('An isolated fresh browser context unexpectedly has the complete game cached');
 record('registration',{registered:initial.registered,initialReady:initial.offlineReady,bytes:initial.packBytes});
 page.on('dialog',async dialog=>{if(dialog.type()==='confirm')await dialog.accept();else await dialog.dismiss()});
 await page.locator('#pwa-install-btn').click();
 // The install button itself starts the complete explicit asset download.
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.pwa().downloading,{timeout:12000});
 const start=Date.now();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.pwa().offlineReady,null,{
  timeout, polling:400
 });
 const elapsed=Date.now()-start;
 const final=await page.evaluate(async()=>{
  const status=window.__SHAKEDOWN_QA.pwa();
  const manifest=await (await fetch('offline-assets.json')).json();
  const cache=await caches.open('shakedown-pwa-complete-game');
  const keys=await cache.keys();
  const missing=[];
  for(const entry of manifest.game)if(!await cache.match(new URL(entry.path,location.origin+'/ShakeDown/')))missing.push(entry.path);
  return {status,coreFiles:manifest.core.length,gameFiles:manifest.game.length,
   allBytes:manifest.totals.allBytes,cachedEntries:keys.length,missing};
 });
 if(final.missing.length)throw Error('Offline pack incomplete: '+final.missing.slice(0,4).join(','));
 if(final.gameFiles<290||final.status.downloaded!==final.gameFiles)
  throw Error('Full game manifest/cached entry count drift');
 record('complete download',{seconds:elapsed/1000,...final});
 // The native PWA install prompt is a separate user click after every SHA-
 // checked game byte is ready, not a popup triggered by an 80 MiB background job.
 await page.evaluate(()=>{
  window.__nativeInstallCount=0;
  const prompt=new Event('beforeinstallprompt',{cancelable:true});
  prompt.prompt=()=>{window.__nativeInstallCount++;return Promise.resolve()};
  prompt.userChoice=Promise.resolve({outcome:'accepted'});
  window.dispatchEvent(prompt);
 });
 await page.locator('#pwa-install-btn').click();
 const nativeCalls=await page.evaluate(()=>window.__nativeInstallCount);
 if(nativeCalls!==1)throw Error('Complete-game PWA did not offer native installation after full download');
 record('install prompt after verified full game',{nativeCalls});
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>typeof window.__SHAKEDOWN_QA?.snapshot==='function',{timeout:25000});
 const offlineGame=await page.evaluate(async()=>{
  const manifest=await (await fetch('offline-assets.json')).json();
  const files=[
   'assets/branding/stinky-weasel-brand.mp4',
   'assets/intro/cinnamon-title.mp4',
   'assets/intro/cinnamon-title-alpha.webm',
   'assets/audio/music/fox-boss.mp3',
   'assets/audio/music/dome-factory-a.mp3',
   'assets/title/title_10_the-prize.png',
   'assets/references/cinnamon_actions_sheet.png',
   'tools/asset-review.html',
   'docs/assets/ShakeDown_Complete_Asset_Contract.json'
  ];
  const results=await Promise.all(files.map(async rel=>{
   const res=await fetch(rel);
   return {file:rel,status:res.status,length:(await res.arrayBuffer()).byteLength};
  }));
  const mediaRanges=await Promise.all([
   ['assets/branding/stinky-weasel-brand.mp4','bytes=0-255'],
   ['assets/intro/cinnamon-title-alpha.webm','bytes=64-127'],
   ['assets/audio/music/campus-untitled.mp3','bytes=-128']
  ].map(async([rel,range])=>{
   const response=await fetch(rel,{headers:{Range:range}});
   return {file:rel,range,status:response.status,
    contentRange:response.headers.get('content-range'),
    length:(await response.arrayBuffer()).byteLength};
  }));
  return {results,mediaRanges,manifestCount:manifest.game.length,
   pack:window.__SHAKEDOWN_QA.pwa()};
 });
 if(offlineGame.results.some(x=>x.status!==200||x.length<=0))throw Error('Offline original asset request failed');
 if(offlineGame.mediaRanges.some(x=>x.status!==206||x.length!==256&&x.length!==64&&x.length!==128))
  throw Error('Offline video/audio byte-range request failed');
 record('fully disconnected media and art',{...offlineGame});
 // Actual video playback from cached bytes, not merely a 200 response.
 const movie=await page.evaluate(async()=>{
  const v=document.createElement('video');v.muted=true;v.playsInline=true;
  v.preload='auto';v.src='assets/branding/stinky-weasel-brand.mp4';
  document.body.append(v);
  try{
   await Promise.race([
    v.play(),
    new Promise((_,reject)=>setTimeout(()=>reject(Error('Video media timeout')),8000))
   ]);
   return {played:!v.paused,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState};
  }finally{v.pause();v.remove()}
 });
 if(!movie.played||movie.width<1)throw Error('Original branding film did not play offline');
 record('actual cached MP4 playback',movie);
 await page.locator('#start-btn').click();
 await page.waitForFunction(()=>window.__SHAKEDOWN_QA.snapshot().mode==='playing',{timeout:10000});
 const state=await page.evaluate(()=>({
  mode:window.__SHAKEDOWN_QA.snapshot().mode,
  art:window.__SHAKEDOWN_QA.assets(),
  music:window.__SHAKEDOWN_QA.audio()
 }));
 record('offline gameplay',{mode:state.mode,worldArtCount:state.art.worldLoaded,
  productionArtCount:state.art.productionLoaded,
  musicTrack:state.music.musicTrack});
 await page.goto(address+'tools/asset-gallery.html');
 await page.locator('h1').first().waitFor({timeout:10000});
 record('offline art gallery',{url:page.url(),heading:await page.locator('h1').first().innerText()});
 await page.goto(address+'tools/asset-review.html');
 await page.locator('h1').first().waitFor({timeout:10000});
 record('offline source art review',{url:page.url(),heading:await page.locator('h1').first().innerText()});
 const overall={pass:!faults.length&&!messages.length,checks,
  pageErrors:faults,consoleErrors:messages,badResponses,failedRequests};
 fs.writeFileSync(reportFile,JSON.stringify(overall,null,2)+'\n');
 console.log(JSON.stringify({pass:overall.pass,
  coreFiles:final.coreFiles,completeGameFiles:final.gameFiles,
  allBytes:final.allBytes,downloadSeconds:elapsed/1000,
  missing:final.missing,
  originalMediaRanges:offlineGame.mediaRanges,movie,
  checks:checks.map(x=>x.step),faults,messages,badResponses,failedRequests},null,2));
 if(!overall.pass)process.exitCode=2;
}finally{
 await browser?.close();
 await new Promise(resolve=>server.close(resolve));
}
