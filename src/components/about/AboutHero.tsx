"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

interface TeamMember {
  id: string;
  name: string;
  heading: React.ReactNode;
  image: string;
  paragraphs: string[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "full-stack-engineer",
    name: "Full-Stack & AI Engineer",
    heading: "FULL-STACK & AI ENGINEER",
    image: "/images/about/labib-fohayer-outdoor.jpg",
    paragraphs: [
      "A dedicated engineer with deep expertise in modern web technologies, including React, Tailwind CSS, and robust full-stack architectures. I write clean, efficient code that powers high-performance digital products.",
      "My true edge lies in AI integration. By deploying intelligent chatbots and custom n8n workflows, I automate complex business processes, turning manual tasks into streamlined, time-saving systems.",
    ],
  },
  {
    id: "founder-ceo",
    name: "Founder & CEO, Webpulse Automation",
    heading: (
      <>
        FOUNDER &amp; CEO,
        <br />
        WEBPULSE AUTOMATION
      </>
    ),
    image: "/images/about/labib-fohayer.jpg",
    paragraphs: [
      "Leading a modern tech agency with a vision to transform how businesses operate digitally. I oversee the strategic direction of Webpulse Automation, ensuring every project delivers measurable ROI and seamless user experiences.",
      "Beyond just building websites, I focus on architecting complete digital ecosystems. My goal is to empower brands with scalable solutions and smart automations that drive long-term business success.",
    ],
  },
  {
    id: "ecommerce-entrepreneur",
    name: "E-Commerce Entrepreneur",
    heading: "E-COMMERCE ENTREPRENEUR",
    image: "/images/about/labib-fohayer-purple.jpg",
    paragraphs: [
      "Founder and operator of Ponyopuri, an online retail brand. Building and scaling my own e-commerce business provided firsthand experience in digital marketing, customer acquisition, and operations.",
      "This entrepreneurial background gives me a unique advantage. I don't just write code; I understand the business mechanics behind it. Every solution I create is designed with a strict focus on sales growth and market impact.",
    ],
  },
];

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const heroPathRef = useRef<SVGPathElement>(null);
  const storyPathRef = useRef<SVGPathElement>(null);

  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [mounted, setMounted] = useState(false);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const lastClickedCardRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Hero Entrance Motion (Headings, Kinetic Pills, Hero SVG Loop, Illustration, Paragraphs)
  useEffect(() => {
    const heroSection = sectionRef.current;
    if (!heroSection) return;

    const SplitText = (window as any).SplitText;
    const DrawSVGPlugin = (window as any).DrawSVGPlugin;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (SplitText) gsap.registerPlugin(SplitText);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const headings = Array.from(
      heroSection.querySelectorAll(
        ".about-hero-text h1, .about-hero-text .heading",
      ),
    ) as HTMLElement[];

    const pills = Array.from(
      heroSection.querySelectorAll(".work-hero-pill"),
    ) as HTMLElement[];

    const heroPath = heroPathRef.current;

    const svgIllustration = heroSection.querySelector(
      ".about-hero-svg-wrapper",
    ) as HTMLElement;

    const paras = Array.from(
      heroSection.querySelectorAll(".about-hero-para"),
    ) as HTMLElement[];

    // Line-by-line heading splitting inside overflow-hidden masks
    let allHeadingLines: HTMLElement[] = [];
    headings.forEach((heading) => {
      let lines: HTMLElement[] = [];
      if (SplitText) {
        const split = new SplitText(heading, {
          type: "lines",
          linesClass: "about-hero-line",
        });
        split.lines.forEach((line: HTMLElement) => {
          const mask = document.createElement("span");
          mask.className = "about-hero-line-mask";
          mask.style.display = "block";
          mask.style.overflow = "hidden";
          line.parentNode?.insertBefore(mask, line);
          mask.appendChild(line);
        });
        lines = split.lines;
      } else {
        const rawText = heading.textContent?.trim() || "";
        heading.innerHTML = `<span class="about-hero-line-mask"><span class="about-hero-line">${rawText}</span></span>`;
        lines = Array.from(heading.querySelectorAll(".about-hero-line"));
      }

      gsap.set(heading, { opacity: 1 });
      gsap.set(lines, { y: "115%", opacity: 0, display: "block" });
      allHeadingLines = allHeadingLines.concat(lines);
    });

    // Kinetic pills setup
    pills.forEach((pill) => {
      gsap.set(pill, {
        opacity: 0,
        scale: 0.4,
        y: 20,
        transformOrigin: "center center",
      });

      const pillTextEl = pill.querySelector(".hero-pill-text") as HTMLElement;
      if (pillTextEl && !pillTextEl.closest(".about-hero-pill-text-mask")) {
        const mask = document.createElement("span");
        mask.className = "about-hero-pill-text-mask";
        mask.style.overflow = "hidden";
        mask.style.display = "block";
        pillTextEl.parentNode?.insertBefore(mask, pillTextEl);
        mask.appendChild(pillTextEl);
        gsap.set(pillTextEl, { y: "105%", opacity: 0 });
      }
    });

    // Orange curved path setup
    let originalHeroStroke = 30;
    if (heroPath) {
      heroPath.style.strokeLinecap = "round";
      heroPath.style.strokeLinejoin = "round";
      originalHeroStroke =
        parseFloat(heroPath.getAttribute("stroke-width") || "30") || 30;

      if (DrawSVGPlugin) {
        gsap.set(heroPath, { drawSVG: "0%", strokeWidth: 0 });
      } else {
        const len = heroPath.getTotalLength ? heroPath.getTotalLength() : 1500;
        heroPath.style.strokeDasharray = `${len}`;
        heroPath.style.strokeDashoffset = `${len}`;
        gsap.set(heroPath, { strokeWidth: 0 });
      }
    }

    // Illustration pop setup
    if (svgIllustration) {
      gsap.set(svgIllustration, {
        opacity: 0,
        scale: 0.65,
        rotation: -6,
        transformOrigin: "center center",
      });
    }

    // Paragraph lines masked setup
    let allParaLines: HTMLElement[] = [];
    paras.forEach((p) => {
      let lines: HTMLElement[] = [];
      if (SplitText) {
        const split = new SplitText(p, {
          type: "lines",
          linesClass: "about-hero-para-line",
        });
        split.lines.forEach((line: HTMLElement) => {
          const mask = document.createElement("span");
          mask.className = "about-hero-line-mask";
          mask.style.display = "block";
          mask.style.overflow = "hidden";
          line.parentNode?.insertBefore(mask, line);
          mask.appendChild(line);
        });
        lines = split.lines;
      } else {
        const raw = p.innerHTML.trim();
        p.innerHTML = `<span class="about-hero-line-mask"><span class="about-hero-para-line">${raw}</span></span>`;
        lines = Array.from(p.querySelectorAll(".about-hero-para-line"));
      }
      gsap.set(p, { opacity: 1 });
      gsap.set(lines, { y: "115%", opacity: 0, display: "block" });
      allParaLines = allParaLines.concat(lines);
    });

    // Master About Hero Timeline
    const heroTl = gsap
      .timeline({ paused: true, defaults: { ease: "power2.out" } })
      .timeScale(0.75);

    // A. Headings reveal
    if (allHeadingLines.length) {
      heroTl.to(
        allHeadingLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
        0,
      );
    }

    const totalLinesTime = allHeadingLines.length
      ? allHeadingLines.length * 0.12 + 0.5
      : 1.2;

    // B. Kinetic Pills pop & inner text slide-up
    const pillPercents = [0.25, 0.5];
    pills.forEach((pill, i) => {
      const pillStart = totalLinesTime * (pillPercents[i] || 0.35);
      const pillTextEl = pill.querySelector(".hero-pill-text") as HTMLElement;

      heroTl.to(
        pill,
        { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(2.5)" },
        pillStart,
      );

      if (pillTextEl) {
        heroTl.to(
          pillTextEl,
          { y: "0%", opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
          pillStart + 0.15,
        );
      }
    });

    // C. Orange curved loop path draw
    if (heroPath) {
      const pathStart = totalLinesTime * 0.35;
      if (DrawSVGPlugin) {
        heroTl
          .to(heroPath, { drawSVG: "100%", duration: 0.9, ease: "power2.out" }, pathStart)
          .to(heroPath, { strokeWidth: originalHeroStroke, duration: 0.9, ease: "power2.out" }, pathStart);
      } else {
        heroTl
          .to(heroPath, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }, pathStart)
          .to(heroPath, { strokeWidth: originalHeroStroke, duration: 0.9, ease: "power2.out" }, pathStart);
      }
    }

    // D. Illustration pop
    if (svgIllustration) {
      heroTl.to(
        svgIllustration,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.85,
          ease: "back.out(2.2)",
        },
        totalLinesTime * 0.45,
      );
    }

    // E. Paragraph lines reveal
    if (allParaLines.length) {
      heroTl.to(
        allParaLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        totalLinesTime * 0.5,
      );
    }

    // Play hero timeline smoothly
    const startHero = () => {
      heroTl.play();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startHero);
    } else {
      setTimeout(startHero, 150);
    }

    return () => {
      heroTl.kill();
    };
  }, []);

  // 2. Continuous SVG Path Scroll Scrub & Screen Orange Flood Blast
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const container = section.querySelector(".about-story-team") as HTMLElement;
    const storyPath = storyPathRef.current;
    const storyTeamWrapper = section.querySelector(".about-story-team-wrapper") as HTMLElement;
    if (!container || !storyPath) return;

    const ScrollTrigger = (window as any).ScrollTrigger;
    const DrawSVGPlugin = (window as any).DrawSVGPlugin;
    const SplitText = (window as any).SplitText;
    if (!ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
    if (SplitText) gsap.registerPlugin(SplitText);

    // Dynamic scroller resolution (.page Lenis container or window)
    const scrollerEl = (document.querySelector(".page") as HTMLElement) || window;

    const getBaseStrokeWidth = () => {
      const w = window.innerWidth;
      if (w < 768) return 50;
      if (w < 992) return 75;
      return 100;
    };

    storyPath.style.strokeLinecap = "round";
    storyPath.style.strokeLinejoin = "round";
    const baseWidth = getBaseStrokeWidth();
    const isMobile = window.innerWidth < 768;

    // Initial state: Circular dot always visible at origin
    const pathLength = storyPath.getTotalLength ? storyPath.getTotalLength() : 3500;
    if (DrawSVGPlugin) {
      gsap.set(storyPath, {
        drawSVG: "0% 0.1%",
        strokeWidth: baseWidth,
      });
    } else {
      storyPath.style.strokeDasharray = `${baseWidth * 0.1} ${pathLength}`;
      storyPath.style.strokeDashoffset = "0";
      gsap.set(storyPath, { strokeWidth: baseWidth });
    }

    // TWEEN 1: PATH DRAW PROGRESS TIMELINE
    const drawTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller: scrollerEl,
        start: "top 80%",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    const drawKeyframes = isMobile
      ? [
          { drawSVG: "0% 55%", duration: 0.05, ease: "power1.out" },
          { drawSVG: "0% 90%", duration: 0.07, ease: "power1.inOut" },
          { drawSVG: "0% 100%", duration: 0.03, ease: "power1.out" },
        ]
      : [
          { drawSVG: "0% 25%", duration: 0.08, ease: "power1.out" }, // 1. Reaches "Two '90s kids, one shared..."
          { drawSVG: "0% 88%", duration: 0.12, ease: "power2.in" },  // 2. Swirls in S-curve to "Less size, more scope"
          { drawSVG: "0% 100%", duration: 0.05, ease: "power1.out" }, // 3. Reaches end
        ];

    if (DrawSVGPlugin) {
      drawTl.to(storyPath, { keyframes: drawKeyframes }, 0);
      drawTl.to({}, { duration: isMobile ? 0.17 : 0.07 }, isMobile ? 0.15 : 0.25);
    } else {
      const fallbackKeyframes = isMobile
        ? [
            { strokeDasharray: `${pathLength * 0.55} ${pathLength}`, duration: 0.05, ease: "power1.out" },
            { strokeDasharray: `${pathLength * 0.9} ${pathLength}`, duration: 0.07, ease: "power1.inOut" },
            { strokeDasharray: `${pathLength} ${pathLength}`, duration: 0.03, ease: "power1.out" },
          ]
        : [
            { strokeDasharray: `${pathLength * 0.25} ${pathLength}`, duration: 0.08, ease: "power1.out" },
            { strokeDasharray: `${pathLength * 0.88} ${pathLength}`, duration: 0.12, ease: "power2.in" },
            { strokeDasharray: `${pathLength} ${pathLength}`, duration: 0.05, ease: "power1.out" },
          ];
      drawTl.to(storyPath, { keyframes: fallbackKeyframes }, 0);
      drawTl.to({}, { duration: isMobile ? 0.17 : 0.07 }, isMobile ? 0.15 : 0.25);
    }

    // TWEEN 2: STROKE WIDTH EXPANSION (BLAST TO 2500px) & SCREEN FLOOD
    const floodTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scroller: scrollerEl,
        start: "top 80%",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    const floodStart = isMobile ? 0.1 : 0.2;
    const floodDuration = isMobile ? 0.03 : 0.05;
    const bgDuration = isMobile ? 0.06 : 0.1;

    // 💥 Blast: strokeWidth shoots to 2500px to fill the entire container
    floodTl.to(
      storyPath,
      {
        strokeWidth: 2500,
        duration: floodDuration,
        ease: "power2.inOut",
      },
      floodStart,
    );

    // 🎨 Flood: background color of .about-story-team-wrapper seamlessly turns solid #FF5400
    if (storyTeamWrapper) {
      floodTl.fromTo(
        storyTeamWrapper,
        {
          backgroundColor: "rgba(255, 84, 0, 0)",
        },
        {
          backgroundColor: "rgba(255, 84, 0, 1)",
          duration: bgDuration,
          ease: "power2.inOut",
        },
        floodStart,
      );
    }

    floodTl.to(
      {},
      { duration: 0.32 - (floodStart + bgDuration) },
      floodStart + bgDuration,
    );

    // 3. Story Sections Content Reveals (Masked text lines & bouncy SVGs)
    const storySections = Array.from(
      section.querySelectorAll(".about-story-section"),
    ) as HTMLElement[];

    const storyCleanups: (() => void)[] = [];

    storySections.forEach((storySec, idx) => {
      const svgWrap = storySec.querySelector(".about-story-svg-wrap") as HTMLElement;
      const tagText = storySec.querySelector(".about-story-text") as HTMLElement;
      const heading = storySec.querySelector(".about-story-heading") as HTMLElement;
      const para = storySec.querySelector(".about-story-para") as HTMLElement;

      // Initial state
      const randomTilt = idx % 2 === 0 ? -6 : 6;
      if (svgWrap) {
        gsap.set(svgWrap, {
          opacity: 0,
          scale: 0.65,
          rotation: randomTilt,
          transformOrigin: "center center",
        });
      }

      if (tagText) {
        gsap.set(tagText, { opacity: 0, y: 16 });
      }

      // Split heading into masked lines
      let hLines: HTMLElement[] = [];
      if (heading) {
        if (SplitText) {
          const splitH = new SplitText(heading, {
            type: "lines",
            linesClass: "about-story-line",
          });
          splitH.lines.forEach((line: HTMLElement) => {
            const mask = document.createElement("span");
            mask.className = "about-story-line-mask";
            line.parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
          });
          hLines = splitH.lines;
        } else {
          const raw = heading.innerHTML.trim();
          heading.innerHTML = `<span class="about-story-line-mask"><span class="about-story-line">${raw}</span></span>`;
          hLines = Array.from(heading.querySelectorAll(".about-story-line"));
        }
        gsap.set(hLines, { y: "115%", opacity: 0 });
      }

      // Split paragraph into masked lines
      let pLines: HTMLElement[] = [];
      if (para) {
        if (SplitText) {
          const splitP = new SplitText(para, {
            type: "lines",
            linesClass: "about-story-line",
          });
          splitP.lines.forEach((line: HTMLElement) => {
            const mask = document.createElement("span");
            mask.className = "about-story-line-mask";
            line.parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
          });
          pLines = splitP.lines;
        } else {
          const raw = para.innerHTML.trim();
          para.innerHTML = `<span class="about-story-line-mask"><span class="about-story-line">${raw}</span></span>`;
          pLines = Array.from(para.querySelectorAll(".about-story-line"));
        }
        gsap.set(pLines, { y: "115%", opacity: 0 });
      }

      const secTl = gsap.timeline({
        scrollTrigger: {
          trigger: storySec,
          scroller: scrollerEl,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      if (tagText) {
        secTl.to(tagText, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0);
      }

      if (hLines.length) {
        secTl.to(
          hLines,
          { y: "0%", opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(1.7)" },
          0.05,
        );
      }

      if (pLines.length) {
        secTl.to(
          pLines,
          { y: "0%", opacity: 1, duration: 0.65, stagger: 0.06, ease: "power2.out" },
          0.15,
        );
      }

      if (svgWrap) {
        secTl.to(
          svgWrap,
          { opacity: 1, scale: 1, rotation: 0, duration: 0.85, ease: "back.out(2.2)" },
          0.1,
        );
      }

      storyCleanups.push(() => {
        secTl.kill();
      });
    });

    // 4. Team Section Header & Staggered Cards Reveal
    const teamSection = section.querySelector(".about-team") as HTMLElement;
    let teamTl: gsap.core.Timeline | null = null;
    if (teamSection) {
      const teamCards = Array.from(teamSection.querySelectorAll(".team-card")) as HTMLElement[];
      const teamHeader = teamSection.querySelector(".section-projects-header") as HTMLElement;

      teamTl = gsap.timeline({
        scrollTrigger: {
          trigger: teamSection,
          scroller: scrollerEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      if (teamHeader) {
        teamTl.fromTo(
          teamHeader,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0,
        );
      }

      if (teamCards.length) {
        teamTl.fromTo(
          teamCards,
          { opacity: 0, y: 50, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "back.out(1.8)",
          },
          0.1,
        );
      }
    }

    return () => {
      drawTl.kill();
      floodTl.kill();
      if (teamTl) teamTl.kill();
      storyCleanups.forEach((fn) => fn());
    };
  }, []);

  // 3. Team Member Interactive Expanding Popup Bio Modal
  const openModal = (member: TeamMember, e: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = e.currentTarget;
    lastClickedCardRect.current = cardEl.getBoundingClientRect();
    setActiveMember(member);
  };

  useEffect(() => {
    if (!activeMember) return;

    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }

    const overlay = modalOverlayRef.current;
    const card = modalCardRef.current;
    if (!overlay || !card) return;

    overlay.style.display = "flex";
    gsap.set(overlay, { opacity: 1 });

    const sourceRect = lastClickedCardRect.current;
    if (sourceRect) {
      const popupRect = card.getBoundingClientRect();
      const dx = sourceRect.left + sourceRect.width / 2 - (popupRect.left + popupRect.width / 2);
      const dy = sourceRect.top + sourceRect.height / 2 - (popupRect.top + popupRect.height / 2);
      const scaleX = Math.max(sourceRect.width / popupRect.width, 0.25);
      const scaleY = Math.max(sourceRect.height / popupRect.height, 0.25);

      gsap.fromTo(
        card,
        {
          x: dx,
          y: dy,
          scaleX: scaleX,
          scaleY: scaleY,
          opacity: 0.3,
          borderRadius: 24,
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          borderRadius: 24,
          duration: 0.5,
          ease: "back.out(1.4)",
        },
      );
    } else {
      gsap.fromTo(
        card,
        { scale: 0.85, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" },
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
    };
  }, [activeMember]);

  const closeModal = () => {
    if ((window as any).lenis) {
      (window as any).lenis.start();
    }
    const overlay = modalOverlayRef.current;
    const card = modalCardRef.current;
    if (!overlay || !card) {
      setActiveMember(null);
      return;
    }

    const sourceRect = lastClickedCardRect.current;
    if (sourceRect) {
      const popupRect = card.getBoundingClientRect();
      const dx = sourceRect.left + sourceRect.width / 2 - (popupRect.left + popupRect.width / 2);
      const dy = sourceRect.top + sourceRect.height / 2 - (popupRect.top + popupRect.height / 2);
      const scaleX = Math.max(sourceRect.width / popupRect.width, 0.25);
      const scaleY = Math.max(sourceRect.height / popupRect.height, 0.25);

      gsap.to(card, {
        x: dx,
        y: dy,
        scaleX: scaleX,
        scaleY: scaleY,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          overlay.style.display = "none";
          setActiveMember(null);
        },
      });
    } else {
      gsap.to(card, {
        scale: 0.85,
        opacity: 0,
        y: 20,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          overlay.style.display = "none";
          setActiveMember(null);
        },
      });
    }
  };

  return (
    <>
      <section className="section-about-hero" ref={sectionRef}>
        <div className="section-about-hero-wrapper">
          {/* Main Hero Headings & Floating Pills */}
          <div className="about-hero-text">
            <h1 className="heading left-align">One man army,</h1>
            <div className="work-hero-pill two">
              <div className="hero-pill-text">Web & AI Expert</div>
            </div>
            <h1 className="heading right-align less-max">big brand energy</h1>
            <div className="work-hero-pill one">
              <div className="hero-pill-text">Independent</div>
            </div>
          </div>

          {/* Hero Orange Curved Path SVG */}
          <div className="about-hero-path">
            <div className="code-embed-2 w-embed">
              <svg
                width="492"
                height="789"
                viewBox="0 0 492 789"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  ref={heroPathRef}
                  d="M346.027 773.963C346.027 773.963 123.155 751.726 37.5236 580.463C-5.47612 494.463 12.1589 403.856 98.5229 359.463C259.022 276.963 386.528 426.963 423.028 500.963C469.82 595.828 230.528 683.463 212.028 548.463C195.241 425.963 407.22 329.963 451.028 251.963C519.452 130.133 435.528 24.9629 380.528 15.9629C337.028 8.84469 282.028 42.1764 282.028 85.9629C282.028 142.463 359.528 181.463 359.528 181.463"
                  stroke="#FF5400"
                  strokeWidth="30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Bottom Illustration & Studio Intro Paragraph */}
          <div className="about-hero-btm">
            <div className="about-hero-svg-wrapper">
              <img
                src="/images/about/hero-profile.png"
                loading="lazy"
                alt="About Hero Illustration"
                className="about-hero-img"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="abput-para-wrapper">
              <p className="about-hero-para">
                Hi, I&apos;m Labib. Operating out of Dhaka, I specialize in crafting seamless web experiences and powerful AI automations that solve real business problems.
              </p>
            </div>
          </div>

          {/* About Story & Team Container with Background Continuous Path */}
          <div className="about-story-team">
            <div className="about-story-team-wrapper">
              {/* Story Sections */}
              <div className="about-story">
                <div className="about-story-section">
                  <div className="about-story-svg-wrap">
                    <img
                      src="/images/about/6aaad679fdb9d914f7f5206f_illustration_5.svg"
                      loading="lazy"
                      alt="How we started"
                      className="about-story-img"
                    />
                  </div>
                  <div className="about-story-right">
                    <div className="about-story-text">HOW I STARTED</div>
                    <h2 className="about-story-heading">
                      From E-commerce Founder to Tech Innovator.
                    </h2>
                    <p className="about-story-para">
                      My entry into the digital landscape began with founding and scaling my e-commerce brand, Ponyopuri. Navigating the complexities of business operations revealed the transformative potential of automation and modern web architectures. Driven to engineer smarter solutions, I mastered frontend development, full-stack systems, and AI automation at the As-Sunnah Skill Development Institute, Bangladesh&mdash;a pivotal shift that fundamentally redefined my approach to building digital enterprises.
                    </p>
                  </div>
                </div>

                <div className="about-story-section">
                  <div className="about-story-right about-story-now-im-here">
                    <div className="about-story-text">NOW I'M HERE</div>
                    <h2 className="about-story-heading">
                      Founder &amp; CEO of Webpulse Automation.
                    </h2>
                    <p className="about-story-para">
                      As the Founder and CEO of Webpulse Automation, I go beyond building beautiful interfaces&mdash;I architect comprehensive digital ecosystems. Utilizing React, Tailwind, and full-stack technologies, I deliver scalable web solutions. Furthermore, I integrate intelligent AI chatbots and custom n8n workflows designed to optimize operations and drive business growth. My mission is straightforward: to empower your business to work smarter through the strategic application of technology.
                    </p>
                  </div>
                  <div className="about-story-svg-wrap">
                    <img
                      src="/images/about/6aaad679fdb9d914f7f5206a_chair.svg"
                      loading="lazy"
                      alt="Now we're here"
                      className="about-story-img"
                    />
                  </div>
                </div>
              </div>

              {/* Team Showcase */}
              <div className="about-team">
                <div className="section-projects-header">
                  <div className="section-about-text white">THE FOUNDER</div>
                  <div className="section-heading-wrapper">
                    <h2 className="section-heading white">THE MAN BEHIND THE MAGIC.</h2>
                  </div>
                </div>

                <div className="about-team-btm">
                  {TEAM_MEMBERS.map((member) => (
                    <div
                      key={member.id}
                      className="team-card cursor-pointer"
                      onClick={(e) => openModal(member, e)}
                    >
                      <div className="team-img-wrapper">
                        <img
                          src={member.image}
                          loading="lazy"
                          alt={member.name}
                          className="team-img"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="texture-bg"></div>
              </div>
            </div>

            {/* Huge Continuous Scrub SVG Path (1440x3457) */}
            <div className="about-story-scroll-path">
              <div className="about-story-svg w-embed">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1440 3457"
                  fill="none"
                  overflow="visible"
                  style={{ overflow: "visible" }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    ref={storyPathRef}
                    d="M723.846 50.0081C650.835 174.483 836.793 262.47 825.385 406.936C799.653 732.805 98.5142 598.392 111.169 948.003C123.495 1288.51 1122.55 1135.95 1155.5 1698.51C1177.93 2081.41 570.052 2505.13 400.796 2311.05C308.932 2205.72 378.305 2027.34 533.817 2045.1C673.838 2061.1 699.146 2203.11 688.426 2277.8C657.968 2490.01 565.5 2804.01 688.426 3098.51"
                    stroke="#FF5400"
                    strokeWidth="100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Modal for Team Member Bio */}
      {mounted &&
        activeMember &&
        createPortal(
          <div
            ref={modalOverlayRef}
            className="team-popup-overlay is-active"
            onClick={(e) => {
              if (e.target === modalOverlayRef.current) closeModal();
            }}
          >
            <div ref={modalCardRef} className="team-popup-card" role="dialog" aria-modal="true">
              <button
                className="team-popup-close-btn"
                aria-label="Close popup"
                onClick={closeModal}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="team-popup-img-wrap">
                <img
                  className="team-popup-img"
                  src={activeMember.image}
                  alt={activeMember.name}
                />
              </div>

              <div className="team-popup-content">
                <div className="team-popup-header">
                  <h3 className="team-popup-name">{activeMember.heading}</h3>
                </div>

                <div className="team-popup-body">
                  {activeMember.paragraphs.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
