// Non-authoritative source-art frame selection for the verified Cup Crawler.
// All frame IDs refer to original physical PNGs; there are no invented atlases.
export const CRAWLER_FRAME_SECONDS=0.19;
export const DEFEAT_POSE_SECONDS=0.67;
export function crawlerFrame(elapsed,enemy,{stunned=false,reducedMotion=false}={}){
 if(reducedMotion||stunned)return 'EN-01';
 const t=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
 // Desynchronize separate authored bots without dependence on wall-clock time.
 const offset=Math.floor((enemy.baseX??enemy.x??0)/100);
 return Math.floor(t/CRAWLER_FRAME_SECONDS+offset)%2===0?'EN-01':'EN-02';
}
export function visibleDefeatAge(event,elapsed){
 if(!event||!['stomp','enemy'].includes(event.type))return null;
 const age=elapsed-event.t;
 return Number.isFinite(age)&&age>=0&&age<DEFEAT_POSE_SECONDS?age:null;
}
