import {buildLevel,WORLD,DOME_ARENA_Y,pulseActive,VIEW} from './world.mjs';
export const DT=1/60;
const GRAVITY=1470, SPEED=284, JUMP=-560, DOUBLE=-510, DASH_SPEED=596;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const movingPosition=(p,t)=>({x:p.x+(p.movement==='horizontal'?Math.sin(t*Math.PI*2/p.period)*p.amplitude:0),
 y:p.y+(p.movement==='vertical'?Math.sin(t*Math.PI*2/p.period)*p.amplitude:0)});

export function newGame(settings={}){
 const level=buildLevel();const p={x:70,y:382,prevX:70,prevY:382,w:38,h:60,vx:0,vy:0,facing:1,
 grounded:false,onPlatform:null,jumpsUsed:0,coyote:0,buffer:0,invulnerable:0,hp:3,maxHp:3,
 dashTime:0,dashCooldown:0,attackTime:0,attackCooldown:0,landTime:0};
 return {mode:'title',time:0,elapsed:0,player:p,level,shakeCount:0,secretCount:0,events:[],
 pulseOverride:0,activePulse:true,pulseFlash:0,camera:{x:0,y:0},checkpoint:0,
 projectiles:[],boss:{triggered:false,x:7960,y:DOME_ARENA_Y-84,w:82,h:84,hp:3,maxHp:3,mode:'sleep',attack:'charge',timer:0,cycles:0,hurtTime:0},
 settings:{assist:!!settings.assist,reducedMotion:!!settings.reducedMotion,contrast:!!settings.contrast,mute:!!settings.mute},
 status:'Chase the Fox!',lastDamage:'',lastEvent:'',checkpointNotice:0,shakePickup:0,birthdayReady:false};
}
export function startGame(s){if(s.mode==='title'||s.mode==='dead'||s.mode==='pause')s.mode='playing';}
export function pauseGame(s){if(s.mode==='playing')s.mode='pause';else if(s.mode==='pause')s.mode='playing';}
export function resetToCheckpoint(s){
 const cp=s.level.checkpoints[s.checkpoint];const p=s.player;
 p.x=cp.x+8;p.y=cp.footY-p.h;p.prevX=p.x;p.prevY=p.y;p.vx=0;p.vy=0;p.invulnerable=1.75;
 p.hp=p.maxHp;p.dashTime=0;p.attackTime=0;p.dashCooldown=0;p.attackCooldown=0;p.jumpsUsed=0;p.grounded=false;p.onPlatform=null;
 s.mode='playing';s.projectiles=[];s.boss.mode=s.boss.triggered?'tell':'sleep';s.boss.timer=1;
 s.lastDamage=''; s.status='Back on your paws.';
}
const say=(s,type,detail='')=>{s.events.push({type,detail,t:s.elapsed,x:s.player.x+s.player.w/2,y:s.player.y+s.player.h/2});s.lastEvent=type; if(s.events.length>35)s.events.shift()};
function damage(s,reason,sourceX){const p=s.player;if(p.invulnerable>0||s.mode!=='playing')return;
 const amount=s.settings.assist?0.5:1;p.hp=Math.max(0,p.hp-amount);p.invulnerable=1.25;
 p.vy=-275;p.vx=sourceX<p.x?270:-270;s.lastDamage=reason;s.status=reason;say(s,'hurt',reason);
 if(p.hp<=0){s.mode='dead';s.status='Fuzzbutt needs a retry.';say(s,'defeat',reason)}
}
function strike(s){const p=s.player;if(p.attackCooldown>0)return;
 p.attackCooldown=0.38;p.attackTime=0.19;say(s,'swish');
 for(const e of s.level.enemies){
  if(!e.alive)continue;
  const dx=(e.x+e.w/2)-(p.x+p.w/2);const dy=(e.y+e.h/2)-(p.y+p.h/2);
  if(Math.abs(dx)<94&&Math.abs(dy)<75&&(Math.sign(dx)===p.facing||Math.abs(dx)<34)){
   e.alive=false;say(s,'enemy','Cup Crawler defeated');s.status='CONCESSION BOT: CANCELLED';
  }
 }
 for(const b of s.level.beacons){
  const dx=b.x-(p.x+p.w/2),dy=(b.footY-36)-(p.y+p.h/2);
  if(Math.abs(dx)<110&&Math.abs(dy)<90){s.pulseOverride=3.15;s.pulseFlash=0.65;s.status='GO! IRISH! BEACON ACTIVATED';say(s,'beacon',b.id);}
 }
 const boss=s.boss; if(boss.triggered&&boss.hp>0){
  const dx=boss.x-(p.x+p.w/2),dy=(boss.y+boss.h/2)-(p.y+p.h/2);
  if(Math.abs(dx)<115&&Math.abs(dy)<110&&(Math.sign(dx)===p.facing||Math.abs(dx)<48)){
   if(boss.mode==='rest'&&boss.hurtTime<=0){boss.hp-=1;boss.hurtTime=0.6;boss.mode='hit';boss.timer=0.7;
    s.status=boss.hp>0?`FOX STAGGERED! ${boss.hp} hits left`:'THE FOX HAS BEEN OUTFOXED!';say(s,'bossHit',String(boss.hp));
    if(boss.hp<=0){s.mode='victory';s.birthdayReady=true;s.status='HAPPY BIRTHDAY, MAVERICK!';say(s,'victory');}
   }else{s.status='Wait for the Fox to stagger!';say(s,'blockedHit');}
  }
 }
}
function updateBoss(s,dt){const b=s.boss,p=s.player;
 if(!b.triggered&&p.x>=WORLD.bossStart){b.triggered=true;b.mode='tell';b.attack='charge';b.timer=1.1;s.status='THE FOX: FINAL SHAKEDOWN';say(s,'bossStart');}
 if(!b.triggered||b.hp<=0)return;
 b.hurtTime=Math.max(0,b.hurtTime-dt);
 b.timer-=dt;
 if(b.mode==='tell'){
  if(b.timer<=0){
   if(b.attack==='charge'){b.mode='charge';b.timer=0.72;say(s,'charge');}
   else{b.mode='volley';b.timer=0.8;say(s,'volley');for(let i=0;i<3;i++){
    const dx=Math.sign((p.x+p.w/2)-b.x)||-1;
    s.projectiles.push({x:b.x+dx*16,y:b.y+25+i*16,w:19,h:19,vx:dx*(230+i*36),vy:(i-1)*60,from:'boss',age:0});
   }}
  }
 } else if(b.mode==='charge'){
  b.x+=Math.sign((p.x+p.w/2)-b.x)*420*dt;
  b.x=clamp(b.x,7520,8180);
  if(b.timer<=0){b.mode='rest';b.timer=1.65;s.status='The Fox is open! TAIL SWISH!';say(s,'bossRest')}
 } else if(b.mode==='volley'){
  if(b.timer<=0){b.mode='rest';b.timer=1.85;s.status='Fox is recovering!';say(s,'bossRest')}
 } else if(b.mode==='rest'||b.mode==='hit'){
  if(b.timer<=0){b.cycles++;b.attack=b.cycles%2?'volley':'charge';b.mode='tell';b.timer=0.9;
   s.status=b.attack==='charge'?'Dodge the incoming charge!':'Watch the confetti volley!';}
 }
 if(b.mode==='charge'&&overlap({x:b.x+7,y:b.y+14,w:b.w-14,h:b.h-15},p))damage(s,'The Fox charged you!',b.x);
}
function collide(s,oldBottom){const p=s.player;let best=null;let bestTop=Infinity;
 for(const pl of s.level.platforms){
  if(pl.pulse&&!s.activePulse&&p.onPlatform!==pl.id)continue;
  const mov=movingPosition(pl,s.elapsed);const top=mov.y;
  if(p.vy<0||p.x+p.w<=mov.x+5||p.x>=mov.x+pl.w-5)continue;
  if(oldBottom<=top+10&&p.y+p.h>=top-1&&top<bestTop){best=pl;bestTop=top}
 }
 if(best){p.y=bestTop-p.h;p.vy=0;p.grounded=true;p.jumpsUsed=0;p.coyote=0.12;
  if(p.onPlatform!==best.id)p.landTime=0.12;p.onPlatform=best.id;
 }else{p.grounded=false;p.onPlatform=null}
}
function updateCannon(s,dt){
 for(const h of s.level.hazards){
  const cycle=(s.elapsed+h.offset)%h.period;
  if(cycle<dt&&Math.abs(h.x-s.player.x)<760){s.projectiles.push({x:h.x,y:h.y-6,w:17,h:17,vx:-205,vy:-95,from:'cannon',age:0});say(s,'cannon');}
  // Cone warning and flash are visual; damage comes only from actual projectiles.
 }
}
function projectilesStep(s,dt){const p=s.player;
 for(const b of s.projectiles){b.age+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
  if(b.from==='cannon')b.vy+=190*dt;
  if(overlap(b,p)){damage(s,b.from==='boss'?'Fox confetti hit you!':'Confetti cannon hit you!',b.x);b.age=999;}
 }
 s.projectiles=s.projectiles.filter(b=>b.age<5&&b.y<DOME_ARENA_Y+300+2000&&b.x>=0&&b.x<WORLD.width+50);
}
function updateCamera(s,dt){const p=s.player,c=s.camera;
 const look=p.facing*105;const tx=clamp(p.x-430+look,0,WORLD.width-VIEW.width);
 const ty=clamp(p.y-270,-1625,0);
 const k=1-Math.exp(-4.4*dt);c.x+=k*(tx-c.x);c.y+=k*(ty-c.y);
}
export function update(s,input={},dt=DT){
 if(s.mode!=='playing')return;
 dt=clamp(dt,0,DT);s.time+=dt;s.elapsed+=dt;
 const p=s.player; p.prevX=p.x;p.prevY=p.y;
 for(const k of ['invulnerable','buffer','coyote','dashTime','dashCooldown','attackTime','attackCooldown','landTime'])p[k]=Math.max(0,p[k]-dt);
 s.pulseOverride=Math.max(0,s.pulseOverride-dt);s.pulseFlash=Math.max(0,s.pulseFlash-dt);
 s.shakePickup=Math.max(0,s.shakePickup-dt);s.checkpointNotice=Math.max(0,s.checkpointNotice-dt);
 s.activePulse=pulseActive(s.elapsed,s.pulseOverride);
 if(input.swishPressed)strike(s);
 if(input.jumpPressed)p.buffer=0.135;
 const dir=(input.right?1:0)-(input.left?1:0);
 if(dir)p.facing=dir;
 if(input.dashPressed&&p.dashCooldown<=0){p.dashTime=0.18;p.dashCooldown=0.93;p.vx=p.facing*DASH_SPEED;say(s,'dash');}
 if(p.buffer>0&&(p.grounded||p.coyote>0||p.jumpsUsed<2)){
  const double=p.jumpsUsed>0&&!p.grounded;
  p.vy=double?DOUBLE:JUMP;p.grounded=false;p.onPlatform=null;p.coyote=0;
  p.buffer=0;p.jumpsUsed=double?2:1;say(s,double?'doubleJump':'jump');
 }
 // Carry player along a moving platform before physics updates.
 if(p.onPlatform){const pl=s.level.platforms.find(x=>x.id===p.onPlatform);
  if(pl&&pl.movement){const now=movingPosition(pl,s.elapsed),old=movingPosition(pl,s.elapsed-dt);
   p.x+=now.x-old.x;p.y+=now.y-old.y;
  }
 }
 if(p.dashTime>0)p.vx=p.facing*DASH_SPEED;
 else p.vx+=(dir*SPEED-p.vx)*Math.min(1,(p.grounded?20:11)*dt);
 if(!p.grounded)p.coyote=Math.max(0,p.coyote-dt);
 const oldBottom=p.y+p.h;
 if(p.dashTime<=0)p.vy+=GRAVITY*(input.jumpHeld?1:((p.vy<0)?1.85:1))*dt;
 else p.vy+=GRAVITY*0.42*dt;
 p.vy=clamp(p.vy,-640,900);
 p.x=clamp(p.x+p.vx*dt,0,WORLD.width-p.w-10);p.y+=p.vy*dt;
 collide(s,oldBottom);
 if(p.x>=WORLD.bossStart&&s.boss.triggered)p.x=Math.min(p.x,8160);
 if(p.y>s.level.checkpoints[s.checkpoint].footY+700){
  s.lastDamage='Fell from the route';say(s,'pit');resetToCheckpoint(s);
 }
 for(const cp of s.level.checkpoints){
  const idx=s.level.checkpoints.indexOf(cp);
  if(idx<=s.checkpoint)continue;
  if(p.x>=cp.x-20&&p.x<=cp.x+160&&Math.abs(p.y+p.h-cp.footY)<135){
   s.checkpoint=idx;s.checkpointNotice=2.25;s.status=`CHECKPOINT: ${cp.id}`;say(s,'checkpoint',cp.id);
  }
 }
 for(const q of s.level.shakes){if(q.taken)continue;
  if(Math.abs((p.x+p.w/2)-q.x)<31&&Math.abs((p.y+p.h/2)-q.y)<45){
   q.taken=true;s.shakeCount++;if(q.special)s.secretCount++;s.shakePickup=0.34;
   s.status=q.special?'GOLDEN SHAMROCK!':'SHAMROCK SHAKE +1';say(s,'collect',q.id);
  }
 }
 for(const e of s.level.enemies){if(!e.alive)continue;
  e.x=e.baseX+Math.sin(s.elapsed*e.rate)*e.range;
  if(overlap(e,p)){
   if(p.vy>85&&p.prevY+p.h<=e.y+15){e.alive=false;p.vy=-360;say(s,'stomp',e.id)}
   else damage(s,'A Cup Crawler caught you!',e.x);
  }
 }
 updateCannon(s,dt);projectilesStep(s,dt);updateBoss(s,dt);updateCamera(s,dt);
}
export function snapshot(s){
 const p=s.player,b=s.boss;
 return {mode:s.mode,player:{x:Math.round(p.x),y:Math.round(p.y),vx:Math.round(p.vx),vy:Math.round(p.vy),grounded:p.grounded,hp:p.hp},
 shakeCount:s.shakeCount,secretCount:s.secretCount,checkpoint:s.checkpoint,activePulse:s.activePulse,
 camera:{x:Math.round(s.camera.x),y:Math.round(s.camera.y)},boss:{triggered:b.triggered,mode:b.mode,hp:b.hp,x:Math.round(b.x)},
 time:s.elapsed,status:s.status,assetCount:s.assetCount||0};
}
