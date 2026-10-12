// Read-only rally directions. No physics mutation, no save state, no timers.
import {WORLD} from './world.mjs';
export function rallyGuidance(s){
 if(s.mode!=='playing'||!s.level?.rallyPosts?.length)return null;
 if(s.boss.triggered&&s.boss.hp>0){
  return s.boss.mode==='rest'
   ?{text:'FOX RECOVERING · SWISH TO HIT · CHEER TO EXTEND!',kind:'boss'}
   :{text:'FOX SHOWDOWN · DODGE THE ATTACK, WAIT FOR RECOVERY',kind:'boss'};
 }
 const p=s.player,cx=p.x+p.w/2,cy=p.y+p.h/2;
 const total=s.level.rallyPosts.length;
 if(s.rallyCount>=total)return {text:'RALLY LEGEND · ALL FOUR BELLS LIT!',kind:'complete'};
 const onCampus=cx<WORLD.campusEnd;
 const remaining=s.level.rallyPosts.filter(post=>!post.lit &&
   (post.x<WORLD.campusEnd)===onCampus).map(post=>{
    const dx=post.x-cx,dy=post.footY-35-cy;
    return {post,dx,dy,score:Math.abs(dx)+Math.abs(dy)*.5};
   }).sort((a,b)=>a.score-b.score);
 const nearest=remaining[0];
 if(!nearest||Math.abs(nearest.dx)>640||Math.abs(nearest.dy)>380){
  if(cx<580)return {text:'BONUS HIGH ROAD ↑ · FIND FOUR BELLS, PRESS C TO CHEER',kind:'intro'};
  return null;
 }
 const {post,dx,dy}=nearest;
 if(Math.abs(dx)<145&&Math.abs(dy)<115){
  return s.cheerCooldown<=.15
   ?{text:'C / CHEER NOW · '+post.label.toUpperCase()+' · SECRET SHAKE!',kind:'ready',targetId:post.id}
   :{text:post.label.toUpperCase()+' · CHEER RECHARGES IN '+Math.ceil(s.cheerCooldown)+'s',kind:'cooling',targetId:post.id};
 }
 const vertical=dy<-65?'↑':dy>90?'↓':'';
 const horizontal=dx>95?'→':dx< -95?'←':'';
 const direction=vertical+horizontal||'•';
 return {text:post.label.toUpperCase()+' '+direction+' · FOLLOW THE GOLD BANNERS',kind:'trail',targetId:post.id};
}
