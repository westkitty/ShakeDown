import test from 'node:test';
import assert from 'node:assert/strict';
import {mobileCanvasPan} from '../src/game/mobile-framing.mjs';

test('mobile panning never exposes whitespace beyond the canvas edge',()=>{
 const w=370,cw=670;
 for(const px of [0,10,90,220,350,500,670]){
  const result=mobileCanvasPan({viewportWidth:w,canvasWidth:cw,playerCssX:px});
  assert.ok(result<=0&&result>=w-cw,'pan clamped for '+px);
 }
 assert.equal(mobileCanvasPan({viewportWidth:w,canvasWidth:cw,playerCssX:0}),0);
 assert.equal(mobileCanvasPan({viewportWidth:w,canvasWidth:cw,playerCssX:670}),w-cw);
});
test('portrait crop is disabled if canvas already fits or has invalid geometry',()=>{
 for(const viewportWidth of [960,1000])
  assert.equal(mobileCanvasPan({viewportWidth,canvasWidth:960,playerCssX:330}),0);
 assert.equal(mobileCanvasPan({viewportWidth:360,canvasWidth:NaN,playerCssX:200}),0);
});
