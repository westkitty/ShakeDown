// World-space, non-colliding authored encounter scenery. Character assets are
// always sourced from manifests; no canvas-drawn replacement animals.
const TAU=Math.PI*2;
const room={x:1320,y:490,w:670,h:245};
function round(ctx,x,y,w,h,r=10){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);
}
function text(ctx,str,x,y,font='900 16px system-ui',color='#fff3c9'){
 ctx.font=font;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(str,x,y);
}
function nearby(s,x,y,w,h){
 const cam=s.camera;return x+w>cam.x-120&&x<cam.x+960+120&&
   y+h>cam.y-130&&y<cam.y+540+130;
}
function bunting(ctx,x,y,spacing,n){
 for(let i=0;i<n;i++){
  const a=x+i*spacing;
  ctx.fillStyle=i%2?'#e9be62':'#315d95';
  ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(a+32,y);
  ctx.lineTo(a+16,y+30);ctx.closePath();ctx.fill();
 }
}
export function paintSecretScenery(ctx,s,t){
 const cam=s.camera;
 if(nearby(s,room.x,room.y,room.w,room.h)){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  // Collegiate Gothic undercroft: arched openings, warm masonry and lamps.
  ctx.fillStyle='#15263b';ctx.fillRect(room.x,room.y,room.w,room.h);
  for(let i=0;i<5;i++){
   const x=room.x+26+i*136;
   ctx.fillStyle='#997b70';ctx.fillRect(x,room.y+32,114,room.h-32);
   ctx.fillStyle='#273c53';round(ctx,x+12,room.y+92,90,room.h-106,46);ctx.fill();
   ctx.fillStyle='#e2bf85';ctx.fillRect(x,room.y+42,116,12);
   ctx.strokeStyle='#d9b88b';ctx.lineWidth=6;ctx.strokeRect(x,room.y+95,116,room.h-130);
  }
  ctx.fillStyle='rgba(17,25,47,.46)';ctx.fillRect(room.x,room.y+255,room.w,70);
  ctx.fillStyle='#e8bb68';bunting(ctx,room.x+18,room.y+12,57,11);
  for(let i=0;i<6;i++){
   const x=room.x+44+i*114,y=room.y+110;
   const shine=s.settings.reducedMotion?0:Math.sin(t*2+i)*5;
   ctx.fillStyle='rgba(255,199,94,.14)';ctx.beginPath();ctx.arc(x,y,34+shine,0,TAU);ctx.fill();
   ctx.fillStyle='#ffdf9c';ctx.fillRect(x-5,y-14,10,25);
  }
  // An in-world, unmistakable wooden direction marker.
  ctx.fillStyle='#5a3628';ctx.fillRect(1245,600,16,106);
  ctx.fillStyle='#d6ad72';round(ctx,1173,558,176,48,8);ctx.fill();
  ctx.strokeStyle='#3b2a31';ctx.lineWidth=4;ctx.stroke();
  text(ctx,'MEET SMUDGE  →',1260,588,'900 17px system-ui','#203854');
  ctx.restore();
 }
 if(nearby(s,4750,-2450,500,315)){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  // The solitary crest has no cheering crowd. Just stars and indignation.
  const sky=ctx.createLinearGradient(0,-2450,0,-2140);
  sky.addColorStop(0,'#0d1a36');sky.addColorStop(1,'#263f61');
  const night=ctx.createLinearGradient(4650,-2300,5230,-2300);
  night.addColorStop(0,'rgba(13,26,54,0)');
  night.addColorStop(.15,'rgba(13,26,54,.93)');
  night.addColorStop(.86,'rgba(13,26,54,.93)');
  night.addColorStop(1,'rgba(13,26,54,0)');
  ctx.fillStyle=night;ctx.fillRect(4650,-2480,580,335);
  for(let i=0;i<38;i++){
   const x=4720+(i*173)%470,y=-2430+(i*97)%220;
   ctx.fillStyle=i%5===0?'#e8ce91':'#a2bcda';
   ctx.fillRect(x,y,i%7===0?3:1,i%7===0?3:1);
  }
  ctx.fillStyle='#b69b8b';ctx.fillRect(4740,-2194,345,15);
  ctx.fillStyle='#e5bb73';ctx.fillRect(4770,-2194,281,5);
  ctx.restore();
 }
}
function drawCrowd(ctx,t,reduce){
 const labels=['WE LOVE SMUDGE','SMUDGE #1','SMORES CAT'];
 const people=[1375,1433,1504,1575,1730,1815,1885,1940];
 for(let i=0;i<people.length;i++){
  const x=people[i],y=674+(reduce?0:Math.sin(t*3.3+i)*4);
  ctx.fillStyle=i%3===0?'#efc76f':i%3===1?'#2d6392':'#745393';
  round(ctx,x-18,y-57,36,58,12);ctx.fill();
  ctx.fillStyle=['#e2bf9c','#b98e72','#d2a47b'][i%3];
  ctx.beginPath();ctx.arc(x,y-69,17,0,TAU);ctx.fill();
  ctx.fillStyle='#f0d6bb';
  ctx.beginPath();ctx.moveTo(x-15,y-84);ctx.lineTo(x-20,y-103);
  ctx.lineTo(x-2,y-87);ctx.moveTo(x+15,y-84);
  ctx.lineTo(x+20,y-103);ctx.lineTo(x+2,y-87);ctx.fill();
  if(i%3===0){
   ctx.fillStyle='#f8edd8';round(ctx,x-55,y-151,110,34,4);ctx.fill();
   text(ctx,labels[Math.floor(i/3)%3],x,y-130,'900 12px system-ui','#254870');
  }
  if(!reduce&&i%4===1&&Math.sin(t*2.7+i)>0.92){
   ctx.fillStyle='#fffdf0';ctx.globalAlpha=.8;
   ctx.fillRect(x-11,y-85,22,12);ctx.globalAlpha=1;
  }
 }
}
function paintSmudge(ctx,s,t,art){
 const npc=s.level.secretNpcs.find(n=>n.id==='smudge');if(!npc)return;
 const reduce=s.settings.reducedMotion;
 drawCrowd(ctx,t,reduce);
 // Elevated velvet plinth, behind the foreground player.
 ctx.fillStyle='#4f253c';round(ctx,npc.x-123,680,246,31,11);ctx.fill();
 ctx.fillStyle='#bc7c9f';round(ctx,npc.x-117,676,234,13,7);ctx.fill();
 ctx.fillStyle='#f1cf75';ctx.fillRect(npc.x-125,705,250,8);
 const image=art['NPC-smudge-idle_'+String(reduce?0:Math.floor(t*4)%4).padStart(2,'0')];
 if(image){
  ctx.imageSmoothingEnabled=true;
  ctx.drawImage(image,npc.x-140,npc.footY-181,280,200);
  // Non-destructive sunglasses: the original blue eyes remain in the asset.
  ctx.fillStyle='rgba(18,26,40,.84)';ctx.strokeStyle='#dfbf71';ctx.lineWidth=3;
  round(ctx,npc.x-43,npc.footY-104,39,22,5);ctx.fill();ctx.stroke();
  round(ctx,npc.x+4,npc.footY-104,39,22,5);ctx.fill();ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.36)';
  ctx.fillRect(npc.x-34,npc.footY-100,12,3);
  ctx.fillRect(npc.x+13,npc.footY-100,12,3);
 }
}
function paintDexter(ctx,s,t,art){
 const npc=s.level.secretNpcs.find(n=>n.id==='dexter');if(!npc)return;
 const frame=String(s.settings.reducedMotion?0:Math.floor(t*2)%4).padStart(2,'0');
 const image=art['NPC-dexter-idle_'+frame];
 if(image)ctx.drawImage(image,npc.x-140,npc.footY-174,280,200);
}
export function paintSecretActors(ctx,s,t,art){
 const cam=s.camera;
 ctx.save();ctx.translate(-cam.x,-cam.y);
 if(nearby(s,1290,390,760,350))paintSmudge(ctx,s,t,art);
 if(nearby(s,4730,-2430,420,255))paintDexter(ctx,s,t,art);
 ctx.restore();
}
function bubble(ctx,x,y,w,message){
 ctx.fillStyle='rgba(18,32,52,.94)';ctx.strokeStyle='#f0cd79';ctx.lineWidth=3;
 round(ctx,x-w/2,y,w,56,12);ctx.fill();ctx.stroke();
 text(ctx,message,x,y+34,'800 15px system-ui','#fff5df');
}
export function paintSecretDialogue(ctx,s,t){
 const p=s.player,cx=p.x+p.w/2,cy=p.y+p.h;
 ctx.save();ctx.translate(-s.camera.x,-s.camera.y);
 const smudge=s.level.secretNpcs.find(n=>n.id==='smudge');
 if(smudge&&nearby(s,1300,440,650,220)){
  const phrases=['Oh my God, it\'s Smudge.','I\'ve always wanted to see Smudge.','It\'s the legendary Smores cat.'];
  const phrase=phrases[Math.floor(t/3.5)%phrases.length];
  bubble(ctx,1660,442+(s.settings.reducedMotion?0:Math.sin(t*1.4)*3),340,phrase);
 }
 const dexter=s.level.secretNpcs.find(n=>n.id==='dexter');
 if(dexter&&Math.hypot(cx-dexter.x,cy-dexter.footY)<=dexter.radius)
  bubble(ctx,dexter.x,dexter.footY-230,425,dexter.dialogue);
 ctx.restore();
}
