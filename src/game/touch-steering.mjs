// Manual touch direction exists only for held pointers; persistent movement
// is available exclusively while Auto-Run is explicitly enabled.
export const GESTURE_SENSITIVITY=Object.freeze({responsive:12,balanced:21,deliberate:34});
export class TouchSteering {
 constructor({onChange=()=>{},onAction=()=>{},sensitivity='balanced'}={}){
  this.onChange=onChange;this.onAction=onAction;
  this.sensitivity=sensitivity in GESTURE_SENSITIVITY?sensitivity:'balanced';
  this.pointers=new Map();this.autoRun=false;this.autoDirection='right';this.lastReport='';
 }
 get manualDirection(){
  const pointers=[...this.pointers.values()];
  for(let i=pointers.length-1;i>=0;i--)if(pointers[i].direction)return pointers[i].direction;
  return null;
 }
 get effectiveDirection(){return this.manualDirection||(this.autoRun?this.autoDirection:null)}
 get activeCount(){return this.pointers.size}
 snapshot(){return {autoRun:this.autoRun,autoDirection:this.autoDirection,manualDirection:this.manualDirection,effectiveDirection:this.effectiveDirection,activePointers:this.activeCount,sensitivity:this.sensitivity}}
 setSensitivity(value){if(value in GESTURE_SENSITIVITY)this.sensitivity=value}
 setAutoRun(value){
  const enabled=Boolean(value);
  if(enabled&&!this.autoRun)this.autoDirection=this.manualDirection||this.autoDirection;
  this.autoRun=enabled;this.notify();
 }
 toggleAutoRun(){this.setAutoRun(!this.autoRun)}
 setAutoDirection(direction){
  if(this.autoRun&&(direction==='left'||direction==='right')){
   this.autoDirection=direction;this.notify();
  }
 }
 begin(id,x,y,rect){
  if(this.pointers.has(id))return;
  const ratio=Math.max(0,Math.min(1,(x-rect.left)/Math.max(1,rect.width)));
  const direction=ratio<.34?'left':ratio>.66?'right':null;
  this.pointers.set(id,{x,y,anchorX:x,anchorY:y,direction,verticalUsed:false});
  if(direction)this.setAutoDirection(direction);
  this.notify();
 }
 move(id,x,y){
  const p=this.pointers.get(id);if(!p)return;
  const dx=x-p.anchorX,dy=y-p.anchorY,threshold=GESTURE_SENSITIVITY[this.sensitivity];
  p.x=x;p.y=y;
  if(!p.verticalUsed&&Math.abs(dy)>=threshold*1.15&&Math.abs(dy)>Math.abs(dx)*1.14){
   p.verticalUsed=true;p.anchorX=x;p.anchorY=y;
   this.onAction(dy<0?'jump':'dash');
  }else if(Math.abs(dx)>=threshold&&Math.abs(dx)>Math.abs(dy)*1.08){
   const next=dx<0?'left':'right';
   p.anchorX=x;p.anchorY=y;
   if(p.direction!==next){p.direction=next;this.setAutoDirection(next);this.notify()}
  }
 }
 end(id,x,y,{commit=true}={}){
  if(!this.pointers.has(id))return;
  if(commit&&Number.isFinite(x)&&Number.isFinite(y))this.move(id,x,y);
  this.pointers.delete(id);this.notify();
 }
 cancel({disableAuto=false}={}){
  this.pointers.clear();
  if(disableAuto){this.autoRun=false;this.autoDirection='right'}
  this.notify();
 }
 notify(){
  const key=[this.effectiveDirection??'',this.manualDirection??'',this.autoDirection,Number(this.autoRun),this.activeCount].join('|');
  if(key===this.lastReport)return;
  this.lastReport=key;this.onChange(this.snapshot());
 }
}
