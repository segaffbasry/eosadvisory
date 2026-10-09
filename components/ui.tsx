import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links that leave the page open in a new tab with rel="noopener" (brief); motion.tsx keeps them from navigating at all.
export const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

export function Arrow({ className = "arrow" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path d="M1 6h10M6.5 1.5 11 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>;
}

/* Button: the live Eos button (a square-cornered outlined box with a right arrow, e.g. "Explore the entire Eos
   Portfolio") with BlueYard's .button__line hover (blueyard.com _nuxt/entry.Bn-A-Q0v.css: a 1px line parked at
   translate(-101%) slides to 0 over .4s). Here the line is Dawn and 2px, and the arrow steps 4px right.
   Tones: "ink" Ink fill, white type (the primary); "outline" outlined in the current colour (light or dark grounds). */
export function Button({ href, children, tone = "outline", className = "", reveal = true }: {
  href: string; children: ReactNode; tone?: "ink" | "outline" | "white"; className?: string; reveal?: boolean;
}) {
  return <a href={href} className={`btn btn-${tone} ${className}`} data-reveal={reveal ? "label" : undefined} {...linkProps(href)}>
    <span>{children}</span><Arrow /><i className="btn-line" aria-hidden="true" />
  </a>;
}

/* Text link with the same sliding line, for "Read more", "View all" and inline links. */
export function LineLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} className={`line-link ${className}`} {...linkProps(href)}>{children}<i className="btn-line" aria-hidden="true" /></a>;
}

export function SocialIcon({ icon, size = 18 }: { icon: BrandIcon; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}

export function MailIcon({ size = 18 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
    <path d="M3 5.5h18v13H3z M3.5 6l8.5 7 8.5-7" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>;
}
