// Browser fullscreen with an explicit, honest immersive fallback for Safari.
// User gesture is required; never claim that browser chrome was hidden on iPhone.
export function createImmersiveMode({root,buttons=[],status=null,onLayoutChange=()=>{}}){
 const doc=root.ownerDocument;
 let fallback=false,requestedOrientation=false;
 const nativeElement=()=>doc.fullscreenElement||doc.webkitFullscreenElement||null;
 const nativeActive=()=>nativeElement()===root;
 const installed=()=>Boolean(doc.defaultView?.navigator?.standalone||
  doc.defaultView?.matchMedia?.('(display-mode: standalone)')?.matches||
  doc.defaultView?.matchMedia?.('(display-mode: fullscreen)')?.matches);
 const active=()=>nativeActive()||fallback;
 let noticeTimer=0;
 const inform=message=>{
  if(!status)return;
  status.textContent=message;
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>{if(status.textContent===message)status.textContent=''},6000);
 };
 function sync(){
  const enabled=active();
  doc.body.classList.toggle('immersive-mode',enabled);
  doc.body.dataset.fullscreenKind=nativeActive()?'native':fallback?'fallback':'off';
  for(const button of buttons){
   button.setAttribute('aria-pressed',String(enabled));
   button.setAttribute('aria-label',enabled?'Exit fullscreen view':'Enter fullscreen view');
   button.textContent=button.id==='fullscreen-game-btn'?'⛶':(enabled?'⛶ EXIT FULLSCREEN':'⛶ FULLSCREEN');
  }
  onLayoutChange();
 }
 async function toggle(){
  if(nativeActive()){
   try{
    if(doc.exitFullscreen)await doc.exitFullscreen();
    else if(doc.webkitExitFullscreen)doc.webkitExitFullscreen();
    if(requestedOrientation){try{screen.orientation?.unlock?.()}catch{}requestedOrientation=false}
   }catch{inform('Browser could not exit fullscreen. Use the system Back or Escape control.')}
   sync();return;
  }
  if(fallback){
   fallback=false;sync();inform('Normal view restored.');return;
  }
  const request=root.requestFullscreen||root.webkitRequestFullscreen;
  if(request&&(doc.fullscreenEnabled||doc.webkitFullscreenEnabled)){
   try{
    await request.call(root);
    if(screen.orientation?.lock&&matchMedia('(orientation:landscape)').matches){
     try{await screen.orientation.lock('landscape');requestedOrientation=true}catch{}
    }
    inform('Fullscreen active. Use Escape, Back, or this button to exit.');
    sync();return;
   }catch{/* No element fullscreen: provide a useful layout-only fallback. */}
  }
  fallback=true;sync();
  inform(installed()
   ? 'Immersive layout enabled in your installed ShakeDown app.'
   : 'Immersive layout enabled. For a browser-chrome-free app window, install ShakeDown using your browser menu where supported.');
 }
 const changed=()=>{if(!nativeActive()){requestedOrientation=false}sync()};
 doc.addEventListener('fullscreenchange',changed);
 doc.addEventListener('webkitfullscreenchange',changed);
 for(const button of buttons)button.addEventListener('click',()=>{void toggle()});
 sync();
 return {toggle,sync,state:()=>({active:active(),native:nativeActive(),fallback,installed:installed()})};
}
