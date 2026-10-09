/* Site structure from the live eos-advisory.com header menu (Elementor popup 2172), footer (template 855) and
   risk-warning bar (checked 2026-10-09). Only the homepage is rebuilt, so every link here goes to the real URL on the
   live site or scrolls to a section of this page. Pages are checked against /page-sitemap.xml, everything else
   (the news archive, the complaints PDF, partner and portfolio sites) for a 2xx, by `npm run links`. */
import type { BrandIcon } from "@/lib/brand-icons";

export type Link = { label: string; href: string };

export const LIVE = "https://eos-advisory.com";
const UP = `${LIVE}/wp-content/uploads`;

/* The live menu's "Discover" list: Home, Introductions, Portfolio, Team, Investors, Get in touch. Introductions,
   Investors and Get in touch are anchors on the live homepage (#introductions, #investors, #get-in-touch) and keep
   those ids here. Portfolio and Team are pages on the live site, and also sections of this page. */
export const onPage: Link[] = [
  { label: "Home", href: "#top" },
  { label: "Introductions", href: "#introductions" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Investors", href: "#investors" },
  { label: "Team", href: "#team" },
  { label: "News", href: "#news" },
  { label: "Get in touch", href: "#get-in-touch" },
];

// The live site's own pages (page sitemap) plus the news archive the homepage links to.
export const livePages: Link[] = [
  { label: "Portfolio", href: `${LIVE}/portfolio/` },
  { label: "Team", href: `${LIVE}/team/` },
  { label: "News archive", href: `${LIVE}/news-archive/` },
  { label: "Risk warnings", href: `${LIVE}/risk-warnings/` },
];

// The live footer, in order and with its own labels.
export const footerDiscover: Link[] = [
  { label: "Home", href: "#top" },
  { label: "Introductions", href: "#introductions" },
  { label: "Portfolio", href: `${LIVE}/portfolio/` },
  { label: "Team", href: `${LIVE}/team/` },
  { label: "Investors", href: "#investors" },
  { label: "Get in touch", href: "#get-in-touch" },
];

export const footerLinks: Link[] = [
  { label: "Privacy Policy", href: `${LIVE}/privacy-policy/` },
  { label: "Cookies", href: `${LIVE}/cookies/` },
  { label: "Complaints", href: `${UP}/Complaints-Procedure-to-Upload-to-Site.pdf` },
];

export const contact = {
  company: "Eos Advisory LLP",
  address: ["Kinburn Castle,", "Doubledykes Road,", "St Andrews, KY16 9DR"],
  // The footer's mailto. (The live menu popup spells it "enquires@", a typo; the footer's spelling is used.)
  email: "enquiries@eos-advisory.com",
};

export const socials: { name: string; href: string; icon: BrandIcon }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/eos-advisory/", icon: "linkedin" },
];

// The live site's fixed top bar (Elementor), required wording for financial promotions; it sits in the hero's
// footer line and again in the footer here. The live copy uses a non-breaking hyphen in "high‑risk".
export const riskWarning = {
  text: "Don’t invest unless you’re prepared to lose money. This is a high‑risk investment. You may not be able to access your money easily and are unlikely to be protected if something goes wrong.",
  link: { label: "Take two minutes to learn more.", href: `${LIVE}/risk-warnings/` },
};

export const legal = "Eos Advisory LLP is a Limited Liability Partnership registered in Scotland with registered number SO306577. Registered Office: Kinburn Castle, Doubledykes Road, St Andrews, KY16 9DR. Eos Advisory LLP is authorised and regulated by the Financial Conduct Authority (FCA), reference number 980583.";

export const copyright = "© Eos Advisory LLP, 2026 | All rights reserved";
