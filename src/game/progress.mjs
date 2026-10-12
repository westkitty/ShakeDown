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
 const rallies=record.rallies??[];
 if(!Array.isArray(rallies)||rallies.length>level.rallyPosts.length)return false;
 const validRallies=new Set(level.rallyPosts.map(post=>post.id));
 if(rallies.some(id=>typeof id!=='string'||!validRallies.has(id))||
    new Set(rallies).size!==rallies.length)return false;
 // An initial-lawn save is only justified by real progress. A blank fresh
 // spawn must not appear as a fake Continue opportunity.
 if(index===0&&!record.collected.length&&!record.defeated.length&&!rallies.length)return false;
 // Unlocked relay rewards cannot exist in a save whose physical bell was
 // never rung. Keep older schema-1 records without any relay prize valid.
 const lit=new Set(rallies);
 if(level.rallyPosts.some(post=>record.collected.includes(post.reward)&&!lit.has(post.id)))return false;
 return true;
}

// A stable, cheap fingerprint of meaningful progress. It changes only when
// the checkpoint advances, a shake is collected, a bell rings or a bot falls.
export function progressToken(s){
 const index=s.checkpoint;
 if(!Number.isInteger(index)||index<0||index>=s.level.checkpoints.length)return null;
 const defeated=s.level.enemies.reduce((count,e)=>count+Number(!e.alive),0);
 if(index===0&&s.shakeCount===0&&s.rallyCount===0&&defeated===0)return null;
 return [index,s.shakeCount,s.rallyCount,defeated].join(':');
}

export function checkpointRecord(s){
 const index=s.checkpoint;
 if(progressToken(s)===null)return null;
 return {
  schema:1,
  index,
  checkpointId:s.level.checkpoints[index].id,
  elapsed:Number(s.elapsed.toFixed(3)),
  collected:s.level.shakes.filter(item=>item.taken).map(item=>item.id),
  defeated:s.level.enemies.filter(item=>!item.alive).map(item=>item.id),
  rallies:s.level.rallyPosts.filter(post=>post.lit).map(post=>post.id)
 };
}

export function restoreCheckpoint(s,record){
 if(!validCheckpointRecord(record,s.level))return false;
 const collected=new Set(record.collected),defeated=new Set(record.defeated),rallies=new Set(record.rallies??[]);
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
 s.camera.y=clamp(s.player.y-260,-1625,0);
 s.status='Chase resumed from '+record.checkpointId+'.';
 s.checkpointNotice=2.5;
 return true;
}
