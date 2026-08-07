import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ApercuTeaser from "@/components/ApercuTeaser";
import MenuBoard from "@/components/MenuBoard";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import InstagramFeed from "@/components/InstagramFeed";
import GoogleReviews from "@/components/GoogleReviews";
import CatalogueTeaser from "@/components/CatalogueTeaser";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      {/* L'apercu passe avant le menu : c'est la seule chose que personne
          d'autre ne propose, et c'est gratuit et sans engagement. Le tarif
          vient ensuite, pour qui a deja vu son logo sur un vetement. */}
      <ApercuTeaser />
      <MenuBoard />
      <Process />
      <Marquee />
      <CatalogueTeaser />
      <GoogleReviews />
      <InstagramFeed />
      <Contact />
      <Footer />
    </main>
  );
}
