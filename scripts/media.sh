#!/bin/sh
# Downloads every photograph and logo the homepage uses from eos-advisory.com (WordPress uploads) and prepares local
# copies in public/media. Sources: the live homepage (/), /portfolio (the 20 company logos and founder portraits)
# and /team (the ten headshots). Requires curl + ffmpeg.
#
# Grade: the company's own photographs stay in natural colour (house rule), with a light shared trim of saturation
# 0.92 so the Forth Bridge dawn and the portraits sit together. No tint, no duotone.
set -e
cd "$(dirname "$0")/.."
RAW=_scrape/raw; OUT=public/media; mkdir -p "$RAW" "$OUT/logos" "$OUT/team" "$OUT/founders"
U=https://eos-advisory.com/wp-content/uploads
get() { [ -s "$RAW/$(basename "$1")" ] || curl -sfL -A Mozilla/5.0 "$U/$1" -o "$RAW/$(basename "$1")"; }

# Homepage: hero background (Forth Bridge at sunrise), team group photo, partner logos, Pathways Pledge, news (3)
for f in eos-bckgrnd-image.png Eos-Headhsots-_simonhird-69-min.jpg Untitled-design.png waves.png \
  elementor/thumbs/UKBAA-member-logo_new-r1q8bvioobb26ad34eja4wno58hhwdgmvf10k4a454.png \
  elementor/thumbs/EISA-Logo-r1q8bnzzrkeauhxqchawegz5g7hbzlv803ibd1zwos.jpg \
  elementor/thumbs/New-British-Business-Bank-Logo-r2mf1muk5fomrwh4o7tu3czrgrpnkwm5d5t6so73x0.png \
  Jane-Reoch-Albert-Nicholl-Rowan-Armstrong-Ailsa-Young.jpg image-1.png image.png \
  eos-logo-dark.png cropped-Screenshot-2024-08-20-at-21.31.35-192x192.png; do get $f; done
# /portfolio: logos and founder portraits, in the live order
LOGOS="BIOLIBERTY-BRAND-BLK-1024x352.png biotangents.png CamGeneLogoinColoursRGB-1024x221.png Logo-1@2x-100-1024x298.jpg chemify_logo_wmohln.svg concinnity.png 6.png 2d13a3_0d6a6baad150412abc459820830afb97_mv2.png EnoughLogo.jpeg ensilitech.png 8.png ilc-therapeutics-logo.png laverock_logo-228w.webp nami-surgical.png NB-Logo.webp neupulse.png 9.png 5.png cropped-penhros_web_logo.jpg wobble.png"
for f in $LOGOS; do get $f; done
for f in Giovannaw_edited.webp db1eceab-32db-48b2-8ba3-64e181d7b6f3_medium.jpg richard-hammond.jpg Matthew_Baker-CHIEF_TECHNOLOGY_OFFICER_p-e1727356569102.webp david-2023-400px-1920w.webp; do get $f; done
# /team: headshots
for n in 1 3 4 5 6 7 8 9 10 11; do get $n-1.png; done

GRADE="eq=saturation=0.92"
photo() { ffmpeg -v error -y -i "$RAW/$1" -vf "scale='min($3,iw)':-2,$GRADE" -q:v 3 "$OUT/$2"; }
photo eos-bckgrnd-image.png hero.jpg 1920
# The live contour-line graphic (Dawn lines on transparent), used as published behind Get in touch
cp "$RAW/waves.png" "$OUT/waves.png"
ffmpeg -v error -y -i "$RAW/eos-bckgrnd-image.png" -vf "scale=960:-2,$GRADE" -q:v 4 "$OUT/hero-sm.jpg"
photo Eos-Headhsots-_simonhird-69-min.jpg team.jpg 1600
photo Jane-Reoch-Albert-Nicholl-Rowan-Armstrong-Ailsa-Young.jpg news-bioliberty.jpg 1000
photo image-1.png news-dxcover.jpg 1000
photo image.png news-neupulse.jpg 1000
# Founders & CEOs (homepage carousel order)
photo Giovannaw_edited.webp founders/laudisio.jpg 640
photo db1eceab-32db-48b2-8ba3-64e181d7b6f3_medium.jpg founders/armstrong.jpg 640
photo richard-hammond.jpg founders/hammond.jpg 640
photo Matthew_Baker-CHIEF_TECHNOLOGY_OFFICER_p-e1727356569102.webp founders/baker.jpg 640
photo david-2023-400px-1920w.webp founders/venables.jpg 640
# Team headshots and the 20 portfolio logos go through Pillow (this ffmpeg build has no webp encoder)
python3 scripts/images.py "$RAW" "$OUT" $LOGOS
ls -la "$OUT" "$OUT/team" | head -40
