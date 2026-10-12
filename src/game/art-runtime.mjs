// Verified, demand-loaded art catalog shared by the in-game director and renderer.
// Every physical Arena image maps to exactly one non-gameplay-authoritative slot.
const SHA=/^[0-9a-f]{64}$/;
const PATH=/^assets\/(?:production|level1)\/[a-z0-9/_-]+\.png$/i;
const GROUP_SLOTS=Object.freeze({
 BD:'birthday', BG:'backdrop', BS:'bossFx', CIN:'cinnamon',
 CO:'pickup', EN:'enemy', EX:'effect', FOX:'fox', FX:'fox',
 MC:'mechanism', PK:'pickup', PR:'scenery', TL:'terrain',
 UI:'interface', UX:'interface', VF:'effect'
});
export const ART_SLOTS=Object.freeze([
 'backdrop','terrain','scenery','mechanism','enemy','pickup',
 'cinnamon','fox','bossFx','effect','interface','birthday'
]);
export const SLOT_LABELS=Object.freeze({
 backdrop:'Sky / parallax / distant architecture',
 terrain:'Visible platforms and tile surfaces',
 scenery:'Non-colliding world decorations',
 mechanism:'Platforms, drum beacons and checkpoints',
 enemy:'Cup Crawlers and confetti cannons',
 pickup:'Shamrock Shakes, hearts and collectible visuals',
 cinnamon:'Cinnamon character and recovery animation',
 fox:'Fox boss, costume variants and story portraits',
 bossFx:'Fox attack cues, stagger and boss VFX',
 effect:'Jump, landing, pickups and level VFX',
 interface:'HUD, controls and menu visual tests',
 birthday:'Cake, shakes and the birthday finale'
});
export function roleForId(id){
 if(typeof id!=='string')return null;
 const bits=id.split('-');
 if(bits[0]==='DM'){
  return ({BG:'backdrop',TL:'terrain',PR:'scenery',MC:'mechanism'})[bits[1]?.slice(0,2)]||null;
 }
 return GROUP_SLOTS[bits[0]]||null;
}
export function validateArtInventory(curation,manifest){
 const c=curation?.entries,m=manifest?.assets;
 if(curation?.schemaVersion!==1||manifest?.schema_version!==1||
     !c||!m||curation.generatedCount!==194||manifest.count!==194)
  throw Error('The 194-image source or curator inventory is incomplete');
 const ids=Object.keys(m);
 if(ids.length!==194||Object.keys(c).length!==194)throw Error('Art ID count drift');
 const entries=[],usedPaths=new Set(),usedHashes=new Set();
 for(const id of ids){
  const record=m[id],review=c[id],role=roleForId(id);
  if(!role||!review||review.id!==id||record.id!==id||
     review.sourcePath!==record.path||review.sha256!==record.sha256||
     !SHA.test(record.sha256)||!PATH.test(record.path)||record.path.includes('..')||
     !Array.isArray(record.actual_px)||record.actual_px.length!==2||
     record.actual_px.some(n=>!Number.isInteger(n)||n<=0||n>4096)||
     usedPaths.has(record.path)||usedHashes.has(record.sha256))
   throw Error('Unsafe or inconsistent art source: '+id);
  if(!['preview','alternate','revise','blocked'].includes(review.verdict)||
     !Array.isArray(review.structuralIssues)||review.finalHumanApproval!==false)
   throw Error('Missing independent artist review state: '+id);
  usedPaths.add(record.path);usedHashes.add(record.sha256);
  entries.push(Object.freeze({
   id,role,name:record.name,path:record.path,sha256:record.sha256,
   size:Object.freeze([...record.actual_px]),verdict:review.verdict,
   blocked:review.verdict==='blocked'||review.structuralIssues.length>0,
   reason:review.reason,priority:record.priority,group:record.group
  }));
 }
 return Object.freeze(entries.sort((a,b)=>a.id.localeCompare(b.id)));
}
const hex=buffer=>Array.from(new Uint8Array(buffer),n=>n.toString(16).padStart(2,'0')).join('');
async function decode(bytes,ImageConstructor){
 const blob=new Blob([bytes],{type:'image/png'});
 if(typeof createImageBitmap==='function')return createImageBitmap(blob);
 if(!ImageConstructor||typeof URL==='undefined')throw Error('Image decode unavailable');
 const url=URL.createObjectURL(blob);
 return new Promise((resolve,reject)=>{
  const img=new ImageConstructor();
  img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
  img.onerror=()=>{URL.revokeObjectURL(url);reject(Error('Invalid PNG'))};
  img.src=url;
 });
}
export class ArtRuntime {
 constructor({request=(...args)=>globalThis.fetch(...args),ImageConstructor=globalThis.Image,maxCachedPixels=6000000}={}){
  this.request=request;this.ImageConstructor=ImageConstructor;
  this.maxCachedPixels=maxCachedPixels;this.inventory=[];
  this.byId=new Map();this.cache=new Map();this.pending=new Map();
  this.selected=new Map();this.failures=new Map();this.ready=false;
  this.disposed=false;
 }
 async initialize(){
  if(this.ready)return this.inventory;
  if(this.initializing)return this.initializing;
  this.initializing=(async()=>{
   if(typeof this.request!=='function')throw Error('fetch unavailable');
   const [a,b]=await Promise.all([
    this.request('assets/production/curation.json',{cache:'no-store'}),
    this.request('assets/production/manifest.json',{cache:'no-store'})
   ]);
   if(!a.ok||!b.ok)throw Error('Image source catalogs unavailable');
   const [curation,manifest]=await Promise.all([a.json(),b.json()]);
   const entries=validateArtInventory(curation,manifest);
   if(this.disposed)throw Error('Art session closed');
   this.inventory=entries;this.byId=new Map(entries.map(x=>[x.id,x]));
   this.ready=true;return entries;
  })();
  try{return await this.initializing}finally{this.initializing=null}
 }
 get(id){const cached=this.cache.get(id);if(!cached)return null;
  this.cache.delete(id);this.cache.set(id,cached);return cached.image}
 async load(id){
  await this.initialize();
  const row=this.byId.get(id);
  if(!row)throw Error('Unknown physical asset ID '+id);
  const existing=this.get(id);if(existing)return existing;
  if(this.pending.has(id))return this.pending.get(id);
  const task=(async()=>{
   try{
    if(!globalThis.crypto?.subtle)throw Error('SHA-256 unavailable');
    const response=await this.request(row.path,{cache:'force-cache'});
    if(!response.ok)throw Error('Source HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(bytes.byteLength<24||bytes.byteLength>25000000)throw Error('Suspicious PNG size');
    const digest=hex(await crypto.subtle.digest('SHA-256',bytes));
    if(digest!==row.sha256)throw Error('Source checksum does not match committed art');
    const image=await decode(bytes,this.ImageConstructor);
    if(image.width!==row.size[0]||image.height!==row.size[1]){
     image.close?.();throw Error('Source dimensions changed');
    }
    if(this.disposed){image.close?.();throw Error('Art session closed')}
    this.cache.set(id,{image,pixels:image.width*image.height});
    this.evict(id);
    this.failures.delete(id);
    return image;
   }catch(error){this.failures.set(id,error.message);throw error}
  })();
  this.pending.set(id,task);
  try{return await task}finally{this.pending.delete(id)}
 }
 evict(protectId=null){
  let pixels=[...this.cache.values()].reduce((sum,x)=>sum+x.pixels,0);
  if(pixels<=this.maxCachedPixels)return;
  const pinned=new Set(this.selected.values());
  if(protectId)pinned.add(protectId);
  for(const [id,item] of this.cache){
   if(pixels<=this.maxCachedPixels)break;
   if(pinned.has(id))continue;
   this.cache.delete(id);pixels-=item.pixels;item.image.close?.();
  }
 }
 async select(id){
  await this.initialize();
  const item=this.byId.get(id);
  if(!item)throw Error('Unknown asset '+id);
  const previous=this.selected.get(item.role);
  this.selected.set(item.role,id);
  try{
   const image=await this.load(id);
   this.evict(id);
   return {item,image};
  }catch(error){
   if(previous)this.selected.set(item.role,previous);
   else this.selected.delete(item.role);
   throw error;
  }
 }
 clearRole(role){this.selected.delete(role);this.evict()}
 active(){
  const out={};
  for(const [role,id] of this.selected){
   const entry=this.byId.get(id),image=this.get(id);
   if(entry&&image)out[role]={id,image,blocked:entry.blocked,name:entry.name};
  }
  return out;
 }
 diagnostics(){return {available:this.inventory.length,loaded:this.cache.size,
  selected:Object.fromEntries(this.selected),errors:[...this.failures],pixels:[...this.cache.values()].reduce((x,y)=>x+y.pixels,0)}}
 dispose(){
  this.disposed=true;this.selected.clear();
  for(const item of this.cache.values())item.image.close?.();
  this.cache.clear();
 }
}
