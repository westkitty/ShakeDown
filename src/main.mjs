import {newGame,startGame,pauseGame,resetToCheckpoint,update,DT,snapshot} from './game/engine.mjs';
import {healthSegments,healthAnnouncement} from './game/health.mjs';
import {mobileCanvasPan} from './game/mobile-framing.mjs';
import {VIEW,WORLD} from './game/world.mjs';
import {render} from './game/render.mjs';
import {loadSecretNpcArt} from './game/secret-assets.mjs';
import {AudioBox} from './game/audio.mjs';
import {loadApprovedArt} from './game/production-assets.mjs';
import {loadCuratedPreview,loadWorldSceneArt} from './game/curated-assets.mjs';
import {ArtDirector} from './game/art-director.mjs';
import {initScreenArt} from './game/screen-art.mjs';
import {initIntroFlow} from './game/intro-flow.mjs';
import {initTitleCinematic} from './game/title-cinematic.mjs';
import {initBrandIntro} from './game/brand-intro.mjs';
import {checkpointRecord,validCheckpointRecord,restoreCheckpoint} from './game/progress.mjs';
import {TouchSteering} from './game/touch-steering.mjs';
import {COMFORT_KEY,COMFORT_DEFAULTS,sanitizeComfortSettings,readComfortSettings,writeComfortSettings} from './game/mobile-comfort.mjs';
import {createImmersiveMode} from './game/immersive-mode.mjs';
import {initPwaInstall} from './game/pwa-install.mjs';
const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){$('load-status').textContent='Canvas rendering is unavailable on this browser.';throw Error('Canvas 2D required')}
const screenArt=initScreenArt();
const saveKey='shakedown:birthday:v1';
function readSave(){
 try{const value=JSON.parse(localStorage.getItem(saveKey)||'null');
  return value?.schema===1&&typeof value==='object'?value:{schema:1};
 }catch{return {schema:1}}
}
let saved=readSave();
const initialSettings={...saved.settings};
if(typeof initialSettings.reducedMotion!=='boolean'){
 initialSettings.reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
}
let state=newGame(initialSettings),sprites={},assetCount=0,assetErrors=[];
function savedDiscoveries(values,level){
 const valid=new Set(level.secretNpcs.map(npc=>npc.id));
 return Array.isArray(values)?[...new Set(values.filter(id=>typeof id==='string'&&valid.has(id)))]:[];
}
state.achievements=savedDiscoveries(saved.discoveries,state.level);
let lastSavedProgressKey='';
function resumableRecord(){return validCheckpointRecord(saved.progress,state.level)?saved.progress:null}
function showContinue(){
 const record=resumableRecord(),button=$('continue-btn'),note=$('continue-note');
 button.hidden=!record;note.hidden=!record;
 if(record){button.textContent='CONTINUE FROM '+record.checkpointId.toUpperCase();
  note.textContent='Saved at '+record.checkpointId+' — start fresh or continue.';}
}
const audio=new AudioBox();audio.mute(state.settings.mute,{resume:false});
const intro=initIntroFlow();
const titleCinematic=initTitleCinematic({reduced:()=>state.settings.reducedMotion});
const branding=initBrandIntro({
 reduced:()=>state.settings.reducedMotion,
 onGesture:()=>{if(!state.settings.mute)audio.activate()},
 onFinish:()=>{
  titleCinematic.setTitleVisible(state.mode==='title'&&!intro.active);
  if(state.mode==='title'){
   $('start-btn').focus({preventScroll:true});
   audio.musicTick(performance.now()/1000,'title');
  }
 }
});
branding.start();
titleCinematic.setTitleVisible(state.mode==='title'&&!branding.active);

const introQuery=new URLSearchParams(location.search);
const bypassIntro=introQuery.get('skip-intro')==='1'||
 (introQuery.has('qa')&&introQuery.get('intro')!=='1');
// Title audio unlocks on the first user gesture; Start crossfades into campus.
function unlockTitleMusic(){
 if(state.mode!=='title'||intro.active||state.settings.mute)return;
 audio.activate();
 // Skip-brand pointerdown unlocks the Web Audio/HTMLMedia user gesture.
 // The brand owns playback until it finishes; never overlap its soundtrack.
 if(!branding.active)audio.musicTick(performance.now()/1000,'title');
}
window.addEventListener('pointerdown',unlockTitleMusic,{capture:true});
window.addEventListener('keydown',unlockTitleMusic,{capture:true});
let productionArt={},productionLoaded=0,productionDeclared=0,productionErrors=[];
let curatedArt={},worldArt={},renderArt=productionArt,curatedLoaded=0,curatedSelected=0,curatedErrors=[];
let worldLoaded=0,worldSelected=0,worldErrors=[];
let npcArt={},npcLoaded=0,npcErrors=[],npcStatus='';
// Only source-verified, structurally eligible curated previews are used by default.
// This is display authorization, never a final human-art approval.
let curatedEnabled=new URLSearchParams(location.search).get('art')!=='classic';
let auditionRoles={};
const director=new ArtDirector({onApply:roles=>{auditionRoles=roles;}});
function showDirector(){if(state.mode==='playing')togglePause();director.open().catch(error=>console.error('Art director unavailable',error));}
let curatorLoading=null,curatorStatus='';
function refreshArt(){renderArt=curatedEnabled?{...curatedArt,...worldArt,...productionArt,...npcArt}:{...productionArt,...npcArt}}
function updateCuratorControls(){
 $('art-preview-title').checked=curatedEnabled;$('art-preview-pause').checked=curatedEnabled;
 document.body.classList.toggle('curator-active',curatedEnabled);
}
async function setCuratedPreview(enabled){
 curatedEnabled=Boolean(enabled);
 updateCuratorControls();refreshArt();
 curatorStatus=curatedEnabled
  ?(curatedLoaded?curatedLoaded+' provisional art pieces previewing (not approved)':'Loading provisional curator artwork…')
  :'';
 showAssetStatus();
 if(!curatedEnabled||curatorLoading||curatedLoaded)return;
 curatorLoading=loadCuratedPreview().then(async ({images,errors,selected})=>{
  curatedArt=images;curatedLoaded=Object.keys(images).length;
  curatedSelected=selected;curatedErrors=errors;
  refreshArt();
  curatorStatus=curatedEnabled?curatedLoaded+' of '+selected+' scene previews loaded (not approved) · preparing architecture…':'';
  showAssetStatus();
  const environment=await loadWorldSceneArt();
  worldArt=environment.images;worldLoaded=Object.keys(worldArt).length;
  worldSelected=environment.selected;worldErrors=environment.errors;
  refreshArt();
  curatorStatus=curatedEnabled
   ?curatedLoaded+' character/game previews + '+worldLoaded+' extra scene assets (not approved; '+(curatedErrors.length+worldErrors.length)+' errors; all provisional)'
   :'';
  showAssetStatus();
 }).catch(error=>{
  curatedErrors.push('preview: '+error.message);
  curatorStatus=curatedEnabled?'Art preview unavailable · classic fallbacks preserved':'';
  showAssetStatus();
 }).finally(()=>{curatorLoading=null});
 await curatorLoading;
}
let spriteStatus='Loading Cinnamon poses…',productionStatus='';
updateCuratorControls();
function showAssetStatus(){
 $('load-status').textContent=[spriteStatus,npcStatus,productionStatus,curatorStatus].filter(Boolean).join(' · ');
}
let lastStatus='',lastEventSerial=0,displayedMode='';
function safeScore(value){return Number.isFinite(value)?Math.max(0,value):0}
function save(){
 // Preserve monotonic accomplishments from a newer tab before this tab writes.
 // Storage does not offer compare-and-swap; simultaneous writes still need
 // manual recovery, but ordinary stale-tab settings changes cannot erase wins.
 const current=readSave(),currentProgress=validCheckpointRecord(current.progress,state.level)?current.progress:null;
 const discoveries=[...new Set([
  ...savedDiscoveries(current.discoveries,state.level),
  ...savedDiscoveries(saved.discoveries,state.level),
  ...state.achievements
 ])];
 saved={schema:1,settings:{...state.settings},discoveries,
  completed:saved.completed===true||current.completed===true||state.mode==='victory',
  bestShakes:Math.max(safeScore(current.bestShakes),safeScore(saved.bestShakes),state.shakeCount),
  progress:state.mode==='victory'?null:
   state.mode==='title'?currentProgress:(saved.progress||null)};
 try{localStorage.setItem(saveKey,JSON.stringify(saved))}
 catch{/* Restricted storage: gameplay still works, even if progress cannot persist. */}
 if(state.mode==='title')showContinue();
}
window.addEventListener('storage',event=>{
 if(event.key!==saveKey)return;
 const current=readSave();
 saved.completed=saved.completed===true||current.completed===true;
 saved.bestShakes=Math.max(safeScore(saved.bestShakes),safeScore(current.bestShakes));
 saved.discoveries=[...new Set([...savedDiscoveries(saved.discoveries,state.level),...savedDiscoveries(current.discoveries,state.level)])];
 state.achievements=[...new Set([...state.achievements,...saved.discoveries])];
 if(state.mode==='title'){
  saved.progress=validCheckpointRecord(current.progress,state.level)?current.progress:null;
  showContinue();
 }
});
function saveCheckpointIfNew(){
 if(state.mode!=='playing'&&state.mode!=='dead')return;
 const deaths=state.level.enemies.reduce((n,e)=>n+Number(!e.alive),0);
 const key=[state.checkpoint,state.shakeCount,state.rallyCount,deaths,...state.achievements].join(':');
 if(key===lastSavedProgressKey)return;
 const record=checkpointRecord(state);
 if(!record)return;
 lastSavedProgressKey=key;saved.progress=record;save();
}
function populateDiscoveries(id){
 const list=$(id);if(!list)return;
 const found=new Set(state.achievements);
 list.replaceChildren();
 for(const npc of state.level.secretNpcs){
  const item=document.createElement('li');
  item.textContent=(found.has(npc.id)?'✓ ':'○ ')+npc.title;
  item.className=found.has(npc.id)?'discovery-found':'discovery-hidden';
  list.appendChild(item);
 }
}
const overlayByMode={title:'title-overlay',pause:'pause-overlay',dead:'dead-overlay',victory:'victory-overlay'};
function showMode(){
 if(displayedMode==='playing'&&state.mode!=='playing')clearInputs();
 if(document.body.dataset.gameMode!==state.mode)document.body.dataset.gameMode=state.mode;
 if(displayedMode===state.mode)return;
 displayedMode=state.mode;
 screenArt.setMode(state.mode);
 titleCinematic.setTitleVisible(state.mode==='title'&&!intro.active&&!branding.active);
 for(const id of Object.values(overlayByMode))$(id).classList.add('hidden');
 const overlay=overlayByMode[state.mode];
 if(overlay)$(overlay).classList.remove('hidden');
 $('pause-btn').disabled=state.mode!=='playing';
 if(state.mode==='pause')populateDiscoveries('pause-discoveries');
 if(state.mode==='dead')$('dead-reason').textContent=state.lastDamage||'The Fox got the better of Cinnamon. For now.';
 if(state.mode==='victory'){$('victory-score').textContent=`${state.shakeCount} Shamrock Shakes found • ${state.secretCount} golden secrets • ${state.achievements.length}/2 NPC discoveries`;populateDiscoveries('victory-discoveries');save()}
 const defaultFocus={title:'start-btn',pause:'resume-btn',dead:'retry-btn',victory:'replay-btn'}[state.mode];
 if(defaultFocus&&!branding.active)$(defaultFocus).focus({preventScroll:true});
 else if(state.mode==='playing')canvas.focus({preventScroll:true});
}
// Every input source has its own owner. Auto-Run is the ONLY persistent
// direction; a swipe is held solely while that pointer is physically down.
const held=new Set(),queued=new Set(),pointerActs=new Map(),keyActs=new Map();
const gesturePad=$('gesture-pad'),autoRunButton=$('auto-run-toggle');
let comfortStorage=null;
try{comfortStorage=window.localStorage}catch{}
let comfortPrefs=readComfortSettings(comfortStorage);
let immersiveMode=null,gamepadDirection=null,gamepadConnected=false;
const gamepadHeld=new Set(),gamepadPrevious=new Set();
let lastHaptic=0;
function haptic(type){
 if(!comfortPrefs.haptics||typeof navigator.vibrate!=='function')return;
 const now=performance.now();
 if(now-lastHaptic<75)return;
 lastHaptic=now;
 try{navigator.vibrate(type==='hurt'?24:type==='cheer'?18:9)}catch{}
}
let touchSteering;
function updateHeld(action){
 if(action==='left'||action==='right'){
  const physical=[...keyActs.values(),...pointerActs.values()];
  const left=physical.includes('left'),right=physical.includes('right');
  const physicalDirection=left===right?null:left?'left':'right';
  // Held pad > hardware touch/keyboard > gamepad > deliberately enabled auto.
  const direction=touchSteering?.manualDirection||physicalDirection||gamepadDirection||
   (touchSteering?.autoRun?touchSteering.autoDirection:null);
  held.delete('left');held.delete('right');
  if(direction)held.add(direction);
  return;
 }
 const active=[...keyActs.values(),...pointerActs.values()].includes(action)||gamepadHeld.has(action);
 if(active)held.add(action);else held.delete(action);
}
function updateAutoRunUI(){
 const enabled=touchSteering.autoRun,manual=touchSteering.manualDirection;
 autoRunButton?.setAttribute('aria-pressed',String(enabled));
 autoRunButton?.setAttribute('aria-label','Auto-run: '+(enabled?'on, running '+touchSteering.autoDirection:'off, hold to move'));
 gesturePad?.setAttribute('data-direction',manual||(enabled?touchSteering.autoDirection:''));
 gesturePad?.classList.toggle('gesture-active',touchSteering.activeCount>0);
 document.body.classList.toggle('auto-running',enabled);
}
touchSteering=new TouchSteering({
 sensitivity:comfortPrefs.sensitivity,
 onChange:()=>{updateHeld('left');updateAutoRunUI()},
 onAction:action=>{
  if(state.mode!=='playing')return;
  queued.add(action);haptic(action);
 }
});
function setAutoRun(enabled){
 touchSteering.setAutoRun(enabled);
 haptic('toggle');
}
autoRunButton?.addEventListener('click',()=>{
 if(state.mode!=='playing')return;
 audio.activate();setAutoRun(!touchSteering.autoRun);
});
updateAutoRunUI();

function actionForKey(code){return ({ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyJ:'swish',KeyX:'swish',KeyC:'cheer',ShiftLeft:'dash',ShiftRight:'dash',KeyK:'dash'})[code]}
function clearInputs(){
 held.clear();queued.clear();pointerActs.clear();keyActs.clear();gamepadDirection=null;gamepadHeld.clear();
 touchSteering.cancel({disableAuto:true});updateAutoRunUI();
 document.querySelectorAll('.touch').forEach(b=>b.classList.remove('held'));
}
function isEditingFocus(){
 const element=document.activeElement;
 return Boolean(element?.closest?.('input,textarea,select,[contenteditable="true"]'));
}
function handleModalTab(e){
 if(director.dialog.open)return false;
 if(e.code!=='Tab')return false;
 const overlayId=branding.active?'brand-splash':intro.active?'intro-overlay':overlayByMode[state.mode];
 if(!overlayId)return false;
 const panel=$(overlayId);
 const focusables=[...panel.querySelectorAll('button:not(:disabled):not([hidden]),input:not(:disabled),a[href]')]
  .filter(element=>element.getClientRects().length>0);
 if(!focusables.length)return false;
 const first=focusables[0],last=focusables[focusables.length-1],active=document.activeElement;
 if(!panel.contains(active)||e.shiftKey&&active===first||!e.shiftKey&&active===last){
  e.preventDefault();(e.shiftKey?last:first).focus({preventScroll:true});return true;
 }
 return false;
}
window.addEventListener('keydown',e=>{
 if(branding.active){
  if(e.code==='Escape'){e.preventDefault();if(!e.repeat)branding.skip();return}
  if(handleModalTab(e))return;
  return;
 }
 if(director.dialog.open)return;
 // The settings dialog traps focus: gameplay keys and global shortcuts
 // cannot fire behind an active preferences modal.
 if(comfortDialog?.open)return;
 if(intro.active){
  if(e.code==='Escape'){e.preventDefault();if(!e.repeat)intro.skip();return}
  if(e.code==='ArrowRight'){e.preventDefault();if(!e.repeat)intro.advance();return}
  if(handleModalTab(e))return;
  return; // story cards cannot send input to gameplay
 }
 if(handleModalTab(e))return;
 if(e.code==='Escape'||e.code==='KeyP'){
  if(state.mode==='playing'||state.mode==='pause'){
   e.preventDefault();if(!e.repeat&&(e.code==='Escape'||!isEditingFocus()))togglePause();
  }
  return;
 }
 if(isEditingFocus())return;
 if(e.code==='KeyF'&&state.mode!=='dead'&&state.mode!=='victory'){
  e.preventDefault();
  if(!e.repeat)void immersiveMode?.toggle();
  return;
 }
 if(e.code==='KeyH'&&(state.mode==='playing'||state.mode==='pause')){
  e.preventDefault();
  if(!e.repeat)setComfortPreference('hud',comfortPrefs.hud==='full'?'compact':'full');
  return;
 }
 if(e.code==='KeyM'){
  e.preventDefault();
  if(e.repeat)return;
  audio.mute(!state.settings.mute);state.settings.mute=!state.settings.mute;updateMute();save();
  return;
 }
 if(e.code==='KeyR'&&state.mode==='dead'){
  e.preventDefault();if(!e.repeat)retry();return;
 }
 if(e.code==='Enter'&&state.mode==='title'){
  const focus=document.activeElement;
  if(!focus?.closest?.('button,a,input,select,textarea')){start();e.preventDefault()}
  // Otherwise keep native button activation (especially saved-checkpoint Continue).
  return;
 }
 const focusedTouch=document.activeElement?.closest?.('.touch');
 const touchingControl=state.mode==='playing'&&focusedTouch&&['Space','Enter'].includes(e.code);
 if(touchingControl){
  e.preventDefault();
  const act=focusedTouch.dataset.action;
  if(!keyActs.has(e.code)){
   if(!held.has(act))queued.add(act);
   keyActs.set(e.code,act);updateHeld(act);
  }
  return;
 }
 const act=actionForKey(e.code);
 if(!act||state.mode!=='playing')return;
 // Space on a real button must activate that button, not jump the character.
 if(e.code==='Space'&&document.activeElement?.closest?.('button'))return;
 e.preventDefault();
 if(!keyActs.has(e.code)){
  if(!held.has(act))queued.add(act);
  keyActs.set(e.code,act);
  if((act==='left'||act==='right')&&touchSteering.autoRun)touchSteering.setAutoDirection(act);
  updateHeld(act);
 }
});
window.addEventListener('keyup',e=>{
 const act=keyActs.get(e.code);
 if(!act)return;
 keyActs.delete(e.code);updateHeld(act);e.preventDefault();
});
window.addEventListener('blur',()=>{clearInputs();branding.pause();intro.pause();if(state.mode==='playing')togglePause()});
window.addEventListener('focus',()=>{if(!document.hidden){branding.resume();intro.resume()}});
window.addEventListener('pagehide',event=>{branding.dispose();intro.cancel();titleCinematic.dispose();audio.dispose();if(!event.persisted)director.dispose()});
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){
  clearInputs();branding.pause();intro.pause();titleCinematic.setTitleVisible(false);
  if(intro.active)audio.setPaused(true);
  if(state.mode==='playing')togglePause();
 }else{
  branding.resume();intro.resume();titleCinematic.setTitleVisible(state.mode==='title'&&!intro.active&&!branding.active);
  if(intro.active)audio.setPaused(false);
 }
 lastStamp=0;accumulator=0;
});
// Manual control lives only for the lifetime of actual pad pointers. Quick
// flicks are actions, not an invisible persistent run latch.
if(gesturePad){
 const onPointerDown=e=>{
  if(state.mode!=='playing')return;
  e.preventDefault();audio.activate();
  touchSteering.begin(e.pointerId,e.clientX,e.clientY,gesturePad.getBoundingClientRect());
  try{gesturePad.setPointerCapture(e.pointerId)}catch{}
 };
 const onPointerMove=e=>{
  if(state.mode!=='playing'||!touchSteering.pointers.has(e.pointerId))return;
  e.preventDefault();touchSteering.move(e.pointerId,e.clientX,e.clientY);
 };
 const onPointerEnd=e=>{
  if(!touchSteering.pointers.has(e.pointerId))return;
  touchSteering.end(e.pointerId,e.clientX,e.clientY,{commit:e.type==='pointerup'});
 };
 gesturePad.addEventListener('pointerdown',onPointerDown);
 gesturePad.addEventListener('pointermove',onPointerMove);
 for(const type of ['pointerup','pointercancel','lostpointercapture'])
  gesturePad.addEventListener(type,onPointerEnd);
 // Safari can revoke pointer capture when an overlay or orientation changes.
 for(const type of ['pointerup','pointercancel'])
  window.addEventListener(type,onPointerEnd);
}
for(const button of document.querySelectorAll('.touch')){
 const action=button.dataset.action;
 button.addEventListener('pointerdown',e=>{
  if(state.mode!=='playing')return;
  e.preventDefault();audio.activate();
  if(!held.has(action))queued.add(action);
  pointerActs.set(e.pointerId,action);
  if((action==='left'||action==='right')&&touchSteering.autoRun)
   touchSteering.setAutoDirection(action);
  try{button.setPointerCapture(e.pointerId)}catch{}
  haptic(action);
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
function newRound(keepIntroMusic=false){
 state=newGame(state.settings);state.achievements=savedDiscoveries(saved.discoveries,state.level);state.assetCount=assetCount;
 lastEventSerial=0;lastSavedProgressKey='';displayedMode='';
 clearInputs();lastStamp=0;accumulator=0;if(!keepIntroMusic)audio.resetSequence();audio.setPaused(false);
 saved.progress=null;
 startGame(state);save();audio.activate();showMode();canvas.focus({preventScroll:true});
}
function continueRound(){
 const record=resumableRecord();
 if(!record)return;
 const resumed=newGame(state.settings);
 if(!restoreCheckpoint(resumed,record))return;
 resumed.achievements=[...new Set([...resumed.achievements,...savedDiscoveries(saved.discoveries,resumed.level)])];
 state=resumed;state.assetCount=assetCount;
 lastEventSerial=0;lastSavedProgressKey='';displayedMode='';
 clearInputs();lastStamp=0;accumulator=0;audio.resetSequence();audio.setPaused(false);
 audio.activate();showMode();canvas.focus({preventScroll:true});
}
function start(){
 if(intro.active)return;
 if(bypassIntro){newRound();return}
 audio.activate();
 if(intro.start(()=>newRound(true))){
  titleCinematic.setTitleVisible(false);
  audio.musicTick(performance.now()/1000,'campus');
 }
}
function retry(){clearInputs();if(state.mode==='victory'){newRound();return}resetToCheckpoint(state);displayedMode='';showMode();canvas.focus({preventScroll:true});}
function togglePause(){pauseGame(state);clearInputs();audio.setPaused(state.mode!=='playing');displayedMode='';showMode();lastStamp=0;accumulator=0;save()}
function updateMute(){$('mute-btn').textContent=state.settings.mute?'♫ MUTED':'♪ SOUND';$('mute-btn').setAttribute('aria-pressed',String(state.settings.mute));}
$('start-btn').addEventListener('click',start);
$('continue-btn').addEventListener('click',continueRound);
$('resume-btn').addEventListener('click',togglePause);
$('retry-btn').addEventListener('click',retry);$('pause-retry-btn').addEventListener('click',retry);
$('replay-btn').addEventListener('click',()=>newRound());$('pause-btn').addEventListener('click',togglePause);
$('mute-btn').addEventListener('click',()=>{state.settings.mute=!state.settings.mute;audio.mute(state.settings.mute);audio.activate();updateMute();save()});
const titleMusicButton=$('title-music-btn');
titleMusicButton?.addEventListener('click',()=>{
 if(state.mode!=='title'||intro.active||branding.active)return;
 if(state.settings.mute){state.settings.mute=false;audio.mute(false);updateMute();save()}
 audio.activate();
 audio.musicTick(performance.now()/1000,'title');
 updateTitleMusicUI();
});
function updateTitleMusicUI(){
 if(!titleMusicButton)return;
 const playing=audio.diagnostics().musicPlaying&&state.mode==='title'&&!branding.active;
 titleMusicButton.textContent=playing?'♫ TITLE MUSIC PLAYING':'♫ PLAY TITLE MUSIC';
 titleMusicButton.setAttribute('aria-pressed',String(playing));
}
$('assist-check').checked=state.settings.assist;$('motion-check').checked=state.settings.reducedMotion;$('contrast-check').checked=Boolean(state.settings.contrast);
function updateContrast(){document.body.classList.toggle('high-contrast',Boolean(state.settings.contrast))}
updateContrast();
$('assist-check').addEventListener('change',e=>{state.settings.assist=e.target.checked;save()});
$('motion-check').addEventListener('change',e=>{state.settings.reducedMotion=e.target.checked;save()});
$('contrast-check').addEventListener('change',e=>{state.settings.contrast=e.target.checked;updateContrast();save()});
for(const id of ['art-director-title-open','art-director-pause-open'])
 $(id).addEventListener('click',showDirector);
for(const id of ['art-preview-title','art-preview-pause'])
 $(id).addEventListener('change',event=>setCuratedPreview(event.target.checked));
if(curatedEnabled)setCuratedPreview(true);
for(const id of ['title-art-prev','title-art-next'])
 $(id)?.addEventListener('click',()=>titleCinematic.setSelected(screenArt.getTitleIndex()===0));
// Nine independent, local-only control preferences. They never touch
// checkpoint progress, achievements or the core game save schema.
const comfortDialog=$('touch-settings-dialog');
const comfortFields={
 movement:'comfort-movement',size:'comfort-size',opacity:'comfort-opacity',
 hand:'comfort-hand',height:'comfort-height',sensitivity:'comfort-sensitivity',hud:'comfort-hud',
 haptics:'comfort-haptics',hideForGamepad:'comfort-hideForGamepad'
};
function applyComfort(){
 document.body.dataset.controlSize=comfortPrefs.size;
 document.body.dataset.controlOpacity=comfortPrefs.opacity;
 document.body.dataset.controlHand=comfortPrefs.hand;
 document.body.dataset.controlHeight=comfortPrefs.height;
 document.body.dataset.controlMovement=comfortPrefs.movement;
 document.body.dataset.controlHud=comfortPrefs.hud;
 document.body.classList.toggle('hide-touch-gamepad',comfortPrefs.hideForGamepad&&gamepadConnected);
 touchSteering.setSensitivity(comfortPrefs.sensitivity);
 for(const [key,id] of Object.entries(comfortFields)){
  const field=$(id);if(!field)continue;
  if(field.type==='checkbox')field.checked=Boolean(comfortPrefs[key]);
  else field.value=comfortPrefs[key];
 }
}
function setComfortPreference(key,value){
 if(!Object.hasOwn(comfortFields,key))return;
 comfortPrefs=sanitizeComfortSettings({...comfortPrefs,[key]:value});
 applyComfort();
 writeComfortSettings(comfortStorage,comfortPrefs);
}
for(const [key,id] of Object.entries(comfortFields)){
 const field=$(id);
 field?.addEventListener('change',()=>{
  setComfortPreference(key,field.type==='checkbox'?field.checked:field.value);
 });
}
$('comfort-reset').addEventListener('click',()=>{
 comfortPrefs={...COMFORT_DEFAULTS};
 applyComfort();writeComfortSettings(comfortStorage,comfortPrefs);
});
for(const id of ['controls-title-btn','controls-pause-btn','controls-game-btn']){
 $(id)?.addEventListener('click',()=>{
  if(branding.active||intro.active||director.dialog.open)return;
  if(state.mode==='playing')togglePause();
  if(!comfortDialog.open)comfortDialog.showModal();
 });
}
comfortDialog.addEventListener('close',()=>{
 const target=state.mode==='pause'?'resume-btn':state.mode==='title'?'start-btn':null;
 if(target)$(target).focus({preventScroll:true});
});
window.addEventListener('storage',event=>{
 if(event.key!==COMFORT_KEY)return;
 comfortPrefs=readComfortSettings(comfortStorage);
 applyComfort();
});
applyComfort();
updateMute();showContinue();
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
let lastHealthDisplay='';
function hud(){const p=state.player;
 const healthText=healthAnnouncement(p.hp,p.maxHp);
 if(healthText!==lastHealthDisplay){
  const health=$('hud-health');
  health.setAttribute('aria-label',healthText);
  health.replaceChildren(...healthSegments(p.hp,p.maxHp).map(kind=>{
   const heart=document.createElement('span');
   heart.className='health-heart health-heart--'+kind;
   heart.textContent=kind==='empty'?'♡':'♥';
   heart.setAttribute('aria-hidden','true');
   return heart;
  }));
  lastHealthDisplay=healthText;
 }
 $('hud-shakes').textContent=`SHAKES ${state.shakeCount}`;
 const rallyHigh=p.x<WORLD.campusEnd&&p.y<280;
 const zone=state.boss.triggered?'FOX SHOWDOWN':p.y<-1300&&p.x<7100?'DEXTER SUMMIT':p.y>495&&p.x<2350?'SMUDGE ALCOVE':p.x>=WORLD.campusEnd?'GOLDEN DOME':rallyHigh?'PEP RALLY':'SOUTH QUAD';
 $('hud-zone').textContent=zone;
 $('zone-readout').textContent=p.x>=WORLD.campusEnd?'02 / GOLDEN DOME':rallyHigh?'01B / PEP RALLY':'01 / CAMPUS CHASE';
 $('hud-cheer').textContent=state.cheerCooldown>0
  ?'CHEER '+state.cheerCooldown.toFixed(1)+'s'
  :'CHEER READY · C';
 const button=$('cheer-touch');
 if(button){
  button.textContent=state.cheerCooldown>0?Math.ceil(state.cheerCooldown)+'s':'CHEER';
  button.classList.toggle('cooling',state.cheerCooldown>0);
  button.setAttribute('aria-label',state.cheerCooldown>0
   ?'Cheer recharging, '+state.cheerCooldown.toFixed(1)+' seconds'
   :'Cheer: activate banner bridges and discover rally relays');
 }
 $('cheer-progress').textContent='RELAYS '+state.rallyCount+'/'+state.level.rallyPosts.length;
 const toast=$('discovery-toast'),unlock=state.discoveryToast;
 toast.hidden=!(unlock&&state.elapsed<unlock.until&&state.mode==='playing');
 if(!toast.hidden){const title='✦ DISCOVERY UNLOCKED · '+unlock.title;
  if(toast.textContent!==title)toast.textContent=title;}
 const next=state.status;if(next!==lastStatus){$('status-text').textContent=next;lastStatus=next}
}
let accumulator=0,lastStamp=0,lastHUD=0;
const frameTimings=[];
function percentile(values,p){
 if(!values.length)return null;
 const sorted=[...values].sort((a,b)=>a-b);return Number(sorted[Math.floor((sorted.length-1)*p)].toFixed(2));
}
function metrics(){return {frames:frameTimings.length,frameMsP95:percentile(frameTimings.map(x=>x.frame),.95),
 frameMsP99:percentile(frameTimings.map(x=>x.frame),.99),
 renderMsP95:percentile(frameTimings.map(x=>x.render),.95),
 renderMsP99:percentile(frameTimings.map(x=>x.render),.99),
 devicePixelRatio:Math.min(window.devicePixelRatio||1,2)};}
const gamepadMapping=[['jump',0],['dash',1],['swish',2],['cheer',3]];
function pollGamepad(){
 let pad=null;
 try{pad=[...(navigator.getGamepads?.()||[])].find(candidate=>candidate&&candidate.connected!==false)||null}catch{}
 const connected=Boolean(pad);
 if(connected!==gamepadConnected){
  gamepadConnected=connected;
  document.body.classList.toggle('gamepad-connected',connected);
  document.body.classList.toggle('hide-touch-gamepad',connected&&comfortPrefs.hideForGamepad);
 }
 const pressed=i=>Boolean(pad?.buttons?.[i]?.pressed);
 const axis=Number(pad?.axes?.[0])||0;
 const nextDirection=pressed(14)||axis<-.39?'left':pressed(15)||axis>.39?'right':null;
 if(nextDirection!==gamepadDirection){
  gamepadDirection=nextDirection;
  if(nextDirection&&touchSteering.autoRun)touchSteering.setAutoDirection(nextDirection);
  updateHeld('left');
 }
 const next=new Set();
 for(const [action,index] of gamepadMapping){
  if(pressed(index)){next.add(action);
   if(state.mode==='playing'&&!gamepadPrevious.has(action)){
    queued.add(action);haptic(action);
   }
  }
  if(state.mode==='playing'&&pressed(index))gamepadHeld.add(action);
  else gamepadHeld.delete(action);
  updateHeld(action);
 }
 if(pressed(9))next.add('pause');
 if(pressed(9)&&!gamepadPrevious.has('pause')&&!director.dialog.open&&!comfortDialog?.open){
  if(state.mode==='playing'||state.mode==='pause')togglePause();
 }
 gamepadPrevious.clear();for(const action of next)gamepadPrevious.add(action);
}
function animate(ms){requestAnimationFrame(animate);
 pollGamepad();
 const actualFrameMs=lastStamp?Math.max(0,ms-lastStamp):0;
 if(!lastStamp)lastStamp=ms;const dt=Math.min(.10,Math.max(0,(ms-lastStamp)/1000));lastStamp=ms;
 if(state.mode==='playing'){
  accumulator=Math.min(.15,accumulator+dt);let count=0;
  while(accumulator>=DT&&count<6){const input={left:held.has('left'),right:held.has('right'),jumpHeld:held.has('jump'),
    jumpPressed:queued.has('jump'),dashPressed:queued.has('dash'),swishPressed:queued.has('swish'),
    cheerPressed:queued.has('cheer')};
   queued.clear();update(state,input,DT);saveCheckpointIfNew();
   accumulator-=DT;count++;if(state.mode!=='playing')break;
  }
  const musicMode=state.mode==='victory'?'silent':state.boss.triggered?'boss':
   state.player.x>=WORLD.campusEnd?'dome':'campus';
  audio.musicTick(ms/1000,musicMode);
  // Events have monotonic IDs because the rolling 35-event history shifts.
  // An array cursor would silently stop all audio after event 35.
  for(const ev of state.events){if(ev.serial>lastEventSerial){audio.event(ev.type);lastEventSerial=ev.serial}}
 }else{accumulator=0;if(state.mode==='title'&&!branding.active)audio.musicTick(ms/1000,intro.active?'campus':'title')}
 if(state.mode==='victory')state.elapsed+=dt;
 updateMobileFraming();
 const drawStart=performance.now();
 render(ctx,state,sprites,accumulator/DT,renderArt,auditionRoles,logicalViewportWidth);
 if(actualFrameMs>0){frameTimings.push({frame:actualFrameMs,render:performance.now()-drawStart});
  if(frameTimings.length>240)frameTimings.shift()}
 if(ms-lastHUD>110){hud();updateTitleMusicUI();lastHUD=ms}
 showMode();
}
// The underlying 960x540 frame is unchanged. On portrait phones the CSS
// displays an aspect-preserved, cropped canvas and this compositor-only pan
// keeps the authoritative player visible without touching world/camera logic.
let mobileFrame=null,lastMobilePan=null,logicalViewportWidth=VIEW.width;
function updateMobileFraming(){
 if(!mobileFrame)return;
 const playerCssX=(state.player.x+state.player.w/2-state.camera.x)*mobileFrame.scale;
 const pan=mobileCanvasPan({...mobileFrame,playerCssX});
 if(pan!==lastMobilePan){
  canvas.style.setProperty('--mobile-canvas-pan',pan+'px');
  lastMobilePan=pan;
 }
}
function onResize(){
 const dpr=Math.min(window.devicePixelRatio||1,2);
 const viewport=$('viewport');
 const isFullLandscape=window.matchMedia('(pointer:coarse) and (orientation:landscape) and (max-height:520px)').matches||
  (document.body.classList.contains('immersive-mode')&&innerWidth>innerHeight);
 // Widen what we actually DRAW, not CSS-stretch a 960-pixel screenshot.
 // Retain the 540-unit vertical field and all authoritative game physics.
 logicalViewportWidth=isFullLandscape&&viewport.clientWidth&&viewport.clientHeight
  ?Math.max(VIEW.width,Math.round(VIEW.height*viewport.clientWidth/viewport.clientHeight))
  :VIEW.width;
 const bitmapWidth=Math.round(logicalViewportWidth*dpr),bitmapHeight=Math.round(VIEW.height*dpr);
 if(canvas.width!==bitmapWidth||canvas.height!==bitmapHeight){
  canvas.width=bitmapWidth;canvas.height=bitmapHeight;
  ctx.setTransform(dpr,0,0,dpr,0,0);
 }
 const portrait=window.matchMedia('(max-width: 630px) and (orientation: portrait)').matches;
 if(portrait){
  const viewportWidth=viewport.clientWidth;
  const scale=viewport.clientHeight/VIEW.height;
  mobileFrame={viewportWidth,scale,canvasWidth:VIEW.width*scale};
  lastMobilePan=null;updateMobileFraming();
 }else{
  mobileFrame=null;lastMobilePan=null;
  canvas.style.removeProperty('--mobile-canvas-pan');
 }
}
window.addEventListener('resize',onResize,{passive:true});
window.visualViewport?.addEventListener('resize',onResize,{passive:true});
onResize();
immersiveMode=createImmersiveMode({
 root:$('game-shell'),
 buttons:[$('fullscreen-title-btn'),$('fullscreen-pause-btn'),$('fullscreen-game-btn')].filter(Boolean),
 status:$('immersive-status'),
 onLayoutChange:()=>requestAnimationFrame(onResize)
});
window.addEventListener('orientationchange',()=>{
 touchSteering.cancel({disableAuto:true});
 // Let the layout settle before reallocating the wide Canvas bitmap.
 requestAnimationFrame(onResize);
},{passive:true});
// Never allow offline worker caching to pollute deterministic gameplay QA:
// only dedicated PWA browser tests opt in with ?qa=1&qa-pwa=1.
const pwaParams=new URLSearchParams(location.search);
const pwa=initPwaInstall({
 enabled:!pwaParams.has('qa')||pwaParams.get('qa-pwa')==='1',
 gameMode:()=>state.mode
});
loadAssets();
loadSecretNpcArt().then(({images,errors,loaded})=>{
 npcArt=images;npcErrors=errors;npcLoaded=loaded;refreshArt();
 npcStatus=errors.length?'Secret NPC artwork: '+loaded+'/8 SHA-256 verified frames loaded ('+errors.length+' failures)':
  loaded+' SHA-256 verified NPC encounter frames loaded';
 showAssetStatus();
}).catch(error=>{npcErrors=[error.message];npcStatus='NPC art unavailable · encounters remain discoverable';showAssetStatus();});
const params=new URLSearchParams(location.search);
const previewId=(location.hostname==='localhost'||location.hostname==='127.0.0.1')
  ?params.get('preview-art'):null;
if(previewId){productionStatus='LOCAL ART PREVIEW ONLY: '+previewId+' (NOT production activated)';showAssetStatus();}
 loadApprovedArt({previewUnverifiedId:previewId}).then(({images,errors,approved})=>{
  productionArt=images;productionLoaded=Object.keys(images).length;refreshArt();
  productionDeclared=approved;productionErrors=errors;
  if(previewId){
   productionStatus='LOCAL ART PREVIEW: '+previewId+' '+(productionArt[previewId]?'candidate loaded; NOT production activated':'unavailable; NOT production activated');
  } else if(productionLoaded>0){
   productionStatus=productionLoaded+' verified integrated artwork elements ready.';
  }
  showAssetStatus();
 }).catch(error=>{productionErrors=['loader: '+error.message];showAssetStatus()});
 showMode();requestAnimationFrame(animate);
window.__SHAKEDOWN_QA={snapshot:()=>snapshot(state),metrics,controls:()=>({...touchSteering.snapshot(),autoRun:touchSteering.autoRun,autoRunDirection:touchSteering.autoDirection,gestureDirection:touchSteering.manualDirection,renderWidth:logicalViewportWidth,comfort:{...comfortPrefs},gamepadConnected,fullscreen:immersiveMode?.state()}),pwa:()=>pwa.snapshot(),audio:()=>audio.diagnostics(),brand:()=>branding.inspect(),intro:()=>intro.inspect(),titleCinematic:()=>({visible:titleCinematic.visible}),artDirector:()=>director.diagnostics(),assets:()=>({loaded:assetCount,failed:[...assetErrors],productionLoaded,productionDeclared,productionErrors:[...productionErrors],curatedEnabled,curatedLoaded,curatedSelected,curatedErrors:[...curatedErrors],
 worldLoaded,worldSelected,worldErrors:[...worldErrors],npcLoaded,npcErrors:[...npcErrors]}),
 // Developer-only deterministic test aids; excluded from normal gameplay and production paths.
 ...(new URLSearchParams(location.search).has('qa')?{
  warp:(x,y)=>{state.player.x=x;state.player.y=y;state.player.prevX=x;state.player.prevY=y;state.player.vx=0;state.player.vy=0;state.camera.x=Math.max(0,x-450);state.camera.y=Math.max(-2450,Math.min(y>490&&x<2400?520:0,y-260));},
  setBossRecovery:()=>{state.boss.triggered=true;state.boss.mode='rest';state.boss.timer=999;state.boss.hurtTime=0;},
  inspectState:()=>state
 }:{})};
window.__SHAKEDOWN_BOOT_READY?.();
const inspectionId=new URLSearchParams(location.search).get('inspect');
if(inspectionId&&/^[A-Z]{2,4}-(?:[A-Z]{1,3})?\d{2,3}$/.test(inspectionId))
 director.open(inspectionId).catch(error=>console.error('Art source inspection failed',error));
