import { intro } from "@/lib/content";

/* Introductions (#introductions, the live anchor). The live statement and paragraphs, restaged: the statement at
   heading size beside the opening paragraph; then the team photograph (the live Team block's image) beside
   "Deep roots in Scotland, with a global perspective." and the portfolio sentence split into its two halves,
   quality of life and environmental sustainability, as two short lists. */
export function Intro() {
  const [first, ...rest] = intro.paragraphs;
  return <section className="section intro" id="introductions" tabIndex={-1} aria-labelledby="intro-title">
    <div className="wrap">
      <div className="intro-top">
        <h2 className="h2 intro-statement" id="intro-title" data-reveal="heading">{intro.statement}</h2>
        <p className="lede intro-lede" data-reveal="text">{first}</p>
      </div>
      <div className="intro-grid">
        <figure className="media intro-photo" data-reveal="image" data-parallax>
          <img src={intro.image.src} alt={intro.image.alt} width={1600} height={1067} loading="lazy" />
        </figure>
        <div className="intro-side">
          <h3 className="h3 intro-roots" data-reveal="heading"><b>{intro.roots[0]}</b><br />{intro.roots[1]}</h3>
          {rest.map((p) => <p key={p} className="intro-copy" data-reveal="text">{p}</p>)}
          <div className="intro-split">
            <p className="small intro-split-lead" data-reveal="label">The portfolio is split between</p>
            <div className="intro-split-grid">
              {intro.split.sides.map((side) => <div key={side.title} className="intro-split-side" data-reveal="card">
                <h4>{side.title}</h4>
                <ul>{side.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
