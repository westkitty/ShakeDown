// Deliberately local synthesized sound. Never create an AudioContext before user input.
const MAX_ACTIVE_VOICES=24;
export class AudioBox {
 constructor(){
  this.context=null;this.enabled=true;this.paused=false;
  this.nextBeat=0;this.beat=0;this.audioUnavailable=false;
  this.voices=new Set();
 }
 activate(){
  if(!this.enabled||this.paused||this.audioUnavailable)return false;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC){this.audioUnavailable=true;return false}
   if(!this.context||this.context.state==='closed')this.context=new AC();
   if(this.context.state==='suspended')this.context.resume().catch(()=>{});
   return true;
  }catch{this.audioUnavailable=true;return false}
 }
 stopAll(){
  for(const voice of this.voices){
   try{voice.onended=null;voice.stop()}catch{/* Already ended or closed. */}
   try{voice.disconnect()}catch{}
  }
  this.voices.clear();
 }
 suspend(){
  const ctx=this.context;
  this.stopAll();
  this.nextBeat=0;
  if(ctx&&ctx.state==='running')ctx.suspend().catch(()=>{});
 }
 setPaused(value){
  this.paused=Boolean(value);
  if(this.paused)this.suspend();
  else if(this.enabled)this.activate();
 }
 note(freq,duration=.10,type='triangle',gain=.04,when=0){
  const ctx=this.context;
  if(!this.enabled||this.paused||!ctx||ctx.state!=='running'||
      this.voices.size>=MAX_ACTIVE_VOICES)return false;
  let oscillator,envelope;
  try{
   const start=ctx.currentTime+Math.max(0,when),end=start+Math.max(.03,duration);
   oscillator=ctx.createOscillator();envelope=ctx.createGain();
   oscillator.type=type;
   oscillator.frequency.setValueAtTime(freq,start);
   envelope.gain.setValueAtTime(.0001,start);
   envelope.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),start+.008);
   envelope.gain.exponentialRampToValueAtTime(.0001,end);
   oscillator.connect(envelope).connect(ctx.destination);
   oscillator.onended=()=>{
    this.voices.delete(oscillator);
    try{oscillator.disconnect();envelope.disconnect()}catch{}
   };
   this.voices.add(oscillator);
   oscillator.start(start);oscillator.stop(end+.025);
   return true;
  }catch{
   if(oscillator){this.voices.delete(oscillator);try{oscillator.disconnect()}catch{}}
   if(envelope){try{envelope.disconnect()}catch{}}
   return false;
  } // Sound failure never interrupts gameplay.
 }
 event(type){
  if(!this.enabled||this.paused)return;
  switch(type){
   case 'jump':this.note(460,.14,'square',.022);break;
   case 'doubleJump':this.note(680,.2,'sine',.055);break;
   case 'dash':this.note(220,.22,'sawtooth',.026);break;
   case 'swish':this.note(330,.12,'sawtooth',.04);break;
   case 'collect':this.note(784,.13,'triangle',.07);this.note(1174,.18,'triangle',.046,.08);break;
   case 'beacon':this.note(392,.18,'triangle',.054);this.note(587,.22,'triangle',.043,.11);break;
   case 'hurt':this.note(166,.35,'sawtooth',.049);break;
   case 'bossHit':this.note(140,.17,'square',.07);this.note(523,.25,'triangle',.048,.11);break;
   case 'victory':[523,659,784,1047].forEach((n,i)=>this.note(n,.45,'triangle',.07,i*.18));break;
   case 'checkpoint':this.note(659,.26,'triangle',.05);break;
   case 'stomp':case 'enemy':this.note(270,.14,'square',.027);break;
  }
 }
 musicTick(now,boss=false){
  const ctx=this.context;
  if(!this.enabled||this.paused||!ctx||ctx.state!=='running')return;
  if(!this.nextBeat||now>this.nextBeat+5)this.nextBeat=now;
  if(now>=this.nextBeat){
   const notes=boss?[196,233,262,311,294,262,233,175]:[262,330,392,330,349,440,523,440,294,370,440,370,330,392,494,392];
   const note=notes[this.beat%notes.length];
   this.note(note,.12,'triangle',boss?.027:.02);
   if(this.beat%4===0)this.note(note/2,.27,'sine',.02);
   this.beat++;this.nextBeat=now+(boss?.175:.23);
  }
 }
 mute(value,{resume=true}={}){
  this.enabled=!Boolean(value);
  if(!this.enabled)this.suspend();
  else if(resume&&!this.paused)this.activate();
 }
 resetSequence(){this.stopAll();this.nextBeat=0;this.beat=0}
 dispose(){
  this.suspend();
  if(this.context){const c=this.context;this.context=null;c.close?.().catch(()=>{});}
 }
 diagnostics(){return {created:Boolean(this.context),state:this.context?.state||'none',
  enabled:this.enabled,paused:this.paused,activeVoices:this.voices.size,maxActiveVoices:MAX_ACTIVE_VOICES,
  unavailable:this.audioUnavailable};}
}
