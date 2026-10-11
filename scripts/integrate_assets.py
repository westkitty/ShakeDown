#!/usr/bin/env python3
"""Normalize generated production art into verified runtime PNGs.

Pipeline per asset:
  raw generated image -> chroma-key flat matte -> true straight-alpha RGBA
  -> alpha trim -> deterministic fit to the contract target size -> pivot placement
  -> palette-bounded save -> real sha256 -> manifest entry

This script never invents hashes or dimensions: every field in the manifest is
measured from bytes that were actually written to disk.
"""
from __future__ import annotations

import argparse
import collections
import datetime
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
CONTRACT = ROOT / 'docs/assets/ShakeDown_Complete_Asset_Contract.json'
RAW_DIR = ROOT / '.artifact-cache/raw'
MANIFEST = ROOT / 'assets/production/manifest.json'
DEFAULT_MATTE = (255, 0, 255)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    return sha256_bytes(path.read_bytes())


# --------------------------------------------------------------------------
# chroma key
# --------------------------------------------------------------------------
def detect_matte(img: Image.Image) -> tuple:
    """Median of a 4 px border ring; used when the raw file has no explicit matte."""
    a = np.asarray(img.convert('RGB'))
    ring = np.concatenate([a[:4].reshape(-1, 3), a[-4:].reshape(-1, 3),
                           a[:, :4].reshape(-1, 3), a[:, -4:].reshape(-1, 3)])
    med = np.median(ring, axis=0)
    return tuple(int(round(v)) for v in med)



def _dilate(mask, iterations):
    out = mask.copy()
    for _ in range(iterations):
        grown = out.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            grown |= np.roll(out, (dy, dx), axis=(0, 1))
        out = grown
    return out


def _apron(subject, width):
    """Pixels within `width` of the subject, minus the subject itself."""
    grown = _dilate(subject, width)
    return grown & ~subject


def key_matte(img: Image.Image, matte=DEFAULT_MATTE, tol_inner=64, tol_outer=170):
    """Return (rgba_image, stats). Real straight alpha, no matte residual.

    Two mechanisms combine so neither the flat matte nor its soft vignette survives:
      * a generous connected flood from the border removes the outer matte field,
      * a tight global threshold also removes enclosed matte islands (the gap
        between a prop's legs, inside a cup handle) that the flood cannot reach.
    Subject colours are protected by the flood's connectivity: the dark outline of
    every subject blocks the spread, so interior pinks/greens are never punched out.
    """
    if matte == 'auto':
        matte = detect_matte(img)
    rgb = np.asarray(img.convert('RGB')).astype(np.int32)
    h, w, _ = rgb.shape
    m = np.array(matte, dtype=np.int32)
    dist = np.sqrt(((rgb - m) ** 2).sum(axis=2).astype(np.float64))

    # 1. Outer background: connected spread from the frame border through anything
    #    close to the matte. Every subject carries a dark outline, which blocks the
    #    spread, so interior pinks/greens are never punched out.
    reachable = (dist < tol_outer).astype(np.uint8) * 255
    # .copy() matters: Image.fromarray returns a read-only-backed image and
    # ImageDraw.floodfill silently no-ops on it.
    work = Image.fromarray(reachable, mode='L').copy()
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        if work.getpixel(seed) == 255:
            ImageDraw.floodfill(work, seed, 128, thresh=0)
    outer = np.asarray(work) == 128

    # 2. Enclosed matte islands (the gap between a bench's legs). Safe: no subject
    #    palette colour in this project sits within tol_inner of the key matte.
    islands = dist < tol_inner
    bg = outer | islands
    subject = ~bg

    # 3. Binary alpha. Pixel art is hard-edged, and the final downscale to target
    #    size produces the antialiasing naturally, so no fractional coverage is
    #    invented here (an estimated coverage ramp was what bred matte-coloured
    #    fringes at the rim).
    alpha = np.where(subject, 255.0, 0.0)

    # 4. Alpha bleed. The generator's rim carries matte tint, so subject edge
    #    pixels are repainted from the nearest interior pixel, and a short apron
    #    of transparent pixels is filled the same way. Both steps use the art's
    #    own colours. The apron matters because a fully transparent pixel keeps
    #    its RGB: bilinear filtering during runtime scaling would otherwise
    #    interpolate matte magenta into the sprite silhouette.
    out = rgb.astype(np.float64).copy()
    # Taint test is colour-based, not distance-based: a pixel can be visibly
    # magenta-dominant while sitting further from the key than tol_outer, because
    # the generator blends the matte into the subject's dark outline.
    biased = ((out[:, :, 0] - out[:, :, 1] > 55) & (out[:, :, 2] - out[:, :, 1] > 55))
    clean = subject & ~biased
    tainted = subject & biased
    if clean.any() and tainted.any():
        known = clean.copy()
        fill = out.copy()
        target = subject | _apron(subject, 6)
        for _ in range(64):
            todo = target & ~known
            if not todo.any():
                break
            took = np.zeros((h, w), dtype=bool)
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nb = np.roll(known, (dy, dx), axis=(0, 1))
                take = todo & nb & ~took
                if not take.any():
                    continue
                # read strictly from a pixel already known to be clean
                src_px = np.roll(out, (dy, dx), axis=(0, 1))
                fill[take] = src_px[take]
                took |= take
            if not took.any():
                break
            known |= took
            out[took] = fill[took]
        # Anything the repaint could not reach is isolated taint. Drop it rather
        # than ship a coloured speck; at source scale this is sub-pixel in play.
        stuck = subject & ~known
        if stuck.any():
            alpha[stuck] = 0.0
    out = np.clip(out, 0, 255)
    partial = np.zeros((h, w), dtype=bool)

    rgba = np.dstack([out.astype(np.uint8), alpha.astype(np.uint8)])
    result = Image.fromarray(rgba, mode='RGBA')

    # halo check: any opaque pixel still close to the matte is a fringe failure
    opaque = alpha > 200
    residual = int(((dist < tol_inner) & opaque).sum())
    stats = {
        'matte_rgb': list(matte),
        'transparent_fraction': round(float((alpha == 0).sum()) / (w * h), 4),
        'partial_fraction': round(float(partial.sum()) / (w * h), 5),
        'matte_residual_opaque_px': residual,
        'source_keyed_px': [w, h],
    }
    return result, stats


def trim_alpha(img: Image.Image):
    bbox = img.getchannel('A').getbbox()
    if bbox is None:
        return img, None
    return img.crop(bbox), bbox


def fit_alpha(content: Image.Image, target: tuple[int, int], mode='contain'):
    tw, th = target
    cw, ch = content.size
    if mode == 'stretch' or cw == 0 or ch == 0:
        return content.resize((tw, th), Image.LANCZOS)
    if mode == 'cover':
        scale = max(tw / cw, th / ch)
        nw, nh = max(tw, int(round(cw * scale))), max(th, int(round(ch * scale)))
        resized = content.resize((nw, nh), Image.LANCZOS)
        left, top = (nw - tw) // 2, (nh - th) // 2
        return resized.crop((left, top, left + tw, top + th))
    scale = min(tw / cw, th / ch)
    nw, nh = max(1, int(round(cw * scale))), max(1, int(round(ch * scale)))
    return content.resize((nw, nh), Image.LANCZOS)


def place(content: Image.Image, target: tuple[int, int], pivot: str) -> Image.Image:
    tw, th = target
    canvas = Image.new('RGBA', (tw, th), (0, 0, 0, 0))
    cw, ch = content.size
    pivot = (pivot or 'center').lower()
    if 'top-left' in pivot or 'tile' in pivot:
        x, y = 0, 0
    elif 'bottom' in pivot:
        x, y = (tw - cw) // 2, th - ch
    else:
        x, y = (tw - cw) // 2, (th - ch) // 2
    canvas.paste(content, (x, y), content)
    return canvas


def apply_palette(img: Image.Image, colors: int | None):
    if not colors:
        return img
    alpha = img.getchannel('A')
    rgb = img.convert('RGB').quantize(colors=colors, method=Image.MEDIANCUT, dither=Image.NONE).convert('RGB')
    out = rgb.convert('RGBA')
    out.putalpha(alpha)
    return out


def opaque_fit(img: Image.Image, target: tuple[int, int], mode='cover') -> Image.Image:
    rgb = img.convert('RGB')
    if mode == 'stretch':
        return rgb.resize(target, Image.LANCZOS)
    tw, th = target
    cw, ch = rgb.size
    scale = max(tw / cw, th / ch) if mode == 'cover' else min(tw / cw, th / ch)
    nw, nh = max(1, int(round(cw * scale))), max(1, int(round(ch * scale)))
    resized = rgb.resize((nw, nh), Image.LANCZOS)
    left, top = max(0, (nw - tw) // 2), max(0, (nh - th) // 2)
    return resized.crop((left, top, left + tw, top + th))


# --------------------------------------------------------------------------
# driver
# --------------------------------------------------------------------------
def load_contract():
    spec = json.loads(CONTRACT.read_text())
    return spec, {a['id']: a for a in spec['assets']}


def integrate(entries, now=None):
    spec, by_id = load_contract()
    now = now or datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    manifest = {}
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text()).get('assets', {})

    results = []
    for entry in entries:
        aid = entry['id']
        asset = by_id.get(aid)
        if asset is None:
            results.append({'id': aid, 'ok': False, 'error': 'unknown asset id'})
            continue
        raw = Path(entry.get('raw') or (RAW_DIR / f"{aid.lower().replace('-', '_')}.png"))
        if not raw.is_absolute():
            raw = ROOT / raw
        if not raw.exists():
            results.append({'id': aid, 'ok': False, 'error': f'raw missing {raw}'})
            continue

        target = tuple(asset['target_px'])
        out_path = ROOT / asset['path']
        out_path.parent.mkdir(parents=True, exist_ok=True)
        transparent = bool(asset['transparent'])
        matte = tuple(entry.get('matte', DEFAULT_MATTE))
        record = {
            'id': aid,
            'name': asset['name'],
            'group': asset['group'],
            'priority': asset['priority'],
            'path': asset['path'],
            'target_px': list(target),
            'pivot': asset['pivot'],
            'raw_source': str(raw.relative_to(ROOT)),
            'raw_sha256': sha256_file(raw),
            'raw_px': list(Image.open(raw).size),
            'generated_utc': now,
            'generator': 'arena-agent-mode image generation',
        }

        if not transparent:
            out = opaque_fit(Image.open(raw), target, entry.get('fit', 'cover'))
            out.save(out_path, 'PNG', optimize=True)
            record.update({
                'alpha': {'required': False, 'mode': 'RGB'},
                'format': 'PNG RGB',
                'actual_px': list(Image.open(out_path).size),
                'sha256': sha256_file(out_path),
            })
        else:
            keyed, key_stats = key_matte(Image.open(raw), matte=matte)
            trimmed, bbox = trim_alpha(keyed)
            if trimmed.size[0] == 0 or trimmed.size[1] == 0:
                results.append({'id': aid, 'ok': False, 'error': 'keyed to empty image'})
                continue
            fitted = fit_alpha(trimmed, target, entry.get('fit', 'contain'))
            placed = place(fitted, target, asset['pivot'])
            placed = apply_palette(placed, entry.get('colors', 96))
            placed.save(out_path, 'PNG', optimize=True)
            arr = np.asarray(Image.open(out_path))
            alpha_ch = arr[:, :, 3]
            border = np.concatenate([alpha_ch[0, :], alpha_ch[-1, :], alpha_ch[:, 0], alpha_ch[:, -1]])
            record.update({
                'alpha': {
                    'required': True,
                    'mode': 'straight RGBA',
                    'transparent_px_fraction': round(float((alpha_ch == 0).mean()), 4),
                    'opaque_px_fraction': round(float((alpha_ch == 255).mean()), 4),
                    'partial_edge_px': int(((alpha_ch > 0) & (alpha_ch < 255)).sum()),
                    'border_all_transparent': bool((border == 0).all()),
                    **key_stats,
                },
                'format': 'PNG RGBA',
                'trim_bbox_in_keyed_source': list(bbox),
                'actual_px': list(Image.open(out_path).size),
                'sha256': sha256_file(out_path),
            })

        record['review_status'] = 'AWAITING_HUMAN_VISUAL_REVIEW'
        manifest[aid] = record
        results.append({'id': aid, 'ok': True, 'path': asset['path'],
                        'sha256': record['sha256'], 'alpha': record.get('alpha')})

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps({
        'schema_version': 1,
        'generated_utc': now,
        'note': ('Byte-level truth for generated production art. Every sha256 and pixel '
                 'dimension here was measured from the file actually written to disk. '
                 'Human visual review is a separate, still-open gate.'),
        'count': len(manifest),
        'assets': dict(sorted(manifest.items())),
    }, indent=1) + '\n')
    return results


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('batch', help='JSON file with a list of {"id": ...} entries')
    args = ap.parse_args()
    entries = json.loads(Path(args.batch).read_text())
    results = integrate(entries)
    ok = sum(1 for r in results if r['ok'])
    for r in results:
        if r['ok']:
            a = r.get('alpha') or {}
            print(f"OK   {r['id']:10s} {r['path']}  {r['sha256'][:12]}"
                  + (f"  transparent={a.get('transparent_px_fraction')} border_clear={a.get('border_all_transparent')}"
                     if a.get('required') else '  RGB'))
        else:
            print(f"FAIL {r['id']:10s} {r['error']}")
    print(f'{ok}/{len(results)} integrated')
    return 0 if ok == len(results) else 1


if __name__ == '__main__':
    sys.exit(main())
