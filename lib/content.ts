/* Every item on the live eos-advisory.com homepage (Elementor page 10532 and its JetEngine listings and popups),
   copied verbatim on 2026-10-09, plus two lists the homepage only links to: the twenty companies on /portfolio
   and the ten people on /team. Images were downloaded by scripts/media.sh into public/media.
   House copy rule: no em or en dashes (none appear in this copy). */
import { LIVE } from "@/lib/site";

export const hero = {
  title: "Bridging innovation with global opportunity",
  meta: "Founded 2014 | St Andrews, Scotland",
  image: { src: "/media/hero.jpg", small: "/media/hero-sm.jpg", alt: "The Forth Bridge at sunrise, seen from above the Firth of Forth" },
};

/* "Introductions" (#introductions on the live site). The statement and the right-hand paragraphs, in order. */
export const intro = {
  statement: "Eos invests in, & commercialises, science & technology, from local seed-stage to global scale, with a focus on improving life.",
  roots: ["Deep roots in Scotland,", "with a global perspective."],
  paragraphs: [
    "Eos is a trusted link between non-specialist investors and knowledge intensive science and technology companies.",
    "Motivation for all parties is commensurate financial returns for early-stage patient capital allocation, in businesses that are creating positive impact.",
    "Eos works in long-term partnerships with family offices, individuals, companies and institutional investors.",
  ],
  // The portfolio sentence, restaged as its two halves (the live wording is kept whole underneath).
  split: {
    sentence: "The portfolio is split between quality of life and environmental sustainability, and includes disease diagnostics, prevention, and treatment as well as food and water security, addressing pollution, clean energy and sustainable infrastructure.",
    sides: [
      { title: "Quality of life", items: ["Disease diagnostics", "Prevention", "Treatment"] },
      { title: "Environmental sustainability", items: ["Food and water security", "Addressing pollution", "Clean energy", "Sustainable infrastructure"] },
    ],
  },
  image: { src: "/media/team.jpg", alt: "The Eos team on the steps of a stone building in St Andrews" },
};

/* The live homepage's diversity block (beside the Scotland map), used in the Team section here. */
export const pledge = {
  commitment: "Eos is committed to building a diverse and inclusive organisation through the investments we make, our investors, and our team.",
  text: "Amongst the first signatories to the Pathways Pledge our actions include hosting events to improve accessibility of investment, as well as ensuring a diverse selection panel.",
  logo: { src: "/media/logos/pathways.png", alt: "Pathways Pledge partner" },
};

/* "Meet some of our Founders & CEOs": the homepage carousel (JetEngine listing 8239), all five, in order.
   The homepage spells Penrhos Bio "Penhros Bio"; the company's own spelling (and the live /portfolio page's
   description) is used. */
export const founders = [
  { name: "Giovanna Laudisio", company: "Naturbeads", href: "https://www.naturbeads.com/", image: "/media/founders/laudisio.jpg",
    text: "Biodegradable, sustainable and cost competitive cellulose microparticles to replace plastic microbeads", invested: "June, 2022" },
  { name: "Rowan Armstrong", company: "Bioliberty", href: "https://www.bioliberty.co.uk/#/home", image: "/media/founders/armstrong.jpg",
    text: "Bioliberty creates soft robotics technology to provide social care services to improve patient outcomes.", invested: "April, 2023" },
  { name: "Richard Hammond", company: "Penrhos Bio", href: "https://penrhosbio.com/", image: "/media/founders/hammond.jpg",
    text: "Penrhos Bio offers Remora technology, inspired by nature, that protects against bacteria, fungi, and algae, to provide self-cleaning surfaces.", invested: "September, 2022" },
  { name: "Prof. Matthew J Baker", company: "Dxcover", href: "https://www.dxcover.com/", image: "/media/founders/baker.jpg",
    text: "Offers a revolutionary spectroscopic liquid biopsy with artificial intelligence for the early detection of cancer and other diseases.", invested: "February, 2019" },
  { name: "David Venables", company: "Laverock Therapeutics", href: "https://www.laverocktx.com/", image: "/media/founders/venables.jpg",
    text: "Laverock Therapeutics is developing a unique gene silencing platform for the creation of programmable advanced therapies.", invested: "June, 2023" },
];

export const portfolioLink = { label: "Explore the entire Eos Portfolio", href: `${LIVE}/portfolio/` };

/* /portfolio (JetEngine listing): all twenty companies, in the live order, with the description where the live
   card has one and the "Visit website" link. Names are the companies' own (from their logos and sites); the
   live cards show logos only. Logos are redrawn in Ink by scripts/images.py. */
export const portfolio: { name: string; logo: string; lead: string; href: string; text?: string }[] = [
  { name: "Bioliberty", logo: "bioliberty.png", lead: "Rowan Armstrong", href: "https://www.bioliberty.co.uk/#/home", text: "Bioliberty creates soft robotics technology to provide social care services to improve patient outcomes." },
  { name: "Biotangents", logo: "biotangents.png", lead: "Simon Aspland", href: "https://www.biotangents.co.uk/" },
  { name: "CamGene Therapeutics", logo: "camgene.png", lead: "Arpan Desai", href: "https://camgenetx.com/" },
  { name: "Carcinotech", logo: "carcinotech.png", lead: "Lorna Ewart", href: "https://www.carcinotech.co.uk/", text: "Carcinotech is a MedTech company manufacturing 3D printed mini tumours developed from patient-specific cancer stem cells, primary cells and established cell lines." },
  { name: "Chemify", logo: "chemify.svg", lead: "Lee Cronin", href: "https://www.chemify.io/about", text: "Chemify is building the digital chemistry infrastructure to enable worldwide access to any desired compound instantly and on-demand" },
  { name: "Concinnity Genetics", logo: "concinnity.png", lead: "Jessica Birt", href: "https://www.concinnitygenetics.com/about-us" },
  { name: "Cumulus Oncology", logo: "cumulus.png", lead: "Clare Waring", href: "https://www.cumulusoncology.com/", text: "Europes first cancer drug accelerator. Finding assets, creating spin-outs, commercialising cancer therapies." },
  { name: "Dxcover", logo: "dxcover.png", lead: "Prof. Matthew J Baker", href: "https://www.dxcover.com/", text: "Offers a revolutionary spectroscopic liquid biopsy with artificial intelligence for the early detection of cancer and other diseases." },
  { name: "Enough", logo: "enough.png", lead: "Jim Laird", href: "https://www.enough-food.com/#new_tab" },
  { name: "EnsiliTech", logo: "ensilitech.png", lead: "Asel Sartbaeva", href: "https://www.ensilitech.com/" },
  { name: "GM Flow", logo: "gmflow.png", lead: "Gavin Munro", href: "https://www.gmflow.co.uk/", text: "Formed in 2014 to offer Adjusta-Cone® as the world’s first fully adjustable differential pressure cone meter for natural gas." },
  { name: "ILC Therapeutics", logo: "ilc.png", lead: "Owain Millington", href: "https://ilctherapeutics.com/about-us/overview.asp" },
  { name: "Laverock Therapeutics", logo: "laverock.png", lead: "David Venables", href: "https://www.laverocktx.com/", text: "Laverock Therapeutics is developing a unique gene silencing platform for the creation of programmable advanced therapies." },
  { name: "Nami Surgical", logo: "nami.png", lead: "Nikki Palfrey", href: "https://www.namisurgical.com/about-us/" },
  { name: "Naturbeads", logo: "naturbeads.png", lead: "Giovanna Laudisio", href: "https://www.naturbeads.com/", text: "Biodegradable, sustainable and cost competitive cellulose microparticles to replace plastic microbeads" },
  { name: "Neupulse", logo: "neupulse.png", lead: "Paul Cable", href: "https://neupulse.co/pages/about-us" },
  { name: "Novosound", logo: "novosound.png", lead: "Gary Beale", href: "https://www.novosound.net/", text: "An award winning Scottish sensors company utilising thin-film processes to eliminate conventional limitations in ultrasound sensors." },
  { name: "Silverbac", logo: "novel.png", lead: "", href: "https://www.silverbactech.com/", text: "Novel Technologies has developed a technology where pure silver particles are incorporated into fibres as a antimicrobial coating for paints and textiles in a way that is ecologically sound and non-toxic to humans." },
  { name: "Penrhos Bio", logo: "penrhos.png", lead: "Richard Hammond", href: "https://penrhosbio.com/", text: "Penrhos Bio offers Remora technology, inspired by nature, that protects against bacteria, fungi, and algae, to provide self-cleaning surfaces." },
  { name: "Wobble Genomics", logo: "wobble.png", lead: "Richard Kuo", href: "https://www.wobblegenomics.com/#new_tab", text: "Specializes in maximizing RNA and DNA sequencing efficiency for the discovery and detection of nucleic acid biomarkers." },
];

/* Investors (#investors on the live site): the statement, the funding paragraph and the three routes. Each route's
   facts are the live popup's own lines (JetPopups 8017, 8026, 7980); the order is the homepage buttons'. */
export const investors = {
  title: ["Eos has a long-term partnership approach with like-minded", "individuals, family offices & companies."],
  text: "The funding model works across seed & growth stages, on a managed or discretionary basis. Investment relationships range from multistage and multiyear through to the original angel syndicate. Offers S/EIS UK tax relief for relevant investors when available.",
  // JetPopup 7316 "Who are you?": the four answers; each points at the route it opens on the live site.
  question: "Who are you?",
  answers: [
    { label: "I am interested in joining the Syndicate", route: "angel" },
    { label: "I am interested in EIS Fund investing", route: "fund" },
    { label: "I am looking for co-investment opportunities", route: "venture" },
    { label: "I am seeking investment", route: "contact" },
  ] as const,
};

export type RouteId = "fund" | "venture" | "angel";

/* Ticket sizes for the range chart, in £k, from the same lines: min = stated minimum, typical = stated typical range.
   Angel Syndicate states a minimum per investment and no typical range. "£1M+" is drawn as an open end. */
export const routes: { id: RouteId; name: string; role: string; lines: string[]; min: number; typical?: [number, number]; openEnd?: boolean; stage: string }[] = [
  { id: "fund", name: "Innovation Fund", role: "Eos manages", stage: "Seed",
    lines: ["Seed round investments", "Annual close (Q4), minimum of £25k with a typical range of £100k-£500k", "5-8 investments per year", "Each ‘vintage’ is separate, but most investors invest each year"],
    min: 25, typical: [100, 500] },
  { id: "venture", name: "Venture Partners", role: "Eos arranges, members make decisions", stage: "Growth & Series A+",
    lines: ["For growth rounds & Series A+", "Opportunities presented on ad-hoc basis", "Minimum of £25k with typical range of £100k-£1M+ in any one deal", "Opportunities normally grown out of Innovation Fund, but occasionally from wider market"],
    min: 25, typical: [100, 1000], openEnd: true },
  { id: "angel", name: "Angel Syndicate", role: "Eos arranges, members make decisions", stage: "Initial & follow-on",
    lines: ["Initial equity investment & follow-ons within existing portfolio", "Minimum investment of £5k per investment", "The founding pillar of Eos, accounting for c. 13% of investments per annum", "Meetings happen virtually on a monthly basis & in-person each quarter"],
    min: 5 },
];

// "Our Partners", with the live links. Logos redrawn in Ink by scripts/images.py.
export const partners = [
  { name: "UK Business Angels Association member", logo: "/media/logos/ukbaa.png", href: "https://ukbaa.org.uk/membership/what-it-means-to-be-a-ukbaa-member/", w: 150 },
  { name: "Enterprise Investment Scheme Association", logo: "/media/logos/eisa.png", href: "https://eisa.org.uk/", w: 170 },
  { name: "Working with British Business Bank", logo: "/media/logos/bbb.png", href: "https://www.bbinv.co.uk", w: 130 },
];

/* Team: the homepage block, plus the ten people on /team in the live order. "Learn more" opens a popup there,
   so each person links to /team/. */
export const team = {
  title: "Team",
  text: "The Eos team is made up of founders, scientists, record breakers, industry leaders, and government advisors.",
  link: { label: "Meet the entire Eos team", href: `${LIVE}/team/` },
  people: [
    { name: "Jill Arnold", role: "Investment Relationship Director", image: "/media/team/5.jpg" },
    { name: "Hettie Blampied", role: "Operations and Communications Executive", image: "/media/team/6.jpg" },
    { name: "Chris Brinsmead", role: "Partner", image: "/media/team/11.jpg", committee: true },
    { name: "Rick Clark", role: "Partner", image: "/media/team/7.jpg", committee: true },
    { name: "Andrew Durkie", role: "Partner", image: "/media/team/3.jpg", committee: true },
    { name: "Rob Halliday", role: "Investment Director", image: "/media/team/9.jpg" },
    { name: "Calum Keddie", role: "Investment Executive", image: "/media/team/8.jpg" },
    { name: "Andrew McNeill", role: "Managing Partner", image: "/media/team/10.jpg", committee: true },
    { name: "Anne Muir", role: "Director of Portfolio", image: "/media/team/4.jpg" },
    { name: "Ana Stewart", role: "Partner", image: "/media/team/1.jpg", committee: true },
  ],
};

/* News (JetEngine listing 8834): the three items the homepage shows, newest first. Each links to the external
   release, as on the live site. */
export const news = [
  { title: "Bioliberty Raises $10.2 million to Build Functional Intelligence Capabilities for Post‑Acute Care", date: "March 19, 2026", iso: "2026-03-19",
    href: "https://www.globenewswire.com/news-release/2026/03/19/3258693/0/en/Bioliberty-Raises-10-2-million-to-Build-Functional-Intelligence-Capabilities-for-Post-Acute-Care.html",
    image: "/media/news-bioliberty.jpg", alt: "Jane Reoch, Albert Nicholl, Rowan Armstrong and Ailsa Young of Bioliberty" },
  { title: "Dxcover Secures CE-IVDR Certification", date: "March 4, 2026", iso: "2026-03-04",
    href: "https://www.businesswire.com/news/home/20260303995618/en/Dxcover-Secures-CE-IVDR-Certification",
    image: "/media/news-dxcover.jpg", alt: "A Dxcover scientist at work in the laboratory" },
  { title: "Neupulse raises £3 million to accelerate delivery of its neurotherapeutic technology", date: "February 19, 2026", iso: "2026-02-19",
    href: "https://neupulse.co/blogs/news/neupulse-raises-3-million-to-accelerate-delivery-of-its-neurotherapeutic-technology",
    image: "/media/news-neupulse.jpg", alt: "The Neupulse wearable on a wrist" },
];

export const newsLink = { label: "All News", href: `${LIVE}/news-archive/` };

// "Get in touch" form fields, as on the live page (Name, Email, Company, Message; Send).
export const form = { title: "Get in touch", fields: ["Name", "Email", "Company"], message: "Message", send: "Send" };
