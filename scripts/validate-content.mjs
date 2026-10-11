import {readFileSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import {createHash} from 'node:crypto';
const plan=readFileSync('docs/IMPLEMENTATION_PLAN.md','utf8');
const status=readFileSync('docs/PROJECT_STATUS.md','utf8');
const handoff=readFileSync('docs/ASSET_HANDOFF.md','utf8');
for(const term of ['Golden Dome','Fox','Shamrock Shake','Birthday'])assert.ok(plan.toLowerCase().includes(term.toLowerCase()),`Missing revised contract ${term}`);
assert.ok(handoff.includes('NOT cat'),'Missing identity lock');
assert.ok(status.includes('implemented'),'Status does not reflect actual implementation');
for(const f of ['index.html','src/main.mjs','src/game/engine.mjs','src/game/world.mjs','src/game/render.mjs','assets/references/cinnamon_actions_sheet.png'])assert.ok(existsSync(f),`Missing runtime file ${f}`);
const sprites=JSON.parse(readFileSync('assets/sprites/cinnamon/frames.json','utf8'));
assert.equal(Object.keys(sprites.frames).length,26,'Sprite manifest must list exactly 26 physically created cut-outs');
for(const [id,frame] of Object.entries(sprites.frames)){
 assert.ok(existsSync(frame.file),`Missing real sprite ${id}`);const bytes=readFileSync(frame.file);
 assert.ok(bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')),`Bad PNG ${id}`);
 assert.equal(bytes.readUInt32BE(16),240,`Width mismatch ${id}`);assert.equal(bytes.readUInt32BE(20),160,`Height mismatch ${id}`);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),frame.sha256,`Changed sprite bytes ${id}`);
}
console.log('ShakeDown contract + 26 verified sprites: PASS');
