// Visual health derives from authoritative half-heart gameplay damage.
export function healthSegments(hp,maxHp=3){
 const maximum=Number.isInteger(maxHp)&&maxHp>0?maxHp:3;
 const amount=Number.isFinite(hp)?Math.max(0,Math.min(maximum,Math.round(hp*2)/2)):0;
 return Array.from({length:maximum},(_,i)=>amount>=i+1?'full':amount>=i+.5?'half':'empty');
}
export function healthAnnouncement(hp,maxHp=3){
 const maximum=Number.isInteger(maxHp)&&maxHp>0?maxHp:3;
 const amount=Number.isFinite(hp)?Math.max(0,Math.min(maximum,Math.round(hp*2)/2)):0;
 return 'Health: '+amount+' of '+maximum+' hearts';
}
