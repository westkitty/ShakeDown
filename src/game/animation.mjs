// Approved-source run_03 remains in the source archive but is clipped and forbidden in playback.
export const RUN_FRAMES=Object.freeze(['run_00','run_01','run_02','run_04','run_05']);
export function frameForState(state,seconds){
 const t=Math.max(0,Number.isFinite(seconds)?seconds:0);
 if(state==='run')return RUN_FRAMES[Math.floor(t*13)%RUN_FRAMES.length];
 const counts={idle:6,jump:2,fall:1,land:1,swish:2,dash:2,hurt:2,victory:3,shake:1};
 const n=counts[state]||1;
 const fps=state==='idle'?2.3:state==='victory'?4:10;
 const index=Math.floor(t*fps)%n;
 return state+'_'+String(index).padStart(2,'0');
}
