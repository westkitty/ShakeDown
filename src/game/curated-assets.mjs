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
export async function loadCuratedPreview({request=fetch,ImageCtor=Image}={}){
 const images={},errors=[];let candidates=[];
 try{
  const [cr,mr]=await Promise.all([
   request('assets/production/curation.json',{cache:'no-store'}),
   request('assets/production/manifest.json',{cache:'no-store'})
  ]);
  if(!cr.ok||!mr.ok)throw Error('curation or candidate manifest unavailable');
  candidates=previewEntries(await cr.json(),await mr.json());
  if(!globalThis.crypto?.subtle)throw Error('SHA-256 browser verification unavailable');
 }catch(err){return {images,errors:['preview manifest: '+err.message],selected:0}}
 let next=0;
 async function worker(){
  while(next<candidates.length){
   const [id,entry]=candidates[next++];
   try{
    const response=await request(entry.path,{cache:'force-cache'});
    if(!response.ok)throw Error('HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(bytes.byteLength>25*1024*1024)throw Error('candidate exceeds 25MiB');
    const hash=hex(await crypto.subtle.digest('SHA-256',bytes));
    if(hash!==entry.sha256)throw Error('candidate hash changed');
    const image=await decodePng(bytes,ImageCtor);
    if(image.width!==entry.actual_px[0]||image.height!==entry.actual_px[1]){
     image.close?.();throw Error('image dimensions changed');
    }
    images[id]=image;
   }catch(err){errors.push(id+': '+err.message)}
  }
 }
 await Promise.all(Array.from({length:Math.min(4,candidates.length)},worker));
 return {images,errors,selected:candidates.length};
}
