// Draw a personally selected candidate in the *existing* Canvas 2D game.
// These are reversible art-only projections. Hitboxes, saves and boss timing
// remain exclusively owned by engine/world, never by PNG outlines.
import {VIEW,visibleWorld} from './world.mjs';
const SIZE={scenery:[160,128],mechanism:[120,106],enemy:[65,64],
 pickup:[42,60],cinnamon:[209,139],fox:[130,130],
 bossFx:[170,160],effect:[125,96],interface:[116,90],birthday:[190,165]};
function place(ctx,image,x,y,w,h,alpha=1){
 ctx.save();ctx.globalAlpha=alpha;
 ctx.imageSmoothingEnabled=false;
 // Fit inside an authored Canvas role without distorting source dimensions.
 const ratio=Math.min(w/image.width,h/image.height);
 const dw=image.width*ratio,dh=image.height*ratio;
 ctx.drawImage(image,x+(w-dw)/2,y+(h-dh)/2,dw,dh);ctx.restore();
}
function label(ctx,text,x,y){
 ctx.font='900 13px system-ui';ctx.lineWidth=3;
 ctx.strokeStyle='#10293a';ctx.strokeText(text,x,y);
 ctx.fillStyle='#fff3bc';ctx.fillText(text,x,y);
}
function framedCandidate(ctx,entry){
 const x=VIEW.width-205,y=VIEW.height-180,w=194,h=166;
 ctx.save();
 ctx.fillStyle='#172d40dd';ctx.fillRect(x,y,w,h);
 ctx.strokeStyle='#f8a69b';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);
 place(ctx,entry.image,x+10,y+8,w-20,h-53);
 label(ctx,'BLOCKED · QA REFERENCE',x+9,y+h-27);
 label(ctx,entry.id+' (NOT GAME ART)',x+9,y+h-10);
 ctx.restore();
}
export function paintArtOverrides(ctx,state,roles,phase){
 if(!roles||!Object.keys(roles).length)return;
 const cam=state.camera,p=state.player;
 const safe=Object.entries(roles).filter(([,entry])=>entry?.image&&!entry.blocked);
 if(phase==='backdrop'){
  const asset=roles.backdrop;
  if(asset&&!asset.blocked)place(ctx,asset.image,0,0,VIEW.width,VIEW.height);
  return;
 }
 if(phase==='world'){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  const visible=visibleWorld(state.level.platforms,cam.x,cam.y);
  if(roles.terrain&&!roles.terrain.blocked){
   const image=roles.terrain.image;
   for(const platform of visible){
    if(platform.h<18)continue;
    // The source texture cannot create a new collidable ledge.
    const x=platform.x,y=platform.y,w=platform.w,h=platform.h;
    ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,Math.min(h-4,44));ctx.clip();
    for(let tx=x+2;tx<x+w;tx+=32)
     ctx.drawImage(image,tx,y+2,32,32);
    ctx.restore();
    ctx.strokeStyle='#ffe3a2';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
   }
  }
  const above=p.y-140;
  const anchorX=p.x+180;
  if(roles.scenery&&!roles.scenery.blocked){
   place(ctx,roles.scenery.image,anchorX,above,170,135,.89);
   label(ctx,'SCENERY TEST · NO COLLIDER',anchorX,above-6);
  }
  if(roles.mechanism&&!roles.mechanism.blocked){
   const b=state.level.beacons.find(x=>Math.abs(x.x-cam.x-450)<450&&
     Math.abs(x.footY-cam.y-250)<430);
   if(b){place(ctx,roles.mechanism.image,b.x-60,b.footY-130,120,127);
    label(ctx,'MECHANISM ART',b.x-53,b.footY-135)}
   else{place(ctx,roles.mechanism.image,p.x-215,above-20,100,110);
    label(ctx,'MECHANISM ART · DEMO',p.x-215,above-24)}
  }
  ctx.restore();return;
 }
 if(phase==='actors'){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  if(roles.pickup&&!roles.pickup.blocked){
   const candidate=state.level.shakes.find(sh=>!sh.taken&&
     sh.x>cam.x&&sh.x<cam.x+VIEW.width&&sh.y>cam.y&&sh.y<cam.y+VIEW.height);
   if(candidate)place(ctx,roles.pickup.image,candidate.x-22,candidate.y-54,44,61);
  }
  if(roles.enemy&&!roles.enemy.blocked){
   const enemy=state.level.enemies.find(e=>e.alive&&e.x>=cam.x&&
    e.x<cam.x+VIEW.width&&e.y>cam.y&&e.y<cam.y+VIEW.height);
   if(enemy)place(ctx,roles.enemy.image,enemy.x-5,enemy.y-15,76,77);
  }
  if(roles.fox&&!roles.fox.blocked&&(state.boss.triggered||cam.x>7100)){
   const boss=state.boss;
   place(ctx,roles.fox.image,boss.x-42,boss.y-46,135,136);
   if(boss.mode==='tell'){
    ctx.strokeStyle='#ff4d46';ctx.lineWidth=6;
    ctx.beginPath();ctx.arc(boss.x+22,boss.y+18,90,0,Math.PI*2);ctx.stroke();
    label(ctx,'! ATTACK INCOMING',boss.x-46,boss.y-63);
   }else if(boss.mode==='rest'){
    label(ctx,'STUNNED · SAFE TO HIT',boss.x-54,boss.y-63);
   }
  }
  ctx.restore();
  if(roles.cinnamon&&!roles.cinnamon.blocked){
   const xx=p.x+p.w/2-cam.x,yy=p.y+p.h-cam.y;
   ctx.save();ctx.translate(xx,yy);if(p.facing<0)ctx.scale(-1,1);
   place(ctx,roles.cinnamon.image,-146,-143,213,145);
   ctx.restore();
  }
  if(!state.settings.reducedMotion){
   if(roles.effect&&!roles.effect.blocked){
    const x=p.x+p.w/2-cam.x,y=p.y+p.h/2-cam.y;
    place(ctx,roles.effect.image,x-61,y-58,122,109,.83);
   }
   if(roles.bossFx&&!roles.bossFx.blocked&&state.boss.triggered){
    const x=state.boss.x-cam.x,y=state.boss.y-cam.y;
    place(ctx,roles.bossFx.image,x-70,y-115,152,152,.77);
   }
  }
  return;
 }
 if(phase==='hud'){
  if(roles.interface&&!roles.interface.blocked){
   ctx.save();ctx.fillStyle='#133349dc';ctx.fillRect(680,12,138,104);
   place(ctx,roles.interface.image,693,17,108,74);
   label(ctx,'UI ART TEST',688,111);
   ctx.restore();
  }
  if(roles.birthday&&!roles.birthday.blocked&&state.mode!=='victory'){
   ctx.save();ctx.fillStyle='#132d45a6';ctx.fillRect(732,326,216,180);
   place(ctx,roles.birthday.image,750,339,186,143,.93);
   label(ctx,'FINALE ART TEST',745,497);ctx.restore();
  }
  // Any of the 24 structurally invalid PNGs can still be viewed in-game
  // without promoting the opaque bitmap into platforms/hazards/characters.
  const blocked=Object.values(roles).find(entry=>entry?.blocked&&entry.image);
  if(blocked)framedCandidate(ctx,blocked);
  return;
 }
 if(phase==='birthday'){
  const candidate=roles.birthday;
  if(candidate&&!candidate.blocked&&state.mode==='victory'){
   place(ctx,candidate.image,640,262,198,175,.94);
   label(ctx,'ART DIRECTOR VARIANT · NOT APPROVED',586,472);
  }
 }
}
