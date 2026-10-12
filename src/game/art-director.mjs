import {ART_SLOTS,SLOT_LABELS,ArtRuntime} from './art-runtime.mjs';

// The running game's real Canvas 2D context is also used for a source-faithful
// art direction stage. This is a review surface, not a physics-authoritative world.
function label(ctx,value,x,y,size=16,color='#fff0bd'){
 ctx.font='900 '+size+'px system-ui';
 ctx.lineWidth=4;ctx.strokeStyle='#1c2c42';ctx.strokeText(value,x,y);
 ctx.fillStyle=color;ctx.fillText(value,x,y);
}
function checker(ctx,x,y,w,h){
 ctx.fillStyle='#d5dcdf';ctx.fillRect(x,y,w,h);
 ctx.fillStyle='#82919b';
 for(let ix=0;ix<w;ix+=24)for(let iy=0;iy<h;iy+=24){
  if(((ix+iy)/24)%2===0)ctx.fillRect(x+ix,y+iy,24,24);
 }
}
function fit(ctx,img,x,y,w,h){
 const scale=Math.min(w/img.width,h/img.height);
 const nw=img.width*scale,nh=img.height*scale;
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(img,x+(w-nw)/2,y+(h-nh)/2,nw,nh);
}
export function drawArtContext(ctx,item,image){
 ctx.save();
 const slot=item.role;
 const sky=ctx.createLinearGradient(0,0,0,540);
 sky.addColorStop(0,slot==='birthday'?'#644c7f':slot==='fox'?'#536281':'#91bbd2');
 sky.addColorStop(1,'#efd2a2');
 ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
 ctx.fillStyle='#beb09c';ctx.fillRect(0,384,960,85);
 ctx.fillStyle='#6e4e3b';ctx.fillRect(0,469,960,71);
 ctx.fillStyle='#f0d09c';ctx.fillRect(0,382,960,9);
 if(slot==='backdrop'){
  fit(ctx,image,0,0,960,540);
  ctx.fillStyle='#394c5b';ctx.fillRect(0,436,960,104);
  ctx.fillStyle='#ffe99b';ctx.fillRect(0,431,960,9);
 }else if(slot==='terrain'){
  ctx.fillStyle='#394555';ctx.fillRect(80,320,800,160);
  ctx.save();ctx.beginPath();ctx.rect(80,320,800,160);ctx.clip();
  for(let x=80;x<880;x+=64)for(let y=320;y<480;y+=64)
   ctx.drawImage(image,x,y,64,64);
  ctx.restore();ctx.strokeStyle='#ffda78';ctx.lineWidth=5;ctx.strokeRect(80,320,800,160);
  label(ctx,'OUTLINE = TRUE PLATFORM · ART DOES NOT CREATE COLLISION',80,302,17);
 }else{
  checker(ctx,294,168,372,266);
  const [w,h]=({
   cinnamon:[288,193],fox:[256,256],bossFx:[306,214],
   effect:[300,214],enemy:[214,202],pickup:[184,209],
   scenery:[338,247],mechanism:[317,230],
   interface:[315,224],birthday:[325,244]
  })[slot]||[300,222];
  fit(ctx,image,480-w/2,300-h/2,w,h);
 }
 ctx.fillStyle='#0c2338eb';ctx.fillRect(0,466,960,74);
 label(ctx,item.id+' · '+SLOT_LABELS[slot],20,493,20);
 label(ctx,item.blocked?'CONTRACT FAIL — SAFE REFERENCE ONLY':
  'PHYSICAL IMAGE VERIFIED — FINAL ART APPROVAL PENDING',
  20,524,16,item.blocked?'#ffb4ad':'#b0f9d0');
 ctx.restore();
}
const HTML=[
 '<div class="art-director-shell">',
 '<header class="art-director-header"><div><span class="art-director-eyebrow">SHAKEDOWN · ALL GENERATED SOURCE IMAGES</span>',
 '<h2 id="art-director-title">ASSET DIRECTOR <span>194 / 194</span></h2>',
 '<p>Inspect every actual source in an in-game Canvas context. Apply a variant to its real role; all changes are reversible and none count as final approval.</p></div>',
 '<button id="art-director-close" type="button" aria-label="Close asset director">✕ CLOSE</button></header>',
 '<div class="art-director-toolbar">',
 '<label>Search<input id="art-director-search" type="search" placeholder="Fox, Cinnamon, tiles, Notre Dame…"></label>',
 '<label>Game role<select id="art-director-role"><option value="">All art roles</option></select></label>',
 '<label>Quality gate<select id="art-director-verdict"><option value="">All judgments</option>',
 '<option value="preview">Original curator picks</option><option value="alternate">Alternatives</option>',
 '<option value="revise">Requires revision</option><option value="blocked">Contract blocked</option>',
 '</select></label></div>',
 '<div class="art-director-columns"><div class="art-director-browser">',
 '<label for="art-director-list">Verified real files</label>',
 '<select id="art-director-list" size="10" aria-label="Art asset ID selector"></select>',
 '<div class="art-director-steps"><button type="button" id="art-director-prev">← PREVIOUS</button>',
 '<button type="button" id="art-director-next">NEXT →</button></div></div>',
 '<section class="art-director-stage"><canvas id="art-director-canvas" width="960" height="540"',
 ' role="img" aria-label="Selected real image staged in its game rendering role"></canvas>',
 '<div class="art-director-info"><h3 id="art-director-name">Loading source manifests…</h3>',
 '<span id="art-director-details"></span><p id="art-director-reason"></p></div>',
 '<div class="art-director-buttons"><button id="art-director-apply" type="button" disabled>TRY IN THE ACTUAL GAME</button>',
 '<button id="art-director-clear" type="button">REMOVE THIS LAYER</button>',
 '<a id="art-director-review" href="tools/asset-gallery.html">REVIEW & VOTE ↗</a></div>',
 '<p id="art-director-status" role="status" aria-live="polite"></p></section></div>',
 '<footer>194 source images · 12 matching real scene roles · SHA-256 verified on demand · ',
 '24 blocked candidates preview as explicitly labeled QA reference only · no collider or save changes.</footer></div>'
].join('');
export class ArtDirector {
 constructor({onApply=()=>{},onClose=()=>{}}={}){
  this.library=new ArtRuntime();this.onApply=onApply;this.onClose=onClose;
  this.current=null;this.visible=[];this.token=0;
  this.dialog=document.createElement('dialog');
  this.dialog.id='art-director-dialog';this.dialog.className='art-director';
  this.dialog.setAttribute('aria-labelledby','art-director-title');
  this.dialog.innerHTML=HTML;document.body.append(this.dialog);
  this.$=id=>this.dialog.querySelector('#'+id);
  this.ctx=this.$('art-director-canvas').getContext('2d');
  for(const role of ART_SLOTS){
   const option=document.createElement('option');
   option.value=role;option.textContent=SLOT_LABELS[role];
   this.$('art-director-role').append(option);
  }
  for(const id of ['art-director-search','art-director-role','art-director-verdict'])
   this.$(id).addEventListener(id==='art-director-search'?'input':'change',()=>this.filter());
  this.$('art-director-list').addEventListener('change',()=>this.choose(this.$('art-director-list').value));
  this.$('art-director-prev').addEventListener('click',()=>this.move(-1));
  this.$('art-director-next').addEventListener('click',()=>this.move(1));
  this.$('art-director-close').addEventListener('click',()=>this.dialog.close());
  this.$('art-director-clear').addEventListener('click',()=>{
   if(!this.current)return;
   this.library.clearRole(this.current.role);this.onApply(this.library.active());
   this.message('Removed '+this.current.role+' audition layer. Original visuals restored.');
  });
  this.$('art-director-apply').addEventListener('click',async()=>{
   if(!this.current)return;
   try{
    const chosen=await this.library.select(this.current.id);
    this.onApply(this.library.active());
    this.message(chosen.item.id+(chosen.item.blocked?
     ' stays in this labeled QA inspection stage only; live gameplay remains unobstructed.':
     ' applied to its game rendering role. Disable or replace it whenever you wish.'));
   }catch(error){this.message('Application blocked: '+error.message)}
  });
  this.dialog.addEventListener('close',()=>{this.token++;this.onClose()});
 }
 message(value){this.$('art-director-status').textContent=value}
 async open(id=null){
  if(!this.dialog.open)this.dialog.showModal();
  this.message('Loading physical source registry…');
  try{
   await this.library.initialize();
   if(id&&!this.library.byId.has(id)){this.message('Unknown physical art ID: '+id);return}
   this.filter(id)
  }
  catch(error){this.message('Asset inventory unavailable: '+error.message)}
 }
 filter(target=null){
  const search=this.$('art-director-search').value.trim().toLowerCase();
  const role=this.$('art-director-role').value,verdict=this.$('art-director-verdict').value;
  this.visible=this.library.inventory.filter(x=>
   (!role||x.role===role)&&(!verdict||x.verdict===verdict)&&
   (!search||[x.id,x.name,x.reason,x.role].some(y=>String(y).toLowerCase().includes(search))));
  const list=this.$('art-director-list');list.replaceChildren();
  for(const x of this.visible){
   const option=document.createElement('option');option.value=x.id;
   option.textContent=x.id+' · '+x.name+(x.blocked?' ⚠':'');
   list.append(option);
  }
  const index=target?this.visible.findIndex(x=>x.id===target):-1;
  const item=this.visible[index>=0?index:0];
  if(item){list.value=item.id;this.choose(item.id)}
  else{this.current=null;this.ctx.clearRect(0,0,960,540);
   this.$('art-director-apply').disabled=true;this.message('No matching entries. Clear filters.')}
 }
 move(delta){
  if(!this.visible.length)return;
  const n=this.visible.findIndex(x=>x.id===this.current?.id);
  const next=(n+delta+this.visible.length)%this.visible.length;
  this.$('art-director-list').value=this.visible[next].id;
  this.choose(this.visible[next].id);
 }
 async choose(id){
  const item=this.library.byId.get(id);if(!item)return;
  this.current=item;const token=++this.token;
  this.$('art-director-name').textContent=item.id+' · '+item.name;
  this.$('art-director-details').textContent=
   SLOT_LABELS[item.role]+' · '+item.size.join(' × ')+' px · '+item.verdict.toUpperCase()+
   ' · SHA '+item.sha256.slice(0,16);
  this.$('art-director-reason').textContent=item.reason;
  this.$('art-director-review').href='tools/asset-gallery.html?asset='+encodeURIComponent(item.id);
  this.$('art-director-apply').disabled=true;
  this.message('SHA-256 verification and PNG decoding in progress: '+id);
  try{
   const image=await this.library.load(id);
   if(token!==this.token||this.current?.id!==id)return;
   drawArtContext(this.ctx,item,image);
   this.$('art-director-apply').disabled=false;
   this.message(item.blocked?
    'Verified original image. FAILED required transparency; only a labeled reference can be tested in gameplay.':
    'Verified original image. TRY IN THE ACTUAL GAME applies only to its presentation layer, not collision or source approval.');
  }catch(error){
   if(token!==this.token)return;
   this.ctx.clearRect(0,0,960,540);
   this.message('Source invalid or unavailable: '+error.message);
  }
 }
 diagnostics(){return {open:this.dialog.open,current:this.current?.id||null,
   filtered:this.visible.length,...this.library.diagnostics()}}
 dispose(){this.token++;this.library.dispose();this.dialog.remove()}
}
