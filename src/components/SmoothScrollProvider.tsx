"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isTouch = matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      duration: isTouch ? 1.1 : 1.6,
      wheelMultiplier: 0.9,
      touchMultiplier: isTouch ? 1.5 : 2.2,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
