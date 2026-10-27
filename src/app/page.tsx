"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import SliderShowcase from "@/components/SliderShowcase";
import ProjectShowcase from "@/components/ProjectShowcase";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsStack from "@/components/TestimonialsStack";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

export default function Home() {

  useEffect(() => {
    const handleInit = () => {
      if (typeof (window as any).initLenis === "function") {
        (window as any).initLenis();
      }
      if ((window as any).lenis) {
        (window as any).lenis.resize();
      }
      if ((window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
    };

    handleInit();
    const t = setTimeout(handleInit, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <PageLoader />
      <Navbar />
      <div className="page lenis selection:bg-[#ff5400] selection:text-white relative">
        <main className="main">
          <Hero />
          <AboutSection />
          <SliderShowcase />
          <ProjectShowcase />
          <ServicesSection />
          <TestimonialsStack />
          <FAQAccordion />
          <Footer />
        </main>
      </div>
    </>
  );
}
