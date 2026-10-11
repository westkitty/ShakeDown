import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cli=path.join(root,'scripts/batch-intake.mjs');
function png(width,height,transparent){
 const p=new PNG({width,height});
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const i=(y*width+x)*4;
  p.data[i]=78;p.data[i+1]=131;p.data[i+2]=177;
  p.data[i+3]=transparent&&x<4?0:255;
 }
 return PNG.sync.write(p);
}
function run(cwd,...args){
 return spawnSync(process.execPath,[cli,...args],{cwd,encoding:'utf8',maxBuffer:8*1024*1024});
}
test('batch intake reports real 220/21 contract, never approves, refuses ambiguous and corrupt art',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'shakedown-bulk-'));
 try{
  const incoming=path.join(temp,'incoming');
  fs.mkdirSync(incoming);fs.mkdirSync(path.join(temp,'docs/assets'),{recursive:true});
  fs.mkdirSync(path.join(temp,'assets/runtime'),{recursive:true});
  const master=JSON.parse(fs.readFileSync(path.join(root,'docs/assets/ShakeDown_Complete_Asset_Contract.json')));
  fs.writeFileSync(path.join(temp,'docs/assets/ShakeDown_Complete_Asset_Contract.json'),JSON.stringify(master));
  fs.writeFileSync(path.join(temp,'assets/runtime/manifest.json'),
    JSON.stringify({schemaVersion:1,assets:{},audio:{}}));
  const bg=path.join(incoming,'BG-01__sky.png'),cup=path.join(incoming,'CO-03__cup.png');
  fs.writeFileSync(bg,png(960,540,false));
  fs.writeFileSync(cup,png(64,96,true));
  fs.writeFileSync(path.join(incoming,'FOX-01__wrong.png'),png(20,20,false));
  fs.writeFileSync(path.join(incoming,'AU-01__fake.wav'),Buffer.from('RIFFbad!WAVE'));
  fs.writeFileSync(path.join(incoming,'UNLISTED-01.png'),png(16,16,false));
  fs.writeFileSync(path.join(incoming,'instructions.zip'),Buffer.from('not-an-archive'));
  fs.symlinkSync(bg,path.join(incoming,'pointer.png'));
  let resp=run(temp,'--dir',incoming);
  assert.equal(resp.status,0,resp.stderr);
  let report=JSON.parse(resp.stdout);
  assert.equal(report.action,'report-only');
  assert.equal(report.contract.visual,220);
  assert.equal(report.contract.audio,21);
  assert.equal(report.contract.knownSource,26);
  assert.equal(report.contract.stillAwaitingApproval,215);
  assert.equal(report.counts['structurally-valid'],2);
  assert.ok(report.counts.rejected>=3);
  assert.equal(report.counts.unmapped,1);
  assert.equal(report.counts.ignored,1);
  assert.equal(fs.existsSync(path.join(temp,'.asset-staging')),false,'Dry-run must not create staging');
  let staged=run(temp,'--dir',incoming,'--stage');
  assert.equal(staged.status,0,staged.stderr);
  report=JSON.parse(staged.stdout);
  assert.equal(report.counts['staged-awaiting-human-review'],2);
  for(const row of report.results.filter(x=>x.status==='staged-awaiting-human-review')){
   assert.ok(row.stagePath.startsWith('.asset-staging/'+row.id+'/'));
   assert.ok(fs.existsSync(path.join(temp,row.stagePath)));
   assert.equal(row.stagePath.includes(row.sha256),true);
  }
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(temp,'assets/runtime/manifest.json'))).assets,{},
   'Bulk command MUST NOT mark source files as approved or activated');
  const duplicate=path.join(incoming,'CO-03__duplicate.png');
  fs.writeFileSync(duplicate,png(64,96,true));
  resp=run(temp,'--dir',incoming,'--stage');
  assert.equal(resp.status,0,resp.stderr);
  report=JSON.parse(resp.stdout);
  assert.equal(report.results.filter(x=>x.id==='CO-03'&&x.status==='duplicate').length,2);
  assert.equal(report.results.filter(x=>x.id==='CO-03'&&x.status==='staged-awaiting-human-review').length,0);
  assert.ok(report.results.some(x=>x.file==='pointer.png'&&x.status==='rejected'));
  const destination=path.join(temp,'report.json');
  resp=run(temp,'--dir',incoming,'--output',destination);
  assert.equal(resp.status,0,resp.stderr);
  assert.ok(fs.existsSync(destination));
  const noOverwrite=run(temp,'--dir',incoming,'--output',destination);
  assert.notEqual(noOverwrite.status,0,'Existing reports must not be overwritten silently');
 }finally{fs.rmSync(temp,{recursive:true,force:true})}
});
