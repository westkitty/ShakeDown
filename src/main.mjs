import {newGame,startGame,pauseGame,resetToCheckpoint,update,DT,snapshot} from './game/engine.mjs';
import {VIEW,WORLD} from './game/world.mjs';
import {render} from './game/render.mjs';
import {AudioBox} from './game/audio.mjs';
import {loadApprovedArt} from './game/production-assets.mjs';
const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){$('load-status').textContent='Canvas rendering is unavailable on this browser.';throw Error('Canvas 2D required')}
const saveKey='shakedown:birthday:v1';
function readSave(){try{const value=JSON.parse(localStorage.getItem(saveKey)||'null');return value?.schema===1?value:{schema:1}}catch{return {schema:1}}}
let saved=readSave(),state=newGame(saved.settings||{}),sprites={},assetCount=0,assetErrors=[];
const audio=new AudioBox();audio.mute(state.settings.mute);
let productionArt={},productionLoaded=0,productionDeclared=0,productionErrors=[];
let spriteStatus='Loading Cinnamon poses…',productionStatus='';
function showAssetStatus(){
 $('load-status').textContent=[spriteStatus,productionStatus].filter(Boolean).join(' · ');
}
let lastStatus='',lastEventSerial=0,displayedMode='';
function save(){try{localStorage.setItem(saveKey,JSON.stringify({schema:1,settings:state.settings,completed:saved.completed||state.mode==='victory',bestShakes:Math.max(saved.bestShakes||0,state.shakeCount)}))}catch{/* Restricted storage: game still playable. */}}
function showMode(){if(displayedMode===state.mode)return;displayedMode=state.mode;
 for(const id of ['title-overlay','pause-overlay','dead-overlay','victory-overlay'])$(id).classList.add('hidden');
 const overlay={title:'title-overlay',pause:'pause-overlay',dead:'dead-overlay',victory:'victory-overlay'}[state.mode];
 if(overlay)$(overlay).classList.remove('hidden');
 $('pause-btn').disabled=state.mode!=='playing';
 if(state.mode==='dead')$('dead-reason').textContent=state.lastDamage||'The Fox got the better of Cinnamon. For now.';
 if(state.mode==='victory'){$('victory-score').textContent=`${state.shakeCount} Shamrock Shakes found • ${state.secretCount} golden secrets discovered`;save()}
}
const held=new Set(),queued=new Set(),pointerActs=new Map(),keyActs=new Map();
function updateHeld(action){
 const active=[...keyActs.values()].includes(action)||[...pointerActs.values()].includes(action);
 if(active)held.add(action);else held.delete(action);
}

function actionForKey(code){return ({ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyJ:'swish',KeyX:'swish',ShiftLeft:'dash',ShiftRight:'dash',KeyK:'dash'})[code]}
function clearInputs(){held.clear();queued.clear();pointerActs.clear();keyActs.clear();document.querySelectorAll('.touch').forEach(b=>b.classList.remove('held'))}
window.addEventListener('keydown',e=>{
 if(e.code==='Escape'||e.code==='KeyP'){if(state.mode==='playing'||state.mode==='pause'){e.preventDefault();togglePause()}return}
 if(e.code==='KeyM'){audio.mute(!state.settings.mute);state.settings.mute=!state.settings.mute;updateMute();save();return}
 if(e.code==='KeyR'&&state.mode==='dead'){retry();return}
 if(e.code==='Enter'&&state.mode==='title'&&document.activeElement!==$('start-btn')){start();e.preventDefault();return}
 const act=actionForKey(e.code);if(!act)return;
 if(state.mode==='playing'){
  e.preventDefault();
  if(!keyActs.has(e.code)){
   if(!held.has(act))queued.add(act);
   keyActs.set(e.code,act);
   updateHeld(act);
  }
 }
});
window.addEventListener('keyup',e=>{
 const act=actionForKey(e.code);
 if(act){keyActs.delete(e.code);updateHeld(act);e.preventDefault()}
});
window.addEventListener('blur',()=>{clearInputs();if(state.mode==='playing')togglePause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInputs();if(state.mode==='playing')togglePause()}lastStamp=0;accumulator=0});
for(const button of document.querySelectorAll('.touch')){
 const action=button.dataset.action;
 button.addEventListener('pointerdown',e=>{
  if(state.mode!=='playing')return;
  e.preventDefault();audio.activate();
  if(!held.has(action))queued.add(action);
  pointerActs.set(e.pointerId,action);
  button.setPointerCapture(e.pointerId);
  button.classList.add('held');
  updateHeld(action);
 });
 function endPointer(e){
  const prev=pointerActs.get(e.pointerId);pointerActs.delete(e.pointerId);
  if(prev!==action)return;
  updateHeld(action);
  button.classList.toggle('held',[...pointerActs.values()].includes(action));
 }
 button.addEventListener('pointerup',endPointer);button.addEventListener('pointercancel',endPointer);button.addEventListener('lostpointercapture',endPointer);
}
function newRound(){state=newGame(state.settings);state.assetCount=assetCount;lastEventSerial=0;displayedMode='';clearInputs();lastStamp=0;accumulator=0;audio.beat=0;audio.nextBeat=0;startGame(state);audio.activate();showMode();canvas.focus({preventScroll:true});}
function start(){newRound()}
function retry(){clearInputs();if(state.mode==='victory'){newRound();return}resetToCheckpoint(state);displayedMode='';showMode();canvas.focus({preventScroll:true});}
function togglePause(){pauseGame(state);clearInputs();displayedMode='';showMode();lastStamp=0;accumulator=0;save()}
function updateMute(){$('mute-btn').textContent=state.settings.mute?'♫ MUTED':'♪ SOUND';$('mute-btn').setAttribute('aria-pressed',String(state.settings.mute));}
$('start-btn').addEventListener('click',start);$('resume-btn').addEventListener('click',togglePause);
$('retry-btn').addEventListener('click',retry);$('pause-retry-btn').addEventListener('click',retry);
$('replay-btn').addEventListener('click',newRound);$('pause-btn').addEventListener('click',togglePause);
$('mute-btn').addEventListener('click',()=>{state.settings.mute=!state.settings.mute;audio.mute(state.settings.mute);audio.activate();updateMute();save()});
$('assist-check').checked=state.settings.assist;$('motion-check').checked=state.settings.reducedMotion;
$('assist-check').addEventListener('change',e=>{state.settings.assist=e.target.checked;save()});
$('motion-check').addEventListener('change',e=>{state.settings.reducedMotion=e.target.checked;save()});
updateMute();
async function loadAssets(){
 try{
  const response=await fetch('assets/sprites/cinnamon/frames.json',{cache:'no-store'});
  if(!response.ok)throw Error('manifest HTTP '+response.status);
  const manifest=await response.json();
  if(!manifest.frames)throw Error('Missing frames');
  // run_03 is a preserved but clipped reference cut-out. Never load it into active playback.
  const entries=Object.entries(manifest.frames).filter(([id])=>id!=='run_03');
  let next=0;const loaded=new Array(entries.length);
  async function fetchImage(src){
   return new Promise(resolve=>{
    const image=new Image();
    image.onload=()=>resolve(image);
    image.onerror=()=>resolve(null);
    image.src=src;
   });
  }
  async function worker(){
   while(next<entries.length){
    const index=next++, [id,item]=entries[index];
    let image=await fetchImage(item.file);
    if(!image)image=await fetchImage(item.file+'?retry=1');
    if(image)loaded[index]=[id,image];
    else assetErrors.push(id);
   }
  }
  await Promise.all(Array.from({length:4},worker));
  sprites=Object.fromEntries(loaded.filter(Boolean));assetCount=Object.keys(sprites).length;
  state.assetCount=assetCount;
  spriteStatus=assetErrors.length
   ?assetErrors.length+' usable pose loads failed; procedural fallback remains active.'
   :assetCount+' playable Cinnamon poses ready (1 clipped source archived).';
  showAssetStatus();
 }catch(error){
  assetErrors.push('manifest');
  spriteStatus='Sprite source unavailable. Temporary in-game fallback shown.';
  showAssetStatus();
 }
}
function hud(){const p=state.player;
 $('hud-health').textContent='♥ '.repeat(Math.ceil(p.hp)).trim()||'♡';
 $('hud-shakes').textContent=`SHAKES ${state.shakeCount}`;
 const zone=state.boss.triggered?'FOX SHOWDOWN':p.x>=WORLD.campusEnd?'GOLDEN DOME':'SOUTH QUAD';
 $('hud-zone').textContent=zone;$('zone-readout').textContent=p.x>=WORLD.campusEnd?'02 / GOLDEN DOME':'01 / CAMPUS CHASE';
 const next=state.status;if(next!==lastStatus){$('status-text').textContent=next;lastStatus=next}
}
let accumulator=0,lastStamp=0,lastHUD=0;
const frameTimings=[];
function percentile(values,p){
 if(!values.length)return null;
 const sorted=[...values].sort((a,b)=>a-b);return Number(sorted[Math.floor((sorted.length-1)*p)].toFixed(2));
}
function metrics(){return {frames:frameTimings.length,frameMsP95:percentile(frameTimings.map(x=>x.frame),.95),
 renderMsP95:percentile(frameTimings.map(x=>x.render),.95),devicePixelRatio:Math.min(window.devicePixelRatio||1,2)};}
function animate(ms){requestAnimationFrame(animate);
 const actualFrameMs=lastStamp?Math.max(0,ms-lastStamp):0;
 if(!lastStamp)lastStamp=ms;const dt=Math.min(.10,Math.max(0,(ms-lastStamp)/1000));lastStamp=ms;
 if(state.mode==='playing'){
  accumulator=Math.min(.15,accumulator+dt);let count=0;
  while(accumulator>=DT&&count<6){const input={left:held.has('left'),right:held.has('right'),jumpHeld:held.has('jump'),
    jumpPressed:queued.has('jump'),dashPressed:queued.has('dash'),swishPressed:queued.has('swish')};
   queued.clear();update(state,input,DT);accumulator-=DT;count++;if(state.mode!=='playing')break;
  }
  audio.musicTick(ms/1000,state.boss.triggered);
  // Events have monotonic IDs because the rolling 35-event history shifts.
  // An array cursor would silently stop all audio after event 35.
  for(const ev of state.events){if(ev.serial>lastEventSerial){audio.event(ev.type);lastEventSerial=ev.serial}}
 }else{accumulator=0}
 if(state.mode==='victory')state.elapsed+=dt;
 const drawStart=performance.now();
 render(ctx,state,sprites,accumulator/DT,productionArt);
 if(actualFrameMs>0){frameTimings.push({frame:actualFrameMs,render:performance.now()-drawStart});
  if(frameTimings.length>240)frameTimings.shift()}
 if(ms-lastHUD>110){hud();lastHUD=ms}
 showMode();
}
// Fixed logical camera, capped pixel-density: CSS handles responsiveness and letterboxing.
function onResize(){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(VIEW.width*dpr);canvas.height=Math.round(VIEW.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
window.addEventListener('resize',onResize,{passive:true});onResize();
loadAssets();
const params=new URLSearchParams(location.search);
const previewId=(location.hostname==='localhost'||location.hostname==='127.0.0.1')
  ?params.get('preview-art'):null;
if(previewId){productionStatus='LOCAL ART PREVIEW ONLY: '+previewId+' (NOT production activated)';showAssetStatus();}
 loadApprovedArt({previewUnverifiedId:previewId}).then(({images,errors,approved})=>{
  productionArt=images;productionLoaded=Object.keys(images).length;
  productionDeclared=approved;productionErrors=errors;
  if(previewId){
   productionStatus='LOCAL ART PREVIEW: '+previewId+' '+(productionArt[previewId]?'candidate loaded; NOT production activated':'unavailable; NOT production activated');
  } else if(productionLoaded>0){
   productionStatus=productionLoaded+' verified integrated artwork elements ready.';
  }
  showAssetStatus();
 }).catch(error=>{productionErrors=['loader: '+error.message];showAssetStatus()});
 showMode();requestAnimationFrame(animate);
window.__SHAKEDOWN_QA={snapshot:()=>snapshot(state),metrics,assets:()=>({loaded:assetCount,failed:[...assetErrors],productionLoaded,productionDeclared,productionErrors:[...productionErrors]}),
 // Developer-only deterministic test aids; excluded from normal gameplay and production paths.
 ...(new URLSearchParams(location.search).has('qa')?{
  warp:(x,y)=>{state.player.x=x;state.player.y=y;state.player.prevX=x;state.player.prevY=y;state.player.vx=0;state.player.vy=0;state.camera.x=Math.max(0,x-450);state.camera.y=Math.min(0,y-260);},
  setBossRecovery:()=>{state.boss.triggered=true;state.boss.mode='rest';state.boss.timer=999;state.boss.hurtTime=0;},
  inspectState:()=>state
 }:{})};
