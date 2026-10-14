import test from 'node:test';
import assert from 'node:assert/strict';
import {TouchSteering,GESTURE_SENSITIVITY} from '../src/game/touch-steering.mjs';
const rect={left:0,width:160};
const create=()=>{const directions=[],actions=[];const steering=new TouchSteering({
 onChange:s=>directions.push(s),onAction:a=>actions.push(a)
});return {steering,directions,actions}};
test('manual right/left taps move only while pointer is down',()=>{
 const {steering:s}=create();
 assert.equal(s.effectiveDirection,null);
 s.begin(1,147,50,rect);assert.equal(s.effectiveDirection,'right');
 s.end(1,147,50);assert.equal(s.effectiveDirection,null);
 assert.equal(s.autoRun,false);
 s.begin(2,5,50,rect);assert.equal(s.effectiveDirection,'left');
 s.end(2,5,50);assert.equal(s.effectiveDirection,null);
});
test('horizontal swipe reverses without leaving a direction latched',()=>{
 const {steering:s}=create();
 s.begin(1,80,50,rect);assert.equal(s.effectiveDirection,null);
 s.move(1,126,50);assert.equal(s.effectiveDirection,'right');
 s.move(1,84,50);assert.equal(s.effectiveDirection,'left');
 s.end(1,84,50);assert.equal(s.effectiveDirection,null);
});
test('small thumb jitter does not trigger a swipe',()=>{
 const {steering:s,actions}=create();
 s.begin(1,80,50,rect);s.move(1,92,60);assert.equal(s.effectiveDirection,null);
 assert.deepEqual(actions,[]);s.end(1,92,60);
});
test('quick flick released without Auto-Run cannot continue moving',()=>{
 const {steering:s}=create();s.begin(1,80,50,rect);s.end(1,145,50);
 assert.equal(s.effectiveDirection,null);assert.equal(s.autoRun,false);
});
test('Auto-Run is the only owner of lasting right movement',()=>{
 const {steering:s}=create();
 s.setAutoRun(true);assert.equal(s.effectiveDirection,'right');
 s.begin(1,2,50,rect);assert.equal(s.autoDirection,'left');
 s.end(1,2,50);assert.equal(s.effectiveDirection,'left');
 s.setAutoRun(false);assert.equal(s.effectiveDirection,null);
});
test('Auto-Run off while a finger is still held preserves only the manual hold',()=>{
 const {steering:s}=create();
 s.begin(1,150,50,rect);s.setAutoRun(true);s.setAutoRun(false);
 assert.equal(s.effectiveDirection,'right');
 s.end(1,150,50);assert.equal(s.effectiveDirection,null);
});
test('up swipe jumps once while retaining a held direction',()=>{
 const {steering:s,actions}=create();s.begin(1,150,75,rect);
 s.move(1,150,34);s.move(1,150,1);
 assert.deepEqual(actions,['jump']);assert.equal(s.effectiveDirection,'right');
 s.end(1,150,1);assert.equal(s.effectiveDirection,null);
});
test('down swipe dashes once without setting permanent direction',()=>{
 const {steering:s,actions}=create();s.begin(1,80,10,rect);
 s.move(1,80,52);s.move(1,80,90);
 assert.deepEqual(actions,['dash']);assert.equal(s.effectiveDirection,null);
 s.end(1,80,90);assert.equal(s.activeCount,0);
});
test('two fingers can coexist; last directional finger takes priority',()=>{
 const {steering:s}=create();s.begin(1,155,50,rect);s.begin(2,80,50,rect);
 assert.equal(s.effectiveDirection,'right');
 s.move(2,20,50);assert.equal(s.effectiveDirection,'left');
 s.end(2,20,50);assert.equal(s.effectiveDirection,'right');
 s.end(1,155,50);assert.equal(s.effectiveDirection,null);
});
test('cancel/lost capture releases input without interpreting late movement',()=>{
 const {steering:s,actions}=create();s.begin(1,155,50,rect);
 s.end(1,155,-50,{commit:false});
 assert.equal(s.effectiveDirection,null);assert.deepEqual(actions,[]);
});
test('blur/pause reset clears every pointer and disables Auto-Run',()=>{
 const {steering:s}=create();s.setAutoRun(true);s.begin(1,10,10,rect);
 s.cancel({disableAuto:true});
 assert.equal(s.activeCount,0);assert.equal(s.autoRun,false);
 assert.equal(s.effectiveDirection,null);
});
test('responsive/deliberate sensitivity changes the gesture dead zone',()=>{
 assert.deepEqual(Object.keys(GESTURE_SENSITIVITY),['responsive','balanced','deliberate']);
 const responsive=create().steering;responsive.setSensitivity('responsive');
 responsive.begin(1,80,50,rect);responsive.move(1,95,50);
 assert.equal(responsive.effectiveDirection,'right');
 const deliberate=create().steering;deliberate.setSensitivity('deliberate');
 deliberate.begin(1,80,50,rect);deliberate.move(1,95,50);
 assert.equal(deliberate.effectiveDirection,null);
});
test('invalid sensitivity does not replace a valid selection',()=>{
 const {steering:s}=create();s.setSensitivity('responsive');s.setSensitivity('🚀');
 assert.equal(s.sensitivity,'responsive');
});
