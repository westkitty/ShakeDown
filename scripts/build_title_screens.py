#!/usr/bin/env python3
"""Build the ten ShakeDown title screens from generated raw key art.

Pipeline
--------
1. Read the raw generated key art from ``.artifact-cache/title/raw/ts_NN.png``
   (git-ignored, exactly like the existing ``.artifact-cache/raw`` sources).
2. Crop to a true 16:9 frame (the game's logical canvas is 960x540) and upscale
   to a 1920x1080 master.
3. Score the frame for "busyness" (local edge energy) and place the game logo in
   the emptiest band near the art-directed anchor, so the lettering never sits
   on top of Cinnamon, the Fox or the Golden Dome.
4. Composite a real title-screen lockup: chapter caption, SHAKEDOWN! logo,
   subtitle with rules, HUD nod, controls, PRESS START prompt, scrims + vignette.
5. Emit a 1920x1080 master and a 960x540 canvas-ready copy under ``assets/title``.

Requires Pillow (``pip install pillow``). Fonts are vendored next to this script
in ``scripts/title-fonts`` (both SIL OFL 1.1, licenses included).

    python3 scripts/build_title_screens.py

Nothing here changes game physics, the 26 source Cinnamon frames, the 194-image
production manifest or any approved-art record. These ten files are new,
standalone presentation art and are not wired into the runtime.
"""

from __future__ import annotations

import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageStat

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW_DIR = os.path.join(ROOT, ".artifact-cache", "title", "raw")
FONT_DIR = os.path.join(ROOT, "scripts", "title-fonts")
OUT_DIR = os.path.join(ROOT, "assets", "title")
CANVAS_DIR = os.path.join(OUT_DIR, "canvas")

MASTER = (1920, 1080)
CANVAS = (960, 540)

FONT_DISPLAY = os.path.join(FONT_DIR, "ArchivoBlack-Regular.ttf")
FONT_PIXEL = os.path.join(FONT_DIR, "PressStart2P-Regular.ttf")

# --- ShakeDown palette (game canon) -----------------------------------------
NAVY_DEEP = (10, 24, 43)
NAVY = (34, 71, 127)          # #22477F campus navy
CREAM = (246, 240, 224)
GOLD_HI = (255, 243, 205)
GOLD = (235, 198, 102)        # #EBC666 cream gold
GOLD_LO = (163, 110, 34)
MINT = (168, 239, 173)        # #A8EFAD shamrock shake mint
HEART_RED = (223, 74, 78)

# --- Per-screen art direction ------------------------------------------------
# anchor: preferred (cx, cy) for the logo block, as a fraction of the frame.
# The placer searches for the calmest window near this anchor.
SCREENS = [
    dict(n="01", slug="dawn-quad-hero", chapter="THE SHAKE SNATCH", zone="SOUTH QUAD",
         anchor=(0.50, 0.23), accent=GOLD),
    dict(n="02", slug="the-last-shake", chapter="THE LAST SHAKE", zone="SOUTH QUAD",
         anchor=(0.33, 0.23), accent=GOLD),
    dict(n="03", slug="golden-ascent", chapter="THE GOLDEN ASCENT", zone="GOLDEN DOME",
         anchor=(0.33, 0.21), accent=GOLD),
    dict(n="04", slug="summit-showdown", chapter="SUMMIT SHOWDOWN", zone="GOLDEN DOME",
         anchor=(0.50, 0.20), accent=GOLD),
    dict(n="05", slug="birthday-finale", chapter="THE BIRTHDAY FINALE", zone="BIRTHDAY QUAD",
         anchor=(0.50, 0.18), accent=MINT),
    dict(n="06", slug="pep-rally-midnight", chapter="PEP RALLY MIDNIGHT", zone="PEP RALLY",
         anchor=(0.33, 0.21), accent=GOLD),
    dict(n="07", slug="quad-pursuit", chapter="QUAD PURSUIT", zone="SOUTH QUAD",
         anchor=(0.67, 0.21), accent=GOLD),
    dict(n="08", slug="blue-hour-on-the-dome", chapter="BLUE HOUR ON THE DOME", zone="GOLDEN DOME",
         anchor=(0.50, 0.28), accent=GOLD),
    dict(n="09", slug="the-long-way-up", chapter="THE LONG WAY UP", zone="SOUTH QUAD",
         anchor=(0.42, 0.21), accent=GOLD),
    dict(n="10", slug="the-prize", chapter="THE PRIZE", zone="SOUTH QUAD",
         anchor=(0.33, 0.22), accent=MINT),
]


# ---------------------------------------------------------------------------
# small drawing helpers
# ---------------------------------------------------------------------------
def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(draw, text, fnt, tracking=0):
    if not text:
        return 0
    w = sum(draw.textbbox((0, 0), ch, font=fnt)[2] - draw.textbbox((0, 0), ch, font=fnt)[0]
            for ch in text)
    return w + tracking * (len(text) - 1)


def fit_size(text, path, target_w, tracking=0, ceiling=400):
    probe = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    lo, hi, best = 8, ceiling, 8
    while lo <= hi:
        mid = (lo + hi) // 2
        w = text_w(probe, text, font(path, mid), tracking)
        if w <= target_w:
            best, lo = mid, mid + 1
        else:
            hi = mid - 1
    return best


def draw_tracked(layer, xy, text, fnt, tracking, fill, stroke_w=0, stroke_fill=None):
    """Two-pass tracked text: all strokes first, then all fills, so a big
    outline on one glyph never eats the face of the glyph before it."""
    d = ImageDraw.Draw(layer)
    x, y = xy
    if stroke_w and stroke_fill is not None:
        cx = x
        for ch in text:
            d.text((cx, y), ch, font=fnt, fill=stroke_fill,
                   stroke_width=stroke_w, stroke_fill=stroke_fill)
            cx += d.textbbox((0, 0), ch, font=fnt)[2] - d.textbbox((0, 0), ch, font=fnt)[0] + tracking
    cx = x
    for ch in text:
        d.text((cx, y), ch, font=fnt, fill=fill)
        cx += d.textbbox((0, 0), ch, font=fnt)[2] - d.textbbox((0, 0), ch, font=fnt)[0] + tracking
    return layer


def stamp(size, xy, text, fnt, tracking, fill, stroke_w=0, stroke_fill=None):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw_tracked(layer, xy, text, fnt, tracking, fill, stroke_w, stroke_fill)
    return layer


def gradient_text(size, xy, text, fnt, tracking, top, bottom, stroke_w, stroke_fill):
    """Tracked text filled with a vertical two-stop gradient."""
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw_tracked(layer, xy, text, fnt, tracking, (255, 255, 255, 255), stroke_w, stroke_fill)
    mask = layer.split()[-1]
    bbox = mask.getbbox()
    if not bbox:
        return layer
    grad = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    y0, y1 = bbox[1], bbox[3]
    span = max(1, y1 - y0)
    for i in range(span):
        t = i / (span - 1) if span > 1 else 0
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        gd.line([(0, y0 + i), (size[0], y0 + i)], fill=(r, g, b, 255))
    out = Image.new("RGBA", size, (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out


def heart_mask(r):
    """Crude but clean heart silhouette mask, size (2r+1) square-ish."""
    pad = r
    img = Image.new("L", (r * 4 + 2 * pad, r * 4 + 2 * pad), 0)
    d = ImageDraw.Draw(img)
    cx, cy = img.width // 2, img.height // 2
    d.ellipse([cx - r * 1.5, cy - r * 1.35, cx - r * 1.5 + r * 1.5, cy - r * 1.35 + r * 1.5], fill=255)
    d.ellipse([cx + r * 0.0, cy - r * 1.35, cx + r * 1.5, cy - r * 1.35 + r * 1.5], fill=255)
    d.polygon([(cx - r * 1.52, cy - r * 0.72), (cx + r * 1.52, cy - r * 0.72),
               (cx, cy + r * 1.45)], fill=255)
    return img.crop(img.getbbox())


def vertical_mask(size, y0, y1, a0, a1):
    """Alpha ramp (0-255) from y0*H to y1*H."""
    w, h = size
    m = Image.new("L", (1, h), 0)
    px = m.load()
    p0, p1 = int(y0 * h), int(y1 * h)
    p0, p1 = max(0, min(h, p0)), max(0, min(h, p1))
    if p1 <= p0:
        return m.resize(size)
    for y in range(h):
        if y < p0:
            v = a0
        elif y > p1:
            v = a1
        else:
            t = (y - p0) / (p1 - p0)
            v = int(a0 + (a1 - a0) * t)
        px[0, y] = max(0, min(255, v))
    return m.resize(size)


def radial_vignette(size, strength=0.55, power=2.2):
    w, h = size
    small = Image.new("L", (192, 108), 0)
    px = small.load()
    cx, cy = 95.5, 53.5
    maxd = ((cx ** 2 + cy ** 2) ** 0.5)
    for y in range(108):
        for x in range(192):
            d = (((x - cx) / maxd) ** 2 + ((y - cy) / maxd) ** 2) ** 0.5
            v = min(1.0, d * 1.12) ** power
            px[x, y] = int(255 * min(1.0, v * strength))
    return small.resize(size, Image.BILINEAR)


def scrim(img, mask, color, alpha_scale=1.0):
    if alpha_scale != 1.0:
        mask = mask.point(lambda v: int(v * alpha_scale))
    layer = Image.new("RGBA", img.size, color + (0,))
    layer.putalpha(mask)
    img.alpha_composite(layer)


# ---------------------------------------------------------------------------
# frame preparation + logo placement
# ---------------------------------------------------------------------------
def prepare(raw_path, size=MASTER):
    im = Image.open(raw_path).convert("RGB")
    w, h = im.size
    target_ratio = size[0] / size[1]
    if w / h > target_ratio:
        nw = int(round(h * target_ratio))
        x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(round(w / target_ratio))
        y = int((h - nh) * 0.42)          # keep heads, trim a little floor/sky
        im = im.crop((0, y, w, y + nh))
    im = im.resize(size, Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=2.0, percent=55, threshold=3))
    return im


def busyness_map(img, grid=(192, 108)):
    g = img.convert("L").resize(grid, Image.BILINEAR)
    e = g.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(2.2))
    return e


def integral(px, gw, gh):
    out = [[0] * (gw + 1) for _ in range(gh + 1)]
    for y in range(gh):
        row = out[y]
        nxt = out[y + 1]
        acc = 0
        for x in range(gw):
            acc += px[x, y]
            nxt[x + 1] = row[x + 1] + acc
    return out


def box_mean(ii, x0, y0, x1, y1):
    return (ii[y1][x1] - ii[y0][x1] - ii[y1][x0] + ii[y0][x0]) / max(1, (x1 - x0) * (y1 - y0))


def choose_anchor(img, busy, anchor, box_frac=(0.74, 0.42)):
    """Find the calmest window for the logo near the art-directed anchor."""
    gw, gh = busy.size
    px = busy.load()
    ii = integral(px, gw, gh)
    bw = max(6, int(box_frac[0] * gw))
    bh = max(4, int(box_frac[1] * gh))
    best, best_cost = None, None
    ax, ay = anchor
    for cy in range(int(0.14 * gh), int(0.62 * gh)):
        y0 = max(0, cy - bh // 2)
        y1 = min(gh, y0 + bh)
        if y1 - y0 < bh:
            continue
        for cx in range(int(0.20 * gw), int(0.80 * gw)):
            x0 = max(0, cx - bw // 2)
            x1 = min(gw, x0 + bw)
            if x1 - x0 < bw:
                continue
            cost = box_mean(ii, x0, y0, x1, y1)
            # gentle pull toward the art-directed anchor, plus a small
            # preference for the upper half (classic title-screen real estate)
            cost += 26.0 * (((cx / gw) - ax) ** 2 + ((cy / gh) - ay) ** 2)
            cost += 5.0 * max(0.0, (cy / gh) - 0.45) ** 2 * 100
            if best_cost is None or cost < best_cost:
                best_cost, best = cost, (cx / gw, cy / gh)
    return best or anchor, (best_cost or 0.0)


# ---------------------------------------------------------------------------
# the lockup
# ---------------------------------------------------------------------------
def compose(img, cfg):
    W, H = img.size
    base = img.convert("RGBA")
    cx_frac, cy_frac = cfg["anchor"]
    accent = cfg["accent"]

    # --- atmosphere: vignette + bottom/top scrims --------------------------
    scrim(base, radial_vignette((W, H), strength=0.62), NAVY_DEEP)
    scrim(base, vertical_mask((W, H), 0.62, 1.0, 0, 190), NAVY_DEEP)
    scrim(base, vertical_mask((W, H), 0.0, 0.16, 150, 0), NAVY_DEEP)

    # --- soft radial scrim behind the lockup -------------------------------
    bw = int(0.80 * W)
    bh = int(0.46 * H)
    bx = int(cx_frac * W - bw / 2)
    by = int(cy_frac * H - bh / 2)
    glow = Image.new("L", (192, 108), 0)
    gp = glow.load()
    gcx, gcy, gmax = 95.5, 53.5, (95.5 ** 2 + 53.5 ** 2) ** 0.5
    # brighter skies need a stronger seat behind the lettering
    peak = 200 if cfg.get("bg_lum", 128) > 170 else 150
    for y in range(108):
        for x in range(192):
            d = ((((x - gcx) / gmax) ** 2 + ((y - gcy) / gmax) ** 2) ** 0.5) * 1.05
            gp[x, y] = int(peak * max(0.0, 1.0 - min(1.0, d)) ** 1.5)
    glow = glow.resize((bw, bh), Image.BILINEAR)
    blk = Image.new("RGBA", (bw, bh), NAVY_DEEP + (0,))
    blk.putalpha(glow)
    gl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gl.alpha_composite(blk, (bx, by))
    base.alpha_composite(gl)

    # --- fonts -------------------------------------------------------------
    chapter = f"{cfg['n']} · {cfg['chapter']}"
    pix_chapter = fit_size(chapter, FONT_PIXEL, 0.40 * W, tracking=2, ceiling=40)
    f_chapter = font(FONT_PIXEL, pix_chapter)

    logo = "SHAKEDOWN!"
    fs_logo = fit_size(logo, FONT_DISPLAY, 0.74 * W, tracking=int(0.006 * W), ceiling=300)
    f_logo = font(FONT_DISPLAY, fs_logo)

    sub = "CINNAMON FUZZBUTT'S SHAMROCK SHAKE CAPER"
    fs_sub = fit_size(sub, FONT_DISPLAY, 0.60 * W, tracking=int(0.010 * W), ceiling=120)
    f_sub = font(FONT_DISPLAY, fs_sub)

    probe = ImageDraw.Draw(Image.new("RGBA", (8, 8)))
    tr_logo = int(0.006 * W)
    tr_sub = int(0.010 * W)
    tr_ch = 2

    w_logo = text_w(probe, logo, f_logo, tr_logo)
    w_sub = text_w(probe, sub, f_sub, tr_sub)
    w_ch = text_w(probe, chapter, f_chapter, tr_ch)

    gap_ch = int(0.030 * H)
    gap_sub = int(0.014 * H)
    # vertical stack: chapter / logo / subtitle
    h_logo = f_logo.size
    h_sub = f_sub.size
    h_ch = f_chapter.size
    total_h = h_ch + gap_ch + h_logo + gap_sub + h_sub + int(0.030 * H)  # + rule band

    top = int(cy_frac * H - total_h / 2)
    top = max(int(0.06 * H), min(int(0.86 * H) - total_h, top))

    y_ch = top
    y_logo = y_ch + h_ch + gap_ch
    y_sub = y_logo + h_logo + gap_sub
    y_rule = y_sub + h_sub + int(0.020 * H)

    x_ch = int(cx_frac * W - w_ch / 2)
    x_logo = int(cx_frac * W - w_logo / 2)
    x_sub = int(cx_frac * W - w_sub / 2)

    # --- chapter caption ---------------------------------------------------
    base.alpha_composite(stamp((W, H), (x_ch, y_ch), chapter, f_chapter, tr_ch,
                               accent, stroke_w=max(2, int(0.0022 * W)), stroke_fill=NAVY_DEEP))

    # --- logo: drop shadow, navy outline, gold gradient face ---------------
    sh = stamp((W, H), (x_logo, y_logo + int(0.011 * H)), logo, f_logo, tr_logo,
               (0, 0, 0, 190))
    sh = sh.filter(ImageFilter.GaussianBlur(int(0.010 * H)))
    base.alpha_composite(sh)
    ol = stamp((W, H), (x_logo, y_logo), logo, f_logo, tr_logo, NAVY_DEEP,
               stroke_w=max(4, int(0.0095 * W)), stroke_fill=NAVY_DEEP)
    base.alpha_composite(ol)
    # Adaptive logo gradient: the fill is tuned to the sky it sits on so the
    # lettering keeps contrast on both a bright dawn sky and a navy night one.
    lum = cfg.get("bg_lum", 128)
    if lum > 170:
        stops = ((255, 255, 251), GOLD)          # bright sky: light face, gold base
    elif lum < 70:
        stops = (GOLD_HI, GOLD_LO)               # night sky: saturated gold pops
    else:
        stops = ((255, 252, 236), GOLD_LO)       # mid tone: full cream-to-gold ramp
    face = gradient_text((W, H), (x_logo, y_logo), logo, f_logo, tr_logo,
                         stops[0], stops[1], 0, None)
    base.alpha_composite(face)

    # --- subtitle + flanking rules ----------------------------------------
    base.alpha_composite(stamp((W, H), (x_sub, y_sub), sub, f_sub, tr_sub, CREAM,
                               stroke_w=max(3, int(0.0042 * W)), stroke_fill=NAVY_DEEP))
    rule_w = int((0.74 * W - w_sub) / 2) - int(0.030 * W)
    if rule_w > int(0.05 * W):
        rd = ImageDraw.Draw(base)
        ry = y_sub + h_sub // 2
        for ox, direction in ((-int(0.030 * W), -1), (int(0.030 * W), 1)):
            x_start = x_sub + ox if direction < 0 else x_sub + w_sub + ox
            x_end = x_start + rule_w * direction
            rd.line([(x_start, ry), (x_end, ry)], fill=NAVY_DEEP + (235,),
                    width=max(3, int(0.0042 * H)))
            rd.line([(x_start, ry - int(0.0042 * H)), (x_end, ry - int(0.0042 * H))],
                    fill=GOLD + (235,), width=max(2, int(0.0026 * H)))

    # --- top HUD nod -------------------------------------------------------
    pad = int(0.035 * W)
    hud_px = max(11, int(0.0125 * W))
    f_hud = font(FONT_PIXEL, hud_px)
    hm = heart_mask(hud_px * 2)
    hx = pad
    hy = pad + hud_px // 2
    for i in range(3):
        ol_h = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dark = Image.new("RGBA", hm.size, NAVY_DEEP + (255,))
        grown = hm.filter(ImageFilter.MaxFilter(5))
        ol_h.paste(dark, (hx, hy + 1), grown)
        base.alpha_composite(ol_h)
        hh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        hh.paste(Image.new("RGBA", hm.size, HEART_RED + (255,)), (hx, hy), hm)
        base.alpha_composite(hh)
        hx += hm.width + int(0.008 * W)
    hx += int(0.010 * W)
    hud_text = f"SHAKES 0      {cfg['zone']}"
    base.alpha_composite(stamp((W, H), (hx, hy + 1), hud_text, f_hud, 1, CREAM,
                               stroke_w=3, stroke_fill=NAVY_DEEP))

    brand = "A GAME FOR MAVERICK"
    bw_ = text_w(probe, brand, f_hud, 1)
    base.alpha_composite(stamp((W, H), (W - pad - bw_, hy + 1), brand, f_hud, 1, GOLD,
                               stroke_w=3, stroke_fill=NAVY_DEEP))

    # --- bottom row --------------------------------------------------------
    f_press = font(FONT_PIXEL, max(14, int(0.020 * W)))
    press = "PRESS START"
    pw = text_w(probe, press, f_press, 3)
    px_ = (W - pw) // 2
    py_ = int(H * 0.885)
    pl = stamp((W, H), (px_, py_), press, f_press, 3, (0, 0, 0, 170))
    base.alpha_composite(pl.filter(ImageFilter.GaussianBlur(4)))
    base.alpha_composite(stamp((W, H), (px_, py_), press, f_press, 3, GOLD_HI,
                               stroke_w=4, stroke_fill=NAVY_DEEP))

    f_tiny = font(FONT_PIXEL, max(9, int(0.0095 * W)))
    controls = "A/D MOVE   SPACE JUMP   J TAIL SWISH   SHIFT DASH   P PAUSE"
    base.alpha_composite(stamp((W, H), (pad, int(H * 0.945)), controls, f_tiny, 1,
                               CREAM, stroke_w=3, stroke_fill=NAVY_DEEP))
    credit = "CINNAMON IS A RED PANDA, NOT A CAT   ·   STINKY WEASEL PRODUCTIONS"
    cw = text_w(probe, credit, f_tiny, 1)
    base.alpha_composite(stamp((W, H), (W - pad - cw, int(H * 0.945)), credit, f_tiny, 1,
                               GOLD, stroke_w=3, stroke_fill=NAVY_DEEP))

    return base.convert("RGB")


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(CANVAS_DIR, exist_ok=True)
    for cfg in SCREENS:
        raw = os.path.join(RAW_DIR, f"ts_{cfg['n']}.png")
        if not os.path.exists(raw):
            print(f"  ! missing raw art: {raw}")
            continue
        img = prepare(raw, MASTER)
        busy = busyness_map(img)
        anchor, cost = choose_anchor(img, busy, cfg["anchor"])
        cfg = dict(cfg, anchor=anchor, bg_lum=ImageStat_of(img, anchor))
        out = compose(img, cfg)
        master_path = os.path.join(OUT_DIR, f"title_{cfg['n']}_{cfg['slug']}.png")
        canvas_path = os.path.join(CANVAS_DIR, f"title_{cfg['n']}_{cfg['slug']}_960x540.png")
        out.save(master_path, optimize=True)
        out.resize(CANVAS, Image.LANCZOS).save(canvas_path, optimize=True)
        lum = ImageStat_of(img, anchor)
        print(f"  {cfg['n']}  {cfg['slug']:24} anchor=({anchor[0]:.2f},{anchor[1]:.2f}) "
              f"busy={cost:6.1f} bg_lum={lum:5.1f}  "
              f"{os.path.getsize(master_path)//1024}KB / {os.path.getsize(canvas_path)//1024}KB")


def ImageStat_of(img, anchor):
    w, h = img.size
    bw, bh = int(0.74 * w), int(0.42 * h)
    x0 = max(0, int(anchor[0] * w - bw / 2))
    y0 = max(0, int(anchor[1] * h - bh / 2))
    crop = img.convert("L").crop((x0, y0, min(w, x0 + bw), min(h, y0 + bh)))
    return ImageStat.Stat(crop).mean[0]


if __name__ == "__main__":
    print("ShakeDown title screens")
    main()
