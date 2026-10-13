// Title-to-playable narrative: no physics or save mutations until the last card.
// Generated intro artwork is independent of the P019 production-art acceptance ledger.
export const INTRO_PANELS = Object.freeze([
 Object.freeze({src:'assets/intro/panel_01.webp',
  caption:'At last... a Shamrock Shake in October!',
  description:'Cinnamon Fuzzbutt celebrates finding an out-of-season mint-green Shamrock Shake at a fall campus stand.'}),
 Object.freeze({src:'assets/intro/panel_02.webp',
  caption:'Hey! That fox stole my Shamrock Shake!',
  description:'The Fox steals the green Shamrock Shake and runs while Cinnamon reaches after him.'}),
 Object.freeze({src:'assets/intro/panel_03.webp',
  caption:'I’m getting my Shamrock Shake back!',
  description:'Cinnamon sets out across the autumn campus while the Fox flees with the Shamrock Shake.'})
]);
export const INTRO_FRAME_MS = 4300;

export function initIntroFlow({doc=document,clock=window,onFinish=()=>{}}={}){
 const overlay=doc.getElementById('intro-overlay');
 const img=doc.getElementById('intro-image');
 const back=doc.getElementById('intro-backdrop');
 const counter=doc.getElementById('intro-counter');
 const caption=doc.getElementById('intro-caption');
 const fallback=doc.getElementById('intro-fallback');
 const next=doc.getElementById('intro-next');
 const skip=doc.getElementById('intro-skip');
 if(![overlay,img,back,counter,caption,fallback,next,skip].every(Boolean))
  throw new Error('Intro flow DOM missing');
 let active=false,index=-1,timer=null,deadline=0,remaining=INTRO_FRAME_MS,paused=false;
 let finishOnce=onFinish;
 const clear=()=>{if(timer!==null){clock.clearTimeout(timer);timer=null}};
 const schedule=()=>{
  clear();
  if(!active||paused)return;
  deadline=clock.performance.now()+remaining;
  timer=clock.setTimeout(()=>advance(),remaining);
 };
 const show=()=>{
  const panel=INTRO_PANELS[index];
  img.hidden=false;fallback.hidden=true;
  img.alt=panel.description+' '+panel.caption;
  img.src=panel.src;back.src=panel.src;
  counter.textContent='STORY '+(index+1)+' / '+INTRO_PANELS.length;
  caption.textContent=panel.caption;
  fallback.textContent=panel.caption;
  next.textContent=index===INTRO_PANELS.length-1?'BEGIN THE CHASE →':'NEXT →';
  remaining=INTRO_FRAME_MS;
  schedule();
 };
 function stop({complete=false}={}){
  if(!active)return false;
  clear();active=false;paused=false;index=-1;
  overlay.classList.add('hidden');
  doc.body.classList.remove('intro-playing');
  img.removeAttribute('src');back.removeAttribute('src');
  if(complete){const callback=finishOnce;finishOnce=()=>{};callback();}
  return true;
 }
 function advance(){
  if(!active)return false;
  clear();
  if(index>=INTRO_PANELS.length-1)return stop({complete:true});
  index++;show();return true;
 }
 function start(done=onFinish){
  if(active)return false;
  if(typeof done!=='function')throw TypeError('Intro completion callback required');
  finishOnce=done;active=true;paused=false;index=0;
  overlay.classList.remove('hidden');
  doc.body.classList.add('intro-playing');
  show();
  next.focus({preventScroll:true});
  return true;
 }
 function pause(){
  if(!active||paused)return;
  paused=true;
  remaining=Math.max(0,deadline-clock.performance.now());
  clear();
 }
 function resume(){if(!active||!paused)return;paused=false;schedule();}
 next.addEventListener('click',advance);
 skip.addEventListener('click',()=>stop({complete:true}));
 img.addEventListener('error',()=>{if(active){img.hidden=true;fallback.hidden=false;}});
 return {start,advance,skip:()=>stop({complete:true}),cancel:()=>stop(),
  pause,resume,get active(){return active},inspect:()=>({active,index,paused,panel:active?INTRO_PANELS[index].src:null})};
}
