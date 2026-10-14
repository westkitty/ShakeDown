import test from 'node:test';
import assert from 'node:assert/strict';
import {COMFORT_KEY,COMFORT_DEFAULTS,COMFORT_CHOICES,readComfortSettings,writeComfortSettings,sanitizeComfortSettings} from '../src/game/mobile-comfort.mjs';
const store=()=>{const data=new Map();return{
 getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value),raw:data
}};
test('comfort defaults protect original portrait button layout and landscape pad',()=>{
 assert.equal(COMFORT_DEFAULTS.movement,'auto');
 assert.equal(COMFORT_DEFAULTS.haptics,false);
 assert.equal(COMFORT_DEFAULTS.hideForGamepad,false);
 assert.equal(COMFORT_DEFAULTS.size,'standard');
});
test('settings persist locally and do not touch game-save key',()=>{
 const storage=store();
 const good={...COMFORT_DEFAULTS,size:'large',opacity:'strong',hand:'left',haptics:true};
 assert.equal(writeComfortSettings(storage,good),true);
 assert.deepEqual(readComfortSettings(storage),good);
 assert.equal(storage.raw.has('shakedown:birthday:v1'),false);
 assert.equal(JSON.parse(storage.raw.get(COMFORT_KEY)).schema,1);
});
test('invalid values are rejected without altering other settings',()=>{
 const safe=sanitizeComfortSettings({
 size:'mega',opacity:'strong',hand:'left',height:99,movement:'auto',
 sensitivity:'responsive',hud:'compact',haptics:'true',
 hideForGamepad:true
 });
 assert.equal(safe.size,'standard');
 assert.equal(safe.opacity,'strong');
 assert.equal(safe.hand,'left');
 assert.equal(safe.height,'standard');
 assert.equal(safe.sensitivity,'responsive');
 assert.equal(safe.haptics,false);
 assert.equal(safe.hideForGamepad,true);
});
test('malformed JSON or schema ignores unsafe stored settings',()=>{
 const storage=store();storage.setItem(COMFORT_KEY,'{broken');
 assert.deepEqual(readComfortSettings(storage),COMFORT_DEFAULTS);
 storage.setItem(COMFORT_KEY,JSON.stringify({schema:999,settings:{size:'large'}}));
 assert.deepEqual(readComfortSettings(storage),COMFORT_DEFAULTS);
});
test('private browsing storage exceptions do not break controls',()=>{
 const blocked={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.deepEqual(readComfortSettings(blocked),COMFORT_DEFAULTS);
 assert.equal(writeComfortSettings(blocked,{size:'large'}),false);
});
test('every select has legal choices and every boolean stays boolean',()=>{
 for(const [key,choices] of Object.entries(COMFORT_CHOICES)){
  assert.ok(choices.includes(COMFORT_DEFAULTS[key]));
  for(const choice of choices)
   assert.equal(sanitizeComfortSettings({[key]:choice})[key],choice);
 }
 for(const key of ['haptics','hideForGamepad'])
  assert.equal(typeof COMFORT_DEFAULTS[key],'boolean');
});
test('array and null payloads do not override defaults',()=>{
 assert.deepEqual(sanitizeComfortSettings(null),COMFORT_DEFAULTS);
 assert.deepEqual(sanitizeComfortSettings([]),COMFORT_DEFAULTS);
});
