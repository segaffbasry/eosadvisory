"use client";

import { useState } from "react";
import { Arrow, linkProps } from "@/components/ui";
import { investors, partners, routes, type RouteId } from "@/lib/content";

/* Investors (#investors, the live anchor). The live statement and funding paragraph; the live "Who are you?" popup
   as a row of answers that light up the matching route; the three routes with every line of their live popups;
   a ticket-size chart drawn from those same lines; and "Our Partners".

   Chart: a log scale from £5k to £1M+. A dot marks each route's stated minimum and a bar its stated typical range
   (Venture Partners' "£1M+" runs off the end). Hovering or focusing a row or a card highlights that route in both. */
const LO = Math.log(5), HI = Math.log(1300);
const x = (k: number) => `${((Math.log(k) - LO) / (HI - LO)) * 100}%`;
const ticks = [{ k: 5, l: "£5k" }, { k: 25, l: "£25k" }, { k: 100, l: "£100k" }, { k: 500, l: "£500k" }, { k: 1000, l: "£1M" }];
const money = (k: number) => (k >= 1000 ? `£${k / 1000}M` : `£${k}k`);

export function Investors() {
  const [chosen, setChosen] = useState<RouteId | null>(null);
  const [hover, setHover] = useState<RouteId | null>(null);
  const lit = hover ?? chosen;
  const state = (id: RouteId) => (lit ? (lit === id ? " is-lit" : " is-dim") : "");

  return <section className="section investors" id="investors" tabIndex={-1} aria-labelledby="investors-title">
    <div className="wrap">
      <div className="investors-top">
        <h2 className="h2" id="investors-title" data-reveal="heading">{investors.title[0]} <b>{investors.title[1]}</b></h2>
        <div className="investors-intro">
          <p data-reveal="text">{investors.text}</p>
          <div className="who" role="group" aria-labelledby="who-title">
            <h3 className="who-title" id="who-title" data-reveal="label">{investors.question}</h3>
            <ul className="who-list">
              {investors.answers.map((a) => <li key={a.label} data-reveal="label">
                {a.route === "contact"
                  ? <a className="who-answer" href="#get-in-touch">{a.label}<Arrow /></a>
                  : <button className="who-answer" aria-pressed={chosen === a.route} onClick={() => setChosen(chosen === a.route ? null : a.route)}>{a.label}</button>}
              </li>)}
            </ul>
          </div>
        </div>
      </div>

      <ul className="routes">
        {routes.map((r) => <li key={r.id} className={`route${state(r.id)}`} data-reveal="card" onPointerEnter={() => setHover(r.id)} onPointerLeave={() => setHover(null)}>
          <p className="route-role">{r.role}</p>
          <h3 className="h3">{r.name}</h3>
          <ul className="route-lines">{r.lines.map((l) => <li key={l}>{l}</li>)}</ul>
          <a href="#get-in-touch" className="line-link" onFocus={() => setHover(r.id)} onBlur={() => setHover(null)}>Get in touch<Arrow /><i className="btn-line" aria-hidden="true" /></a>
        </li>)}
      </ul>

      <figure className="tickets" data-reveal="label">
        <figcaption className="tickets-head"><span className="h3">Ticket size per investment</span><span className="small">Minimum and typical range, as stated for each route</span></figcaption>
        <div className="tickets-body">
          <div className="tickets-axis" aria-hidden="true">{ticks.map((t) => <span key={t.k} style={{ left: x(t.k) }}>{t.l}</span>)}</div>
          <ul>
            {routes.map((r) => <li key={r.id} className={`ticket${state(r.id)}`} onPointerEnter={() => setHover(r.id)} onPointerLeave={() => setHover(null)}>
              <span className="ticket-name">{r.name}<span className="ticket-stage">{r.stage}</span></span>
              <span className="ticket-track">
                {ticks.map((t) => <i key={t.k} className="ticket-grid" style={{ left: x(t.k) }} aria-hidden="true" />)}
                {r.typical && <span className={`ticket-reach${r.openEnd ? " is-open" : ""}`} style={{ left: x(r.min), right: `calc(100% - ${x(r.typical[0])})` }} aria-hidden="true" />}
                {r.typical && <span className={`ticket-bar${r.openEnd ? " is-open" : ""}`} style={{ left: x(r.typical[0]), right: r.openEnd ? "0" : `calc(100% - ${x(r.typical[1])})` }} aria-hidden="true" />}
                <span className="ticket-min" style={{ left: x(r.min) }} aria-hidden="true" />
                <span className="sr-only">Minimum {money(r.min)}{r.typical ? `, typical ${money(r.typical[0])} to ${money(r.typical[1])}${r.openEnd ? "+" : ""}` : ""}.</span>
              </span>
              <span className="ticket-value" aria-hidden="true">{r.typical ? `${money(r.typical[0])} to ${money(r.typical[1])}${r.openEnd ? "+" : ""}` : `from ${money(r.min)}`}</span>
            </li>)}
          </ul>
        </div>
      </figure>

      <div className="partners">
        <h3 className="partners-title" data-reveal="label">Our <b>Partners</b></h3>
        <ul>{partners.map((p) => <li key={p.name} data-reveal="label">
          <a href={p.href} {...linkProps(p.href)}><img src={p.logo} alt={p.name} style={{ width: p.w }} loading="lazy" /></a>
        </li>)}</ul>
      </div>
    </div>
  </section>;
}
