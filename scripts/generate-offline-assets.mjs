#!/usr/bin/env node
// Deterministic inventory of the entire ShakeDown runtime for fully offline PWA.
// No downloads, external packages, code transformation or asset approvals.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const PACK_VERSION='2026.10.14.2';
const verify=(relative)=>{
 const absolute=path.resolve(ROOT,relative);
 if(!absolute.startsWith(ROOT+path.sep))throw Error('Unsafe offline file path: '+relative);
 const stat=fs.lstatSync(absolute);
 if(!stat.isFile()||stat.isSymbolicLink())throw Error('Expected regular file: '+relative);
 const hash=crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex');
 return {path:relative,bytes:stat.size,sha256:hash};
};
const recursive=directory=>{
 const absolute=path.join(ROOT,directory);
 return fs.readdirSync(absolute,{withFileTypes:true}).flatMap(item=>{
  const rel=path.posix.join(directory,item.name);
  if(item.isDirectory())return recursive(rel);
  return item.isFile()?[rel]:[];
 });
};
const unique=files=>[...new Set(files)].sort();
const modules=recursive('src').filter(x=>x.endsWith('.mjs'));
const core=unique([
 'index.html','manifest.webmanifest','src/styles.css',
 ...modules,
 'assets/app/shakedown-icon-192.png','assets/app/shakedown-icon-512.png',
 'assets/branding/stinky-weasel-brand-poster.webp',
 'assets/intro/cinnamon-title-poster.webp',
 'assets/screens/01_start_level_clean_960x540.png'
]);
const packageContents=unique([
 // This is the COMPLETE authored game library, not a demo or poster-only pack.
 ...recursive('assets'),
 // Local art review and curator workshop remain navigable without connectivity.
 ...recursive('tools'),
 ...recursive('docs/assets').filter(file=>/\.(?:json|png|jpg|webp)$/.test(file))
]).filter(file=>!core.includes(file));
const listing={
 schema:2,
 version:PACK_VERSION,
 description:'Entire ShakeDown game: all 23 stages, all sprites and source art, all music, intro and branding videos, all title canvases, cinematics, saved-play tools and art workshop. Nothing gameplay-related is replaced by a poster.',
 core:core.map(verify),game:packageContents.map(verify)
};
const totals=arr=>({files:arr.length,bytes:arr.reduce((acc,item)=>acc+item.bytes,0)});
const coreTotal=totals(listing.core),packTotal=totals(listing.game);
listing.totals={
 coreFiles:coreTotal.files,coreBytes:coreTotal.bytes,
 gameFiles:packTotal.files,gameBytes:packTotal.bytes,
 allFiles:coreTotal.files+packTotal.files,
 allBytes:coreTotal.bytes+packTotal.bytes
};
const output=path.join(ROOT,'offline-assets.json');
const content=JSON.stringify(listing,null,2)+'\n';
if(process.argv.includes('--check')){
 if(!fs.existsSync(output)||fs.readFileSync(output,'utf8')!==content){
  console.error('Offline inventory stale: run node scripts/generate-offline-assets.mjs');
  process.exitCode=2;
 }else console.log('Complete game inventory verified:',listing.totals);
}else{
 fs.writeFileSync(output,content);
 console.log('Generated complete ShakeDown offline-assets.json',listing.totals);
}
