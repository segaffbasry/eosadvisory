# Eos Advisory: homepage redesign (private prospect demo)

A personalised redesign of the [eos-advisory.com](https://eos-advisory.com/) homepage. One route (`/`), built with
Next.js 16 (App Router, TypeScript), GSAP + ScrollTrigger + CustomEase, Lenis, and Three.js for the particle arc
(the particle arc, added at the client's request, 2026-10-09; loaded on demand). No UI kits, no CSS framework. Everything on the page is Eos's own: the logo (traced from their PNG), their typeface
(Montserrat), their colours, copy, photography and links.

```bash
npm install
npm run dev        # http://127.0.0.1:3042
npm run build      # static: / plus the framework's /_not-found (and /icon.svg)
npm run typecheck
npm run links      # checks every outbound link (see "Links")
npm run media      # re-downloads and prepares all photos and logos (needs curl, ffmpeg, Pillow)
npm run fonts      # re-downloads and subsets Montserrat (needs fontTools + brotli)
npm run logo       # re-traces the logo into lib/logo.ts (needs potrace + Pillow)
```

## Recon (phase 1, 2026-10-09)

**Platform.** WordPress 7.1 + Elementor 3.32 + JetEngine listings and JetPopups. Raw pages, CSS and source images go to `_scrape/`
(git-ignored); the scripts that fetch and prepare everything live in `scripts/` and are committed.

**Live homepage, in order** (counts in brackets):

| Live section | Content |
|---|---|
| Risk bar (fixed, top) | FCA risk warning + "Take two minutes to learn more" |
| Hero | Forth Bridge sunrise photo, "Bridging innovation with global opportunity", "Founded 2014 \| St Andrews, Scotland", Get in touch |
| Introductions | Statement, "Deep roots in Scotland, with a global perspective.", 4 paragraphs, diversity block + Pathways Pledge (1) |
| Our Partners | UKBAA, EISA, British Business Bank (3) |
| Meet some of our Founders & CEOs | Carousel (5): portrait, name, company, description, "Eos first invested", "Explore the entire Eos Portfolio" |
| Team | Group photo, one line, "Meet the entire Eos team" |
| Investors | Statement, funding paragraph, 3 route buttons opening popups (3), "Who are you?" popup (4 answers) |
| News | 3 latest items with photo and date, "All News" |
| Get in touch | Form: Name, Email, Company, Message, Send |
| Footer | Discover (6), Links (3), Contact (address, email, LinkedIn), regulatory line, copyright |

Two inner pages feed the homepage here: `/portfolio` (20 companies, logo + founder + description + website) and
`/team` (10 people, headshot, role, Investment Committee flag).

**Brand.** No vector logo is published (the PDFs carry none), so `scripts/logo.py` traces the 2500px PNG with potrace
into four parts: the sunrise arc, E, O and S (`lib/logo.ts`). The favicon (`app/icon.svg`) is built from the same paths.
No brand film exists; the hero is their own photograph. Typeface: Montserrat everywhere (Elementor kit), self-hosted.

**Palette** (from the Elementor kit `post-7.css` and the logo PNG; confirmed 2026-10-09):

| Token | Hex | Source |
|---|---|---|
| Ink | `#272727` | `--e-global-color-49ad0ef`, the logo letters |
| Dawn | `#EC790C` | `--e-global-color-accent`, the logo arc (`#ED7C0E` in the PNG) |
| Mist | `#F8F8F8` | the live pale section band |
| White | `#FFFFFF` | page ground |

The kit's `#007BC1` blue (only used on the live risk bar) and its greys are not used; greys are Ink tints via
`color-mix`. No other hue appears anywhere: glows, gradients, hovers and focus rings are all Dawn/Ink/White mixes,
and third-party logos (portfolio, partners, Pathways Pledge) are redrawn in Ink by `scripts/images.py`.

**Social.** LinkedIn only (plus the enquiries email).

## References and decisions

The brief named four references without saying which was which, so roles were assigned and recorded here:

| Reference | Used for |
|---|---|
| [blueyard.com](https://blueyard.com/) | **Look & layout.** A warm glowing sun behind the portfolio, white logo tiles over it, calm small statements, the loader's bottom-centre percentage counter. |
| [topology.vc](https://www.topology.vc/) | **Motion & scroll.** Its CustomEases, reveal presets and hero intro (values below), the team lined up as a row of portraits, full-bleed hero with the headline bottom-left and a hero footer line. |
| [daqconsulting.com](https://daqconsulting.com/) (minimal) | Restraint: the dark full-bleed opening and a single strong headline. |
| [interfere.com](https://interfere.com/) (minimal) | The quiet light page after the opening, and the partners strip (label left, logos in a row). |

Why it fits Eos: Eos is the goddess of the dawn and the logo is a sunrise arc. BlueYard's glowing sun, the Forth
Bridge photographed at sunrise, and the Dawn accent tell one story; Topology's contour-line identity echoes the
contour graphic Eos already uses (`waves.png`, behind Get in touch).

**Copied interaction: BlueYard's portfolio LogoTile** (brief bracket was empty; this was chosen because it maps onto
Eos's 20 portfolio companies). Rebuilt from its Vue component (`_nuxt/C4gYN_lE.js`) and CSS
(`_nuxt/LogoTile.B-K2MDYy.css`) in `components/home/LogoTile.tsx` + `styles/home.css`:

| Part | BlueYard value (kept) |
|---|---|
| Top strip | `max-width: tile − label width` (the notch), opens to 100%, `.5s cubic-bezier(.33,0,.2,1)` |
| Logo | open `translateY(-50%) scale(.75)` with `cubic-bezier(.5,0,0,1)`; close `scale(1)` with `cubic-bezier(0,0,0,.8)`; `transform .7s`. Changed for readability (client feedback): `translateY(-66%) scale(.55)` with the text anchored to the tile's bottom, and every logo in a fixed box, so no logo meets the text (measured at 375 to 1440) |
| Description / "Visit site" | `opacity .4s, transform .4s cubic-bezier(0,0,0,1)`; text from `translate(0,33%)`; `.2s` delay in, none out |
| Gradient outline | `border-image` in the section gradient; in `.4s cubic-bezier(.8,0,1,1)`, out `.4s cubic-bezier(.33,0,.2,1)` |
| Touch | mouse uses pointer enter/leave; on touch a tap opens, a tap outside closes |

Differences: the section gradient is Dawn (`--dawn-gradient`), labels are Montserrat sentence case (house rule: the
client's own font, no mono), BlueYard's "Exit"/"Prior work" flags have no Eos equivalent. Descriptions are clamped to
three lines (two below 1300px; hidden below 900px, where a tap shows the logo and "Visit site"). Focus opens a tile too, for keyboard users.

Buttons use the live Eos button shape (square, outlined, arrow) with a sunrise hover (client request: "better, cooler
hover"): see "Buttons" below. Text links keep BlueYard's `.button__line` hover (a Dawn line slides in over `.4s`).

## Sections and content counts

Grounds: Ink hero, then white with Mist bands; no scroll-driven recolouring (house rule).

| # | Section | Live homepage | This build | Notes |
|---|---|---|---|---|
| 1 | Hero (Ink, photo) | title, meta, 1 button, risk bar | title, meta, 2 buttons, risk warning in the hero foot | The live fixed risk bar becomes the hero's footer line (and repeats in the footer). |
| 2 | Introductions (`#introductions`) | statement, roots line, 4 paragraphs | all | The portfolio sentence is restaged as its two halves (Quality of life: 3; Environmental sustainability: 4). Team group photo moved here (imagery early). |
| 3 | Portfolio (`#portfolio`, Mist) | 5 founders | 5 founders + 20 companies | All five founders; the 20-company wall comes from `/portfolio`, under the logo's arc drawn in Three.js particles (own section). Phones show the first 12 tiles, with the link to the full live page. |
| 4 | Investors (`#investors`) | statement, paragraph, 3 routes, "Who are you?" (4), partners (3) | all | Every line of the three popups is shown on the cards. "Who are you?" answers light the matching route; "seeking investment" scrolls to Get in touch. New: ticket-size chart built only from the popups' stated minimums and typical ranges. |
| 5 | Team (`#team`, Mist) | photo, line, link, diversity block | line, link, diversity block + Pathways Pledge, 10 people | The 10 people from `/team` (Investment Committee marked). Phones and tablets: a sideways strip. |
| 6 | News (`#news`) | 3 | 3 | Same three, newest first. Phones: a sideways strip. |
| 7 | Get in touch (`#get-in-touch`, Mist) | form (4 fields) | form (4 fields) + address, email, LinkedIn | Own section, separate from the footer (house rule). The form does not submit. |
| 8 | Footer (Ink) | 3 columns, legal, copyright | same + risk warning | No scroll reveals in the footer (house rule). |

Copy is verbatim. Two corrections: the homepage spells Penrhos Bio "Penhros Bio" (the company's and `/portfolio`'s
spelling is used), and the live menu's "enquires@" typo uses the footer's correct `enquiries@`. The `<title>` dash
became a pipe (house rule: no em or en dashes). Company names on tiles come from their logos (the live cards show
logos only); "Silverbac" is the brand of the company the live card describes as Novel Technologies.

## Page height

Measured on the production build with every reveal played (`page.cjs` in the scratchpad: full scroll, then
`scrollHeight`):

| Width | Height | Viewports |
|---|---|---|
| 1440 × 900 | 7,497 px | 8.3 |
| 768 × 812 | 8,362 px | 10.3 |
| 375 × 812 | 9,482 px | 11.7 |

Desktop is slightly over the brief's upper bound since the client asked for more padding around the particle
section; before that it sat on the bound (hero 900, introductions ~890, portfolio ~1,740, investors ~1,320, team ~610,
news ~650, get in touch ~520, footer ~530). Narrow screens are longer because two-column layouts stack; the long lists
(team, routes, news) become sideways strips there and the portfolio wall drops to 12 tiles to keep it in check.

## Systems

### Preloader (`components/Preloader.tsx`, `styles/preloader.css`)
Eos signing its name. Built from the traced logo parts on one GSAP timeline:

| Stage | Time | What happens |
|---|---|---|
| Build | 0.10 to 0.80s | E, O, S rise into place one after another (topology fadeUp: 30px equivalent, eos) |
| | 0.45 to 1.45s | the arc is drawn as light along its own path, thin end to round end (a clip rect widening, eos-inout): a hot white point runs along the arc's centreline at the leading tip with a slight flicker, and the drawn line glows behind it (blurred halo + bloom, screened, clipped to what has been drawn). Only the arc glows, never the letters (client feedback). |
| | 1.40 to 1.90s | the tip burns out; the glow settles low, then fades during the exit |
| | 0.10 to 1.60s | counter 0 to 100% at the bottom centre (BlueYard's loader counter) |
| Hold | 0.25s | finished logo |
| Exit | 0.75s | the Ink ground opens as a circle rising from the bottom edge (a sunrise) onto the hero, whose own first frame is the same darkness; the logo glides into the header logo's position |

Measured: handover at about 2.1 to 2.35s, fully clear by about 2.9s (house rule: loaders must be noticeable, about
2.5s, every load; the brief's 1.5 to 2.0s is overridden by that later client feedback). It waits for the font and
hero photo for at most 0.6s more and a failsafe ends it at 3.4s. Handover: removes `is-loading`, sets
`data-intro="done"`, dispatches `intro:done`. Lenis is stopped until then (tested: a wheel during the loader leaves
`scrollY` at 0 and is not replayed). The logo is a separate layer above the masked ground, so the opening circle never
erases it. Plays on every load; `aria-hidden`; skipped instantly with reduced motion; hidden by `<noscript>`; cleaned up
in the effect.

### Hero (`components/home/Hero.tsx`)
On `intro:done` the photo comes up out of the preloader's Ink (brightness .3 to 1, scale 1.14 to 1.04, 2.4s) while a
Dawn bloom swells over the photo's own sun; then Topology's hero intro, values copied: header actions y −50 to 0;
title words x 150 to 0, 0.1s apart; actions x 100 to 0, 0.075s apart; hero footer y 50 to 0 (1s each, joe.out). On
scroll the photo drifts 12% and the copy lifts and fades slightly.

### Motion system (`components/motion.tsx`, `lib/ease.ts`)
Lenis (lerp .12, house setting) on the GSAP ticker, synced with ScrollTrigger; anchors go through Lenis; overlays and
the preloader stop it. Easing family from topology.vc's bundle: `eos` = joe.out `cubic-bezier(.2,0,.1,1)`,
`eos-inout` = joe.inOut `cubic-bezier(.333,0,0,1)`.

| Move | Applied to | Values (Topology preset) |
|---|---|---|
| heading | section headings | whole phrase fades and rises 30px, 1s, eos (fadeUp) |
| text | paragraphs | rendered lines slide 50px in from the right and fade, 0.075s apart, 1s (fadeRTL, split lines) |
| label | buttons, small type, partner logos | fade + 30px rise, 0.8s |
| card | cards, tiles, people, news | batched fade + 30px rise, 0.075s apart, 1.5s, eos-inout (Topology's team members) |
| image | photographs | top-down wipe, 1.5s, eos-inout (Topology's maskSize reveal) + ±5% drift with `data-parallax` (10% travel) |

Each plays once; sections marked `data-late` (team, news, contact) run at 75% of the duration. No per-character effects
outside the preloader and hero. Start states are set before first paint only when JS runs (`html.js`) so nothing
flashes; without JS or with reduced motion everything is simply visible. After a reveal its inline styles are cleared.

### Header and menu (`components/chrome.tsx`, `styles/chrome.css`)
Frameless header (no bar), colour from what is under it (`[data-tone="dark"]` areas turn it white), hides on scroll
down, returns on scroll up or focus. Menu: a plain Ink sheet opening as a circle from the Menu button (no glow, client
feedback), then links rising 0.075s apart; one timeline, reversed to close. Focus trap, Esc closes, focus returns to
the trigger (tested with the keyboard only). Items: the page's sections (via Lenis), the live site's pages, the two
latest news items, email and LinkedIn.

### Particle arc (`components/home/ParticleArc.tsx`)
Client requests (2026-10-09): first "blasting particles, crazy good three js, scroll animated"; then "the circle is just
like the logo, top circle only line, and glowed, bursting particle", with more padding so the particles do not sit on
other sections. So the portfolio wall is its own section, and above it the logo's sunrise arc is drawn in particles:
its ends sit just above the grid's top corners and it rises over the centred "Eos Portfolio" heading, as the logo's
arc rises over E O S. Like the logo it is thin at the left end and thick and round at the right.

| Points | Share | Behaviour |
|---|---|---|
| Line | ~55% | packed along the arc, spread across it by the arc's local thickness; a slow shimmer |
| Halo | ~15% | large faint points either side: the glow around the line |
| Sparks | ~30% | thrown off the drawn line along its outward normal, fading, then thrown again; nearly half leave from the leading tip, so the tip bursts as it draws and keeps bursting from the round end |

Scroll through the section drives it: the arc draws itself left to right (progress 0 to .45) and blows apart outward
as it leaves (.78 to 1), smoothed in the render loop. The geometry is recomputed from the layout (grid and heading
positions) on resize: chord c, rise s, radius R = (c²/4 + s²)/2s. Orthographic camera in CSS pixels; about 21k points
on desktop, 9k on phones; device pixel ratio capped at 2. The canvas fills the section and fades out at its top and
bottom (CSS mask), and the section has extra padding (104 to 168px top, 88 to 136px bottom), so nothing reaches the
sections around it. Palette only (Dawn, deep Dawn, pale Dawn). Renders only while on screen; reduced motion gets one
still frame of the finished arc; without WebGL nothing is drawn. Three.js is imported inside the effect.

### Buttons (`components/ui.tsx` ButtonBody, `styles/ui.css`)
The live Eos shape (square corners, outlined, arrow after the label), 52px tall, with a sunrise hover, the same move as
the preloader's exit:

| Part | Hover / focus |
|---|---|
| Fill | a Dawn circle rises from below the bottom edge: `clip-path: circle(0% → 150% at 50% 135%)`, .65s eos-inout |
| Label | rolls up to a twin copy (−110% / 110% → 0), .65s eos-inout; the twin is `aria-hidden` |
| Arrow | slides out right while its twin slides in from the left, .05s later |
| Colours | every tone ends Dawn with Ink type (5.4:1); press scales to .98 |

### Portfolio founders (`components/home/Portfolio.tsx`)
A tab list of the five founders; hover, focus or tap swaps the portrait (stacked images wiping in) and the card. No
autoplay, no pin.

### Ticket-size chart (`components/home/Investors.tsx`)
Log scale £5k to £1M+. Dot = stated minimum, bar = stated typical range; Venture Partners' "£1M+" fades off the end;
Angel Syndicate states only a minimum. Hovering a row or card highlights that route in both; screen readers get each
row as a sentence.

## Private-demo settings
- `robots: { index: false, follow: false }` (noindex, nofollow, nocache); no sitemap or robots route.
- PostHog EU in `lib/posthog.ts` (key overridable with `NEXT_PUBLIC_POSTHOG_KEY`, literal fallback for Vercel),
  pageview/pageleave/autocapture/session recording on, surveys off, `site` and UTM registration, `scroll_depth` at
  25/50/75/100 (each once). The snippet's `<script>` has no `id`.
- No visible Regen UI. Links never navigate (house rule): hrefs are the real URLs (checked below) and open in a new tab
  with `rel="noopener"`, but a capture-phase guard cancels clicks on any link not starting with `#`. The form's submit
  is cancelled too.

## Links
`npm run links` checks all 35 outbound URLs: eos-advisory.com pages against `/page-sitemap.xml` (the news archive is
linked from the live homepage but not in the sitemap; it answers 200), the complaints PDF, all 20 company sites, the 3
partners, the 3 news releases and LinkedIn. Last run (2026-10-09): 0 failed; bbinv.co.uk, biotangents.co.uk and
businesswire.com answer scripts with 403 (bot blocking) and are reported as `BOT`. If the local resolver cannot find a
host, the script confirms it over DNS-over-HTTPS before failing it (this happened for naturbeads.com and
namisurgical.com on one run). No `#` links anywhere.

## Images
All from eos-advisory.com uploads, downloaded by `scripts/media.sh` and prepared in natural colour (saturation 0.92,
no tint; house rule):
- `hero.jpg` / `hero-sm.jpg`: the live hero background, the Forth Bridge at sunrise (`eos-bckgrnd-image.png`).
- `team.jpg`: the live Team block photo (`Eos-Headhsots-_simonhird-69-min.jpg`).
- `founders/*`: the five carousel portraits.
- `team/*`: the ten `/team` headshots (shown greyscale, colour on hover).
- `news-*`: the three news photos.
- `logos/*`: the 20 `/portfolio` logos, the 3 partner logos and the Pathways Pledge mark, redrawn in Ink on transparent
  by `scripts/images.py` (alpha from each pixel's distance to the logo's own background colour, so dark-ground logos
  work too; the Chemify SVG has its fills set to Ink).
- `waves.png`: the live contour graphic, as published.

## Verification (2026-10-09)
- `npm run typecheck` and `npm run build` pass; static pages: `/`, `/_not-found` (+ `/icon.svg`).
- Preloader: frames captured at 150 to 3,600ms; no flash of page or hero before it; colour continuous at handover;
  scroll locked; skipped with reduced motion.
- 375, 768, 1440: no horizontal scroll, no console errors, no broken images; reduced motion renders everything in place.
- Menu: reached by Tab, focus stays inside over 20 Tabs, Esc closes and returns focus.
- LogoTile compared with BlueYard's live tile (same states and timings).
- Built HTML: no em/en dashes, no `href="#"`, noindex present, PostHog present.

## Outstanding
- Slug and Vercel deployment to `{slug}.regendigital.co` (separate step).
