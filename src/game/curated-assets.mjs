// Optional, personally curated art audition. Never marks generated art human-approved.
const SHA=/^[0-9a-f]{64}$/;
export function previewEntries(curation,manifest){
 if(curation?.schemaVersion!==1||manifest?.schema_version!==1||
     !curation.entries||!manifest.assets)return [];
 return Object.entries(curation.entries).filter(([id,item])=>{
  const source=manifest.assets[id];
  return item?.verdict==='preview'&&item.previewWired===true&&
   item.finalHumanApproval===false&&
   Array.isArray(item.structuralIssues)&&item.structuralIssues.length===0&&
   source?.review_status==='AWAITING_HUMAN_VISUAL_REVIEW'&&
   item.sourcePath===source.path&&item.sha256===source.sha256&&
   SHA.test(item.sha256)&&
   item.sourcePath.startsWith('assets/')&&!item.sourcePath.includes('..')&&
   /^assets\/(?:production|level1)\/[a-z0-9/_-]+\.png$/i.test(item.sourcePath)&&
   Array.isArray(source.actual_px)&&source.actual_px.length===2&&
   source.actual_px.every(n=>Number.isInteger(n)&&n>0&&n<=4096);
 }).map(([id])=>[id,manifest.assets[id]]);
}
const hex=bytes=>Array.from(new Uint8Array(bytes)).map(n=>n.toString(16).padStart(2,'0')).join('');
async function decodePng(bytes,ImageCtor){
 const blob=new Blob([bytes],{type:'image/png'});
 if(typeof createImageBitmap==='function')return createImageBitmap(blob);
 return new Promise((resolve,reject)=>{
  const url=URL.createObjectURL(blob),image=new ImageCtor();
  image.onload=()=>{URL.revokeObjectURL(url);resolve(image)};
  image.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Image decode failed'))};
  image.src=url;
 });
}

// A bounded set of extra *provisional* scene assets, not a license to use
// the 194-image pack indiscriminately. Every ID below has a real PNG and is
// currently classified "alternate" with no structural defects.
// They are never promoted to final artwork without owner approval.
export const WORLD_SCENE_IDS=Object.freeze([
 'DM-BG01','DM-BG03','DM-BG07',
 'DM-PR01','DM-PR02','DM-PR03','DM-PR04','DM-PR05','DM-PR06','DM-PR10',
 'DM-MC01','DM-MC03','DM-MC04','DM-MC05','DM-MC06','DM-MC07','DM-MC08',
 'MC-01','MC-02','MC-04',
 'PR-02','PR-04','PR-05','PR-07','PR-11','PR-13','PR-14',
 'BD-06','BD-07','BD-08','BD-14',
 'VF-03','VF-04','VF-08',
 // Source-verified animation partners and real gameplay VFX, still provisional.
 'EN-02','EN-03','VF-05','VF-10','UI-01','UI-02',
 'DM-TL16'
]);
export function worldSceneEntries(curation,manifest){
 if(curation?.schemaVersion!==1||manifest?.schema_version!==1||
    !curation.entries||!manifest.assets)return [];
 return WORLD_SCENE_IDS.flatMap(id=>{
  const item=curation.entries[id],src=manifest.assets[id];
  if(!item||!src||item.id!==id||src.id!==id||
     item.verdict!=='alternate'||item.finalHumanApproval!==false||
     !Array.isArray(item.structuralIssues)||item.structuralIssues.length!==0||
     src.review_status!=='AWAITING_HUMAN_VISUAL_REVIEW'||
     item.sourcePath!==src.path||item.sha256!==src.sha256||
     !SHA.test(src.sha256)||
     !/^assets\/(?:production|level1)\/[a-z0-9/_-]+\.png$/i.test(src.path)||
     src.path.includes('..')||
     !Array.isArray(src.actual_px)||src.actual_px.length!==2||
     !src.actual_px.every(n=>Number.isInteger(n)&&n>0&&n<=4096))
   return [];
  return [[id,src]];
 });
}
async function fetchVerifiedSelection({request,ImageCtor},select,category){
 const images={},errors=[];let candidates=[];
 try{
  const [cr,mr]=await Promise.all([
   request('assets/production/curation.json',{cache:'no-store'}),
   request('assets/production/manifest.json',{cache:'no-store'})
  ]);
  if(!cr.ok||!mr.ok)throw Error('curation or candidate manifest unavailable');
  candidates=select(await cr.json(),await mr.json());
  if(!globalThis.crypto?.subtle)throw Error('SHA-256 browser verification unavailable');
 }catch(error){return {images,errors:[category+' manifest: '+error.message],selected:0}}
 let next=0;
 async function worker(){
  while(next<candidates.length){
   const [id,entry]=candidates[next++];
   try{
    const response=await request(entry.path,{cache:'force-cache'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(bytes.byteLength<24||bytes.byteLength>25*1024*1024)throw Error('candidate PNG size invalid');
    const hash=hex(await crypto.subtle.digest('SHA-256',bytes));
    if(hash!==entry.sha256)throw Error('candidate hash changed');
    const image=await decodePng(bytes,ImageCtor);
    if(image.width!==entry.actual_px[0]||image.height!==entry.actual_px[1]){
     image.close?.();throw Error('image dimensions changed');
    }
    images[id]=image;
   }catch(error){errors.push(id+': '+error.message)}
  }
 }
 await Promise.all(Array.from({length:Math.min(4,candidates.length)},worker));
 return {images,errors,selected:candidates.length};
}
export async function loadCuratedPreview({request=fetch,ImageCtor=Image}={}){
 return fetchVerifiedSelection({request,ImageCtor},previewEntries,'preview');
}
export async function loadWorldSceneArt({request=fetch,ImageCtor=Image}={}){
 return fetchVerifiedSelection({request,ImageCtor},worldSceneEntries,'scene');
}
