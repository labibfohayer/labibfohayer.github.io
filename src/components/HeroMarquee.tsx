"use client";

import React, { useEffect, useRef } from "react";

const REPEAT_UNIT =
  "CRAFTING DIGITAL EXPERIENCES \u00A0•\u00A0 WRITING CLEAN CODE \u00A0•\u00A0 AUTOMATING THE BORING STUFF \u00A0•\u00A0 SCALING YOUR BUSINESS \u00A0•\u00A0 LET’S BUILD SOMETHING GREAT \u00A0•\u00A0 ";

export default function HeroMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const unitRef = useRef<SVGTSpanElement>(null);
  const bgPathRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const textGroupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap) return;

    // 120 FPS hardware acceleration
    gsap.ticker.fps(120);
    gsap.ticker.lagSmoothing(500, 16);

    const DrawSVG = (window as any).DrawSVGPlugin;
    if (DrawSVG) {
      gsap.registerPlugin(DrawSVG);
    }
    if (ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const bgPath = bgPathRef.current;
    const maskPath = maskPathRef.current;
    const textPath = textPathRef.current;
    const textGroup = textGroupRef.current;
    const unit = unitRef.current;
    const container = containerRef.current;

    if (!bgPath || !maskPath || !textPath) return;

    const hasDrawSVG = typeof DrawSVG !== "undefined";

    // 1. Initial State: Start at 100% 100% (hidden on right end)
    if (hasDrawSVG) {
      gsap.set([bgPath, maskPath], { drawSVG: "100% 100%", force3D: true });
    } else {
      const len = bgPath.getTotalLength ? bgPath.getTotalLength() : 1800;
      bgPath.style.strokeDasharray = `${len}`;
      bgPath.style.strokeDashoffset = `${-len}`;
      maskPath.style.strokeDasharray = `${len}`;
      maskPath.style.strokeDashoffset = `${-len}`;
    }

    // 2. Start Seamless Infinite Marquee Loop (120 FPS)
    let unitLength = 1600;
    try {
      const len = unit ? unit.getComputedTextLength() : 0;
      if (len > 100) unitLength = len;
    } catch {
      // Fallback unit length
    }

    const speedDuration = unitLength / 75; // Smooth slow reading pace matching Webflow

    const marqueeTween = gsap.to(textPath, {
      attr: { startOffset: -unitLength },
      duration: speedDuration,
      ease: "none",
      repeat: -1,
      force3D: true,
    });

    // 3. ScrollTrigger / Reveal: Draw Ribbon + Reveal Text simultaneously from Right to Left
    let revealTween: any = null;
    const scrollerEl = document.querySelector(".page") || window;

    if (hasDrawSVG) {
      revealTween = gsap.to([bgPath, maskPath], {
        drawSVG: "0% 100%",
        delay: window.innerWidth < 991 ? 0.3 : 0,
        duration: 1.3,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: container,
          scroller: scrollerEl,
          start: "top 85%",
          once: true,
        },
        onComplete: () => {
          if (textGroup) {
            textGroup.removeAttribute("mask");
          }
        },
      });
    } else {
      revealTween = gsap.to([bgPath, maskPath], {
        strokeDashoffset: 0,
        delay: window.innerWidth < 991 ? 0.3 : 0,
        duration: 1.3,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: container,
          scroller: scrollerEl,
          start: "top 85%",
          once: true,
        },
        onComplete: () => {
          if (textGroup) {
            textGroup.removeAttribute("mask");
          }
        },
      });
    }

    return () => {
      marqueeTween.kill();
      if (revealTween) revealTween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-marquee">
      <div className="code-embed-8 w-embed w-script">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .hero-marquee svg {
                overflow: visible !important;
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
                will-change: transform;
              }

              .hero-marquee-text,
              .hero-marquee-tp,
              .marquee-unit,
              .hero-marquee-text tspan {
                dominant-baseline: central !important;
                alignment-baseline: central !important;
                -webkit-font-smoothing: antialiased;
              }
            `,
          }}
        />

        <svg
          viewBox="0 0 1440 370"
          preserveAspectRatio="xMidYMid meet"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            overflow: "visible",
          }}
        >
          <defs>
            {/* Extended Text Curve (Extends to x:45000 so incoming text is pre-rendered with ZERO pop-in) */}
            <path
              id="hero-marquee-curve"
              d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117 L 45000 5018"
              fill="none"
            />

            {/* SVG Mask for Right-to-Left Text Reveal */}
            <mask id="hero-marquee-text-mask" maskUnits="userSpaceOnUse">
              <path
                ref={maskPathRef}
                className="hero-marquee-mask-path"
                d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117"
                stroke="#FFFFFF"
                strokeWidth="220"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </mask>
          </defs>

          {/* 1. Background Orange Ribbon Stroke */}
          <path
            ref={bgPathRef}
            className="hero-marquee-bg"
            d="M-43.0867 292.81C179.631 174.299 464.078 116.458 712.699 90.6403C934.59 67.5984 1166.5 74.6231 1436.89 105.117"
            stroke="#FF5400"
            strokeWidth="154"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* 2. Text Group revealed via Stroke Mask */}
          <g
            ref={textGroupRef}
            className="hero-marquee-text-group"
            mask="url(#hero-marquee-text-mask)"
          >
            <text
              className="hero-marquee-text"
              fill="#FFFFFF"
              dominantBaseline="central"
              alignmentBaseline="central"
              fontSize="80"
              fontWeight="800"
              style={{
                letterSpacing: "0.04em",
                userSelect: "none",
                dominantBaseline: "central",
                alignmentBaseline: "central",
              }}
            >
              <textPath
                ref={textPathRef}
                href="#hero-marquee-curve"
                className="hero-marquee-tp"
                startOffset="0"
                dominantBaseline="central"
                alignmentBaseline="central"
              >
                <tspan
                  ref={unitRef}
                  className="marquee-unit"
                  dominantBaseline="central"
                  alignmentBaseline="central"
                >
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
                <tspan dominantBaseline="central" alignmentBaseline="central">
                  {REPEAT_UNIT}
                </tspan>
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
