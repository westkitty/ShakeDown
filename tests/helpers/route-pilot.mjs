// Read-only deterministic route driver. No teleport, no physics bypass.
export class RoutePilot {
 constructor(){this.segment='campus';this.stage=0;this.phase='approach';this.phaseFrame=0;
  this.climbed=new Set();this.retries=0;this.pitResets=0;
  this.summitReached=false;this.trace=[];this.steps=0;
  this.lastX=null;this.awaitingRetry=false;}
 resyncCheckpoint(s){
  const checkpoint=s.checkpoint;
  if(checkpoint>=5){this.segment='boss';this.stage=23;}
  else if(checkpoint>=3){this.segment='climb';this.stage=checkpoint===3?10:18;}
  else{this.segment='campus';this.stage=0;}
  this.phase='approach';this.phaseFrame=0;
  this.record('checkpoint-resync',s.level.checkpoints[checkpoint].id,s);
 }
 record(event,detail,s){this.trace.push({event,detail,seconds:Number(s.elapsed.toFixed(2))});if(this.trace.length>120)this.trace.shift();}
 next(s){
  this.steps++;
  if(s.mode==='dead'){
   this.retries++;this.awaitingRetry=true;
   this.record('retry',s.lastDamage,s);return{retry:true}
  }
  if(s.mode!=='playing')return{};
  const p=s.player;
  if(this.awaitingRetry){
   this.awaitingRetry=false;this.resyncCheckpoint(s);
  }else if(this.lastX!==null&&this.lastX-p.x>200){
   // The engine auto-resets the player to checkpoint after falling into a pit.
   // This is read-only observation of a real reset, not a test warp.
   this.pitResets++;this.resyncCheckpoint(s);
  }
  this.lastX=p.x;
  if(this.segment==='campus'){
   const nearGap=[760,1440,2150,2905,3760].some(x=>p.x>=x-80&&p.x<=x+55);
   const enemy=s.level.enemies.some(e=>e.alive&&e.x-p.x>-2&&e.x-p.x<104&&Math.abs(e.y-p.y)<105);
   const jumpPressed=(nearGap&&p.grounded&&p.jumpsUsed===0)||
    (!p.grounded&&p.jumpsUsed===1&&p.vy>135&&nearGap);
   if(p.x>3820&&p.onPlatform==='dome-approach'){
    this.segment='climb';this.stage=0;this.phase='approach';this.phaseFrame=0;this.record('dome-entry',p.x,s);
   }
   return{right:true,jumpHeld:true,jumpPressed,swishPressed:enemy&&p.attackCooldown<=0};
  }
  if(this.segment==='climb'){
   // The real physics can land the player on a higher step without touching
   // every intermediate step, especially after safety-ledge double jumps.
   const match=/^dome-step-(\d+)$/.exec(p.onPlatform||'');
   if(match&&p.grounded){
    const landed=Number(match[1]);
    if(landed>this.stage&&landed<=23){
     this.stage=landed;this.climbed.add(p.onPlatform);
     this.record('dome-step',p.onPlatform,s);
     this.phase='approach';this.phaseFrame=0;
     return {right:false};
    }
   }
   if(this.stage===23){this.segment='boss';this.summitReached=true;this.record('summit',p.x,s);return{right:true};}
   const source=this.stage===0?s.level.platforms.find(x=>x.id==='dome-approach'):
    s.level.platforms.find(x=>x.id==='dome-step-'+String(this.stage).padStart(2,'0'));
   const target=s.level.platforms.find(x=>x.id==='dome-step-'+String(this.stage+1).padStart(2,'0'));
   if(!source||!target)throw Error('Missing authored Dome platform '+this.stage);
   if(p.onPlatform==='dome-safety-'+(this.stage+1)&&this.phase==='jumping'){
    // A correctly behaving pulse-platform safety ledge is lower than its target.
    // Recover with an ordinary additional jump rather than waiting until timeout.
    this.record('safety-relaunch',p.onPlatform,s);
    this.phase='approach';this.phaseFrame=0;
   }
   if(this.phase==='approach'){
    const launchX=source.x+source.w*.56;
    if(p.grounded&&p.x>=launchX-4){this.phase='jumping';this.phaseFrame=0}
    else return{right:p.x<launchX};
   }
   this.phaseFrame++;
   const right=p.x<target.x+Math.min(target.w*.65,110);
   const jumpPressed=this.phaseFrame===1||(this.phaseFrame===26&&
    p.onPlatform!==target.id&&p.jumpsUsed===1&&Math.abs(p.x-target.x)>85);
   if(this.phaseFrame>200)throw Error('Dome stalled at '+this.stage+
    ': player '+p.x.toFixed(1)+','+p.y.toFixed(1)+' platform='+p.onPlatform);
   return{right,jumpHeld:this.phaseFrame<66,jumpPressed};
  }
  if(this.segment==='boss'){
   const b=s.boss,dx=b.x-p.x;
   const swish=b.triggered&&b.mode==='rest'&&Math.abs(dx)<110&&p.attackCooldown<=0;
   if(!b.triggered)return{right:true};
   if(b.mode==='tell'||b.mode==='charge'||b.mode==='volley'){
    if(dx<190)return{left:true,jumpHeld:true,jumpPressed:p.grounded};
    return{right:true};
   }
   if(b.mode==='rest'&&Math.abs(dx)>=90)return{right:dx>0,left:dx<0};
   return{swishPressed:swish};
  }
  return{};
 }
}
