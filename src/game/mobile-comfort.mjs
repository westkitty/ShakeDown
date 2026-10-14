// Separate, versioned touch preferences: never alter checkpoint/save schema.
export const COMFORT_KEY='shakedown:touch-comfort:v1';
export const COMFORT_DEFAULTS=Object.freeze({
 size:'standard',opacity:'standard',hand:'right',height:'standard',
 movement:'auto',sensitivity:'balanced',hud:'full',haptics:false,
 hideForGamepad:false
});
export const COMFORT_CHOICES=Object.freeze({
 size:['compact','standard','large'],
 opacity:['subtle','standard','strong'],
 hand:['right','left'],
 height:['standard','raised'],
 movement:['auto','pad','buttons'],
 sensitivity:['responsive','balanced','deliberate'],
 hud:['full','compact']
});
export function sanitizeComfortSettings(input){
 const obj=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
 const safe={...COMFORT_DEFAULTS};
 for(const [key,choices] of Object.entries(COMFORT_CHOICES))
  if(typeof obj[key]==='string'&&choices.includes(obj[key]))safe[key]=obj[key];
 for(const key of ['haptics','hideForGamepad'])
  if(typeof obj[key]==='boolean')safe[key]=obj[key];
 return safe;
}
export function readComfortSettings(storage){
 try{
  const value=JSON.parse(storage?.getItem(COMFORT_KEY)||'null');
  return sanitizeComfortSettings(value?.schema===1?value.settings:null);
 }catch{return {...COMFORT_DEFAULTS}}
}
export function writeComfortSettings(storage,settings){
 const safe=sanitizeComfortSettings(settings);
 try{storage?.setItem(COMFORT_KEY,JSON.stringify({schema:1,settings:safe}));return true}
 catch{return false}
}
