/* One easing family for the whole site. The CSS twins live in app/globals.css as --ease-* custom properties.

   Motion reference: topology.vc, read from its bundle (build/index-D_F-KEA1.js, 2026-10-09):
     CustomEase "joe.out"    "M0,0 C0.2,0 0.1,1 1,1"     → cubic-bezier(.2,0,.1,1)
     CustomEase "joe.inOut"  "M0,0 C0.333,0 0,1 1,1"     → cubic-bezier(.333,0,0,1)
     preset fadeUp           { y: 30, opacity: 0, ease: "joe.out" }, split "lines" or "words", stagger .075, duration 1
     preset fadeRTL          { x: 50, opacity: 0, ease: "joe.out" }
     team members            fadeUp, stagger .075, duration 1.5, ease "joe.inOut"
     image/panel reveals     maskSize "100% 0%" → "100% 100%", duration 1.5, ease "joe.inOut"
     hero intro              header y -50 → 0 (1s); title words x 150 → 0, stagger .1 (1s);
                             tagline lines x 100 → 0, stagger .075 (1s, at .5); hero footer y 50 → 0 (1s, at .5)
   Lenis on topology.vc runs on its defaults (lerp .1); the house setting here is lerp .12 (README "Motion"). */

export const EASE = "0.2,0,0.1,1"; // joe.out ("eos")
export const EASE_INOUT = "0.333,0,0,1"; // joe.inOut ("eos-inout")

export const timing = {
  label: 0.8, // fadeUp without a split, shortened for small UI
  heading: 1, // fadeUp duration
  rise: 30, // fadeUp y
  shift: 50, // fadeRTL x (paragraph lines enter from the right)
  lineStagger: 0.075, // fadeUp/fadeRTL stagger
  card: 1.5, // team members: duration 1.5, joe.inOut
  cardStagger: 0.075,
  image: 1.5, // maskSize reveal: 1.5, joe.inOut
  parallax: 10, // percent drift across the screen (brief: ~10%)
  late: 0.75, // multiplier for sections marked data-late
};
