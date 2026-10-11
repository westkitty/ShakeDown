// Runtime loads only reviewer-accepted, physically verified asset IDs.
// Generated art never changes authoritative world coordinates or collision.
export const RENDER_ASSET_IDS=Object.freeze([
 'BG-01','CO-03','BD-01','FOX-02','FOX-03','FOX-05','FOX-06',
 'FOX-07','FOX-08','FOX-09','FOX-10','FOX-11','FOX-12'
]);
const SUPPORTED=new Set(RENDER_ASSET_IDS);
export function imageEntries(manifest,{previewUnverifiedId=null}={}){
 if(!manifest||manifest.schemaVersion!==1||!manifest.assets||typeof manifest.assets!=='object')return [];
 return Object.entries(manifest.assets).filter(([id,e])=>
  SUPPORTED.has(id)&&e&&e.reviewStatus==='reviewer-attested'&&
  (e.integrationStatus==='verified'||
    (e.integrationStatus==='unverified'&&id===previewUnverifiedId))&&
  typeof e.path==='string'&&/^assets\/(?:level1|production)\//.test(e.path)&&
  !e.path.split('/').includes('..')&&e.path.endsWith('.png')&&
  Number.isInteger(e.width)&&Number.isInteger(e.height)&&
  e.width>0&&e.height>0);
}
export async function loadApprovedArt({request=fetch,ImageCtor=Image,previewUnverifiedId=null}={}){
 const images={},errors=[];
 let manifest;
 try{
  const response=await request('assets/runtime/manifest.json',{cache:'no-store'});
  if(!response.ok)throw Error('asset ledger HTTP '+response.status);
  manifest=await response.json();
 }catch(e){return {images,errors:['ledger: '+e.message],approved:0}}
 const entries=imageEntries(manifest,{previewUnverifiedId});
 await Promise.all(entries.map(([id,e])=>new Promise(resolve=>{
  const image=new ImageCtor();let done=false;
  const finish=(ok)=>{
   if(done)return;done=true;
   image.onload=null;image.onerror=null;
   if(ok)images[id]=image;else errors.push(id);
   resolve();
  };
  image.onload=()=>finish(image.naturalWidth===e.width&&image.naturalHeight===e.height);
  image.onerror=()=>finish(false);
  image.src=e.path;
 })));
 return {images,errors,approved:entries.length};
}
