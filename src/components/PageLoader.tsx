"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<SVGPathElement>(null);
  const pathOrangeRef = useRef<SVGPathElement>(null);
  const pathPinkRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loader = loaderRef.current;
    if (!loader) return;

    // Skip if loader already completed in this session
    if ((window as any).__two26LoaderDone) {
      loader.style.display = "none";
      loader.style.pointerEvents = "none";
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      loader.style.display = "none";
      (window as any).__two26LoaderDone = true;
      document.dispatchEvent(new CustomEvent("two26:loaderComplete"));
      return;
    }

    // Lock scrolling during loader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const pathOrange = pathOrangeRef.current;
    const pathPink = pathPinkRef.current;
    const ribbon = ribbonRef.current;
    const letters = Array.from(
      loader.querySelectorAll<HTMLElement>(".loader-letter")
    );
    const logoBox = loader.querySelector<HTMLElement>(".loader-logo-box");

    const BG_STROKE_START = 3000;
    const BG_STROKE_END = 1000;

    // Background setup
    if (pathOrange) {
      const len0 = pathOrange.getTotalLength ? pathOrange.getTotalLength() : 3000;
      pathOrange.style.strokeDasharray = `${len0}`;
      pathOrange.style.strokeDashoffset = "0";
      gsap.set(pathOrange, { x: 0, y: 0, strokeWidth: BG_STROKE_START });
    }
    if (pathPink) {
      const len1 = pathPink.getTotalLength ? pathPink.getTotalLength() : 3000;
      pathPink.style.strokeDasharray = `${len1}`;
      pathPink.style.strokeDashoffset = "0";
      gsap.set(pathPink, { x: 0, y: 0, strokeWidth: BG_STROKE_START });
    }

    // Ribbon setup
    if (ribbon) {
      const lenR = ribbon.getTotalLength ? ribbon.getTotalLength() : 2500;
      ribbon.style.strokeDasharray = `${lenR * 0.08} ${lenR}`;
      ribbon.style.strokeDashoffset = `${lenR}`;
      gsap.set(ribbon, { strokeWidth: 0, opacity: 1 });
    }

    if (logoBox) {
      gsap.set(logoBox, { visibility: "visible" });
    }

    // Letters bouncy pop setup
    letters.forEach((letter) => {
      const randomAngle = gsap.utils.random(-25, 25);
      gsap.set(letter, {
        scale: 0,
        opacity: 0,
        rotation: randomAngle,
        transformOrigin: "center center",
      });
    });

    // Master Timeline
    const masterTl = gsap.timeline({
      delay: 0.15,
      onComplete: () => {
        document.body.style.overflow = originalOverflow;
        loader.style.display = "none";
        loader.style.pointerEvents = "none";
        (window as any).__two26LoaderDone = true;
        document.dispatchEvent(new CustomEvent("two26:loaderComplete"));
        if ((window as any).ScrollTrigger) {
          (window as any).ScrollTrigger.refresh();
        }
      },
    });

    // 1. Ribbon stroke draws through center
    if (ribbon) {
      const lenR = ribbon.getTotalLength ? ribbon.getTotalLength() : 2500;
      masterTl
        .to(
          ribbon,
          {
            strokeWidth: 19,
            duration: 0.8,
            ease: "power2.in",
          },
          0
        )
        .to(
          ribbon,
          {
            strokeDashoffset: lenR * 0.35,
            duration: 1.4,
            ease: "power1.inOut",
          },
          0
        )
        .to(
          ribbon,
          {
            strokeDashoffset: -lenR * 0.05,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.4"
        )
        .to(
          ribbon,
          {
            strokeWidth: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.4"
        );
    }

    // 2. Letters pop in with staggered bouncy spring
    masterTl.to(
      letters,
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(2.8)",
      },
      "-=0.7"
    );

    // 3. Brief cinematic hold
    masterTl.to({}, { duration: 0.35 });

    // 4. Exit Sequence: Pink sweep -> Orange sweep -> Reveal
    const SWEEP_DURATION = 0.65;
    masterTl.add(() => {
      if (loader) {
        loader.style.pointerEvents = "none";
      }
      document.body.style.overflow = originalOverflow;
    }, "pinkSweep");

    if (pathPink) {
      const len1 = pathPink.getTotalLength ? pathPink.getTotalLength() : 3000;
      masterTl.to(
        pathPink,
        {
          strokeDashoffset: -len1 * 0.5,
          strokeWidth: BG_STROKE_END,
          y: 1800,
          x: 900,
          duration: SWEEP_DURATION,
          ease: "power2.inOut",
        },
        "pinkSweep"
      );
    }

    if (logoBox) {
      masterTl.to(
        logoBox,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        "pinkSweep+=" + SWEEP_DURATION * 0.2
      );
    }

    if (pathOrange) {
      const len0 = pathOrange.getTotalLength ? pathOrange.getTotalLength() : 3000;
      masterTl.to(
        pathOrange,
        {
          strokeDashoffset: -len0 * 0.5,
          strokeWidth: BG_STROKE_END,
          y: 1800,
          x: -900,
          duration: SWEEP_DURATION,
          ease: "power2.inOut",
        },
        "pinkSweep+=" + SWEEP_DURATION * 0.25
      );
    }

    return () => {
      masterTl.kill();
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      ref={loaderRef}
      className="loader"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#F9E2E1",
        pointerEvents: "all",
      }}
    >
      {/* Background SVG sweep paths */}
      <div
        className="svg-bg-stroke"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1500 1093"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            ref={pathOrangeRef}
            d="M1500 0C687.437 32.0206 767.477 1069.1 4.43459e-05 1093"
            stroke="#FF5400"
            strokeWidth="1000"
            strokeLinecap="round"
          />
          <path
            ref={pathPinkRef}
            d="M0 0C812.563 32.0206 732.523 1069.1 1500 1093"
            stroke="#F9E2E1"
            strokeWidth="3000"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Decorative Ribbon tracer SVG */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 5,
        }}
        viewBox="0 0 1451 1004"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={ribbonRef}
          d="M9.5022 602.203C130.513 541.926 163.851 545.542 284.259 610.875C402.641 675.109 590.609 623.802 578.502 465.31C573.002 393.31 660.002 382.81 660.002 453.81C660.002 483.31 659.762 495.353 660.002 523.727C660.231 550.772 660.002 579.905 680.502 583.81C694.002 586.381 704.502 579.31 714.002 568.81C723.502 558.31 729.048 555.163 742.502 518.31C754.002 486.81 741.002 472.31 725.502 472.31C707.002 472.31 697.492 491.81 709.002 520.31C719.502 546.31 727.301 559.545 738.502 571.31C741.834 574.81 763.118 593.044 779.002 579.31C793.002 567.205 791.002 543.59 791.002 516.31C791.002 500.999 791.002 485.31 791.002 453.81C791.002 249.749 1224 388.703 1246.5 576.703C1256.82 662.894 1163 668.866 1163 619.703C1163 541.203 1350.5 512.703 1441 527.703"
          stroke="#FF5400"
          strokeWidth="0"
          style={{ opacity: 0 }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Center Intro Logo: LABIB on top, FOHAYER below */}
      <div
        className="loader-inner"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <div
          className="loader-logo-box"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 0.88,
            textAlign: "center",
            visibility: "hidden",
          }}
        >
          {/* Top Line: LABIB */}
          <div
            className="loader-logo-top"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.04em",
              color: "#FF5400",
              fontFamily: '"NeueMontreal", sans-serif',
              fontSize: "clamp(2.4rem, 8vw, 7.5rem)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {["L", "A", "B", "I", "B"].map((char, i) => (
              <span
                key={i}
                className="loader-letter"
                style={{
                  display: "inline-block",
                  willChange: "transform, opacity",
                  opacity: 0,
                  transform: "scale(0)",
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Bottom Line: FOHAYER */}
          <div
            className="loader-logo-bottom"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.02em",
              color: "#FF5400",
              fontFamily: 'var(--font-primary, "MDNichrome", serif)',
              fontSize: "clamp(3.8rem, 14vw, 13.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {["F", "O", "H", "A", "Y", "E", "R"].map((char, i) => (
              <span
                key={i}
                className="loader-letter"
                style={{
                  display: "inline-block",
                  willChange: "transform, opacity",
                  opacity: 0,
                  transform: "scale(0)",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
