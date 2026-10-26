"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const VALUES_DATA = [
  {
    number: "MY WORK PHILOSOPHY 01",
    heading: "WORK SMARTER, NOT HARDER",
    paragraph:
      "A digital presence must transcend aesthetics to drive tangible results. By integrating robust full-stack architectures with intelligent AI automations, I engineer scalable systems designed to optimize your operations and time.",
  },
  {
    number: "MY WORK PHILOSOPHY 02",
    heading: "CODE THAT ACTUALLY PERFORMS",
    paragraph:
      "Visual brilliance is ineffective without backend efficiency. I engineer high-performance digital products, prioritizing rapid load times, seamless user experiences, and scalable database architectures utilizing modern full-stack technologies.",
  },
  {
    number: "MY WORK PHILOSOPHY 03",
    heading: "BUSINESS-FIRST APPROACH",
    paragraph:
      "Drawing from direct experience in scaling my own e-commerce venture, I view technology fundamentally as a catalyst for solving complex business challenges. Every application I develop and workflow I automate is strictly aligned with maximizing your growth and ROI.",
  },
  {
    number: "MY WORK PHILOSOPHY 04",
    heading: "AUTOMATION IS THE FUTURE",
    paragraph:
      "Manual, repetitive tasks create operational bottlenecks. By deploying intelligent AI chatbots and bespoke n8n workflows, I automate routine processes—empowering your team to focus on strategic growth while the digital ecosystem handles the execution.",
  },
];

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const ScrollTrigger = (window as any).ScrollTrigger;
    const SplitText = (window as any).SplitText;
    if (!ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);

    // Scroller resolution (.page Lenis container or window)
    const scrollerEl = (document.querySelector(".page") as HTMLElement) || window;

    const cards = Array.from(section.querySelectorAll(".value-card")) as HTMLElement[];
    const totalCards = cards.length;
    if (totalCards === 0) return;

    // Dynamic em probe
    const getEm = (emCount: number) => {
      const probe = document.createElement("div");
      probe.style.cssText = `height:${emCount}em;width:0;position:absolute;visibility:hidden;pointer-events:none;`;
      wrapper.appendChild(probe);
      const px = probe.offsetHeight;
      wrapper.removeChild(probe);
      return px > 5 ? px : emCount * 16;
    };

    const getBaseTop = () => getEm(5);
    const getStepOffset = () => {
      return window.innerWidth < 768 ? getEm(3) : getEm(5);
    };

    const applyStickyPositions = () => {
      const baseTop = getBaseTop();
      const stepOffset = getStepOffset();

      cards.forEach((card, index) => {
        const stickyTop = baseTop + index * stepOffset;
        card.style.position = "sticky";
        card.style.top = `${stickyTop}px`;
        card.style.zIndex = String(10 + index * 10);
      });
    };

    applyStickyPositions();

    // Spacer element so the last card stays pinned comfortably
    const oldSpacer = wrapper.querySelector(".values-sticky-spacer");
    if (oldSpacer) oldSpacer.remove();

    const baseTop = getBaseTop();
    const stepOffset = getStepOffset();
    const lastPinTop = baseTop + (totalCards - 1) * stepOffset;
    const lastCardHeight = cards[totalCards - 1].offsetHeight;
    const spacerHeight = Math.max(0, window.innerHeight - lastPinTop - lastCardHeight + 100);

    const spacer = document.createElement("div");
    spacer.className = "values-sticky-spacer";
    spacer.style.cssText = `height:${spacerHeight}px;width:100%;pointer-events:none;flex-shrink:0;`;
    wrapper.appendChild(spacer);

    const triggers: any[] = [];

    // 1. Progress Bar Synchronization (matching two26.studio inline_script_15)
    cards.forEach((card, index) => {
      const progress = card.querySelector(".value-progress") as HTMLElement;
      if (!progress) return;

      const getPinTop = () => baseTop + index * stepOffset;

      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

      const st = ScrollTrigger.create({
        trigger: card,
        scroller: scrollerEl,
        start: index === 0 ? "top center" : "top bottom",
        end: () => `top ${getPinTop()}px`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self: any) => {
          gsap.set(progress, { scaleX: self.progress });
        },
      });
      triggers.push(st);
    });

    // 2. Kinetic Card Text Reveals (Headings by char | Paragraphs by line)
    cards.forEach((card) => {
      const heading = card.querySelector(".value-heading") as HTMLElement;
      const para = card.querySelector(".value-para") as HTMLElement;

      let chars: HTMLElement[] = [];
      if (heading) {
        if (SplitText) {
          const splitH = new SplitText(heading, {
            type: "chars, words",
            charsClass: "value-heading-char",
          });
          splitH.chars.forEach((char: HTMLElement) => {
            const mask = document.createElement("span");
            mask.className = "value-char-mask";
            char.parentNode?.insertBefore(mask, char);
            mask.appendChild(char);
          });
          chars = splitH.chars;
        } else {
          const raw = heading.textContent?.trim() || "";
          heading.innerHTML = raw
            .split("")
            .map((c) =>
              c === " "
                ? " "
                : `<span class="value-char-mask"><span class="value-heading-char">${c}</span></span>`,
            )
            .join("");
          chars = Array.from(heading.querySelectorAll(".value-heading-char"));
        }
        gsap.set(chars, { y: "115%", opacity: 0 });
      }

      let lines: HTMLElement[] = [];
      if (para) {
        if (SplitText) {
          const splitP = new SplitText(para, {
            type: "lines",
            linesClass: "value-para-line",
          });
          splitP.lines.forEach((line: HTMLElement) => {
            const mask = document.createElement("span");
            mask.className = "value-line-mask";
            line.parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
          });
          lines = splitP.lines;
        } else {
          const raw = para.innerHTML.trim();
          para.innerHTML = `<span class="value-line-mask"><span class="value-para-line">${raw}</span></span>`;
          lines = Array.from(para.querySelectorAll(".value-para-line"));
        }
        gsap.set(lines, { y: "115%", opacity: 0 });
      }

      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          scroller: scrollerEl,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      if (chars.length) {
        textTl.to(
          chars,
          {
            y: "0%",
            opacity: 1,
            duration: 0.65,
            stagger: 0.02,
            ease: "back.out(2.2)",
          },
          0,
        );
      }

      if (lines.length) {
        textTl.to(
          lines,
          {
            y: "0%",
            opacity: 1,
            duration: 0.65,
            stagger: 0.07,
            ease: "power2.out",
          },
          0.1,
        );
      }

      triggers.push(textTl);
    });

    const onResize = () => {
      applyStickyPositions();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      triggers.forEach((st) => st.kill());
      spacer.remove();
    };
  }, []);

  return (
    <section className="section-values" ref={sectionRef}>
      <div className="section-values-wrapper" ref={wrapperRef}>
        {VALUES_DATA.map((val, idx) => (
          <div key={idx} className="value-card">
            <div className="value-text">{val.number}</div>
            <div className="value-content">
              <h2 className="value-heading">{val.heading}</h2>
              <p className="value-para">{val.paragraph}</p>
            </div>
            <div className="value-progress"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
