import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import MenuBoard from "@/components/MenuBoard";
import Process from "@/components/Process";
import Contact from "@/components/Contact";
import InstagramFeed from "@/components/InstagramFeed";
import GoogleReviews from "@/components/GoogleReviews";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <MenuBoard />
      <Process />
      <Marquee />
      <Catalogue />
      <GoogleReviews />
      <InstagramFeed />
      <Contact />
      <Footer />
    </main>
  );
}
