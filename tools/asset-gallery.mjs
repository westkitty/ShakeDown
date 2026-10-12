const $=id=>document.getElementById(id);
const STORAGE='shakedown:art-jury:v1';
let curation=null,records=[],votes={},view=[];
const candidates=new Map();
const allowedPath=/^assets\/(?:production|level1)\/[a-z0-9/_-]+\.png$/i;
function readVotes(){
 try{const parsed=JSON.parse(localStorage.getItem(STORAGE)||'{}');
  return parsed?.schemaVersion===1&&parsed.votes&&typeof parsed.votes==='object'?parsed.votes:{};
 }catch{return {}}
}
function saveVotes(){
 try{localStorage.setItem(STORAGE,JSON.stringify({schemaVersion:1,votes}))}
 catch{/* Restricted storage still permits review; export for durability. */}
 updateStats();
}
function validVote(entry){
 const v=votes[entry.id];
 return v&&v.sha256===entry.sha256&&['keep','revise','reject'].includes(v.decision)?v:null;
}
function updateStats(){$('voted').textContent=records.filter(x=>validVote(x)).length}
const el=(tag,className,text)=>{
 const n=document.createElement(tag);if(className)n.className=className;
 if(text!==undefined)n.textContent=text;return n;
};
function link(href,text){
 const node=el('a',null,text);node.href=href;node.target='_blank';node.rel='noopener';return node;
}
function card(entry){
 const section=el('article','asset');section.dataset.curator=entry.verdict;section.dataset.id=entry.id;
 const art=el('div','art'),img=el('img');
 img.loading='lazy';img.decoding='async';img.alt=entry.name+' — generated candidate '+entry.id;
 img.src='../'+entry.sourcePath;
 art.append(img,el('span','marker',entry.verdict==='preview'?'★ MY PICK':entry.verdict==='blocked'?'⚠ BLOCKED':entry.verdict==='revise'?'↻ REVISE':'• ALTERNATE'));
 const content=el('div','content'),head=el('div','asset-heading'),h2=el('h2',null,entry.name);
 head.append(h2,el('span','id',entry.id));
 content.append(head,el('div','meta',entry.sourcePx.join(' × ')+' pixels  ·  score '+entry.score+' / 5'));
 content.append(el('p','explain',entry.reason));
 if(entry.structuralIssues.length)content.append(el('div','issues','Contract issue: '+entry.structuralIssues.join(' · ')));
 const details=el('details','details'),summary=el('summary',null,'Evidence, exact source and checksum');
 const evidence=el('p',null,entry.sha256);
 evidence.append(document.createTextNode('  ·  SHA-256'));
 details.append(summary,
  el('p',null,'Original logical ID '+entry.id+' · source on Arena branch'),
  el('p',null,'Reviewer status: '+entry.sourceStatus),
  el('p',null,'Original filename: '+entry.sourcePath),
  evidence,
  el('p',null,entry.cropRisk?'Possible edge-touch: inspect for clipping at game scale.':'No crop-edge concern reported by source metadata.'),
  link('../'+entry.sourcePath,'Open original candidate image ↗'),
  link('../?art=all&inspect='+encodeURIComponent(entry.id),'AUDITION IN THE ACTUAL GAME ↗'));
 content.append(details);
 const review=el('div','review'),vote=validVote(entry);
 review.append(el('strong',null,'YOUR VERDICT · independent from my pick'));
 const actions=el('div','vote-buttons');
 const choices=[['keep','✓ KEEP'],['revise','↻ REVISE'],['reject','✕ REJECT']];
 for(const [value,label] of choices){
  const button=el('button',null,label);button.type='button';button.dataset.vote=value;
  button.dataset.assetId=entry.id;button.setAttribute('aria-pressed',String(vote?.decision===value));
  button.title='Record your decision for '+entry.id;actions.append(button);
 }
 const note=el('textarea');note.placeholder='Your art direction / reason (optional)';
 note.setAttribute('aria-label','Your review notes for '+entry.id);
 note.value=vote?.notes||'';note.maxLength=2500;note.dataset.notes=entry.id;
 review.append(actions,note,el('div','personal-note','Nothing is approved or committed by voting.'));
 section.append(art,content,review);
 return section;
}
function render(){
 let list=records.filter(entry=>{
  const q=$('query').value.trim().toLowerCase();
  return (!$('group').value||entry.group===$('group').value)
   &&(!$('verdict').value||entry.verdict===$('verdict').value)
   &&(!$('compare').value||curation.comparisonGroups[$('compare').value]?.includes(entry.id))
   &&(!q||[entry.id,entry.name,entry.reason,entry.sourcePath].some(x=>String(x).toLowerCase().includes(q)));
 });
 const sort=$('sort').value;
 if(sort==='id')list.sort((a,b)=>a.id.localeCompare(b.id));
 else if(sort==='score')list.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
 else if(sort==='needs-vote')list.sort((a,b)=>Number(Boolean(validVote(a)))-Number(Boolean(validVote(b)))||b.score-a.score);
 else list.sort((a,b)=>({preview:0,alternate:1,revise:2,blocked:3}[a.verdict])-({preview:0,alternate:1,revise:2,blocked:3}[b.verdict])||a.id.localeCompare(b.id));
 view=list;
 const parent=$('candidates');parent.replaceChildren();
 for(const entry of list)parent.append(card(entry));
 $('summary').textContent='SHOWING '+list.length+' OF '+records.length+' • '+list.filter(x=>validVote(x)).length+' of these judged by you';
}
function exportVotes(){
 const selected=records.map(entry=>{
  const vote=validVote(entry);return vote?{id:entry.id,sha256:entry.sha256,
   curatorVerdict:entry.verdict,decision:vote.decision,notes:vote.notes||''}:null;
 }).filter(Boolean);
 const output={schemaVersion:1,project:'westkitty/ShakeDown',artBranch:'arena/34b09180-shakedown',
  exportDate:new Date().toISOString(),recordCount:selected.length,
  notice:'These are user review recommendations exported from the Art Jury; this JSON never auto-activates assets or certifies copyrights.',
  votes:selected};
 const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)+'\n'],{type:'application/json'}));
 const a=el('a');a.href=url;a.download='shakedown-art-jury-review.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function init(){
 const response=await fetch('../assets/production/curation.json',{cache:'no-store'});
 if(!response.ok)throw Error('Curator assessment HTTP '+response.status);
 curation=await response.json();
 if(curation.schemaVersion!==1||!curation.entries||curation.generatedCount!==194)
  throw Error('Invalid or incomplete physical-art audit');
 records=Object.values(curation.entries).filter(entry=>entry?.id&&allowedPath.test(entry.sourcePath));
 if(records.length!==194)throw Error('194 unique verified source paths required');
 for(const entry of records)candidates.set(entry.id,entry);
 votes=readVotes();
 for(const [id,count] of Object.entries(curation.summary)){
  const dom={preview:'recommended',alternate:'alternate',revise:'revise',blocked:'blocked'}[id];
  if(dom)$(dom).textContent=count;
 }
 $('total').textContent=records.length;
 for(const group of [...new Set(records.map(x=>x.group))].sort()){
  const option=el('option',null,group);option.value=group;$('group').append(option);
 }
 for(const key of Object.keys(curation.comparisonGroups)){
  const option=el('option',null,key);option.value=key;$('compare').append(option);
 }
 for(const id of ['query','group','verdict','compare','sort']){
  $(id).addEventListener(id==='query'?'input':'change',render);
 }
 $('clear-filters').addEventListener('click',()=>{
  $('query').value='';$('group').value='';$('verdict').value='';$('compare').value='';$('sort').value='priority';render();
 });
 $('export-votes').addEventListener('click',exportVotes);
 $('candidates').addEventListener('click',event=>{
  const button=event.target.closest('button[data-vote]');
  if(!button)return;
  const entry=candidates.get(button.dataset.assetId);
  if(!entry)return;
  const value=button.dataset.vote,old=validVote(entry);
  const note=button.closest('.review')?.querySelector('textarea')?.value||'';
  if(old?.decision===value){delete votes[entry.id];}
  else votes[entry.id]={sha256:entry.sha256,decision:value,notes:note};
  saveVotes();
  for(const btn of button.closest('.vote-buttons').querySelectorAll('button'))
   btn.setAttribute('aria-pressed',String(votes[entry.id]?.decision===btn.dataset.vote));
  $('summary').textContent='SHOWING '+view.length+' OF '+records.length+' • '+view.filter(x=>validVote(x)).length+' of these judged by you';
 });
 $('candidates').addEventListener('input',event=>{
  if(!event.target.matches('textarea[data-notes]'))return;
  const id=event.target.dataset.notes,entry=candidates.get(id);
  if(!entry)return;
  const old=validVote(entry);
  if(old){old.notes=event.target.value;saveVotes()}
 });
 updateStats();render();
}
init().catch(error=>{
 $('summary').textContent='Art inventory unavailable: '+error.message+'. The original game remains playable.';
 console.error(error);
});
