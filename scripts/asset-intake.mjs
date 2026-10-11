// ShakeDown asset acceptance: specified -> generated -> verified -> reviewed -> runtime.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { RENDER_ASSET_IDS } from '../src/game/production-assets.mjs';

const ROOT=process.cwd();
const CONTRACT=path.join(ROOT,'docs/assets/ShakeDown_Complete_Asset_Contract.json');
const LEDGER=path.join(ROOT,'assets/runtime/manifest.json');
const STAGING=path.join(ROOT,'.asset-staging');
const QA_DIR=path.join(ROOT,'docs/assets/qa');
const MAX_IMAGE_BYTES=25*1024*1024;
const MAX_AUDIO_BYTES=50*1024*1024;

export function sha256(data){return createHash('sha256').update(data).digest('hex')}
export function safeRepoPath(name){
 if(typeof name!=='string'||!name||path.isAbsolute(name)||name.includes('\\'))throw Error('Invalid relative asset path');
 const resolved=path.resolve(ROOT,name);
 if(!resolved.startsWith(ROOT+path.sep))throw Error('Asset path leaves project');
 return resolved;
}
export function examinePng(data,contract){
 const issues=[],warnings=[];
 if(data.length>MAX_IMAGE_BYTES){issues.push('Image exceeds 25MiB intake limit');return {issues,warnings};}
 let png;
 try{png=PNG.sync.read(data,{checkCRC:true})}catch(e){return {issues:['PNG decode failed: '+e.message],warnings}};
 const {width,height}=png;
 if(width>4096||height>4096||width*height>16777216)issues.push('Image exceeds size safety budget');
 const exp=contract.target_px;
 if(width!==exp[0]||height!==exp[1])issues.push('Wrong dimensions: '+width+'x'+height+' versus '+exp.join('x')+' required');
 let minX=width,minY=height,maxX=-1,maxY=-1,clear=0,semi=0,visible=0,edge=false;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const alpha=png.data[(y*width+x)*4+3];
  if(alpha===0){clear++;continue;}
  if(alpha<255)semi++;
  visible++;
  minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
  if(x===0||y===0||x===width-1||y===height-1)edge=true;
 }
 if(!visible)issues.push('Image is fully transparent');
 if(contract.transparent&&!clear&&!semi)issues.push('Transparent asset has no transparent pixels');
 if(!contract.transparent&&(clear||semi))issues.push('Opaque asset includes transparent pixels');
 if(contract.transparent&&edge)warnings.push('Visible pixels touch source edge: manually inspect for clipping');
 const bounds=visible?[minX,minY,maxX+1,maxY+1]:null;
 return {width,height,visiblePixels:visible,clearPixels:clear,semiTransparentPixels:semi,bounds,edgeTouch:edge,issues,warnings};
}
export function examineAudio(data,ext){
 const issues=[],warnings=['Audio loudness and seamless-loop playback require human listening; bytes alone cannot prove either'];
 if(data.length<44)issues.push('Audio file too short');
 if(data.length>MAX_AUDIO_BYTES)issues.push('Audio exceeds 50MiB intake limit');
 const kind=ext.toLowerCase();
 const signature=data.subarray(0,4).toString('ascii');
 let sampleRate=null,channels=null,durationSec=null;
 if(kind==='.wav'){
  if(signature!=='RIFF'||data.subarray(8,12).toString('ascii')!=='WAVE')issues.push('Invalid RIFF/WAVE signature');
  else{
   let bytesPerSec=0,pcmBytes=0;
   for(let off=12;off+8<=data.length;){
    const id=data.toString('ascii',off,off+4),len=data.readUInt32LE(off+4),end=off+8+len;
    if(end>data.length){issues.push('Truncated WAV chunk');break}
    if(id==='fmt '&&len>=16){
     channels=data.readUInt16LE(off+10);sampleRate=data.readUInt32LE(off+12);bytesPerSec=data.readUInt32LE(off+16);
    }
    if(id==='data')pcmBytes+=len;
    off=end+(len%2);
   }
   if(sampleRate<=0||channels<=0||bytesPerSec<=0||pcmBytes===0)issues.push('WAV missing valid audio format or samples');
   else durationSec=Number((pcmBytes/bytesPerSec).toFixed(3));
  }
 }else if(kind==='.ogg'){
  if(signature!=='OggS')issues.push('Invalid Ogg container signature');
  else warnings.push('Ogg codec, decoded loudness, and precise duration require playback QA');
 }else issues.push('Expected .wav or .ogg');
 return {channels,sampleRate,durationSec,issues,warnings};
}
function config(){
 const spec=JSON.parse(fs.readFileSync(CONTRACT,'utf8'));
 return {visual:new Map(spec.assets.map(a=>[a.id,a])),audio:new Map(spec.audio.map(a=>[a.id,a]))};
}
function targetFor(id,registry,ext){
 if(registry.visual.has(id)){
  const contract=registry.visual.get(id);
  if(contract.status.startsWith('VERIFIED'))throw Error('Existing canonical Cinnamon frame is immutable; use the existing source-derived pipeline');
  return {contract,type:'image',relPath:contract.path};
 }
 if(registry.audio.has(id))return {contract:registry.audio.get(id),type:'audio',relPath:'assets/production/audio/'+id.toLowerCase().replace(/[^a-z0-9-]/g,'_')+ext};
 throw Error('Unknown logical asset ID: '+id);
}
export function inspectFile(id,file,registry=config()){
 const data=fs.readFileSync(file),ext=path.extname(file).toLowerCase();
 const target=targetFor(id,registry,ext);
 const result=target.type==='image'
  ? ext==='.png'?examinePng(data,target.contract):{issues:['Only PNG is accepted for generated visual assets'],warnings:[]}
  : examineAudio(data,ext);
 return {id,type:target.type,target:target.relPath,hash:sha256(data),bytes:data.length,...result,pass:result.issues.length===0,
   visualReviewRequired:true,sourceName:path.basename(file)};
}
function readLedger(){
 if(!fs.existsSync(LEDGER))return {schemaVersion:1,assets:{},audio:{}};
 const data=JSON.parse(fs.readFileSync(LEDGER,'utf8'));
 if(data.schemaVersion!==1||typeof data.assets!=='object'||typeof data.audio!=='object')throw Error('Malformed runtime ledger');
 return data;
}
function atomicJson(dest,value){
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 const tmp=dest+'.tmp-'+process.pid;
 fs.writeFileSync(tmp,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
 fs.renameSync(tmp,dest);
}
function integrationEvidence(name){
 if(typeof name!=='string'||!/^docs\/assets\/qa\/[a-zA-Z0-9/_-]+\.png$/.test(name))
  throw Error('Evidence must be a PNG under docs/assets/qa, without spaces or traversal');
 const candidate=safeRepoPath(name);
 if(!fs.existsSync(candidate)||!fs.statSync(candidate).isFile()||fs.lstatSync(candidate).isSymbolicLink())
  throw Error('Integration screenshot missing or invalid: '+name);
 const actual=fs.realpathSync(candidate);
 if(!actual.startsWith(QA_DIR+path.sep))throw Error('Evidence file escapes QA directory');
 const contents=fs.readFileSync(candidate);
 if(contents.length<100||contents.length>12*1024*1024)throw Error('Evidence image exceeds screenshot budget');
 let image;
 try{image=PNG.sync.read(contents,{checkCRC:true})}
 catch(error){throw Error('Cannot decode integration screenshot: '+error.message)}
 if(image.width<640||image.height<360)throw Error('QA screenshot must be at least 640x360');
 return {path:name,sha256:sha256(contents),bytes:contents.length,width:image.width,height:image.height};
}
function validateLedger(){
 const ledger=readLedger(),registry=config(),results=[],active=[];
 for(const [type,entries] of [['image',ledger.assets],['audio',ledger.audio]]){
  for(const [id,entry] of Object.entries(entries)){
   const expected=targetFor(id,registry,path.extname(entry.path));
   if(expected.type!==type||expected.relPath!==entry.path)throw Error('Wrong manifest path/type: '+id);
   if(entry.reviewStatus!=='reviewer-attested'||!entry.reviewer||
       !['unverified','verified'].includes(entry.integrationStatus))throw Error('Unknown approval status: '+id);
   if(entry.integrationStatus==='verified'){
    if(type!=='image'||!RENDER_ASSET_IDS.includes(id))throw Error('Cannot activate unsupported asset: '+id);
    const ev=entry.integrationEvidence;
    if(!ev||typeof ev.reviewer!=='string'||!ev.reviewer.trim()||
      typeof ev.assetSha256!=='string'||ev.assetSha256!==entry.sha256||
      !ev.screenshot||!ev.verifiedAt)throw Error('Missing or mismatched integration evidence: '+id);
    const proof=integrationEvidence(ev.screenshot.path);
    if(proof.sha256!==ev.screenshot.sha256||proof.bytes!==ev.screenshot.bytes||
      proof.width!==ev.screenshot.width||proof.height!==ev.screenshot.height)
      throw Error('Integration screenshot changed after activation: '+id);
    active.push(id);
   }
   const file=safeRepoPath(entry.path);
   if(!fs.existsSync(file)||fs.lstatSync(file).isSymbolicLink())throw Error('Approved output missing or symlink: '+id);
   const report=inspectFile(id,file,registry);
   if(!report.pass||report.hash!==entry.sha256||report.bytes!==entry.bytes)throw Error('Approved asset invalid/stale: '+id+' '+report.issues.join(','));
   if(type==='image'&&(report.width!==entry.width||report.height!==entry.height))throw Error('Manifest dimensions stale: '+id);
   results.push(id);
  }
 }
 return {ok:true,reviewerAttested:results.length,activated:active.length,
  pendingIntegration:results.length-active.length,
  imageCount:Object.keys(ledger.assets).length,audioCount:Object.keys(ledger.audio).length,
  ids:results,activeIds:active};
}
function argumentsFor(argv){
 const [action,...rest]=argv,options={};
 for(let i=0;i<rest.length;i++){const key=rest[i];
  if(!key.startsWith('--'))throw Error('Unknown argument: '+key);
  if(key==='--visual-approved'){options.visualApproved=true;continue}
  options[key.slice(2)]=rest[++i];if(!options[key.slice(2)])throw Error('Missing value for '+key);
 }
 return {action,options};
}
function main(){
 const {action,options}=argumentsFor(process.argv.slice(2));
 if(action==='validate'){console.log(JSON.stringify(validateLedger(),null,2));return}
 if(!['inspect','stage','approve','activate'].includes(action))
  throw Error('Usage: asset-intake.mjs inspect|stage|approve --id ID --file FILE; or activate --id ID --reviewer NAME --qa-evidence docs/assets/qa/NAME.png --visual-approved');
 if(action==='activate'){
  if(!options.id||!options.reviewer?.trim()||!options.visualApproved||!options['qa-evidence'])
   throw Error('Activation needs --id, --reviewer, --qa-evidence and --visual-approved');
  const ledger=readLedger(),entry=ledger.assets[options.id],registry=config();
  if(!entry||entry.reviewStatus!=='reviewer-attested'||entry.integrationStatus!=='unverified')
   throw Error('Asset must be accepted and not already activated');
  if(!RENDER_ASSET_IDS.includes(options.id))throw Error('No verified renderer mapping for '+options.id);
  const source=safeRepoPath(entry.path);
  const report=inspectFile(options.id,source,registry);
  if(!report.pass||report.hash!==entry.sha256)throw Error('Approved art changed: '+options.id);
  const screenshot=integrationEvidence(options['qa-evidence']);
  // A physical screenshot hash is required, but a human must establish that it
  // really shows this asset correctly placed in the running game.
  entry.integrationStatus='verified';
  entry.integrationEvidence={reviewer:options.reviewer.trim(),assetSha256:entry.sha256,
    screenshot,verifiedAt:new Date().toISOString(),
    attestation:'Reviewer confirmed the named art in the running game with legible gameplay and preserved boss tells.'};
  atomicJson(LEDGER,ledger);
  console.log(JSON.stringify({activated:options.id,integrated:entry.integrationEvidence,
    notice:'Reviewer-attested integration; subsequent automated browser and live-site checks remain separate'},null,2));
  return;
 }
 if(!options.id||!options.file)throw Error('--id and --file are required');
 if(!fs.existsSync(options.file)||!fs.statSync(options.file).isFile())throw Error('Candidate file not found');
 const report=inspectFile(options.id,options.file);
 if(!report.pass){console.log(JSON.stringify(report,null,2));process.exitCode=2;return}
 if(action==='inspect'){console.log(JSON.stringify(report,null,2));return}
 const ext=path.extname(options.file).toLowerCase();
 if(action==='stage'){
  const dest=path.join(STAGING,options.id,report.hash+ext);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  if(!fs.existsSync(dest))fs.copyFileSync(options.file,dest,fs.constants.COPYFILE_EXCL);
  const entry={...report,stagedPath:path.relative(ROOT,dest),status:'awaiting-human-review'};
  const review=dest+'.json';
  if(!fs.existsSync(review))fs.writeFileSync(review,JSON.stringify(entry,null,2)+'\n',{flag:'wx'});
  console.log(JSON.stringify(entry,null,2));return;
 }
 const expectedDir=path.resolve(STAGING,options.id),real=fs.realpathSync(options.file);
 if(path.dirname(real)!==expectedDir)throw Error('Approve only an inspected/staged file under .asset-staging/ID');
 if(path.basename(real)!==report.hash+ext)throw Error('Staged file content changed');
 if(!fs.existsSync(real+'.json'))throw Error('Candidate provenance record missing');
 if(!options.reviewer?.trim()||!options.visualApproved)throw Error('Manual visual/audio review must be attested with --reviewer NAME --visual-approved');
 const ledger=readLedger();
 if(options.id.startsWith('FOX-')&&options.id!=='FOX-01'&&!ledger.assets['FOX-01'])throw Error('Approve Fox turnaround FOX-01 before final Fox sprite states');
 const dest=safeRepoPath(report.target);
 const records=report.type==='image'?ledger.assets:ledger.audio;
 if(records[options.id]||fs.existsSync(dest))throw Error('An approved asset already exists; do not overwrite accepted checkpoints');
 fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.copyFileSync(real,dest,fs.constants.COPYFILE_EXCL);
 const entry={path:report.target,sha256:report.hash,bytes:report.bytes,
  ...(report.type==='image'?{width:report.width,height:report.height,alphaPixels:report.clearPixels+report.semiTransparentPixels}:{}),
  reviewer:options.reviewer.trim(),reviewStatus:'reviewer-attested',integrationStatus:'unverified',
  sourceName:report.sourceName,sourceHash:report.hash,approvedAt:new Date().toISOString(),
  qaWarnings:report.warnings};
 records[options.id]=entry;
 try{atomicJson(LEDGER,ledger)}
 catch(error){fs.unlinkSync(dest);throw error}
 console.log(JSON.stringify({id:options.id,accepted:entry,notice:'Asset bytes accepted; in-browser integration and visual fidelity still need QA'},null,2));
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
 try{main()}catch(error){console.error('Asset intake rejected: '+error.message);process.exitCode=1}
}
