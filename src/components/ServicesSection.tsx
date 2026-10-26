"use client";

import React, { useEffect, useRef } from "react";

interface ServiceItem {
  numberClass: string;
  word1: string;
  word2: string;
  lottieSrc: string;
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    numberClass: "one",
    word1: "UI/UX",
    word2: "Strategy",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52071_Brand strategy.json",
    description: "I craft clean layouts and user flows that make your audience actually care.",
  },
  {
    numberClass: "two",
    word1: "Frontend",
    word2: "Development",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52076_Brand Identity.json",
    description: "I write clean code to build fast sites that look unmistakably yours.",
  },
  {
    numberClass: "three",
    word1: "Full-Stack",
    word2: "Development",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52079_Web design.json",
    description: "I build complete digital experiences that look great and run flawlessly.",
  },
  {
    numberClass: "four",
    word1: "AI Automation",
    word2: "",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f5207a_Illustration.json",
    description: "I integrate smart AI tools and chatbots that save your valuable time.",
  },
  {
    numberClass: "five",
    word1: "Workflow",
    word2: "Optimization",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52078_Motion Design.json",
    description: "I automate your daily tasks, because doing things manually isn't enough.",
  },
  {
    numberClass: "six",
    word1: "E-Commerce",
    word2: "Solutions",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f52077_Packaging.json",
    description: "I build online stores that catch the eye and sell your products 24/7.",
  },
  {
    numberClass: "seven",
    word1: "Custom",
    word2: "Workflows",
    lottieSrc: "/cdn-assets/6aaad679fdb9d914f7f5207b_Art Direction.json",
    description: "I keep all your apps and systems synced perfectly, down to the smallest detail.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cleanupFns: Array<() => void> = [];
    let isDisposed = false;

    // 1. Initialize Lottie Animations for each service layer
    const lottieContainers = Array.from(
      sectionRef.current?.querySelectorAll<HTMLElement>(".lottie-animation") || []
    );

    import("lottie-web").then((lottieModule) => {
      if (isDisposed) return;
      const lottie =
        (lottieModule as any).default?.default ||
        (lottieModule as any).default ||
        lottieModule;
      if (!lottie || !lottie.loadAnimation) return;

      lottieContainers.forEach((container) => {
        const src = container.getAttribute("data-src");
        if (!src) return;
        container.innerHTML = "";
        try {
          const anim = lottie.loadAnimation({
            container,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: src,
          });
          cleanupFns.push(() => anim.destroy());
        } catch (e) {
          console.error("Lottie load error:", e);
        }
      });
    });

    // 2. Services Path Draw & Proximity Expansion Animation
    const initServicesPathAnimation = () => {
      if (isDisposed) return;
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      const DrawSVGPlugin = (window as any).DrawSVGPlugin;

      if (!gsap || !ScrollTrigger) {
        const timer = setTimeout(initServicesPathAnimation, 60);
        cleanupFns.push(() => clearTimeout(timer));
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      if (DrawSVGPlugin) {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const section = sectionRef.current?.querySelector(
        ".section-services-body"
      ) as HTMLElement | null;
      if (!section) return;

      // Clean up previous service ScrollTriggers to avoid duplicates
      ScrollTrigger.getAll().forEach((st: any) => {
        if (
          st.trigger?.classList?.contains("section-services-body") ||
          st.trigger?.classList?.contains("section-services") ||
          st.trigger?.closest?.(".section-services")
        ) {
          st.kill();
        }
      });

      const layers = Array.from(
        section.querySelectorAll(".services-layers .service-layer, .service-layer")
      ) as HTMLElement[];

      const desktopDarkPath = section.querySelector(
        ".services-path-svg-dark path, .services-path-svg-dark svg path"
      ) as SVGPathElement | null;
      const mobileDarkPath = section.querySelector(
        ".service-path-mobile-dark path, .service-path-mobile-dark svg path"
      ) as SVGPathElement | null;

      const allDarkPaths = [desktopDarkPath, mobileDarkPath].filter(
        Boolean
      ) as SVGPathElement[];
      const scrollerEl = document.querySelector(".page") || window;

      // Calculate accurate natural target width for .service-svg
      const computeTargetWidth = (block: HTMLElement, centerSvg: HTMLElement): number => {
        const isMobile = window.innerWidth <= 767;
        const blockFontSize = parseFloat(getComputedStyle(block).fontSize) || (isMobile ? 9.8 : 13.6);
        const emMultiplier = isMobile ? 8.5 : 11.2;
        const computed = blockFontSize * emMultiplier;
        return Math.round(computed) || (isMobile ? 84 : 152);
      };

      // 1. Setup Dark SVG Path Initial State
      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";
      allDarkPaths.forEach((path) => {
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        if (hasDrawSVG) {
          gsap.set(path, { drawSVG: "0%" });
        } else {
          const len = path.getTotalLength ? path.getTotalLength() : 6532;
          path.style.strokeDasharray = `${len}px`;
          path.style.strokeDashoffset = `${len}px`;
        }
      });

      // 2. Setup Service Blocks Initial State
      layers.forEach((layer) => {
        const block = (layer.querySelector(".service-block") || layer) as HTMLElement;
        const centerSvg = block.querySelector(".service-svg") as HTMLElement | null;
        const paraWrapper = block.querySelector(
          ".service-block-para-wrapper"
        ) as HTMLElement | null;

        if (centerSvg) {
          const targetW = computeTargetWidth(block, centerSvg);
          centerSvg.dataset.targetWidth = String(targetW);
          centerSvg.style.transformOrigin = "center center";
          centerSvg.style.willChange = "transform, width, opacity";
          centerSvg.style.flexShrink = "0";

          const innerMedia = centerSvg.querySelectorAll(
            "img, svg, .service-img, .lottie-animation"
          ) as NodeListOf<HTMLElement>;
          innerMedia.forEach((media) => {
            media.style.width = "100%";
            media.style.height = "100%";
            media.style.maxWidth = "100%";
            media.style.maxHeight = "100%";
            media.style.objectFit = "contain";
            media.style.display = "block";
          });

          gsap.set(centerSvg, {
            width: 0,
            scale: 0,
            opacity: 0,
            overflow: "hidden",
            margin: "0px",
          });
        }

        if (paraWrapper) {
          paraWrapper.style.transformOrigin = "center center";
          paraWrapper.style.willChange = "transform, opacity";
          gsap.set(paraWrapper, {
            scale: 0,
            rotation: 0,
            opacity: 0,
          });
        }
      });

      // 3. Create Master Scrubbed Timeline matching original two26.studio
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          scroller: scrollerEl,
          start: "top 70%",
          end: "bottom 70%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // A. Dark Path draws 0% to 100% across the full scrub duration
      allDarkPaths.forEach((path) => {
        if (hasDrawSVG) {
          masterTl.to(
            path,
            {
              drawSVG: "100%",
              ease: "none",
              duration: 1,
            },
            0
          );
        } else {
          masterTl.to(
            path,
            {
              strokeDashoffset: 0,
              ease: "none",
              duration: 1,
            },
            0
          );
        }
      });

      // B. Proximity Expansions for each of the 7 Service Layers
      const totalLayers = layers.length; // 7
      layers.forEach((layer, index) => {
        const block = (layer.querySelector(".service-block") || layer) as HTMLElement;
        const centerSvg = block.querySelector(".service-svg") as HTMLElement | null;
        const paraWrapper = block.querySelector(
          ".service-block-para-wrapper"
        ) as HTMLElement | null;

        const point = totalLayers > 1 ? index / (totalLayers - 1) : 0;
        const stepDuration = 0.14;
        const startTime = Math.max(0, point - 0.04);

        if (centerSvg) {
          masterTl.to(
            centerSvg,
            {
              width: () => computeTargetWidth(block, centerSvg),
              scale: 1,
              opacity: 1,
              duration: stepDuration,
              ease: "back.out(3.5)",
            },
            startTime
          );
        }

        if (paraWrapper) {
          masterTl.to(
            paraWrapper,
            {
              scale: 1,
              rotation: -5,
              opacity: 1,
              duration: stepDuration,
              ease: "back.out(3.5)",
            },
            startTime + 0.02
          );
        }
      });

      cleanupFns.push(() => masterTl.kill());

      if (typeof ScrollTrigger.sort === "function") {
        ScrollTrigger.sort();
      }
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        if (typeof ScrollTrigger.sort === "function") {
          ScrollTrigger.sort();
        }
        ScrollTrigger.refresh();
      }, 300);
      cleanupFns.push(() => clearTimeout(refreshTimer));
    };

    const initTimer = setTimeout(initServicesPathAnimation, 100);
    cleanupFns.push(() => clearTimeout(initTimer));

    return () => {
      isDisposed = true;
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-services">
      <div className="section-services-wrapper">
        {/* Section Header */}
        <div className="section-projects-header">
          <div className="section-about-text">Our Services</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">THIS IS OUR THING</h2>
          </div>
        </div>

        {/* Services Body with 7 Layers and SVG Path */}
        <div className="section-services-body">
          <div className="services-layers">
            {SERVICES.map((s, idx) => (
              <div key={idx} className="service-layer">
                <div className={`service-block ${s.numberClass}`}>
                  <div className="service-text">{s.word1}</div>
                  <div className="service-svg">
                    <div
                      className="lottie-animation"
                      data-animation-type="lottie"
                      data-src={s.lottieSrc}
                      data-loop="1"
                      data-direction="1"
                      data-autoplay="1"
                      data-renderer="svg"
                    />
                  </div>
                  {s.word2 && <div className="service-text">{s.word2}</div>}
                  <div className="service-block-para-wrapper">
                    <p className="service-block-para">{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic SVG Path winding through layers */}
          <div className="services-path">
            <style jsx>{`
              .services-path-svg-dark svg,
              .service-path-mobile-dark svg,
              .service-path-mobile svg,
              .services-path-mobile-dark svg,
              .services-path-svg svg {
                overflow: visible !important;
              }
              .service-svg .lottie-animation,
              .service-svg svg {
                width: 100% !important;
                height: 100% !important;
                display: block !important;
                object-fit: contain !important;
              }
            `}</style>
            <div className="services-path-svg-dark w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 1616 2187"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1601 15C1241.24 56.6913 1025.14 308.977 1139.71 377.393C1191.45 408.29 1240.74 339.444 1181.39 282.059C1075.45 179.627 937.582 215.243 741.458 298.287C701.638 315.147 622.383 350.59 552.298 410.201C487.298 465.486 487.725 549.018 534.765 563.77C581.804 578.523 632.714 579.634 681.058 587.392C729.731 595.202 767.011 617.17 797.836 657.756C833.766 705.065 838.864 772.034 862.127 825.767C890.491 891.283 966.341 911.2 1033.5 915.638C1130.56 922.052 1195.74 891.215 1286.16 899.069C1347.7 904.414 1457.75 932.208 1466.92 1059.42C1477.81 1210.68 1340.4 1252.99 1221.76 1286.05C1118.2 1314.91 997.775 1397.54 862.127 1334.5C757.468 1285.86 666.411 1293.34 650.401 1384.21C634.391 1475.07 710.968 1532.13 837.283 1542.81C963.598 1553.5 1146.44 1534.93 1181.39 1676C1226.53 1858.21 954.075 1839.5 797.836 1839.5C661.891 1839.5 422.283 1807.72 385.5 1700C340.427 1568 635.939 1584.37 465.5 1917C414.516 2016.5 310 2165.31 15 2165.31"
                  stroke="#FF5400"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="service-path-mobile-dark w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 407 1556"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2077_2)">
                  <path
                    d="M542.705 10C465.727 48.981 92.8237 79.5116 92.8237 185.592C92.8237 291.673 352.712 336 346.322 440.868C339.933 545.736 104.278 543.251 92.8237 652.131C79.6013 777.82 353.287 765.564 346.322 898.5C339.358 1031.44 63.9084 911.5 68 1046C72.0916 1180.5 335.245 1170.41 328.309 1279.59C320.5 1402.5 -37.4522 1513.46 -135.704 1545.09"
                    stroke="#FF5400"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2077_2">
                    <rect width="407" height="1555.09" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="service-path-mobile w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 407 1556"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2077_2)">
                  <path
                    d="M542.705 10C465.727 48.981 92.8237 79.5116 92.8237 185.592C92.8237 291.673 352.712 336 346.322 440.868C339.933 545.736 104.278 543.251 92.8237 652.131C79.6013 777.82 353.287 765.564 346.322 898.5C339.358 1031.44 63.9084 911.5 68 1046C72.0916 1180.5 335.245 1170.41 328.309 1279.59C320.5 1402.5 -37.4522 1513.46 -135.704 1545.09"
                    stroke="#FF5400"
                    strokeWidth="20"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2077_2">
                    <rect width="407" height="1555.09" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="services-path-svg w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 1616 2187"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1601 15C1241.24 56.6913 1025.14 308.977 1139.71 377.393C1191.45 408.29 1240.74 339.444 1181.39 282.059C1075.45 179.627 937.582 215.243 741.458 298.287C701.638 315.147 622.383 350.59 552.298 410.201C487.298 465.486 487.725 549.018 534.765 563.77C581.804 578.523 632.714 579.634 681.058 587.392C729.731 595.202 767.011 617.17 797.836 657.756C833.766 705.065 838.864 772.034 862.127 825.767C890.491 891.283 966.341 911.2 1033.5 915.638C1130.56 922.052 1195.74 891.215 1286.16 899.069C1347.7 904.414 1457.75 932.208 1466.92 1059.42C1477.81 1210.68 1340.4 1252.99 1221.76 1286.05C1118.2 1314.91 997.775 1397.54 862.127 1334.5C757.468 1285.86 666.411 1293.34 650.401 1384.21C634.391 1475.07 710.968 1532.13 837.283 1542.81C963.598 1553.5 1146.44 1534.93 1181.39 1676C1226.53 1858.21 954.075 1839.5 797.836 1839.5C661.891 1839.5 422.283 1807.72 385.5 1700C340.427 1568 635.939 1584.37 465.5 1917C414.516 2016.5 310 2165.31 15 2165.31"
                  stroke="#FF5400"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="blockhole-start w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 33 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="20.5" cy="34.5" rx="12.5" ry="3.5" fill="black" />
                <g filter="url(#filter0_dd_347_5714)">
                  <ellipse
                    cx="12.4585"
                    cy="18.0159"
                    rx="12.4357"
                    ry="18"
                    transform="rotate(0.0733968 12.4585 18.0159)"
                    fill="#FF5400"
                  />
                  <path
                    d="M12.4808 0.51593C15.7039 0.520059 18.673 2.41469 20.8561 5.5833C23.0378 8.74988 24.4002 13.1493 24.3939 18.0312C24.3877 22.9131 23.014 27.309 20.8243 30.47C18.633 33.633 15.659 35.52 12.436 35.5159C9.21293 35.5117 6.24369 33.6171 4.06061 30.4485C1.87899 27.282 0.516586 22.8824 0.52284 18.0006C0.529093 13.1188 1.90276 8.72279 4.09249 5.56183C6.28368 2.39886 9.25776 0.511855 12.4808 0.51593Z"
                    stroke="black"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_347_5714"
                    x="0.0229492"
                    y="0.0161133"
                    width="28.8711"
                    height="37"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="4" dy="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_347_5714"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.972549 0 0 0 0 0.933333 0 0 0 0 0.909804 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_347_5714"
                      result="effect2_dropShadow_347_5714"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_347_5714"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
            <div className="blackhole-end w-embed">
              <svg
                width="100%"
                style={{ height: "auto" }}
                viewBox="0 0 33 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="12.5"
                  cy="3.5"
                  rx="12.5"
                  ry="3.5"
                  transform="matrix(-1 0 0 1 25 31)"
                  fill="black"
                />
                <g filter="url(#filter0_dd_347_5719)">
                  <ellipse
                    cx="12.4357"
                    cy="18"
                    rx="12.4357"
                    ry="18"
                    transform="matrix(-0.999999 0.00128102 0.00128102 0.999999 32.9541 0)"
                    fill="#FF5400"
                  />
                  <path
                    d="M20.5192 0.51593C17.2961 0.520059 14.327 2.41469 12.1439 5.5833C9.96218 8.74988 8.59983 13.1493 8.60609 18.0312C8.61234 22.9131 9.98596 27.309 12.1757 30.47C14.367 33.633 17.341 35.52 20.564 35.5159C23.7871 35.5117 26.7563 33.6171 28.9394 30.4485C31.121 27.282 32.4834 22.8824 32.4772 18.0006C32.4709 13.1188 31.0972 8.72279 28.9075 5.56183C26.7163 2.39886 23.7422 0.511855 20.5192 0.51593Z"
                    stroke="black"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_dd_347_5719"
                    x="4.10596"
                    y="0.0161133"
                    width="28.8711"
                    height="37"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="-4" dy="1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_347_5719"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dx="-1" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.972549 0 0 0 0 0.933333 0 0 0 0 0.909804 0 0 0 1 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_dropShadow_347_5719"
                      result="effect2_dropShadow_347_5719"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect2_dropShadow_347_5719"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
