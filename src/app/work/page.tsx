"use client";

import { useEffect, useRef } from "react";
import workData from "./workData.json";
import { initCTAButtons } from "@/lib/buttonAnimations";

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Execute only inline scripts inside the container in document order
    // External scripts (jquery, gsap, lenis) are already loaded in RootLayout
    const scripts = Array.from(containerRef.current.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      if (oldScript.getAttribute("src")) return;
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    const handleInitLenis = () => {
      // If window.lenis exists but points to a detached element, destroy it
      if (
        (window as any).lenis &&
        (window as any).lenis.dimensions &&
        (window as any).lenis.dimensions.wrapper &&
        !document.body.contains((window as any).lenis.dimensions.wrapper)
      ) {
        try {
          (window as any).lenis.destroy();
        } catch (e) {}
        (window as any).lenis = null;
      }

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

    const handleInitAnimations = () => {
      if (typeof (window as any).initTwo26FooterAnimation === "function") {
        (window as any).initTwo26FooterAnimation();
      }
      if (containerRef.current) {
        initCTAButtons(containerRef.current);
      }
      if ((window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
    };

    // Ensure loader completes and animations trigger
    const completeLoader = () => {
      (window as any).__two26LoaderDone = true;
      const loader = document.querySelector(".loader") as HTMLElement | null;
      if (loader) {
        loader.style.display = "none";
      }
      document.body.style.overflow = "visible";
      document.documentElement.style.overflow = "visible";
      document.dispatchEvent(new CustomEvent("two26:loaderComplete"));

      handleInitLenis();
      handleInitAnimations();
    };

    // Trigger immediately and also on next ticks
    completeLoader();
    const t1 = setTimeout(completeLoader, 150);
    const t2 = setTimeout(completeLoader, 300);
    const t3 = setTimeout(completeLoader, 600);

    // Font ready & image loading triggers for Lenis & ScrollTrigger recalculation
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        handleInitLenis();
        handleInitAnimations();
      });
    }

    const imgs = containerRef.current.querySelectorAll("img");
    imgs.forEach((img: HTMLImageElement) => {
      if (!img.complete) {
        img.addEventListener(
          "load",
          () => {
            handleInitLenis();
            handleInitAnimations();
          },
          { once: true },
        );
      }
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (
        (window as any).lenis &&
        (window as any).lenis.dimensions &&
        containerRef.current &&
        containerRef.current.contains((window as any).lenis.dimensions.wrapper)
      ) {
        try {
          (window as any).lenis.destroy();
        } catch (e) {}
        (window as any).lenis = null;
      }
      if ((window as any).ScrollTrigger) {
        try {
          (window as any).ScrollTrigger.getById("footer-logo-bounce")?.kill();
          (window as any).ScrollTrigger.getById("footer-heading-reveal")?.kill();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: workData.html }}
    />
  );
}
