import test from 'node:test';
import assert from 'node:assert/strict';
import {installAdvice,isStandalone} from '../src/game/pwa-install.mjs';
test('PWA instructions describe the complete game, not a partial demo',()=>{
 const prepare=installAdvice({installed:false,ready:false,promptAvailable:true});
 assert.match(prepare,/COMPLETE game/);
 assert.match(prepare,/cinematics/);
 assert.match(prepare,/music/);
 const ready=installAdvice({installed:false,ready:true,promptAvailable:true});
 assert.match(ready,/Complete game ready/);
 assert.match(ready,/no APK/);
 const installed=installAdvice({installed:true,ready:true});
 assert.match(installed,/entire game/);
 assert.match(installed,/offline|without a connection/);
});
test('already installed but partial game shows download guidance',()=>{
 const advice=installAdvice({installed:true,ready:false});
 assert.match(advice,/Download the complete game/);
 assert.match(advice,/offline/);
});
test('standalone detection is feature guarded',()=>{
 assert.equal(isStandalone({navigator:{standalone:true}}),true);
 assert.equal(isStandalone({navigator:{standalone:false},matchMedia:()=>({matches:false})}),false);
 assert.equal(isStandalone({navigator:{},matchMedia:query=>({matches:query.includes('standalone')})}),true);
 assert.equal(isStandalone({navigator:{}}),false);
});
