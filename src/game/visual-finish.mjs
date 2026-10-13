// Lightweight authored finishing layers for the existing 960x540 Canvas game.
// The authoritative camera, physics, collision, quest logic and sprites stay in
// their original owners. All effects are bounded, deterministic and reversible.
import {VIEW,WORLD} from './world.mjs';
const leafColors=['#f6d37f','#e4a45d','#d47f57','#d7bb75'];
const dustColors=['#f8dea0','#fff0bc','#a6cdd6'];

// Precompose half-resolution soft light once: cheaper than repainting radial
// gradients over half a million game pixels on every animation frame.
let lightLayers=null;
function makeLayer(paint){
 const canvas=typeof OffscreenCanvas!=='undefined'
  ?new OffscreenCanvas(480,270):document.createElement('canvas');
 canvas.width=480;canvas.height=270;
 const c=canvas.getContext('2d');
 if(!c)return null;
 paint(c);return canvas;
}
function getLightLayers(){
 if(lightLayers)return lightLayers;
 const warm=makeLayer(c=>{
  const g=c.createLinearGradient(0,0,0,270);
  g.addColorStop(0,'rgba(255,245,196,.08)');
  g.addColorStop(.52,'rgba(255,231,164,.045)');
  g.addColorStop(1,'rgba(128,76,48,.065)');
  c.fillStyle=g;c.fillRect(0,0,480,270);
 });
 const stone=makeLayer(c=>{
  const g=c.createLinearGradient(0,0,480,270);
  g.addColorStop(0,'rgba(255,226,155,.085)');
  g.addColorStop(.5,'rgba(255,249,216,.018)');
  g.addColorStop(1,'rgba(39,54,74,.11)');
  c.fillStyle=g;c.fillRect(0,0,480,270);
 });
 const foreground=makeLayer(c=>{
  const vignette=c.createRadialGradient(240,124,80,240,124,335);
  vignette.addColorStop(0,'rgba(10,24,40,0)');
  vignette.addColorStop(.78,'rgba(10,24,40,.02)');
  vignette.addColorStop(1,'rgba(10,24,40,.23)');
  c.fillStyle=vignette;c.fillRect(0,0,480,270);
  const ground=c.createLinearGradient(0,220,0,270);
  ground.addColorStop(0,'rgba(30,33,42,0)');
  ground.addColorStop(1,'rgba(30,33,42,.12)');
  c.fillStyle=ground;c.fillRect(0,220,480,50);
 });
 const arena=makeLayer(c=>{
  const g=c.createRadialGradient(335,148,24,335,148,200);
  g.addColorStop(0,'rgba(255,156,82,.13)');
  g.addColorStop(.5,'rgba(254,161,79,.045)');
  g.addColorStop(1,'rgba(255,156,82,0)');
  c.fillStyle=g;c.fillRect(0,0,480,270);
 });
 lightLayers={warm,stone,foreground,arena};return lightLayers;
}
export function visualZone(cameraX){return cameraX<WORLD.campusEnd?'campus':cameraX<7120?'ascent':'summit'}
export function paintAtmosphere(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 const g=getLightLayers(),zone=visualZone(state.camera.x);
 ctx.save();ctx.imageSmoothingEnabled=true;
 const base=zone==='campus'?g.warm:g.stone;
 if(base)ctx.drawImage(base,0,0,screenWidth,VIEW.height);
 // Fine art-directed shafts live BEHIND gameplay objects; never obscure hazards.
 if(zone==='campus'){
  const origin=712-state.camera.x*.035;
  ctx.globalAlpha=.064;
  ctx.fillStyle='#fff0b5';
  for(let i=0;i<3;i++){
   const x=origin+i*136;
   ctx.beginPath();ctx.moveTo(x,45);ctx.lineTo(x+58,45);
   ctx.lineTo(x-180,VIEW.height);ctx.lineTo(x-325,VIEW.height);
   ctx.closePath();ctx.fill();
  }
 }
 ctx.restore();
}
export function paintArenaWash(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 if(!state.boss.triggered)return;
 const layer=getLightLayers().arena;
 if(!layer)return;
 ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.drawImage(layer,0,0,screenWidth,VIEW.height);
 ctx.restore();
}
export function paintArchitecturalDepth(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 const cam=state.camera;
 if(cam.x+screenWidth<3700||cam.x>8210)return;
 // Culling in *world space* avoids painting thousands of off-screen stones.
 const minX=Math.max(3700,Math.floor(cam.x)-8),maxX=Math.min(8210,Math.ceil(cam.x+screenWidth)+8);
 const first=Math.floor((cam.y+1540)/476)*476-1540;
 ctx.save();ctx.translate(-cam.x,-cam.y);
 for(let y=first;y<cam.y+VIEW.height+80;y+=476){
  if(y< -1540||y>470)continue;
  ctx.fillStyle='rgba(89,62,54,.15)';ctx.fillRect(minX,y+5,maxX-minX,9);
  ctx.fillStyle='rgba(255,231,176,.17)';ctx.fillRect(minX,y+15,maxX-minX,3);
  ctx.fillStyle='rgba(78,62,59,.11)';ctx.fillRect(minX,y+23,maxX-minX,2);
 }
 // A few architectural pilaster shadows break up identical window modules.
 const firstX=3700+Math.max(0,Math.floor((cam.x-3700)/864))*864;
 for(let x=firstX;x<maxX;x+=864){
  ctx.fillStyle='rgba(66,49,54,.09)';ctx.fillRect(x,Math.max(-1530,cam.y-5),16,Math.min(470,cam.y+VIEW.height+5)-Math.max(-1530,cam.y-5));
  ctx.fillStyle='rgba(255,239,197,.18)';ctx.fillRect(x+16,Math.max(-1530,cam.y-5),3,Math.min(470,cam.y+VIEW.height+5)-Math.max(-1530,cam.y-5));
 }
 ctx.restore();
}
export function paintSeasonalAir(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 if(state.settings.reducedMotion)return;
 const t=state.elapsed,cam=state.camera,zone=visualZone(cam.x);
 const campus=zone==='campus',count=campus?14:10;
 ctx.save();
 for(let i=0;i<count;i++){
  const speed=campus?9+(i%4)*3:4+(i%3)*2;
  const w=screenWidth+110,h=VIEW.height+90;
  const x=((i*173-cam.x*.115+Math.sin(t*.45+i*2.3)*8)%w+w)%w-38;
  const y=((i*117+t*speed)%h+h)%h-28;
  if(campus){
   // Crisp autumn leaf silhouettes, not blurred circular particle spam.
   const scale=(i%3)+2;
   ctx.save();ctx.translate(Math.round(x),Math.round(y));
   ctx.rotate(Math.sin(i*2+t*.45)*.38);
   ctx.globalAlpha=.42+(i%3)*.10;
   ctx.fillStyle=leafColors[i%leafColors.length];
   ctx.beginPath();ctx.moveTo(0,-scale);ctx.lineTo(scale,0);
   ctx.lineTo(0,scale);ctx.lineTo(-scale,0);ctx.closePath();ctx.fill();
   ctx.fillRect(-.5,scale-1,1,scale);
   ctx.restore();
  }else{
   ctx.fillStyle=dustColors[i%dustColors.length];
   ctx.globalAlpha=.18+(i%3)*.07;
   ctx.fillRect(Math.round(x),Math.round(y),i%4===0?3:2,i%4===0?3:2);
  }
 }
 ctx.restore();
}
export function paintForegroundFinish(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 const layer=getLightLayers().foreground;
 if(!layer)return;
 ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.drawImage(layer,0,0,screenWidth,VIEW.height);
 ctx.restore();
}
export function paintContactShadow(ctx,state){
 const p=state.player;
 if(!p.grounded)return;
 const x=Math.round(p.x+p.w/2-state.camera.x);
 const y=Math.round(p.y+p.h-state.camera.y)+1;
 ctx.save();ctx.globalAlpha=.21;
 ctx.fillStyle='#152334';
 ctx.beginPath();ctx.ellipse(x,y,38,7,0,0,Math.PI*2);ctx.fill();
 ctx.globalAlpha=.11;ctx.fillStyle='#fff3d1';
 ctx.fillRect(x-24,y-3,48,1);ctx.restore();
}
function panel(ctx,x,y,w,h,border){
 ctx.fillStyle='rgba(10,28,47,.88)';
 ctx.beginPath();ctx.roundRect(x,y,w,h,8);ctx.fill();
 ctx.strokeStyle=border;ctx.lineWidth=1.5;ctx.stroke();
 ctx.fillStyle='rgba(247,207,125,.31)';
 ctx.fillRect(x+10,y+4,w-20,1);
}
export function paintPulseReadout(ctx,state,chant){
 const screenWidth=state.renderWidth||VIEW.width;
 const active=state.activePulse,notice=state.checkpointNotice;
 const x=screenWidth/2,y=59,w=370;
 ctx.save();panel(ctx,x-w/2,y,w,53,active?'#e7c870':'#829cba');
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font='900 15px system-ui';ctx.fillStyle=active?'#ffe49a':'#d5e9f5';
 ctx.fillText(active?'GO IRISH  ·  BANNERS SOLID':'CHANT RESTING  ·  C TO CHEER',x,y+18);
 ctx.font='750 11px system-ui';ctx.fillStyle='#f0e5cb';
 const left=active?'BRIDGES OPEN':'NEXT CHANT '+chant.remaining.toFixed(1)+'s';
 ctx.fillText(left+'    ·    RALLY BELLS '+state.rallyCount+'/'+state.level.rallyPosts.length,x,y+37);
 if(notice>0){
  const opacity=Math.min(1,notice);
  ctx.globalAlpha=opacity;
  panel(ctx,x-144,128,288,31,'#efce7b');
  ctx.fillStyle='#ffe6aa';ctx.font='900 14px system-ui';
  ctx.fillText(state.level.checkpoints[state.checkpoint].id.toUpperCase()+'  ·  CHECKPOINT',x,144);
 }
 ctx.restore();
}
export function paintFoxReadout(ctx,state){
 const screenWidth=state.renderWidth||VIEW.width;
 const x=screenWidth/2,y=65,w=366,h=54;
 ctx.save();panel(ctx,x-w/2,y,w,h,'#eeb371');
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.font='900 15px system-ui';ctx.fillStyle='#ffddad';
 ctx.fillText('THE FOX  ·  SHOWDOWN',x,y+15);
 for(let i=0;i<3;i++){
  const px=x-129+i*88,py=y+30;
  ctx.fillStyle='rgba(255,238,190,.16)';ctx.fillRect(px,py,82,12);
  ctx.fillStyle=i<state.boss.hp?'#ed8055':'#394655';
  ctx.fillRect(px+2,py+2,78,8);
  if(i<state.boss.hp){
   ctx.fillStyle='#ffcca0';ctx.fillRect(px+3,py+2,76,2);
  }
  ctx.strokeStyle='#d9b289';ctx.lineWidth=1;ctx.strokeRect(px+.5,py+.5,81,11);
 }
 ctx.restore();
}

const materials={
 grass:{edge:'#8fc379',light:'#a7c881',dark:'#644738',grain:'#b38e61'},
 wood:{edge:'#ffdcaa',light:'#e4b88b',dark:'#704d43',grain:'#b97c5b'},
 gold:{edge:'#fff0b2',light:'#f0ce83',dark:'#876648',grain:'#bf9b60'},
 stone:{edge:'#f5dfba',light:'#d9c2a9',dark:'#70636b',grain:'#ac9c8d'}
};
// Draw on the original collider's footprint. Texture is camera-culled and
// entirely visual; no collision, save, or platform dimensions are changed.
export function paintPlatformFinish(ctx,kind,x,y,w,h,cameraX=0,viewWidth=VIEW.width){
 if(w<14||h<10)return;
 const mat=materials[kind]||materials.stone;
 const left=Math.max(x+3,Math.floor(cameraX)-8);
 const right=Math.min(x+w-3,Math.ceil(cameraX+viewWidth)+8);
 if(right<=left)return;
 ctx.save();
 ctx.globalAlpha=.86;ctx.fillStyle=mat.edge;
 ctx.fillRect(left,y+2,right-left,2);
 ctx.globalAlpha=.54;ctx.fillStyle=mat.dark;
 ctx.fillRect(left,y+10,right-left,2);
 if(h>38){
  ctx.globalAlpha=.24;ctx.fillStyle=mat.light;
  ctx.fillRect(left,y+30,right-left,2);
  if(h>83)ctx.fillRect(left,y+74,right-left,2);
 }
 const step=31;
 const first=Math.floor((left-x)/step);
 for(let i=Math.max(0,first);x+i*step<right;i++){
  const tx=Math.round(x+i*step);
  const seed=(i*37+Math.floor(x/17)*13+Math.floor(y/19)*7)>>>0;
  const width=Math.min(8,Math.max(0,right-tx-3));
  if(width<2)continue;
  if(kind==='grass'){
   ctx.globalAlpha=.55+(seed%3)*.1;ctx.fillStyle=i%2?'#88b85f':'#bad189';
   ctx.fillRect(tx+3,y-1+(seed%2),3,4);
   ctx.fillRect(tx+7,y+3,Math.min(8,width),2);
  }else if(kind==='gold'){
   ctx.globalAlpha=.45;ctx.fillStyle=mat.light;
   ctx.fillRect(tx+4,y+5,Math.min(9,width),2);
   if(i%4===0){ctx.globalAlpha=.65;ctx.fillStyle='#fff1be';ctx.fillRect(tx+5,y+1,4,2)}
  }else if(kind==='wood'){
   ctx.globalAlpha=.38;ctx.fillStyle=mat.dark;
   ctx.fillRect(tx+4,y+6,Math.min(11,width),1);
   ctx.globalAlpha=.40;ctx.fillStyle=mat.light;
   ctx.fillRect(tx+7,y+13,Math.min(7,width),1);
  }else{
   ctx.globalAlpha=.37;ctx.fillStyle=mat.dark;
   ctx.fillRect(tx+5,y+8,Math.min(4,width),2);
  }
  if(h>32){
   const pos=y+17+(seed%Math.max(3,Math.min(21,h-25)));
   ctx.globalAlpha=.28;ctx.fillStyle=mat.grain;
   ctx.fillRect(tx+7,pos,Math.min(width,7),2);
   if(h>72){
    ctx.fillStyle=mat.dark;ctx.globalAlpha=.22;
    ctx.fillRect(tx+15,y+53+(seed%9),Math.min(6,width),3);
   }
  }
 }
 ctx.restore();
}
