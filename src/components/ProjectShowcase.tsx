"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { initCTAButtons } from "@/lib/buttonAnimations";

interface ProjectItem {
  id: string;
  name: string;
  detail: string;
  href: string;
  logo: string;
  mainImg: string;
  hoverImg: string;
  color: string;
  alt?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "webpulse-bot",
    name: "Webpulse Bot",
    detail: "AI Chatbot & Automation",
    href: "/work/webpulse-bot",
    logo: "/projects/webpulse-bot-hover.jpg",
    mainImg: "/projects/webpulse-bot-static.jpg",
    hoverImg: "/projects/webpulse-bot-hover.jpg",
    color: "rgb(0, 163, 255)",
    alt: "Webpulse Bot - AI Automation",
  },
  {
    id: "bagel-bar",
    name: "THE BAGEL BAR",
    detail: "Food & Beverage",
    href: "/work/bagel-bar",
    logo: "/cdn-assets/6ab2675e0b996d1415be46a3_The Bagel Bar.png",
    mainImg: "/cdn-assets/6ab270be80849a0a23faa24d_6ab27078c47da30c0af6b000_Bagel_1.jpeg",
    hoverImg: "/cdn-assets/6ab270be80849a0a23faa24a_6ab2707cc2a53666310f52d2_Bagel_2_hover.jpeg",
    color: "rgb(26, 84, 228)",
  },
  {
    id: "tanti-maria",
    name: "TANTI MARIA",
    detail: "Food & Retail",
    href: "/work/tanti-maria",
    logo: "/cdn-assets/6ab266e293685f22fedc573a_Tanti Maria.png",
    mainImg: "/cdn-assets/6ab2723d53bb370f04afa38a_6ab2722877656a8e8b50e7c0_Tanti_1.jpeg",
    hoverImg: "/cdn-assets/6ab2723d53bb370f04afa391_6ab2722d77656a8e8b50e941_Tanti_2_hover.jpeg",
    color: "rgb(242, 85, 37)",
  },
  {
    id: "munchies-cream",
    name: "MUNCHIES AND CREAM",
    detail: "Food & Beverage",
    href: "/work/munchies-and-cream",
    logo: "/cdn-assets/6ab26718a85417b42d23712f_Munchies & Cream.png",
    mainImg: "/cdn-assets/6ab2723d53bb370f04afa381_6ab2721e4694c5c1d617273d_Munchies_1.jpeg",
    hoverImg: "/cdn-assets/6ab2723d53bb370f04afa375_6ab27223e0afaf640fd855d7_Munchies_2_hover.jpeg",
    color: "rgb(129, 52, 205)",
  },
  {
    id: "mvp",
    name: "MVP",
    detail: "Sports & Talent Management",
    href: "/work/mvp",
    logo: "/cdn-assets/6ab26733f2ee3f3da2d70eeb_MVP.png",
    mainImg: "/cdn-assets/6ab270be80849a0a23faa284_6ab270907f6e9d96146209a1_MVP_Thumbnail1.jpeg",
    hoverImg: "/cdn-assets/6ab270be80849a0a23faa29e_6ab27093a089e1fd370a7310_MVP_Thumbnail2_hover.jpeg",
    color: "rgb(21, 63, 227)",
  },
  {
    id: "yum-yum",
    name: "YUM YUM",
    detail: "Food & Beverage",
    href: "/work/yum-yum",
    logo: "/cdn-assets/6ab266f1e1ea593718edc309_YumYum.png",
    mainImg: "/cdn-assets/6ab2723d53bb370f04afa37d_6ab272335c44422412d81fb1_YumYum_1.jpeg",
    hoverImg: "/cdn-assets/6ab2723d53bb370f04afa372_6ab2723985afb9378f444d8b_YumYum_2_hover.jpeg",
    color: "rgb(229, 201, 223)",
  },
];

export default function ProjectShowcase() {
  const router = useRouter();
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement>(null);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/work") return;
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/work", () => {
        router.push("/work");
      });
    } else {
      router.push("/work");
    }
  };

  useEffect(() => {
    let cleanupFns: Array<() => void> = [];

    if (sectionRef.current) {
      cleanupFns.push(initCTAButtons(sectionRef.current));
    }

    const setupProjectsSection = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      const DrawSVGPlugin = (window as any).DrawSVGPlugin;

      if (!gsap || !ScrollTrigger) {
        const timer = setTimeout(setupProjectsSection, 50);
        cleanupFns.push(() => clearTimeout(timer));
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      if (DrawSVGPlugin) {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const section = sectionRef.current;
      if (!section) return;
      section.setAttribute("data-projects-section-initialized", "true");

      const scrollerEl = document.querySelector(".page") || window;

      // Clean up any stale ScrollTriggers for project cards & section
      ScrollTrigger.getAll().forEach((st: any) => {
        if (
          !st.trigger ||
          !st.trigger.isConnected ||
          st.trigger.className?.includes?.("project-card-clip-mask") ||
          st.trigger.className?.includes?.("projects-end")
        ) {
          st.kill();
        }
      });

      // 1. Project Cards Scroll Bloom / Float-Up Reveal (6 Cards)
      const projectCards = Array.from(
        section.querySelectorAll(".project-card")
      ) as HTMLElement[];

      projectCards.forEach((card, index) => {
        const maskWrapper = card.closest(
          ".project-card-clip-mask"
        ) as HTMLElement | null;
        if (!maskWrapper) return;

        // Initial State: 15% width & 15% height mask (inset 42.5%) + 36px border radius
        gsap.set(maskWrapper, {
          clipPath: "inset(42.5% 42.5% 42.5% 42.5%)",
          webkitClipPath: "inset(42.5% 42.5% 42.5% 42.5%)",
          borderRadius: "36px",
          overflow: "hidden",
          willChange: "clip-path, border-radius",
        });

        // 3D perspective tilt
        const horizontalTilt = index % 2 === 0 ? -16 : 16;
        const zTilt = index % 2 === 0 ? -4 : 4;
        gsap.set(card, {
          scale: 1.45,
          rotationX: 25,
          rotationY: horizontalTilt,
          rotation: zTilt,
          transformPerspective: 800,
          transformOrigin: "center center",
          willChange: "transform",
        });

        // ScrollTrigger: blooms into place as you scroll down
        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: maskWrapper,
            scroller: scrollerEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });

        cardTl.to(
          maskWrapper,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            webkitClipPath: "inset(0% 0% 0% 0%)",
            borderRadius: "0px",
            duration: 1.25,
            ease: "power3.out",
          },
          0
        );

        cardTl.to(
          card,
          {
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            rotation: 0,
            duration: 1.25,
            ease: "power3.out",
          },
          0
        );

        cleanupFns.push(() => cardTl.kill());

        // 2. Project Card Hover Animation (Wall Paint & Mask Reveal)
        if (card.dataset.hoverBound !== "true") {
          card.dataset.hoverBound = "true";

          const foregroundPath = card.querySelector(
            ".project-img-svg path"
          ) as SVGPathElement | null;
          const maskPath = card.querySelector(
            ".mask-brush-path"
          ) as SVGPathElement | null;
          const arrow = (card.querySelector(".projects-arrow svg") ||
            card.querySelector(".projects-arrow")) as HTMLElement | null;

          const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

          if (hasDrawSVG) {
            if (foregroundPath) {
              gsap.set(foregroundPath, {
                drawSVG: "100% 100%",
                strokeWidth: 0,
              });
            }
            if (maskPath) {
              gsap.set(maskPath, {
                drawSVG: "100% 100%",
                strokeWidth: 0,
              });
            }
          } else {
            [foregroundPath, maskPath].filter(Boolean).forEach((path: any) => {
              const len = path.getTotalLength ? path.getTotalLength() : 4500;
              path.style.strokeDasharray = `${len}px`;
              path.style.strokeDashoffset = `${-len}px`;
              path.style.strokeWidth = "0px";
            });
          }

          if (arrow) {
            gsap.set(arrow, {
              rotation: 0,
              transformOrigin: "center center",
              willChange: "transform",
            });
          }

          const hoverTl = gsap.timeline({
            paused: true,
            defaults: { ease: "power1.inOut" },
          });

          if (foregroundPath) {
            if (hasDrawSVG) {
              hoverTl.to(
                foregroundPath,
                {
                  drawSVG: "0% 100%",
                  strokeWidth: 1200,
                  duration: 0.95,
                },
                0
              );
            } else {
              hoverTl.to(
                foregroundPath,
                {
                  strokeDashoffset: 0,
                  strokeWidth: 1200,
                  duration: 0.95,
                },
                0
              );
            }
          }

          if (maskPath) {
            if (hasDrawSVG) {
              hoverTl.to(
                maskPath,
                {
                  drawSVG: "0% 100%",
                  strokeWidth: 1200,
                  duration: 1.05,
                },
                0.35
              );
            } else {
              hoverTl.to(
                maskPath,
                {
                  strokeDashoffset: 0,
                  strokeWidth: 1200,
                  duration: 1.05,
                },
                0.35
              );
            }
          }

          if (arrow) {
            hoverTl
              .to(
                arrow,
                {
                  rotation: -45,
                  duration: 0.28,
                  ease: "power2.out",
                },
                0
              )
              .to(
                arrow,
                {
                  rotation: 0,
                  duration: 0.65,
                  ease: "elastic.out(1.15, 0.35)",
                },
                0.28
              );
          }

          const onEnter = () => hoverTl.timeScale(1).play();
          const onLeave = () => hoverTl.timeScale(1.3).reverse();

          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);

          cleanupFns.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
            hoverTl.kill();
          });
        }
      });

      // 3. Projects End Section Animation (Line-by-line heading & pills)
      const projectsEnd = section.querySelector(
        ".projects-end"
      ) as HTMLElement | null;
      if (projectsEnd) {
        const lines = Array.from(
          projectsEnd.querySelectorAll(".project-line")
        ) as HTMLElement[];
        const pills = Array.from(
          projectsEnd.querySelectorAll("[class*='projects-pill']")
        ) as HTMLElement[];
        const projectBtn = projectsEnd.querySelector(
          ".project-btn"
        ) as HTMLElement | null;

        gsap.set(lines, { y: "115%", opacity: 0 });
        pills.forEach((pill) => {
          gsap.set(pill, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          const pillInner = pill.querySelector("div, span");
          if (pillInner)
            gsap.set(pillInner, {
              opacity: 0,
              y: 15,
              display: "inline-block",
            });
        });
        if (projectBtn) {
          gsap.set(projectBtn, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          const btnText = projectBtn.querySelector(".cta-text, span");
          if (btnText)
            gsap.set(btnText, {
              opacity: 0,
              y: 15,
              display: "inline-block",
            });
        }

        const masterEndTl = gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: projectsEnd,
            scroller: scrollerEl,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
            onEnter: () => masterEndTl.play(),
          },
        });

        masterEndTl.timeScale(0.75);

        masterEndTl.to(
          lines,
          {
            y: "0%",
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "back.out(1.4)",
          },
          0
        );

        const totalLinesTime = lines.length * 0.12 + 0.5;

        pills.forEach((pill, i) => {
          const pillStart =
            0.2 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.7;
          masterEndTl.to(
            pill,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.55,
              ease: "back.out(2.5)",
            },
            pillStart
          );

          const pillInner = pill.querySelector("div, span");
          if (pillInner) {
            masterEndTl.to(
              pillInner,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.6)",
              },
              pillStart + 0.15
            );
          }
        });

        if (projectBtn) {
          const btnStart = totalLinesTime + 0.15;
          masterEndTl.to(
            projectBtn,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.55,
              ease: "back.out(2.5)",
            },
            btnStart
          );

          const btnText = projectBtn.querySelector(".cta-text, span");
          if (btnText) {
            masterEndTl.to(
              btnText,
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.6)",
              },
              btnStart + 0.15
            );
          }
        }

        cleanupFns.push(() => masterEndTl.kill());
      }

      if (typeof ScrollTrigger.sort === "function") {
        ScrollTrigger.sort();
      }
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        if (typeof ScrollTrigger.sort === "function") {
          ScrollTrigger.sort();
        }
        ScrollTrigger.refresh();
      }, 200);
      cleanupFns.push(() => clearTimeout(refreshTimer));
    };

    const timerId = setTimeout(setupProjectsSection, 80);
    cleanupFns.push(() => clearTimeout(timerId));

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-projects" id="work">
      <div className="section-projects-wrapper">
        {/* Section Header */}
        <div className="section-projects-header">
          <div className="section-about-text">Featured Projects</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading less-max-w">Selected Works</h2>
          </div>
        </div>

        {/* Vertical Projects List */}
        <div className="projects-vertical-wrapper">
          <div className="projects-list-wrapper w-dyn-list">
            <div role="list" className="projects-list w-dyn-items">
              {PROJECTS.map((project, index) => (
                <div
                  key={project.id}
                  role="listitem"
                  className="project-item w-dyn-item"
                >
                  <div className="project-card-clip-mask">
                    <a
                      href={project.href}
                      className="project-card w-inline-block"
                    >
                      <div className="project-card-img-wrapper">
                        {/* Hover image */}
                        <img
                          src={project.hoverImg}
                          loading="lazy"
                          alt={project.alt || project.name}
                          className="project-img-hover"
                          style={{ display: "none" }}
                        />
                        {/* Vector path overlay */}
                        <div
                          className="project-img-svg"
                          style={{
                            color: project.color,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 2,
                          }}
                        >
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 728 1020"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMidYMid slice"
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "block",
                              overflow: "visible",
                            }}
                          >
                            <path
                              d="M25.002 153.857C25.002 153.857 151.002 -28.0122 236.002 40.3572C351.002 132.857 -86.2292 534.598 62.5019 617.857C173.257 679.857 466.502 -70.1428 646.002 40.3572C889.446 190.221 -74.3269 862.107 151.002 983.857C337.002 1084.36 526.502 453.148 665.002 551.357C803.502 649.566 415.502 926.187 501.002 983.857C586.502 1041.53 703.002 794.357 703.002 794.357"
                              stroke="currentColor"
                              strokeWidth="0"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                willChange: "stroke-dashoffset, stroke-width",
                              }}
                            />
                          </svg>
                        </div>
                        {/* Main Cover image */}
                        <img
                          src={project.mainImg}
                          loading="lazy"
                          alt={project.alt || project.name}
                          className="project-img"
                        />
                        {/* Clip Mask Overlay SVG */}
                        <svg
                          className="project-card-mask-overlay"
                          viewBox="0 0 709 1012"
                          preserveAspectRatio="xMidYMid slice"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            pointerEvents: "none",
                            zIndex: 3,
                            overflow: "visible",
                          }}
                        >
                          <defs>
                            <mask
                              id={`project-mask-${index}`}
                              maskUnits="userSpaceOnUse"
                              x="-200"
                              y="-200"
                              width="1109"
                              height="1412"
                            >
                              <path
                                className="mask-brush-path"
                                d="M25.007 729.507C25.007 729.507 136.507 1065.7 290.007 969.007C506.711 832.495 -164.765 175.16 89.5069 44.5066C315.057 -71.3883 462.507 559.507 615.507 515.007C768.507 470.507 615.507 25.0068 615.507 25.0068"
                                stroke="#FFFFFF"
                                strokeWidth="0"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                style={{
                                  willChange: "stroke-dashoffset, stroke-width",
                                }}
                              />
                            </mask>
                          </defs>
                          <image
                            href={project.hoverImg}
                            xlinkHref={project.hoverImg}
                            x="0"
                            y="0"
                            width="709"
                            height="1012"
                            preserveAspectRatio="xMidYMid slice"
                            mask={`url(#project-mask-${index})`}
                          />
                        </svg>
                      </div>

                      {/* Project Meta Details */}
                      <div className="project-detail">
                        <div className="project-logo">
                          <img
                            src={project.logo}
                            loading="lazy"
                            alt={project.alt || project.name}
                            className="project-logo-img"
                          />
                        </div>
                        <div className="project-detail-header">
                          <div className="project-detail-btm">
                            <div className="project-name-text">
                              {project.name}
                            </div>
                          </div>
                          <div className="project-detail-text">
                            {project.detail}
                          </div>
                        </div>
                        <div className="projects-arrow">
                          <div className="code-embed-7">
                            <svg
                              width="100%"
                              height="100%"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.17273 17.9405L18.6533 2.29983M5.84177 1.17288L18.6533 2.29983L18.3543 15.1573"
                                stroke="currentColor"
                                strokeWidth="2.34564"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section End Reveal */}
          <div className="projects-end">
            <div className="projects-end-inner-wrapper">
              <p
                className="projects-end-para"
                aria-label="READY TO SEE HOW IDEAS TURN INTO DIGITAL REALITY?"
              >
                <span className="project-line-mask">
                  <span className="project-line">READY TO SEE HOW </span>
                </span>
                <span className="project-line-mask">
                  <span className="project-line">IDEAS TURN INTO </span>
                </span>
                <span className="project-line-mask">
                  <span className="project-line">DIGITAL REALITY?</span>
                </span>
              </p>
              <div className="projects-pill-first">
                <div className="hero-pill-text">Live projects</div>
              </div>
              <div className="projects-pill-second">
                <div className="hero-pill-text">Keep exploring</div>
              </div>
              <div className="projects-pill-third">
                <div className="hero-pill-text">Smart automation</div>
              </div>
              <Link
                href="/work"
                onClick={handleExploreClick}
                className="project-btn w-inline-block"
              >
                <div className="cta-text">Explore Portfolio</div>
                <div className="cta-btn-arrow">
                  <div className="svg-arrow-cta">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.46439 8.53621L8.53546 1.46515M3.05538 1.28837L8.53546 1.46515L8.71223 6.94522"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="cta-btn-fill-hover" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
