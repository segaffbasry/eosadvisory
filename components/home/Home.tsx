import Preloader from "@/components/Preloader";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Investors } from "@/components/home/Investors";
import { News } from "@/components/home/News";
import { Portfolio } from "@/components/home/Portfolio";
import { Team } from "@/components/home/Team";

/* The single route. Section order and grounds (README "Sections"):
   Hero (Ink, photo) · Introductions (white) · Portfolio (Mist) · Investors (white) · Team (Mist) · News (white) ·
   Get in touch (Mist) · footer (Ink). */
export function Home() {
  return <>
    <Preloader />
    <Hero />
    <Intro />
    <Portfolio />
    <Investors />
    <Team />
    <News />
    <Contact />
  </>;
}
