// Installable ShakeDown PWA. Game state/save logic lives in main.mjs;
// this module owns only install, offline-pack and update UI.
// Browser-driven installation always requires a user gesture.
export function installAdvice({installed=false,promptAvailable=false,ready=false}={}){
 if(installed&&ready)return 'The entire game is downloaded and installed. Fullscreen play works without a connection.';
 if(installed)return 'ShakeDown is installed. Download the complete game to make every video, music track and level available offline.';
 if(!ready)return 'First download the COMPLETE game, including cinematics and music. Then install it from the browser prompt or menu.';
 if(promptAvailable)return 'Complete game ready. Install ShakeDown as a fullscreen-capable app; no APK required.';
 return 'Complete game ready. Use your browser menu → Install app / Add to Home screen.';
}
export function isAppleDevice(nav=globalThis.navigator){
 return /iPad|iPhone|iPod/i.test(nav?.userAgent||'')||
  (nav?.platform==='MacIntel'&&nav?.maxTouchPoints>1);
}
export function isStandalone(win=globalThis.window){
 return Boolean(win?.navigator?.standalone||
  win?.matchMedia?.('(display-mode: standalone)')?.matches||
  win?.matchMedia?.('(display-mode: fullscreen)')?.matches);
}
export function initPwaInstall({doc=document,win=window,enabled=true,gameMode=()=>doc.body.dataset.gameMode}={}){
 const $=id=>doc.getElementById(id);
 const installButton=$('pwa-install-btn'),panel=$('pwa-options'),help=$('pwa-install-help');
 const status=$('pwa-status'),progress=$('pwa-progress');
 const download=$('pwa-download-btn'),cancel=$('pwa-cancel-btn');
 const remove=$('pwa-remove-btn'),check=$('pwa-check-btn'),update=$('pwa-update-btn');
 if(![installButton,panel,help,status,progress,download,cancel,remove,check,update].every(Boolean))
  throw Error('ShakeDown install controls missing');
 let registration=null,deferredInstall=null,installed=isStandalone(win);
 let downloading=false,ready=false,packFiles=0,totalFiles=0,packBytes=0;
 let updateRequested=false,error='',serviceReady=false,openSeen=false;
 const sw=win.navigator.serviceWorker;
 const offlineSupported=enabled&&Boolean(sw)&&win.isSecureContext!==false&&win.location.protocol!=='file:';
 let setupDone=false;
 const mb=bytes=>(bytes/1048576).toFixed(1);
 const setStatus=text=>{status.textContent=text};
 const updateControls=()=>{
  const effectiveInstalled=installed||isStandalone(win);
  help.textContent=installAdvice({installed:effectiveInstalled,promptAvailable:Boolean(deferredInstall),ready});
  if(downloading){
   installButton.textContent='⌛ DOWNLOADING COMPLETE GAME';
   installButton.disabled=true;
  }else if(!ready){
   installButton.textContent='⇩ DOWNLOAD COMPLETE GAME ('+(packBytes?mb(packBytes)+' MB':'ALL ASSETS')+')';
   installButton.disabled=!serviceReady;
  }else if(effectiveInstalled){
   installButton.textContent='✓ FULL GAME READY — INSTALLED';
   installButton.disabled=true;
  }else if(deferredInstall){
   installButton.textContent='⇩ INSTALL FULL SHAKEDOWN';
   installButton.disabled=false;
  }else{
   installButton.textContent='⇩ FINISH INSTALLATION';
   installButton.disabled=false;
  }
  download.disabled=!serviceReady||downloading||ready;
  check.disabled=!serviceReady||downloading;
  remove.hidden=!serviceReady||downloading||packFiles===0;
  cancel.hidden=!downloading;
  update.hidden=!registration?.waiting;
  update.disabled=downloading||gameMode()==='playing';
  progress.hidden=!downloading;
  if(serviceReady&&!downloading&&!error){
   if(ready)setStatus('✓ COMPLETE SHAKE DOWN OFFLINE: all levels, cinematics, music, art, and art-workshop assets saved ('+mb(packBytes)+' MB).');
   else if(packFiles>0)setStatus(packFiles+' / '+totalFiles+' complete-game files saved. Resume to finish downloading everything.');
   else setStatus('Complete game: '+mb(packBytes)+' MB, including videos, every music track, all levels and artwork. Download once to play offline.');
  }
 };
 const controller=()=>sw?.controller||registration?.active;
 const send=type=>{
  const target=controller();
  if(!target)return false;
  try{target.postMessage({type});return true}
  catch{setStatus('Offline service unavailable. Reload while connected and try again.');return false}
 };
 const requestStatus=()=>{if(serviceReady)send('PWA_STATUS')};
 const displayProgress=(done,total,doneBytes,totalBytes)=>{
  downloading=true;
  packBytes=Number(totalBytes)||packBytes;
  totalFiles=Number(total)||totalFiles;
  packFiles=Number(done)||0;
  progress.max=Math.max(1,totalFiles);
  progress.value=packFiles;
  const percent=Math.round((packFiles/Math.max(1,totalFiles))*100);
  setStatus('Saving for offline play: '+packFiles+' / '+totalFiles+' files ('+percent+'%). Keep ShakeDown open.');
  updateControls();
 };
 function onMessage(event){
  if(event.data?.source!=='shakedown-pwa')return;
  const message=event.data;
  switch(message.type){
   case 'STATUS':{
    serviceReady=true;ready=Boolean(message.ready);
    downloading=Boolean(message.downloading);
    packFiles=Number(message.downloaded)||0;
    totalFiles=Number(message.total)||0;
    packBytes=Number(message.bytes)||0;
    error='';break;
   }
   case 'PACK_PROGRESS':
    error='';displayProgress(message.done,message.total,message.doneBytes,message.totalBytes);return;
   case 'PACK_READY':
    downloading=false;ready=true;packFiles=message.total||packFiles;
    setStatus('✓ Entire ShakeDown game verified offline: ALL videos, music, levels, artworks, and tools.');
    break;
   case 'PACK_ERROR':
    downloading=false;ready=false;error=message.reason||'Download interrupted';
    setStatus('Download paused: '+error+'. Retry to resume already saved files.');
    break;
   case 'PACK_CANCELLED':
    downloading=false;ready=false;
    setStatus('Complete-game download paused. Saved files remain and can be resumed.');
    break;
   case 'PACK_REMOVED':
    downloading=false;ready=false;packFiles=0;
    setStatus('Complete offline game download removed. Save progress and the online website are unchanged.');
    break;
   case 'PACK_BUSY':
    downloading=true;
    setStatus(message.reason||'Offline download already running in another tab.');
    break;
   case 'STATUS_ERROR':
    downloading=false;error=message.reason||'Service worker unavailable';
    setStatus('Offline status unavailable: '+error);
    break;
   default:return;
  }
  updateControls();
 }
 const installListener=event=>{
  event.preventDefault();
  deferredInstall=event;
  updateControls();
 };
 const installedListener=()=>{
  installed=true;deferredInstall=null;
  setStatus('✓ ShakeDown added to your device. Launch it from your home screen.');
  updateControls();
 };
 win.addEventListener('beforeinstallprompt',installListener);
 win.addEventListener('appinstalled',installedListener);
 async function startFullDownload(){
  if(!serviceReady||downloading||ready)return;
  const total=mb(packBytes);
  if(!win.confirm('Download the ENTIRE ShakeDown game ('+total+' MB), including intro videos, music, levels, character art and the art workshop? This uses device storage.'))return;
  if(win.navigator.connection?.saveData){
   if(!win.confirm('Data Saver is enabled. Continue downloading the full '+total+' MB anyway?'))return;
  }
  try{
   const estimate=await win.navigator.storage?.estimate?.();
   const available=Number(estimate?.quota)-Number(estimate?.usage);
   if(Number.isFinite(available)&&available>0&&available<packBytes*1.15){
    if(!win.confirm('Storage may be low ('+mb(available)+' MB estimated free). Try the complete-game download anyway?'))return;
   }
  }catch{/* Storage quota may be unavailable. Download errors remain visible. */}
  if(!send('DOWNLOAD_OFFLINE'))return;
  downloading=true;progress.hidden=false;progress.value=0;
  panel.open=true;
  setStatus('Downloading ALL game files. Keep ShakeDown open until complete…');
  updateControls();
 }
 installButton.addEventListener('click',()=>{
  if(downloading)return;
  if(!ready){
   void startFullDownload();
   return;
  }
  if(installed||isStandalone(win))return;
  if(deferredInstall){
   // Must be called synchronously from a click, as required by supported browsers.
   const event=deferredInstall;
   deferredInstall=null;updateControls();
   Promise.resolve(event.prompt()).then(()=>event.userChoice).then(choice=>{
    if(choice?.outcome!=='accepted'){
     panel.open=true;setStatus('Installation dismissed. Use the browser menu to install whenever you want.');
    }
   }).catch(()=>{
    panel.open=true;setStatus('Native install prompt unavailable. Use the browser menu to Install App.');
   });
  }else{
   panel.open=true;panel.scrollIntoView?.({block:'nearest',behavior:'instant'});
   setStatus('Complete game is offline-ready. Open your browser menu → Install app / Add to Home screen.');
  }
 });
 download.addEventListener('click',()=>{void startFullDownload()});
 cancel.addEventListener('click',()=>{if(downloading){send('CANCEL_OFFLINE');setStatus('Stopping download…')}});
 remove.addEventListener('click',()=>{
  if(!ready&&packFiles===0)return;
  if(!win.confirm('Remove the offline game download? Your saved progress and the online game will remain.'))return;
  if(send('REMOVE_OFFLINE'))setStatus('Removing offline game files…');
 });
 check.addEventListener('click',async()=>{
  if(!registration)return;
  setStatus('Checking for a new ShakeDown version…');
  try{await registration.update();
   if(registration.waiting)setStatus('Update ready. Install it when you are done playing.');
   else setStatus('No update waiting. You have the current installed version.');
  }catch{setStatus('Could not check for updates while disconnected.')}
  updateControls();
 });
 update.addEventListener('click',()=>{
  if(gameMode()==='playing'){
   setStatus('Pause or return to the title before updating, so your gameplay is not interrupted.');
   return;
  }
  if(registration?.waiting){
   updateRequested=true;
   setStatus('Applying game update…');
   registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});
  }
 });
 const controllerChanged=()=>{
  if(updateRequested){win.location.reload();return}
  serviceReady=true;requestStatus();updateControls();
 };
 const connectivity=()=>{
  if(!win.navigator.onLine&&ready)setStatus('Offline connection detected. Saved game files are available.');
  else requestStatus();
 };
 const checkUpdate=()=>{
  if(!registration)return;
  if(registration.waiting){
   update.hidden=false;updateControls();
   if(!downloading)setStatus('New ShakeDown update ready. Install it from the title screen.');
  }
 };
 sw?.addEventListener('message',onMessage);
 sw?.addEventListener('controllerchange',controllerChanged);
 win.addEventListener('online',connectivity);
 win.addEventListener('offline',connectivity);
 win.addEventListener('pageshow',()=>{if(serviceReady)requestStatus()});
 panel.addEventListener('toggle',()=>{if(panel.open&&!openSeen){openSeen=true;requestStatus()}});
 async function setup(){
  if(setupDone)return;
  setupDone=true;
  if(!offlineSupported){
   download.disabled=true;check.disabled=true;
   setStatus('Offline installation requires HTTPS or localhost with Service Worker support. Online browser play still works.');
   return;
  }
  try{
   const swURL=new URL('../../service-worker.js',import.meta.url);
   const siteScope=new URL('../../',import.meta.url);
   registration=await sw.register(swURL.href,{scope:siteScope.href,updateViaCache:'none'});
   registration.addEventListener('updatefound',()=>{
    const installing=registration.installing;
    installing?.addEventListener('statechange',()=>{
     if(installing.state==='installed'){
      if(sw.controller)checkUpdate();
      else{serviceReady=true;requestStatus();updateControls()}
     }
    });
   });
   if(registration.active){serviceReady=true;requestStatus()}
   checkUpdate();updateControls();
   // A newly registered worker activates asynchronously. This does not
   // reload the game or interrupt an in-progress run.
   sw.ready.then(readyReg=>{
    registration=readyReg;serviceReady=true;
    requestStatus();checkUpdate();updateControls();
   }).catch(()=>{});
   registration.update().catch(()=>{});
  }catch(error){
   error=error?.message||'Service worker registration failed';
   setStatus('Could not prepare offline play: '+error+'. Browser play still works.');
   updateControls();
  }
 }
 updateControls();
 void setup();
 return {snapshot:()=>({
  enabled:offlineSupported,registered:Boolean(registration),
  installed:installed||isStandalone(win),downloaded:packFiles,total:totalFiles,
  offlineReady:ready,downloading,hasInstallPrompt:Boolean(deferredInstall),
  updateReady:Boolean(registration?.waiting),packBytes
 })};
}
