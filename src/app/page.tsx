"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import SliderShowcase from "@/components/SliderShowcase";
import ProjectShowcase from "@/components/ProjectShowcase";
import ServicesSection from "@/components/ServicesSection";
import TestimonialsStack from "@/components/TestimonialsStack";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import PageLoader from "@/components/PageLoader";

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);

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
      <div className="page lenis selection:bg-[#ff5400] selection:text-white relative">
      <Navbar onOpenContact={() => setIsContactOpen(true)} />
      <main className="main">
        <Hero onOpenContact={() => setIsContactOpen(true)} />
        <AboutSection />
        <SliderShowcase />
        <ProjectShowcase />
        <ServicesSection />
        <TestimonialsStack />
        <FAQAccordion />
        <Footer onOpenContact={() => setIsContactOpen(true)} />
      </main>

      {/* Slide-In Direct Inquiry Drawer */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
    </>
  );
}
