// Browser loader for physically verified, user-supplied NPC animation frames.
// The manifest, not guessed filenames or sprite-grid coordinates, is authority.
const NPCS=['smudge','dexter'];
const SHA=/^[0-9a-f]{64}$/;
export function npcFrameEntries(manifest,npc){
 if(!NPCS.includes(npc)||manifest?.schema!==1||manifest.subject!==npc||
    !manifest.frames||typeof manifest.frames!=='object')return [];
 const frames=Object.entries(manifest.frames);
 if(frames.length!==4)return [];
 const expected=Array.from({length:4},(_,i)=>'idle_'+String(i).padStart(2,'0'));
 if(expected.some(key=>!Object.hasOwn(manifest.frames,key)))return [];
 return frames.every(([id,item])=>
   expected.includes(id)&&item?.file===`assets/sprites/${npc}/${id}.png`&&
   item.width===280&&item.height===200&&SHA.test(item.sha256))?
   frames.map(([id,item])=>[`NPC-${npc}-${id}`,item]):[];
}
export async function loadSecretNpcArt({request=fetch,ImageCtor=Image}={}){
 const images={},errors=[];
 for(const npc of NPCS){
  try{
   const response=await request(`assets/sprites/${npc}/frames.json`,{cache:'no-store'});
   if(!response.ok)throw Error('manifest HTTP '+response.status);
   const entries=npcFrameEntries(await response.json(),npc);
   if(entries.length!==4)throw Error('manifest rejected');
   await Promise.all(entries.map(([key,item])=>new Promise(resolve=>{
    const image=new ImageCtor();
    image.onload=()=>{
      if(image.naturalWidth===item.width&&image.naturalHeight===item.height)images[key]=image;
      else errors.push(key+': dimensions');
      resolve();
    };
    image.onerror=()=>{errors.push(key+': missing');resolve();};
    image.src=item.file;
   })));
  }catch(error){errors.push(npc+': '+error.message)}
 }
 return {images,errors,loaded:Object.keys(images).length};
}
