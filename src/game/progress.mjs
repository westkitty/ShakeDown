// Versioned, minimal checkpoint state. We persist progress, not a mutable game instance.
// The authored level remains authoritative whenever a save is resumed.
import {resetToCheckpoint} from './engine.mjs';
import {VIEW,WORLD} from './world.mjs';
const clamp=(value,min,max)=>Math.max(min,Math.min(value,max));

export function validCheckpointRecord(record,level){
 if(!record||typeof record!=='object'||record.schema!==1)return false;
 const index=record.index;
 if(!Number.isInteger(index)||index<0||index>=level.checkpoints.length)return false;
 if(record.checkpointId!==level.checkpoints[index].id)return false;
 if(!Number.isFinite(record.elapsed)||record.elapsed<0||record.elapsed>7200)return false;
 for(const [entries,items] of [[record.collected,level.shakes],[record.defeated,level.enemies]]){
  if(!Array.isArray(entries)||entries.length>items.length)return false;
  const allowed=new Set(items.map(item=>item.id));
  if(entries.some(id=>typeof id!=='string'||!allowed.has(id)))return false;
  if(new Set(entries).size!==entries.length)return false;
 }
 const discovered=record.discoveries??[];
 if(!Array.isArray(discovered)||discovered.length>level.secretNpcs.length)return false;
 const allowedNpcs=new Set(level.secretNpcs.map(npc=>npc.id));
 if(discovered.some(id=>typeof id!=='string'||!allowedNpcs.has(id))||
    new Set(discovered).size!==discovered.length)return false;
 // The introductory checkpoint is resumable only after a real NPC discovery.
 if(index===0&&!discovered.length)return false;
 const rallies=record.rallies??[];
 if(!Array.isArray(rallies)||rallies.length>level.rallyPosts.length)return false;
 const validRallies=new Set(level.rallyPosts.map(post=>post.id));
 if(rallies.some(id=>typeof id!=='string'||!validRallies.has(id))||
    new Set(rallies).size!==rallies.length)return false;
 return true;
}

export function checkpointRecord(s){
 const index=s.checkpoint;
 if(!Number.isInteger(index)||index<0||index>=s.level.checkpoints.length||(index===0&&!s.achievements.length))return null;
 return {
  schema:1,
  index,
  checkpointId:s.level.checkpoints[index].id,
  elapsed:Number(s.elapsed.toFixed(3)),
  collected:s.level.shakes.filter(item=>item.taken).map(item=>item.id),
  defeated:s.level.enemies.filter(item=>!item.alive).map(item=>item.id),
  rallies:s.level.rallyPosts.filter(post=>post.lit).map(post=>post.id),
  ...(s.achievements.length?{discoveries:[...s.achievements]}:{})
 };
}

export function restoreCheckpoint(s,record){
 if(!validCheckpointRecord(record,s.level))return false;
 const collected=new Set(record.collected),defeated=new Set(record.defeated),rallies=new Set(record.rallies??[]);
 s.achievements=[...(record.discoveries??[])];s.discoveryToast=null;
 for(const post of s.level.rallyPosts)post.lit=rallies.has(post.id);
 for(const shake of s.level.shakes){
  shake.taken=collected.has(shake.id);
  const post=s.level.rallyPosts.find(item=>item.reward===shake.id);
  if(post)shake.locked=!post.lit;
 }
 s.rallyCount=rallies.size;
 for(const enemy of s.level.enemies)enemy.alive=!defeated.has(enemy.id);
 s.shakeCount=collected.size;
 s.secretCount=s.level.shakes.filter(shake=>shake.taken&&shake.special).length;
 s.checkpoint=record.index;
 s.elapsed=record.elapsed;
 s.time=record.elapsed;
 s.boss.triggered=false;
 s.boss.mode='sleep';
 resetToCheckpoint(s);
 s.camera.x=clamp(s.player.x-350,0,WORLD.width-VIEW.width);
 s.camera.y=clamp(s.player.y-260,-2450,s.player.y>490&&s.player.x<2400?520:0);
 s.status='Chase resumed from '+record.checkpointId+'.';
 s.checkpointNotice=2.5;
 return true;
}
