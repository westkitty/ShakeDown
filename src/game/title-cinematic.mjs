// Decorative title clip. The original black matte is keyed to transparency in
// the WebM; the MP4 fallback uses screen blending against an unused campus plate.
export function initTitleCinematic({doc=document,search=location.search,reduced=()=>false}={}){
 const overlay=doc.getElementById('title-overlay');
 const stage=doc.getElementById('title-intro-stage');
 const video=doc.getElementById('title-intro-video');
 const poster=doc.getElementById('title-intro-poster');
 const enabled=new URLSearchParams(search).get('art')!=='classic';
 let alive=true,selected=true,titleVisible=true,ready=false;
 const sync=()=>{
  if(!alive)return;
  const visible=enabled&&selected&&titleVisible&&ready;
  overlay.classList.toggle('title-cinematic',visible);
  if(!visible||reduced()){
   video.pause();stage.classList.remove('playing');
  }else{
   video.play().catch(()=>{stage.classList.remove('playing')});
  }
 };
 const markReady=()=>{if(poster.naturalWidth){ready=true;sync()}};
 if(enabled){
  poster.addEventListener('load',markReady);
  poster.addEventListener('error',()=>{ready=false;sync()});
  if(poster.complete)markReady();
  video.addEventListener('playing',()=>stage.classList.add('playing'));
  video.addEventListener('pause',()=>stage.classList.remove('playing'));
  video.addEventListener('error',()=>stage.classList.remove('playing'));
  sync();
 }else{
  video.removeAttribute('autoplay');
  video.preload='none';
  video.pause();
 }
 return {setTitleVisible(value){titleVisible=Boolean(value);sync()},
  setSelected(value){selected=Boolean(value);sync()},
  refresh:sync,
  dispose(){alive=false;video.pause()},
  get visible(){return overlay.classList.contains('title-cinematic')}};
}
