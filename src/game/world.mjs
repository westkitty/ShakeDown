// Hand-authored level data. World coordinates are gameplay truth; presentation derives from them.
export const VIEW = Object.freeze({width:960,height:540});
export const WORLD = Object.freeze({width:8350,campusEnd:3770,domeEnd:8350,bossStart:7440});
export const DOME_ARENA_Y=-1174;

const platform=(id,x,y,w,h,kind='ground',extra={})=>({id,x,y,w,h,kind,...extra});
export function buildLevel(){
 const platforms=[
  platform('quad-vendor',-80,442,850,140,'grass'),
  platform('quad-after-bridge',910,442,540,140,'grass'),
  platform('quad-lecture-path',1560,442,600,140,'stone'),
  platform('quad-festival',2270,442,640,140,'grass'),
  platform('quad-parade',3020,442,790,140,'stone'),
  platform('quad-banner-1',765,442,155,21,'banner',{pulse:true}),
  platform('quad-banner-2',1450,442,120,21,'banner',{pulse:true}),
  platform('quad-banner-3',2150,442,125,21,'banner',{pulse:true}),
  platform('quad-banner-4',2900,442,125,21,'banner',{pulse:true}),
  platform('quad-training-1',420,365,150,18,'stone'),
  platform('quad-training-2',1090,352,170,18,'wood'),
  platform('quad-secret-1',1290,310,135,18,'gold'),
  platform('quad-festival-ledge',1800,335,135,18,'wood'),
  platform('quad-market-cart',2490,340,170,22,'moving',{movement:'horizontal',amplitude:58,period:3.5}),
  platform('quad-secret-2',2650,290,125,18,'gold'),
  platform('quad-pennants',3190,325,175,22,'banner',{pulse:true}),
  platform('dome-approach',3760,390,185,34,'stone'),
 ];
 const staircase=[];
 for(let i=1;i<=23;i++){
  const x=3760+i*156;
  const y=390-i*68;
  const moving=i===6||i===13||i===19;
  const b=platform(`dome-step-${String(i).padStart(2,'0')}`,x,y,i%5===0?197:184,24,
    i%6===0?'gold':(i%4===0?'banner':'stone'),
    moving?{movement:'vertical',amplitude:30,period:3.2+i*0.17}:{pulse:i===8||i===15});
  staircase.push(b);
  // Every pulse jump has an always-solid lower safety route so missed timing cannot softlock.
  if(i===8||i===15) staircase.push(platform(`dome-safety-${i}`,x+20,y+61,150,18,'wood'));
 }
 platforms.push(...staircase);
 platforms.push(platform('summit-arena',7335,DOME_ARENA_Y,1000,55,'gold'));
 const checkpoint=(id,x,footY)=>({id,x,footY,active:false});
 const checkpoints=[checkpoint('Welcome Lawn',60,442),checkpoint('South Quad',1690,442),
  checkpoint('Dome Approach',3490,442),checkpoint('Bell Gallery',5360,390-10*68),
  checkpoint('Upper Cornice',6632,390-18*68),checkpoint('Summit Gate',7430,DOME_ARENA_Y)];
 const beacons=[{id:'beacon-south',x:1870,footY:442},{id:'beacon-parade',x:3145,footY:442},
  {id:'beacon-dome',x:5040,footY:390-8*68},{id:'beacon-gallery',x:6210,footY:390-15*68}];
 const shakes=[];
 function shake(id,x,y,special=false){shakes.push({id,x,y,special,taken:false});}
 [[260,395],[460,308],[620,395],[1110,294],[1240,395],[1340,271],
 [1630,394],[1860,278],[2040,393],[2410,392],[2550,291],[2740,258],
 [3130,390],[3250,280],[3570,390]].forEach(([x,y],i)=>shake(`quad-shake-${i+1}`,x,y,i===5||i===11));
 for(let i=2;i<=23;i++){
  const x=3760+i*156+56;
  const y=390-i*68-50;
  shake(`dome-shake-${i}`,x,y,i===7||i===14||i===22);
 }
 shake('summit-shake',7690,DOME_ARENA_Y-60,true);
 const enemies=[
  {id:'cup-lawn',kind:'cup',x:1000,y:392,w:44,h:50,baseX:1000,range:68,rate:1.28,alive:true},
  {id:'cup-arch',kind:'cup',x:1730,y:392,w:44,h:50,baseX:1730,range:64,rate:1.42,alive:true},
  {id:'cup-parade',kind:'cup',x:2700,y:392,w:44,h:50,baseX:2700,range:74,rate:1.65,alive:true},
  {id:'cup-stair',kind:'cup',x:4340,y:390-4*68-50,w:44,h:50,baseX:4340,range:36,rate:1.4,alive:true},
  {id:'cup-gallery',kind:'cup',x:6015,y:390-14*68-50,w:44,h:50,baseX:6015,range:30,rate:1.3,alive:true},
 ];
 const hazards=[
  {id:'confetti-one',kind:'cannon',x:2085,y:399,w:46,h:43,period:3.35,offset:0.5},
  {id:'confetti-two',kind:'cannon',x:3310,y:399,w:46,h:43,period:3.6,offset:1.6},
  {id:'confetti-dome',kind:'cannon',x:5775,y:390-13*68-44,w:46,h:44,period:4.2,offset:0.9},
 ];
 return {platforms,checkpoints,beacons,shakes,enemies,hazards};
}

export function pulseActive(time,manualOverride=0){
 const phase=((time%5.6)+5.6)%5.6;
 return manualOverride>0 || phase<2.9;
}
export function visibleWorld(platforms,cameraX,cameraY){
 return platforms.filter(p=>p.x+p.w>=cameraX-170&&p.x<=cameraX+VIEW.width+170&&p.y+p.h>=cameraY-160&&p.y<=cameraY+VIEW.height+170);
}
