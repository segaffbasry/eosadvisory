import { FLIP, VIEWBOX, logoParts } from "@/lib/logo";

/* The Eos logo, traced from the live PNG (scripts/logo.py): the sunrise arc in Dawn over the E, O and S in the
   current text colour. Each part carries data-part so the preloader can build it piece by piece.

   With `wipe` (the preloader only) the arc is drawn as light:
     arc-wipe   a clip rect the preloader widens, drawing the arc from its thin end to its round end
     arc-glow   two blurred copies of the arc under the same clip, screened over the ground: a wide warm halo
                (Dawn) and a tight hot bloom (pale Dawn), so the line glows where it has been drawn and nowhere else
     arc-head   the hot point at the leading tip: a white-to-Dawn radial spot, blurred, moved along the arc's
                centreline by the preloader
   Glow and head are hidden until the preloader animates them, and never appear in the header or footer logos. */
export function Logo({ title = "Eos", className = "logo", wipe }: { title?: string; className?: string; wipe?: string }) {
  const clip = wipe ? `url(#${wipe})` : undefined;
  return <svg className={className} viewBox={VIEWBOX} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title || undefined} focusable="false" overflow="visible">
    <g transform={FLIP}>
      {wipe && <defs>
        <clipPath id={wipe}><rect data-part="arc-wipe" x="40" y="-700" width="2400" height="3000" /> {/* tall, so the halo is never cut above or below the arc */}</clipPath>
        <filter id={`${wipe}-halo`} x="-30%" y="-120%" width="160%" height="340%"><feGaussianBlur stdDeviation="110" /></filter>
        <filter id={`${wipe}-bloom`} x="-20%" y="-80%" width="140%" height="260%"><feGaussianBlur stdDeviation="28" /></filter>
        <filter id={`${wipe}-head`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="22" /></filter>
        <radialGradient id={`${wipe}-hot`}>
          <stop offset="0" style={{ stopColor: "#fff" }} />
          <stop offset=".28" style={{ stopColor: "color-mix(in srgb, var(--dawn) 35%, #fff)" }} />
          <stop offset=".62" style={{ stopColor: "var(--dawn)", stopOpacity: .55 }} />
          <stop offset="1" style={{ stopColor: "var(--dawn)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>}
      {wipe && <g data-part="arc-glow" clipPath={clip} opacity="0" style={{ mixBlendMode: "screen" }}>
        <path d={logoParts.arc} style={{ fill: "var(--dawn)" }} filter={`url(#${wipe}-halo)`} opacity=".9" />
        <path d={logoParts.arc} style={{ fill: "color-mix(in srgb, var(--dawn) 45%, #fff)" }} filter={`url(#${wipe}-bloom)`} opacity=".8" />
      </g>}
      <path data-part="arc" className="logo-arc" d={logoParts.arc} clipPath={clip} />
      {wipe && <circle data-part="arc-head" cx="0" cy="0" r="80" fill={`url(#${wipe}-hot)`} filter={`url(#${wipe}-head)`} opacity="0" style={{ mixBlendMode: "screen" }} />}
      <path data-part="e" d={logoParts.e} fill="currentColor" />
      <path data-part="o" d={logoParts.o} fill="currentColor" />
      <path data-part="s" d={logoParts.s} fill="currentColor" />
    </g>
  </svg>;
}
