"use client";

import { useEffect, useRef } from "react";
import workData from "./workData.json";

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

      if ((window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }
      if ((window as any).lenis) {
        (window as any).lenis.resize();
      }
    };

    // Trigger immediately and also on next ticks
    completeLoader();
    const t1 = setTimeout(completeLoader, 150);
    const t2 = setTimeout(completeLoader, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: workData.html }}
    />
  );
}
