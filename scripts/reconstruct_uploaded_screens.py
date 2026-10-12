#!/usr/bin/env python3
"""Reproduce the three owner-supplied ShakeDown screen plates from actual repo PNGs.

Source: ShakeDown_Screens_2026-10-11.zip, build/build_screens.py.
The exact original script is stored losslessly in uploaded_screens_source.xz.b64
(SHA-256 verified before execution), then rewritten only for portable paths.
The readable, portable generator is retained as scripts/build_uploaded_screens.py.
Do not treat these provisional images as owner art approval.
"""
from __future__ import annotations

import base64
import hashlib
import lzma
import os
from pathlib import Path
import runpy
import shutil
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts/uploaded_screens_source.xz.b64"
BUILDER = ROOT / "scripts/build_uploaded_screens.py"
OUT = ROOT / "assets/screens"
CACHE = ROOT / ".artifact-cache/uploaded-screens"
FONTS = CACHE / "fonts"
EXPECTED_SHA256 = "2634be093b2a42249233962324047d68b80f81e2bb16fda1d5152d62bf7dfc64"
FONTS_ON_GITHUB = {
    "PressStart2P-Regular.ttf": ("ofl/pressstart2p/PressStart2P-Regular.ttf", "034c77f1f05ec89421e4a63f0e3a4ca1ecf852cc6d2bf611f126f275728e017d"),
    "Silkscreen-Bold.ttf": ("ofl/silkscreen/Silkscreen-Bold.ttf", "768476aa712d4f5c3e18d3bce80f980a8bd3f72b7094d22ec5e768df3acfed61"),
    "Silkscreen-Regular.ttf": ("ofl/silkscreen/Silkscreen-Regular.ttf", "c845473330b94c2079ce9af01c51ac8ba2d99c24f4d14c039843bbb8e642ebd8"),
    "VT323-Regular.ttf": ("ofl/vt323/VT323-Regular.ttf", "cf4de751ada78ceac033dbe16a687742939995b77bc2a052ae17a4957958594d"),
}

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def prepare_source() -> None:
    packed = SOURCE.read_text(encoding="utf-8").strip()
    original = lzma.decompress(base64.b64decode(packed, validate=True))
    if sha(original) != EXPECTED_SHA256:
        raise RuntimeError("Owner-supplied original generator SHA-256 mismatch")
    text = original.decode("utf-8")
    substitutions = {
        'REPO = "/home/user/shake/"': f'REPO = {str(ROOT) + "/"!r}',
        'OUT  = "/home/user/screens/"': f'OUT  = {str(OUT) + "/"!r}',
        'WORK = "/home/user/work/"': f'WORK = {str(CACHE) + "/"!r}',
        'FONTS = "/home/user/work/fonts/"': f'FONTS = {str(FONTS) + "/"!r}',
    }
    for old, new in substitutions.items():
        if text.count(old) != 1:
            raise RuntimeError(f"Portable path anchor missing: {old}")
        text = text.replace(old, new)
    BUILDER.write_text(text, encoding="utf-8")

def prepare_fonts() -> None:
    FONTS.mkdir(parents=True, exist_ok=True)
    base = "https://raw.githubusercontent.com/google/fonts/main/"
    vendored = ROOT / "scripts/title-fonts/PressStart2P-Regular.ttf"
    for name, (remote, expected) in FONTS_ON_GITHUB.items():
        dest = FONTS / name
        if name == "PressStart2P-Regular.ttf" and vendored.is_file() and sha(vendored.read_bytes()) == expected:
            shutil.copyfile(vendored, dest)
        elif not dest.exists() or sha(dest.read_bytes()) != expected:
            req = urllib.request.Request(base + remote, headers={"User-Agent": "ShakeDown-screen-reconstruction"})
            with urllib.request.urlopen(req, timeout=45) as response:
                dest.write_bytes(response.read())
        if sha(dest.read_bytes()) != expected:
            raise RuntimeError("Font checksum mismatch: " + name)

def verify_outputs() -> None:
    names = ("01_start_level", "02_game_over_continue", "03_victory_credits")
    expected = {(f"{name}{'_clean' if clean else ''}_{size[0]}x{size[1]}.png",size)
                for name in names for clean in (False,True) for size in ((960,540),(1920,1080))}
    actual = {p.name for p in OUT.glob("*.png")}
    if actual != {name for name, _ in expected}:
        raise RuntimeError(f"Unexpected output inventory; missing={set(name for name,_ in expected)-actual}")
    for name,size in expected:
        data = (OUT / name).read_bytes()
        if len(data) < 10000 or data[:8] != bytes.fromhex("89504e470d0a1a0a"):
            raise RuntimeError("Missing or invalid PNG: " + name)
        wh = (int.from_bytes(data[16:20],"big"),int.from_bytes(data[20:24],"big"))
        if wh != size:
            raise RuntimeError(f"Dimensions incorrect: {name} is {wh}")
        print(f"verified {name} {len(data)} bytes {sha(data)}")

def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    CACHE.mkdir(parents=True, exist_ok=True)
    prepare_source()
    prepare_fonts()
    runpy.run_path(str(BUILDER), run_name="__main__")
    verify_outputs()
    print("12 owner-supplied PNG plates reconstructed; no SVGs")

if __name__ == "__main__":
    main()
