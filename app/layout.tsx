import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/chrome";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/chrome.css";
import "@/styles/preloader.css";
import "@/styles/hero.css";
import "@/styles/home.css";

// Title and description are the live homepage's own (eos-advisory.com).
export const metadata: Metadata = {
  title: "Eos | Bridging innovation with global opportunity", // live: "Eos - Bridging innovation with global opportunity" (dash removed, house rule)
  description: "Eos invests in, & commercialises, science & technology, from local seed-stage to global scale, with a focus on improving life.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#272727" };

/* `js` (and the preloader's `is-loading`/`is-landing`) is set before first paint, unless reduced motion is requested,
   so reveal targets start hidden without a flash. Without JavaScript the classes are never added and everything
   renders in place; the <noscript> style hides the preloader. */
const boot = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js','is-loading','is-landing')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-header="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/media/hero.jpg" as="image" media="(min-width: 641px)" />
        <link rel="preload" href="/media/hero-sm.jpg" as="image" media="(max-width: 640px)" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
