"""Team headshots and portfolio logos for public/media (called by scripts/media.sh).

Headshots: the ten /team portraits, 1023x1280 PNG, saved as 480px-wide JPEGs with the same 0.92 saturation trim.
Logos: the twenty /portfolio logos as published (PNG, JPEG, WebP and one SVG), redrawn in Ink on transparent so the
wall reads as one set inside the palette (BlueYard shows its portfolio logos in one colour too). For each raster the
background colour is read from the corners; every pixel's distance from it becomes the alpha of an Ink pixel. That
handles dark-ground logos (Concinnity's white mark on navy) as well as light ones. Trimmed to the mark, saved as PNG.
The Chemify SVG keeps its paths; its fills (grey and two gradients) are set to Ink.
The homepage partner logos (UKBAA, EISA, British Business Bank) and the Pathways Pledge partner mark get the same
treatment.
Output names follow lib/content.ts (portfolio[].logo, partners[].logo)."""
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance

INK, INK_RGB = "#272727", (0x27, 0x27, 0x27)  # --ink
raw, out, logos = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3:]

TEAM = [5, 6, 11, 7, 3, 9, 8, 10, 4, 1]  # live /team order: Arnold, Blampied, Brinsmead, Clark, Durkie, Halliday, Keddie, McNeill, Muir, Stewart
for n in TEAM:
    im = Image.open(raw / f"{n}-1.png").convert("RGBA")
    flat = Image.new("RGB", im.size, "white"); flat.paste(im, mask=im.split()[3])
    flat = ImageEnhance.Color(flat).enhance(0.92)
    flat.thumbnail((480, 600), Image.LANCZOS)
    flat.save(out / "team" / f"{n}.jpg", quality=82, optimize=True)

SLUGS = ["bioliberty", "biotangents", "camgene", "carcinotech", "chemify", "concinnity", "cumulus", "dxcover", "enough",
         "ensilitech", "gmflow", "ilc", "laverock", "nami", "naturbeads", "neupulse", "novosound", "novel", "penrhos", "wobble"]
PARTNERS = {"ukbaa": "UKBAA-member-logo_new-r1q8bvioobb26ad34eja4wno58hhwdgmvf10k4a454.png",
            "eisa": "EISA-Logo-r1q8bnzzrkeauhxqchawegz5g7hbzlv803ibd1zwos.jpg",
            "pathways": "Untitled-design.png",
            "bbb": "New-British-Business-Bank-Logo-r2mf1muk5fomrwh4o7tu3czrgrpnkwm5d5t6so73x0.png"}
for name, slug in [*zip(logos, SLUGS), *((v, k) for k, v in PARTNERS.items())]:
    src = raw / name
    if src.suffix == ".svg":
        svg = re.sub(r'fill="(#[0-9A-Fa-f]{6}|url\([^)]*\))"', f'fill="{INK}"', src.read_text())
        (out / "logos" / f"{slug}.svg").write_text(svg); continue
    im = Image.open(src).convert("RGBA")
    flat = Image.new("RGB", im.size, "white"); flat.paste(im, mask=im.split()[3])
    corners = [flat.getpixel(p) for p in [(1, 1), (flat.width - 2, 1), (1, flat.height - 2), (flat.width - 2, flat.height - 2)]]
    bg = tuple(sorted(c[i] for c in corners)[1] for i in range(3))
    diff = ImageChops.difference(flat, Image.new("RGB", flat.size, bg))
    r, g, b = diff.split()
    alpha = ImageChops.lighter(ImageChops.lighter(r, g), b).point(lambda v: 0 if v < 24 else min(255, int((v - 24) * 2.2)))
    mark = Image.new("RGBA", flat.size, INK_RGB + (0,)); mark.putalpha(alpha)
    box = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
    if box: mark = mark.crop(box)
    mark.thumbnail((520, 240), Image.LANCZOS)
    mark.save(out / "logos" / f"{slug}.png", optimize=True)
print("team", len(TEAM), "logos", len(logos))
