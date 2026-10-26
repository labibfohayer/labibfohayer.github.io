"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import AboutHero from "@/components/about/AboutHero";
import AboutMoodboard from "@/components/about/AboutMoodboard";
import AboutValues from "@/components/about/AboutValues";
import AboutCapabilities from "@/components/about/AboutCapabilities";
import "./about.css";

export default function AboutPage() {
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

    // Ensure ScrollTrigger & Lenis recalculate accurately once web fonts and images are ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleInit);
    }

    const imgs = document.querySelectorAll(".page img");
    imgs.forEach((img: Element) => {
      const htmlImg = img as HTMLImageElement;
      if (!htmlImg.complete) {
        htmlImg.addEventListener("load", handleInit, { once: true });
      }
    });

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Navbar onOpenContact={() => setIsContactOpen(true)} />
      <div className="page lenis selection:bg-[#ff5400] selection:text-white relative">
        <main className="main">
          <AboutHero />
          <AboutMoodboard />
          <AboutValues />
          <AboutCapabilities />
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
