import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prefix='/ShakeDown/';
test('public Pages SHA verifier checks all original offline assets and rejects a corrupted movie',async()=>{
 let damage=false;
 const server=http.createServer((req,res)=>{
  try{
   const pathname=new URL(req.url,'http://localhost').pathname;
   if(!pathname.startsWith(prefix)){res.writeHead(404).end();return}
   const relative=decodeURIComponent(pathname.slice(prefix.length));
   if(!relative||relative.startsWith('/')||
      relative.split('/').includes('..')||relative.includes('\\')){
    res.writeHead(403).end();return;
   }
   const filename=path.resolve(root,relative);
   if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return}
   if(damage&&relative==='assets/intro/cinnamon-title.mp4'){
    res.writeHead(200,{'Content-Type':'video/mp4'}).end('BROKEN-MOVIE');return;
   }
   const stat=fs.statSync(filename);
   if(!stat.isFile()){res.writeHead(404).end();return}
   res.writeHead(200,{'Content-Length':String(stat.size)});
   fs.createReadStream(filename).pipe(res);
  }catch(error){res.writeHead(error?.code==='ENOENT'?404:500).end()}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const uri='http://127.0.0.1:'+server.address().port+prefix;
 const verify=()=>new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['scripts/verify-hosted-pages.mjs'],{
   cwd:root,
   env:{...process.env,SHAKEDOWN_PAGES_ROOT:uri,SHAKEDOWN_PAGES_ATTEMPTS:'1',
    SHAKEDOWN_PAGES_RETRY_DELAY_MS:'0'},
   stdio:['ignore','pipe','pipe']
  });
  let stdout='',stderr='';
  const deadline=setTimeout(()=>{child.kill('SIGKILL');reject(Error('Hosted verifier hung'))},55000);
  child.stdout.on('data',d=>{stdout+=d.toString()});
  child.stderr.on('data',d=>{stderr+=d.toString()});
  child.on('error',error=>{clearTimeout(deadline);reject(error)});
  child.on('exit',code=>{clearTimeout(deadline);resolve({code,stdout,stderr})});
 });
 try{
  const expected=JSON.parse(fs.readFileSync(path.join(root,'offline-assets.json'),'utf8'));
  const complete=await verify();
  assert.equal(complete.code,0,complete.stderr);
  assert.match(complete.stdout,/Public Pages SHA-256 parity confirmed for all/);
  const match=/parity confirmed for all (\d+) authoritative/.exec(complete.stdout);
  assert.ok(match,'Must report compared public file count');
  assert.ok(Number(match[1])>=expected.totals.allFiles);
  damage=true;
  const corrupted=await verify();
  assert.notEqual(corrupted.code,0,'Corrupted published film must fail public-release attestation');
  assert.match(corrupted.stderr,/cinnamon-title\.mp4 does not match checkout SHA-256/);
 }finally{
  await new Promise(resolve=>server.close(resolve));
 }
},{timeout:130000});
