#!/usr/bin/env node
// Deterministic batch report for arriving LM Arena files.
// Default read-only. --stage copies structurally valid, unambiguous files to
// ignored .asset-staging via the existing single-file gate. NEVER approves art.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {inspectFile} from './asset-intake.mjs';
const SCRIPT=fileURLToPath(import.meta.url);
const ROOT=process.cwd();
const MAX_FILES=1000,MAX_DEPTH=9,MAX_BYTES=50*1024*1024;

function parse(argv){
 const opts={stage:false};
 for(let i=0;i<argv.length;i++){
  const key=argv[i];
  if(key==='--stage'){opts.stage=true;continue}
  if(['--dir','--output'].includes(key)&&i+1<argv.length){opts[key.slice(2)]=argv[++i];continue}
  throw Error('Usage: node scripts/batch-intake.mjs --dir /PATH/TO/GENERATED [--stage] [--output /PATH/TO/report.json]');
 }
 if(!opts.dir)throw Error('--dir required: supply an existing folder with received files');
 return opts;
}
function crawl(dir,depth=0,results=[]){
 if(depth>MAX_DEPTH)throw Error('Directory recursion depth exceeded');
 for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.name.startsWith('.')||entry.name.startsWith('._'))continue;
  const full=path.join(dir,entry.name);
  if(entry.isSymbolicLink())results.push({path:full,unsafe:'symlink not allowed'});
  else if(entry.isDirectory())crawl(full,depth+1,results);
  else if(entry.isFile())results.push({path:full});
  else results.push({path:full,unsafe:'unsupported filesystem object'});
  if(results.length>MAX_FILES)throw Error('Over 1000 candidate files: split batches to protect resources');
 }
 return results;
}
function contractRegistry(spec){
 const all=[...spec.assets.map(a=>({...a,type:'image'})),...spec.audio.map(a=>({...a,type:'audio'}))];
 const byId=new Map(all.map(a=>[a.id,a])),basename=new Map();
 for(const a of all){
  if(a.type!=='image')continue;
  const base=path.basename(a.path).toLowerCase();
  if(!basename.has(base))basename.set(base,[]);
  basename.get(base).push(a.id);
 }
 return {byId,basename,all};
}
function identify(file,registry){
 const name=path.basename(file);
 const matches=[];
 const id=/^([A-Za-z]{2,4}-\d{2,3})(?=($|[-_.\s]))/.exec(name);
 if(id)matches.push(id[1].toUpperCase());
 const known=registry.basename.get(name.toLowerCase())||[];
 matches.push(...known);
 const ids=[...new Set(matches)];
 return {id:ids.length===1?ids[0]:null,ambiguous:ids.length>1?ids:[],
   unknownPrefix:id&&!registry.byId.has(id[1].toUpperCase())?id[1].toUpperCase():null};
}
function main(){
 const opts=parse(process.argv.slice(2));
 const dir=path.resolve(opts.dir);
 if(!fs.existsSync(dir)||!fs.statSync(dir).isDirectory())throw Error('Incoming folder does not exist: '+dir);
 if(fs.lstatSync(dir).isSymbolicLink())throw Error('Intake directory itself cannot be a symlink');
 const spec=JSON.parse(fs.readFileSync('docs/assets/ShakeDown_Complete_Asset_Contract.json','utf8'));
 const runtime=JSON.parse(fs.readFileSync('assets/runtime/manifest.json','utf8'));
 if(!Array.isArray(spec.assets)||!Array.isArray(spec.audio)||runtime.schemaVersion!==1)
  throw Error('Invalid contract or current acceptance manifest');
 const registry=contractRegistry(spec);
 const files=crawl(dir);
 const results=[],ids=new Map(),hashes=new Map();
 for(const f of files){
  const relative=path.relative(dir,f.path);
  const row={file:relative,id:null,status:'unmapped',issues:[],warnings:[]};
  results.push(row);
  if(f.unsafe){row.status='rejected';row.issues.push(f.unsafe);continue}
  const ext=path.extname(f.path).toLowerCase();
  if(!['.png','.wav','.ogg'].includes(ext)){row.status='ignored';continue}
  const detected=identify(f.path,registry);
  if(detected.ambiguous.length){row.status='rejected';row.issues.push('Filename matches multiple contract IDs: '+detected.ambiguous.join(','));continue}
  if(!detected.id){row.status='unmapped';row.issues.push(detected.unknownPrefix?'Unknown contract ID '+detected.unknownPrefix:'No exact basename or leading ID matches the master');continue}
  row.id=detected.id;
  const req=registry.byId.get(row.id);
  if(!req){row.status='unmapped';row.issues.push('Unknown contract ID');continue}
  if(req.type==='image'&&ext!=='.png'||req.type==='audio'&&ext==='.png'){
   row.status='rejected';row.issues.push('Wrong format for '+row.id);continue;
  }
  if(String(req.status).startsWith('VERIFIED')){
   row.status='rejected';row.issues.push('Canonical source frame is immutable');continue;
  }
  const stat=fs.lstatSync(f.path);
  if(stat.size<=0||stat.size>MAX_BYTES){row.status='rejected';row.issues.push('Candidate has zero bytes or exceeds 50 MiB');continue}
  const accepted=(req.type==='audio'?runtime.audio:runtime.assets)[row.id];
  if(accepted){row.status='already-approved';row.issues.push('Already in approved runtime ledger; do not overwrite');continue}
  try{
   const report=inspectFile(row.id,f.path);
   row.sha256=report.hash;row.bytes=report.bytes;row.target=report.target;
   row.warnings=report.warnings;
   row.issues=report.issues;
   if(report.width!==undefined)row.dimensions=[report.width,report.height];
   row.status=report.pass?'structurally-valid':'rejected';
   if(!ids.has(row.id))ids.set(row.id,[]);
   ids.get(row.id).push(row);
   if(report.pass){
    if(!hashes.has(row.sha256))hashes.set(row.sha256,[]);
    hashes.get(row.sha256).push(row);
   }
  }catch(e){row.status='rejected';row.issues.push(e.message)}
 }
 for(const [id,items] of ids){
  if(items.length<=1)continue;
  for(const row of items){
   row.status='duplicate';row.issues.push('Multiple candidates for '+id+'; reviewer must choose the correct source');
  }
 }
 for(const [digest,items] of hashes){
  const separate=new Set(items.map(x=>x.id));
  if(separate.size<=1)continue;
  for(const row of items){row.status='duplicate';row.issues.push('Identical file SHA-256 used for multiple different IDs');}
 }
 if(opts.stage){
  for(const row of results.filter(x=>x.status==='structurally-valid')){
   const file=path.join(dir,row.file);
   const stage=spawnSync(process.execPath,[path.join(path.dirname(SCRIPT),'asset-intake.mjs'),
    'stage','--id',row.id,'--file',file],{cwd:ROOT,encoding:'utf8',maxBuffer:1024*1024});
   if(stage.status===0){
    try{row.stagePath=JSON.parse(stage.stdout).stagedPath;row.status='staged-awaiting-human-review'}
    catch{row.status='stage-failed';row.issues.push('Staging returned unparseable response')}
   }else{row.status='stage-failed';row.issues.push((stage.stderr||'staging command failed').slice(0,350))}
  }
 }
 const covered=new Set([...Object.keys(runtime.assets),...Object.keys(runtime.audio),
   ...spec.assets.filter(x=>String(x.status).startsWith('VERIFIED')).map(x=>x.id)]);
 const pending=registry.all.filter(x=>!covered.has(x.id));
 const counts={};
 for(const row of results)counts[row.status]=(counts[row.status]||0)+1;
 const report={
  schemaVersion:1,action:opts.stage?'staged-candidates':'report-only',
  intakeDirectory:dir,filesScanned:files.length,
  contract:{visual:spec.assets.length,audio:spec.audio.length,knownSource:
   spec.assets.filter(x=>String(x.status).startsWith('VERIFIED')).length,
   approvedExternal:Object.keys(runtime.assets).length+Object.keys(runtime.audio).length,
   stillAwaitingApproval:pending.length},
  counts,pendingIds:pending.map(x=>x.id),results
 };
 if(opts.output){
  const target=path.resolve(opts.output);
  if(target===path.resolve('assets/runtime/manifest.json')||
    target===path.resolve('docs/assets/ShakeDown_Complete_Asset_Contract.json'))
   throw Error('Cannot overwrite approved runtime or master asset contracts with a report');
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 }
 console.log(JSON.stringify(report,null,2));
 if(results.some(x=>['stage-failed'].includes(x.status)))process.exitCode=2;
}
try{main()}catch(e){console.error('Batch intake rejected: '+e.message);process.exitCode=1}
