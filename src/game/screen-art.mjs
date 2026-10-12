// Presentation-only raster title and result plates. No SVG and no gameplay mutations.
// The three owner-provided clean plates are exact SHA-verified reconstructions of
// ShakeDown_Screens_2026-10-11.zip; alternate title art remains freely browsable.
export const TITLE_SCENES=Object.freeze([
 {slug:'owner-start',label:'THE ORIGINAL BIRTHDAY START',
  path:'assets/screens/01_start_level_clean_960x540.png',kind:'owner'},
 {slug:'01_dawn-quad-hero',label:'THE SHAKE SNATCH'},
 {slug:'02_the-last-shake',label:'THE LAST SHAKE'},
 {slug:'03_golden-ascent',label:'THE GOLDEN ASCENT'},
 {slug:'04_summit-showdown',label:'SUMMIT SHOWDOWN'},
 {slug:'05_birthday-finale',label:'THE BIRTHDAY FINALE'},
 {slug:'06_pep-rally-midnight',label:'PEP RALLY MIDNIGHT'},
 {slug:'07_quad-pursuit',label:'QUAD PURSUIT'},
 {slug:'08_blue-hour-on-the-dome',label:'BLUE HOUR ON THE DOME'},
 {slug:'09_the-long-way-up',label:'THE LONG WAY UP'},
 {slug:'10_the-prize',label:'THE PRIZE'}
].map(item=>Object.freeze(item)));
export const RESULT_SCENES=Object.freeze({
 dead:'assets/screens/02_game_over_continue_clean_960x540.png',
 victory:'assets/screens/03_victory_credits_clean_960x540.png'
});
export function titleScenePath(index){
 if(!Number.isInteger(index)||index<0||index>=TITLE_SCENES.length)
  throw RangeError('Unknown title art index');
 const scene=TITLE_SCENES[index];
 return scene.path||'assets/title/canvas/title_'+scene.slug+'_960x540.png';
}
export function resultScenePath(mode){
 if(!Object.hasOwn(RESULT_SCENES,mode))throw RangeError('Unknown result art mode');
 return RESULT_SCENES[mode];
}

// Visuals are provisional and fail open to the existing semantic DOM menu.
// The game's Canvas renderer, player state, input and collision remain authoritative.
export function initScreenArt({doc=document,search=location.search}={}){
 if(new URLSearchParams(search).get('art')==='classic')return {setMode(){}};
 const holders={title:doc.getElementById('title-overlay'),
  dead:doc.getElementById('dead-overlay'),
  victory:doc.getElementById('victory-overlay')};
 const plates={};
 for(const [mode,holder] of Object.entries(holders)){
  if(!holder)continue;
  const image=doc.createElement('img');
  image.id=mode+'-scene-art';
  image.className='scene-art-backdrop';
  image.alt='';
  image.setAttribute('aria-hidden','true');
  image.decoding='async';
  holder.insertBefore(image,holder.firstChild);
  plates[mode]={holder,image,loadedSource:null};
 }
 function display(mode,index=0){
  const plate=plates[mode];if(!plate)return;
  const source=mode==='title'?titleScenePath(index):resultScenePath(mode);
  if(plate.loadedSource===source)return;
  plate.loadedSource=source;
  const owner=source.startsWith('assets/screens/');
  plate.holder.classList.remove('screen-art-ready','owner-art-ready');
  plate.image.onload=()=>{
   if(plate.image.getAttribute('src')!==source)return;
   if(plate.image.naturalWidth===960&&plate.image.naturalHeight===540){
    plate.holder.classList.add('screen-art-ready');
    plate.holder.classList.toggle('owner-art-ready',owner);
   }else plate.holder.classList.remove('screen-art-ready','owner-art-ready');
  };
  plate.image.onerror=()=>plate.holder.classList.remove('screen-art-ready','owner-art-ready');
  plate.image.src=source;
 }
 let chosen=0;
 const panel=holders.title?.querySelector('.hero-panel');
 if(panel){
  const controls=doc.createElement('div');
  controls.className='title-art-controls';
  controls.innerHTML='<button id="title-art-prev" type="button" aria-label="Previous title artwork">◀</button><span id="title-art-status" role="status" aria-live="polite"></span><button id="title-art-next" type="button" aria-label="Next title artwork">▶</button>';
  panel.append(controls);
  const status=controls.querySelector('#title-art-status');
  const refresh=()=>{
   status.textContent=String(chosen+1).padStart(2,'0')+' / '+TITLE_SCENES.length+' · '+TITLE_SCENES[chosen].label;
   display('title',chosen);
  };
  controls.querySelector('#title-art-prev').addEventListener('click',()=>{chosen=(chosen+TITLE_SCENES.length-1)%TITLE_SCENES.length;refresh()});
  controls.querySelector('#title-art-next').addEventListener('click',()=>{chosen=(chosen+1)%TITLE_SCENES.length;refresh()});
  refresh();
 }
 return {setMode(mode){
  if(Object.hasOwn(RESULT_SCENES,mode))display(mode);
 }};
}
