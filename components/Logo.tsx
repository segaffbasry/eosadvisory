import { FLIP, VIEWBOX, logoParts } from "@/lib/logo";

/* The Eos logo, traced from the live PNG (scripts/logo.py): the sunrise arc in Dawn over the E, O and S in the
   current text colour. Each part carries data-part so the preloader can build it piece by piece; with `wipe` the
   arc is clipped by a rect (data-part="arc-wipe") the preloader widens to draw the arc along its path. */
export function Logo({ title = "Eos", className = "logo", wipe }: { title?: string; className?: string; wipe?: string }) {
  return <svg className={className} viewBox={VIEWBOX} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title || undefined} focusable="false">
    <g transform={FLIP}>
      {wipe && <clipPath id={wipe}><rect data-part="arc-wipe" x="40" y="0" width="2400" height="1553" /></clipPath>}
      <path data-part="arc" className="logo-arc" d={logoParts.arc} clipPath={wipe ? `url(#${wipe})` : undefined} />
      <path data-part="e" d={logoParts.e} fill="currentColor" />
      <path data-part="o" d={logoParts.o} fill="currentColor" />
      <path data-part="s" d={logoParts.s} fill="currentColor" />
    </g>
  </svg>;
}
