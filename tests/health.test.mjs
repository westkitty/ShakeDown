import test from 'node:test';
import assert from 'node:assert/strict';
import {healthSegments,healthAnnouncement} from '../src/game/health.mjs';

test('every half-damage state has a distinct visible heart pattern',()=>{
 const expected={
  3:['full','full','full'],
  2.5:['full','full','half'],
  2:['full','full','empty'],
  1.5:['full','half','empty'],
  1:['full','empty','empty'],
  0.5:['half','empty','empty'],
  0:['empty','empty','empty']
 };
 for(const [hp,segments] of Object.entries(expected)){
  assert.deepEqual(healthSegments(Number(hp)),segments);
  assert.equal(healthAnnouncement(Number(hp)),'Health: '+hp+' of 3 hearts');
 }
});
test('invalid health cannot introduce a misleading full heart',()=>{
 for(const hp of [NaN,Infinity,-Infinity])assert.deepEqual(healthSegments(hp),['empty','empty','empty']);
 assert.deepEqual(healthSegments(-1),['empty','empty','empty']);
 assert.deepEqual(healthSegments(12),['full','full','full']);
});
