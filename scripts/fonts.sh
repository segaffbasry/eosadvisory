#!/bin/sh
# eos-advisory.com sets everything in Montserrat (Elementor kit post-7.css: primary 600, secondary/text 400,
# accent 500), loaded from Google Fonts. The wordmark in the logo is Montserrat too. Montserrat is SIL OFL, so the
# variable font (wght 100 to 900) is self-hosted here, subset to Latin and converted to woff2 with fontTools
# (pip install fonttools brotli). Poppins appears on the live site only in the risk-warning bar; it is not used.
set -e
cd "$(dirname "$0")/.."
TMP=_scrape/fonts; mkdir -p "$TMP" public/fonts
GH=https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat
curl -sfL "$GH/Montserrat%5Bwght%5D.ttf" -o "$TMP/montserrat.ttf"
curl -sfL "$GH/Montserrat-Italic%5Bwght%5D.ttf" -o "$TMP/montserrat-italic.ttf"
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212"
for f in montserrat montserrat-italic; do
  python3 -m fontTools.subset "$TMP/$f.ttf" --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file="public/fonts/$f.woff2"
done
ls -la public/fonts
