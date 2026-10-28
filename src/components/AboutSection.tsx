"use client";

import React, { useEffect, useRef } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let ctx: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const setupTimeline = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      if (!gsap || !ScrollTrigger) {
        timeoutId = setTimeout(setupTimeline, 50);
        return;
      }

      const section = sectionRef.current;
      const para = paraRef.current;
      if (!section || !para) return;

      // Kill any old ScrollTrigger instances on this section to prevent duplicates
      ScrollTrigger.getAll().forEach((t: any) => {
        if (t.trigger === section || t.pin === section) {
          t.kill();
        }
      });

      // Split text into characters wrapped in words to preserve line-breaks
      const rawText =
        "I am LABIB FOHAYER, a Web Designer, Developer & AI Automation Engineer. I bridge the gap between creative design and intelligent automation to engineer high-performance websites and scalable business systems.";

      // Clear existing content and build word-by-word, character-by-character structure
      para.innerHTML = "";
      const words = rawText.split(" ");
      const charElements: HTMLSpanElement[] = [];

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "about-word";
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";
        wordSpan.style.contain = "layout style";
        if (word === "LABIB" || word === "FOHAYER,") {
          wordSpan.style.fontWeight = "700";
          wordSpan.style.fontFamily = 'var(--font-primary, "MDNichrome", serif)';
        }

        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement("span");
          charSpan.className = "about-char";
          charSpan.style.display = "inline-block";
          charSpan.style.transform = "translateZ(0)";
          charSpan.style.willChange = "transform, color";
          charSpan.style.backfaceVisibility = "hidden";
          charSpan.textContent = word[i];
          wordSpan.appendChild(charSpan);
          charElements.push(charSpan);
        }

        para.appendChild(wordSpan);

        // Add space after word (except last word)
        if (wIdx < words.length - 1) {
          const spaceSpan = document.createElement("span");
          spaceSpan.className = "about-char about-space";
          spaceSpan.style.display = "inline-block";
          spaceSpan.innerHTML = "&nbsp;";
          para.appendChild(spaceSpan);
          charElements.push(spaceSpan);
        }
      });

      if (!charElements.length) return;

      const pills = Array.from(section.querySelectorAll(".about-pill")) as HTMLElement[];

      // Prevent mobile address-bar resize jumps
      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 769px)
      // 100% EXACT EXISTING CODE - UNTOUCHED
      // ==========================================
      mm.add("(min-width: 769px)", () => {
        // 1. Hardware acceleration & anti-blur on pinned container
        gsap.set(section, {
          willChange: "transform",
          backfaceVisibility: "hidden",
          force3D: true,
        });

        // 2. Set Initial State for all characters: Pale peach/orange
        gsap.set(charElements, {
          color: "rgba(255, 84, 0, 0.45)",
          scale: 1,
          rotation: 0,
          display: "inline-block",
          transformOrigin: "center center",
          textShadow: "0px 0px 0px rgba(255,84,0,0)",
          willChange: "transform, color",
          backfaceVisibility: "hidden",
        });

        // 3. Set Initial State for pills: Hidden, scaled down, shifted down
        if (pills.length) {
          gsap.set(pills, {
            opacity: 0,
            scale: 0.6,
            y: 24,
            transformOrigin: "center center",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          });
        }

        // Responsive scroll distance calculation matching Labib original authentic values
        const getPinDistance = () => {
          const width = typeof window !== "undefined" ? window.innerWidth : 1440;
          if (width < 480) return 1150; // Mobile (< 480px)
          if (width < 992) return 1550; // Tablet (< 992px)
          return 2200; // Desktop
        };

        const scrollerEl = document.querySelector(".page") || window;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

        // 4. Create Responsive Scrubbed Pinned Timeline (GPU transform pinning for 100% stable jitter-free scroll)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: scrollerEl,
            start: "top top",
            end: () => `+=${getPinDistance()}`,
            pin: section,
            pinSpacing: true,
            pinType: "transform",
            scrub: isMobile ? 0.35 : 0.8,
            anticipatePin: 0,
            fastScrollEnd: true,
            preventOverlaps: true,
            invalidateOnRefresh: false,
          },
        });

        const totalChars = charElements.length;
        const letterAnimSpan = 85;
        const FIXED_TILTS = [-2.8, 3.2, -1.9, 2.6, -3.1, 1.8, -2.4, 3.1];

        charElements.forEach((char, i) => {
          const startTime = (i / totalChars) * letterAnimSpan;
          const tilt = FIXED_TILTS[i % FIXED_TILTS.length];

          // Stage 1: Scale 1.12, Fixed authentic tilt, Thick glowing #FF5400
          tl.to(
            char,
            {
              color: "#FF5400",
              scale: 1.12,
              rotation: tilt,
              textShadow:
                "0.6px 0.6px 0 #FF5400, -0.6px -0.6px 0 #FF5400, 0.6px -0.6px 0 #FF5400, -0.6px 0.6px 0 #FF5400",
              duration: 3.5,
              ease: "power1.out",
              force3D: true,
            },
            startTime
          );

          // Stage 2: Settle to normal scale 1, 0 deg, clean black #000000
          tl.to(
            char,
            {
              color: "#000000",
              scale: 1,
              rotation: 0,
              textShadow: "0px 0px 0px rgba(0,0,0,0)",
              duration: 3.5,
              ease: "power1.inOut",
              force3D: true,
            },
            startTime + 3.5
          );
        });

        // 5. Pop-in Pills at milestones
        if (pills[0]) {
          tl.to(
            pills[0],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: "back.out(2)",
            },
            35
          );
        }

        if (pills[1]) {
          tl.to(
            pills[1],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: "back.out(2)",
            },
            72
          );
        }

        if (pills[2]) {
          tl.to(
            pills[2],
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 6,
              ease: "back.out(2)",
            },
            96
          );
        }
      });

      // ==========================================
      // MOBILE: (max-width: 768px)
      // 100% JITTER-FREE NO-SCRUB LOGIC
      // ==========================================
      mm.add("(max-width: 768px)", () => {
        // 1. Force hardware acceleration on mobile animation wrappers
        const wrappers = [
          section,
          section.querySelector(".section-about-wrapper"),
          section.querySelector(".about-pinned"),
          section.querySelector(".about-split-container"),
          section.querySelector(".about-text-col"),
          para,
        ];
        wrappers.forEach((el) => {
          if (el) {
            gsap.set(el, {
              willChange: "transform, opacity",
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              force3D: true,
            });
          }
        });

        section.querySelectorAll(".about-word").forEach((w) => {
          gsap.set(w, {
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
            force3D: true,
          });
        });

        // 2. Set Initial State for mobile characters: Stable, fixed scale 1, no rotation, no heavy textShadow
        gsap.set(charElements, {
          color: "rgba(255, 84, 0, 0.45)",
          scale: 1,
          rotation: 0,
          display: "inline-block",
          transformOrigin: "center center",
          textShadow: "none",
          willChange: "color",
          backfaceVisibility: "hidden",
        });

        // 3. Set Initial State for pills: Hidden, shifted down
        if (pills.length) {
          gsap.set(pills, {
            opacity: 0,
            scale: 0.8,
            y: 20,
            transformOrigin: "center center",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          });
        }

        const scrollerEl = document.querySelector(".page") || window;

        // 4. Create Mobile Self-Running Timeline (NO SCRUB, NO PINNING LAG)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: scrollerEl,
            start: "top 75%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: false,
          },
        });

        // Glowing orange wave reveal into solid black
        tl.to(
          charElements,
          {
            color: "#FF5400",
            duration: 0.25,
            stagger: 0.008,
            ease: "power1.out",
          },
          0
        );

        tl.to(
          charElements,
          {
            color: "#000000",
            duration: 0.35,
            stagger: 0.008,
            ease: "power1.inOut",
          },
          0.15
        );

        // 5. Pop-in Pills smoothly
        if (pills.length) {
          tl.to(
            pills,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "back.out(1.7)",
            },
            0.4
          );
        }
      });

      // Refresh ScrollTrigger to ensure pin start/end are exact
      ScrollTrigger.refresh();
      if ((window as any).lenis) {
        (window as any).lenis.resize();
      }

      ctx = {
        kill: () => {
          mm.revert();
          ScrollTrigger.getAll().forEach((t: any) => {
            if (t.trigger === section || t.pin === section) {
              t.kill();
            }
          });
        },
      };
    };

    // Small delay to ensure Lenis scrollerProxy has registered
    timeoutId = setTimeout(setupTimeline, 150);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ctx && typeof ctx.kill === "function") {
        ctx.kill();
      }
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-about">
      <div className="section-about-wrapper">
        <div className="about-pinned">
          <div className="about-text">A BIT ABOUT ME</div>
          <div className="about-split-container">
            <div className="about-image-col">
              <img
                src="/images/labib-fohayer.png"
                alt="Labib Fohayer"
                className="about-portrait-img"
              />
            </div>
            <div className="about-text-col">
              <p
                ref={paraRef}
                className="about-para about-para-split"
                aria-label="I am LABIB FOHAYER, a Web Designer, Developer & AI Automation Engineer. I bridge the gap between creative design and intelligent automation to engineer high-performance websites and scalable business systems."
              >
                I am LABIB FOHAYER, a Web Designer, Developer &amp; AI Automation
                Engineer. I bridge the gap between creative design and
                intelligent automation to engineer high-performance websites and
                scalable business systems.
              </p>
            </div>
          </div>
          <div className="about-pill second">
            <div className="hero-pill-text">Workflow Optimizer</div>
          </div>
          <div className="about-pill third">
            <div className="hero-pill-text">Bug Hunter</div>
          </div>
        </div>
      </div>
    </section>
  );
}
