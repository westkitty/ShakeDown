#!/usr/bin/env python3
"""Compile an LM Arena visual production packet from approved source + actual repo state.
Outputs: editable Markdown + JSON specification + clean PDF. No assets are silently generated.
"""
from __future__ import annotations
from pathlib import Path
from collections import Counter,defaultdict
from PIL import Image
from io import BytesIO
import hashlib,json,re,textwrap,datetime
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.enums import TA_LEFT,TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Image as RLImage,Table,TableStyle,KeepTogether,HRFlowable

ROOT=Path(__file__).resolve().parents[1]
BASE=json.loads((ROOT/'docs/level1/ShakeDown_Level1_Asset_Contract.json').read_text())
FRAMES=json.loads((ROOT/'assets/sprites/cinnamon/frames.json').read_text())
DEST=ROOT/'docs/assets';DEST.mkdir(exist_ok=True)
PALETTE={
 'outline_dark':'#31211c','panda_orange':'#d96a32','panda_cream':'#ffedc9','panda_paw':'#55382f',
 'headband_blue':'#217fbc','shorts_olive':'#858e45','shirt_grey':'#758da0','campus_navy':'#22477f',
 'campus_gold':'#ebc666','masonry_warm':'#ceb298','grass_green':'#609869','shake_mint':'#a8efad',
 'fox_orange_candidate':'#c86638','fox_purple_scarf_candidate':'#594366','danger_coral':'#eb6266'
}
REFS=['assets/references/cinnamon_master_sheet.png','assets/references/cinnamon_actions_sheet.png']
ASSETS=[]

def parse_size(value):
 if isinstance(value,list):return list(map(int,value))
 if isinstance(value,str):
  match=re.search(r'(\d+)\s*[xX]\s*(\d+)',value)
  if match:return [int(match[1]),int(match[2])]
 raise ValueError(value)

def add(id,name,group,visual,role,zone,filename,wh,source=None,priority='P1',pivot='center',alpha=True,collision='none',animation='static',references=None,dependency='',status='MISSING_GENERATION',notes=''):
 w,h=parse_size(wh);sw,sh=parse_size(source or f'{w*2}x{h*2}')
 if id in [a['id'] for a in ASSETS]:raise ValueError('Duplicate id '+id)
 ASSETS.append({'id':id,'name':name,'group':group,'visual':visual,'role':role,'zone':zone,
  'path':filename,'target_px':[w,h],'source_px':[sw,sh],'priority':priority,'pivot':pivot,
  'transparent':alpha,'collision':collision,'animation':animation,'references':references or REFS,
  'dependencies':dependency or 'Cinnamon references + shared palette','status':status,'notes':notes,'format':'PNG RGBA' if alpha else 'PNG RGB'})

# Every legacy request remains traceable. The earlier packet is not discarded.
for a in BASE['assets']:
 w,h=parse_size(a['output_px']);source=parse_size(a['source_px']);prefix=a['category'];
 animation='one frame for this specific listed state; do NOT merge with other states' if prefix in ('FX','EN','MC','VF') else 'single static component'
 add(a['id'],a['title'],prefix,a['visual'],a['role'],a['zone'],a['filename'],[w,h],source,a['priority'],
     a['anchor'],a['alpha'],a['collision'],animation,
     dependency='Legacy approved Level 1 asset design + supplied reference sheets',status='MISSING_GENERATION',notes=a.get('variant',''))

# Source-derived assets already exist and are documented with actual sha256; no re-generation order.
for i,(name,frame) in enumerate(sorted(FRAMES['frames'].items())):
 add(f'CIN-EX-{i:02}',f'Cinnamon approved-source cut-out — {name}','CIN',
     f'Preserve the exact {name} pose and face/tail/clothing details in the supplied source reference. This record identifies an EXISTING source-derived PNG; do not produce a substitute unless the integrator explicitly rejects it. If rejected, revise against the full model sheet retaining the pose, silhouette and expression at the given 240x160 playback frame.',
     'Runtime player animation','all',frame['file'],[240,160],[1448,1086],'EXISTING',
     'face=(145,147 feet) on a 240x160 canvas',True,'none (player body AABB 38x60 authored separately)',
     f'single frame {name}, selected at runtime according to action/state',
     dependency='Uploaded action reference + verified deterministic cut-out',status='VERIFIED_IN_REPO_LOCAL_BROWSER',
     notes='Source rectangle '+str(frame['source_rect'])+'; verified SHA256 '+frame['sha256'])

# Deliberate and limited new Cinnamon animation generation tasks. Do not recreate source poses.
CIN_NEW=[
 ('CIN-N01','Landing recovery neutral','Two consecutive settle poses: front foot planted, ears bouncing, black glasses level; separately output a landing settle frame.','Player game-feel recovery','240x160','P1','land_recover'),
 ('CIN-N02','Climb contact left','Hanging from architectural stone ledge, paws visibly hooked on lip; single ringed tail droops; blue headband never moves.','Dome ledge hold','240x160','P1','climb_hold'),
 ('CIN-N03','Climb mantle','Cinnamon pushes from a hanging ledge to an upright landing with weight on front paw, side-view.','Dome ledge pull-up','240x160','P1','climb_mantle'),
 ('CIN-N04','Shake pickup celebration','Quick one-hand celebratory lift with green paper cup held independent for in-engine compositing; NO drink painted into character pixels.','Pickup reaction','240x160','P1','pickup'),
 ('CIN-N05','Boss dodge recovery','Low crouch and raised paw, glasses secure, striped tail splayed left; recovery after dash.','Boss dodge','240x160','P1','dodge_recover'),
 ('CIN-N06','Final birthday cheers','Standing arms raised, open grin, excited eyes, unchanged blue headband/shirt/shorts. NO cake or extra props on sprite.','Finale choreography','240x160','P0','birthday_celebrate'),
 ('CIN-N07','Sip finishing pose','Relaxed side-on seated posture taking drink from independent cup prop with correct paw fingers and separated straw.','Shamrock Shake payoff','240x160','P1','sip'),
]
for id,name,visual,role,dims,pri,short in CIN_NEW:
 add(id,name,'CIN',visual,role,'finale' if short in ('sip','birthday_celebrate') else 'dome',
 f'assets/production/cinnamon/{short}.png',dims,'480x320',pri,'face=(145,147 feet)',True,
 'player physics stays 38x60, art-only extension','one PNG frame; do not pack with adjacent frames',dependency='All 26 verified Cinnamon cutouts + source sheets',
 status='MISSING_GENERATION',notes='The currently integrated frame sequences remain the fallback.')

# The user's Fox has no accepted model sheet; only a provisional candidate can be generated.
FOX=[
 ('FOX-01','Fox identity approval turnaround','Narrow true fox with a single long pointed white-tip tail, large upright triangular ears, orange/cream muzzle, sharp snout, mischievous eyebrow, purple scarf; absolutely NO red-panda markings, glasses or headband. Side view plus matching neutral front and three-quarter views allowed ONLY in this intentionally unified model sheet.','model sheet','1024x768','P0','center','none'),
 ('FOX-02','Fox idle flank','Fox faces camera-left with narrow sneer and smug visible gaze; isolated full body, white-tip tail offset behind.', 'boss idle','240x240','P0','(120,215)','none'),
 ('FOX-03','Fox run contact','Long-limbed fox side-profile forward stride, scarf trails, white-tip tail streaming; no cup painted into sprite.', 'intro and escape','240x240','P0','(120,215)','none'),
 ('FOX-04','Fox run airborne','Full-body gallop passing pose, paws lifted, single long fox tail; consistent ears/scarf.', 'intro and escape','240x240','P1','(120,215)','none'),
 ('FOX-05','Fox charge tell','Crouched poised fox, bright intensely focused eyes, forepaw planted, scarf lifted by impending forward strike; no red flash baked in.', 'boss attack windup','240x240','P0','(120,215)','none'),
 ('FOX-06','Fox charge lunge','Side-view horizontal lunge with extended forepaws and pronounced forward motion, paws within safe transparent canvas.', 'boss charge active','240x240','P0','(120,215)','none'),
 ('FOX-07','Fox volley ready','Fox braces back foot and raises gadget with green confetti-cup cartridges; no actual projectiles baked in.', 'boss projectile windup','240x240','P0','(120,215)','none'),
 ('FOX-08','Fox volley release','Fox points gadget toward Cinnamon off-frame; recoil in shoulders, fox still legibly upright.', 'boss projectile release','240x240','P1','(120,215)','none'),
 ('FOX-09','Fox stun frame A','Fox dizzy stagger after missed attack; squashed posture with eyebrows lifted, scarf droops.', 'boss rest vulnerability','240x240','P0','(120,215)','none'),
 ('FOX-10','Fox stun frame B','Second stagger pose with paws spread, ears skewed, white tip tail visible.', 'boss rest vulnerability','240x240','P1','(120,215)','none'),
 ('FOX-11','Fox hurt recoil','Fox recoils one body-width after true tail-swish hit, expression shock; no gore.', 'boss damaged','240x240','P0','(120,215)','none'),
 ('FOX-12','Fox defeated','Comedic flattened fox sits with arms crossed and purple scarf skewed, defeated but not injured.', 'boss defeat','240x240','P0','(120,215)','none'),
 ('FOX-13','Fox taunt portrait','Close-up fox mischievous three-quarter grin, orange/cream pointed muzzle, purple scarf, ears tall, one tail not visible in crop.', 'dialogue','256x256','P1','center','none'),
 ('FOX-14','Fox cardboard decoy','Life-size flat cardboard standee of THE SAME Fox with intentionally painted-on grin, visible cardboard side thickness and folding feet.', 'intro comedy and secret','256x256','P2','bottom-center','none'),
 ('FOX-15','Fox getaway silhouette','Small distance-scaled single-tail fox streaking into campus backdrop, ears long, no shake painted into hands.', 'intro distance silhouette','192x128','P1','bottom-center','none'),
 ('FOX-16','Fox happy truce','Reluctant birthday handshake pose, fox and separately composed cup prop should not overlap.', 'optional finale cameo','240x240','P2','(120,215)','none'),
]
for id,name,visual,role,dims,pri,pivot,collision in FOX:
 sheet=id=='FOX-01'
 add(id,name,'FOX',visual,role,'intro,boss',f'assets/production/fox/{id.lower().replace("-","_")}.png',dims,
    '1536x1152' if sheet else '480x480',pri,pivot,not sheet,collision,
    'model-sheet only' if sheet else 'single action state/frame, not a sheet; boss 3 hits, 2 telegraphed attack families',
    dependency='FOX-01 approved reference needed before final PROMOTED status',status='PROVISIONAL_MISSING_APPROVAL',
    notes='Provisional Fox candidate. Human signoff required before canonical art replacement.')

# Expanded Dome: requires solid gameplay geometry, lighting layers and identifiable architecture.
DOME_BGS=[
 ('DM-BG01','Dome approach hero panorama','Side-scrolling picturesque Notre Dame Main Building on broad quad approach with golden cupola, symmetrical masonry facades, trees flanking without obstructing play. No playable ledges painted into backdrop.','960x540','P0',False),
 ('DM-BG02','Dome wall parallax midground','Tall light limestone / rosy masonry wall with repeated window arches, buttresses and cornices; vertical seamless extension top/bottom, low contrast behind players.','960x1080','P0',True),
 ('DM-BG03','Golden afternoon sky','Clear soft pale azure sky warming to cream-gold toward horizon; atmospheric clouds confined to top third, no architecture.','960x540','P1',False),
 ('DM-BG04','Distant campus vista','Elevated view across leafy South Bend campus, small low collegiate buildings and tree canopy. Mild haze and golden afternoon. No people.','960x540','P1',True),
 ('DM-BG05','Dome lower roof foreground','Warm stone parapets, partial carved rooftop decorations and railings facing camera, transparent to reveal gameplay platforms.','960x540','P1',True),
 ('DM-BG06','Bell Gallery shadow layer','Dark ochre beams, masonry openings and interior depth shapes, fully orthographic and low-frequency.','960x540','P2',True),
 ('DM-BG07','Summit sky panorama','Gold-suffused blue sky high above Notre Dame, wispy clouds, distant treeline; open middle 60% for boss telegraph.','960x540','P0',False),
 ('DM-BG08','Fox finale night glow','Subtle blue-gold vignette and celebratory distant campus lights with transparent center; no physical scene content.','960x540','P2',True),
]
for id,name,visual,dims,pri,alpha in DOME_BGS:
 add(id,name,'DM-BG',visual,'Dome parallax/landmark layer','dome','assets/production/dome/backgrounds/'+id.lower().replace('-','_')+'.png',dims,None,pri,'top-left',alpha,'none','static repeat as specified in integration metadata',dependency='Original Notre Dame Golden Dome silhouette and character palette')
DOME_TILES=[
 ('DM-TL01','Limestone walkable cap','Side-view 32px seamless cream limestone walkway bright top lip, no perspective skew.', '32x32','P0','tile AABB'),
 ('DM-TL02','Limestone side brick','Plain low-contrast light stone masonry repeat tile with shallow hairline seams.','32x32','P0','fill only'),
 ('DM-TL03','Gold roof tile','Warm gold panel with thin ochre rib, repeat in both x and y, no gradient bloom.','32x32','P0','tile AABB'),
 ('DM-TL04','Curved roof eave left','Single left-curving ornate gold dome eave segment; meets DM-TL03 seam on right.','32x32','P1','corner display only'),
 ('DM-TL05','Curved roof eave right','Mirrored curved right dome eave cap seamless with DM-TL03 to left.','32x32','P1','corner display only'),
 ('DM-TL06','Cornice center','Architectural carved cream limestone platform cornice with flat collidable top.','32x32','P0','one-way AABB top'),
 ('DM-TL07','Cornice left cap','Endcap matched to DM-TL06 with rounded sculpted profile, top level exactly same y.','32x32','P1','one-way AABB top'),
 ('DM-TL08','Cornice right cap','Matching right endcap of carved cornice, top edge same y as center.','32x32','P1','one-way AABB top'),
 ('DM-TL09','Scaffold deck center','Deep navy parade-stage plank with bright gold safety rim and strong top line.','32x32','P0','one-way AABB top'),
 ('DM-TL10','Scaffold steel support','Thin blue-grey lattice bracing for temporary platforms, decor only and repeatable vertically.','32x32','P1','no collision'),
 ('DM-TL11','Arch keystone','One decorated limestone keystone joining tall windows, stylized geometric stone relief.','64x64','P1','no collision'),
 ('DM-TL12','Window half arch left','Half of symmetrical gothic-ish Romanesque cream stone arch side; transparent inner glass aperture.','64x64','P1','no collision'),
 ('DM-TL13','Window half arch right','Matching right arch to DM-TL12; precise aligned joint.','64x64','P1','no collision'),
 ('DM-TL14','Cracked landing platform','Readable chipped surface and pale fissures, same collision line as DM-TL01; not collapsing unless script authorizes.','32x32','P2','one-way AABB top'),
 ('DM-TL15','Gold dome rib vertical','Narrow gold rib with high contrast edge, 32 wide repeat vertically along curved gold silhouette.','32x64','P1','no collision'),
 ('DM-TL16','Summit parapet block','Stout gold/stone crenellated parapet shape with explicit flat support top.','64x64','P0','one-way AABB top'),
]
for id,name,visual,dims,pri,collision in DOME_TILES:
 add(id,name,'DM-TL',visual,'Dome authored collision art or decoration','dome','assets/production/dome/tiles/'+id.lower().replace('-','_')+'.png',dims,None,pri,'tile top-left',True,collision,'static tile, edge seams must align',dependency='32px world tile grid and existing platforms geometry')
DOME_PROPS=[
 ('DM-PR01','Main Building window module','Tall rectangular warm stone window with pale blue reflective panes, dark brown framing, limestone sill; no words or people.','128x192','P0'),
 ('DM-PR02','Main Building pilaster','Segmented limestone column/pilaster with carved base and capital; source must tile vertically.','128x256','P1'),
 ('DM-PR03','Cupola hero silhouette','Recognizable broad golden hemisphere roof above straight symmetrical stone base, gold illuminated bands; do not add a separate statue to this layer.','512x384','P0'),
 ('DM-PR04','Mary statue silhouette','Independent simplified golden Marian statue silhouette with head, outstretched arms, straight upright pose and support plinth; accurate recognizable golden finish, respectfully rendered.','160x256','P0'),
 ('DM-PR05','Summit railing section','Ornate cream and gold metal safety railing low enough that it cannot obscure Cinnamon or boss hitboxes.','256x96','P1'),
 ('DM-PR06','Blue-and-gold heraldic pennant','Small clean fabric pennant on thin pole with no copyrighted logos or illegible lettering, lateral wind fold.','128x192','P1'),
 ('DM-PR07','Gilded bell arch ornament','Decorative small arch with dangling brass bell, simplified dark interior negative space.','256x256','P2'),
 ('DM-PR08','Rooftop sandstone gargoyle','Friendly stylized stone grotesque ornament guarding an eave, no moving hazard unless implemented.','128x128','P2'),
 ('DM-PR09','Sunlit cornice column','Tall square carved stone pillar segment with top, middle and base readable as one clean modular unit.','128x256','P1'),
 ('DM-PR10','Final summit flag','Blue field and gold fringed victory standard anchored on parapet, no writing; tip to the right.','160x256','P1'),
]
for id,name,visual,dims,pri in DOME_PROPS:
 add(id,name,'DM-PR',visual,'Dome atmosphere and architecture dressing','dome','assets/production/dome/props/'+id.lower().replace('-','_')+'.png',dims,None,pri,'base-center' if id not in ('DM-PR03','DM-PR04') else 'bottom-center',True,'none unless separately scripted','static prop',dependency='Dome hero backdrop and actual level geometry, not baked collisions')
DOME_MECH=[
 ('DM-MC01','Moving lift deck idle','Solid cream-gold roof repair lift with navy frame and flat walkable upper edge; no wheels on platform.','256x64','P0','one-way moving AABB'),
 ('DM-MC02','Moving lift undercarriage','Mechanical navy/gold suspender rails below DM-MC01 platform; art visually separate, no collisions.','256x128','P1','none'),
 ('DM-MC03','Pulse banner bridge off','Retracted cloth walkway in deep blue/gold, visibly non-solid silhouette but still detectable as interaction.','256x64','P0','inactive non-collidable'),
 ('DM-MC04','Pulse banner bridge on','Fully extended taut wide blue banner with golden lip, exact left/top edge as DM-MC03.','256x64','P0','active one-way AABB'),
 ('DM-MC05','Dome relay drum quiet','Small blue/gold heraldic drum beacon with stone base, no glowing ring.','128x128','P0','interaction AABB only'),
 ('DM-MC06','Dome relay drum activated','The exact same drum beacon outline and dimensions with bright gold pulse echo ring.','128x128','P0','interaction AABB only'),
 ('DM-MC07','Gilded checkpoint dark','Metal campus pennant post unlit and tucked; matches glowing state outline precisely.','128x192','P0','proximity checkpoint'),
 ('DM-MC08','Gilded checkpoint active','Same post with golden lit lantern and cloth flag lifting; no baked on-screen UI copy.','128x192','P0','proximity checkpoint'),
 ('DM-MC09','Final Summit Gate locked','Tall double leaf decorative palace gate with visible central fox emblem, closed, full scene object.','256x320','P1','gate collision bounds'),
 ('DM-MC10','Final Summit Gate open','Exactly same gate silhouette but each leaf pivots outward, transparent pass-through center.','256x320','P1','no collision when open'),
]
for id,name,visual,dims,pri,col in DOME_MECH:
 add(id,name,'DM-MC',visual,'Dome authored interactive object','dome','assets/production/dome/mechanics/'+id.lower().replace('-','_')+'.png',dims,None,pri,'bottom-center' if 'checkpoint' in name.lower() else 'top-left',True,col,
     'single exact mechanic state; pair shares identical pivot and bounds',dependency='World pulse script, collision and alternate matching state')

BOSS_FX=[
 ('BS-VF01','Charge telegraph ring','Bright coral red outlined circular warning ring with transparent hollow center and three ticks toward approaching player; no fill.','256x256','P0'),
 ('BS-VF02','Charge direction streak','Very horizontal translucent red/orange arrows compressed toward one direction; independent FX sprite, not a character.','256x96','P0'),
 ('BS-VF03','Fox charge dust burst','Dust swirls and curling gold leaves around a foot-level streak, no fox silhouette.','192x96','P1'),
 ('BS-VF04','Fox confetti projectile','Small compact hazard cup-shaped red/orange confetti projectile clearly distinct from green collectible Shake.','64x64','P0'),
 ('BS-VF05','Fox volley warning','Three red chevrons and short dotted line pointing toward likely volley trajectories; transparent outline only.','192x96','P0'),
 ('BS-VF06','Fox stagger stars','Tiny trio of warm golden stars plus two navy orbit scribbles; readable at 32px.','96x96','P0'),
 ('BS-VF07','Fox hit shimmer','Sharp gold starburst with cream highlights and 2 frames suggested as separate output in downstream variant.','128x128','P1'),
 ('BS-VF08','Boss health pip full','Bright red fox-shaped heart-gem with golden rim; no lettering and no face portrait.','64x64','P0'),
 ('BS-VF09','Boss health pip empty','Same pip silhouette but cool desaturated dark blue empty variant, shared anchor.','64x64','P0'),
 ('BS-VF10','Boss defeated puff','Soft comic dissipating fox-colored vapor cloud, harmless readable confetti, no character embedded.','192x128','P1'),
 ('BS-VF11','Summit shockwave','Transparent expanding flattened arc with gold edge, intended as boss charge rebound impact.','256x64','P1'),
 ('BS-VF12','Fox victory truce sparkle','Mellow celebratory gold sparkle around fox defeated pose, no actual body or props.','128x128','P2'),
]
for id,name,visual,dims,pri in BOSS_FX:
 add(id,name,'BS-VF',visual,'Boss readability, counterplay and feedback','boss','assets/production/boss/effects/'+id.lower().replace('-','_')+'.png',dims,None,pri,'center',True,'FX only, separate from hitboxes','single state, no spritesheet unless intentional sequence is later verified',dependency='Fox art approved by human + boss state machine')

BIRTHDAY=[
 ('BD-01','Birthday cake full base','Two-tier celebratory birthday cake with pink frosting, pale cream swirls, gold trim and small shamrock motif; isolated independent cake only, no characters.','512x384','P0'),
 ('BD-02','Birthday cake frosting flourish','Additional small isolated icing ribbons and decorative cream dollops with clear alpha for compositing onto BD-01.','256x128','P1'),
 ('BD-03','Cake candle set unlit','Eight short blue candles in a row, matching spacing and individual rectangular bases, unlit.','256x96','P0'),
 ('BD-04','Cake candle set lit','Same eight candles exact placement with glowing gold flames, independent transparency.','256x96','P0'),
 ('BD-05','Shamrock Shake hero cup','Full-size iconic mint green milkshake in paper cup with domed whipped topping, striped straw and dark green sleeve, 3/4 side consistent with pickups.','256x384','P0'),
 ('BD-06','Victory milkshake trio','Three separately isolated matching green milkshake cups at slightly varied sizes, shared prop identity; single intentionally unified set with no people.','512x256','P1'),
 ('BD-07','Birthday bunting arc','Wide blue/gold/green zigzag paper garland that can span viewport without text or logos.','960x192','P1'),
 ('BD-08','Birthday confetti master','40 discrete separately spaced particle shapes in blue, green, gold and coral on transparent source; game artist will crop and register each as procedural atlas inputs.','512x256','P1'),
 ('BD-09','Birthday sparkle burst A','Single rising warm gold star shower with 12 bright marks arranged as one short effect sprite.','256x256','P1'),
 ('BD-10','Birthday sparkle burst B','Second independent celebratory shower variant with green/cream streaks and no white flash.','256x256','P1'),
 ('BD-11','Victory stage backdrop','Warm Notre Dame rooftop party tabletop and distant celebratory rail, no names or characters; leave center-left dark for UI text.','960x540','P0'),
 ('BD-12','Victory frame plaque','Gold-and-navy decorative empty rectangular banner frame with generous central blank space for runtime accessible HAPPY BIRTHDAY, MAVERICK! text; never bake text in generated image.','960x256','P0'),
 ('BD-13','Cake reveal poof','White/cream swirl puff revealing surprise cake from below, transparent 1-shot effect separated from cake body.','256x192','P1'),
 ('BD-14','Golden shamrock medal','Gold medallion with translucent small mint shamrock inset, never plain birthday cake trophy or Bethel crest.','128x128','P2'),
]
for id,name,visual,dims,pri in BIRTHDAY:
 add(id,name,'BD',visual,'Birthday finale visual celebration','finale','assets/production/birthday/'+id.lower().replace('-','_')+'.png',dims,None,pri,'top-left' if '960x' in dims else 'bottom-center',True,'none (decorative only)','single static state/one-shot sprite',dependency='Cinnamon existing victory pose + birthday DOM text + independent Shake cup source')

UI_EXP=[
 ('UX-01','Main title backdrop','Dark navy blue-gold editorial birthday arcade title screen with blank center for editable HTML title and button, campus skyline / distant gold dome at bottom.','960x540','P1'),
 ('UX-02','Title panel border','Crisp SNES-inspired blue and gold UI 9-slice empty central rectangle frame, corners consistent, no text.','480x256','P1'),
 ('UX-03','Pause window frame','Dark blue 9-slice panel with thin cream-gold border and simple corner detailing, no wording or buttons.','512x384','P1'),
 ('UX-04','Death/retry panel frame','Muted navy UI panel with small comic curled leaf ornaments and gold trim, no text.','512x384','P1'),
 ('UX-05','Victory UI frame','Large rich gold and navy rectangular panel with space for native HAPPY BIRTHDAY, MAVERICK! type, not baked words.','640x384','P0'),
 ('UX-06','Pause button icon','Compact two solid cream parallel bars on navy tile, no letters.','64x64','P1'),
 ('UX-07','Touch dash glyph','Little boot speedlines and arrow on navy transparent tile, no lettering.','64x64','P1'),
 ('UX-08','Touch jump glyph','Small upward springing paw silhouette, strong outline and transparent background.','64x64','P1'),
 ('UX-09','Touch swish glyph','Single ringed-tail arc icon, blue/gold round border; readable as tail attack not spin or sword.','64x64','P1'),
 ('UX-10','Boss HP frame','Thin gold SNES bar border with empty central fill, maximum 3-hit boss HP, no numerals.','256x64','P1'),
 ('UX-11','Checkpoint popup art','Horizontal two-color small ornate pop-up frame, no checkpoint words baked.','384x96','P2'),
 ('UX-12','Shake counter HUD frame','Small dark navy counter slot with cream edge for DOM numeric value; no cup duplication.','256x64','P1'),
 ('UX-13','Story Fox portrait frame','Compact square tan/gold quote panel backing, portrait imported separately; no Fox in the frame art.','256x256','P2'),
 ('UX-14','Assist mode marker','Tiny mint paw icon within cream outline, 64x64; no text.','64x64','P2'),
]
for id,name,visual,dims,pri in UI_EXP:
 add(id,name,'UIX',visual,'Persistent interface or menu art','all','assets/production/ui/'+id.lower().replace('-','_')+'.png',dims,None,pri,'top-left' if parse_size(dims)[0]>=256 else 'center',True,'none','static, 9-slice when frame',dependency='Native accessible DOM text and touch hit areas; art must never own interaction')

PICKUPS=[
 ('PK-01','Shake cup flip frame A','Mint green takeaway shake cup with whipped top, rotates 0 degree front-facing, no shadow, 64px alpha frame.','64x64','P1'),
 ('PK-02','Shake cup flip frame B','Same cup turned one eighth rotation, preserves label colors and handle/straw consistency.','64x64','P1'),
 ('PK-03','Shake cup flip frame C','Same cup at quarter rotation, cream lid narrower due to perspective, no extra contents.','64x64','P1'),
 ('PK-04','Golden shake secret pulse','Gold-bordered green cup with small orbiting four-leaf clover on otherwise empty 64px canvas.','64x64','P1'),
 ('PK-05','Heart pickup','Single red/pink heart with dark brown retro outline and 3-tone highlights, no lettering.','64x64','P2'),
 ('PK-06','Speed paw booster','Temporary green pawprint speed boost token with tiny gold motion-line motif.','64x64','P2'),
]
for id,name,visual,dims,pri in PICKUPS:
 add(id,name,'PK',visual,'Collectible animation or optional power-up','campus,dome','assets/production/pickups/'+id.lower().replace('-','_')+'.png',dims,None,pri,'center',True,'radial pickup radius authored separately','single frame for this specific named animation state',dependency='CO-01 pickup art + runtime entity metadata')

EXTRA=[
 ('EX-VF01','Dome jump burst','Cream dust puff and faint golden leaf after Cinnamon leaps from stone cornice; independent effect.','128x96','P1'),
 ('EX-VF02','Dome moving lift motor dust','Navy/cream mechanical small puffs below lift motor, no particles masking the platform top.','128x96','P1'),
 ('EX-VF03','Pulse bridge warning tick','Thin bright gold line segment sliding along top of soon-to-retract banner bridge; no huge overlay.','256x32','P1'),
 ('EX-VF04','Shamrock counter fly-up','A single mint green cup silhouette leaving a short 4-pixel gold sparkle trail for HUD pickup feedback.','128x96','P1'),
 ('EX-VF05','Golden summit sunray','Wide transparent diagonal cream-gold sunbeam, low opacity, cannot obscure collision cues.','960x540','P2'),
 ('EX-VF06','Assist mode safe landing ring','Soft pale mint horizontal contact ellipse that only appears under a safe player footing, no solid fill over sprite.','128x32','P2'),
 ('EX-VF07','Fox win impact','Golden shamrock-shaped burst around Fox during actual final hit; source effect must not contain the character.','256x256','P1'),
 ('EX-VF08','Bonus secret reveal shimmer','Small orange/gold concentric animated marker revealing hidden token, not a required gameplay hint.','128x128','P2'),
]
for id,name,visual,dims,pri in EXTRA:
 add(id,name,'EX-VF',visual,'Interactivity/impact readability','all','assets/production/effects/'+id.lower().replace('-','_')+'.png',dims,None,pri,'center',True,'FX only','single VFX key pose/independent output',dependency='Named gameplay event and existing Canvas renderer')

# ---------------------------------------------------------------------------
# Compile release contract, literal self-contained prompts and exportable media.
# ---------------------------------------------------------------------------
GROUP_NAMES={
 'BG':'CAMPUS BACKGROUNDS / QUAD', 'TL':'CAMPUS TERRAIN / COLLISION TILES',
 'EN':'CAMPUS ENEMY STATES', 'PR':'CAMPUS PROPS / LANDMARKS',
 'MC':'CAMPUS PULSE OBJECTS', 'CO':'COLLECTIBLES', 'VF':'CAMPUS VISUAL EFFECTS', 'FX':'TRANSITIONS / STORY EFFECTS',
 'UI':'BASE INTERFACE', 'FOX':'THE FOX / INTRO AND BOSS',
 'CIN':'CINNAMON SOURCE SPRITES / REFINEMENTS', 'DM-BG':'DOME PARALLAX / VIEWPORTS',
 'DM-TL':'DOME STONE / GOLDEN TILES', 'DM-PR':'DOME ARCHITECTURE / PROPS',
 'DM-MC':'DOME MECHANICS', 'BS-VF':'BOSS ATTACK READABILITY',
 'BD':'BIRTHDAY REVEAL / CAKE / SHAKES', 'UIX':'ADDITIONAL UI / TOUCH',
 'PK':'COLLECTIBLES / POWERUPS / PICKUP FRAMES', 'EX-VF':'ADDITIONAL EFFECTS'}

RUNTIME_MAP={
 'intro':'Initial theft vignette, x=0 to 700. Player begins on the South Bend campus lawn.',
 'campus':'Campus movement and blue/gold pep rally quad, approximately x=700 to 3770.',
 'quad':'The quad gameplay half: steps, drum triggers, patrols, retracting bridge, and checkpoints.',
 'dome':'The playable Golden Dome second half, approximately x=3770 to 8350; ascending cornices, lifts, roof ribs, checkpoints and skyline.',
 'boss':'Summit arena at the end of the Dome route; three clear hits and staged charge / volley / recovery tells.',
 'finale':'After boss victory the runtime renders a cake, Shamrock Shakes, celebration and editable HAPPY BIRTHDAY, MAVERICK! text.',
 'all':'Shared UI, character, effects, pickups, and worldwide environment components.'}

GLOBAL_LOCK='''SHAKEDOWN LEVEL 1 / BIRTHDAY EDITION. Produce one independent art asset for the mobile-first Canvas 2D side-view platformer. Canonical visual identity: supplied CINNAMON FUZZBUTT MASTER SPRITE SOURCE SHEET and supplied CINNAMON ACTIONS SHEET (attached to the PDF). Artwork is clean illustrated 16-bit/SNES-inspired pixel-art with rich controlled stepped two-tone shading, smooth 1-3 px dark outlines at the final 64px sprite scale, expressive anatomy, consistent side-on orthographic game camera, a warm stone/sage lawn palette, campus navy #22477F and cream gold #EBC666, and rich mint green #A8EFAD only for shake items. No 3D mockups, cinematic photograph, generative blur, text hallucinations, watermark, UI screenshots or unrelated subjects. Cinnamon is a red panda, NEVER a fox, cat, or raccoon; his approved round black glasses, blue headband, gray shirt, olive cargo shorts, dark paws, oversized orange/black banded tail are immutable. Do not copy the Cinnamon design onto the Fox. University of Notre Dame campus has a recognizable Main Building and Golden Dome crowned with golden Marian statue, but the layout is deliberately game-fictional for legible platforming. No Bethel University. Gameplay contrast overrides photographic campus accuracy.'''

CIN_LOCK='''Cinnamon reference is compulsory for style/proportion/identity; any requested new Cinnamon sprite must match the 26 physically cut frames, same one ringed tail, one head, round glasses, blue headband, gray shirt and olive cargo shorts. Preserve foot-line and silhouette; no random accessories, missing glasses, new markings or costume drift. User-provided source is the visual canon; do not improvise a different red panda.'''
FOX_LOCK='''Fox appearance is a PROVISIONAL generation candidate, not accepted canon. Distinguish unmistakably from Cinnamon: fox not red panda, slender angular pointed muzzle, tall triangular ears, single long tail with white tip, no glasses, no headband, no ringed red-panda tail. Candidate palette bright russet/cream with a small deep-purple scarf. Before final integration, present the full Fox turnaround for user's signoff; subsequent states must derive from that accepted sheet; until approved, runtime procedural Fox art stays explicitly provisional.'''
TECH_LOCK='''Canvas engine: 960x540 logical screen, 32px tile contacts, source game inputs via canvas, DOM UI separate; source PNG frames are independent files, not grids or multi-panel mockups. No artwork defines collision by its alpha alone: developer controls solid tiles, one-way platforms, hazard rectangles, ground anchors and pickups separately. The generator supplies visual art only; the integrator must resize/crop to exact requested target pixel dimensions, verify real transparency, palette, edge seams, and origin metadata, and then register the output into a verified asset manifest before runtime use. A source photograph/turnaround/PDF page is NOT an integrated runtime sprite.'''


def a_group(a):
 g=a['group']
 if g=='CIN':return 'character'
 if g=='FOX':return 'character'
 if g in ('BG','DM-BG'):return 'background'
 if g in ('TL','DM-TL'):return 'tile'
 if g in ('MC','DM-MC'):return 'mechanic'
 if g in ('EN',):return 'enemy'
 if g in ('PR','DM-PR'):return 'prop'
 if g in ('CO','PK'):return 'pickup'
 if g in ('VF','FX','BS-VF','EX-VF'):return 'fx'
 if g in ('UI','UIX'):return 'ui'
 return 'finale'


def make_prompt(a):
 w,h=a['target_px'];sw,sh=a['source_px']
 at=a_group(a)
 is_existing=a['status'].startswith('VERIFIED')
 p=[f"LM ARENA AGENT MODE — SHAKEDOWN / GOLDEN DOME DASH — ONE INDEPENDENT ASSET {a['id']}: {a['name']}." ,
 GLOBAL_LOCK,
 f"OUTPUT REQUEST: generate precisely ONE {at} art output for {a['role']}. Where it appears: {a['zone']}. Subject/design: {a['visual']}",
 f"RENDER AND EXPORT CONTRACT: source artwork composition {sw} x {sh} pixels, {sw/sh:.3f}:1 aspect; exact cleaned game-ready PNG target {w} x {h} pixels, {w/h:.3f}:1 aspect. Name output file exactly {a['path']}. Deliver one individual image file, not a collage or contact sheet, plus the raw source where available. Pixel scale is a post-process target: if the generator cannot guarantee pixel-exact output, supply a high-resolution source and flag the need for deterministic resize and manual QA rather than claiming a compliant file.",
 f"CAMERA / REGISTRATION: {'full-bleed 2D side-on orthographic parallax plane' if at=='background' else 'side-on orthographic 2D gameplay item, perfectly isolated and centered inside a clear source canvas'}. Anchor / pivot: {a['pivot']}; collision declaration: {a['collision']}; animation-state contract: {a['animation']}. The actual game colliders are defined by code, not copied from artwork.",
 f"TRANSPARENCY: {'real straight-alpha RGBA, empty pixels alpha 0, no checkerboard burned in, no white halo, no drop shadow outside deliberate object design' if a['transparent'] else 'opaque RGB, full bleed, no fake transparent grid; seamless clear edges with no border'}. A fixed solid matte is only a rejected-source recovery path, never described as final alpha.",
 f"REQUIRED SOURCE VISUALS: {', '.join(a['references'])}. Both sheet images are provided at the start of this PDF for style authority. The Fox has NO user-approved turnaround, so that reference remains a required human gate. Dependent art must copy accepted Fox features exactly and not infer approval.",
 f"INTEGRATION DEPENDENCIES: {a['dependencies']}. Required priority {a['priority']} (P0=core first, P1=polish, P2=optional). Output role must remain visually legible at 64px gameplay scale, in bright campus backgrounds AND sunlit dome context, with high-contrast gameplay top edges when applicable.",
 f"ACCEPTANCE TEST: {a['acceptance']}",
 f"REJECT IF: {a['rejection']}",
 f"INTEGRATION HANDOFF: {a['integration']}",
 "Do not claim generated, export, alpha, dimensions, or integration verification unless actual files were produced and inspected; return the asset itself as a standalone image object, an exact output filename, any limitations, and a request for revision if needed. Never invent SHA256, atlas coordinates, or real file metadata."]
 if a['group']=='CIN':p.insert(3,CIN_LOCK)
 if a['group']=='FOX':p.insert(3,FOX_LOCK)
 if is_existing:p.insert(1,'EXISTING VERIFIED FILE: do not regenerate this Cinnamon frame as a new deliverable. This specification is for audit / repair ONLY. Keep the original existing source as the default; revise only if an integrator reports a concrete defect.')
 if at=='tile':p.append('TILE EDGE REQUIREMENT: art edges must meet exactly with adjacent tile copies; preserve a flat top lip where stated; one 32px world tile equals one authored grid cell, regardless of generation source resolution. No perspective shading that ruins the repeated flat gameplay plane.')
 if at in ('ui','background'):p.append('DO NOT BAKE LIVE TEXT: all headings, counters, accessibility instructions, and birthday name are separate runtime DOM/canvas text layers with localization/layout flexibility. Allow the specified text-safe regions to remain clear.')
 return '\n\n'.join(p)


for a in ASSETS:
 kind=a_group(a);w,h=a['target_px'];unique=a['name']
 if kind=='background':
  a['acceptance']=f'Painted parallax composition fills exactly {w}x{h} final pixels without stretched subjects or foreground colliders; low-contrast traversable negative space leaves player and telegraphs readable, 16-bit palette consistent.'
  a['rejection']='Playable ledges or signs baked into a background; wrong landmark silhouette; photorealism; text; high-contrast clutter masking the player; missing intentional sky/open space.'
 elif kind=='tile':
  a['acceptance']=f'Exact {w}x{h} authored tile, strong visible intended support edge, repeat seams invisible where tile type is repeatable, no canvas margin or stray pixels.'
  a['rejection']='Perspective tilt, non-level support line, seam discontinuity, detached floating pixels, baked entire platform assembly in one tile.'
 elif kind in ('character','enemy'):
  a['acceptance']=f'One unambiguous {unique} state with one subject, readable outline at 64px preview, consistent species/markings/costume, matching ground anchor and genuine RGBA edge; cropped limbs or tails rejected.'
  a['rejection']='Wrong species, pose inconsistency with approved reference, extra heads/limbs/tails, missing glasses on Cinnamon, fox copied red-panda bands, baked weapons/cups not authorized, frame misalignment.'
 elif kind in ('mechanic','pickup'):
  a['acceptance']=f'Silhouette identifies {unique} before player interaction; exact frame alignment shared with other named states, unambiguous activation color, real alpha, readable at final size.'
  a['rejection']='Mechanic state visually indistinguishable from inactive, illegible at runtime size, baked player/character, wrong collision top, change of pivot between paired states.'
 elif kind=='fx':
  a['acceptance']=f'Transparent impact/tell layer communicates {unique} in under 0.25s at game scale without hiding dangerous hitboxes or gameplay text.'
  a['rejection']='Opaque rectangle, full-screen blindness, bright flashing hazard with no alternate warning, oversized particle obscuring Cinnamon, embedded actor silhouette.'
 elif kind=='ui':
  a['acceptance']=f'Crisp readable icon/frame at specified dimensions; editable text remains a separate native DOM/canvas layer; touch target is coded >=44 CSS pixels.'
  a['rejection']='Baked spelling, tiny illegible labels, emoji fonts, click targets embedded into a PNG, visual interface replacing accessibility interactions.'
 else:
  a['acceptance']=f'Birthday art identifies {unique} at 960x540 composition scale; independent layered item with accurate mint cup/cake identity, full alpha unless marked opaque, editable text never baked.'
  a['rejection']='No cake, missing shamrock shakes, name spelled wrong, baked birthday message, unrelated characters, absent transparent alpha or cropped silhouette.'
 a['integration']=(f'Verify file bytes exist at {a["path"]}; measure intrinsic {w}x{h} after normalization, alpha and crop; record SHA256 and approved visual review; register logical ID {a["id"]} in runtime manifest. '
    f'At runtime map ID to {a["role"]}; place in {a["zone"]} with anchor {a["pivot"]}; use the engine auth collider "{a["collision"]}" instead of deriving physics from pixels. '
    f'Maintain functioning Canvas fallback until a browser screenshot, load trace and touch/keyboard journey show correctness. Animation states remain one file per requested state.')
 if a['group']=='CIN' and a['status'].startswith('VERIFIED'):
  a['integration']=f'ALREADY VERIFIED IN REPOSITORY. Existing file {a["path"]} has SHA256 captured from source extraction in frames.json and is used in Canvas 2D runtime animation. Preserve; replace only after diff and regression visual proof. Physics AABB remains independent.'
 a['prompt']=make_prompt(a)

# ---------------------------------------------------------------------------
# Promotion from the real integration manifest. An asset only leaves
# MISSING_GENERATION when bytes physically exist at its contract path and the
# manifest recorded a measured sha256 for them. Nothing here is assumed.
MANIFEST_PATH=ROOT/'assets/production/manifest.json'
MANIFEST={}
if MANIFEST_PATH.exists():
 MANIFEST=json.loads(MANIFEST_PATH.read_text()).get('assets',{})
GENERATED_STATUSES=('NORMALIZED_VERIFIED','INTEGRATED_BROWSER_CHECKED','APPROVED')
def is_generated(a):
 return a['status'] in GENERATED_STATUSES
for a in ASSETS:
 record=MANIFEST.get(a['id'])
 if not record:
  continue
 target=ROOT/a['path']
 if not target.exists():
  raise SystemExit(f'manifest claims {a["id"]} but {a["path"]} is absent')
 actual=hashlib.sha256(target.read_bytes()).hexdigest()
 if actual!=record.get('sha256'):
  raise SystemExit(f'{a["id"]} sha256 mismatch: manifest {record.get("sha256")} != disk {actual}')
 a['status']='PROVISIONAL_MISSING_APPROVAL' if a['group']=='FOX' else 'NORMALIZED_VERIFIED'
 a['has_bytes']=True
 a['sha256']=actual
 a['notes']=(f'Generated and normalized {record.get("generated_utc","")}; '
             f'measured {record.get("actual_px")}; sha256 {actual[:16]}…; '
             f'human visual/identity approval still open. '
             f'Alpha: {json.dumps(record.get("alpha",{}).get("mode","RGB"))}')

assert len(ASSETS)==len(set(a['id'] for a in ASSETS)), 'unique IDs'
assert len(set(a['path'] for a in ASSETS))==len(ASSETS), 'unique output paths'
assert sum(a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER' for a in ASSETS)==26, 'known existing cutouts only'
assert sum(1 for a in ASSETS if a.get('has_bytes'))==len([a for a in ASSETS if a['id'] in MANIFEST]), 'manifest coverage'
assert all(a['prompt'] and a['acceptance'] and a['rejection'] and a['integration'] for a in ASSETS)

AUDIO=list(BASE['audio'])
AUDIO_EXTRA=[
 ('AU-15','Dome ascent music','music','24-36 s seamless','Bright golden afternoon ascent: original 134 BPM handbells, airy synth-strings, plucked upright bass and syncopated side-snare. No copyrighted Notre Dame melody; calm enough to preserve rhythmic telegraphs.'),
 ('AU-16','Fox three-phase boss music','music','20-32 s seamless','Comically dramatic agile 148 BPM rhythm with staccato plucked strings and mischievous muted brass; keep a clean short bar boundary for loops and clear hit/cue frequency spectrum.'),
 ('AU-17','Birthday victory fanfare','sfx/music','6-11 s','Original celebratory short brass fanfare with soft glockenspiel ending, layered final note giving space to spoken or visible HAPPY BIRTHDAY, MAVERICK; no copyrighted melodies.'),
 ('AU-18','Fox boss charge tell','sfx','0.4-0.75 s','Short descending percussion warning with an obvious rising hiss ending; clean distinct from launch; volume safe and duplicated visually.'),
 ('AU-19','Fox boss stagger vulnerable','sfx','0.35-0.7 s','Comedic descending trombone/plucked bass note signaling punish window, very distinct from damage hit tone.'),
 ('AU-20','Final cake reveal','sfx','1.2-2.1 s','Tiny ascending sparkling bell flourish and soft cake pop, not a jump scare or copyrighted tune.'),
 ('AU-21','Boss confetti shot','sfx','0.12-0.35 s','Papery mechanical pop, small mid-frequency percussive click and soft fizz; no loud gunshot or shrill peak.'),
]
for id,title,kind,duration,brief in AUDIO_EXTRA:
 AUDIO.append({'id':id,'title':title,'type':kind,'duration':duration,'brief':brief})
for au in AUDIO:
 au['status']='MISSING_FINAL_RECORDED_FILE__RUNTIME_SYNTH_FALLBACK'
 au['prompt']=(f"LM ARENA AUDIO GENERATION — SHAKEDOWN BIRTHDAY EDITION — {au['id']} {au['title']}. Produce one independently named, original {au['type']} asset, "
 f"target duration {au['duration']}. Creative brief: {au['brief']} Project is a 2D birthday platformer on a fictionalized Notre Dame quad and Golden Dome, Fox boss, cake and Shamrock Shakes. "
 "Deliver a single WAV 48kHz stereo source and an OGG/Opus or OGG/Vorbis browser-ready derivative at clean -16 LUFS integrated loudness when applicable (short cues evaluated by peak/ear). "
 "No external copyrighted melody, school song, third-party vocals, or license-ambiguous recording. Include creation attribution, license and loop point metadata; verify loop seam and listen end-to-end. "
 "Gameplay must still work muted, offline and when the browser disallows autoplay. Do not claim rendered files or loop verification unless they physically exist.")

GROUP_COUNTS=defaultdict(lambda:Counter())
for a in ASSETS:
 GROUP_COUNTS[a['group']]['planned_or_verified']+=1
 GROUP_COUNTS[a['group']]['verified_in_repo']+=int(a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER')
 GROUP_COUNTS[a['group']]['generated_normalized']+=int(is_generated(a))
 GROUP_COUNTS[a['group']]['missing_generation']+=int(not (a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER' or a.get('has_bytes')))
 GROUP_COUNTS[a['group']]['P0']+=int(a['priority']=='P0')
 GROUP_COUNTS[a['group']]['P1']+=int(a['priority']=='P1')
 GROUP_COUNTS[a['group']]['P2']+=int(a['priority']=='P2')
COVERAGE={g:dict(GROUP_COUNTS[g]) for g in sorted(GROUP_COUNTS)}
COUNTS=Counter(a['status'] for a in ASSETS)

contract={
 'title':'SHAKEDOWN — COMPLETE BIRTHDAY EDITION ASSET CONTRACT',
 'status':f"SPECIFICATION_COMPLETE; {sum(is_generated(a) for a in ASSETS)} GENERATED ASSETS NORMALIZED_AND_VERIFIED_BY_BYTES; "
 f"{sum(not (a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER' or is_generated(a)) for a in ASSETS)} STILL UNGENERATED; "
 '26 SOURCE_CINNAMON_FRAMES_VERIFIED',
 'schema_version':'2.0.0','built_utc':'2026-10-11','source_repo':'westkitty/ShakeDown',
 'governing_commit_before_this_asset_packet':'8b39c32ced8f7051908b10a4d936b85e02e42a0d',
 'visual_authorities':REFS,
 'compatibility':{'engine':'Canvas 2D + native DOM UI','logical_canvas':[960,540],'world_tile_px':32,'physics_hz':60,'sprite_cinnamon_playback_px':[240,160],'collision_source':'authored JavaScript, never inferred from image'},
 'source_grounding':'73 existing Level 1 specs + real Cinnamon cutout manifest + latest full birthday game contract',
 'visual_guidelines':{'palette':PALETTE,'style':GLOBAL_LOCK,'cinnamon_lock':CIN_LOCK,'fox_candidate_not_approved':FOX_LOCK,'technical_rules':TECH_LOCK},
 'coverage_matrix':COVERAGE,
 'totals':{'visual_specification_count':len(ASSETS),'source_verified_cinnamon_frames':sum(a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER' for a in ASSETS),'generated_normalized_verified':sum(is_generated(a) for a in ASSETS),
        'generated_pending_fox_approval':sum(1 for a in ASSETS if a.get('has_bytes') and not is_generated(a)),'require_generation':sum(not (a['status']=='VERIFIED_IN_REPO_LOCAL_BROWSER' or a.get('has_bytes')) for a in ASSETS),'awaiting_human_visual_approval':sum(1 for a in ASSETS if a.get('has_bytes')),'all_final_art_fully_integrated':False},
 'pipeline_statuses':{'VERIFIED_IN_REPO_LOCAL_BROWSER':'actual Cinnamon source-derived, SHA-backed runtime assets only',
 'MISSING_GENERATION':'visual brief only; NO generated file exists at requested output path',
 'APPROVAL_PENDING':'Fox model needs acceptance, and dependent Fox sprites are prohibited from canon promotion until accepted'},
 'zone_sequence':RUNTIME_MAP,'assets':ASSETS,'audio':AUDIO,
 'covered_feature_contract':['Cinnamon core/recovery/ending','Fox design/windup/charge/stagger/defeat','Campus tile/pulse/enemy/parallax','Dome architecture/cornice/lift/gold sky','Golden Dome summit','3-hit boss telegraphs/projectiles','Shamrock Shake pickup/hero/trio','Birthday cake/candles/finale','Touch controls/menu/HUD/pause/game over','Particles/effects/transitions','Original audio cues with silent fallback'],
 'output_handoff':'Every requested final asset must receive individual file, verified intrinsic size/alpha, approved style and identity, SHA256, real logical ID and runtime screenshot. Plans are not generated inventory.'
}
(DEST/'ShakeDown_Complete_Asset_Contract.json').write_text(json.dumps(contract,indent=2,ensure_ascii=False)+'\n')

# One authoritative, editable Markdown source. Its code fences are full standalone
# asset requests, never partial prompts that rely on earlier messages.
lines=['# SHAKEDOWN / COMPLETE BIRTHDAY EDITION',
 '## LM ARENA AGENT MODE MASTER ASSET PRODUCTION PACKET',
 '', '**Status:** specification is complete; all 26 Cinnamon cut-outs physically exist and have been verified. The additional requested images and sound have **not** been generated by this document.',
 '', '**Repository:** https://github.com/westkitty/ShakeDown',
 '', '**Target:** one continuous game with campus -> Golden Dome climbing (~55% of route) -> Fox boss -> HAPPY BIRTHDAY, MAVERICK! cake and Shamrock Shakes -> replay.',
 '', '**References included in PDF:** master Cinnamon style sheet and Cinnamon action source sheet. These govern Cinnamon identity, proportions, linework, palette and sprite character. Never regenerate the verified 26 source-derived frames by default.',
 '', '## MACHINE / ENGINE CONTRACT',
 '', f'- Canvas 2D, {960}×{540} world-space viewport, 32px authoring tile grid, 60 Hz gameplay tick; keyboard and accessible DOM touch; no unnecessary engine dependencies.',
 '- Campus to Dome is a stylized game-fictional traversal, not a geographic survey. The Dome is climbable geometry for at least half the run.',
 '- Exact per-asset source/target sizes are specifications only. A model output is not a verified PNG until measured, cleaned and imported.',
 '- Output each requested image as a **separate standalone file**, NOT as a collage. Intentional single unified diagrams/model sheets are named explicitly. Fox turnaround is a single intentional multi-view model sheet.',
 '- Preserve file naming exactly; do not fabricate binary file contents, generated IDs, atlas coordinates or checksums. Post-generation resize, trim, alpha verification, pivot normalization, browser loading and actual screenshot proof are required.',
 '- Generate all P0 missing assets first; P1 then P2 only after the essential game end-to-end route is reliable. Opaque backgrounds have no collider art; sprite/FX alpha must be real.',
 '- The Fox is a candidate until accepted. Do not automatically promote newly generated Fox art to approved canonical character reference.',
 '- The birthday cake appears only at the finale after the Fox victory; no Bethel campus or cake guardian.',
 '', '## ART DIRECTION & IMMUTABLE LOOK',
 '', GLOBAL_LOCK,'',CIN_LOCK,'',FOX_LOCK,'',TECH_LOCK,'',
 '## SCENE ORDER & REQUIRED VISUAL COVERAGE','']
for name,desc in RUNTIME_MAP.items():lines.append(f'- **{name}:** {desc}')
lines+=['','## PRODUCTION STATUS MATRIX','',
 '| Asset family | Specifications | Physically verified now | Missing image generation | P0 | P1 | P2 |','|---|---:|---:|---:|---:|---:|---:|']
for g,c in COVERAGE.items():
 lines.append(f"| {GROUP_NAMES[g]} | {c['planned_or_verified']} | {c.get('verified_in_repo',0)} | {c.get('missing_generation',0)} | {c['P0']} | {c['P1']} | {c['P2']} |")
lines+=['',f"TOTAL VISUAL CONTRACT: **{len(ASSETS)}** individually specified logical IDs; **{contract['totals']['source_verified_cinnamon_frames']}** source-verified Cinnamon frames; **{contract['totals']['generated_normalized_verified']}** generated, byte-verified and normalized production images; **{contract['totals']['require_generation']}** still missing final production images.",
 '', '## LM ARENA UNIVERSAL EXECUTION ORDER',
 '', '1. Review the two embedded reference sheets. Confirm accepted character identity and that 26 source cutouts are existing assets; never produce redundant new Cinnamon core frames.',
 '2. Approve FOX-01 candidate before generating dependent FOX action states. If approval cannot be obtained in time, use the explicitly provisional in-game Canvas Fox.',
 '3. Work family by family below. Every fenced prompt is intentionally full and independently paste-ready; submit one prompt for one physical output. Do not shrink to a combined sheet for multiple independent outputs.',
 '4. Deliver P0 source files; perform actual alpha, dimension, pivot and identity checks; produce asset manifest with real filenames/hashes and test via running game before advancing.',
 '5. Deliver P1 and P2 only as time permits. Leave clearly marked Canvas placeholders rather than invent binary assets. Never overwrite approved Cinnamon source frames.',
 '', '## COMPLETE INDEPENDENT GENERATION PROMPTS','']
by_group=defaultdict(list)
for a in ASSETS:by_group[a['group']].append(a)
order=['CIN','FOX','BG','TL','PR','MC','EN','CO','VF','FX','UI','DM-BG','DM-TL','DM-PR','DM-MC','BS-VF','PK','EX-VF','BD','UIX']
for g in order:
 group=by_group[g]
 if not group:continue
 lines+=[f"### BATCH {g} — {GROUP_NAMES[g]}",
          f"{len(group)} individual asset contracts. Process P0 first, P1 next, P2 last. Reference sheets and complete per-asset instructions are repeated in every prompt.",'']
 for a in sorted(group,key=lambda a:({'P0':0,'P1':1,'P2':2,'EXISTING':3}.get(a['priority'],9),a['id'])):
  size='×'.join(map(str,a['target_px']));source='×'.join(map(str,a['source_px']))
  lines+=[f"#### {a['id']} — {a['name']}",
 f"**State:** {a['status']} · **Priority:** {a['priority']} · **Where:** {a['zone']} · **Target:** {size} px · **Source:** {source} px · **Output:** `{a['path']}`",
 f"**Anchor:** {a['pivot']} · **Collision:** {a['collision']} · **Animation:** {a['animation']}",
 f"**References:** {', '.join(a['references'])} · **Dependency:** {a['dependencies']}",
 '', '```text',a['prompt'],'```','',
 f"**QA pass:** {a['acceptance']}", f"**Reject:** {a['rejection']}",
 f"**Integration:** {a['integration']}",'']
lines+=['## ORIGINAL AUDIO / SOUND PRODUCTION',
 'Audio is secondary to shipping the game. The current browser source has a procedural WebAudio fallback; the files below are all still missing final mastered recordings. Generate separately and do not allow audio production to gate a playable level.','']
for a in AUDIO:
 lines+=[f"### {a['id']} — {a['title']}",f"**Status:** {a['status']}", '', '```text',a['prompt'],'```','']
lines+=['## ASSET PROMOTION GATE',
 '- Requested specification -> physically generated file -> quarantined quality review -> normalized and measured PNG -> hash-backed manifest -> actual in-game Canvas render -> keyboard/touch interaction proof -> approved status.',
 '- Required: exact one-to-one asset ID mapping, no missing/load-failed sprite paths, no Fox identity leakage, no Cinnamon identity drift, no opaque checkerboard on alpha outputs.',
 '- Paired states require exact canvas/origin compatibility; deliberate parallax art must not be mistaken for collisions or walkable surfaces.',
 '- Reject a prettier result that reduces legibility at native phone dimensions.',
 '- Copyright: use original animation-inspired art, original audio, campus inspiration only; no third-party trademarks baked into assets or unlicensed sound recordings.',
 '- Maintain integration ledger: `MISSING_GENERATION`, `GENERATED_QUARANTINED`, `NORMALIZED_VERIFIED`, `INTEGRATED_BROWSER_CHECKED`, `APPROVED`. Existing original Cinnamon outputs retain `VERIFIED_IN_REPO_LOCAL_BROWSER` until any proposed replacement passes a regression gate.',
 '- Do not label a successful source render as tested gameplay. Asset pipeline and production engine are separate evidence domains.',
 '', '## FINAL OUTPUT CONTRACT FOR LM ARENA',
 'Return individual image/audio file links with actual filenames, an actual output metadata report, all failed outputs flagged and retried, exact deliverable directory structure, a normalized manifest of real bytes, plus a summary explicitly separating fully accepted art, pending approval, and absent deliverables.',
 'Never declare finished because the prompt list reaches its end. Confirm all P0 assets are available AND the game actually loaded them before calling the graphic library production-ready.']
(DEST/'ShakeDown_Complete_LM_Arena_Master.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

# Editorial PDF from the exact same in-memory contract. Source is editable Markdown,
# not a separate paraphrased PDF with missing specs.
PDF=DEST/'ShakeDown_Complete_LM_Arena_Master.pdf'
PW,PH=letter
C_NAVY=colors.HexColor('#14243A');C_INK=colors.HexColor('#22304A');C_GOLD=colors.HexColor('#D5AA52')
C_FAINT=colors.HexColor('#F6F3EA');C_SUB=colors.HexColor('#536077');C_LINE=colors.HexColor('#D8DEE8')
styles={
 'main':ParagraphStyle('main',fontName='Helvetica',fontSize=9.2,leading=13,textColor=C_INK,spaceAfter=5),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=7.8,leading=11.3,textColor=C_INK,spaceAfter=3),
 'micro':ParagraphStyle('micro',fontName='Helvetica',fontSize=7.1,leading=10.1,textColor=C_SUB,spaceAfter=3),
 'prompt':ParagraphStyle('prompt',fontName='Helvetica',fontSize=8.0,leading=11.8,textColor=C_INK,spaceAfter=7),
 'cover_tiny':ParagraphStyle('cover_tiny',fontName='Helvetica-Bold',fontSize=10.5,leading=14,textColor=colors.HexColor('#AA812F'),spaceAfter=13),
 'cover_title':ParagraphStyle('cover_title',fontName='Helvetica-Bold',fontSize=31,leading=36,textColor=C_NAVY,spaceAfter=16),
 'cover_sub':ParagraphStyle('cover_sub',fontName='Helvetica-Bold',fontSize=15,leading=20,textColor=C_INK,spaceAfter=16),
 'head':ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=14.2,leading=18,textColor=C_NAVY,spaceBefore=10,spaceAfter=7),
 'section':ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=11.4,leading=15,textColor=C_NAVY,spaceBefore=10,spaceAfter=6),
 'id':ParagraphStyle('id',fontName='Helvetica-Bold',fontSize=10.3,leading=13.5,textColor=C_NAVY,spaceAfter=4),
 'metadata':ParagraphStyle('metadata',fontName='Helvetica',fontSize=7.3,leading=10.1,textColor=C_SUB,spaceAfter=4),
 'table':ParagraphStyle('table',fontName='Helvetica',fontSize=7.4,leading=10.3,textColor=C_INK),
}

def txt(s):
 return escape(str(s)).replace('\n','<br/>')
def para(s,sty='main'):
 return Paragraph(txt(s),styles[sty])
def inline(s,sty='main'):
 # Allow carefully authored bold markup only. All generated metadata is escaped.
 return Paragraph(s,styles[sty])

story=[]
S=story.append
S(Spacer(1,30))
S(inline('SHAKEDOWN  /  MAVERICK BIRTHDAY EDITION','cover_tiny'))
S(inline('GOLDEN<br/>DOME DASH','cover_title'))
S(inline('THE COMPLETE VISUAL + AUDIO<br/>LM ARENA PRODUCTION CONTRACT','cover_sub'))
S(Spacer(1,12))
S(Table([[inline('01  CAMPUS QUAD','small'),inline('02  PLAYABLE GOLDEN DOME','small')],
         [inline('03  FOX ENCOUNTER','small'),inline('04  BIRTHDAY FINALE','small')]],
        colWidths=[238,238],style=TableStyle([('BACKGROUND',(0,0),(-1,-1),C_FAINT),('BOX',(0,0),(-1,-1),0.65,C_LINE),('INNERGRID',(0,0),(-1,-1),0.5,C_LINE),('LEFTPADDING',(0,0),(-1,-1),13),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)])))
S(Spacer(1,22))
for l in [f'{len(ASSETS)} individually specified visual records. {contract["totals"]["source_verified_cinnamon_frames"]} source-verified Cinnamon frames.',
          f'{contract["totals"]["generated_normalized_verified"]} generated outputs are byte-verified and normalized; {contract["totals"]["require_generation"]} candidate visual outputs still require creation.',
          'Full prompts independently executable, and each names its own asset, path, exact dimensions, source reference, visual rules, pivots and rejection criteria.',
          'The Fox has NO approved standalone turnaround; his candidate must be reviewed before promotion.']:
 S(para(l))
S(Spacer(1,13));S(inline('SOURCE AUTHORITY', 'section'))
S(para('Project: github.com/westkitty/ShakeDown  •  Canon: two uploaded Cinnamon sprite sheets on next pages  •  Runtime: Canvas 2D / 960 × 540 logical pixels / 32px tile grid.'))
S(para('THIS DOCUMENT DOES NOT CLAIM that requested art or sound was generated. A production specification is not a verified asset.', 'small'))
S(PageBreak())

for ix,(loc,heading,detail) in enumerate([
 (ROOT/REFS[0],'CINNAMON — MASTER STYLE / TURNAROUND','This supplied image establishes silhouette, colors, glasses, headband, shirt, shorts and striped tail, with action and expression exemplars. NOT an image to regenerate.'),
 (ROOT/REFS[1],'CINNAMON — ACTION SOURCE / REAL SPRITES','This supplied action source contains pixel data that was actually cropped and registered into 26 existing isolated Cinnamon frames. NOT a newly approved generation output.')]):
 S(inline(heading,'head'));S(para(detail,'main'))
 img=Image.open(loc).convert('RGB')
 mw=PW-100;mh=PH-205
 iw,ih=img.size;scale=min(mw/iw,mh/ih)
 buff=BytesIO();img.save(buff,format='JPEG',quality=87,optimize=True);buff.seek(0)
 S(RLImage(buff,width=iw*scale,height=ih*scale))
 S(Spacer(1,14))
 S(para(f'SOURCE FILE: {REFS[ix]} • original pixels {iw} × {ih} • user-supplied reference authority, not an AI-generated deliverable.','small'))
 S(PageBreak())

S(inline('IMPLEMENTATION AND PRODUCTION CONTRACT','head'))
for chunk in [GLOBAL_LOCK,CIN_LOCK,FOX_LOCK,TECH_LOCK]:S(para(chunk,'small'));S(Spacer(1,7))
S(inline('GAMEPLAY ORDER / SCOPE','section'))
for k,v in RUNTIME_MAP.items():S(inline(f'<b>{txt(k.upper())}</b> — {txt(v)}','small'))
S(inline('INDIVIDUAL ASSET GENERATION, NOT PICTURE COLLAGES','section'))
for l in [
 'First protect the 26 Cinnamon frames already on main. They are source-derived runtime files, not candidate new LM Arena outputs.',
 'P0 core first. Fox turnaround must be signed off before dependent fox source frames are considered accepted. Additional P1 and P2 art is polish, never a blocker for the playable birthday game.',
 'Submit each independent asset prompt separately as one image output. Only expressly specified model sheet or intentional source atlas may have multiple views in ONE canvas.',
 'A model cannot guarantee 32px or 64px precise output; deliver high-resolution generation source, then resize/trim, verify native alpha and original dimensions, register hash in actual manifest, and inspect in game.',
 'Gameplay hazards rely on animation state machines and coded rectangles; no generated pixels magically define collisions or moving platforms.',
 'The final birthday display must spell HAPPY BIRTHDAY, MAVERICK! using actual accessible HTML/canvas text, not image-model lettering.']:
 S(para(l,'small'))
S(PageBreak())
S(inline('COVERAGE MATRIX / VERIFIED VS REQUESTED','head'))
headers=['Asset family','All','Existing','Generate','P0','P1','P2']
t=[list(map(lambda v:inline(v,'table'),headers))]
for g,c in COVERAGE.items():
 vals=[GROUP_NAMES[g],str(c['planned_or_verified']),str(c.get('verified_in_repo',0)),str(c.get('missing_generation',0)),str(c['P0']),str(c['P1']),str(c['P2'])]
 t.append([inline(txt(v),'table') for v in vals])
colW=[252,33,47,49,30,30,30]
S(Table(t,colWidths=colW,repeatRows=1,hAlign='LEFT',style=TableStyle([
 ('BACKGROUND',(0,0),(-1,0),C_FAINT),('LINEBELOW',(0,0),(-1,0),1.1,C_GOLD),('LINEBELOW',(0,1),(-1,-1),0.2,C_LINE),
 ('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),3),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('VALIGN',(0,0),(-1,-1),'TOP')])))
S(Spacer(1,16))
S(para(f"TOTAL {len(ASSETS)} visual IDs; {contract['totals']['source_verified_cinnamon_frames']} existing source frames verified; {contract['totals']['generated_normalized_verified']} generated outputs normalized and byte-verified; {contract['totals']['require_generation']} requests not yet generated. Human visual approval of generated outputs remains open."))
S(para('Workflow: specification → approved visual reference → generate individual raw output → accept and normalize source → test dimensions/alpha/pivot → register SHA256 and logical ID → actual browser render plus interaction → approved and integrated.', 'small'))
S(PageBreak())

# Multiple spec cards per page while avoiding split cards; a long single prompt can flow.
# Each cards has all self-contained instructions in a well-separated, readable sequence.
for g in order:
 entries=by_group[g]
 if not entries:continue
 S(inline(f'{g} / {GROUP_NAMES[g]}','head'))
 S(para(f'{len(entries)} standalone production contracts. P0 first; P1 then P2. The following text is meant to be directly supplied to LM Arena Agent Mode one card at a time, including its complete prompt.', 'small'))
 for a in sorted(entries,key=lambda a:({'P0':0,'P1':1,'P2':2,'EXISTING':3}.get(a['priority'],9),a['id'])):
  # No space-preservation tricks: ReportLab will flow full text naturally.
  meta=f"PRIORITY {a['priority']}  |  STATUS {a['status']}  |  SOURCE {a['source_px'][0]} × {a['source_px'][1]}  |  TARGET {a['target_px'][0]} × {a['target_px'][1]}  |  {'RGBA' if a['transparent'] else 'RGB'}"
  head=inline(txt(f"{a['id']}  /  {a['name']}"),'id')
  met=para(meta,'metadata')
  loc=para(f"PATH: {a['path']}  |  ZONE: {a['zone']}  |  PIVOT: {a['pivot']}  |  COLLIDER: {a['collision']}  |  ANIM: {a['animation']}",'micro')
  # Guarantee at least the header+metadata travel together.
  S(KeepTogether([Spacer(1,11),head,met,loc]))
  # Paragraphs may pagebreak; each standalone prompt repeats all critical information.
  for chunk in a['prompt'].split('\n\n'):
   S(para(chunk,'prompt'))
  S(inline(f"<b>PASS:</b> {txt(a['acceptance'])}",'small'))
  S(inline(f"<b>REJECT:</b> {txt(a['rejection'])}",'small'))
  S(inline(f"<b>INTEGRATE:</b> {txt(a['integration'])}",'small'))
  S(HRFlowable(width='100%',thickness=.45,color=C_LINE,spaceBefore=7,spaceAfter=10))
 S(PageBreak())

S(inline('ORIGINAL AUDIO / NO AUDIO DEPENDENCY','head'))
S(para('The playable source has a procedural WebAudio fallback. No externally generated tracks are claimed to exist. The audio prompts below can run after P0 visuals without blocking the birthday gift.', 'main'))
for a in AUDIO:
 S(KeepTogether([Spacer(1,9),inline(txt(f"{a['id']} / {a['title']}"),'id'),para(f"{a['status']} • {a['type']} • {a['duration']}",'micro')]))
 S(para(a['prompt'],'prompt'))
 S(HRFlowable(width='100%',thickness=.4,color=C_LINE,spaceAfter=7))
S(PageBreak())
S(inline('FINAL LM ARENA / ACCEPTANCE CONTRACT','head'))
for x in [
 'Create only the individual art/audio described by each asset record; use exact IDs, filenames, target pixel dimensions and source references. Accept the 26 currently existing verified Cinnamon frames as locked output, not generation requests.',
 'Do NOT generate a full atlas or contact sheet as a substitute for many separately requested art files. The deliberate Fox turnaround is the ONLY multi-view sheet format explicitly requested.',
 'Keep the Fox from stealing Cinnamon identity; Fox can be provisional for a runnable placeholder but no canon sign-off is implied. Approve a coherent turnaround before full Fox animation batch.',
 'Production status vocabulary: MISSING_GENERATION / GENERATED_QUARANTINED / NORMALIZED_VERIFIED / INTEGRATED_BROWSER_CHECKED / APPROVED. Use VERIFIED_IN_REPO_LOCAL_BROWSER only for the original 26 source-derived Cinnamon frames.',
 'Verify every file after generation: bytes, exact dimensions, real alpha, image identity, expected pivot, source provenance, asset dependency, hash; re-open game, inspect screenshot and exercise character interaction before integration approval.',
 'For paired frames, share exact center and bottom line. For tile images, align seamless edges and collision top. Background must not paint playable foreground details that compete with hitboxes.',
 'Never silently delete/fork working gameplay systems to make art easier. Preserve the authored 2D Canvas runtime, keyboard and mobile touch inputs, checkpoint/retry, boss logic and the exact birthday ending.',
 'The production packet is complete only as specification. The game itself remains playable with documented Canvas fallbacks while new LM Arena art awaits actual generation.']:
 S(para(x,'main'))
S(Spacer(1,20));S(inline('FULLY READABLE EDITABLE SOURCE + JSON MANIFEST','section'))
S(para('The accompanying ShakeDown_Complete_LM_Arena_Master.md is the editable authoritative text source for this PDF, and ShakeDown_Complete_Asset_Contract.json is the machine-readable field-complete production register. Use these together; never hand-edit the PDF without regenerating from source.','small'))

def frame(cv,doc):
 cv.saveState()
 cv.setFillColor(C_NAVY);cv.rect(0,PH-36,PW,36,fill=1,stroke=0)
 cv.setFont('Helvetica-Bold',8.1);cv.setFillColor(colors.white)
 cv.drawString(43,PH-23,'SHAKEDOWN    /    BIRTHDAY EDITION    /    LM ARENA MASTER')
 cv.setStrokeColor(C_LINE);cv.line(43,43,PW-43,43)
 cv.setFont('Helvetica',8.0);cv.setFillColor(C_SUB)
 cv.drawString(43,28,'SPECIFICATION ONLY  •  GENERATED ART NOT CLAIMED')
 cv.drawRightString(PW-43,28,f'{doc.page:03d}')
 cv.restoreState()

SimpleDocTemplate(str(PDF),pagesize=letter,rightMargin=43,leftMargin=43,topMargin=53,bottomMargin=53,
                  pageCompression=1,title='ShakeDown — Complete Birthday Asset Production Contract',
                  author='Stinky Weasel Productions — ShakeDown',subject='LM Arena Agent Mode asset production and manifest').build(story,onFirstPage=frame,onLaterPages=frame)

print(json.dumps({'pdf':str(PDF),'md':str(DEST/'ShakeDown_Complete_LM_Arena_Master.md'),
                  'json':str(DEST/'ShakeDown_Complete_Asset_Contract.json'),
                  'visual_count':len(ASSETS),'verified':contract['totals']['source_verified_cinnamon_frames'],
                  'missing_generation':contract['totals']['require_generation'],
                  'audio_count':len(AUDIO),'groups':{g:dict(c) for g,c in COVERAGE.items()}},indent=2))
