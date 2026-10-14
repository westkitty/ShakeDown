/* ShakeDown complete-game offline worker. Pages scope: /ShakeDown/.
   Both cinematics, all soundtrack and every game/art-workshop asset are cached
   on explicit user request. No remote dependencies, analytics or APK workflow. */
const REV='2026.10.14.2';
const PREFIX='shakedown-pwa-';
const SHELL=PREFIX+'shell-'+REV;
const GAME=PREFIX+'complete-game';
const RUNTIME=PREFIX+'runtime-'+REV;
const scope=self.registration.scope;
const address=path=>new URL(path,scope).href;
const INDEX=address('index.html');
const INVENTORY=address('offline-assets.json');
const READY=address('__full-game-ready.json');
let downloadJob=null,manifestTask=null;
let packReadyMemo=null;
const sha256=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
const safePath=value=>typeof value==='string'&&value.length>0&&value.length<260&&
 !value.startsWith('/')&&!value.includes('\\')&&!value.includes('?')&&!value.includes('#')&&
 value.split('/').every(segment=>segment&&segment!=='.'&&segment!=='..')&&
 /^[a-zA-Z0-9_./-]+$/.test(value);
function validateInventory(value){
 if(!value||value.schema!==2||value.version!==REV||
    !Array.isArray(value.core)||!Array.isArray(value.game)||
    value.core.length<5||value.game.length<250)throw Error('Complete game manifest version or shape mismatch');
 const seen=new Set();
 for(const entry of [...value.core,...value.game]){
  if(!safePath(entry?.path)||!Number.isSafeInteger(entry.bytes)||
     entry.bytes<=0||entry.bytes>35_000_000||
     !/^[a-f0-9]{64}$/.test(entry.sha256)||seen.has(entry.path))
   throw Error('Unsafe/duplicate game file: '+String(entry?.path));
  seen.add(entry.path);
 }
 for(const required of [
  'index.html','src/main.mjs',
  'assets/branding/stinky-weasel-brand.mp4',
  'assets/intro/cinnamon-title.mp4','assets/intro/cinnamon-title-alpha.webm',
  'assets/audio/music/fox-boss.mp3',
  'tools/asset-review.html','tools/asset-gallery.html'
 ])if(!seen.has(required))throw Error('Missing full-game file: '+required);
 const coreBytes=value.core.reduce((v,e)=>v+e.bytes,0);
 const gameBytes=value.game.reduce((v,e)=>v+e.bytes,0);
 if(value.totals?.coreBytes!==coreBytes||value.totals?.gameBytes!==gameBytes||
    value.totals?.allFiles!==value.core.length+value.game.length)
  throw Error('Offline asset totals do not reconcile');
 return value;
}
async function networkEntry(entry){
 const target=address(entry.path);
 const response=await fetch(target,{cache:'no-store'});
 if(!response.ok||response.type==='opaque')throw Error('HTTP '+response.status+' for '+entry.path);
 const bytes=await response.arrayBuffer();
 if(bytes.byteLength!==entry.bytes||(await sha256(bytes))!==entry.sha256)
  throw Error('Game file differs from offline manifest: '+entry.path);
 return new Response(bytes,{status:200,headers:{
  'Content-Type':response.headers.get('content-type')||'application/octet-stream',
  'Accept-Ranges':'bytes'
 }});
}
async function inventory(){
 if(!manifestTask)manifestTask=(async()=>{
  const cache=await caches.open(SHELL);
  const found=await cache.match(INVENTORY);
  if(found){try{return validateInventory(await found.json())}catch{}}
  const response=await fetch(INVENTORY,{cache:'no-store'});
  if(!response.ok)throw Error('Offline manifest HTTP '+response.status);
  const value=validateInventory(await response.clone().json());
  await cache.put(INVENTORY,response);
  return value;
 })().catch(error=>{manifestTask=null;throw error});
 return manifestTask;
}
async function cacheShell(){
 const response=await fetch(INVENTORY,{cache:'no-store'});
 if(!response.ok)throw Error('Offline manifest HTTP '+response.status);
 const manifest=validateInventory(await response.clone().json());
 const cache=await caches.open(SHELL);
 await cache.put(INVENTORY,response);
 let index=0;
 async function worker(){
  while(index<manifest.core.length){
   const entry=manifest.core[index++];
   await cache.put(address(entry.path),await networkEntry(entry));
  }
 }
 await Promise.all([worker(),worker(),worker()]);
 manifestTask=Promise.resolve(manifest);
}
self.addEventListener('install',event=>{
 // Do not silently activate updates mid-game. First installation activates
 // normally; later changes wait for the player's explicit update action.
 event.waitUntil(cacheShell());
});
async function checkedCached(entry,cache){
 const response=await cache.match(address(entry.path));
 if(!response)return false;
 try{
  const bytes=await response.arrayBuffer();
  return bytes.byteLength===entry.bytes&&(await sha256(bytes))===entry.sha256;
 }catch{return false}
}
async function validateStoredPack(cache,manifest,{cryptographic=false}={}){
 const record=await cache.match(READY);
 if(!record)return false;
 let marker;
 try{marker=await record.json()}catch{return false}
 if(marker?.version!==REV||marker?.files!==manifest.game.length)return false;
 for(const entry of manifest.game){
  if(cryptographic){
   if(!await checkedCached(entry,cache))return false;
  }else if(!await cache.match(address(entry.path)))return false;
 }
 return true;
}
async function renewExistingPack(cache,manifest){
 // A PWA update must not force an 80 MB redownload if the game art is unchanged.
 if(await validateStoredPack(cache,manifest))return true;
 const stored=(await cache.keys()).filter(r=>r.url!==READY);
 if(stored.length<manifest.game.length)return false;
 for(const entry of manifest.game){
  if(!await checkedCached(entry,cache))return false;
 }
 await cache.put(READY,new Response(JSON.stringify({
  version:REV,files:manifest.game.length,allBytes:manifest.totals.allBytes
 }),{headers:{'Content-Type':'application/json'}}));
 return true;
}
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const manifest=await inventory();
  const gameCache=await caches.open(GAME);
  try{packReadyMemo=await renewExistingPack(gameCache,manifest)}
  catch{packReadyMemo=false}
  const all=await caches.keys();
  await Promise.all(all.filter(key=>
   key.startsWith(PREFIX)&&key!==SHELL&&key!==GAME&&key!==RUNTIME
  ).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});
function ownSite(url){
 const origin=new URL(scope);
 return url.origin===origin.origin&&url.pathname.startsWith(origin.pathname);
}
async function fullReady(){
 if(packReadyMemo!==null)return packReadyMemo;
 const manifest=await inventory();
 const cache=await caches.open(GAME);
 packReadyMemo=await validateStoredPack(cache,manifest);
 return packReadyMemo;
}
async function cachedByUrl(url){
 const shell=await caches.open(SHELL);
 let result=await shell.match(url,{ignoreSearch:true});
 if(result)return result;
 if(await fullReady()){
  const game=await caches.open(GAME);
  result=await game.match(url,{ignoreSearch:true});
  if(result)return result;
 }
 const runtime=await caches.open(RUNTIME);
 return await runtime.match(url,{ignoreSearch:true})||null;
}
const rangeResponse=async(cached,header)=>{
 const full=await cached.arrayBuffer(),length=full.byteLength;
 // Standard byte ranges, including open-ended and suffix forms.
 const match=/^bytes=(\d*)-(\d*)$/.exec(header.trim());
 if(!match||(!match[1]&&!match[2]))
  return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
 let start,end;
 if(!match[1]){
  const suffix=Number(match[2]);
  if(!Number.isSafeInteger(suffix)||suffix===0)
   return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
  start=Math.max(0,length-suffix);end=length-1;
 }else{
  start=Number(match[1]);end=match[2]?Number(match[2]):length-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=length||end<start)
   return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+length}});
  end=Math.min(end,length-1);
 }
 const body=full.slice(start,end+1);
 return new Response(body,{status:206,headers:{
  'Content-Type':cached.headers.get('content-type')||'application/octet-stream',
  'Accept-Ranges':'bytes',
  'Content-Range':'bytes '+start+'-'+end+'/'+length,
  'Content-Length':String(body.byteLength)
 }});
};
async function serve(request){
 const uri=new URL(request.url);
 const stored=await cachedByUrl(uri.href);
 const range=request.headers.get('range');
 if(stored)return range?rangeResponse(stored,range):stored;
 try{
  // Online media may be served as partial requests. Do not put a 206 response
  // in CacheStorage: browsers request ranges when seeking or starting video.
  const response=await fetch(request);
  if(!range&&response.ok&&response.status===200&&response.type!=='opaque'){
   const ext=uri.pathname.split('.').pop()?.toLowerCase();
   if(!['mp4','webm','mov','m4v'].includes(ext)){
    const runtime=await caches.open(RUNTIME);
    await runtime.put(uri.href,response.clone()).catch(()=>{});
   }
  }
  return response;
 }catch{
  if(request.mode==='navigate'){
   const shell=await caches.open(SHELL);
   return (await shell.match(INDEX))||Response.error();
  }
  return Response.error();
 }
}
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const uri=new URL(event.request.url);
 if(!ownSite(uri))return;
 event.respondWith(serve(event.request));
});
const send=(client,type,props={})=>{
 try{client?.postMessage({source:'shakedown-pwa',type,...props})}catch{}
};
async function getStatus(){
 const manifest=await inventory(),cache=await caches.open(GAME);
 const keys=await cache.keys();
 const count=keys.filter(r=>r.url!==READY).length;
 const ready=await validateStoredPack(cache,manifest);
 packReadyMemo=ready;
 return {version:REV,ready,downloading:Boolean(downloadJob),
  downloaded:Math.min(count,manifest.game.length),
  total:manifest.game.length,bytes:manifest.totals.gameBytes,
  fullBytes:manifest.totals.allBytes,
  mb:Math.round(manifest.totals.allBytes/1048576*10)/10};
}
async function installFullPack(client){
 if(downloadJob){send(client,'PACK_BUSY',{reason:'Complete game download already running'});return}
 const manifest=await inventory(),cache=await caches.open(GAME);
 const job={cancelled:false,controllers:new Set()};
 downloadJob=job;
 packReadyMemo=false;
 await cache.delete(READY);
 let next=0,done=0,doneBytes=0,firstError=null;
 const entries=manifest.game,wholeBytes=manifest.totals.gameBytes;
 const progress=force=>{
  if(force||done%5===0||done===entries.length)
   send(client,'PACK_PROGRESS',{done,total:entries.length,doneBytes,totalBytes:wholeBytes});
 };
 progress(true);
 async function task(){
  while(next<entries.length&&!job.cancelled&&!firstError){
   const entry=entries[next++],target=address(entry.path);
   try{
    if(!await checkedCached(entry,cache)){
     const controller=new AbortController();
     job.controllers.add(controller);
     try{
      const result=await fetch(target,{cache:'no-store',signal:controller.signal});
      if(!result.ok||result.type==='opaque')throw Error('HTTP '+result.status);
      const bytes=await result.arrayBuffer();
      if(bytes.byteLength!==entry.bytes||(await sha256(bytes))!==entry.sha256)
       throw Error('File changed during download');
      await cache.put(target,new Response(bytes,{status:200,headers:{
       'Content-Type':result.headers.get('content-type')||'application/octet-stream',
       'Accept-Ranges':'bytes'
      }}));
     }finally{job.controllers.delete(controller)}
    }
    done++;doneBytes+=entry.bytes;progress(false);
   }catch(error){if(!job.cancelled)firstError=entry.path+': '+error.message}
  }
 }
 try{
  await Promise.all([task(),task(),task()]);
  if(job.cancelled){send(client,'PACK_CANCELLED',{done,total:entries.length});return}
  if(firstError)throw Error(firstError);
  if(done!==entries.length)throw Error('Offline pack incomplete');
  await cache.put(READY,new Response(JSON.stringify({
   version:REV,files:entries.length,allBytes:manifest.totals.allBytes
  }),{headers:{'Content-Type':'application/json'}}));
  if(!await validateStoredPack(cache,manifest,{cryptographic:true}))
   throw Error('Downloaded game pack integrity check failed');
  packReadyMemo=true;
  send(client,'PACK_READY',{done,total:entries.length,bytes:manifest.totals.allBytes});
 }catch(error){
  await cache.delete(READY);
  packReadyMemo=false;
  send(client,'PACK_ERROR',{reason:error.message,done,total:entries.length});
 }finally{
  if(downloadJob===job)downloadJob=null;
 }
}
async function onMessage(event){
 const client=event.source;
 if(!client||typeof client.postMessage!=='function')return;
 try{if(!ownSite(new URL(client.url)))return}catch{return}
 const type=event.data?.type;
 try{
  if(type==='PWA_STATUS'){
   send(client,'STATUS',await getStatus());
  }else if(type==='DOWNLOAD_OFFLINE'){
   await installFullPack(client);
  }else if(type==='CANCEL_OFFLINE'){
   if(downloadJob){
    downloadJob.cancelled=true;
    for(const controller of downloadJob.controllers)controller.abort();
   }
  }else if(type==='REMOVE_OFFLINE'){
   if(downloadJob){send(client,'PACK_BUSY',{reason:'Cancel download first'});return}
   await caches.delete(GAME);
   packReadyMemo=false;
   send(client,'PACK_REMOVED');
  }else if(type==='ACTIVATE_UPDATE'){
   await self.skipWaiting();
  }
 }catch(error){
  send(client,type==='PWA_STATUS'?'STATUS_ERROR':'PACK_ERROR',{reason:error.message});
 }
}
self.addEventListener('message',event=>{event.waitUntil(onMessage(event))});
