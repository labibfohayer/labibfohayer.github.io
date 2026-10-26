"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const CAPABILITIES = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "React",
  "Tailwind CSS",
  "Responsive Design",
  "Full-Stack Systems",
  "MongoDB",
  "API Integration",
  "Database Management",
  "n8n Workflows",
  "AI Chatbots",
  "Business Automation",
  "Prompt Engineering",
  "Landing Pages",
  "E-commerce Solutions",
  "Web Applications",
  "Node.js",
  "Express.js",
  "Next.js",
  "Git & GitHub",
  "Vercel Deployment",
  "Linux CLI",
  "UI/UX Implementation",
  "Workflow Automation",
];

export default function AboutCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const pills = Array.from(section.querySelectorAll(".do-cms--pill")) as HTMLElement[];
    const DrawSVGPlugin = (window as any).DrawSVGPlugin;
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

    const cleanups: (() => void)[] = [];

    pills.forEach((pill) => {
      const text = pill.querySelector(".do-pill-text") as HTMLElement;
      const path = pill.querySelector(".do-pill-fill path") as SVGPathElement;
      if (!path) return;

      const targetStrokeWidth =
        parseFloat(path.getAttribute("stroke-width") || "200") || 200;

      const len = path.getTotalLength ? path.getTotalLength() : 1000;

      // Set initial state matching labib author script (drawSVG: 0% and strokeWidth: 0)
      if (DrawSVGPlugin) {
        gsap.set(path, { drawSVG: "0%", strokeWidth: 0 });
      } else {
        path.style.strokeDasharray = `${len} ${len}`;
        path.style.strokeDashoffset = `${len}`;
        gsap.set(path, { strokeWidth: 0 });
      }

      if (text) {
        gsap.set(text, { color: "#ff5400" });
      }

      // Build Hover Timeline (Liquid Paintbrush Wave Effect)
      const hoverTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" },
      });

      // 1. Draw SVG path + Expand stroke width to 200px (Wave sweep)
      if (DrawSVGPlugin) {
        hoverTl.to(
          path,
          {
            drawSVG: "100%",
            strokeWidth: targetStrokeWidth,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0,
        );
      } else {
        hoverTl.to(
          path,
          {
            strokeDashoffset: 0,
            strokeWidth: targetStrokeWidth,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0,
        );
      }

      // 2. Transition text color from orange (#ff5400) to white (#fdf8f5)
      if (text) {
        hoverTl.to(
          text,
          {
            color: "#fdf8f5",
            duration: 0.6,
            ease: "power1.out",
          },
          0.15,
        );
      }

      const onEnter = () => {
        hoverTl.timeScale(1).play();
      };

      const onLeave = () => {
        hoverTl.timeScale(1.1).reverse();
      };

      pill.addEventListener("mouseenter", onEnter);
      pill.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        pill.removeEventListener("mouseenter", onEnter);
        pill.removeEventListener("mouseleave", onLeave);
        hoverTl.kill();
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <section className="section-what-we-do" ref={sectionRef}>
      <div className="section-what-we-do-wrapper">
        <div className="section-projects-header">
          <div className="section-about-text">
            <strong>TECH STACK</strong>
          </div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">MY TECH ARSENAL</h2>
          </div>
        </div>

        <div className="what-we-do-cms w-dyn-list">
          <div role="list" className="do-cms-list w-dyn-items">
            {CAPABILITIES.map((cap, idx) => (
              <div key={idx} role="listitem" className="do-cms--pill w-dyn-item cursor-pointer">
                <div className="do-pill-text">{cap}</div>
                <div className="do-pill-fill">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 314 104"
                    preserveAspectRatio="none"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M275.442 89.5C275.442 89.5 315.942 46.9995 298.942 28C263.713 -11.373 199.942 117 178.442 89.5C159.869 65.7436 223.442 40.9995 209.942 19C185.09 -21.5005 106.942 115 83.9422 89.5C64.5454 67.9953 122.442 36.4999 106.942 19C80.2505 -11.1362 41.4424 89.5 14.4422 64.5C-2.00465 49.2716 32.4422 10 32.4422 10"
                      stroke="#FF5400"
                      strokeWidth="200"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
