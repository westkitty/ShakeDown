#!/usr/bin/env node
// P019: read-only evidence about artwork actually shipped to the player.
// A valid PNG, screenshot, curation score or prose assertion is NEVER owner signoff.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {previewEntries,worldSceneEntries} from '../src/game/curated-assets.mjs';
import {TITLE_SCENES,RESULT_SCENES,titleScenePath} from '../src/game/screen-art.mjs';
const PNG=Buffer.from([137,80,78,71,13,10,26,10]);
const HASH=/^[0-9a-f]{64}$/;

export function source(root,relative,expectedHash=null,expectedSize=null){
 if(typeof relative!=='string'||!/^assets\/[a-zA-Z0-9/_-]+\.png$/.test(relative))
  throw Error('Untrusted art path: '+relative);
 const full=path.resolve(root,relative);
 if(!full.startsWith(path.resolve(root)+path.sep))throw Error('Art path escapes checkout: '+relative);
 const stat=fs.lstatSync(full);
 if(!stat.isFile()||stat.isSymbolicLink())throw Error('Art source is not a regular file: '+relative);
 const actual=fs.realpathSync(full),realRoot=fs.realpathSync(root);
 if(!actual.startsWith(realRoot+path.sep))throw Error('Art symlink path escapes checkout: '+relative);
 const bytes=fs.readFileSync(full);
 if(bytes.length<26||!bytes.subarray(0,8).equals(PNG))throw Error('Not a PNG: '+relative);
 const size=[bytes.readUInt32BE(16),bytes.readUInt32BE(20)];
 if(!size.every(n=>Number.isInteger(n)&&n>0&&n<=4096))throw Error('Unsafe PNG dimensions: '+relative);
 if(expectedSize&&(size[0]!==expectedSize[0]||size[1]!==expectedSize[1]))
  throw Error('PNG dimensions changed: '+relative);
 const sha256=createHash('sha256').update(bytes).digest('hex');
 if(expectedHash&&(!HASH.test(expectedHash)||sha256!==expectedHash))
  throw Error('PNG hash mismatch: '+relative);
 return {path:relative,sha256,width:size[0],height:size[1],bytes:bytes.length};
}
const readJson=(root,filename)=>JSON.parse(fs.readFileSync(path.resolve(root,filename),'utf8'));
function git(root,args){try{return execFileSync('git',args,{cwd:root,encoding:'utf8',timeout:4000}).trim()}catch{return null}}
export function auditArt(root=process.cwd()){
 const curation=readJson(root,'assets/production/curation.json');
 const manifest=readJson(root,'assets/production/manifest.json');
 const runtime=readJson(root,'assets/runtime/manifest.json');
 const legacy=readJson(root,'assets/production/approvals.json');
 const cinnamon=readJson(root,'assets/sprites/cinnamon/frames.json');
 const errors=[],records=[];
 if(curation.schemaVersion!==1||curation.generatedCount!==194||
    manifest.schema_version!==1||manifest.count!==194||
    Object.keys(manifest.assets||{}).length!==194||
    Object.keys(curation.entries||{}).length!==194)
  errors.push('Expected complete 194-image source and curator inventories');
 const previews=previewEntries(curation,manifest);
 const additional=worldSceneEntries(curation,manifest);
 const used=new Set();
 for(const [group,items] of [['preview',previews],['worldScene',additional]]){
  for(const [id,item] of items){
   if(used.has(id)){errors.push('Duplicate selected source: '+id);continue}
   used.add(id);
   const curator=curation.entries[id];
   try{
    const file=source(root,item.path,item.sha256,item.actual_px);
    records.push({id,group,name:item.name,role:item.group,
      file,verdict:curator.verdict,cropRisk:curator.cropRisk===true,
      finalHumanApproval:curator.finalHumanApproval===true,
      reviewStatus:item.review_status});
   }catch(error){errors.push(id+': '+error.message)}
  }
 }
 const counts={preview:0,alternate:0,revise:0,blocked:0};
 for(const item of Object.values(curation.entries||{})){
  if(Object.hasOwn(counts,item.verdict))counts[item.verdict]++;
 }
 const cinnamonFrames=[];
 for(const [id,frame] of Object.entries(cinnamon.frames||{})){
  try{cinnamonFrames.push({id,...source(root,frame.file,frame.sha256)});}
  catch(error){errors.push('Cinnamon '+id+': '+error.message)}
 }
 try{source(root,cinnamon.source,cinnamon.source_sha256)}
 catch(error){errors.push('Cinnamon source sheet: '+error.message)}
 const npc={};
 for(const id of ['smudge','dexter']){
  try{
   const data=readJson(root,'assets/sprites/'+id+'/frames.json');
   const frames=[];
   for(const [frameId,item] of Object.entries(data.frames||{}))
    frames.push({id:frameId,...source(root,item.file,item.sha256,[item.width,item.height])});
   source(root,data.source.path,data.source.sha256,[data.source.width,data.source.height]);
   if(frames.length!==4)throw Error('Expected 4 declared frames');
   npc[id]={verifiedFrames:frames.length,uniqueFrameHashes:new Set(frames.map(f=>f.sha256)).size};
  }catch(error){errors.push('NPC '+id+': '+error.message);npc[id]={verifiedFrames:0,uniqueFrameHashes:0}}
 }
 const screens={owner:[],alternates:[]};
 for(let i=0;i<TITLE_SCENES.length;i++){
  const title=TITLE_SCENES[i];
  try{
   const file=source(root,titleScenePath(i),null,[960,540]);
   (title.kind==='owner'?screens.owner:screens.alternates).push({role:'title',...file});
  }catch(error){errors.push('Title '+i+': '+error.message)}
 }
 for(const [role,filename] of Object.entries(RESULT_SCENES)){
  try{screens.owner.push({role,...source(root,filename,null,[960,540])})}
  catch(error){errors.push('Screen '+role+': '+error.message)}
 }
 const signoff=legacy.decisions?.['FOX-01']||null;
 const foxIdentity={id:'FOX-01',legacyDecision:signoff?.decision||'NO_DECISION',
  legacyAuthority:signoff?.authority||null,
  matchesSpecificPhysicalSource:false,
  sourceHash:manifest.assets?.['FOX-01']?.sha256||null,
  finalHumanApproval:curation.entries?.['FOX-01']?.finalHumanApproval===true,
  note:'Existing project-owner character-design approval lacks a source SHA-256 and integration evidence. Preserve the historic decision; do not promote current image bytes automatically.'};
 const originalCinnamonArchive={name:'ShakeDown_Cinnamon_Art_PreHandoff.zip',
  expectedSha256:'e6830e8544c0060dad92750a354832ec781d613b8a0be19a062170e4ebebe9eb',
  verifiedInThisRepo:false,note:'Earlier operational ledger records the archive as missing; this audit does not search off-repository sources.'};
 const blockers=[];
 if(previews.length!==28||additional.length!==35)
  blockers.push('Runtime default art selection drift: expected 28 preview + 35 additional scene sources');
 if(records.length!==previews.length+additional.length||errors.length)
  blockers.push('A source/provenance integrity test failed; see integrityErrors');
 if(records.some(x=>!x.finalHumanApproval))
  blockers.push('Default-shipped provisional art remains without bound final human review');
 if(Object.keys(runtime.assets||{}).length===0)
  blockers.push('Final integrated runtime art ledger currently has no approved visual replacements');
 if(!foxIdentity.matchesSpecificPhysicalSource)
  blockers.push('FOX-01 historic identity approval is not bound to a verified PNG and gameplay acceptance');
 blockers.push('Original Cinnamon pre-handoff archive is not restored in the audited repository');
 const report={schemaVersion:1,kind:'SHIPPED_ART_READINESS_AUDIT',
  scope:'Source-byte integrity and approval provenance only; not aesthetic approval or natural-paced gameplay proof',
  repository:'westkitty/ShakeDown',git:{branch:git(root,['branch','--show-current']),sha:git(root,['rev-parse','HEAD'])},
  candidateInventory:{physicalCount:Object.keys(manifest.assets||{}).length,curatorVerdicts:counts,
   defaultSelected:previews.length+additional.length,defaultSourceVerified:records.length,
   defaultFinalHumanApproved:records.filter(x=>x.finalHumanApproval).length,
   excludedReviseOrBlocked:counts.revise+counts.blocked},
  defaultSources:records,
  cinnamon:{declaredFrames:Object.keys(cinnamon.frames||{}).length,verifiedFrames:cinnamonFrames.length,
   playableFrames:cinnamonFrames.filter(x=>x.id!=='run_03').length,
   clippedFrameExcluded:'run_03',originalArchive:originalCinnamonArchive},
  secretCharacters:npc,
  screens:{ownerSuppliedSourceFiles:screens.owner.length,alternateTitleFiles:screens.alternates.length,
   sourceVerifiedFiles:screens.owner.concat(screens.alternates)},
  currentRuntimeApprovedVisualCount:Object.keys(runtime.assets||{}).length,
  foxIdentity,releaseArtReady:blockers.length===0&&errors.length===0,
  outcome:blockers.length||errors.length?'BLOCKED_FINAL_ART_ACCEPTANCE':'READY_FOR_FINAL_ART_ACCEPTANCE',
  blockers,integrityErrors:errors};
 return report;
}
export function markdownChecklist(report){
 const lines=[
  '# ShakeDown shipped-art human review checklist',
  '',
  '- Git revision: '+(report.git.sha||'UNKNOWN'),
  '- Automated byte integrity: '+(report.integrityErrors.length?'ERROR':'PASS'),
  '- Human final-art gate: '+report.outcome,
  '- Physical provisional sources currently selected: '+report.candidateInventory.defaultSelected,
  '- Human-final-approved selected sources: '+report.candidateInventory.defaultFinalHumanApproved,
  '- Review under the actual live gameplay context. Do not approve on hashes alone.',
  '',
  '| ID | Role | Source | SHA-256 | Final approval |',
  '|---|---|---|---|---|'
 ];
 for(const x of report.defaultSources)
  lines.push('| '+x.id+' | '+x.group+' / '+x.role+' | `'+x.file.path+'` | `'+x.file.sha256+'` | '+(x.finalHumanApproval?'recorded':'NEEDED')+' |');
 lines.push('','## Other non-candidate surfaces',
  '- Cinnamon: '+report.cinnamon.playableFrames+' source-verified playable frames; original pre-handoff archive remains a separate provenance gate.',
  '- Smudge and Dexter: '+report.secretCharacters.smudge.verifiedFrames+' and '+report.secretCharacters.dexter.verifiedFrames+' hash-verified timing frames; source correctness does not prove character/art acceptance.',
  '- Owner-supplied raster title/loss/victory: '+report.screens.ownerSuppliedSourceFiles+' files, source-verified, visually unreviewed in this audit.',
  '- FOX-01: earlier owner-approved identity *design* exists but is not hash-bound to the PNG in the candidate inventory.',
  '',
  '## Blocking gates',...report.blockers.map(x=>'- '+x),
  '',
  '## Human action',
  'For each accepted image, review the actual scene, character silhouette, collision/warning readability, animation and tone at desktop and physical mobile sizes. Record identity, source SHA, decision, reviewer, date and screenshot evidence in the existing governed asset-intake process. Do not edit source-hash manifests simply to turn this audit green.',
  '');
 return lines.join('\n');
}
const isCli=process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href;
if(isCli){
 const argv=process.argv.slice(2);
 if(argv.some(x=>!['--markdown','--require-approved'].includes(x))){
  console.error('Usage: npm run art:acceptance -- [--markdown] [--require-approved]');process.exitCode=1;
 }else{
  try{
   const report=auditArt(process.cwd());
   console.log(argv.includes('--markdown')?markdownChecklist(report):JSON.stringify(report,null,2));
   if(report.integrityErrors.length)process.exitCode=3;
   else if(argv.includes('--require-approved')&&!report.releaseArtReady)process.exitCode=2;
  }catch(error){console.error('Artwork acceptance evidence unavailable: '+error.message);process.exitCode=1}
 }
}
