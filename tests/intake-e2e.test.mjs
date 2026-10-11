import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(project,'scripts/asset-intake.mjs');
function command(cwd,...args){
 return spawnSync(process.execPath,[cli,...args],{cwd,encoding:'utf8'});
}
test('isolated intake fixture: inspect, stage, accept, validate and prevent overwrite',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shakedown-intake-test-'));
 try{
  fs.mkdirSync(path.join(temp,'docs/assets'),{recursive:true});
  fs.mkdirSync(path.join(temp,'assets/runtime'),{recursive:true});
  fs.copyFileSync(path.join(project,'docs/assets/ShakeDown_Complete_Asset_Contract.json'),
   path.join(temp,'docs/assets/ShakeDown_Complete_Asset_Contract.json'));
  fs.writeFileSync(path.join(temp,'assets/runtime/manifest.json'),
   JSON.stringify({schemaVersion:1,assets:{},audio:{}}));
  const source=path.join(temp,'qa-fixture.png'),png=new PNG({width:960,height:540});
  for(let n=0;n<png.data.length;n+=4){png.data[n]=60;png.data[n+1]=100;png.data[n+2]=175;png.data[n+3]=255;}
  fs.writeFileSync(source,PNG.sync.write(png));
  const inspected=command(temp,'inspect','--id','BG-01','--file',source);
  assert.equal(inspected.status,0,inspected.stderr);
  const staged=command(temp,'stage','--id','BG-01','--file',source);
  assert.equal(staged.status,0,staged.stderr);
  const stagedPath=JSON.parse(staged.stdout).stagedPath;
  // Synthetic fixture-only approval tests the mechanics, NOT human artistic approval.
  const approved=command(temp,'approve','--id','BG-01','--file',stagedPath,
   '--reviewer','QA_FIXTURE_ONLY','--visual-approved');
  assert.equal(approved.status,0,approved.stderr);
  const repeated=command(temp,'approve','--id','BG-01','--file',stagedPath,
   '--reviewer','QA_FIXTURE_ONLY','--visual-approved');
  assert.notEqual(repeated.status,0,'An accepted checkpoint must never be overwritten');
  const valid=command(temp,'validate');
  assert.equal(valid.status,0,valid.stderr);
  assert.equal(JSON.parse(valid.stdout).imageCount,1);
  const ledger=JSON.parse(fs.readFileSync(path.join(temp,'assets/runtime/manifest.json')));
  assert.equal(ledger.assets['BG-01'].integrationStatus,'unverified');
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
