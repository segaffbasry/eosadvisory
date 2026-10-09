import { Arrow, LineLink, linkProps } from "@/components/ui";
import { news, newsLink } from "@/lib/content";

/* News (#news): the three items the live homepage shows, with their own photographs, dates and titles. Each card
   goes to the external release, as on the live site; "All News" goes to the live archive. */
export function News() {
  return <section className="section news" id="news" tabIndex={-1} aria-labelledby="news-title" data-late>
    <div className="wrap">
      <div className="news-head">
        <h2 className="h2" id="news-title" data-reveal="heading">News</h2>
        <LineLink href={newsLink.href}>{newsLink.label}<Arrow /></LineLink>
      </div>
      <ul className="news-grid">
        {news.map((n) => <li key={n.href} data-reveal="card">
          <a href={n.href} className="news-card" {...linkProps(n.href)}>
            <span className="media news-photo"><img src={n.image} alt={n.alt} width={1000} height={667} loading="lazy" /></span>
            <time dateTime={n.iso}>{n.date}</time>
            <span className="news-title">{n.title}</span>
            <span className="news-more">Read more<Arrow /></span>
          </a>
        </li>)}
      </ul>
    </div>
  </section>;
}
