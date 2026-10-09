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

/* Button: the live Eos button shape (square corners, outlined, a right arrow) with a sunrise hover, the same move
   as the preloader's exit: a Dawn fill rises from below the bottom edge as a widening circle (clip-path circle,
   .65s eos-inout), the label rolls up to a fresh copy of itself, and the arrow slides out to the right while its
   twin slides in from the left. On hover every tone ends Dawn with Ink type (5.4:1). Styles: styles/ui.css.
   Tones: "ink" Ink fill, white type (the primary); "white" white fill for the hero; "outline" in the current colour. */
export function ButtonBody({ children }: { children: ReactNode }) {
  return <>
    <span className="btn-fill" aria-hidden="true" />
    <span className="btn-roll"><span className="btn-text">{children}</span><span className="btn-text" aria-hidden="true">{children}</span></span>
    <span className="btn-arrow" aria-hidden="true"><Arrow /><Arrow className="arrow arrow-next" /></span>
  </>;
}

export function Button({ href, children, tone = "outline", className = "", reveal = true }: {
  href: string; children: ReactNode; tone?: "ink" | "outline" | "white"; className?: string; reveal?: boolean;
}) {
  return <a href={href} className={`btn btn-${tone} ${className}`} data-reveal={reveal ? "label" : undefined} {...linkProps(href)}>
    <ButtonBody>{children}</ButtonBody>
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
