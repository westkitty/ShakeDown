// Standalone read-only, browser-local asset inspection. No uploads, no approvals.
const byId=id=>document.getElementById(id);
const base='../';
const state={items:[],selected:null,manifest:null,previewUrl:null,candidate:null};
const output=(id,value)=>{byId(id).textContent=String(value??'—')};
function notify(message,error=false){
 output('status-line',message);
 byId('load-error').hidden=!error;
 if(error)output('load-error',message);
}
function status(item){
 const collection=item.type==='image'?state.manifest.assets:state.manifest.audio;
 const candidate=collection&&collection[item.id];
 if(candidate&&candidate.reviewStatus==='reviewer-attested'&&candidate.path)return'approved';
 if(item.type==='image'&&String(item.status).startsWith('VERIFIED'))return'source';
 return'pending';
}
function contractPriority(item){return item.priority==='EXISTING'?'SOURCE':item.priority||'AUDIO'}
function sizeLabel(item){
 if(item.type==='audio')return item.duration||'Recorded audio';
 const d=item.target_px||[];return d.length===2?d[0]+' × '+d[1]:'Not specified';
}
function sortItems(a,b){
 const rank={P0:0,P1:1,P2:2,EXISTING:3};
 return (rank[a.priority]??4)-(rank[b.priority]??4)||a.id.localeCompare(b.id);
}
function placeholder(text='Awaiting production'){
 const wrap=document.createElement('div');wrap.className='placeholder';
 const shape=document.createElement('span');shape.textContent='◇';shape.setAttribute('aria-hidden','true');
 const strong=document.createElement('strong');strong.textContent=text;
 const small=document.createElement('small');small.textContent='Generated files must be physically received and reviewed.';
 wrap.append(shape,strong,small);return wrap;
}
function setPreview(item){
 const parent=byId('preview');parent.replaceChildren();
 const approved=(item.type==='image'&&status(item)==='approved')?state.manifest.assets[item.id]:null;
 const path=approved?.path||(status(item)==='source'?item.path:null);
 if(item.type==='image'&&path){
  const img=document.createElement('img');img.alt='Verified '+item.name;
  img.onerror=()=>parent.replaceChildren(placeholder('Reference could not be loaded'));
  img.src=base+path;parent.append(img);
 }else parent.append(placeholder(item.type==='audio'?'Audio pending':'No approved generated art'));
}
function currentItem(id){return state.items.find(item=>item.id===id)||null}
function detail(item){
 state.selected=item;
 state.candidate=null;
 if(state.previewUrl){URL.revokeObjectURL(state.previewUrl);state.previewUrl=null}
 output('detail-id',item.id);
 output('detail-name',item.name||item.title);
 output('detail-priority',contractPriority(item));
 const s=status(item);
 output('detail-state',s==='approved'?'APPROVED OUTPUT':s==='source'?'EXISTING SOURCE':'AWAITING ART');
 output('detail-size',sizeLabel(item));
 output('detail-alpha',item.type==='audio'?'Audio file':item.transparent?'Required transparent':'Opaque');
 output('detail-group',(item.group||'AUDIO')+' / '+(item.zone||item.type));
 output('detail-origin',s==='approved'?'Reviewer-attested file':s==='source'?'Source-derived frame':'No accepted file');
 output('detail-brief',item.visual||item.brief||'See source contract');
 output('detail-acceptance',item.acceptance||'Original recording, provenance, licensing, playback and listening review required.');
 output('detail-path',item.path||'Assigned by audio intake after WAV/OGG approval');
 byId('candidate').value='';
 const parent=byId('candidate-result');parent.className='candidate-result';parent.textContent='No file inspected for '+item.id+'. File selection remains on this device.';
 byId('copy-command').disabled=false;
 setPreview(item);
 try{history.replaceState(null,'','#asset='+encodeURIComponent(item.id))}catch{}
 renderList();
}
function filterItems(){
 const text=byId('search').value.trim().toLowerCase();
 const type=byId('type-filter').value,priority=byId('priority-filter').value,
  selectedStatus=byId('status-filter').value;
 return state.items.filter(x=>(type==='all'||x.type===type)&&
  (priority==='all'||x.priority===priority)&&
  (selectedStatus==='all'||status(x)===selectedStatus)&&
  (!text||[x.id,x.name,x.title,x.group,x.zone,x.visual].filter(Boolean).join(' ').toLowerCase().includes(text)));
}
function renderList(){
 const found=filterItems(),list=byId('asset-list');
 output('filtered-count',found.length+' matching');
 list.replaceChildren();
 if(!found.length){const e=document.createElement('p');e.className='empty';e.textContent='No matches. Try another category or priority.';list.append(e);return}
 const fragment=document.createDocumentFragment();
 for(const item of found){
  const button=document.createElement('button');button.type='button';button.className='asset-option';
  button.setAttribute('aria-current',String(state.selected?.id===item.id));
  button.setAttribute('aria-label',item.id+' '+(item.name||item.title)+', '+status(item));
  const id=document.createElement('span');id.className='id';id.textContent=item.id;
  const label=document.createElement('span');label.className='name';label.textContent=item.name||item.title;
  const pill=document.createElement('span');pill.className='pill '+status(item);
  pill.textContent=status(item)==='approved'?'APPROVED':status(item)==='source'?'SOURCE':'PENDING';
  button.append(id,label,pill);
  button.addEventListener('click',()=>detail(item));
  fragment.append(button);
 }
 list.append(fragment);
}
function setCandidateResult(message,kind=''){
 const p=byId('candidate-result');p.className='candidate-result '+kind;p.textContent=message;
}
async function hashBytes(data){
 if(!crypto?.subtle)return 'unavailable (requires HTTPS/localhost)';
 const hash=await crypto.subtle.digest('SHA-256',data);
 return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function fileSig(data,ext){
 const bytes=new Uint8Array(data.slice(0,12));
 if(ext==='.png')return [137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b);
 if(ext==='.wav')return String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WAVE';
 if(ext==='.ogg')return String.fromCharCode(...bytes.slice(0,4))==='OggS';
 return false;
}
function inspectAudioContainer(data,ext,problems,warnings){
 const dv=new DataView(data);
 if(ext==='.ogg'){
  if(data.byteLength<28){problems.push('Truncated OGG page');return 'n/a'}
  const segments=dv.getUint8(26);
  if(data.byteLength<27+segments){problems.push('Truncated OGG segment table');return 'n/a'}
  warnings.push('OGG codec, complete stream, loudness and loop seam need actual playback QA');
  return 'OGG page header only';
 }
 if(data.byteLength<44){problems.push('WAV shorter than the minimum PCM header');return 'n/a'}
 let off=12,format=null,bytesPerSecond=0,dataBytes=0,rate=0,channels=0;
 while(off+8<=data.byteLength){
  const tag=String.fromCharCode(...new Uint8Array(data.slice(off,off+4)));
  const size=dv.getUint32(off+4,true),end=off+8+size;
  if(end>data.byteLength){problems.push('Truncated WAV '+tag+' chunk');break}
  if(tag==='fmt '&&size>=16){
   format=dv.getUint16(off+8,true);channels=dv.getUint16(off+10,true);
   rate=dv.getUint32(off+12,true);bytesPerSecond=dv.getUint32(off+16,true);
  }
  if(tag==='data')dataBytes+=size;
  off=end+(size%2);
 }
 if(!format||channels<1||rate<1||bytesPerSecond<1||dataBytes<1)
  problems.push('WAV missing a valid fmt/data payload');
 if(format&&!([1,3,6,7,65534].includes(format)))
  warnings.push('Uncommon WAV codec must be decoded in the target browser');
 if(bytesPerSecond>0&&dataBytes>0)return 'WAV '+channels+' ch / '+rate+' Hz / '+(dataBytes/bytesPerSecond).toFixed(2)+' sec';
 return 'Unknown WAV duration';
}
async function inspectFile(file){
 const item=state.selected;
 if(!item){setCandidateResult('Select an asset contract first.','fail');return}
 const limit=item.type==='image'?25*1024*1024:50*1024*1024;
 if(file.size>limit||file.size===0){setCandidateResult('Rejected: zero bytes or file exceeds intake limit.','fail');return}
 const ext='.'+(file.name.split('.').pop()||'').toLowerCase();
 if(item.type==='image'&&ext!=='.png'||item.type==='audio'&&!['.wav','.ogg'].includes(ext)){
  setCandidateResult('Rejected: expected '+(item.type==='image'?'a PNG':'a WAV/OGG')+' file for '+item.id+'.','fail');return
 }
 let url=null;
 try{
  const bytes=await file.arrayBuffer();
  if(!fileSig(bytes,ext)){setCandidateResult('Rejected: file content does not match '+ext+' signature.','fail');return}
  const sha=await hashBytes(bytes);
  let problems=[],warnings=[],dimensions='n/a',alpha='n/a',coverage='n/a';
  if(item.type==='image'){
   url=URL.createObjectURL(file);
   const image=await createImageBitmap(file);
   dimensions=image.width+' × '+image.height;
   if(!item.target_px||image.width!==item.target_px[0]||image.height!==item.target_px[1])
    problems.push('Dimensions differ from contract: '+sizeLabel(item));
   if(image.width>4096||image.height>4096||image.width*image.height>16777216){
    problems.push('Image dimensions exceed safe inspection limits');
   }else{
    const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
    const d=ctx.getImageData(0,0,c.width,c.height).data;
    let transparent=0,semi=0,visible=0,touchesEdge=false;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
     const a=d[(y*c.width+x)*4+3];
     if(a===0){transparent++;continue}
     visible++;if(a<255)semi++;
     if(x===0||y===0||x===c.width-1||y===c.height-1)touchesEdge=true;
    }
    alpha=transparent+' transparent / '+semi+' semitransparent pixels';
    coverage=Math.round(100*visible/(c.width*c.height))+'% visible';
    if(!visible)problems.push('Image is fully transparent');
    if(item.transparent&&!transparent&&!semi)problems.push('No transparency in a required-alpha asset');
    if(!item.transparent&&(transparent||semi))problems.push('Opaque contract has transparent pixels');
    if(item.transparent&&touchesEdge)warnings.push('Visible pixels touch the image edge: inspect clipping');
   }
   image.close();
  }else{
   dimensions=inspectAudioContainer(bytes,ext,problems,warnings);
   warnings.push('Copyright, licensing, true playback, loudness and loop quality require human review');
  }
  const ok=!problems.length;
  const message=(ok?'STRUCTURE CHECK PASSED — NOT ART APPROVAL':'REJECTED — STRUCTURE CHECK FAILED')+
   '\nID: '+item.id+'\nFile: '+file.name+'\nSize: '+file.size.toLocaleString()+' bytes'+
   '\nDimensions: '+dimensions+'\nAlpha: '+alpha+'\nCoverage: '+coverage+
   '\nSHA-256: '+sha+
   (problems.length?'\nProblems:\n• '+problems.join('\n• '):'')+
   (warnings.length?'\nWarnings:\n• '+warnings.join('\n• '):'')+
   '\nNext: '+(ok?'inspect character identity and visual fidelity manually; then stage via CLI':'correct candidate before staging');
  setCandidateResult(message,ok?(warnings.length?'warn':'pass'):'fail');
  if(ok&&item.type==='image'&&url){
   if(state.previewUrl)URL.revokeObjectURL(state.previewUrl);
   state.previewUrl=url;
   const img=document.createElement('img');img.src=url;img.alt='Local, unapproved preview for '+item.id;
   byId('preview').replaceChildren(img);
   url=null;
  }
  state.candidate={fileName:file.name,sha,structuralPass:ok};
 }catch(error){setCandidateResult('Inspection failed: '+error.message,'fail')}
 finally{if(url)URL.revokeObjectURL(url)}
}
async function main(){
 try{
  const [specRes,manifestRes]=await Promise.all([
   fetch(base+'docs/assets/ShakeDown_Complete_Asset_Contract.json',{cache:'no-store'}),
   fetch(base+'assets/runtime/manifest.json',{cache:'no-store'})
  ]);
  if(!specRes.ok||!manifestRes.ok)throw Error('Missing master contract or approved runtime manifest');
  const [spec,manifest]=await Promise.all([specRes.json(),manifestRes.json()]);
  if(!Array.isArray(spec.assets)||!Array.isArray(spec.audio)||manifest.schemaVersion!==1)
   throw Error('Unexpected asset contract/manifest schema');
  state.manifest=manifest;
  state.items=[
   ...spec.assets.map(x=>({...x,type:'image'})),
   ...spec.audio.map(x=>({...x,type:'audio',name:x.title,priority:'AUDIO'}))
  ].sort(sortItems);
  output('total-visual',spec.assets.length);
  output('source-count',state.items.filter(x=>status(x)==='source').length);
  output('approved-count',state.items.filter(x=>status(x)==='approved').length);
  output('pending-count',state.items.filter(x=>status(x)==='pending').length);
  for(const id of ['type-filter','priority-filter','status-filter'])byId(id).addEventListener('change',renderList);
  byId('search').addEventListener('input',renderList);
  byId('candidate').addEventListener('change',event=>{
   if(event.target.files?.[0])inspectFile(event.target.files[0]);
  });
  const drop=byId('drop-zone');
  drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('dragover')});
  drop.addEventListener('dragleave',()=>drop.classList.remove('dragover'));
  drop.addEventListener('drop',e=>{
   e.preventDefault();drop.classList.remove('dragover');
   if(e.dataTransfer.files?.[0])inspectFile(e.dataTransfer.files[0]);
  });
  byId('copy-command').addEventListener('click',async()=>{
   if(!state.selected)return;
   const selected=state.selected,candidate=state.candidate;
   const file='/ABSOLUTE/PATH/TO/'+(candidate?.fileName||(selected.type==='image'?'image.png':'sound.wav'));
   const sq=String.fromCharCode(39);
   const shellQuote=value=>sq+value.replaceAll(sq,String.fromCharCode(39,92,39,39))+sq;
   const command='node scripts/asset-intake.mjs stage --id '+selected.id+' --file '+shellQuote(file);
   try{await navigator.clipboard.writeText(command);notify('Command template copied. Replace /ABSOLUTE/PATH/TO before running from repository root.')}
   catch{setCandidateResult('Clipboard unavailable. Run this from repo root:\n'+command,'warn')}
  });
  const requested=decodeURIComponent((location.hash.split('asset=')[1]||'').split('&')[0]);
  const initial=currentItem(requested)||filterItems()[0]||state.items[0];
  if(initial)detail(initial);
  notify('Contract loaded: '+spec.assets.length+' images + '+spec.audio.length+' audio requests. No file was uploaded.');
 }catch(error){notify('Asset Control Room unavailable: '+error.message,true)}
}
main();
