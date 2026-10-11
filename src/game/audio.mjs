// Lightweight local WebAudio synthesis: no remote downloads, license uncertainty or autoplay.
export class AudioBox {
 constructor(){this.context=null;this.enabled=true;this.nextBeat=0;this.beat=0;this.audioUnavailable=false;}
 activate(){if(!this.enabled||this.audioUnavailable)return;
  try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC){this.audioUnavailable=true;return}
   if(!this.context)this.context=new AC();if(this.context.state==='suspended')this.context.resume().catch(()=>{});
  }catch{this.audioUnavailable=true;}}
 note(freq,duration=.10,type='triangle',gain=.04,when=0){const ctx=this.context;
  if(!this.enabled||!ctx||ctx.state!=='running')return;
  try{const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime+when);
   g.gain.setValueAtTime(0.0001,ctx.currentTime+when);
   g.gain.exponentialRampToValueAtTime(gain,ctx.currentTime+when+.008);
   g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+when+duration);
   o.connect(g).connect(ctx.destination);o.start(ctx.currentTime+when);o.stop(ctx.currentTime+when+duration+.025);
  }catch{/* Sound must never prevent play. */}}
 event(type){if(!this.enabled)return;
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
  }}
 musicTick(now,boss=false){const ctx=this.context;
  if(!this.enabled||!ctx||ctx.state!=='running')return;
  if(!this.nextBeat||now>this.nextBeat+5)this.nextBeat=now;
  if(now>=this.nextBeat){const notes=boss?[196,233,262,311,294,262,233,175]:[262,330,392,330,349,440,523,440,294,370,440,370,330,392,494,392];
   const note=notes[this.beat%notes.length];this.note(note,.12,'triangle',boss?.027:.02);if(this.beat%4===0)this.note(note/2,.27,'sine',.02);
   this.beat++;this.nextBeat=now+(boss?.175:.23);}}
 mute(value){this.enabled=!value;if(value&&this.context){this.context.suspend().catch(()=>{})}else this.activate()}
}
