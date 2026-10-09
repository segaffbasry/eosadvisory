"use client";

import { useState } from "react";
import { LogoTile } from "@/components/home/LogoTile";
import { ParticleArc } from "@/components/home/ParticleArc";
import { Arrow, Button, linkProps } from "@/components/ui";
import { founders, portfolio, portfolioLink } from "@/lib/content";

/* Portfolio (#portfolio), in two sections on the Mist ground:
   1. "Meet some of our Founders & CEOs": the live carousel's five founders, all shown. A list of names on the left,
      one large portrait on the right; hovering, focusing or tapping a name brings up that founder (the portraits
      are stacked and wipe in with the same top-down reveal as every image). No autoplay, no pin.
   2. The portfolio wall, its own section with generous padding so its particles stay inside it: the twenty
      companies from /portfolio as BlueYard LogoTiles under the logo's sunrise arc drawn in particles
      (components/home/ParticleArc.tsx), which draws itself, sheds sparks and bursts with the scroll. Phones show the first twelve; the link goes to the full live page. */
export function Portfolio() {
  const [active, setActive] = useState(0);
  const f = founders[active];
  return <><section className="section section-mist portfolio" id="portfolio" tabIndex={-1} aria-labelledby="founders-title">
    <div className="wrap">
      <div className="founders">
        <div className="founders-list">
          <h2 className="h2" id="founders-title" data-reveal="heading">Meet some of our <b>Founders & CEOs</b></h2>
          <ul role="tablist" aria-label="Founders and CEOs">
            {founders.map((p, i) => <li key={p.name} data-reveal="card">
              <button role="tab" id={`founder-tab-${i}`} aria-selected={i === active} aria-controls="founder-panel" className="founder-row"
                onPointerEnter={(e) => { if (e.pointerType === "mouse") setActive(i); }} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
                <span className="founder-name">{p.name}</span>
                <span className="founder-co">{p.company}</span>
                <Arrow />
              </button>
            </li>)}
          </ul>
        </div>
        <div className="founder-panel" id="founder-panel" role="tabpanel" aria-labelledby={`founder-tab-${active}`} data-reveal="image">
          <div className="founder-photos" aria-hidden="true">
            {founders.map((p, i) => <img key={p.name} src={p.image} alt="" className={i === active ? "is-active" : undefined} loading="lazy" width={640} height={800} />)}
          </div>
          <div className="founder-card" key={active}>
            <p className="founder-card-co">{f.company}</p>
            <p className="founder-card-text">{f.text}</p>
            <p className="founder-card-meta"><em>Eos first invested: {f.invested}</em></p>
            <a href={f.href} className="line-link" {...linkProps(f.href)}>{f.company}<Arrow /><i className="btn-line" aria-hidden="true" /></a>
          </div>
        </div>
      </div>

    </div>
  </section>

  <section className="section section-mist wall-section" aria-labelledby="wall-title">
    <ParticleArc />
    <div className="wrap">
      <div className="wall">
        <div className="wall-head">
          <h2 className="h2" id="wall-title" data-reveal="heading">Eos <b>Portfolio</b></h2>
          <p className="lede" data-reveal="text">Meet our inspiring founders. Companies are defined by people and their performance.</p>
        </div>
        <div className="wall-grid">
          {portfolio.map((c) => <LogoTile key={c.name} name={c.name} logo={c.logo} href={c.href} text={c.text} />)}
        </div>
        <div className="wall-foot"><Button href={portfolioLink.href} tone="ink">{portfolioLink.label}</Button></div>
      </div>
    </div>
  </section></>;
}
