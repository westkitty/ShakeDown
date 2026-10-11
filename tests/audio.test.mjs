import test from 'node:test';
import assert from 'node:assert/strict';
import {AudioBox} from '../src/game/audio.mjs';

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
const enableFake=()=>{FakeContext.created=0;globalThis.window={AudioContext:FakeContext}};

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
