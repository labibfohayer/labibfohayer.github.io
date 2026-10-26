"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface Testimonial {
  quote: string;
  name: string;
  position: string;
  avatar: string;
  srcset?: string;
  review: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Labib has been one of the smoothest collaborations I've had",
    name: "Sadiya Akter Suraiya",
    position: "CEO, Ponyopuri",
    avatar: "/images/sadiya-akter-suraiya.jpg",
    review:
      "He is sharp, always responsive, and has a real talent for turning ideas into powerful websites. No matter the challenge: tight deadlines, complex coding requirements, or tricky automations, he always shows up with perfect solutions. Highly recommend working with him!",
  },
  {
    quote: "Labib truly brought our digital vision to life",
    name: "Mawlana Omar Faruk",
    position: "Chairman, Pioneer Study Care (PSC)",
    avatar: "/images/mawlana-omar-faruk.jpg",
    review:
      "Labib is an amazing professional with an incredible amount of coding and automation talent. He took our ideas, understood them completely, and built a seamless web experience that went beyond anything we imagined. We feel incredibly lucky to have worked with him. Cannot recommend him highly enough!",
  },
  {
    quote:
      "Working with Labib is like brainstorming ideas with a brilliant tech partner",
    name: "Vlad Belcin",
    position: "Sr. Copywriter, Dare Digital",
    avatar: "/cdn-assets/6ab3d5ec9cfd634776e95758_Vlad.jpg",
    srcset:
      "/cdn-assets/6ab3d5ec9cfd634776e95758_Vlad-p-500.jpg 500w, /cdn-assets/6ab3d5ec9cfd634776e95758_Vlad.jpg 800w",
    review:
      "Always insightful and highly constructive. It hardly feels stressful, because his development process is so smooth and transparent. That's what you get when you hire an expert who knows both design and smart automation.",
  },
  {
    quote: "Multiple web projects and counting",
    name: "Ionut Belet",
    position: "Founder, MVP Agency",
    avatar: "/cdn-assets/6ab3d72a667c6ab560a03d5b_Ionut.jpg",
    srcset:
      "/cdn-assets/6ab3d72a667c6ab560a03d5b_Ionut-p-500.jpg 500w, /cdn-assets/6ab3d72a667c6ab560a03d5b_Ionut.jpg 800w",
    review:
      "We’ve worked together on custom web development and AI automation workflows, and it’s been a pleasure every time. Great logic, flawlessly executed code, and just a highly professional guy to work with. Pretty sure we’re not done yet.",
  },
  {
    quote: "Better than we imagined",
    name: "Monica Tantu",
    position: "Co-Founder, Merci",
    avatar: "/cdn-assets/6ab3d7f19cfd634776eaf212_Monica.jpg",
    srcset:
      "/cdn-assets/6ab3d7f19cfd634776eaf212_Monica-p-500.jpg 500w, /cdn-assets/6ab3d7f19cfd634776eaf212_Monica.jpg 800w",
    review:
      "Working with Labib on our full-stack website was a great experience from start to finish. He is incredibly skilled and thoughtful. He brought workflow automation ideas we wouldn’t have thought of ourselves, saving us countless hours. You can tell he cares deeply about the code quality and the client's success.",
  },
];

export default function TestimonialsStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sideBarRef = useRef<HTMLDivElement>(null);
  const navArrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bodyBg = containerRef.current;
    if (!bodyBg) return;

    // Query CMS collection items
    const cardElements = Array.from(
      bodyBg.querySelectorAll<HTMLElement>(".testimonial-item")
    );
    const totalCards = cardElements.length;
    if (totalCards === 0) return;

    // Clean up any inner card nested transforms so GSAP is the single source of truth
    cardElements.forEach((card) => {
      const innerCard = card.querySelector<HTMLElement>(
        ".testimonial-card, [class*='testimonial-card']"
      );
      if (innerCard && innerCard !== card) {
        innerCard.style.transform = "none";
        innerCard.style.position = "relative";
        innerCard.style.top = "auto";
        innerCard.style.left = "auto";
        innerCard.style.margin = "0 auto";
      }
    });

    const sidebar = sideBarRef.current;
    const navArrow = navArrowRef.current;

    let currentIndex = 0;
    let isAnimating = false;

    // -----------------------------------------------------------------
    // 1. Organic Aggressive Rotations for Natural Stacked Deck
    // -----------------------------------------------------------------
    const anglePalette = [-7.5, 6.8, -5.5, 8.2, -8.5, 6.2, -7.0, 7.8];
    const cardRotations = cardElements.map((_, i) => {
      return anglePalette[i % anglePalette.length];
    });

    // Initial card positions & z-index layer stack
    function applyCardStackPositions() {
      cardElements.forEach((card, i) => {
        const order = (i - currentIndex + totalCards) % totalCards;
        const zIndex = totalCards - order;

        card.style.zIndex = String(zIndex);
        card.style.willChange = "transform";
        card.style.backfaceVisibility = "hidden";

        // Natural center lock via CSS Grid + pure rotation
        gsap.set(card, {
          xPercent: 0,
          yPercent: 0,
          x: 0,
          y: 0,
          rotation: i === currentIndex ? 0 : cardRotations[i],
          opacity: 1,
          scale: 1,
          force3D: true,
          transformOrigin: "center center",
        });
      });
    }

    applyCardStackPositions();

    // -----------------------------------------------------------------
    // 2. Dynamic Sidebar Horizontal Ticks (.side-bar)
    // -----------------------------------------------------------------
    const sidebarTicks: HTMLDivElement[] = [];
    if (sidebar) {
      sidebar.innerHTML = "";
      sidebar.style.display = "flex";
      sidebar.style.flexDirection = "column";
      sidebar.style.alignItems = "center";
      sidebar.style.justifyContent = "center";
      sidebar.style.gap = "1em";
      sidebar.style.pointerEvents = "none";

      for (let i = 0; i < totalCards; i++) {
        const tick = document.createElement("div");
        tick.className = "sidebar-tick";
        tick.style.height = "2px";
        tick.style.borderRadius = "2px";
        tick.style.backgroundColor = "#FFFFFF";
        tick.style.transformOrigin = "right center";
        sidebar.appendChild(tick);
        sidebarTicks.push(tick);
      }

      updateSidebar(currentIndex, false);
    }

    function updateSidebar(activeIdx: number, animate = true) {
      if (!sidebarTicks.length) return;

      sidebarTicks.forEach((tick, idx) => {
        const isActive = idx === activeIdx;
        const targetWidth = isActive ? 34 : 14;
        const targetOpacity = isActive ? 1 : 0.35;

        if (animate) {
          gsap.to(tick, {
            width: targetWidth,
            opacity: targetOpacity,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.set(tick, {
            width: targetWidth,
            opacity: targetOpacity,
          });
        }
      });
    }

    // -----------------------------------------------------------------
    // 3. Floating Custom Navigation Arrow (.nav-arrow)
    // -----------------------------------------------------------------
    let removeNavListeners = () => {};

    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 992);

    if (navArrow) {
      if (isTouch) {
        // Hide custom cursor nav-arrow on mobile/tablets
        navArrow.style.display = "none";
      } else {
        navArrow.style.display = "flex";
        // Reset any Webflow layout offsets
        navArrow.style.position = "absolute";
        navArrow.style.top = "0px";
        navArrow.style.left = "0px";
        navArrow.style.right = "auto";
        navArrow.style.bottom = "auto";
        navArrow.style.margin = "0px";
        navArrow.style.pointerEvents = "none";
        navArrow.style.zIndex = "999";

        // Initial hidden state
        gsap.set(navArrow, {
          scale: 0,
          opacity: 0,
          rotation: 0,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "center center",
          force3D: true,
        });

        const setArrowX = gsap.quickTo(navArrow, "x", {
          duration: 0.15,
          ease: "power2.out",
        });
        const setArrowY = gsap.quickTo(navArrow, "y", {
          duration: 0.15,
          ease: "power2.out",
        });

        let currentArrowDir = 0; // 0 = UP, 180 = DOWN

        const onMouseEnter = (e: MouseEvent) => {
          const rect = bodyBg.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Snap immediately to cursor coordinates before scaling up
          gsap.set(navArrow, { x: mouseX, y: mouseY });

          const isTopHalf = mouseY < rect.height / 2;
          currentArrowDir = isTopHalf ? 0 : 180;
          gsap.set(navArrow, { rotation: currentArrowDir });

          gsap.to(navArrow, {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };

        const onMouseMove = (e: MouseEvent) => {
          const rect = bodyBg.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          setArrowX(mouseX);
          setArrowY(mouseY);

          // Top half -> Point UP (0deg), Bottom half -> Point DOWN (180deg)
          const isTopHalf = mouseY < rect.height / 2;
          const targetRotation = isTopHalf ? 0 : 180;

          if (currentArrowDir !== targetRotation) {
            currentArrowDir = targetRotation;
            gsap.to(navArrow, {
              rotation: targetRotation,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        const onMouseLeave = () => {
          gsap.to(navArrow, {
            scale: 0,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        bodyBg.addEventListener("mouseenter", onMouseEnter);
        bodyBg.addEventListener("mousemove", onMouseMove);
        bodyBg.addEventListener("mouseleave", onMouseLeave);

        removeNavListeners = () => {
          bodyBg.removeEventListener("mouseenter", onMouseEnter);
          bodyBg.removeEventListener("mousemove", onMouseMove);
          bodyBg.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    }

    // -----------------------------------------------------------------
    // 4. Physical Deck Shuffle: Next (Top -> Bottom) & Prev (Bottom -> Top)
    // -----------------------------------------------------------------
    function reorderZIndices() {
      cardElements.forEach((card, i) => {
        const order = (i - currentIndex + totalCards) % totalCards;
        card.style.zIndex = String(totalCards - order);

        // Background cards reliably maintain their aggressive tilt
        if (i !== currentIndex) {
          gsap.to(card, {
            rotation: cardRotations[i],
            xPercent: 0,
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    }

    function goToNextCard() {
      if (isAnimating || totalCards <= 1) return;
      isAnimating = true;

      const outgoingIndex = currentIndex;
      const outgoingCard = cardElements[outgoingIndex];
      const nextIndex = (currentIndex + 1) % totalCards;
      const incomingCard = cardElements[nextIndex];

      // 1. Straighten incoming card as it becomes the active front card
      gsap.to(incomingCard, {
        rotation: 0,
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // 2. Outgoing card flies UP out of the deck with dynamic tilt
      const tiltOffset = outgoingIndex % 2 === 0 ? 9 : -9;
      gsap.to(outgoingCard, {
        yPercent: -140,
        rotation: cardRotations[outgoingIndex] + tiltOffset,
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          // Once at peak: adjust z-index to bottom of pile
          currentIndex = nextIndex;
          reorderZIndices();
          outgoingCard.style.zIndex = "1";

          // Slide DOWN back into the bottom of the deck
          gsap.to(outgoingCard, {
            yPercent: 0,
            rotation: cardRotations[outgoingIndex],
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
              reorderZIndices();
              isAnimating = false;
            },
          });
        },
      });

      // 3. Update dynamic sidebar ticks
      updateSidebar(nextIndex, true);
    }

    function goToPrevCard() {
      if (isAnimating || totalCards <= 1) return;
      isAnimating = true;

      const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
      const incomingCard = cardElements[prevIndex];
      const currentCard = cardElements[currentIndex];

      // Current active card settles back to its background rotation
      gsap.to(currentCard, {
        rotation: cardRotations[currentIndex],
        xPercent: 0,
        yPercent: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      // 1. Bottom card flies DOWN from behind the deck
      const tiltOffset = prevIndex % 2 === 0 ? 8 : -8;
      gsap.to(incomingCard, {
        yPercent: 120,
        rotation: cardRotations[prevIndex] + tiltOffset,
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          // At bottom: promote to top z-index and set as active
          currentIndex = prevIndex;
          reorderZIndices();
          incomingCard.style.zIndex = String(totalCards + 10);

          // Slide UP onto the top of the deck
          gsap.to(incomingCard, {
            yPercent: 0,
            rotation: 0,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
              reorderZIndices();
              isAnimating = false;
            },
          });
        },
      });

      // 3. Update dynamic sidebar ticks
      updateSidebar(prevIndex, true);
    }

    // -----------------------------------------------------------------
    // 5. Touch Swiping & Gesture Interaction
    // -----------------------------------------------------------------
    let touchStartY = 0;
    let touchStartX = 0;
    let isSwipeAction = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isSwipeAction = false;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const deltaY = touchEndY - touchStartY;
        const deltaX = touchEndX - touchStartX;

        // Trigger swipe if vertical displacement is greater than horizontal and > 30px
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
          isSwipeAction = true;
          if (deltaY < 0) {
            // Swipe UP -> Next Card
            goToNextCard();
          } else {
            // Swipe DOWN -> Prev Card
            goToPrevCard();
          }
        }
      }
    };

    // -----------------------------------------------------------------
    // 6. Click Handler on .testimonials-body-bg (Desktop & Tap)
    // -----------------------------------------------------------------
    const onClick = (e: MouseEvent) => {
      // Prevent trigger if clicking on link/button inside card, or if just swiped
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button") || isSwipeAction) return;

      const rect = bodyBg.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const isTopHalf = clickY < rect.height / 2;

      if (isTopHalf) {
        goToNextCard();
      } else {
        goToPrevCard();
      }
    };

    bodyBg.addEventListener("touchstart", onTouchStart, { passive: true });
    bodyBg.addEventListener("touchend", onTouchEnd, { passive: true });
    bodyBg.addEventListener("click", onClick);

    return () => {
      removeNavListeners();
      bodyBg.removeEventListener("touchstart", onTouchStart);
      bodyBg.removeEventListener("touchend", onTouchEnd);
      bodyBg.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section className="section-testimonials">
      <div className="section-testimonials-wrapper">
        {/* Section Header */}
        <div className="section-projects-header">
          <div className="section-about-text">TESTIMONIALS</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">APPARENTLY, THEY LIKE ME</h2>
          </div>
        </div>

        {/* Stacked Cards Body */}
        <div className="section-testimonials-body">
          <div ref={containerRef} className="testimonials-body-bg">
            <div className="testimonial-list-wrapper w-dyn-list">
              <div role="list" className="testimonial-list w-dyn-items">
                {TESTIMONIALS.map((t, idx) => (
                  <div
                    key={idx}
                    role="listitem"
                    className="testimonial-item w-dyn-item"
                    style={{ zIndex: 5 - idx }}
                  >
                    <div className="testimonial-card">
                      <div className="testimonial-heading">{t.quote}</div>
                      <div className="testimonial-card-btm">
                        <div className="testimonial-card-pfp">
                          <div className="testimonial-img-wrap">
                            <img
                              src={t.avatar}
                              srcSet={t.srcset}
                              sizes="100vw"
                              loading="lazy"
                              alt={t.name}
                              className="image"
                            />
                          </div>
                          <div className="pfp-info-wrapper">
                            <div className="testimonial-pfp-name">{t.name}</div>
                            <div className="testimonial-pfp-designation">
                              {t.position}
                            </div>
                          </div>
                        </div>
                        <p className="testimonial-card-para">{t.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Sidebar Horizontal Ticks */}
            <div ref={sideBarRef} className="side-bar"></div>

            {/* Floating Custom Navigation Arrow Cursor */}
            <div ref={navArrowRef} className="nav-arrow">
              <div className="nav-arrow-svg w-embed">
                <svg
                  width="15"
                  height="18"
                  viewBox="0 0 15 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.17285 16.1729L7.17285 1.17285M1.17285 6.79785L7.17285 1.17285L13.1729 6.79785"
                    stroke="currentColor"
                    strokeWidth="2.34564"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Functional Animation & Container Setup CSS */}
        <div className="testimonial-html w-embed w-script">
          <style
            dangerouslySetInnerHTML={{
              __html: `
                .testimonials-body-bg {
                  position: relative !important;
                  overflow: hidden !important;
                }

                .testimonials-body-bg .w-dyn-list,
                .testimonials-body-bg .testimonial-list-wrapper {
                  position: relative !important;
                  width: 100% !important;
                  height: 100% !important;
                  min-height: 100% !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .testimonials-body-bg .w-dyn-items,
                .testimonials-body-bg .testimonial-list {
                  position: relative !important;
                  width: 100% !important;
                  height: 100% !important;
                  min-height: 100% !important;
                  display: grid !important;
                  place-items: center !important;
                  align-content: center !important;
                  justify-content: center !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .testimonials-body-bg .testimonial-item {
                  grid-area: 1 / 1 !important;
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  bottom: auto !important;
                  margin: auto !important;
                  align-self: center !important;
                  justify-self: center !important;
                  transform-origin: center center !important;
                  will-change: transform !important;
                  backface-visibility: hidden !important;
                }

                .testimonials-body-bg .testimonial-item .testimonial-card,
                .testimonials-body-bg .testimonial-item [class*="testimonial-card"] {
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  bottom: auto !important;
                  margin: 0 auto !important;
                  transform: none !important;
                }
              `,
            }}
          />
        </div>
      </div>
    </section>
  );
}
