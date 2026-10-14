#!/usr/bin/env node
// Static release rehearsal. Read-only: no deploy, merge, tag, or rollback action.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const ROOT=process.cwd();
const missing=[],warnings=[],entries=new Map();
const PNG_SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
function pngMeta(data){
 if(data.length<26||!data.subarray(0,8).equals(PNG_SIGNATURE))throw Error('not a PNG');
 return {width:data.readUInt32BE(16),height:data.readUInt32BE(20),bitDepth:data[24],colorType:data[25]};
}
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
 // Installed iPhone/Android home-screen entrypoint is a real static dependency,
 // not an optional screenshot: fingerprint and validate every required icon.
 include('manifest.webmanifest');
 try{
  const appManifest=JSON.parse(fs.readFileSync(rel('manifest.webmanifest'),'utf8'));
  const expected=[
   ['assets/app/shakedown-icon-192.png',192],
   ['assets/app/shakedown-icon-512.png',512]
  ];
  if(appManifest.id!=='./'||appManifest.scope!=='./'||
     appManifest.start_url!=='./'||appManifest.display!=='standalone'||
     !Array.isArray(appManifest.icons)||appManifest.icons.length!==expected.length)
   throw Error('Standalone app manifest shape/launch scope invalid');
  for(let i=0;i<expected.length;i++){
   const [expectedPath,size]=expected[i],entry=appManifest.icons[i];
   if(entry?.src!==expectedPath||entry.sizes!==size+'x'+size||
      entry.type!=='image/png'||entry.purpose!=='any')
    throw Error('Unexpected home-screen icon record '+i);
   include(expectedPath);
   const content=fs.readFileSync(rel(expectedPath));
   const meta=pngMeta(content);
   if(meta.width!==size||meta.height!==size||meta.bitDepth!==8||meta.colorType!==2)
    throw Error('Invalid home-screen icon '+expectedPath);
  }
  const html=fs.readFileSync(rel('index.html'),'utf8');
  if(!html.includes('<link rel="manifest" href="manifest.webmanifest">')||
     !html.includes('<meta name="apple-mobile-web-app-capable" content="yes">'))
   throw Error('Installed app metadata is missing from the root HTML');
 }catch(error){
  missing.push({path:'manifest.webmanifest',error:'Home-screen bundle: '+error.message});
 }

 // Complete-game PWA: this SHA inventory must account for *every* game
 // asset, intro/brand video, recorded track, workshop asset and code module.
 // Deploy cannot pass with a missing or stale offline manifest/media byte.
 include('service-worker.js');
 include('offline-assets.json');
 try{
  const pack=JSON.parse(fs.readFileSync(rel('offline-assets.json'),'utf8'));
  const worker=fs.readFileSync(rel('service-worker.js'),'utf8');
  if(pack.schema!==2||!/^\d{4}\.\d{2}\.\d{2}\.\d+$/.test(pack.version)||
     !worker.includes("const REV='"+pack.version+"'")||
     !Array.isArray(pack.core)||!Array.isArray(pack.game)||
     pack.core.length<25||pack.game.length<290)
   throw Error('Offline worker version, schema or complete-game file count invalid');
  const seen=new Set();
  let totalBytes=0;
  for(const file of [...pack.core,...pack.game]){
   const name=file?.path;
   if(typeof name!=='string'||!name.length||name.startsWith('/')||
      name.split('/').some(x=>!x||x==='.'||x==='..')||
      !/^[a-zA-Z0-9_./-]+$/.test(name)||seen.has(name)||
      !Number.isSafeInteger(file.bytes)||file.bytes<=0||
      !/^[0-9a-f]{64}$/.test(file.sha256))
    throw Error('Invalid or duplicate full-game inventory path: '+String(name));
   seen.add(name);totalBytes+=file.bytes;
   include(name);
   const actual=entries.get(name);
   if(!actual||actual.bytes!==file.bytes||actual.sha256!==file.sha256)
    missing.push({path:name,error:'Complete-game offline byte count or SHA-256 drift'});
  }
  const counts=pack.totals;
  if(counts?.coreFiles!==pack.core.length||counts?.gameFiles!==pack.game.length||
     counts?.allFiles!==seen.size||counts?.allBytes!==totalBytes||
     counts?.gameBytes!==pack.game.reduce((sum,f)=>sum+f.bytes,0))
   throw Error('Full offline inventory totals do not match physical bytes');
  for(const required of [
   'src/main.mjs','assets/branding/stinky-weasel-brand.mp4',
   'assets/intro/cinnamon-title-alpha.webm','assets/intro/cinnamon-title.mp4',
   'assets/audio/music/campus-untitled.mp3',
   'assets/audio/music/fox-boss.mp3','tools/asset-review.html',
   'tools/asset-gallery.html','assets/title/title_01_dawn-quad-hero.png',
   'assets/screens/03_victory_credits_1920x1080.png'
  ])if(!seen.has(required))throw Error('Offline inventory omitted '+required);
  const visit=directory=>{
   const discovered=[];
   for(const item of fs.readdirSync(rel(directory),{withFileTypes:true})){
    const key=path.posix.join(directory,item.name);
    if(item.isDirectory())discovered.push(...visit(key));
    else if(item.isFile())discovered.push(key);
   }
   return discovered;
  };
  for(const directory of ['assets','tools']){
   for(const item of visit(directory))
    if(!seen.has(item))missing.push({path:item,error:'Full-game PWA forgot a physical '+directory+' file'});
  }
 }catch(error){
  missing.push({path:'offline-assets.json',error:'Complete game PWA contract: '+error.message});
 }

 include('assets/sprites/cinnamon/frames.json');
 include('assets/audio/music/manifest.json');
 for(const npc of ['smudge','dexter']){
  const manifestPath=`assets/sprites/${npc}/frames.json`;include(manifestPath);
  try{
   const manifest=JSON.parse(fs.readFileSync(rel(manifestPath),'utf8'));
   const expected=Array.from({length:4},(_,i)=>'idle_'+String(i).padStart(2,'0'));
   if(manifest.schema!==1||manifest.subject!==npc||
      !manifest.source||Object.keys(manifest.frames||{}).length!==4||
      expected.some(id=>!manifest.frames[id]))
    throw Error('manifest shape invalid');
   const records=[['source',{...manifest.source,file:manifest.source.path},960,640],
    ...expected.map(id=>[id,manifest.frames[id],280,200])];
   for(const [id,item,width,height] of records){
    include(item.file);const actual=entries.get(item.file);
    if(!actual||actual.sha256!==item.sha256)throw Error(id+' SHA-256 mismatch');
    const meta=pngMeta(fs.readFileSync(rel(item.file)));
    if(meta.width!==width||meta.height!==height||meta.bitDepth!==8||meta.colorType!==6)
     throw Error(id+' must be '+width+'x'+height+' 8-bit RGBA');
   }
  }catch(error){missing.push({path:manifestPath,error:error.message})}
 }
 // Intro source-image and keyed-title byte contract. This is technical
 // integrity, not an extension or fabrication of the P019 art-approval ledger.
 include('assets/intro/manifest.json');
 try{
  const intro=JSON.parse(fs.readFileSync(rel('assets/intro/manifest.json'),'utf8'));
  if(intro.schema!==1||intro.panels?.length!==3||intro.video?.length!==3)
   throw Error('expected exactly three story cards and three title video assets');
  if(intro.background!=='assets/level1/backgrounds/bg_05_golden_dome_hero_backdrop.png')
   throw Error('unreviewed title background mapping');
  include(intro.background);
  for(const asset of [...intro.panels,...intro.video]){
   if(!(asset.path.startsWith('assets/intro/')&&/^[a-z0-9_-]+[.](webp|webm|mp4)$/.test(asset.path.slice('assets/intro/'.length)))||
      !/^[0-9a-f]{64}$/.test(asset.sha256))
    throw Error('unsafe intro manifest asset');
   include(asset.path);
   const actual=entries.get(asset.path);
   if(!actual||actual.sha256!==asset.sha256)
    missing.push({path:asset.path,error:'Intro SHA-256 mismatch'});
   if(!actual)continue;
   const data=fs.readFileSync(rel(asset.path));
   if(asset.path.endsWith('.webp')&&
     !(data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP'))
    missing.push({path:asset.path,error:'Invalid WebP header'});
   if(asset.path.endsWith('.webm')&&data.subarray(0,4).toString('hex')!=='1a45dfa3')
    missing.push({path:asset.path,error:'Invalid WebM header'});
   if(asset.path.endsWith('.mp4')&&data.toString('ascii',4,8)!=='ftyp')
    missing.push({path:asset.path,error:'Invalid MP4 header'});
  }
 }catch(error){missing.push({path:'assets/intro/manifest.json',error:error.message})}
 // The user-supplied pretitle ident has a separate byte and container-format
 // gate; this does not change any gameplay sprite approvals or music contracts.
 include('assets/branding/manifest.json');
 try{
  const brand=JSON.parse(fs.readFileSync(rel('assets/branding/manifest.json'),'utf8'));
  if(brand.schema!==1||brand.kind!=='pretitle-branding'||
    brand.runtime?.order!=='pretitle > animated game title > three October Shamrock Shake panels > gameplay')
   throw Error('branding manifest contract invalid');
  for(const asset of [brand.video,brand.poster]){
   if(!asset||!asset.path?.startsWith('assets/branding/')||
     !/^[a-z0-9_-]+[.](mp4|webp)$/.test(asset.path.slice('assets/branding/'.length))||
     !/^[0-9a-f]{64}$/.test(asset.sha256))
    throw Error('unsafe branding asset path or digest');
   include(asset.path);
   const actual=entries.get(asset.path);
   if(!actual||actual.sha256!==asset.sha256||actual.bytes!==asset.bytes)
    missing.push({path:asset.path,error:'Branding byte count or SHA-256 mismatch'});
   if(!actual)continue;
   const data=fs.readFileSync(rel(asset.path));
   if(asset.path.endsWith('.mp4')&&data.toString('ascii',4,8)!=='ftyp')
    missing.push({path:asset.path,error:'Invalid branding MP4 header'});
   if(asset.path.endsWith('.webp')&&
     !(data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP'))
    missing.push({path:asset.path,error:'Invalid branding WebP header'});
  }
  if(brand.video?.width!==1280||brand.video?.height!==720||
     !(brand.video?.durationSeconds>=7.9&&brand.video?.durationSeconds<=8.2)||
     brand.runtime?.autoplayMuted!==true||brand.runtime?.soundRequiresGesture!==true)
   missing.push({path:'assets/branding/manifest.json',error:'Branding timing or autoplay contract invalid'});
 }catch(error){missing.push({path:'assets/branding/manifest.json',error:error.message})}
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
