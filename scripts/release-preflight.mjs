#!/usr/bin/env node
// Static release rehearsal. Read-only: no deploy, merge, tag, or rollback action.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const ROOT=process.cwd();
const missing=[],warnings=[],entries=new Map();
function rel(p){const x=path.resolve(ROOT,p);if(!x.startsWith(ROOT+path.sep))throw Error('Unsafe runtime path '+p);return x}
function include(file){
 try{
  const full=rel(file),stat=fs.lstatSync(full);
  if(!stat.isFile()||stat.isSymbolicLink())throw Error('not a regular file');
  const data=fs.readFileSync(full),hash=createHash('sha256').update(data).digest('hex');
  entries.set(file,{path:file,bytes:data.length,sha256:hash});
 }catch(e){missing.push({path:file,error:e.message})}
}
function traceModule(file,seen=new Set()){
 if(seen.has(file))return;
 seen.add(file);include(file);
 const full=rel(file);if(!fs.existsSync(full))return;
 const data=fs.readFileSync(full,'utf8');
 // Simple static module graph. Dynamic imports without a fixed quoted specifier
 // would require a runtime packaging audit and are reported as a warning.
 if(/\bimport\s*\(/.test(data))warnings.push('Dynamic module import requires a manual URL check: '+file);
 const specs=[...data.matchAll(/\b(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)].map(m=>m[1]);
 for(const spec of specs){
  const target=path.posix.normalize(path.posix.join(path.posix.dirname(file),spec));
  if(!target.startsWith('src/')){warnings.push('Unexpected relative module path: '+spec);continue}
  if(!/\.(mjs|js)$/.test(target)){missing.push({path:target,error:'Static module extension not explicit'});continue}
  traceModule(target,seen);
 }
}
function git(args){
 try{return execFileSync('git',args,{cwd:ROOT,encoding:'utf8',timeout:10000}).trim()}
 catch{return null}
}
try{
 const pkg=JSON.parse(fs.readFileSync(rel('package.json'),'utf8'));
 const contract=JSON.parse(fs.readFileSync(rel('docs/assets/ShakeDown_Complete_Asset_Contract.json'),'utf8'));
 const runtime=JSON.parse(fs.readFileSync(rel('assets/runtime/manifest.json'),'utf8'));
 const music=JSON.parse(fs.readFileSync(rel('assets/audio/music/manifest.json'),'utf8'));
 const cinnamon=JSON.parse(fs.readFileSync(rel('assets/sprites/cinnamon/frames.json'),'utf8'));
 if(pkg.dependencies&&Object.keys(pkg.dependencies).length)warnings.push('Runtime package dependencies require bundling review');
 include('index.html');include('src/styles.css');include('assets/runtime/manifest.json');
 include('assets/sprites/cinnamon/frames.json');
 include('assets/audio/music/manifest.json');
 traceModule('src/main.mjs');
 // The optional curated demo must ship all physical, source-hash-verified PNGs.
 for(const f of ['tools/asset-gallery.html','tools/asset-gallery.css',
    'tools/asset-gallery.mjs','assets/production/curation.json',
    'assets/production/manifest.json'])include(f);
 const curation=JSON.parse(fs.readFileSync(rel('assets/production/curation.json'),'utf8'));
 const candidateData=JSON.parse(fs.readFileSync(rel('assets/production/manifest.json'),'utf8'));
 if(curation.schemaVersion!==1||curation.generatedCount!==194||
    candidateData.count!==194||Object.keys(candidateData.assets||{}).length!==194)
  missing.push({path:'assets/production/curation.json',error:'194-image art manifest inventory invalid'});
 for(const [id,record] of Object.entries(candidateData.assets||{})){
  const curated=curation.entries?.[id];
  if(!curated||record.path!==curated.sourcePath||record.sha256!==curated.sha256)
   missing.push({path:id,error:'Source/curator artifact digest or ID drift'});
  include(record.path);
  if(entries.get(record.path)?.sha256!==record.sha256)
   missing.push({path:record.path,error:'Physical PNG digest does not match its source manifest'});
 }
 const index=fs.readFileSync(rel('index.html'),'utf8');
 for(const m of index.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)){
  const url=m[1];if(url.startsWith('#')||url.startsWith('mailto:'))continue;
  if(/^https?:/i.test(url)){warnings.push('Remote dependency in HTML: '+url);continue}
  if(url==='src/main.mjs'||url==='src/styles.css')continue;
  include(url.split('?')[0]);
 }
 if(/https?:\/\/(?:fonts\.|cdnjs\.|unpkg\.|cdn\.)/i.test(index))
  warnings.push('External HTML resource could break offline serving');
 for(const [id,frame] of Object.entries(cinnamon.frames)){
  if(!frame.file){missing.push({path:'Cinnamon '+id,error:'missing filename'});continue}
  include(frame.file);
 }
 for(const record of [runtime.assets,runtime.audio]){
  for(const v of Object.values(record||{}))if(v?.path)include(v.path);
 }
 if(music.schemaVersion!==1||music.tracks?.length!==6)
  missing.push({path:'assets/audio/music/manifest.json',error:'Recorded soundtrack inventory invalid'});
 for(const track of music.tracks||[]){
  include(track.path);
  const actual=entries.get(track.path);
  if(actual?.sha256!==track.sha256||actual?.bytes!==track.bytes)
   missing.push({path:track.path,error:'Recorded soundtrack byte contract drift'});
 }
 for(const [id,record] of Object.entries(runtime.assets||{})){
  if(record?.integrationStatus==='verified'&&record.integrationEvidence?.screenshot?.path)
   include(record.integrationEvidence.screenshot.path);
 }
 if(contract.assets?.length!==220||contract.audio?.length!==21)
  warnings.push('LM Arena contract totals changed; reconcile with actively running generator');
 const branch=git(['branch','--show-current']),sha=git(['rev-parse','HEAD']);
 const dirty=(git(['status','--porcelain'])||'').length>0;
 if(dirty)warnings.push('Worktree is dirty; this result does not describe a frozen Git release commit');
 if(!sha)warnings.push('Git metadata unavailable; cannot identify release revision');
 const assets=[...entries.values()].sort((a,b)=>a.path.localeCompare(b.path));
 const digest=createHash('sha256').update(assets.map(a=>a.path+':'+a.sha256).join('\n')).digest('hex');
 const report={schemaVersion:1,ok:missing.length===0,
  scope:'static byte/reference inspection; NOT browser, audio, gameplay or deployed-release proof',
  git:{branch,sha,dirty},artifact:{fileCount:assets.length,totalBytes:assets.reduce((s,x)=>s+x.bytes,0),manifestSha256:digest},
  contract:{visual:contract.assets.length,audio:contract.audio.length,existingSources:Object.keys(cinnamon.frames).length,
    approvedExternal:Object.keys(runtime.assets||{}).length+Object.keys(runtime.audio||{}).length,
    recordedMusicFiles:music.tracks?.length||0,recordedMusicRoles:new Set((music.tracks||[]).map(t=>t.role)).size},
  missing,warnings,files:assets};
 console.log(JSON.stringify(report,null,2));
 if(missing.length)process.exitCode=2;
}catch(e){console.error('Release preflight could not validate static package: '+e.message);process.exitCode=1}
