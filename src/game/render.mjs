import {VIEW,WORLD,DOME_ARENA_Y,visibleWorld} from './world.mjs';
import {movingPosition} from './engine.mjs';
const TAU=Math.PI*2;
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(n,a,b)=>Math.min(Math.max(n,a),b);
const stroke=(ctx,color='#3e241f',width=3)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round'};
function rounded(ctx,x,y,w,h,r=8){if(w<=0||h<=0)return;ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function cloud(ctx,x,y,s=1,alpha=.6){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#fff9e4';for(const [a,b,r] of [[0,0,31],[23,-13,39],[59,-4,34],[86,2,27]]){ctx.beginPath();ctx.ellipse(x+a*s,y+b*s,r*s,r*.57*s,0,0,TAU);ctx.fill()}ctx.restore()}
function tree(ctx,x,y,s=1){ctx.fillStyle='#694931';ctx.fillRect(x-8*s,y-80*s,16*s,85*s);
 for(const [dx,dy,r]of [[0,-103,40],[-27,-93,28],[28,-89,33],[4,-134,28]]){
  ctx.fillStyle=dy<-125?'#578d63':dy<-97?'#4a9169':'#417d62';ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);ctx.fill();
  ctx.strokeStyle='#285149';ctx.lineWidth=3;ctx.stroke();}}
function brickWindow(ctx,x,y,w,h,lit=false){
 ctx.fillStyle='#4f4253';rounded(ctx,x,y,w,h,7);ctx.fill();stroke(ctx,'#55424d',3);ctx.stroke();
 ctx.fillStyle=lit?'#f1cf85':'#6b96a2';rounded(ctx,x+5,y+5,w-10,h-10,4);ctx.fill();
 ctx.fillStyle=lit?'#ffd991':'#b2cdd1';ctx.fillRect(x+w/2-2,y+6,4,h-12);ctx.fillRect(x+5,y+h/2,w-10,3);
 ctx.fillStyle='#f1d5ab';ctx.fillRect(x-6,y+h-3,w+12,7);
}
function sky(ctx,t,domeBlend){
 const grad=ctx.createLinearGradient(0,0,0,VIEW.height);grad.addColorStop(0,domeBlend?'#6c8cae':'#7ab9d8');grad.addColorStop(.58,domeBlend?'#dfc49c':'#c0dce0');grad.addColorStop(1,'#fff0ca');ctx.fillStyle=grad;ctx.fillRect(0,0,VIEW.width,VIEW.height);
 ctx.save();ctx.globalAlpha=.5;ctx.fillStyle='#fff3bb';ctx.beginPath();ctx.arc(domeBlend?760:820,100,52,0,TAU);ctx.fill();ctx.restore();
 for(let i=0;i<7;i++) {const cx=((i*274+t*4)%(VIEW.width+350))-140;cloud(ctx,cx,85+(i%3)*65,.6+i%2*.26,.25+(i%2)*.13)}
}
function farCampus(ctx,cam,t){
 const px=cam.x*.16;ctx.save();ctx.translate(-px,0);const left=Math.floor(px/460)*460-460;
 for(let x=left;x<px+VIEW.width+460;x+=460){
  const seed=Math.round(x/460),w=390,h=150+(Math.abs(seed*5)%3)*28;
  ctx.fillStyle='#aeb9b3';ctx.fillRect(x,340-h,w,h+250);ctx.fillStyle='#8a9b97';ctx.fillRect(x,340-h,w,14);
  ctx.fillStyle='#839c9d';for(let i=0;i<7;i++)for(let j=0;j<3;j++){ctx.fillRect(x+24+i*53,355-h+j*38,26,18)}
  tree(ctx,x+350,390,.66);
 }
 ctx.restore();
}
function quad(ctx,cam,t){
 const cx=cam.x,cy=cam.y;ctx.save();ctx.translate(-cx,-cy);
 ctx.fillStyle='#c8d0af';ctx.fillRect(Math.max(0,cx-80),330,Math.min(3850,cx+1100)-Math.max(0,cx-80),130);
 for(let i=0;i<22;i++){const x=i*182+90;if(x<cx-130||x>cx+1100||x>3770)continue;
  if(i%4===0){tree(ctx,x,425,1.03);continue}
  if(i%4===1){ctx.fillStyle='#506b64';ctx.fillRect(x,362,6,70);ctx.fillStyle='#efe0ae';ctx.beginPath();ctx.arc(x+3,350,11,0,TAU);ctx.fill()}
  if(i%4===2){ctx.fillStyle='#806f5d';ctx.fillRect(x,421,92,11);ctx.fillRect(x+9,431,7,11);ctx.fillRect(x+75,431,7,11);}
  if(i%4===3){ctx.fillStyle='#ceb47a';ctx.fillRect(x,414,44,24);ctx.fillStyle='#4e9167';ctx.beginPath();ctx.ellipse(x+22,410,28,11,0,0,TAU);ctx.fill()}
 }
 // Landmark hints: campus masonry and blue/gold bunting, secondary to gameplay.
 for(let x=520;x<3740;x+=780){
  if(x+600<cx||x>cx+1300)continue;
  ctx.fillStyle='#dac6ad';ctx.fillRect(x,205,505,165);ctx.fillStyle='#bd9c85';ctx.fillRect(x,192,505,14);
  for(let i=0;i<7;i++)brickWindow(ctx,x+22+i*68,237,34,61,i%4===0);
  ctx.fillStyle='#244d8c';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(x+26+i*80,184);ctx.lineTo(x+51+i*80,184);ctx.lineTo(x+38+i*80,217);ctx.closePath();ctx.fill()}
 }
 // First scene vendor - simple but unmistakable stolen drink tableau.
 if(cx<900){const x=122,y=442;ctx.fillStyle='#d4a47b';ctx.fillRect(x-40,y-109,177,99);
 ctx.fillStyle='#2a518a';ctx.fillRect(x-50,y-130,196,27);ctx.fillStyle='#f4cc55';for(let i=0;i<7;i++)ctx.fillRect(x-50+i*28,y-130,13,27);
 ctx.fillStyle='#ffedbe';ctx.font='bold 15px system-ui';ctx.fillText('THE LAST SHAKE',x-30,y-112);
 ctx.fillStyle='#8b5e4b';ctx.fillRect(x-54,y-14,202,14);
 drawShake(ctx,x+106,y-68,.85,true);
 }
 ctx.restore();
}
function mainBuilding(ctx,cam,t){
 const cx=cam.x,cy=cam.y;
 if(cx>8350||cx+VIEW.width<3340)return;
 ctx.save();ctx.translate(-cx,-cy);
 // Tower runs behind the entire authored ascent; richly drawn but no painted collision.
 const left=3700,right=8210,top=-1530,bottom=470;
 ctx.fillStyle='#c7aa8c';ctx.fillRect(left,top,right-left,bottom-top);
 ctx.fillStyle='#ab886e';ctx.fillRect(left,top,46,bottom-top);ctx.fillRect(right-46,top,46,bottom-top);
 ctx.fillStyle='#ead4b2';
 for(let y=-1510;y<bottom;y+=156){ctx.fillRect(left,y,right-left,10);
  for(let x=left+65;x<right;x+=172){const lit=((x+y+2800)%5)>3;brickWindow(ctx,x,y+24,83,94,lit)}
 }
 for(let x=left+40;x<right;x+=347){ctx.fillStyle='#e6cda7';ctx.fillRect(x,top,22,bottom-top);
  ctx.fillStyle='#9a745f';ctx.fillRect(x+22,top,6,bottom-top)}
 ctx.fillStyle='#99745e';ctx.fillRect(left,top+12,right-left,31);
 // Main Building's golden dome and its crowning statue, hero silhouette at summit.
 const domeX=7380,base=-1125;
 ctx.fillStyle='#a98a52';ctx.fillRect(domeX-290,base-20,580,51);
 ctx.fillStyle='#ecc86b';ctx.beginPath();ctx.moveTo(domeX-255,base);ctx.bezierCurveTo(domeX-250,base-245,domeX+245,base-245,domeX+255,base);ctx.closePath();ctx.fill();
 stroke(ctx,'#986f3e',9);ctx.stroke();ctx.fillStyle='#fff0a5';ctx.beginPath();ctx.moveTo(domeX-170,base-22);ctx.bezierCurveTo(domeX-110,base-220,domeX+10,base-218,domeX+50,base-208);ctx.lineTo(domeX+10,base-208);ctx.bezierCurveTo(domeX-78,base-211,domeX-138,base-70,domeX-140,base-22);ctx.fill();
 ctx.fillStyle='#c29a55';ctx.fillRect(domeX-77,base-225,154,35);ctx.fillStyle='#9b784a';ctx.fillRect(domeX-50,base-245,100,25);
 // Statue: stylized gold standing figure, recognizably atop dome, not a playable actor.
 ctx.fillStyle='#f4d47d';ctx.beginPath();ctx.arc(domeX,base-295,15,0,TAU);ctx.fill();
 ctx.fillRect(domeX-13,base-281,26,65);ctx.beginPath();ctx.moveTo(domeX-13,base-264);ctx.lineTo(domeX-61,base-235);ctx.lineTo(domeX-59,base-221);ctx.lineTo(domeX,base-251);ctx.lineTo(domeX+53,base-221);ctx.lineTo(domeX+63,base-236);ctx.lineTo(domeX+14,base-267);ctx.fill();
 ctx.fillRect(domeX-18,base-218,13,29);ctx.fillRect(domeX+5,base-218,13,29);
 // Decorative heraldic flags and ropes along ascent.
 for(let x=3860;x<7440;x+=330){const y=390-((x-3760)/156)*68-60;if(x<cx-300||x>cx+1300||y<cy-250||y>cy+700)continue;
  ctx.fillStyle='#365c9a';ctx.fillRect(x,y-36,80,41);ctx.fillStyle='#f7cf61';ctx.fillRect(x+8,y-26,64,5);
  ctx.strokeStyle='#745c4e';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-39);ctx.lineTo(x,y+6);ctx.stroke();
 }
 ctx.restore();
}
function drawPlatform(ctx,p,x,y,active,t){
 const k=p.kind;const h=p.h,w=p.w;
 if(k==='banner'){
  ctx.save();ctx.globalAlpha=active?1:.34;
  ctx.fillStyle=active?'#214b9a':'#677d96';rounded(ctx,x,y,w,h,4);ctx.fill();
  ctx.fillStyle='#f7cd5b';ctx.fillRect(x,y,w,5);ctx.fillRect(x,y+h-5,w,5);
  stroke(ctx,'#172d50',3);ctx.stroke();
  for(let i=18;i<w;i+=31){ctx.fillStyle='#f7db82';ctx.fillRect(x+i,y+9,10,4)}ctx.restore();return;
 }
 ctx.fillStyle=k==='grass'?'#745638':k==='gold'?'#ae8544':k==='wood'?'#875f53':'#8e7f78';
 rounded(ctx,x,y,w,h,3);ctx.fill();stroke(ctx,k==='gold'?'#69512b':'#463737',3);ctx.stroke();
 ctx.fillStyle=k==='grass'?'#65a167':k==='gold'?'#f3cf70':k==='wood'?'#dfb17b':'#efcfad';
 ctx.fillRect(x+2,y+1,w-4,7);
 ctx.globalAlpha=.36;ctx.fillStyle='#372822';for(let i=22;i<w-6;i+=40)ctx.fillRect(x+i,y+12,3,Math.min(h-13,20));ctx.globalAlpha=1;
 if(p.movement){ctx.strokeStyle='#f8d26f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+8,y-9);ctx.lineTo(x+w-8,y-9);ctx.stroke()}
}
function drawShake(ctx,x,y,s=1,big=false){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.shadowColor='#9afb8c';ctx.shadowBlur=big?20:12;
 ctx.fillStyle='#2c795b';ctx.beginPath();ctx.moveTo(-11,-19);ctx.lineTo(11,-19);ctx.lineTo(9,14);ctx.quadraticCurveTo(0,21,-9,14);ctx.closePath();ctx.fill();
 ctx.fillStyle='#9af0a3';ctx.beginPath();ctx.moveTo(-7,-15);ctx.lineTo(7,-15);ctx.lineTo(5,10);ctx.lineTo(-5,10);ctx.closePath();ctx.fill();
 ctx.fillStyle='#effde7';ctx.beginPath();ctx.ellipse(0,-18,15,5,0,0,TAU);ctx.fill();
 ctx.fillStyle='#e8fff4';ctx.fillRect(3,-33,3,16);ctx.fillStyle='#f7fff7';ctx.beginPath();ctx.arc(0,-24,7,Math.PI,TAU);ctx.fill();
 ctx.shadowBlur=0;ctx.restore()}
function drawFox(ctx,x,y,phase,t){ctx.save();ctx.translate(x,y);
 if(phase==='charge')ctx.translate(Math.sin(t*47)*3,0);
 if(phase==='hit'){ctx.globalAlpha=.68;ctx.translate(Math.sin(t*65)*5,0)}
 // Explicitly provisional vector portrait; not a silently accepted final Fox reference.
 ctx.fillStyle='#612f35';rounded(ctx,-21,-21,54,36,10);ctx.fill();
 ctx.fillStyle='#c25e35';ctx.beginPath();ctx.ellipse(14,-48,48,37,0,0,TAU);ctx.fill();
 ctx.fillStyle='#dc753f';ctx.beginPath();ctx.ellipse(16,-37,51,32,0,0,TAU);ctx.fill();
 ctx.fillStyle='#d56736';ctx.beginPath();ctx.moveTo(-21,-61);ctx.lineTo(-25,-111);ctx.lineTo(0,-75);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(24,-75);ctx.lineTo(44,-110);ctx.lineTo(47,-64);ctx.closePath();ctx.fill();
 ctx.fillStyle='#f5d8a9';ctx.beginPath();ctx.moveTo(23,-34);ctx.lineTo(78,-22);ctx.lineTo(25,-9);ctx.closePath();ctx.fill();
 ctx.fillStyle='#28212b';ctx.beginPath();ctx.arc(74,-22,5,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(37,-57,7,9,0,0,TAU);ctx.fill();
 ctx.strokeStyle='#2c2022';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(25,-71);ctx.lineTo(49,-67);ctx.stroke();
 ctx.fillStyle='#513d68';ctx.fillRect(-8,-18,44,17);
 ctx.fillStyle='#cc713d';ctx.beginPath();ctx.moveTo(-12,-8);ctx.bezierCurveTo(-95,-53,-115,36,-67,39);ctx.bezierCurveTo(-10,35,-35,3,-12,-8);ctx.fill();
 ctx.fillStyle='#fff4cf';ctx.beginPath();ctx.moveTo(-65,37);ctx.quadraticCurveTo(-101,30,-92,15);ctx.quadraticCurveTo(-82,7,-65,37);ctx.fill();
 ctx.fillStyle='#3c2835';rounded(ctx,-13,14,18,22,2);ctx.fill();rounded(ctx,24,14,18,22,2);ctx.fill();
 if(phase==='tell'){stroke(ctx,'#ea4d43',6);ctx.beginPath();ctx.arc(25,-45,85,0,TAU);ctx.stroke();
  ctx.fillStyle='#fff0bb';ctx.font='900 35px system-ui';ctx.fillText('!',4,-134)}
 if(phase==='rest'){ctx.fillStyle='#f5e57a';ctx.font='900 16px system-ui';ctx.fillText('STUNNED',-22,-122)}
 ctx.restore();}
function confetti(ctx,x,y,r=0){ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.fillStyle='#ef6371';ctx.fillRect(-8,-6,16,8);ctx.fillStyle='#ffdc64';ctx.fillRect(-2,-12,8,6);ctx.restore()}
function cupCrawler(ctx,e,t){ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#573d41';rounded(ctx,-2,19,51,26,8);ctx.fill();
 ctx.fillStyle='#ceb789';for(let i=0;i<3;i++){rounded(ctx,8+i*3,7-i*11,27,17,4);ctx.fill();stroke(ctx,'#57464b',2);ctx.stroke()}
 ctx.fillStyle='#ee5c61';ctx.beginPath();ctx.arc(36,28,6,0,TAU);ctx.fill();
 ctx.fillStyle='#333742';for(const xx of [7,43]){ctx.beginPath();ctx.arc(xx,47,8,0,TAU);ctx.fill()}
 ctx.restore()}
function cannon(ctx,h,t){ctx.save();ctx.translate(h.x,h.y);ctx.fillStyle='#5e6385';rounded(ctx,-2,12,55,29,5);ctx.fill();
 ctx.fillStyle='#44516a';rounded(ctx,3,-3,39,18,5);ctx.fill();
 ctx.fillStyle='#fa7390';ctx.beginPath();ctx.arc(43,28,5,0,TAU);ctx.fill();
 const phase=(t+h.offset)%h.period;if(phase>h.period-.8){ctx.fillStyle='#fcdb73';ctx.font='900 19px system-ui';ctx.fillText('!',23,-16)}ctx.restore()}
function beacon(ctx,b,active,t){const x=b.x,y=b.footY;ctx.save();ctx.translate(x,y);
 ctx.fillStyle='#553e3f';ctx.fillRect(-11,-58,25,55);ctx.fillStyle='#e6bc62';ctx.beginPath();ctx.ellipse(1,-60,29,14,0,0,TAU);ctx.fill();
 ctx.fillStyle=active?'#75ecd0':'#315481';ctx.beginPath();ctx.ellipse(1,-60,23,9,0,0,TAU);ctx.fill();
 if(active){ctx.strokeStyle='#d7fff2';ctx.lineWidth=3;ctx.beginPath();ctx.arc(1,-59,35+Math.sin(t*8)*9,0,TAU);ctx.stroke()}
 ctx.restore()}
function checkpoint(ctx,c,on,t){ctx.save();ctx.translate(c.x,c.footY);ctx.fillStyle='#e5cc9f';ctx.fillRect(-4,-79,9,79);
 ctx.fillStyle=on?'#ffe171':'#305b98';ctx.beginPath();ctx.moveTo(3,-78);ctx.lineTo(49,-62);ctx.lineTo(3,-44);ctx.closePath();ctx.fill();
 if(on){ctx.fillStyle='#f2ffa5';ctx.beginPath();ctx.arc(2,-80,5+Math.sin(t*6)*2,0,TAU);ctx.fill()}
 ctx.restore()}
function decoration(ctx,s,t){const cam=s.camera;ctx.save();ctx.translate(-cam.x,-cam.y);
 for(const e of s.level.enemies){if(e.alive&&Math.abs(e.x-cam.x)<1100&&Math.abs(e.y-cam.y)<720)cupCrawler(ctx,e,t)}
 for(const h of s.level.hazards){if(Math.abs(h.x-cam.x)<1100&&Math.abs(h.y-cam.y)<700)cannon(ctx,h,t)}
 for(const b of s.level.beacons){if(Math.abs(b.x-cam.x)<1000&&Math.abs(b.footY-cam.y)<700)beacon(ctx,b,s.activePulse,t)}
 for(const c of s.level.checkpoints){if(Math.abs(c.x-cam.x)<1100&&Math.abs(c.footY-cam.y)<700)checkpoint(ctx,c,s.checkpoint>=s.level.checkpoints.indexOf(c),t)}
 for(const q of s.level.shakes){if(q.taken||Math.abs(q.x-cam.x)>1030||Math.abs(q.y-cam.y)>650)continue;
  drawShake(ctx,q.x,q.y+Math.sin(t*4+q.x)*3,q.special?1.16:.9,q.special);
  if(q.special){ctx.strokeStyle='#edc86b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(q.x,q.y,23+Math.sin(t*3)*2,0,TAU);ctx.stroke()}
 }
 for(const b of s.projectiles){confetti(ctx,b.x,b.y,b.age*10);ctx.strokeStyle='#ea7074';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,10,0,TAU);ctx.stroke()}
 if(s.boss.triggered||cam.x>7100){drawFox(ctx,s.boss.x,s.boss.y+83,s.boss.mode,t)}
 ctx.restore()}
function player(ctx,s,sprites){const p=s.player;let state='idle';
 if(s.mode==='victory')state='victory';else if(p.invulnerable>0&&s.lastDamage)state='hurt';
 else if(p.attackTime>0)state='swish';else if(p.dashTime>0)state='dash';
 else if(!p.grounded)state=p.vy<0?'jump':'fall';else if(Math.abs(p.vx)>30)state='run';
 const counts={idle:6,run:6,jump:2,fall:1,land:1,swish:2,dash:2,hurt:2,victory:3};
 let index=0;if(state==='run')index=Math.floor(s.elapsed*13)%6;
 else if(state==='idle')index=Math.floor(s.elapsed*2.3)%6;
 else if(state==='victory')index=Math.floor(s.elapsed*4)%3;
 else if(counts[state]>1)index=Math.floor(s.elapsed*10)%counts[state];
 const key=`${state}_${String(index).padStart(2,'0')}`;
 const image=sprites[key]||sprites.idle_00;
 ctx.save();ctx.translate(Math.round(p.x+p.w/2-s.camera.x),Math.round(p.y+p.h-s.camera.y));
 if(p.facing<0)ctx.scale(-1,1);
 if(p.invulnerable>0&&Math.floor(s.elapsed*13)%2===0)ctx.globalAlpha=.5;
 const scale=.87;
 if(image){ctx.drawImage(image,-145*scale,-147*scale,240*scale,160*scale)}
 else {ctx.fillStyle='#f08337';ctx.beginPath();ctx.arc(0,-39,25,0,TAU);ctx.fill();ctx.fillStyle='#253d7b';ctx.fillRect(-25,-55,50,9)}
 if(p.attackTime>0&&!image){stroke(ctx,'#f7e5a7',7);ctx.beginPath();ctx.arc(16,-40,70,-.7,1.1);ctx.stroke()}
 ctx.restore();
}
function events(ctx,s,t){ctx.save();ctx.translate(-s.camera.x,-s.camera.y);
 for(const e of s.events){const age=t-e.t;if(age<0||age>1.15)continue;
  const alpha=1-age/1.15;ctx.globalAlpha=alpha;
  const n=e.type==='collect'?9:e.type==='bossHit'?17:4;
  if(!['collect','checkpoint','bossHit','swish','jump','doubleJump','hurt','victory','beacon'].includes(e.type))continue;
  const colors=e.type==='bossHit'?['#e7d767','#ffecc0','#f07b72']:e.type==='hurt'?['#f06672','#fbbb7f']:['#f7dd7d','#8aeeae','#f5fbec'];
  for(let i=0;i<n;i++){const a=i*TAU/n+t%2,r=(e.type==='checkpoint'?90:52)*Math.min(1,age*2);const x=e.x+Math.cos(a)*r;const y=e.y+Math.sin(a)*r-age*29;
   ctx.fillStyle=colors[i%colors.length];ctx.fillRect(x,y,4+i%2*2,4+i%2*2)}
 }ctx.restore();ctx.globalAlpha=1;
}
function confettiSky(ctx,t){for(let i=0;i<45;i++){const x=(i*83+Math.sin(i*67)*32)%990;const y=((t*85+i*49)%690)-85;
 ctx.save();ctx.translate(x,y);ctx.rotate(t+i);ctx.fillStyle=['#ffdf6e','#80e9bb','#f06f78','#7ea8e8'][i%4];ctx.fillRect(0,0,8,12);ctx.restore()}}
function birthdayDecor(ctx,t){
 ctx.save();ctx.translate(735,330);ctx.shadowColor='#f7d15b';ctx.shadowBlur=25;
 // A deliberately visible birthday cake, not a quest objective.
 ctx.fillStyle='#f8a4bb';rounded(ctx,-156,-17,305,95,18);ctx.fill();ctx.fillStyle='#fff5e1';rounded(ctx,-156,-24,305,29,9);ctx.fill();
 ctx.fillStyle='#f1c26c';rounded(ctx,-122,-85,237,70,17);ctx.fill();ctx.fillStyle='#fff9e9';rounded(ctx,-122,-87,237,24,10);ctx.fill();
 for(let i=0;i<8;i++){const x=-100+i*27;ctx.fillStyle='#3573a0';ctx.fillRect(x,-117,7,32);ctx.fillStyle='#fbe56e';ctx.beginPath();ctx.ellipse(x+3,-124,5,9,0,0,TAU);ctx.fill()}
 ctx.shadowBlur=0;ctx.restore();
 for(const x of [550,860])drawShake(ctx,x,420,2.0,true);
 confettiSky(ctx,t);
}
export function render(ctx,s,sprites,alpha=0){
 const t=s.elapsed,cam=s.camera;
 ctx.clearRect(0,0,VIEW.width,VIEW.height);
 const isDome=cam.x>3150;sky(ctx,t,isDome);farCampus(ctx,cam,t);quad(ctx,cam,t);mainBuilding(ctx,cam,t);
 ctx.save();ctx.translate(-cam.x,-cam.y);
 for(const p of visibleWorld(s.level.platforms,cam.x,cam.y)){
  const pos=movingPosition(p,t),active=!p.pulse||s.activePulse||s.player.onPlatform===p.id;
  drawPlatform(ctx,p,pos.x,pos.y,active,t);
 }
 ctx.restore();
 decoration(ctx,s,t);
 // Readable non-colliding intro glimpse: the Fox runs away with the actual independent cup.
 if(s.elapsed<2.4 && cam.x<1050 && s.mode==='playing'){
  ctx.save();ctx.translate(-cam.x,-cam.y);const fx=490+s.elapsed*160;
  drawFox(ctx,fx,440,'escape',t);drawShake(ctx,fx+84,375,.78,true);
  ctx.restore();
 }
 player(ctx,s,sprites);events(ctx,s,t);
 const inPulse=s.activePulse;ctx.save();ctx.textAlign='center';ctx.font='900 31px system-ui';
 if(s.mode==='playing'&&!s.boss.triggered){
  ctx.globalAlpha=.90;ctx.fillStyle=inPulse?'#fff0ac':'#a9d7f6';ctx.shadowColor='#2b4d78';ctx.shadowBlur=10;
  ctx.fillText(inPulse?'GO! IRISH!':'LISTEN FOR THE CHANT',VIEW.width/2,116);ctx.shadowBlur=0;
  if(s.pulseFlash>0){ctx.globalAlpha=s.pulseFlash*.18;ctx.fillStyle='#f6da8b';ctx.fillRect(0,0,VIEW.width,VIEW.height)}
  if(s.checkpointNotice>0){ctx.globalAlpha=Math.min(1,s.checkpointNotice);ctx.fillStyle='#fff1c7';ctx.font='800 24px system-ui';ctx.fillText(s.level.checkpoints[s.checkpoint].id.toUpperCase()+' CHECKPOINT',VIEW.width/2,159)}
 }
 if(s.boss.triggered&&s.boss.hp>0){ctx.textAlign='left';ctx.font='900 18px system-ui';ctx.fillStyle='#fff5dc';ctx.fillText('THE FOX',343,90);
  ctx.fillStyle='#352a37';rounded(ctx,434,73,210,23,7);ctx.fill();ctx.fillStyle='#f27e57';rounded(ctx,438,76,202*s.boss.hp/3,17,5);ctx.fill();}
 if(s.mode==='victory'){ctx.fillStyle='rgba(13,24,35,.66)';ctx.fillRect(0,0,VIEW.width,VIEW.height);
  birthdayDecor(ctx,t);ctx.fillStyle='#fff6d2';ctx.font='900 55px system-ui';ctx.fillText('HAPPY BIRTHDAY,',480,155);ctx.fillStyle='#fbd57b';ctx.font='900 63px system-ui';ctx.fillText('MAVERICK!',480,215);}
 ctx.restore();
}
