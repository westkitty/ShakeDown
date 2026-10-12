import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioBox,MUSIC_TRACKS} from '../src/game/audio.mjs';

class FakeParam {
 setValueAtTime(){return this}
 exponentialRampToValueAtTime(){return this}
}
class FakeVoice {
 constructor(){this.frequency=new FakeParam();this.onended=null;this.started=false;this.stopped=false}
 connect(next){return next}
 disconnect(){this.disconnected=true}
 start(){this.started=true}
 stop(){this.stopped=true}
}
class FakeGain {
 constructor(){this.gain=new FakeParam()}
 connect(next){return next}
 disconnect(){}
}
class FakeContext {
 static created=0;
 constructor(){FakeContext.created++;this.state='running';this.currentTime=10;this.destination={};this.allVoices=[]}
 createOscillator(){const o=new FakeVoice();this.allVoices.push(o);return o}
 createGain(){return new FakeGain()}
 resume(){this.state='running';return Promise.resolve()}
 suspend(){this.state='suspended';return Promise.resolve()}
 close(){this.state='closed';return Promise.resolve()}
}
class FakeRecordedAudio {
 static created=[];
 constructor(src){
  this.src=src;this.currentTime=0;this.paused=true;this.loop=false;this.volume=1;
  this.listeners={};this.playCalls=0;this.pauseCalls=0;
  FakeRecordedAudio.created.push(this);
 }
 addEventListener(type,listener){this.listeners[type]=listener}
 play(){this.paused=false;this.playCalls++;return Promise.resolve()}
 pause(){this.paused=true;this.pauseCalls++}
 removeAttribute(name){if(name==='src')this.src=''}
 load(){}
 emit(type){this.listeners[type]?.()}
}
const enableFake=()=>{
 FakeContext.created=0;FakeRecordedAudio.created=[];
 globalThis.window={AudioContext:FakeContext,Audio:FakeRecordedAudio};
};

test('audio never constructs an AudioContext before explicit activation gesture',()=>{
 enableFake();
 const a=new AudioBox();
 a.mute(false,{resume:false});
 assert.equal(FakeContext.created,0);
 assert.equal(a.note(440),false);
 a.musicTick(0);
 assert.equal(a.activate(),true);
 assert.equal(FakeContext.created,1);
 assert.equal(a.diagnostics().state,'running');
 a.dispose();
});

test('rapid repeated sounds are bounded, and pause/mute cannot leak a held voice',()=>{
 enableFake();
 const a=new AudioBox();
 a.activate();
 for(let i=0;i<80;i++)a.event('collect');
 assert.equal(a.diagnostics().activeVoices,24);
 assert.equal(a.note(440),false,'Never schedule beyond the voice cap');
 const osc=[...a.voices][0];osc.onended();
 assert.equal(a.diagnostics().activeVoices,23,'Natural end releases one slot');
 a.setPaused(true);
 assert.equal(a.diagnostics().activeVoices,0);
 assert.equal(a.diagnostics().state,'suspended');
 assert.equal(a.note(400),false,'Paused game makes no noise');
 a.setPaused(false);assert.equal(a.diagnostics().paused,false);
 a.event('jump');assert.equal(a.diagnostics().activeVoices,1);
 a.mute(true);assert.equal(a.diagnostics().activeVoices,0);
 assert.equal(a.diagnostics().state,'suspended');
 a.mute(false);a.event('jump');
 assert.equal(a.diagnostics().activeVoices,1);
 a.resetSequence();assert.equal(a.diagnostics().activeVoices,0);
 assert.equal(a.beat,0);assert.equal(a.nextBeat,0);
 a.dispose();
});

test('audio recovers after a context close and missing WebAudio degrades silently',()=>{
 enableFake();
 const a=new AudioBox();
 a.activate();a.dispose();
 assert.equal(a.diagnostics().created,false);
 assert.equal(a.activate(),true);
 assert.equal(FakeContext.created,2);
 a.dispose();
 globalThis.window={};
 const fallback=new AudioBox();
 assert.equal(fallback.activate(),false);
 assert.equal(fallback.audioUnavailable,true);
 assert.doesNotThrow(()=>{fallback.event('victory');fallback.musicTick(100)});
});

test('recorded level music is gesture-gated, role-switched, paused and reset safely',async()=>{
 enableFake();
 const a=new AudioBox({random:()=>0});
 assert.equal(FakeRecordedAudio.created.length,0,'No media element before player gesture');
 a.musicTick(0,'campus');
 assert.equal(FakeRecordedAudio.created.length,0,'Gameplay ticks cannot bypass the browser gesture gate');
 a.activate();a.musicTick(0,'campus');await Promise.resolve();
 assert.equal(FakeRecordedAudio.created[0].src,MUSIC_TRACKS.campus[0]);
 assert.equal(FakeRecordedAudio.created[0].paused,false);
 assert.equal(FakeRecordedAudio.created[0].loop,true);
 assert.equal(FakeRecordedAudio.created[0].volume,.28);
 a.musicTick(1,'campus');
 assert.equal(FakeRecordedAudio.created.length,1,'Stable zone does not recreate or redownload music');
 const campus=FakeRecordedAudio.created[0];
 a.musicTick(2,'dome');await Promise.resolve();
 assert.equal(campus.paused,true);assert.equal(campus.currentTime,0);
 assert.equal(FakeRecordedAudio.created[1].src,MUSIC_TRACKS.dome[0]);
 a.musicTick(3,'boss');await Promise.resolve();
 assert.equal(FakeRecordedAudio.created[2].src,MUSIC_TRACKS.boss[0]);
 a.setPaused(true);assert.equal(FakeRecordedAudio.created[2].paused,true);
 a.setPaused(false);await Promise.resolve();
 assert.equal(FakeRecordedAudio.created[2].paused,false);
 a.mute(true);assert.equal(FakeRecordedAudio.created[2].paused,true);
 a.mute(false);await Promise.resolve();assert.equal(FakeRecordedAudio.created[2].paused,false);
 a.musicTick(4,'silent');
 assert.equal(a.diagnostics().musicCreated,false,'Victory leaves room for the synthesized fanfare');
 a.resetSequence();assert.equal(a.diagnostics().musicCreated,false);
 a.dispose();
});

test('a broken recording advances within its role and retains synthesized fallback',async()=>{
 enableFake();
 const a=new AudioBox({random:()=>0});
 a.activate();a.musicTick(0,'campus');await Promise.resolve();
 const first=FakeRecordedAudio.created[0];first.emit('error');
 assert.deepEqual(a.diagnostics().musicFailures,[MUSIC_TRACKS.campus[0]]);
 a.musicTick(1,'campus');await Promise.resolve();
 assert.equal(FakeRecordedAudio.created[1].src,MUSIC_TRACKS.campus[1]);
 a.dispose();

 enableFake();delete globalThis.window.Audio;
 const fallback=new AudioBox();fallback.activate();fallback.musicTick(0,'campus');
 assert.equal(fallback.diagnostics().musicUnavailable,true);
 assert.ok(fallback.diagnostics().activeVoices>0,'Synth melody remains available without MP3 playback');
 fallback.dispose();
});

test('a paused pending HTMLMediaElement.play rejection cannot blacklist its track on resume',async()=>{
 enableFake();
 class DelayedAudio extends FakeRecordedAudio {
  constructor(src){super(src);this.pending=[]}
  play(){
   this.paused=false;this.playCalls++;
   return new Promise((resolve,reject)=>this.pending.push({resolve,reject}));
  }
  pause(){
   super.pause();
   const interrupted=this.pending.splice(0);
   for(const attempt of interrupted){
    const error=new Error('The play() request was interrupted by a call to pause().');
    error.name='AbortError';attempt.reject(error);
   }
  }
 }
 globalThis.window.Audio=DelayedAudio;
 const a=new AudioBox({random:()=>0});
 a.activate();a.musicTick(0,'boss');
 const original=a.musicElement;
 assert.ok(original);
 assert.equal(original.pending.length,1,'Simulated media play is unsettled');
 a.setPaused(true);
 assert.equal(original.paused,true);
 a.setPaused(false);
 assert.equal(original.playCalls,2,'Resume must use the existing track, not download a new one');
 await Promise.resolve();await Promise.resolve();await Promise.resolve();
 assert.equal(a.musicFailures.size,0,'Intentional play cancellation is not a corrupt MP3');
 assert.equal(a.musicElement,original,'Stale async rejection cannot clear the resumed recording');
 assert.equal(a.musicTrack,MUSIC_TRACKS.boss[0],'Only boss track must remain available');
 assert.equal(a.musicBlocked,false);
 assert.equal(original.pending.length,1);
 original.pending[0].resolve();
 await Promise.resolve();await Promise.resolve();
 assert.equal(a.diagnostics().musicPlaying,true);
 a.dispose();
});
