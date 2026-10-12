#!/usr/bin/env python3
"""
ShakeDown - 3 game screens built from the assets actually present in
westkitty/ShakeDown. Rendered at 2x native (1920x1080 masters), with
960x540 game-ready exports. Every art layer is a real repo asset.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO = '/home/runner/work/ShakeDown/ShakeDown/'
OUT  = '/home/runner/work/ShakeDown/ShakeDown/assets/screens/'
WORK = '/home/runner/work/ShakeDown/ShakeDown/.artifact-cache/uploaded-screens/'
FONTS = '/home/runner/work/ShakeDown/ShakeDown/.artifact-cache/uploaded-screens/fonts/'
S = 2  # render scale (native 960x540 design -> 1920x1080)

os.makedirs(OUT, exist_ok=True)
os.makedirs(WORK, exist_ok=True)

# ---------------------------------------------------------------- helpers
def A(rel):
    """open repo asset as RGBA"""
    return Image.open(REPO + rel).convert("RGBA")

def sc(img, factor):
    """nearest-neighbour scale (keeps pixel-art crispness)"""
    f = factor
    return img.resize((max(1, round(img.width * f)), max(1, round(img.height * f))), Image.NEAREST)

def paste(canvas, img, x, y, anchor="topleft"):
    if anchor == "center":
        x, y = x - img.width // 2, y - img.height // 2
    elif anchor == "bottom":
        x, y = x - img.width // 2, y - img.height
    elif anchor == "midleft":
        x, y = x, y - img.height // 2
    elif anchor == "bottomleft":
        y = y - img.height
    canvas.alpha_composite(img, (int(x), int(y)))

def darken(img, f):
    r, g, b, a = img.split()
    rgb = Image.merge("RGB", (r, g, b)).point(lambda v: int(v * f))
    r, g, b = rgb.split()
    return Image.merge("RGBA", (r, g, b, a))

def tint(img, color, amount):
    """blend solid colour into image keeping alpha"""
    lay = Image.new("RGBA", img.size, color + (0,))
    lay.putalpha(img.split()[3].point(lambda v: int(v * amount)))
    out = img.copy()
    out.alpha_composite(lay)
    return out

def opac(img, f):
    a = img.split()[3].point(lambda v: int(v * f))
    out = img.copy()
    out.putalpha(a)
    return out

def clamp_alpha(img, maxa):
    a = img.split()[3].point(lambda v: min(v, maxa))
    out = img.copy(); out.putalpha(a); return out

def vgrad(canvas, y0, y1, color, a0, a1):
    """vertical gradient overlay from y0 (alpha a0) to y1 (alpha a1)"""
    h = y1 - y0
    if h <= 0: return
    grad = Image.new("RGBA", (1, h))
    px = grad.load()
    for i in range(h):
        t = i / max(1, h - 1)
        px[0, i] = color + (int(a0 + (a1 - a0) * t),)
    canvas.alpha_composite(grad.resize((canvas.width, h), Image.BILINEAR), (0, y0))

def panel(canvas, box, fill=(10, 12, 32, 172), border=(255, 214, 80, 210), w=3, r=18):
    lay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle(box, radius=r, fill=fill, outline=border, width=w)
    canvas.alpha_composite(lay)

def rotate_keep(img, deg, expand=True, resample=Image.NEAREST):
    return img.rotate(deg, expand=expand, resample=resample)

_fonts = {}
def F(name, size):
    key = (name, int(size))
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(FONTS + name, int(size))
    return _fonts[key]

TEXT_ON = True

PS, SK_B, SK_R, VT = "PressStart2P-Regular.ttf", "Silkscreen-Bold.ttf", "Silkscreen-Regular.ttf", "VT323-Regular.ttf"

def text(canvas, xy, s, font=PS, size=40, fill=(255, 255, 255, 255), anchor="mm",
         max_w=None, stroke=0, stroke_fill=(20, 26, 60, 255),
         shadow=None, shadow_fill=(0, 0, 0, 150), tracking=0):
    """draw text; auto-shrinks to max_w; shadow=(dx,dy)"""
    if not TEXT_ON:
        return
    d = ImageDraw.Draw(canvas, "RGBA")
    f = F(font, size)
    if max_w:
        while f.getlength(s) > max_w and size > 8:
            size -= 1
            f = F(font, size)
    if tracking:
        # manual letterspacing for the pixel display font
        total = sum(f.getlength(ch) + tracking for ch in s) - tracking
        x0, y0 = xy
        if anchor == "mm":
            x0 -= total / 2
        if shadow:
            draw_tracked(d, x0 + shadow[0], y0 + shadow[1], s, f, tracking, shadow_fill, stroke, stroke_fill, anchor)
        draw_tracked(d, x0, y0, s, f, tracking, fill, stroke, stroke_fill, anchor)
        return
    if shadow:
        d.text((xy[0] + shadow[0], xy[1] + shadow[1]), s, font=f, fill=shadow_fill,
               anchor=anchor, stroke_width=stroke, stroke_fill=shadow_fill)
    d.text(xy, s, font=f, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=stroke_fill)

def draw_tracked(d, x, y, s, f, tracking, fill, stroke, stroke_fill, anchor):
    widths = [f.getlength(ch) + tracking for ch in s]
    total = sum(widths) - tracking
    if anchor == "mm":
        pass  # x already left-adjusted
    cx = x
    for ch, w in zip(s, widths):
        d.text((cx, y), ch, font=f, fill=fill, anchor="lm", stroke_width=stroke, stroke_fill=stroke_fill)
        cx += w

def bar(canvas, box, color):
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rectangle(box, fill=color)

def vignette(canvas, strength=0.45, feather=0.65):
    w, h = canvas.size
    m = Image.new("L", (w, h), 0)
    dm = ImageDraw.Draw(m)
    dm.ellipse([-w * feather, -h * feather, w + w * feather, h + h * feather], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(w * 0.06))
    dark = Image.new("RGBA", (w, h), (5, 6, 16, int(255 * strength)))
    dark.putalpha(m.point(lambda v: int((255 - v) / 255 * 255 * strength)))
    canvas.alpha_composite(dark)

def glow(canvas, center, radius, color, alpha=110):
    w, h = canvas.size
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    steps = 16
    for i in range(steps, 0, -1):
        r = radius * i / steps
        a = int(alpha * (1 - i / steps) ** 1.4)
        d.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], fill=color + (a,))
    lay = lay.filter(ImageFilter.GaussianBlur(radius * 0.10))
    canvas.alpha_composite(lay)

def tile_row(canvas, tile, y, x0=0, x1=None, factor=1):
    x1 = canvas.width if x1 is None else x1
    t = sc(tile, factor)
    x = x0
    while x < x1:
        canvas.alpha_composite(t, (x, y))
        x += t.width

def divider(canvas, cx, y, width, color=(255, 210, 90, 200), h=3):
    if not TEXT_ON:
        return
    bar(canvas, (cx - width // 2, y - h // 2, cx + width // 2, y + h // 2 + 1), color)

# ================================================================ SCREEN 1
def screen_start():
    W, H = 960 * S, 540 * S
    c = Image.new("RGBA", (W, H), (0, 0, 0, 255))

    # BG-01 dome approach, golden hour (DM-BG01)
    paste(c, sc(A("assets/production/dome/backgrounds/dm_bg01.png"), S), 0, 0)
    # deep night-sky gradient at top so the frame floats cleanly
    vgrad(c, 0, 360, (10, 8, 30), 255, 0)
    vgrad(c, 0, 200, (10, 8, 30), 90, 0)

    # festive pennant string low across the scene (BD-07, kept soft)
    paste(c, clamp_alpha(sc(A("assets/production/birthday/bd_07.png"), S), 215), 0, 748)

    # main title frame (UX-01 main title backdrop) re-used as the title panel
    frame = sc(A("assets/production/ui/ux_01.png"), S * 0.62)
    paste(c, frame, 960, 400, anchor="center")

    # characters in the foreground
    cin = sc(A("assets/sprites/cinnamon/run_02.png"), S * 1.30)
    paste(c, cin, 330, 990, anchor="bottom")
    fox = sc(A("assets/level1/fox/fx_01_fox_thief_holding_shake.png"), S * 1.30)
    paste(c, fox, 1585, 985, anchor="bottom")

    # title block inside the frame
    text(c, (960, 205), "SHAKEDOWN", font=PS, size=40, fill=(255, 210, 74, 255),
         stroke=6, stroke_fill=(24, 22, 58, 255), shadow=(0, 5), tracking=4)
    text(c, (960, 292), "THE GREAT", font=PS, size=58, fill=(255, 255, 255, 255),
         stroke=7, stroke_fill=(24, 22, 58, 255), shadow=(0, 6), max_w=980)
    text(c, (960, 380), "SHAMROCK SHAKE", font=PS, size=58, fill=(255, 210, 74, 255),
         stroke=7, stroke_fill=(24, 22, 58, 255), shadow=(0, 6), max_w=980)
    text(c, (960, 466), "CAPER", font=PS, size=62, fill=(255, 255, 255, 255),
         stroke=7, stroke_fill=(24, 22, 58, 255), shadow=(0, 6), max_w=980)
    divider(c, 960, 540, 420)
    text(c, (960, 583), "LEVEL 1 - GOLDEN DOME DASH", font=SK_B, size=34,
         fill=(255, 243, 196, 255), stroke=3, stroke_fill=(24, 22, 58, 255))
    text(c, (960, 634), "A GAME FOR MAVERICK - OCTOBER 11, 2026", font=VT, size=34,
         fill=(245, 230, 184, 255), stroke=2, stroke_fill=(24, 22, 58, 200))

    # bottom arcade bar
    bar(c, (0, 1000, W, H), (12, 14, 34, 224))
    bar(c, (0, 998, W, 1001), (255, 210, 90, 120))
    for i in range(3):
        paste(c, sc(A("assets/level1/ui/ui_01_filled_heart_icon.png"), 2), 64 + i * 72, 1042, anchor="lm")
    text(c, (64 + 3 * 72 + 8, 1041), "x3", font=VT, size=36, fill=(255, 243, 196, 255), anchor="lm")
    text(c, (960, 1041), "PRESS ENTER TO START", font=PS, size=26, fill=(255, 210, 74, 255),
         stroke=5, stroke_fill=(24, 22, 58, 255), shadow=(0, 4), tracking=2)
    text(c, (1862, 1042), "A/D MOVE - SPACE JUMP - J SWISH - SHIFT DASH", font=VT, size=26,
         fill=(198, 208, 240, 255), anchor="rm", stroke=2, stroke_fill=(24, 22, 58, 200))

    vignette(c, 0.30)
    return c

# ================================================================ SCREEN 2
def screen_gameover():
    W, H = 960 * S, 540 * S
    c = Image.new("RGBA", (W, H), (0, 0, 0, 255))

    # deep night sky (DM-BG08 fox finale night glow)
    paste(c, darken(sc(A("assets/production/dome/backgrounds/dm_bg08.png"), S), 0.70), 0, 0)
    # distant campus vista sunk into the night (DM-BG04), high so only its treeline shows
    paste(c, opac(darken(sc(A("assets/production/dome/backgrounds/dm_bg04.png"), S * 1.25), 0.30), 165), -220, -250)
    vgrad(c, 300, 940, (8, 10, 26), 70, 236)     # night falls toward the ground
    vgrad(c, 940, 1080, (6, 8, 20), 236, 252)    # solid dark under the ground line

    # slim cinematic top bar for the eyebrow title
    bar(c, (0, 0, W, 118), (9, 12, 28, 238))
    bar(c, (0, 116, W, 119), (255, 210, 90, 90))

    # night ground: real grass tile (TL-01) row, deeply darkened
    tile_row(c, darken(A("assets/level1/tiles/tl_01_grass_top_tile.png"), 0.30), 914, factor=S)

    # lamppost with a warm pool of light (PR-04)
    lamp = opac(darken(sc(A("assets/level1/props/pr_04_campus_lamppost.png"), S * 0.86), 0.80), 245)
    paste(c, opac(lamp, 255), 150, 916, anchor="bottom")
    glow(c, (150 + lamp.width // 2, 916 - lamp.height + 90), 460, (255, 196, 90), 64)

    # fallen campus sign (PR-10)
    sign = rotate_keep(sc(A("assets/level1/props/pr_10_fallen_campus_sign.png"), S), -7)
    paste(c, opac(darken(sign, 0.85), 240), 60, 936, anchor="bottomleft")

    # Cinnamon - dazed, sprawled on the grass (HURT-00 real sprite frame)
    cin = sc(A("assets/sprites/cinnamon/hurt_00.png"), S * 1.45)
    paste(c, cin, 470, 916, anchor="bottom")

    # spilled shake cup + drips at his feet (BD-05 + CO-04)
    cup = rotate_keep(sc(A("assets/production/birthday/bd_05.png"), S * 0.30), -78)
    paste(c, cup, 826, 916, anchor="bottom")
    for dx, dyy, f in [(700, 921, 1.4), (752, 925, 1.15), (906, 922, 1.25), (952, 918, 1.5)]:
        paste(c, sc(A("assets/level1/collectibles/co_04_green_shake_drip.png"), S * f * 0.62), dx, dyy, anchor="bottom")

    # the thief walks off with the last shake (FOX-15 getaway silhouette)
    fox = sc(A("assets/production/fox/fox_15.png"), S * 0.92)
    paste(c, fox, 1655, 918, anchor="bottom")
    for dx in (1530, 1600):
        paste(c, opac(sc(A("assets/level1/collectibles/co_04_green_shake_drip.png"), S * 0.9), 190), dx, 924, anchor="bottom")

    text(c, (960, 60), "SHAKEDOWN - THE GREAT SHAMROCK SHAKE CAPER", font=VT, size=36,
         fill=(228, 202, 120, 255))
    text(c, (1862, 62), "PROGRESS SAVED AT YOUR LAST CHECKPOINT", font=VT, size=30,
         fill=(170, 168, 150, 220), anchor="rm")

    # failure copy
    text(c, (960, 262), "THE FOX STILL HAS THE SHAKE.", font=VT, size=46,
         fill=(255, 186, 108, 255), stroke=2, stroke_fill=(10, 12, 30, 220))
    text(c, (960, 420), "GAME OVER", font=PS, size=96, fill=(255, 255, 255, 255),
         stroke=9, stroke_fill=(22, 26, 64, 255), shadow=(0, 12), shadow_fill=(8, 8, 24, 170), max_w=1180, tracking=6)
    divider(c, 960, 546, 620, color=(255, 210, 90, 170), h=4)
    text(c, (960, 612), "CONTINUE FROM CHECKPOINT?", font=PS, size=44, fill=(255, 222, 120, 255),
         stroke=7, stroke_fill=(22, 26, 64, 255), shadow=(0, 7), max_w=1240, tracking=3)
    text(c, (960, 680), "PRESS ENTER TO CONTINUE   -   ESC FOR MAIN MENU", font=VT, size=40,
         fill=(222, 226, 250, 255), stroke=2, stroke_fill=(10, 12, 30, 210))

    vignette(c, 0.58)
    return c

# ================================================================ SCREEN 3
def screen_victory():
    W, H = 960 * S, 540 * S
    c = Image.new("RGBA", (W, H), (0, 0, 0, 255))

    # summit celebration stage (BD-11 victory stage backdrop)
    paste(c, sc(A("assets/production/birthday/bd_11.png"), S), 0, 0)
    # bunting along the top (BD-07)
    paste(c, sc(A("assets/production/birthday/bd_07.png"), S), 0, -104)
    # confetti across the open sky, kept clear of the credits column (BD-08)
    paste(c, opac(sc(A("assets/production/birthday/bd_08.png"), S * 1.20), 200), 470, 300)
    paste(c, opac(sc(A("assets/production/birthday/bd_08.png"), S * 0.95), 170), 1120, 240)

    # heroes on the parapet
    cin = sc(A("assets/sprites/cinnamon/victory_00.png"), S * 1.35)
    paste(c, cin, 890, 1010, anchor="bottom")
    fox = sc(A("assets/production/fox/fox_16.png"), S * 0.62)
    paste(c, fox, 1214, 1002, anchor="bottom")

    # birthday cake with lit candles (BD-01 + BD-04)
    cake = sc(A("assets/production/birthday/bd_01.png"), S * 0.44)
    paste(c, cake, 1630, 1012, anchor="bottom")
    candles = sc(A("assets/production/birthday/bd_04.png"), S * 0.38)
    paste(c, candles, 1616, 678, anchor="bottom")

    # earned medal above the cake (BD-14 + BD-09 sparkle)
    paste(c, opac(sc(A("assets/production/birthday/bd_09.png"), S * 0.30), 185), 1752, 640, anchor="center")
    paste(c, sc(A("assets/production/birthday/bd_14.png"), S * 0.40), 1752, 640, anchor="center")

    # shake trio on the ledge, left of the heroes (BD-06)
    paste(c, sc(A("assets/production/birthday/bd_06.png"), S * 0.30), 400, 1008, anchor="bottom")

    # headline + credits
    text(c, (960, 344), "HAPPY BIRTHDAY, MAVERICK!", font=PS, size=52, fill=(255, 214, 80, 255),
         stroke=9, stroke_fill=(26, 20, 56, 255), shadow=(0, 10), shadow_fill=(8, 8, 26, 200),
         max_w=1620, tracking=5)
    text(c, (960, 412), "YOU SAVED THE SHAKE - AND THE BIRTHDAY.", font=VT, size=42,
         fill=(255, 246, 214, 255), stroke=2, stroke_fill=(26, 20, 56, 220))

    # credits plaque for readability
    panel(c, (60, 470, 664, 900), fill=(12, 14, 36, 188), border=(255, 214, 80, 200), w=3, r=18)
    text(c, (92, 524), "CAST & CREW", font=SK_B, size=38, fill=(255, 214, 80, 255),
         anchor="lm", stroke=4, stroke_fill=(26, 20, 56, 255))
    divider(c, 330, 558, 420, color=(255, 214, 80, 160), h=3)
    credits = [
        "CINNAMON FUZZBUTT - THE HERO RED PANDA",
        "THE FOX - FORMER SHAKE THIEF",
        "MAVERICK - PLAYER ONE",
        "ART - CINNAMON MASTER SPRITE SHEETS",
        "WORLD - GOLDEN DOME, SOUTH QUAD",
        "MUSIC - CAMPUS EXPLORATION",
        "BUILT BY WESTKITTY - OCTOBER 11, 2026",
    ]
    y = 608
    for line in credits:
        text(c, (92, y), line, font=VT, size=34, fill=(240, 238, 224, 255), anchor="lm",
             stroke=2, stroke_fill=(14, 12, 32, 215))
        y += 44

    # bottom bar
    bar(c, (0, 1000, W, H), (10, 13, 32, 228))
    bar(c, (0, 997, W, 1000), (255, 214, 80, 120))
    text(c, (64, 1040), "SHAKEDOWN", font=VT, size=38, fill=(255, 214, 80, 255), anchor="lm")
    text(c, (960, 1040), "PRESS ENTER TO PLAY AGAIN", font=PS, size=32, fill=(255, 214, 80, 255),
         stroke=5, stroke_fill=(26, 20, 56, 255), shadow=(0, 4), tracking=2)
    text(c, (1856, 1040), "THANKS FOR PLAYING!", font=VT, size=40, fill=(240, 238, 224, 255), anchor="rm")

    vignette(c, 0.34)
    return c

# ================================================================ build
if __name__ == "__main__":
    import sys
    jobs = [("01_start_level", screen_start),
            ("02_game_over_continue", screen_gameover),
            ("03_victory_credits", screen_victory)]
    for name, fn in jobs:
        for plate in (False, True):
            TEXT_ON = not plate
            globals()["TEXT_ON"] = not plate
            img = fn()
            master = img.convert("RGB")
            master.save(f"{OUT}{name}{'_clean' if plate else ''}_1920x1080.png")
            game = img.convert("RGBA").resize((960, 540), Image.NEAREST).convert("RGB")
            game.save(f"{OUT}{name}{'_clean' if plate else ''}_960x540.png")
            print("built", name, "clean" if plate else "texted")

