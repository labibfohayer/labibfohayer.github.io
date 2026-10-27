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

    const ensureLenisTicker = () => {
      if (typeof (window as any).gsap !== "undefined" && (window as any).gsap.ticker) {
        (window as any).gsap.ticker.lagSmoothing(0);
        if (!(window as any)._lenisTicker) {
          (window as any)._lenisTicker = (time: number) => {
            if ((window as any).lenis) {
              (window as any).lenis.raf(time * 1000);
            }
          };
          (window as any).gsap.ticker.add((window as any)._lenisTicker);
        }
      }
    };

    const handleInitLenis = () => {
      const wrapper = document.querySelector(".page") as HTMLElement | null;
      const content = document.querySelector(".main") as HTMLElement | null;
      if (!wrapper || !content) return;

      ensureLenisTicker();

      if (
        (window as any).lenis &&
        (window as any).lenis.dimensions &&
        (window as any).lenis.dimensions.wrapper === wrapper &&
        document.body.contains(wrapper)
      ) {
        (window as any).lenis.resize();
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
        return;
      }

      if ((window as any).lenis) {
        try {
          (window as any).lenis.destroy();
        } catch (e) {}
        (window as any).lenis = null;
      }

      if (typeof (window as any).Lenis === "undefined") return;

      const isTouch = window.matchMedia("(pointer: coarse)").matches;

      const lenis = new (window as any).Lenis({
        wrapper: wrapper,
        content: content,
        eventsTarget: window,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        infinite: false,
        duration: isTouch ? 1.0 : 1.2,
        lerp: 0.1,
        wheelMultiplier: 1.0,
        touchMultiplier: isTouch ? 1.0 : 1.8,
        touchInertiaMultiplier: isTouch ? 18 : 35,
        syncTouch: false,
        syncTouchLerp: isTouch ? 0.09 : 0.25,
        touchInertiaExponent: 2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      (window as any).lenis = lenis;

      if (typeof (window as any).gsap !== "undefined") {
        const gsap = (window as any).gsap;
        const ScrollTrigger = (window as any).ScrollTrigger;

        if (typeof ScrollTrigger !== "undefined") {
          gsap.registerPlugin(ScrollTrigger);

          lenis.on("scroll", ScrollTrigger.update);

          ScrollTrigger.scrollerProxy(wrapper, {
            scrollTop(value: number) {
              if (arguments.length) {
                lenis.scrollTo(value, { immediate: true });
              }
              return lenis.scroll;
            },
            getBoundingClientRect() {
              return {
                top: 0,
                left: 0,
                width: wrapper.clientWidth || window.innerWidth,
                height: wrapper.clientHeight || window.innerHeight,
              };
            },
            pinType: "transform",
          });

          ScrollTrigger.defaults({ scroller: wrapper });
          ScrollTrigger.addEventListener("refresh", () => {
            lenis.resize();
          });
          ScrollTrigger.refresh();
        }
      }

      ensureLenisTicker();
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
      document.body.style.position = "static";
      document.body.style.overflow = "hidden";
      document.documentElement.style.position = "static";
      document.documentElement.style.overflow = "visible";
      document.dispatchEvent(new CustomEvent("two26:loaderComplete"));

      handleInitLenis();
      handleInitAnimations();
    };

    // Trigger immediately and once after layout settling
    completeLoader();
    const t1 = setTimeout(completeLoader, 250);

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
