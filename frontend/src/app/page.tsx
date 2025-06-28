import { AccordionDemo } from "@/components/Accordian";
import Card from "@/components/Card";
import Feature from "@/components/Feature";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Information from "@/components/Information";
import { LogoTicker } from "@/components/LogoTicker";
import { ThreeDMarqueeDemoSecond } from "@/components/MarqueeSection";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <div className="relative overflow-hidden bg-black scroll-smooth select-none ">
      <Navbar />
      <Hero />
      <LogoTicker />
      <Card />
      <Feature />
      {/* <Information /> */}
      <ThreeDMarqueeDemoSecond />
      <AccordionDemo />
      <Footer />
    </div>
  );
}
