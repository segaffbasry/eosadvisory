"use client";

import { useEffect, useRef, useState } from "react";
import { linkProps } from "@/components/ui";

/* BlueYard's portfolio LogoTile, rebuilt from its component (blueyard.com _nuxt/C4gYN_lE.js, "LogoTile") and its CSS
   (_nuxt/LogoTile.B-K2MDYy.css), read 2026-10-09. The structure and every timing are theirs:
     .card__top      the white strip above the tile, max-width = tile width minus the name label, so the label sits
                     in a notch; open → max-width 100% (.5s cubic-bezier(.33,0,.2,1))
     image           open → translateY(-50%) scale(.75), timing cubic-bezier(.5,0,0,1);
                     close → translateY(0) scale(1), timing cubic-bezier(0,0,0,.8); transition transform .7s
     tile text       open → opacity 1, translate(0,0), delay .2s; close → opacity 0, translate(0,33%), delay 0
                     (.4s, cubic-bezier(0,0,0,1))
     tile button     "Visit site", same as the text
     gradient border :before outlines in the section gradient; hover → opacity 1 (.4s cubic-bezier(.8,0,1,1)),
                     rest → opacity 0 (.4s cubic-bezier(.33,0,.2,1))
     touch           pointer enter/leave on mouse; on touch a tap opens the tile, a tap outside closes it
   BlueYard's flags ("Exit", "Prior work") have no Eos equivalent and are left out. Styles: styles/home.css. */
export function LogoTile({ name, logo, href, text }: { name: string; logo: string; href: string; text?: string }) {
  const card = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  // The notch: the strip stops short of the label by the label's own width (BlueYard measures offsetWidth too).
  useEffect(() => {
    const el = card.current, lab = label.current; if (!el || !lab) return;
    const measure = () => el.style.setProperty("--label-w", `${lab.offsetWidth}px`);
    measure();
    const ro = new ResizeObserver(measure); ro.observe(lab);
    return () => ro.disconnect();
  }, []);

  // On touch, a tap outside closes an open tile.
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => { if (!card.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", outside);
    return () => document.removeEventListener("click", outside);
  }, [open]);

  const touch = (e: React.PointerEvent) => e.pointerType === "touch" || e.pointerType === "pen";
  return <div ref={card} className={`tile${open ? " is-open" : ""}`} data-reveal="card"
    onPointerEnter={(e) => { if (!touch(e)) setOpen(true); }} onPointerLeave={(e) => { if (!touch(e)) setOpen(false); }}
    onFocus={() => setOpen(true)} onBlur={(e) => { if (!card.current?.contains(e.relatedTarget as Node)) setOpen(false); }}
    onClick={() => setOpen(true)}>
    <div className="tile-buffer">
      <div className="tile-top" />
      <span className="tile-label" ref={label}>{name}</span>
    </div>
    <div className="tile-main">
      <div className="tile-image"><img src={`/media/logos/${logo}`} alt={name} loading="lazy" /></div>
      <div className="tile-content">
        {text && <span className="tile-text">{text}</span>}
        <a className="tile-button u-link" href={href} {...linkProps(href)} aria-label={`Visit the ${name} website`}>Visit site</a>
      </div>
    </div>
  </div>;
}
