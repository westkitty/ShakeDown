// Owner-supplied opening ident. Owns only the pre-title media lifecycle;
// never advances the simulation, changes saves, or alters the story cards.
export const BRAND_MOVIE='assets/branding/stinky-weasel-brand.mp4';
export const BRAND_POSTER='assets/branding/stinky-weasel-brand-poster.webp';
const STALL_LIMIT_MS=7500;
const MAX_PLAYBACK_MS=65000;

export function initBrandIntro({doc=document,clock=window,search=location.search,
 onFinish=()=>{},onGesture=()=>{},reduced=()=>clock.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true}={}){
 const panel=doc.getElementById('brand-splash');
 const video=doc.getElementById('brand-video');
 const still=doc.getElementById('brand-poster');
 const sound=doc.getElementById('brand-sound');
 const skip=doc.getElementById('brand-skip');
 const status=doc.getElementById('brand-status');
 const shell=doc.getElementById('game-shell');
 if(![panel,video,still,sound,skip,status,shell].every(Boolean))
  throw Error('Stinky Weasel branding DOM missing');
 const params=new URLSearchParams(search);
 const bypass=params.get('skip-brand')==='1'||params.get('skip-intro')==='1'||
   (params.has('qa')&&params.get('brand')!=='1');
 let active=false,finished=false,paused=false,heard=false,watchdog=null,hardStop=null;
 let deadline=0,hardDeadline=0,remaining=STALL_LIMIT_MS,hardRemaining=MAX_PLAYBACK_MS;
 let lastProgress=0,reason='pending';
 const clearWatchdog=()=>{
  if(watchdog!==null){clock.clearTimeout(watchdog);watchdog=null}
  if(hardStop!==null){clock.clearTimeout(hardStop);hardStop=null}
 };
 function schedule(){
  clearWatchdog();
  if(!active||paused)return;
  const now=clock.performance.now();
  deadline=now+remaining;
  hardDeadline=now+hardRemaining;
  watchdog=clock.setTimeout(()=>finish('stalled'),remaining);
  hardStop=clock.setTimeout(()=>finish('watchdog'),hardRemaining);
 }
 function finish(why='ended'){
  if(!active||finished)return false;
  finished=true;active=false;reason=why;
  clearWatchdog();
  video.pause();
  panel.classList.add('hidden');
  panel.classList.remove('has-video');
  doc.body.classList.remove('brand-playing');
  shell.inert=false;
  onFinish(why);
  return true;
 }
 function start(){
  if(active||finished)return false;
  if(bypass){
   reason='bypassed';finished=true;
   panel.classList.add('hidden');
   doc.body.classList.remove('brand-playing');
   shell.inert=false;
   return false;
  }
  active=true;paused=false;heard=false;remaining=STALL_LIMIT_MS;hardRemaining=MAX_PLAYBACK_MS;lastProgress=0;reason='playing';
  panel.classList.remove('hidden');
  doc.body.classList.add('brand-playing');
  shell.inert=true;
  video.muted=true;video.defaultMuted=true;
  // Respect reduced motion without silently omitting the production ident.
  // A brief, accessible still replaces the animated film.
  const reduceMotion=Boolean(reduced());
  sound.hidden=reduceMotion;
  if(reduceMotion){
   remaining=2200;hardRemaining=2200;reason='reduced-motion';
   status.textContent='STINKY WEASEL ENTERTAINMENT';
   schedule();skip.focus({preventScroll:true});
   return true;
  }
  video.playsInline=true;
  video.preload='auto';
  video.poster=BRAND_POSTER;
  still.src=BRAND_POSTER;
  video.src=BRAND_MOVIE;
  video.load();
  const pending=video.play();
  pending?.catch?.(()=>{if(active)status.textContent='Press PLAY WITH SOUND or SKIP to continue'});
  schedule();
  skip.focus({preventScroll:true});
  return true;
 }
 function toggleSound(){
  if(!active)return false;
  onGesture();
  if(heard){
   video.muted=true;heard=false;
   sound.textContent='PLAY WITH SOUND';
   sound.setAttribute('aria-pressed','false');
   return true;
  }
  heard=true;video.muted=false;
  try{video.currentTime=0}catch{}
  paused=false;lastProgress=0;remaining=STALL_LIMIT_MS;hardRemaining=MAX_PLAYBACK_MS;schedule();
  const attempt=video.play();
  attempt?.catch?.(()=>{
   if(!active)return;
   heard=false;video.muted=true;
   sound.textContent='PLAY WITH SOUND';
   sound.setAttribute('aria-pressed','false');
   status.textContent='Sound unavailable here; the intro continues silently';
  });
  sound.textContent='MUTE INTRO';
  sound.setAttribute('aria-pressed','true');
  return true;
 }
 function pause(){
  if(!active||paused)return;
  paused=true;remaining=Math.max(0,deadline-clock.performance.now());
  hardRemaining=Math.max(0,hardDeadline-clock.performance.now());
  clearWatchdog();video.pause();
 }
 function resume(){
  if(!active||!paused)return;
  paused=false;schedule();
  video.play().catch(()=>{});
 }
 video.addEventListener('playing',()=>{if(active)panel.classList.add('has-video')});
 // Headless and software-decoded browsers may advance media-time slower than
 // wall-time. Never discard a progressing ident because of a fixed 12s timer.
 video.addEventListener('timeupdate',()=>{
  if(!active||paused||video.currentTime<=lastProgress+.04)return;
  lastProgress=video.currentTime;
  hardRemaining=Math.max(0,hardDeadline-clock.performance.now());
  remaining=STALL_LIMIT_MS;
  schedule();
 });
 video.addEventListener('ended',()=>finish('ended'));
 video.addEventListener('error',()=>{
  if(!active)return;
  status.textContent='Opening clip unavailable; continuing to the title';
  clearWatchdog();
  watchdog=clock.setTimeout(()=>finish('media-error'),650);
 });
 skip.addEventListener('click',event=>{
  event.preventDefault();
  if(!active)return;
  onGesture();finish('skipped');
 });
 sound.addEventListener('click',toggleSound);
 return {start,pause,resume,skip:()=>finish('skipped'),
  dispose:()=>{clearWatchdog();video.pause()},
  get active(){return active},
  inspect:()=>({active,finished,reason,paused,soundEnabled:heard,
   source:active?video.currentSrc||video.src:null,
   mediaReady:video.readyState,playing:!video.paused})};
}
