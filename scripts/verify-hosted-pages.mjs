#!/usr/bin/env node
// Verify the *public* GitHub Pages bytes, not just files committed to Git.
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const root='https://westkitty.github.io/ShakeDown/';
const titleNames=[
 '01_dawn-quad-hero','02_the-last-shake','03_golden-ascent',
 '04_summit-showdown','05_birthday-finale','06_pep-rally-midnight',
 '07_quad-pursuit','08_blue-hour-on-the-dome','09_the-long-way-up','10_the-prize'
];
const paths=[
 'index.html','src/main.mjs','src/game/secret-actors.mjs','src/game/secret-assets.mjs',
 'src/game/world.mjs','src/game/engine.mjs','src/game/progress.mjs','src/game/render.mjs',
 'assets/sprites/smudge/frames.json','assets/sprites/smudge/source_sheet.png',
 ...Array.from({length:4},(_,i)=>`assets/sprites/smudge/idle_${String(i).padStart(2,'0')}.png`),
 'assets/sprites/dexter/frames.json','assets/sprites/dexter/source_sheet.png',
 ...Array.from({length:4},(_,i)=>`assets/sprites/dexter/idle_${String(i).padStart(2,'0')}.png`),
 'src/game/screen-art.mjs',
 'src/game/audio.mjs','src/game/curated-assets.mjs','src/styles.css',
 'assets/screens/01_start_level_clean_960x540.png',
 'assets/screens/02_game_over_continue_clean_960x540.png',
 'assets/screens/03_victory_credits_clean_960x540.png',
 ...titleNames.map(x=>'assets/title/canvas/title_'+x+'_960x540.png'),
 'assets/sprites/cinnamon/frames.json',
 'assets/sprites/cinnamon/run_01.png',
 'assets/audio/music/campus-adventure.mp3',
 'assets/production/manifest.json','assets/production/curation.json'
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const expected=new Map(paths.map(path=>[path,hash(fs.readFileSync(path))]));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function compare(path){
 const uri=new URL(path,root);
 uri.searchParams.set('build',process.env.GITHUB_SHA?.slice(0,12)||'manual');
 const response=await fetch(uri,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error(path+' HTTP '+response.status);
 const body=Buffer.from(await response.arrayBuffer());
 const actual=hash(body);
 if(actual!==expected.get(path))throw Error(path+' does not match checkout SHA-256: public '+actual+' expected '+expected.get(path));
 console.log('MATCH',path,body.byteLength,actual);
}
let ready=false,lastError=null;
for(let attempt=1;attempt<=24;attempt++){
 try{
  // Pages builds are asynchronous after main merges; wait for actual publication.
  for(const name of ['index.html','src/main.mjs','src/game/secret-actors.mjs',
    'assets/sprites/smudge/frames.json','assets/sprites/dexter/frames.json'])
   await compare(name);
  ready=true;break;
 }catch(error){
  lastError=error;
  console.log('Pages not yet at this revision ('+attempt+'/24): '+error.message);
  if(attempt!==24)await sleep(15000);
 }
}
if(!ready)throw Error('Public Pages did not reach the repository revision: '+lastError);
for(const path of paths){
 if(['index.html','src/main.mjs','src/game/secret-actors.mjs',
    'assets/sprites/smudge/frames.json','assets/sprites/dexter/frames.json'].includes(path))continue;
 await compare(path);
}
console.log('Public Pages SHA-256 parity confirmed for all '+paths.length+' authoritative files.');
