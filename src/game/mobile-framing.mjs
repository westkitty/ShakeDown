// Presentation-only horizontal crop. Level, hitboxes, camera state and saves
// continue to use the original 960x540 logical game coordinates.
export function mobileCanvasPan({viewportWidth,canvasWidth,playerCssX,focus=0.36}){
 if(![viewportWidth,canvasWidth,playerCssX,focus].every(Number.isFinite)||
    viewportWidth<=0||canvasWidth<=viewportWidth||focus<=0||focus>=1)return 0;
 const minimum=viewportWidth-canvasWidth;
 const ideal=viewportWidth*focus-playerCssX;
 return Math.round(Math.min(0,Math.max(minimum,ideal)));
}
