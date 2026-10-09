"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, MailIcon, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { news } from "@/lib/content";
import { contact, copyright, footerDiscover, footerLinks, legal, livePages, onPage, riskWarning, socials } from "@/lib/site";

// The header shows three of the page's sections inline on wide screens; everything else sits in the menu.
const inline = [onPage[2], onPage[3], onPage[4]];
const mailto = `mailto:${contact.email}`;

/* Full-screen menu. In: an Ink sheet opens as a circle from the Menu button, as the sun comes up over the horizon
   (clip-path circle, .9s, eos-inout), a Dawn glow swells in that corner, then the links rise one after another
   (topology's fadeUp: 30px, .075s apart, eos). One GSAP timeline; reverse() plays the way out. Focus is trapped,
   Esc closes, focus returns to the trigger. Items scroll to a section through Lenis or go to the live site. */
function Menu({ open, close, trigger }: { open: boolean; close: () => void; trigger: HTMLElement | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "eos" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el, { clipPath: "circle(0% at calc(100% - 60px) 40px)" }, { clipPath: "circle(150% at calc(100% - 60px) 40px)", duration: .9, ease: "eos-inout" }, 0)
      .fromTo(el.querySelector(".menu-glow"), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: 1.2 }, .2)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, stagger: .075 }, .3);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      return focusOverlay(el, close, trigger);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close, trigger]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <span className="menu-glow" aria-hidden="true" />
    <div className="menu-top wrap">
      <a href="#top" className="brand" onClick={close} aria-label="Eos, back to the top"><Logo title="" /></a>
      <button className="menu-toggle" onClick={close}><span>Close</span><span className="menu-lines is-open" aria-hidden="true"><i /><i /></span></button>
    </div>
    <div className="menu-body wrap">
      <nav className="menu-page" aria-label="On this page">
        <p className="menu-label" data-menu-in>Discover</p>
        <ul>{onPage.map((l) => <li key={l.href} data-menu-in><a href={l.href} onClick={close}><span>{l.label}</span><Arrow /></a></li>)}</ul>
      </nav>
      <div className="menu-side">
        <nav aria-label="Eos Advisory site">
          <p className="menu-label" data-menu-in>eos-advisory.com</p>
          <ul className="menu-site">{livePages.map((l) => <li key={l.href} data-menu-in><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>
        <div>
          <p className="menu-label" data-menu-in>Latest news</p>
          <ul className="menu-news">{news.slice(0, 2).map((n) => <li key={n.href} data-menu-in>
            <a href={n.href} {...linkProps(n.href)}><span className="u-link">{n.title}</span><time dateTime={n.iso}>{n.date}</time></a>
          </li>)}</ul>
        </div>
        <div className="menu-foot" data-menu-in>
          <a href={mailto} className="u-link">{contact.email}</a>
          <ul className="socials">
            <li><a href={mailto} aria-label={`Email ${contact.email}`}><MailIcon /></a></li>
            {socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Eos Advisory on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}
          </ul>
        </div>
      </div>
    </div>
  </div>;
}

/* Frameless header: no bar or box. Its colour follows what is underneath (motion.tsx sets html[data-header]);
   it slides away on the way down and returns on the way up. */
function Header() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Eos, back to the top"><Logo title="" /></a>
        <div className="header-actions">
          <ul className="header-links">{inline.map((l) => <li key={l.href}><a href={l.href} className="u-link">{l.label}</a></li>)}</ul>
          <Button href="#get-in-touch" className="header-cta" reveal={false}>Get in touch</Button>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={(e) => { setTrigger(e.currentTarget); setOpen(true); }}>
            <span>Menu</span><span className="menu-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} />
  </>;
}

/* Footer: the live footer's columns (Discover, Links, Contact) with their own labels and order, the regulatory
   line, the risk warning and the copyright. No scroll reveals here (house rule: they read as a jump at the bottom). */
function Footer() {
  return <footer className="site-footer" data-tone="dark">
    <div className="wrap">
      <div className="footer-grid">
        <a href="#top" className="footer-logo" aria-label="Eos, back to the top"><Logo title="" /></a>
        <nav className="footer-col" aria-label="Discover">
          <h2 className="footer-label">Discover</h2>
          <ul>{footerDiscover.map((l) => <li key={l.label}><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>
        <nav className="footer-col" aria-label="Links">
          <h2 className="footer-label">Links</h2>
          <ul>{footerLinks.map((l) => <li key={l.label}><a href={l.href} className="u-link" {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </nav>
        <div className="footer-col">
          <h2 className="footer-label">Contact</h2>
          <address>{contact.company},<br />{contact.address.map((line) => <span key={line}>{line}<br /></span>)}</address>
          <ul className="socials">
            <li><a href={mailto} aria-label={`Email ${contact.email}`}><MailIcon /></a></li>
            {socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Eos Advisory on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}
          </ul>
        </div>
      </div>
      <div className="footer-bar">
        <p>{legal}</p>
        <p>{riskWarning.text} <a href={riskWarning.link.href} className="u-link footer-risk" {...linkProps(riskWarning.link.href)}>{riskWarning.link.label}</a></p>
        <p>{copyright}</p>
      </div>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
