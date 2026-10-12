import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PNG} from 'pngjs';
import {ART_SLOTS,roleForId,validateArtInventory,ArtRuntime} from '../src/game/art-runtime.mjs';

const curation=JSON.parse(fs.readFileSync('assets/production/curation.json','utf8'));
const manifest=JSON.parse(fs.readFileSync('assets/production/manifest.json','utf8'));
const expected={birthday:14,backdrop:14,bossFx:12,cinnamon:7,pickup:10,
 terrain:26,mechanism:19,fox:20,scenery:24,enemy:7,effect:18,interface:23};

test('all 194 real images are routed exactly once into twelve real game contexts',()=>{
 const entries=validateArtInventory(curation,manifest);
 assert.equal(entries.length,194);assert.equal(new Set(entries.map(x=>x.id)).size,194);
 assert.deepEqual([...new Set(entries.map(x=>x.role))].sort(),[...ART_SLOTS].sort());
 const counts=Object.fromEntries(ART_SLOTS.map(slot=>[slot,entries.filter(x=>x.role===slot).length]));
 assert.deepEqual(counts,expected);
 for(const entry of entries){
  assert.equal(roleForId(entry.id),entry.role);
  assert.match(entry.path,/^assets\/(?:production|level1)\//,'Both physically verified source namespaces are valid');
  assert.match(entry.sha256,/^[a-f0-9]{64}$/);
  assert.ok(entry.reason.length>=15);
  assert.equal(entry.blocked,curation.entries[entry.id].structuralIssues.length>0);
 }
 assert.equal(entries.filter(x=>x.blocked).length,24);
 assert.equal(entries.filter(x=>!x.blocked).length,170);
});

test('each game context has a reachable Canvas draw path, never a source-as-physics mutation',()=>{
 const scene=fs.readFileSync('src/game/art-scene.mjs','utf8');
 const renderer=fs.readFileSync('src/game/render.mjs','utf8');
 for(const role of ART_SLOTS)
  assert.ok(scene.includes('roles.'+role),'Missing game renderer for '+role);
 for(const phase of ['backdrop','world','actors','birthday','hud'])
  assert.ok(renderer.includes("paintArtOverrides(ctx,s,audition,'"+phase+"')"),
   'Missing actual Canvas hook for '+phase);
 assert.ok(!scene.includes('state.level.platforms.push('));
 assert.ok(!scene.includes('state.player.x='));
});

test('the source registry refuses fabricated IDs, SHA tampering and duplicate source paths',()=>{
 const wrong=structuredClone(curation);wrong.entries['FOX-05'].sha256='a'.repeat(64);
 assert.throws(()=>validateArtInventory(wrong,manifest),/Unsafe or inconsistent/);
 const lost=structuredClone(manifest);delete lost.assets['FOX-05'];
 assert.throws(()=>validateArtInventory(curation,lost),/source.*incomplete|ID count drift/i);
 const poisoned=structuredClone(manifest);poisoned.assets['FOX-05'].path='../private.png';
 const alternate=structuredClone(curation);alternate.entries['FOX-05'].sourcePath='../private.png';
 assert.throws(()=>validateArtInventory(alternate,poisoned),/Unsafe or inconsistent/);
});

test('lazy source loader verifies original bytes, caches on demand, and refuses altered art',async()=>{
 const entries=validateArtInventory(curation,manifest);
 const byId=new Map(entries.map(x=>[x.id,x]));
 const called=[];
 const originalCreate=globalThis.createImageBitmap;
 const object=(id,bad=false)=>{
  const source=byId.get(id),body=Buffer.from(fs.readFileSync(source.path));
  if(bad)body[body.length-2]^=0xff;
  return {ok:true,arrayBuffer:async()=>body.buffer.slice(body.byteOffset,body.byteOffset+body.byteLength)};
 };
 const bad=new Set();
 const fakeRequest=async url=>{
  called.push(url);
  if(url==='assets/production/curation.json')return {ok:true,json:async()=>curation};
  if(url==='assets/production/manifest.json')return {ok:true,json:async()=>manifest};
  const source=entries.find(x=>x.path===url);
  if(!source)return {ok:false,status:404};
  return object(source.id,bad.has(source.id));
 };
 let closed=0;
 globalThis.createImageBitmap=async blob=>{
  const bytes=Buffer.from(await blob.arrayBuffer()),png=PNG.sync.read(bytes,{checkCRC:true});
  return {width:png.width,height:png.height,close(){closed++}};
 };
 const runtime=new ArtRuntime({request:fakeRequest,maxCachedPixels:100000});
 try{
  await runtime.initialize();
  assert.equal(runtime.inventory.length,194);
  assert.equal(runtime.diagnostics().loaded,0);
  assert.equal(called.filter(x=>x.endsWith('.png')).length,0,'Catalog load must be lazy');
  const image=await runtime.load('CO-03');
  assert.equal(image.width,64);
  assert.equal(runtime.diagnostics().loaded,1);
  await runtime.select('CO-03');
  assert.equal(runtime.active().pickup.id,'CO-03');
  await runtime.select('PK-01');
  assert.equal(runtime.active().pickup.id,'PK-01');
  assert.equal(runtime.diagnostics().selected.pickup,'PK-01');
  bad.add('BD-01');
  await assert.rejects(runtime.load('BD-01'),/checksum/);
  assert.equal(runtime.active().birthday,undefined);
  assert.ok(runtime.failures.has('BD-01'));
  assert.equal(runtime.diagnostics().available,194);
 }finally{runtime.dispose();globalThis.createImageBitmap=originalCreate}
 assert.ok(closed>0);
});


test('contract-invalid images cannot cover live hazards, and boss FX cannot hide mandatory warnings',()=>{
 const scene=fs.readFileSync('src/game/art-scene.mjs','utf8');
 const director=fs.readFileSync('src/game/art-director.mjs','utf8');
 const main=fs.readFileSync('src/main.mjs','utf8');
 assert.ok(!scene.includes('framedCandidate('),
  'Alpha-invalid source card must never be rendered over the game playfield');
 assert.ok(!scene.includes("roles.birthday&&!roles.birthday.blocked&&state.mode!=='victory'"),
  'Finale preview should not cover hazards mid-game');
 assert.ok(scene.includes('! ATTACK INCOMING'));
 assert.ok(scene.includes('STUNNED · SAFE TO HIT'));
 assert.ok(director.includes('QA inspection stage only'));
 assert.ok(main.includes('if(!event.persisted)director.dispose()'),
  'Restoring a page from bfcache must not destroy the Asset Director DOM');
});
