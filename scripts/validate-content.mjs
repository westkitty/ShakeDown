import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const plan=readFileSync('docs/IMPLEMENTATION_PLAN.md','utf8');
const handoff=readFileSync('docs/ASSET_HANDOFF.md','utf8');
const status=readFileSync('docs/PROJECT_STATUS.md','utf8');
for(const term of ['Golden Dome','Riverwalk','Eddy Street','Fox Den','Shamrock Shake']) assert.ok(plan.includes(term), 'Missing narrative contract: '+term);
assert.ok(handoff.includes('NOT cat') && handoff.includes('Fox antagonist'), 'Missing identity anchors');
assert.ok(status.includes('NOT IMPLEMENTED'), 'Phase status must remain honest until runnable implementation');
console.log('Phase 0 planning contract: PASS');
