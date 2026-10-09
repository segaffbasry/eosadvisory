"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import "@/components/motion";
import { Button, linkProps, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { riskWarning } from "@/lib/site";

/* Hero: the live homepage's own background photograph (the Forth Bridge at sunrise, uploads/eos-bckgrnd-image.png)
   full-bleed, with the live headline bottom-left, as topology.vc stages "Meet us at the edge.".

   Entrance, on `intro:done` (the preloader's handover), one timeline:
     the photo comes up out of the preloader's Ink: brightness .3 → 1 and scale 1.14 → 1.04 over 2.4s (eos-inout),
     while a Dawn bloom swells over the photo's own sun. Then topology.vc's hero intro, values copied
     (build/index-D_F-KEA1.js): header actions y -50 → 0 (1s); title words x 150 → 0, .1s apart (1s);
     the actions x 100 → 0, .075s apart (1s, at .5); hero footer y 50 → 0 (1s, at .5). Ease eos (joe.out).
   On scroll the photo drifts down 12% and the copy lifts and fades a little (scrubbed), so the hero hands over
   to the page rather than being cut off. Reduced motion: everything in place, no timeline. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const parts = el.querySelectorAll("[data-hero-part]");
    if (reducedMotion()) { parts.forEach((p) => p.setAttribute("data-shown", "")); return; }
    // Only the header's links and buttons enter here: the logo is landed in place by the preloader.
    const header = document.querySelector(".site-header .header-actions");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "eos", duration: 1 } });
      tl.fromTo(el.querySelector(".hero-media img"), { filter: "brightness(.3)", scale: 1.14 }, { filter: "brightness(1)", scale: 1.04, duration: 2.4, ease: "eos-inout", clearProps: "filter" }, 0)
        .fromTo(el.querySelector(".hero-sun"), { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: 2.4, ease: "eos-inout" }, .1)
        .fromTo(header, { y: -50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, clearProps: "transform" }, .2)
        .fromTo(el.querySelectorAll(".hero-title .hw"), { x: 150, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .1 }, .2)
        .fromTo(el.querySelectorAll(".hero-actions > *"), { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: .075 }, .7)
        .fromTo(el.querySelector(".hero-foot"), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, .7);
      parts.forEach((p) => p.setAttribute("data-shown", ""));
      const play = () => tl.play();
      if (document.documentElement.dataset.intro === "done") play();
      else document.addEventListener("intro:done", play, { once: true });

      gsap.to(el.querySelector(".hero-media"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(el.querySelector(".hero-content"), { y: -60, opacity: .2, ease: "none", scrollTrigger: { trigger: el, start: "40% top", end: "bottom top", scrub: true } });
      return () => document.removeEventListener("intro:done", play);
    }, el);
    return () => ctx.revert();
  }, []);

  return <section className="hero" ref={ref} data-tone="dark" data-hero aria-label="Introduction">
    <div className="hero-media" data-hero-part>
      <picture>
        <source media="(max-width: 640px)" srcSet={hero.image.small} />
        <img src={hero.image.src} alt={hero.image.alt} width={1920} height={1080} fetchPriority="high" />
      </picture>
    </div>
    <span className="hero-sun" aria-hidden="true" data-hero-part />
    <div className="hero-veil" aria-hidden="true" />
    <div className="wrap hero-content">
      <h1 className="h1 hero-title" data-hero-part>
        {hero.title.split(" ").map((w, i) => <span key={i}><span className="hw">{w}</span>{" "}</span>)}
      </h1>
      <div className="hero-actions" data-hero-part>
        <Button href="#get-in-touch" tone="white" reveal={false}>Get in touch</Button>
        <Button href="#portfolio" reveal={false}>Meet our founders</Button>
      </div>
    </div>
    <div className="wrap hero-foot" data-hero-part>
      <p className="hero-risk">{riskWarning.text} <a href={riskWarning.link.href} className="u-link" {...linkProps(riskWarning.link.href)}>{riskWarning.link.label}</a></p>
      <p className="hero-meta">{hero.meta}</p>
    </div>
  </section>;
}
