// Read-only deterministic route driver. No teleport, no physics bypass.
export class RoutePilot {
 constructor(){this.segment='campus';this.stage=0;this.phase='approach';this.phaseFrame=0;
  this.climbed=new Set();this.retries=0;this.summitReached=false;this.trace=[];this.steps=0;}
 record(event,detail,s){this.trace.push({event,detail,seconds:Number(s.elapsed.toFixed(2))});if(this.trace.length>120)this.trace.shift();}
 next(s){
  this.steps++;
  if(s.mode==='dead'){this.retries++;this.record('retry',s.lastDamage,s);return{retry:true}}
  if(s.mode!=='playing')return{};
  const p=s.player;
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
   if(this.stage===23){this.segment='boss';this.summitReached=true;this.record('summit',p.x,s);return{right:true};}
   const source=this.stage===0?s.level.platforms.find(x=>x.id==='dome-approach'):
    s.level.platforms.find(x=>x.id==='dome-step-'+String(this.stage).padStart(2,'0'));
   const target=s.level.platforms.find(x=>x.id==='dome-step-'+String(this.stage+1).padStart(2,'0'));
   if(!source||!target)throw Error('Missing authored Dome platform '+this.stage);
   if(this.phase==='approach'){
    const launchX=source.x+source.w*.56;
    if(p.grounded&&p.x>=launchX-4){this.phase='jumping';this.phaseFrame=0}
    else return{right:p.x<launchX};
   }
   this.phaseFrame++;
   const right=p.x<target.x+Math.min(target.w*.65,110);
   const jumpPressed=this.phaseFrame===1||(this.phaseFrame===26&&
    p.onPlatform!==target.id&&p.jumpsUsed===1&&Math.abs(p.x-target.x)>85);
   if(this.phaseFrame>3&&p.onPlatform===target.id){
    this.stage++;this.climbed.add(target.id);this.record('dome-step',target.id,s);
    this.phase='approach';this.phaseFrame=0;return{right:false};
   }
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
