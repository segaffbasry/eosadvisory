import { Button } from "@/components/ui";
import { pledge, team } from "@/lib/content";

/* Team (#team). The live homepage Team block (heading, line, "Meet the entire Eos team") with the ten people from
   /team in the live order, as topology.vc lines up its team: portraits in a row, name and role beneath. Partners
   on the Investment Committee are marked as on /team. Beside the heading: the live diversity commitment and the
   Pathways Pledge. On phones the portraits become a sideways strip. */
export function Team() {
  return <section className="section section-mist team" id="team" tabIndex={-1} aria-labelledby="team-title" data-late>
    <div className="wrap">
      <div className="team-top">
        <div className="team-head">
          <h2 className="h2" id="team-title" data-reveal="heading">{team.title}</h2>
          <p className="lede" data-reveal="text">{team.text}</p>
          <Button href={team.link.href}>{team.link.label}</Button>
        </div>
        <div className="pledge" data-reveal="card">
          <img src={pledge.logo.src} alt={pledge.logo.alt} width={136} height={240} loading="lazy" />
          <div>
            <p className="pledge-lead">{pledge.commitment}</p>
            <p className="small">{pledge.text}</p>
          </div>
        </div>
      </div>
      <ul className="people">
        {team.people.map((p) => <li key={p.name} className="person" data-reveal="card">
          <a href={team.link.href} target="_blank" rel="noopener" aria-label={`${p.name}, ${p.role}`}>
            <span className="person-photo"><img src={p.image} alt="" width={480} height={600} loading="lazy" /></span>
            <span className="person-name">{p.name}</span>
            <span className="person-role">{p.role}</span>
            {p.committee && <span className="person-committee">Investment Committee</span>}
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
