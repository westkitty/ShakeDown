import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'scripts/release-preflight.mjs');
function invoke(cwd){
 return spawnSync(process.execPath,[cli],{cwd,encoding:'utf8',maxBuffer:8*1024*1024});
}
test('offline static rehearsal fingerprints only real reachable runtime bytes',()=>{
 const first=invoke(root),second=invoke(root);
 assert.equal(first.status,0,first.stderr);
 assert.equal(second.status,0,second.stderr);
 const a=JSON.parse(first.stdout),b=JSON.parse(second.stdout);
 assert.equal(a.ok,true);
 assert.equal(a.missing.length,0);
 assert.equal(a.contract.visual,220);
 assert.equal(a.contract.audio,21);
 assert.equal(a.contract.recordedMusicFiles,6);
 assert.equal(a.contract.recordedMusicRoles,3);
 assert.equal(a.contract.existingSources,26);
 assert.ok(a.artifact.fileCount>=35);
 assert.equal(a.artifact.manifestSha256,b.artifact.manifestSha256,'Identical runtime files must produce identical hash');
 assert.ok(a.files.some(f=>f.path==='index.html'));
 assert.ok(a.files.some(f=>f.path==='src/game/engine.mjs'));
 assert.ok(a.files.some(f=>f.path==='src/game/audio.mjs'));
 assert.ok(a.files.some(f=>f.path==='assets/audio/music/manifest.json'));
 assert.equal(a.files.filter(f=>f.path.endsWith('.mp3')).length,6);
 assert.ok(a.files.every(f=>/^[0-9a-f]{64}$/.test(f.sha256)));
});
test('release rehearsal refuses deployment when an imported module is missing',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shakedown-release-fixture-'));
 try{
  for(const rel of ['src','tools','assets/sprites/cinnamon','assets/sprites/smudge',
   'assets/sprites/dexter','assets/production','assets/level1','assets/audio','assets/intro']){
   fs.cpSync(path.join(root,rel),path.join(temp,rel),{recursive:true});
  }
  fs.mkdirSync(path.join(temp,'assets/runtime'),{recursive:true});
  fs.mkdirSync(path.join(temp,'docs/assets'),{recursive:true});
  for(const rel of ['index.html','package.json','assets/runtime/manifest.json',
   'docs/assets/ShakeDown_Complete_Asset_Contract.json']){
   fs.copyFileSync(path.join(root,rel),path.join(temp,rel));
  }
  // src/styles.css is already copied by the whole src tree.
  let check=invoke(temp);
  assert.equal(check.status,0,check.stderr);
  fs.unlinkSync(path.join(temp,'src/game/engine.mjs'));
  check=invoke(temp);
  assert.equal(check.status,2,check.stderr);
  const report=JSON.parse(check.stdout);
  assert.equal(report.ok,false);
  assert.ok(report.missing.some(f=>f.path==='src/game/engine.mjs'));
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
