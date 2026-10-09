"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { reducedMotion } from "@/components/ui";
import { EASE, EASE_INOUT, timing } from "@/lib/ease";
import { getLenis, setLenis } from "@/lib/scroll";
import { splitText, type Split } from "@/lib/split";

// Registered at module load so the preloader, hero and menu can build timelines on "eos" in their own effects.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("eos", EASE);
  CustomEase.create("eos-inout", EASE_INOUT);
}

/* The reveal set (README "Motion system"): one small fixed set of moves, applied the same way everywhere, with
   topology.vc's presets and curves (lib/ease.ts).
   heading  the whole phrase fades and rises 30px (fadeUp), 1s, eos
   text     paragraphs split into rendered lines that slide 50px in from the right and fade (fadeRTL, split
            "lines"), .075s apart, 1s, eos
   label    buttons, links and small type: fade and 30px rise, .8s
   card     batched: fade and 30px rise, .075s apart, 1.5s, eos-inout (topology's team members)
   image    a top-down wipe (topology's maskSize 100% 0% → 100% 100%), 1.5s, eos-inout; [data-parallax] adds
            ±10% drift while it crosses the screen
   All play once; inside [data-late] sections they run at 75% of the duration. */
export function usePageMotion() {
  useEffect(() => {
    const reduced = reducedMotion();
    const root = document.documentElement;

    /* Links never leave the page (standing rule for these private demos): hrefs stay real and verifiable,
       but a capture-phase guard cancels any click or middle-click on a link that doesn't start with "#". */
    const stayOnPage = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (link && !link.getAttribute("href")!.startsWith("#")) event.preventDefault();
    };
    document.addEventListener("click", stayOnPage, true);
    document.addEventListener("auxclick", stayOnPage, true);

    /* Smooth scroll: Lenis on lerp .12 (house setting: no lag at the bottom of the page), driven by the GSAP ticker
       so ScrollTrigger reads the same frame. topology.vc runs Lenis on its defaults. */
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (root.classList.contains("is-loading")) lenis.stop();
    }
    const start = () => getLenis()?.start();
    document.addEventListener("intro:done", start);

    // In-page anchors go through Lenis and move focus to the target.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      if (!link) return;
      const hash = link.getAttribute("href")!;
      const target = hash === "#top" ? null : document.querySelector<HTMLElement>(hash);
      if (hash !== "#top" && !target) return;
      event.preventDefault();
      if (lenis) { lenis.start(); lenis.scrollTo(target ?? 0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 3) }); }
      else (target ?? document.body).scrollIntoView();
      target?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    /* Reveals. */
    const splits: Split[] = [];
    const scale = (el: Element) => (el.closest("[data-late]") ? timing.late : 1);
    // data-shown lifts the CSS start-state guards (globals.css) once GSAP has set its own start states.
    const mark = () => document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-shown", ""));
    const ctx = gsap.context(() => {
      if (reduced) { mark(); return; }
      const all = (kind: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${kind}"]:not([data-hero] [data-reveal])`);
      const once = (el: Element, at: string, play: () => void) => ScrollTrigger.create({ trigger: el, start: at, once: true, onEnter: play });

      all("label").forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: timing.rise });
        once(el, "top 92%", () => gsap.to(el, { autoAlpha: 1, y: 0, duration: timing.label * scale(el), ease: "eos", clearProps: "transform,opacity,visibility" }));
      });

      all("heading").forEach((el) => {
        gsap.set(el, { autoAlpha: 0, y: timing.rise });
        once(el, "top 88%", () => gsap.to(el, { autoAlpha: 1, y: 0, duration: timing.heading * scale(el), ease: "eos", clearProps: "transform,opacity,visibility" }));
      });

      all("text").forEach((el) => {
        const split = splitText(el);
        splits.push(split);
        split.lines.forEach((line) => gsap.set(line, { autoAlpha: 0, x: timing.shift }));
        once(el, "top 90%", () => split.lines.forEach((line, i) =>
          gsap.to(line, { autoAlpha: 1, x: 0, duration: timing.heading * scale(el), ease: "eos", delay: i * timing.lineStagger * scale(el) })));
      });

      const cards = all("card");
      gsap.set(cards, { autoAlpha: 0, y: timing.rise });
      ScrollTrigger.batch(cards, { start: "top 92%", once: true, onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: timing.card * scale(batch[0]), ease: "eos-inout", stagger: timing.cardStagger, overwrite: true, clearProps: "transform,opacity,visibility" }) });

      all("image").forEach((el) => {
        gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)" });
        once(el, "top 90%", () => gsap.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: timing.image * scale(el), ease: "eos-inout", clearProps: "clipPath" }));
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const media = el.querySelector("img"); if (!media) return;
        const d = timing.parallax / 2;
        gsap.fromTo(media, { yPercent: -d, scale: 1.14 }, { yPercent: d, scale: 1.14, ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" } });
      });
      mark();
    });

/* The header takes its colour from whatever is under it: [data-tone="dark"] areas flip it to white type. */
    let frame = 0;
    const update = () => {
      frame = 0;
      const probe = 40;
      const dark = Array.from(document.querySelectorAll<HTMLElement>("[data-tone='dark']:not(.menu)")).some((el) => {
        const r = el.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe && r.left <= 60 && r.right >= 60;
      });
      root.dataset.header = dark ? "dark" : "light";
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    document.addEventListener("hero:update", queue);
    update();
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      document.removeEventListener("click", stayOnPage, true);
      document.removeEventListener("auxclick", stayOnPage, true);
      document.removeEventListener("click", onClick);
      document.removeEventListener("intro:done", start);
      document.removeEventListener("hero:update", queue);
      window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); window.removeEventListener("load", refresh);
      cancelAnimationFrame(frame);
      ctx.revert();
      splits.forEach((split) => split.revert());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy(); setLenis(null);
    };
  }, []);
}

/* Traps focus inside an overlay, closes on Escape, pauses the page scroll and returns focus to the trigger. */
export function focusOverlay(container: HTMLElement, close: () => void, trigger?: HTMLElement | null) {
  const previous = trigger ?? (document.activeElement as HTMLElement);
  getLenis()?.stop();
  document.documentElement.classList.add("overlay-open");
  const focusable = () => Array.from(container.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex='0']")).filter((el) => el.offsetParent !== null);
  focusable()[0]?.focus({ preventScroll: true });
  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "Tab") {
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (!first) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener("keydown", handleKey);
  return () => {
    document.removeEventListener("keydown", handleKey);
    document.documentElement.classList.remove("overlay-open");
    getLenis()?.start();
    previous?.focus({ preventScroll: true });
  };
}
