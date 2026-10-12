// SHAKEDOWN / visual finishing layer.
// Presentation derives from world/game state. No collision, save, input or
// animation-source mutation. Every raster texture is generated once per canvas.
import {VIEW,WORLD,CHANT_CYCLE,CHANT_UP} from './world.mjs';
const TAU=Math.PI*2;
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const skin=new WeakMap();
const COLORS=Object.freeze({
 ink:'#14283c',navy:'#183d61',gold:'#f7d782',cream:'#fff3cd',
 jade:'#93edc0',danger:'#ff8478',sky:'#97c5dd'
});
function makeSurface(w,h,draw){
 const surface=typeof OffscreenCanvas==='function'
  ?new OffscreenCanvas(w,h):document.createElement('canvas');
 surface.width=w;surface.height=h;draw(surface.getContext('2d'));return surface;
}
function tileFor(kind){
 return makeSurface(96,96,c=>{
  const earth=kind==='grass',stone=kind==='stone';
  c.fillStyle=earth?'#594333':stone?'#71696a':'#76534c';c.fillRect(0,0,96,96);
  // Hand-blocked 2D tile planes, not high-frequency procedural noise.
  for(let row=0;row<4;row++){
   const y=row*24,offset=row%2?24:0;
   c.fillStyle=earth?'#755238':stone?'#938485':'#93694f';
   c.fillRect(0,y+1,96,2);
   c.fillStyle=earth?'#46382f':stone?'#585159':'#67453c';
   for(let x=offset-48;x<100;x+=48)c.fillRect(x,y+3,2,21);
   c.fillStyle=earth?'#977148':stone?'#b3a29a':'#bb835e';
   for(let x=offset;x<100;x+=48)c.fillRect(x+8,y+7,18,2);
   c.fillStyle=earth?'#86703f':stone?'#706f73':'#4a3d3e';
   c.fillRect((row*19)%80+8,y+14,7,3);
  }
  if(earth){
   c.fillStyle='#6e7d4a';c.fillRect(10,10,5,3);c.fillRect(58,42,8,2);
   c.fillStyle='#ad7f49';c.fillRect(30,61,4,3);c.fillRect(81,78,4,3);
  }
 });
}
function linearPlate(top,mid,base){
 return makeSurface(VIEW.width,VIEW.height,c=>{
  const gradient=c.createLinearGradient(0,0,0,VIEW.height);
  gradient.addColorStop(0,top);gradient.addColorStop(.5,mid);gradient.addColorStop(1,base);
  c.fillStyle=gradient;c.fillRect(0,0,VIEW.width,VIEW.height);
 });
}
function radialStamp(inner,outer){
 return makeSurface(192,192,c=>{
  const grad=c.createRadialGradient(96,96,1,96,96,95);
  grad.addColorStop(0,inner);grad.addColorStop(.35,outer);
  grad.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=grad;c.fillRect(0,0,192,192);
 });
}
function surfaces(ctx){
 let resource=skin.get(ctx);
 if(resource)return resource;
 resource={
  ground:{
   grass:ctx.createPattern(tileFor('grass'),'repeat'),
   stone:ctx.createPattern(tileFor('stone'),'repeat'),
   gold:ctx.createPattern(tileFor('gold'),'repeat')
  },
  campus:linearPlate('rgba(255,237,190,.060)','rgba(250,194,101,.028)','rgba(64,100,99,.11)'),
  dome:linearPlate('rgba(59,100,134,.080)','rgba(248,197,124,.030)','rgba(30,50,85,.12)'),
  summit:linearPlate('rgba(244,175,96,.070)','rgba(54,93,136,.055)','rgba(29,45,71,.14)'),
  vignette:makeSurface(VIEW.width,VIEW.height,c=>{
   const g=c.createRadialGradient(480,255,125,480,255,590);
   g.addColorStop(0,'rgba(10,17,30,0)');
   g.addColorStop(.64,'rgba(10,17,30,.014)');
   g.addColorStop(1,'rgba(9,18,31,.29)');
   c.fillStyle=g;c.fillRect(0,0,VIEW.width,VIEW.height);
  }),
  goldGlow:radialStamp('rgba(255,227,142,.21)','rgba(252,197,116,.068)'),
  blueGlow:radialStamp('rgba(152,220,240,.20)','rgba(94,176,219,.055)'),
  jadeGlow:radialStamp('rgba(187,255,190,.38)','rgba(90,229,167,.13)'),
  foxGlow:radialStamp('rgba(255,144,98,.26)','rgba(238,96,76,.075)')
 };
 skin.set(ctx,resource);
 return resource;
}
// This passes between authored painted background / architectural props and
// active gameplay. Its color grading never changes sprite or collision data.
export function paintAmbientWorld(ctx,s){
 const res=surfaces(ctx),cam=s.camera;
 const campusMix=clamp((cam.x-(WORLD.campusEnd-400))/800,0,1);
 const summitMix=clamp((cam.x-6750)/550,0,1);
 ctx.save();
 ctx.globalAlpha=1-campusMix;ctx.drawImage(res.campus,0,0);
 if(campusMix>0){ctx.globalAlpha=campusMix*(1-summitMix);ctx.drawImage(res.dome,0,0)}
 if(summitMix>0){ctx.globalAlpha=summitMix;ctx.drawImage(res.summit,0,0)}
 ctx.globalAlpha=1;
 // Warm lamplight is attached to the authored Quad lamp positions, never
 // random glowing sprites that could be mistaken for a pickup.
 if(cam.x<WORLD.campusEnd){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  for(let i=1;i<22;i+=4){
   const x=i*182+93,y=351;
   if(x<cam.x-110||x>cam.x+VIEW.width+110||y<cam.y-140||y>cam.y+VIEW.height+140)continue;
   ctx.drawImage(res.goldGlow,x-82,y-88,164,164);
  }
  ctx.restore();
 }
 // Real facade/arch shadow cues add volume behind platforms and characters;
 // low-count, camera-culled, and tied to original window-column spacing.
 if(cam.x>3200){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  const startX=3748+Math.max(0,Math.floor((cam.x-3748)/432))*432;
  const startY=-1510+Math.max(0,Math.floor((cam.y+1510)/238))*238;
  for(let x=startX;x<Math.min(8200,cam.x+VIEW.width+432);x+=432){
   for(let y=startY;y<Math.min(470,cam.y+VIEW.height+238);y+=238){
    ctx.fillStyle='rgba(58,40,55,.12)';ctx.fillRect(x+200,y+7,7,210);
    ctx.fillStyle='rgba(255,237,197,.13)';ctx.fillRect(x+206,y+9,3,209);
    if((Math.round(x/432)+Math.round(y/238))%3===0){
     ctx.globalAlpha=.58;ctx.drawImage(res.blueGlow,x+104,y+24,80,123);ctx.globalAlpha=1;
    }
   }
  }
  ctx.restore();
 }
 ctx.restore();
}
export function paintPlatformFinish(ctx,p,x,y,active){
 const resources=surfaces(ctx);
 ctx.save();
 // True volume beneath play surfaces: it follows moving platforms exactly.
 ctx.fillStyle='rgba(22,31,43,.21)';
 ctx.fillRect(x+8,y+p.h,Math.max(0,p.w-15),Math.min(p.h>=80?15:9,15));
 if(p.h>=80){
  ctx.save();ctx.beginPath();ctx.rect(x+3,y+13,p.w-6,p.h-13);ctx.clip();
  ctx.globalAlpha=.83;
  ctx.fillStyle=resources.ground[p.kind]||resources.ground.stone;
  ctx.fillRect(x+3,y+13,p.w-6,p.h-13);
  ctx.restore();
  // Gold and green topsoil transition respects the authored collision top.
  ctx.fillStyle=p.kind==='grass'?'#416849':'#b9a17f';
  ctx.fillRect(x+3,y+6,p.w-6,4);
  ctx.fillStyle='rgba(255,229,162,.35)';ctx.fillRect(x+4,y+3,p.w-8,2);
 }else{
  ctx.fillStyle='rgba(11,27,45,.25)';ctx.fillRect(x+4,y+p.h-3,p.w-8,3);
  ctx.fillStyle=p.pulse?(active?'rgba(255,236,147,.58)':'rgba(145,186,218,.23)')
   :p.kind==='gold'?'rgba(255,246,183,.52)':'rgba(255,241,207,.28)';
  ctx.fillRect(x+5,y+2,p.w-10,2);
  // Distinct small end caps make lifts/ledges read as solids at speed.
  ctx.fillStyle='rgba(21,44,59,.35)';
  ctx.fillRect(x+4,y+p.h-5,5,5);ctx.fillRect(x+p.w-9,y+p.h-5,5,5);
 }
 if(p.movement){
  ctx.fillStyle='#ffe5a0';ctx.fillRect(x+10,y-6,Math.max(0,p.w-20),2);
  ctx.fillStyle='#234569';ctx.fillRect(x+9,y-4,7,4);ctx.fillRect(x+p.w-16,y-4,7,4);
 }
 ctx.restore();
}
export function paintAmbientLife(ctx,s){
 if(s.settings.reducedMotion)return;
 const cam=s.camera,campus=cam.x<WORLD.campusEnd+250;
 const limit=ctx.canvas.width>=1700?12:18;
 ctx.save();
 // Tiny motes drift at far-field speed; they never occupy player hitboxes or
 // use random numbers, and their count cannot grow with session duration.
 for(let i=0;i<limit;i++){
  const baseX=(i*157+41)%1080,baseY=(i*67+23)%440;
  const x=((baseX-cam.x*.09+s.elapsed*(campus?3:1.6))%1040+1040)%1040-40;
  const y=(baseY+Math.sin(s.elapsed*.65+i*1.4)*6-cam.y*.018+540)%540;
  if(y<65||y>495)continue;
  ctx.globalAlpha=.09+(i%4)*.024;
  ctx.fillStyle=campus?(i%3?'#fff7d6':'#9cebce'):(i%3?'#fff0c2':'#b4dcf5');
  const size=i%5===0?3:2;ctx.fillRect(x,y,size,size);
 }
 ctx.restore();
}
export function paintHeroLighting(ctx,s){
 const p=s.player,c=s.camera,r=surfaces(ctx);
 const x=p.x+p.w/2-c.x,y=p.y+p.h-c.y;
 ctx.save();
 const glow=s.boss.triggered?r.goldGlow:r.blueGlow;
 ctx.globalAlpha=s.settings.contrast ? 0.20 : 0.62;
 ctx.drawImage(glow,x-72,y-119,150,150);
 ctx.globalAlpha=p.grounded ? 0.35 : 0.17;
 ctx.fillStyle='#142638';
 ctx.beginPath();ctx.ellipse(x+1,y+2,p.grounded?37:25,p.grounded?7:5,0,0,TAU);ctx.fill();
 ctx.restore();
}
export function paintCollectibleAura(ctx,s,q){
 // Called under decoration()'s world-space transform, like drawShake().
 const res=surfaces(ctx),x=q.x,y=q.y;
 const size=q.special?92:66;
 ctx.save();ctx.globalAlpha=q.special ? 0.91 : 0.67;
 ctx.drawImage(res.jadeGlow,x-size/2,y-size/2,size,size);
 if(q.special&&!s.settings.reducedMotion){
  const p=.4+.15*Math.sin(s.elapsed*2.7+q.x);
  ctx.globalAlpha=p;ctx.fillStyle='#ffffda';
  ctx.fillRect(x-2,y-size*.45,4,7);
  ctx.fillRect(x-size*.28,y+2,6,2);
 }
 ctx.restore();
}
export function paintBossStaging(ctx,s){
 if(!s.boss.triggered||s.boss.hp<=0)return;
 const b=s.boss,cam=s.camera,res=surfaces(ctx);
 const x=b.x+b.w/2-cam.x,y=b.y+b.h/2-cam.y;
 ctx.save();
 ctx.globalAlpha=b.mode==='tell' ? 0.93 : b.mode==='rest' ? 0.82 : 0.42;
 ctx.drawImage(b.mode==='rest'?res.jadeGlow:res.foxGlow,x-104,y-100,208,208);
 ctx.globalAlpha=b.mode==='tell' ? 0.86 : 0.50;
 ctx.fillStyle=b.mode==='tell'?'#ea8c66':'#e5c28b';
 // A stage spotlight under the Fox indicates the actual enemy position.
 ctx.beginPath();ctx.ellipse(x,y+40,61,9,0,0,TAU);ctx.fill();
 ctx.restore();
}
export function paintBossHealth(ctx,s){
 if(!s.boss.triggered||s.boss.hp<=0)return;
 const x=332,y=54,w=296,h=49;
 ctx.save();ctx.fillStyle='rgba(10,28,43,.90)';ctx.fillRect(x,y,w,h);
 ctx.strokeStyle='#e4c27c';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,w-2,h-2);
 ctx.textAlign='left';ctx.font='900 14px system-ui';ctx.fillStyle='#fff1ce';
 ctx.fillText('THE FOX',x+12,y+19);
 ctx.font='800 10px system-ui';ctx.fillStyle='#b4ced0';
 ctx.fillText(s.boss.mode==='rest'?'STUNNED · STRIKE!':
  s.boss.mode==='tell'?'INCOMING ATTACK':'WAIT FOR AN OPENING',x+92,y+19);
 for(let i=0;i<3;i++){
  const sx=x+12+i*91;
  ctx.fillStyle=i<s.boss.hp?'#fa9272':'#31465b';ctx.fillRect(sx,y+29,82,10);
  if(i<s.boss.hp){ctx.fillStyle='#ffdeac';ctx.fillRect(sx+2,y+30,78,2)}
  ctx.strokeStyle='#415774';ctx.lineWidth=1;ctx.strokeRect(sx,y+29,82,10);
 }
 ctx.restore();
}
export function paintCelebrationAccents(ctx,s){
 if(s.settings.reducedMotion)return;
 const cam=s.camera,t=s.elapsed;
 ctx.save();ctx.translate(-cam.x,-cam.y);
 for(const e of s.events){
  const age=t-e.t;
  if(age<0||age>.58||!['collect','bossHit','hurt','checkpoint','dash','rally','swish'].includes(e.type))continue;
  const alpha=1-age/.58,r=11+age*75;
  const color=e.type==='hurt'?'#fb908b':e.type==='bossHit'?'#ffe9a3':
   e.type==='dash'?'#89c8ee':e.type==='swish'?'#f5bd73':'#b8f3c4';
  ctx.globalAlpha=alpha*.65;ctx.strokeStyle=color;ctx.lineWidth=e.type==='bossHit'?5:2;
  ctx.beginPath();ctx.ellipse(e.x,e.y,r,r*.57,0,0,TAU);ctx.stroke();
  if(e.type==='collect'||e.type==='rally'){
   for(let i=0;i<4;i++){
    const a=i*TAU/4+age*1.8,px=e.x+Math.cos(a)*(r+9),py=e.y+Math.sin(a)*(r+9);
    ctx.fillStyle='#fff4bb';ctx.fillRect(px-3,py-3,6,6);
   }
  }
 }
 ctx.restore();
}
export function paintLens(ctx,s){
 const r=surfaces(ctx);ctx.save();
 ctx.drawImage(r.vignette,0,0);
 if(s.boss.triggered&&s.boss.hp>0&&s.boss.mode==='tell'){
  ctx.globalAlpha=.18;
  ctx.strokeStyle=COLORS.danger;ctx.lineWidth=7;
  ctx.strokeRect(3,3,VIEW.width-6,VIEW.height-6);
 }
 ctx.restore();
}
// Replaces an obstructive two-line full-width overlay with a compact, clearly
// timed state badge. It reads the exact state used by bridge collision.
export function paintPulseReadout(ctx,s,pulse){
 if(s.mode!=='playing'||s.boss.triggered)return;
 const on=pulse.active,small=s.settings.reducedMotion;
 const x=16,y=56,w=236,h=52;
 ctx.save();
 ctx.fillStyle='rgba(10,30,47,.88)';ctx.fillRect(x,y,w,h);
 ctx.strokeStyle=on?'#f0d58d':'#87b3d0';ctx.lineWidth=2;
 ctx.strokeRect(x+1,y+1,w-2,h-2);
 ctx.fillStyle=on?COLORS.gold:'#c7e6f0';ctx.font='900 14px system-ui';ctx.textAlign='left';
 ctx.fillText(on?'GO IRISH!  ·  BRIDGES OPEN':'CHANT RESTING  ·  C TO CHEER',x+12,y+21);
 ctx.fillStyle='#e8f4ec';ctx.font='750 11px system-ui';
 const caption=small
  ?(on?'PULSE ACTIVE':'WAIT FOR THE CHANT')
  :(on?'SOLID FOR ':'NEXT CHANT IN ')+pulse.remaining.toFixed(1)+'s';
 ctx.fillText(caption+'  ·  BELLS '+s.rallyCount+'/'+s.level.rallyPosts.length,x+12,y+38);
 // Static in reduced-motion mode. Otherwise a precise fill based on the real
 // authored chant cycle, not an invented timing animation.
 ctx.fillStyle=on?'#f6d77c':'#6592ae';
 const fraction=small?1:clamp(on?pulse.remaining/CHANT_UP:1-pulse.remaining/(CHANT_CYCLE-CHANT_UP),0,1);
 ctx.fillRect(x+2,y+h-4,(w-4)*fraction,3);
 ctx.restore();
}
