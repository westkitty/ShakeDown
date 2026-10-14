import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const paths=['offline-assets.json','manifest.webmanifest','service-worker.js'];
const data=Object.fromEntries(paths.map(name=>[name,fs.readFileSync(path.join(root,name),'utf8')]));
const inventory=JSON.parse(data['offline-assets.json']);
const manifest=JSON.parse(data['manifest.webmanifest']);
const digest=filename=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,filename))).digest('hex');
const all=[...inventory.core,...inventory.game];
const sourceFiles=directory=>{
 const entries=[];
 for(const entry of fs.readdirSync(path.join(root,directory),{withFileTypes:true})){
  const pathname=path.posix.join(directory,entry.name);
  if(entry.isDirectory())entries.push(...sourceFiles(pathname));
  else if(entry.isFile())entries.push(pathname);
 }
 return entries;
};
test('complete game list is versioned and matches all files with zero duplicates',()=>{
 assert.equal(inventory.schema,2);
 assert.ok(inventory.core.length>20);
 assert.ok(inventory.game.length>290);
 assert.equal(inventory.totals.allFiles,all.length);
 assert.equal(inventory.totals.coreFiles,inventory.core.length);
 assert.equal(inventory.totals.gameFiles,inventory.game.length);
 assert.equal(inventory.totals.allBytes,all.reduce((sum,f)=>sum+f.bytes,0));
 assert.equal(new Set(all.map(f=>f.path)).size,all.length);
 assert.match(data['service-worker.js'],new RegExp("const REV='"+inventory.version.replace(/\./g,'\\.')+"'"));
});
test('every original game asset and workshop file is included, with source hashes',()=>{
 const listed=new Map(all.map(file=>[file.path,file]));
 for(const dirname of ['assets','tools']){
  for(const name of sourceFiles(dirname)){
   const file=listed.get(name);
   assert.ok(file, 'Full game omitted physical '+name);
   assert.equal(fs.statSync(path.join(root,name)).size,file.bytes,name);
   assert.equal(digest(name),file.sha256,name);
  }
 }
});
test('offline pack includes all six original songs and both cinematic containers',()=>{
 const offlineFiles=new Set(inventory.game.map(f=>f.path));
 for(const pathname of [
  'assets/audio/music/campus-adventure.mp3',
  'assets/audio/music/campus-exploration.mp3',
  'assets/audio/music/campus-untitled.mp3',
  'assets/audio/music/dome-factory-a.mp3',
  'assets/audio/music/dome-factory-b.mp3',
  'assets/audio/music/fox-boss.mp3',
  'assets/branding/stinky-weasel-brand.mp4',
  'assets/intro/cinnamon-title.mp4',
  'assets/intro/cinnamon-title-alpha.webm',
  'tools/asset-review.html','tools/asset-review.mjs',
  'tools/asset-gallery.html','tools/asset-gallery.mjs',
  'docs/assets/ShakeDown_Complete_Asset_Contract.json',
  'assets/title/title_10_the-prize.png',
  'assets/references/cinnamon_master_sheet.png'
 ]){
  assert.ok(offlineFiles.has(pathname),'Full game omitted '+pathname);
 }
});
test('all modern browser modules and root installation assets exist offline',()=>{
 const listed=new Set(all.map(f=>f.path));
 for(const pathname of sourceFiles('src')){
  if(pathname.endsWith('.mjs'))assert.ok(listed.has(pathname),'Code module missing: '+pathname);
 }
 for(const pathname of ['index.html','manifest.webmanifest','src/styles.css',
  'assets/app/shakedown-icon-192.png','assets/app/shakedown-icon-512.png'])
  assert.ok(listed.has(pathname));
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.scope,'./');
 assert.equal(manifest.start_url,'./');
});
test('service worker supports a full media byte range while offline',()=>{
 const sw=data['service-worker.js'];
 assert.match(sw,/self\.addEventListener\('fetch'/);
 assert.match(sw,/const rangeResponse=async/);
 assert.match(sw,/status:206/);
 assert.match(sw,/Content-Range/);
 assert.match(sw,/Content-Length/);
 assert.match(sw,/ACTIVE_UPDATE|ACTIVATE_UPDATE/);
 assert.match(sw,/cache\.put\(READY/);
 assert.doesNotMatch(sw,/importScripts\(['"]https?:/);
});
test('deterministic offline list is fresh and requires no build/network',()=>{
 const child=spawnSync(process.execPath,['scripts/generate-offline-assets.mjs','--check'],{
  cwd:root,encoding:'utf8',timeout:25000
 });
 assert.equal(child.status,0,child.stderr);
 assert.match(child.stdout,/verified/);
});
