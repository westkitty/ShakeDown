"""Deterministically crop real poses from the user-provided action reference sheet.
These are validated cut-outs, not invented animation frames or an AI-generated atlas.
"""
from pathlib import Path
from PIL import Image
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'assets/references/cinnamon_actions_sheet.png'
OUT=ROOT/'assets/sprites/cinnamon'
image=Image.open(SOURCE).convert('RGBA')
# Each crop is an explicitly inspected region in the 1448 x 1086 source.
# (rectangle, face anchor x in untrimmed source; optional internal effects are retained).
RECTS={
 'idle_00':((12,8,151,191),86),
 'idle_01':((164,8,309,191),238),
 'idle_02':((321,8,468,191),393),
 'idle_03':((471,8,613,191),544),
 'idle_04':((620,8,766,191),705),
 'idle_05':((788,8,943,191),861),
 'run_00':((13,202,211,358),120),
 'run_01':((234,202,450,359),358),
 'run_02':((466,202,672,359),572),
 'run_03':((676,202,888,359),784),
 'run_04':((893,202,1058,359),970),
 'run_05':((1061,202,1240,359),1148),
 'dash_00':((420,365,719,502),595),
 'dash_01':((735,363,1016,504),893),
 'jump_00':((214,512,423,654),326),
 'jump_01':((445,512,645,655),556),
 'fall_00':((653,510,824,657),745),
 'land_00':((835,515,1025,655),936),
 'swish_00':((235,666,485,825),364),
 'swish_01':((500,666,757,824),618),
 'hurt_00':((112,818,267,920),196),
 'hurt_01':((279,820,450,915),366),
 'victory_00':((464,929,600,1083),537),
 'victory_01':((588,929,745,1083),663),
 'victory_02':((745,925,900,1083),820),
 'shake_00':((886,926,1081,1083),966),
}
OUT.mkdir(parents=True,exist_ok=True)
manifest={"source":"assets/references/cinnamon_actions_sheet.png","source_sha256":hashlib.sha256(SOURCE.read_bytes()).hexdigest(),"status":"source-cutout-verified-not-artist-approved-runtime-animation","canvas":[240,160],"face_anchor_px":145,"foot_anchor_px":147,"frames":{}}
for name,(rect,face_x) in RECTS.items():
 crop=image.crop(rect)
 # Remove only near-zero-alpha antialiasing remnants and RGB fringes.
 a=crop.getchannel('A').point(lambda v: 0 if v<18 else v)
 crop.putalpha(a)
 bb=a.getbbox()
 if bb is None: raise RuntimeError('empty crop: '+name)
 # Keep transparent margins around the actual character, but forbid neighboring sprites.
 # Scale consistently from the same source sheet rather than normalizing every pose to 100% height.
 scale=0.76
 w,h=crop.size
 new=(round(w*scale),round(h*scale))
 scaled=crop.resize(new,Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(240,160))
 # Main torso/face stays near x=101 in all gameplay sequences.
 anchor_x=145-round((face_x-rect[0])*scale)
 # Ground baseline comes from source frame bottoms (project-specific authoring anchor).
 dest_y=147-new[1]
 canvas.alpha_composite(scaled,(anchor_x,dest_y))
 bb2=canvas.getchannel('A').getbbox()
 if bb2 is None or bb2[0]<0 or bb2[2]>240 or bb2[1]<0 or bb2[3]>160:
  raise RuntimeError(f'clipped {name}: {bb2}')
 dest=OUT/(name+'.png'); canvas.save(dest,optimize=True)
 manifest['frames'][name]={"file":str(dest.relative_to(ROOT)),"sha256":hashlib.sha256(dest.read_bytes()).hexdigest(),"source_rect":rect,"pixel_bounds":bb2}
(OUT/'frames.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f"CREATED {len(RECTS)} source cut-outs; source hash {manifest['source_sha256'][:12]}")
