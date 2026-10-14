#!/usr/bin/env node
// Verify the *public* GitHub Pages bytes, not just files committed to Git.
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const root=process.env.SHAKEDOWN_PAGES_ROOT||'https://westkitty.github.io/ShakeDown/';
const parsedRoot=new URL(root);
if(!(parsedRoot.protocol==='https:'||
     (parsedRoot.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsedRoot.hostname))))
 throw Error('Hosted Pages audit requires HTTPS, except for loopback QA');
if(!parsedRoot.pathname.endsWith('/'))throw Error('Hosted Pages URL must end with a trailing slash');
const maxAttempts=Math.max(1,Math.min(24,Number(process.env.SHAKEDOWN_PAGES_ATTEMPTS)||24));
const retryDelayMs=process.env.SHAKEDOWN_PAGES_RETRY_DELAY_MS==='0'?0:15000;
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
// Public installed-PWA parity is checked for every original game, film,
 // soundtrack, source artwork, studio tool, icon, worker and offline index.
 // This is a post-deploy SHA check, not a local-only file existence check.
const offline=JSON.parse(fs.readFileSync('offline-assets.json','utf8'));
if(offline.schema!==2||offline.core?.length<25||offline.game?.length<290||
   offline.totals?.allFiles!==offline.core.length+offline.game.length)
 throw Error('Complete-game PWA inventory missing or malformed');
paths.push('service-worker.js','offline-assets.json',
 ...offline.core.map(entry=>entry.path),...offline.game.map(entry=>entry.path));
const uniquePaths=[...new Set(paths)];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const expected=new Map(uniquePaths.map(path=>[path,hash(fs.readFileSync(path))]));
for(const item of [...offline.core,...offline.game]){
 if(expected.get(item.path)!==item.sha256||
    fs.statSync(item.path).size!==item.bytes)
  throw Error('Offline source manifest diverges from checkout: '+item.path);
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function compare(path){
 const uri=new URL(path,root);
 uri.searchParams.set('build',process.env.GITHUB_SHA?.slice(0,12)||'manual');
 const response=await fetch(uri,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(60000)});
 if(!response.ok)throw Error(path+' HTTP '+response.status);
 const body=Buffer.from(await response.arrayBuffer());
 const actual=hash(body);
 if(actual!==expected.get(path))throw Error(path+' does not match checkout SHA-256: public '+actual+' expected '+expected.get(path));
 console.log('MATCH',path,body.byteLength,actual);
}
const gate=[
 'index.html','src/main.mjs','src/game/secret-actors.mjs',
 'assets/sprites/smudge/frames.json','assets/sprites/dexter/frames.json',
 'manifest.webmanifest','service-worker.js','offline-assets.json'
];
let ready=false,lastError=null;
for(let attempt=1;attempt<=maxAttempts;attempt++){
 try{
  // Pages builds are asynchronous after main merges; wait for actual publication.
  for(const name of gate)await compare(name);
  ready=true;break;
 }catch(error){
  lastError=error;
  console.log('Pages not yet at this revision ('+attempt+'/'+maxAttempts+'): '+error.message);
  if(attempt!==maxAttempts)await sleep(retryDelayMs);
 }
}
if(!ready)throw Error('Public Pages did not reach the repository revision: '+lastError);
// Four bounded parallel connections verify the entire actual hosted game,
// including large original movies rather than only screenshots or source docs.
const remaining=uniquePaths.filter(file=>!gate.includes(file));
let next=0;
async function verifyWorker(){
 while(next<remaining.length){
  const filename=remaining[next++];
  await compare(filename);
 }
}
await Promise.all([verifyWorker(),verifyWorker(),verifyWorker(),verifyWorker()]);
console.log('Public Pages SHA-256 parity confirmed for all '+uniquePaths.length+
 ' authoritative game/PWA files ('+offline.totals.allFiles+' full offline files).');
