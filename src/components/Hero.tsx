"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroMarquee from "./HeroMarquee";

interface HeroProps {
  onOpenContact?: () => void;
}

export default function Hero({ onOpenContact }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may need user gesture on some strict browsers
      });
    }

    if (typeof window === "undefined") return;

    // 120 FPS hardware acceleration
    gsap.ticker.fps(120);
    gsap.ticker.lagSmoothing(500, 16);

    const DrawSVG = (window as any).DrawSVGPlugin;
    if (DrawSVG) {
      gsap.registerPlugin(DrawSVG);
    }
    const SplitTextPlugin = (window as any).SplitText;
    if (SplitTextPlugin) {
      gsap.registerPlugin(SplitTextPlugin);
    }

    const heroSection = heroRef.current;
    if (!heroSection) return;

    // -------------------------------------------------------------
    // 1. Elements Selection
    // -------------------------------------------------------------
    const headings = Array.from(
      heroSection.querySelectorAll<HTMLElement>(
        ".hero-text h1, .hero-text .heading, h1, [data-hero-heading]"
      )
    );
    const pills = Array.from(
      heroSection.querySelectorAll<HTMLElement>(".hero-pill")
    );
    const allSvgPaths = Array.from(
      heroSection.querySelectorAll<SVGPathElement>(
        ".hero-path-svg-left svg path, .hero-path-svg-right svg path, .hero-path-svg-left path, .hero-path-svg-right path"
      )
    );

    const hasDrawSVG = !!DrawSVG;

    // -------------------------------------------------------------
    // 2. Line-by-Line Heading Setup
    // -------------------------------------------------------------
    let linesList: HTMLElement[] = [];

    headings.forEach((heading) => {
      const lines = Array.from(
        heading.querySelectorAll<HTMLElement>(".hero-line")
      );

      gsap.set(heading, { opacity: 1 });
      gsap.set(lines, {
        y: "115%",
        opacity: 0,
        display: "block",
        force3D: true,
      });

      linesList = linesList.concat(lines);
    });

    // -------------------------------------------------------------
    // 3. Initial Setup for Pills (Preserves Designer's Custom Rotation)
    // -------------------------------------------------------------
    if (pills.length) {
      gsap.set(pills, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: "center center",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        force3D: true,
      });

      pills.forEach((pill) => {
        const pillTextEl = pill.querySelector<HTMLElement>(".hero-pill-text");
        if (pillTextEl) {
          gsap.set(pillTextEl, { y: "105%", opacity: 0, force3D: true });
        }
      });
    }

    // -------------------------------------------------------------
    // 4. Initial Setup for Hero SVG Paths (Draw 0 & Stroke 0)
    // -------------------------------------------------------------
    const pathData: { path: SVGPathElement; originalStrokeWidth: number }[] = [];
    if (allSvgPaths.length) {
      allSvgPaths.forEach((path) => {
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";

        const originalStrokeWidth =
          parseFloat(
            path.getAttribute("stroke-width") ||
              path.getAttribute("strokeWidth") ||
              window.getComputedStyle(path).strokeWidth
          ) || 30;

        pathData.push({ path, originalStrokeWidth });

        if (hasDrawSVG) {
          gsap.set(path, {
            drawSVG: "0%",
            strokeWidth: 0,
            force3D: true,
          });
        } else {
          const len = path.getTotalLength ? path.getTotalLength() : 1500;
          path.style.strokeDasharray = `${len}`;
          path.style.strokeDashoffset = `${len}`;
          gsap.set(path, { strokeWidth: 0, force3D: true });
        }
      });
    }

    // -------------------------------------------------------------
    // 5. Build Master Hero Timeline (0.75x Speed matching Labib original)
    // -------------------------------------------------------------
    const heroTl = gsap
      .timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      })
      .timeScale(0.75);

    // A. Line-by-Line Heading Entrance (Exact original parameters)
    if (linesList.length) {
      heroTl.to(
        linesList,
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "back.out(1.4)",
          force3D: true,
        },
        0
      );
    }

    const totalLinesTime = linesList.length
      ? linesList.length * 0.12 + 0.5
      : 1.2;

    // B. Animate Pills – shell pops in, inner text slides up from mask
    pills.forEach((pill, i) => {
      const pillStart =
        0.2 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.7;

      const pillTextEl = pill.querySelector<HTMLElement>(".hero-pill-text");

      // Phase 1: Pill shell appears (scale + y)
      heroTl.to(
        pill,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(2.5)",
          force3D: true,
        },
        pillStart
      );

      // Phase 2: Inner text slides up from behind mask
      if (pillTextEl) {
        heroTl.to(
          pillTextEl,
          {
            y: "0%",
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
            force3D: true,
          },
          pillStart + 0.15
        );
      }
    });

    // C. Animate Hero SVG Paths (drawSVG 0% -> 100% & strokeWidth 0 -> original)
    if (pathData.length) {
      pathData.forEach((item, pIdx) => {
        const startTime = totalLinesTime * 0.4 + pIdx * 0.15;

        if (hasDrawSVG) {
          heroTl
            .to(
              item.path,
              {
                drawSVG: "100%",
                duration: 0.9,
                ease: "power2.out",
                force3D: true,
              },
              startTime
            )
            .to(
              item.path,
              {
                strokeWidth: item.originalStrokeWidth,
                duration: 0.9,
                ease: "power2.out",
                force3D: true,
              },
              startTime
            );
        } else {
          heroTl
            .to(
              item.path,
              {
                strokeDashoffset: 0,
                duration: 0.9,
                ease: "power2.out",
                force3D: true,
              },
              startTime
            )
            .to(
              item.path,
              {
                strokeWidth: item.originalStrokeWidth,
                duration: 0.9,
                ease: "power2.out",
                force3D: true,
              },
              startTime
            );
        }
      });
    }

    // Play hero timeline smoothly when loader completes
    let heroPlayed = false;
    const playHero = () => {
      if (heroPlayed) return;
      heroPlayed = true;
      heroTl.play();
    };

    if ((window as any).__two26LoaderDone) {
      playHero();
    } else {
      document.addEventListener("two26:loaderComplete", playHero, { once: true });
      if ((window as any).__two26LoaderDone) playHero();
      setTimeout(playHero, 6000);
    }

    return () => {
      document.removeEventListener("two26:loaderComplete", playHero);
      heroTl.kill();
    };
  }, []);

  return (
    <section ref={heroRef} className="section-hero">
      <div className="hero-section-html w-embed w-script">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Prevent FOUC: Elements start invisible until GSAP initializes */
              .section-hero .hero-text h1,
              .section-hero .hero-text .heading,
              .section-hero [data-hero-heading],
              .section-hero h1 {
                opacity: 0;
              }

              .section-hero .hero-pill {
                opacity: 0;
                will-change: transform, opacity;
              }

              /* Pill text mask: clips inner text for slide-up reveal */
              .section-hero .hero-pill .hero-pill-text,
              .section-hero .hero-pill [class*="pill-text"],
              .section-hero .hero-pill [class*="pill-label"] {
                display: block;
                will-change: transform, opacity;
              }

              .section-hero .hero-pill-text-mask {
                overflow: hidden;
                display: block;
              }

              .section-hero .hero-path-svg-left svg,
              .section-hero .hero-path-svg-right svg {
                overflow: visible;
              }

              /* Line-by-line heading mask: matching Labib original */
              .hero-line-mask {
                display: block !important;
                overflow: hidden !important;
              }

              .hero-line {
                display: block !important;
                will-change: transform, opacity;
              }
            `,
          }}
        />
      </div>

      <div className="section-hero-wrapper">
        {/* Main Headline & Floating Tilted Pills */}
        <div className="hero-text">
          {/* Pill 2: Web Development (Top-Center, rotated 3deg) */}
          <div className="hero-pill two">
            <span className="hero-pill-text-mask">
              <div className="hero-pill-text">Web Development</div>
            </span>
          </div>

          {/* Massive Orange MDNichrome Headline */}
          <h1 className="heading" aria-label="BUILDING DIGITAL SYSTEMS">
            <span className="hero-line-mask">
              <span className="hero-line">BUILDING </span>
            </span>
            <span className="hero-line-mask">
              <span className="hero-line">DIGITAL SYSTEMS</span>
            </span>
          </h1>

          {/* Pill 1: Custom Automations (Left, rotated -7deg) */}
          <div className="hero-pill one">
            <span className="hero-pill-text-mask">
              <div className="hero-pill-text">Custom Automations</div>
            </span>
          </div>

          {/* Pill 3: Frontend Engineering (Right-Bottom, rotated -5deg) */}
          <div className="hero-pill three">
            <span className="hero-pill-text-mask">
              <div className="hero-pill-text">Frontend Engineering</div>
            </span>
          </div>
        </div>

        {/* Characters Walking Placards Animation Loop Video */}
        <div className="hero-video-loop">
          <div
            data-poster-url="https://cdn.prod.website-files.com/6a7d9d7d7c99784ba2cac874%2F6a7db9b17a581584f4171aad_Hero_poster.0000000.jpg"
            data-video-urls="https://cdn.prod.website-files.com/6aaad679fdb9d914f7f52049/6aaad679fdb9d914f7f52055_Hero_mp4.mp4,https://cdn.prod.website-files.com/6aaad679fdb9d914f7f52049/6aaad679fdb9d914f7f52055_Hero_webm.webm"
            data-autoplay="true"
            data-loop="true"
            data-wf-ignore="true"
            className="hero-video-bg w-background-video w-background-video-atom"
          >
            <video
              ref={videoRef}
              id="7f45afaa-86d9-d987-a52e-38c360855190-video"
              autoPlay
              loop
              style={{
                backgroundImage:
                  'url("https://cdn.prod.website-files.com/6a7d9d7d7c99784ba2cac874%2F6a7db9b17a581584f4171aad_Hero_poster.0000000.jpg")',
              }}
              muted
              playsInline
              data-wf-ignore="true"
              data-object-fit="cover"
            >
              <source
                src="/cdn-assets/6aaad679fdb9d914f7f52055_Hero_mp4.mp4"
                data-wf-ignore="true"
              />
              <source
                src="/cdn-assets/6aaad679fdb9d914f7f52055_Hero_webm.webm"
                data-wf-ignore="true"
              />
            </video>
          </div>
        </div>

        {/* Decorative Left Orange Path SVG Loop */}
        <div className="hero-path-svg-left">
          <div className="code-embed-3 w-embed">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 229 599"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M33.502 584.112C104.502 557.112 147.911 474.964 143.002 393.612C139.502 335.612 106.002 281.612 59.0025 252.612C7.82072 221.032 -4.20053 385.572 52.5031 405.612C140.218 436.612 225.002 369.112 212.002 252.612C208.376 220.111 192.539 178.612 152.002 121.612C117.866 73.6124 42.0029 11.6124 42.0029 11.6124"
                stroke="#FF5400"
                strokeWidth="30"
              />
            </svg>
          </div>
        </div>

        {/* Decorative Right Orange Path SVG Loop */}
        <div className="hero-path-svg-right">
          <div className="code-embed-2 w-embed">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 354 487"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M250.687 12.2982C192.69 52.7982 114.69 199.814 245.687 315.798C376.684 431.783 364.19 140.889 235.187 83.2982C153.19 46.6926 54.8365 106.798 30.1893 172.298C-59.5565 410.798 277.687 471.798 277.687 471.798"
                stroke="#FF5400"
                strokeWidth="30"
              />
            </svg>
          </div>
        </div>

        {/* Iconic Curved Orange Arch Ribbon Marquee */}
        <HeroMarquee />
      </div>
    </section>
  );
}
