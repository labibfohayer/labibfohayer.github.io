"use client";

import React, { useEffect, useRef } from "react";

export default function SliderShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tickFn: any = null;
    let scrollTriggerInstance: any = null;
    let resizeHandler: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const setupMarquee = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;

      if (!gsap) {
        timeoutId = setTimeout(setupMarquee, 50);
        return;
      }

      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      if (!wrapper || !track) return;

      const initialSlides = Array.from(
        track.querySelectorAll(".showcase-slide:not(.is-marquee-clone)")
      ) as HTMLElement[];
      if (!initialSlides.length) return;

      wrapper.setAttribute("data-marquee-initialized", "true");
      wrapper.style.overflow = "hidden";
      wrapper.style.position = "relative";
      wrapper.style.width = "100%";

      track.style.display = "flex";
      track.style.flexDirection = "row";
      track.style.willChange = "transform";
      track.style.width = "max-content";
      track.style.backfaceVisibility = "hidden";
      (track.style as any).transformStyle = "preserve-3d";

      initialSlides.forEach((slide) => {
        slide.style.flexShrink = "0";
        slide.style.willChange = "transform";
        slide.style.transformOrigin = "center center";
        slide.style.backfaceVisibility = "hidden";
        slide.style.transform = "scale(1) translateZ(0)";
      });

      const numInitial = initialSlides.length;

      // Remove any existing clones to prevent duplicates on re-init
      track.querySelectorAll(".is-marquee-clone").forEach((c) => c.remove());

      // Create enough sets so that one full set wrap is always outside the screen both ways
      // Need at least 5 sets so track has plenty of buffer on both left and right
      const setsNeeded = Math.max(
        5,
        Math.ceil(
          (window.innerWidth * 3.5) /
            (initialSlides[0].offsetWidth * numInitial || 1000)
        ) + 2
      );

      for (let s = 1; s < setsNeeded; s++) {
        initialSlides.forEach((slide) => {
          const clone = slide.cloneNode(true) as HTMLElement;
          clone.classList.add("is-marquee-clone");
          clone.style.flexShrink = "0";
          clone.style.willChange = "transform";
          clone.style.transformOrigin = "center center";
          clone.style.backfaceVisibility = "hidden";
          clone.style.transform = "scale(1) translateZ(0)";
          track.appendChild(clone);
        });
      }

      // Ensure all videos play continuously with maximum performance
      track.querySelectorAll("video").forEach((vid) => {
        vid.muted = true;
        vid.setAttribute("playsinline", "");
        vid.setAttribute("preload", "auto");
        vid.play().catch(() => {});
      });

      const allSlides = Array.from(
        track.querySelectorAll(".showcase-slide")
      ) as HTMLElement[];

      let setWidth = 0;
      let wrapperRectLeft = 0;
      let wrapperCenter = 0;
      let halfWidth = 400;
      let slideOffsets: number[] = [];
      let slideHalfWidth = 150;
      let currentX = -2000;
      const currentScales: number[] = new Array(allSlides.length).fill(1);

      function measureAll() {
        if (!wrapper || !track) return;
        if (allSlides.length > numInitial) {
          const firstSlide = allSlides[0];
          const firstClone = allSlides[numInitial];
          if (firstSlide && firstClone) {
            const exactDistance = firstClone.offsetLeft - firstSlide.offsetLeft;
            if (exactDistance > 0) {
              setWidth = exactDistance;
            }
          }
        }

        if (setWidth <= 0) {
          const trackStyle = window.getComputedStyle(track);
          const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
          let total = 0;
          initialSlides.forEach((slide) => {
            const style = window.getComputedStyle(slide);
            const margin =
              parseFloat(style.marginLeft || "0") +
              parseFloat(style.marginRight || "0");
            total +=
              (slide.offsetWidth || slide.getBoundingClientRect().width) +
              margin +
              gap;
          });
          if (total > 0) setWidth = total;
        }

        const rect = wrapper.getBoundingClientRect();
        wrapperRectLeft = rect.left;
        wrapperCenter = rect.left + rect.width / 2;
        halfWidth = rect.width * 0.45 || 400;

        slideOffsets = allSlides.map((slide) => slide.offsetLeft);
        if (initialSlides[0]) {
          slideHalfWidth = (initialSlides[0].offsetWidth || 300) / 2;
        }
        if (setWidth > 0 && currentX === -2000) {
          currentX = -2 * setWidth;
        }
      }

      measureAll();

      const slideImages = track.querySelectorAll("img");
      slideImages.forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", measureAll, { once: true });
        }
      });

      resizeHandler = measureAll;
      window.addEventListener("resize", resizeHandler);

      // Speed Level 3 = 1.60x (+60% / 2.400 px/frame)
      const speedMultiplier = 1.6;
      const BASE_SPEED = 1.5 * speedMultiplier;

      // Base direction is +1 (LEFT TO RIGHT: "bam theke dane")
      let targetDirection = 1;
      let currentDirection = 1;
      let scrollVelocityBoost = 0;

      if (setWidth > 0) {
        currentX = -2 * setWidth;
      }

      const scrollerEl = document.querySelector(".page") || window;

      if (ScrollTrigger) {
        scrollTriggerInstance = ScrollTrigger.create({
          trigger: document.body,
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self: any) => {
            // dir is +1 when scrolling down, -1 when scrolling up
            const dir = self.direction === 1 ? 1 : -1;
            targetDirection = 1; // base idle direction remains left-to-right

            const vel = Math.abs(self.getVelocity() || 0);
            scrollVelocityBoost =
              Math.min(vel / 200, 12 * speedMultiplier) * dir;
          },
        });
      }

      tickFn = () => {
        currentDirection += (targetDirection - currentDirection) * 0.06;
        scrollVelocityBoost *= 0.92;

        const delta = BASE_SPEED * currentDirection + scrollVelocityBoost;
        currentX += delta;

        // Continuous seamless wrapping for left-to-right motion
        if (setWidth > 0) {
          while (currentX > -setWidth) {
            currentX -= setWidth;
          }
          while (currentX < -2 * setWidth) {
            currentX += setWidth;
          }
        }

        // 120 FPS direct GPU transform without reflow
        track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0px, 0px)`;

        // Zero-reflow proximity inverse scaling:
        // Pure arithmetic using pre-measured offsets
        const currentScreenX = wrapperRectLeft + currentX;

        for (let i = 0; i < allSlides.length; i++) {
          const slide = allSlides[i];
          const slideCenter = currentScreenX + slideOffsets[i] + slideHalfWidth;
          const distFromCenter = Math.abs(slideCenter - wrapperCenter);

          if (distFromCenter < halfWidth) {
            const normDist = distFromCenter / halfWidth;
            const targetScale = 0.95 + 0.05 * normDist;
            if (Math.abs(currentScales[i] - targetScale) > 0.001) {
              currentScales[i] = targetScale;
              slide.style.transform = `scale(${targetScale.toFixed(4)}) translateZ(0)`;
            }
          } else if (currentScales[i] !== 1) {
            currentScales[i] = 1;
            slide.style.transform = "scale(1) translateZ(0)";
          }
        }
      };

      gsap.ticker.add(tickFn);
    };

    timeoutId = setTimeout(setupMarquee, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (resizeHandler) window.removeEventListener("resize", resizeHandler);
      const gsap = (window as any).gsap;
      if (gsap && tickFn) {
        gsap.ticker.remove(tickFn);
      }
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-marquee-speed="3"
      className="section-slider-showcase"
    >
      <div
        ref={wrapperRef}
        className="section-slider-wrapper"
        style={{
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          ref={trackRef}
          className="showcase-slider"
          style={{
            display: "flex",
            flexDirection: "row",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {/* Slide 1: Video (Replaced & Zoom to Fill) */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <div
              className="showcase-slide-img w-background-video w-background-video-atom"
              data-autoplay="true"
              data-loop="true"
              data-wf-ignore="true"
              style={{ width: "100%", height: "100%", position: "relative", backgroundColor: "#000000" }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                data-object-fit="cover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  inset: 0,
                  margin: "auto",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  zIndex: 1,
                  backgroundColor: "#000000",
                }}
                poster="/videos/new-vdo-poster.jpg"
              >
                <source
                  src="/home/labib-fohayer/Downloads/New vdo.mp4"
                  type="video/mp4"
                />
                <source
                  src="/videos/new-vdo.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          {/* Slide 2: Shot 2 (Meatology Dog) */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <img
              src="/cdn-assets/6ab263498b14a38a7a109afc_Shot%202.jpg"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              srcSet="/cdn-assets/6ab263498b14a38a7a109afc_Shot%202-p-500.jpg 500w, /cdn-assets/6ab263498b14a38a7a109afc_Shot%202-p-800.jpg 800w, /cdn-assets/6ab263498b14a38a7a109afc_Shot%202-p-1080.jpg 1080w, /cdn-assets/6ab263498b14a38a7a109afc_Shot%202.jpg 1200w"
              alt="Meatology Dog"
              className="showcase-slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Slide 3: Video (Vitabun Probio Kid Gummy Bears) */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <div
              className="showcase-slide-img w-background-video w-background-video-atom"
              data-autoplay="true"
              data-loop="true"
              data-wf-ignore="true"
              style={{ width: "100%", height: "100%", position: "relative" }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                data-object-fit="cover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                poster="/cdn-assets/6ab263f29cc7204d5832b66d_Shot%203_poster.0000000.jpg"
              >
                <source
                  src="/cdn-assets/6ab263f29cc7204d5832b66d_Shot%203_mp4.mp4"
                  type="video/mp4"
                />
                <source
                  src="/cdn-assets/6ab263f29cc7204d5832b66d_Shot%203_webm.webm"
                  type="video/webm"
                />
              </video>
            </div>
          </div>

          {/* Slide 4: Shot 4 */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <img
              src="/cdn-assets/6ab2633da8fa39ec5216880b_Shot%204.jpg"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              srcSet="/cdn-assets/6ab2633da8fa39ec5216880b_Shot%204-p-500.jpg 500w, /cdn-assets/6ab2633da8fa39ec5216880b_Shot%204-p-800.jpg 800w, /cdn-assets/6ab2633da8fa39ec5216880b_Shot%204-p-1080.jpg 1080w, /cdn-assets/6ab2633da8fa39ec5216880b_Shot%204.jpg 1200w"
              alt="Labib Showcase 4"
              className="showcase-slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Slide 5: Shot 5 */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <img
              src="/cdn-assets/6ab2633d3e5b6a35a15d74d7_Shot%205.jpg"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              srcSet="/cdn-assets/6ab2633d3e5b6a35a15d74d7_Shot%205-p-500.jpg 500w, /cdn-assets/6ab2633d3e5b6a35a15d74d7_Shot%205-p-800.jpg 800w, /cdn-assets/6ab2633d3e5b6a35a15d74d7_Shot%205-p-1080.jpg 1080w, /cdn-assets/6ab2633d3e5b6a35a15d74d7_Shot%205.jpg 1200w"
              alt="Labib Showcase 5"
              className="showcase-slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Slide 6: Shot 6 (Wine Bottle Illustration) */}
          <div className="showcase-slide" style={{ flexShrink: 0 }}>
            <img
              src="/cdn-assets/6ab2634dc8995221637e120c_Shot%206.png"
              loading="lazy"
              sizes="(max-width: 1200px) 100vw, 1200px"
              srcSet="/cdn-assets/6ab2634dc8995221637e120c_Shot%206-p-500.png 500w, /cdn-assets/6ab2634dc8995221637e120c_Shot%206-p-800.png 800w, /cdn-assets/6ab2634dc8995221637e120c_Shot%206-p-1080.png 1080w, /cdn-assets/6ab2634dc8995221637e120c_Shot%206.png 1200w"
              alt="Wine Bottle Illustration"
              className="showcase-slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
