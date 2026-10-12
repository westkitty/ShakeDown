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
 // Optional high-ground rally circuit: it rejoins the existing chase at Dome
 // Approach. Every timed banner has the solid campus route underneath it.
 // These are authored collision platforms, not decorative screenshots.
 const rallyQuad=[
  [590,319,'stone'],[790,278,'banner'],[1005,247,'wood'],
  [1215,225,'gold'],[1424,241,'banner'],[1637,266,'stone'],
  [1846,252,'wood'],[2070,277,'banner'],[2289,260,'stone'],
  [2510,277,'moving'],[2730,255,'banner'],[2950,255,'gold'],
  [3190,286,'wood'],[3410,301,'stone']
 ];
 rallyQuad.forEach(([x,y,kind],i)=>platforms.push(platform(
  'rally-quad-'+String(i+1).padStart(2,'0'),
  x,y,kind==='moving'?174:168,20,kind,
  kind==='moving'?{movement:'horizontal',amplitude:32,period:3.6}:
  kind==='banner'?{pulse:true}:{}
 )));
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
 // The Bell Gallery and Skyline Cornice branch out from existing steps.
 // Their rewards are optional; the 23 original stages remain untouched.
 const sideRoutes=[
  ['gallery',[[5395,-444,'stone'],[5190,-490,'banner'],
    [5000,-502,'gold'],[5190,-524,'stone'],[5410,-535,'wood']]],
  ['cornice',[[6500,-872,'stone'],[6305,-920,'banner'],
    [6108,-968,'gold'],[6305,-1010,'stone'],
    [6517,-1050,'banner'],[6740,-1052,'wood']]]
 ];
 for(const [area,stops] of sideRoutes){
  stops.forEach(([x,y,kind],i)=>platforms.push(platform(
   'rally-'+area+'-'+String(i+1).padStart(2,'0'),
   x,y,175,20,kind,kind==='banner'?{pulse:true}:{}
  )));
 }
 // Authored optional encounter routes: never replace the 23-step main ascent.
 // The Smudge route descends from the first bridge and rejoins the South Quad.
 const smudgePlatforms=[
  ['secret-smudge-01',795,510,192,19,'stone'],
  ['secret-smudge-02',935,572,160,19,'wood'],
  ['secret-smudge-03',1080,637,140,19,'stone'],
  ['secret-smudge-sign',1196,705,185,20,'wood'],
  ['secret-smudge-alcove',1365,705,580,35,'stone'],
  ['secret-smudge-return-01',1890,646,170,19,'wood'],
  ['secret-smudge-return-02',2080,574,145,19,'stone'],
  ['secret-smudge-return-03',2200,504,70,19,'wood']
 ];
 smudgePlatforms.forEach(([id,x,y,w,h,kind])=>platforms.push(platform(id,x,y,w,h,kind)));
 // Ten rising, leftward steps lead from dome step 21 to Dexter's isolated crest.
 // Safety ledges are solid even while adjacent moving/pulse steps change state.
 const dexterSteps=[
  [6920,-1152,'stone'],[6779,-1266,'wood'],[6568,-1379,'stone'],
  [6357,-1492,'moving'],[6146,-1605,'stone'],[5935,-1718,'wood'],
  [5724,-1831,'stone'],[5513,-1944,'banner'],[5302,-2057,'stone'],
  [5091,-2170,'wood']
 ];
 dexterSteps.forEach(([x,y,kind],i)=>platforms.push(platform(
  'secret-dexter-'+String(i+1).padStart(2,'0'),
  x,y,198,20,kind,
  kind==='moving'?{movement:'horizontal',amplitude:12,period:4.1}:
   kind==='banner'?{pulse:true}:{}
 )));
 platforms.push(platform('secret-dexter-safety-04',6340,-1432,150,17,'wood'));
 platforms.push(platform('secret-dexter-safety-08',5500,-1884,150,17,'wood'));
 platforms.push(platform('secret-dexter-summit',4750,-2185,330,40,'stone'));
 platforms.push(platform('summit-arena',7335,DOME_ARENA_Y,1000,55,'gold'));
 const checkpoint=(id,x,footY)=>({id,x,footY,active:false});
 const checkpoints=[checkpoint('Welcome Lawn',60,442),checkpoint('South Quad',1690,442),
  checkpoint('Dome Approach',3490,442),checkpoint('Bell Gallery',5360,390-10*68),
  checkpoint('Upper Cornice',6632,390-18*68),checkpoint('Summit Gate',7430,DOME_ARENA_Y)];
 const beacons=[{id:'beacon-south',x:1870,footY:442},{id:'beacon-parade',x:3145,footY:442},
  {id:'beacon-dome',x:5040,footY:390-8*68},{id:'beacon-gallery',x:6210,footY:390-15*68}];
 const rallyPosts=[
  {id:'canopy-bell',x:1080,footY:247,reward:'rally-shake-canopy',lit:false},
  {id:'parade-bell',x:3030,footY:255,reward:'rally-shake-parade',lit:false},
  {id:'gallery-bell',x:5080,footY:-502,reward:'rally-shake-gallery',lit:false},
  {id:'cornice-bell',x:6165,footY:-968,reward:'rally-shake-cornice',lit:false}
 ];
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
 // A rally reward is not visible or collectible until the player actually
 // cheers next to that relay post. No free points from a menu toggle.
 for(const post of rallyPosts){
  shakes.push({id:post.reward,x:post.x+28,y:post.footY-34,
    special:true,taken:false,locked:true});
 }
 // The upper paths have optional danger, but never block the ground route.
 const enemies=[
  {id:'cup-lawn',kind:'cup',x:1000,y:392,w:44,h:50,baseX:1000,range:68,rate:1.28,alive:true},
  {id:'cup-arch',kind:'cup',x:1730,y:392,w:44,h:50,baseX:1730,range:64,rate:1.42,alive:true},
  {id:'cup-parade',kind:'cup',x:2700,y:392,w:44,h:50,baseX:2700,range:74,rate:1.65,alive:true},
  {id:'cup-stair',kind:'cup',x:4340,y:390-4*68-50,w:44,h:50,baseX:4340,range:36,rate:1.4,alive:true},
  {id:'cup-gallery',kind:'cup',x:6015,y:390-14*68-50,w:44,h:50,baseX:6015,range:30,rate:1.3,alive:true},
  {id:'cup-rally',kind:'cup',x:1795,y:203,w:44,h:50,baseX:1795,range:42,rate:1.28,alive:true},
  {id:'cup-cornice',kind:'cup',x:6520,y:-1100,w:44,h:50,baseX:6520,range:28,rate:1.55,alive:true},
 ];
 const hazards=[
  {id:'confetti-one',kind:'cannon',x:2085,y:399,w:46,h:43,period:3.35,offset:0.5},
  {id:'confetti-two',kind:'cannon',x:3310,y:399,w:46,h:43,period:3.6,offset:1.6},
  {id:'confetti-dome',kind:'cannon',x:5775,y:390-13*68-44,w:46,h:44,period:4.2,offset:0.9},
  {id:'confetti-rally',kind:'cannon',x:2440,y:220,w:46,h:43,period:4.0,offset:1.2},
 ];
 const secretNpcs=[
  {id:'smudge',title:'Oh my God, I got to see Smudge',x:1655,footY:705,radius:260,
   dialogue:'Oh my God, it\'s Smudge.'},
  {id:'dexter',title:'Unimpressed Stinkweasel',x:4910,footY:-2185,radius:240,
   dialogue:'Oh, so you found me. Big deal. I\'m not impressed.'}
 ];
 return {platforms,checkpoints,beacons,rallyPosts,shakes,enemies,hazards,secretNpcs};
}

export const CHANT_CYCLE=5.6;
export const CHANT_UP=2.9;
export function pulseState(time,manualOverride=0){
 const phase=((time%CHANT_CYCLE)+CHANT_CYCLE)%CHANT_CYCLE;
 const naturallyActive=phase<CHANT_UP;
 return {
  active:manualOverride>0||naturallyActive,
  // For HUD feedback the surviving override and scheduled chant are unified.
  remaining:Math.max(manualOverride>0?manualOverride:0,
    naturallyActive?CHANT_UP-phase:0,
    !naturallyActive&&manualOverride<=0?CHANT_CYCLE-phase:0),
  phase,
  natural:naturallyActive
 };
}
export function pulseActive(time,manualOverride=0){
 return pulseState(time,manualOverride).active;
}
export function visibleWorld(platforms,cameraX,cameraY){
 return platforms.filter(p=>p.x+p.w>=cameraX-170&&p.x<=cameraX+VIEW.width+170&&p.y+p.h>=cameraY-160&&p.y<=cameraY+VIEW.height+170);
}
