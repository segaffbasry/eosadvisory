"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The opening moment: Eos signing its name. Eos is the goddess of the dawn and the logo is a sunrise: an arc that
   thickens as it climbs over the three letters. So the build sets the letters first and then draws the arc along
   its own path, thin end to thick end, the way the sun moves; the exit is the sun clearing the horizon.
   Built from the logo's real vector parts (lib/logo.ts, traced from the live PNG).

     Build   0.10 to 0.80s  E, O, S rise into place one after another (30px, eos; topology's fadeUp)
             0.45 to 1.45s  the arc is wiped on from its thin end to its round end (clip rect, eos-inout)
             0.55 to 1.55s  a Dawn glow swells behind the logo
             0.10 to 1.60s  counter 0 → 100% at the foot of the screen (BlueYard's loader counter; house rule: loaders
                         must be noticed)
     Hold    0.25s       the finished logo sits still
     Exit    0.75s       the Ink ground opens as a circle rising from the bottom edge, uncovering the hero (whose own
                         opening frame is the same dark dawn), while the logo glides into the header logo position
   About 2.6s on a warm cache. It waits for the web font and hero photo for at most 0.6s more, and a failsafe ends it
   at 3.4s whatever happens. The handover fires early in the exit: removes `is-loading`, sets `data-intro="done"`,
   dispatches `intro:done`; the hero entrance and Lenis wait for it. Every load, never with reduced motion,
   hidden by <noscript>. */

// Read once at module load: did the boot script (app/layout.tsx) decide the intro plays? (React dev double-mount safe.)
const shouldPlay = typeof document !== "undefined" && document.documentElement.classList.contains("is-loading");

function heroReady() {
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const photo = new Promise<void>((resolve) => { const img = new Image(); img.onload = img.onerror = () => resolve(); img.src = "/media/hero.jpg"; });
  return Promise.all([fonts, photo]);
}

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false, dead = false;
    const handover = () => {
      if (handed) return; handed = true;
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives; then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; };
    delete root.dataset.intro;
    if (reducedMotion() || !shouldPlay) { finish(); return; }
    root.classList.add("is-loading", "is-landing");

    const q = (id: string) => el.querySelector<SVGElement>(`[data-part="${id}"]`)!;
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const ground = el.querySelector<HTMLElement>(".preloader-ground")!;
    const target = document.querySelector<SVGSVGElement>(".site-header .brand .logo");
    const count = el.querySelector(".preloader-count span");
    const level = { v: 0 }, hole = { r: 0 };
    const show = () => { if (count) count.textContent = String(Math.round(level.v)); };
    const open = () => { const m = `radial-gradient(circle at 50% 115%, transparent ${hole.r}vmax, #000 calc(${hole.r}vmax + 1px))`; ground.style.maskImage = m; ground.style.webkitMaskImage = m; };

    const build = gsap.timeline({ defaults: { ease: "eos" } });
    build.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      // The parts live inside the logo's flipped group (lib/logo.ts FLIP), so a negative y is "below" on screen.
      .fromTo(["e", "o", "s"].map(q), { y: -160, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .1 }, .1)
      .fromTo(q("arc-wipe"), { attr: { width: 0 } }, { attr: { width: 2400 }, duration: 1, ease: "eos-inout" }, .45)
      .fromTo(el.querySelector(".preloader-glow"), { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: 1 }, .55)
      .fromTo(el.querySelector(".preloader-meta"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .6 }, .1)
      .to(level, { v: 100, duration: 1.5, ease: "power1.inOut", onUpdate: show }, .1);

    let land: gsap.core.Timeline | null = null;
    const complete = () => {
      if (dead || land) return;
      land = gsap.timeline({ defaults: { ease: "eos-inout" }, onComplete: finish });
      land.addLabel("exit", .25)
        .to(el.querySelectorAll(".preloader-meta, .preloader-glow"), { opacity: 0, duration: .35, ease: "power2.in" }, "exit")
        .add(() => {
          // Measured at exit time so a late web font or a resize cannot misplace the landing.
          if (!target || !target.getBoundingClientRect().width) { gsap.to(logo, { opacity: 0, duration: .4 }); return; }
          const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
          gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .75, ease: "eos-inout" });
        }, "exit")
        .to(hole, { r: 140, duration: .75, onUpdate: open }, "exit")
        .add(handover, "exit+=.1")
        .set({}, {}, "exit+=.75");
    };
    const wait = Promise.race([heroReady(), new Promise((r) => setTimeout(r, 2200))]);
    build.eventCallback("onComplete", () => { void wait.then(complete); });

    // Never hold the page beyond ~3.4s, even if a frame stalls or an asset hangs.
    const failsafe = window.setTimeout(finish, 3400);
    return () => {
      dead = true; window.clearTimeout(failsafe); build.kill(); land?.kill(); gsap.killTweensOf([logo, level, hole]);
      root.classList.remove("is-loading", "is-landing");
    };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-ground">
      <span className="preloader-glow" />
      <div className="preloader-meta wrap">
        <p>St Andrews, Scotland</p>
        <p className="preloader-count"><span>0</span>%</p>
        <p>Founded 2014</p>
      </div>
    </div>
    {/* Outside the ground, so the opening circle never masks the logo on its way to the header. */}
    <div className="preloader-sign"><Logo title="" wipe="preloader-arc" /></div>
  </div>;
}
