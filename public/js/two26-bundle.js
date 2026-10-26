/* Labib Fohayer Production Animation Engine */

window.__two26LoaderDone = true;


/* === SCRIPT 1 === */
!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

/* === SCRIPT 2 === */
(function () {
    function initMagneticHeading() {
      if (typeof gsap === "undefined") return;

      // Find all unique heading wrappers
      const headingWrappers = Array.from(
        document.querySelectorAll(".section-heading-wrapper"),
      );

      if (!headingWrappers.length) {
        const headers = document.querySelectorAll(".section-projects-header");
        headers.forEach((h) => {
          const hw = h.querySelector(".section-heading-wrapper") || h;
          headingWrappers.push(hw);
        });
      }

      if (!headingWrappers.length) return;

      headingWrappers.forEach((headingWrapper) => {
        const headings = headingWrapper.querySelectorAll(".section-heading");
        if (headings.length < 2) return;

        const primaryHeading = headings[0];
        const orangeHeading =
          headingWrapper.querySelector(
            ".section-heading.orange, .section-heading.is-orange, .section-heading[class*='orange']",
          ) || headings[1];

        if (!orangeHeading || orangeHeading === primaryHeading) return;

        // 1. Ensure absolute layering so orange heading sits directly behind black heading
        headingWrapper.style.position = "relative";

        primaryHeading.style.position = "relative";
        primaryHeading.style.zIndex = "2";
        primaryHeading.style.pointerEvents = "none";

        orangeHeading.style.position = "absolute";
        orangeHeading.style.top = "0";
        orangeHeading.style.left = "0";
        orangeHeading.style.width = "100%";
        orangeHeading.style.height = "100%";
        orangeHeading.style.zIndex = "1";
        orangeHeading.style.pointerEvents = "none";
        orangeHeading.style.margin = "0";
        orangeHeading.style.willChange = "transform";

        // 2. Continuous Directional Tracking (1-4px offset)
        const hoverZone =
          headingWrapper.closest(".section-projects-header") ||
          headingWrapper.parentElement ||
          headingWrapper;

        const MAX_OFFSET = 4;

        const handlePointerMove = (e) => {
          const rect = headingWrapper.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;

          const distance = Math.hypot(dx, dy);
          const maxRadius = Math.max(rect.width, rect.height) / 2 || 100;

          // Normalized intensity based on distance from center (1px to 4px)
          const intensity = Math.min(1, Math.max(0.25, distance / maxRadius));
          const angle = Math.atan2(dy, dx);

          const targetX = Math.cos(angle) * (intensity * MAX_OFFSET);
          const targetY = Math.sin(angle) * (intensity * MAX_OFFSET);

          gsap.to(orangeHeading, {
            x: targetX,
            y: targetY,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
          });
        };

        const handlePointerLeave = () => {
          gsap.to(orangeHeading, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });
        };

        hoverZone.addEventListener("pointermove", handlePointerMove, {
          passive: true,
        });
        hoverZone.addEventListener("pointerleave", handlePointerLeave);
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initMagneticHeading);
    } else {
      initMagneticHeading();
    }
  })();

/* === SCRIPT 3 === */
(function () {
    // -------------------------------------------------------------
    // Universal Hook: Allows Hero / Page scripts to sync with Loader
    // -------------------------------------------------------------
    window.onTwo26Ready = function (callback) {
      if (typeof callback !== "function") return;
      if (window.__two26LoaderDone) {
        callback();
      } else {
        document.addEventListener("two26:loaderComplete", callback, {
          once: true,
        });
      }
    };

    function notifyLoaderComplete() {
      window.__two26LoaderDone = true;
      // Expose completion via a data attribute for easier downstream checks
      document.body.setAttribute("data-two26-loader-done", "true");
      document.dispatchEvent(new CustomEvent("two26:loaderComplete"));
    }

    function initTwo26PageLoader() {
      // Hard safety check: If GSAP fails to load (CDN issue / adblocker / script order), never lock user out
      if (typeof gsap === "undefined") {
        const fallbackLoader = document.querySelector(
          ".loader, [data-loader='two26']",
        );
        if (fallbackLoader) {
          fallbackLoader.style.display = "none";
          fallbackLoader.style.pointerEvents = "none";
        }
        const fallbackElements = document.querySelectorAll(
          ".logo-animation, .loader-inner svg, .two26-logo-svg",
        );
        fallbackElements.forEach((el) => {
          el.style.visibility = "visible";
        });
        document.body.style.overflow = "";
        notifyLoaderComplete();
        return;
      }

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

      // -------------------------------------------------------------
      // 0. Session Navigation & Accessibility Checks
      // -------------------------------------------------------------
      const loader = document.querySelector(".loader, [data-loader='two26']");
      if (!loader) {
        notifyLoaderComplete();
        return;
      }

      // Accessibility: Skip animation immediately if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReducedMotion) {
        loader.style.display = "none";
        loader.style.pointerEvents = "none";
        notifyLoaderComplete();
        return;
      }

      // Determine if this is a hard refresh using modern Navigation Timing API
      const navEntries = performance.getEntriesByType("navigation");
      const navigationEntry = navEntries.length > 0 ? navEntries[0] : null;
      const isReload = navigationEntry && navigationEntry.type === "reload";
      // Fallback for older browsers using deprecated performance.navigation.type
      const isReloadLegacy =
        typeof performance.navigation !== "undefined" &&
        performance.navigation.type === 1;
      const wasNavigated = sessionStorage.getItem("two26_navigated") === "true";

      // Always register click handler so every page marks the NEXT navigation,
      // regardless of whether the loader played or was skipped on THIS page.
      document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;
        const href = link.getAttribute("href");
        if (
          href &&
          !href.startsWith("#") &&
          !href.startsWith("mailto:") &&
          !href.startsWith("tel:") &&
          link.target !== "_blank" &&
          !link.hasAttribute("download") &&
          link.origin === window.location.origin
        ) {
          sessionStorage.setItem("two26_navigated", "true");
        }
      });

      // If user navigated internally from another page AND it is NOT a hard reload -> SKIP LOADER
      if (wasNavigated && !(isReload || isReloadLegacy)) {
        sessionStorage.removeItem("two26_navigated");
        loader.style.display = "none";
        loader.style.pointerEvents = "none";
        notifyLoaderComplete();
        return;
      }

      // Clear flag so next reload on this page plays the loader

      // -------------------------------------------------------------
      // 1. Elements Selection
      // -------------------------------------------------------------

      const bgStrokeContainer = loader.querySelector(
        ".svg-bg-stroke, .loader-bg-svg, .loader-bg",
      );
      const bgSvg = bgStrokeContainer
        ? bgStrokeContainer.querySelector("svg")
        : null;
      const bgPaths = bgSvg ? Array.from(bgSvg.querySelectorAll("path")) : [];

      // Path 0: Orange (#FF5400) | Path 1: Light Pink (#F9E2E1)
      const pathOrangeBg = bgPaths[0] || null;
      const pathPinkBg = bgPaths[1] || null;

      const logoContainer = loader.querySelector(
        ".loader-inner, .logo-animation",
      );
      const logoSvg = loader.querySelector(
        ".two26-logo-svg, .logo-reveal-svg, svg[data-logo='two26'], .logo-animation svg, .loader-inner svg",
      );

      // Lock scrolling during loader
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // -------------------------------------------------------------
      // 2. Initial Setup for Background Strokes
      // -------------------------------------------------------------
      // Start with stroke-width 3000px so both paths solidly cover screen
      const BG_STROKE_WIDTH_START = 3000;
      const BG_STROKE_WIDTH_END = 1000;

      if (pathOrangeBg) {
        pathOrangeBg.style.strokeLinecap = "round";
        pathOrangeBg.setAttribute("stroke-linecap", "round");
        if (hasDrawSVG) {
          gsap.set(pathOrangeBg, {
            x: 0,
            y: 0,
            drawSVG: "0% 100%",
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        } else {
          const len0 = pathOrangeBg.getTotalLength
            ? pathOrangeBg.getTotalLength()
            : 3000;
          pathOrangeBg.style.strokeDasharray = len0;
          pathOrangeBg.style.strokeDashoffset = 0;
          gsap.set(pathOrangeBg, {
            x: 0,
            y: 0,
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        }
      }

      if (pathPinkBg) {
        pathPinkBg.style.strokeLinecap = "round";
        pathPinkBg.setAttribute("stroke-linecap", "round");
        if (hasDrawSVG) {
          gsap.set(pathPinkBg, {
            x: 0,
            y: 0,
            drawSVG: "0% 100%",
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        } else {
          const len1 = pathPinkBg.getTotalLength
            ? pathPinkBg.getTotalLength()
            : 3000;
          pathPinkBg.style.strokeDasharray = len1;
          pathPinkBg.style.strokeDashoffset = 0;
          gsap.set(pathPinkBg, {
            x: 0,
            y: 0,
            strokeWidth: BG_STROKE_WIDTH_START,
          });
        }
      }

      // -------------------------------------------------------------
      // 3. Initial Setup for Logo SVG Paths
      // -------------------------------------------------------------
      let logoTimeline = null;

      if (logoSvg) {
        const paths = Array.from(logoSvg.querySelectorAll("path"));
        if (paths.length >= 6) {
          const pathRibbon = paths[0]; // Ribbon tracer
          const letter2 = paths[1]; // 2 (bottom)
          const letter6 = paths[2]; // 6 (bottom)
          const pathW = paths[3]; // W stroke
          const letterT = paths[4]; // T
          const letterO = paths[5]; // O

          const letters = [letterT, letterO, letter2, letter6];

          // Ribbon setup
          if (pathRibbon) {
            pathRibbon.style.strokeLinecap = "round";
            pathRibbon.style.strokeLinejoin = "round";
            if (hasDrawSVG) {
              gsap.set(pathRibbon, { drawSVG: "0% 0%", strokeWidth: 0 });
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              pathRibbon.style.strokeDasharray = `${len * 0.05} ${len}`;
              pathRibbon.style.strokeDashoffset = len;
              gsap.set(pathRibbon, { strokeWidth: 0 });
            }
          }

          // W stroke setup
          if (pathW) {
            pathW.style.strokeLinecap = "butt";
            pathW.style.strokeLinejoin = "miter";
            pathW.setAttribute("stroke-linecap", "butt");
            pathW.setAttribute("stroke-linejoin", "miter");
            if (hasDrawSVG) {
              gsap.set(pathW, { drawSVG: "0%", strokeWidth: 19 });
            } else {
              const lenW = pathW.getTotalLength ? pathW.getTotalLength() : 800;
              pathW.style.strokeDasharray = lenW;
              pathW.style.strokeDashoffset = lenW;
              gsap.set(pathW, { strokeWidth: 19 });
            }
          }

          // Letters setup with GSAP svgOrigin
          letters.forEach((letter) => {
            if (!letter) return;
            const randomAngle = gsap.utils.random(-25, 25);
            letter.setAttribute("stroke", "#FF5400");
            letter.setAttribute("stroke-linejoin", "round");
            const bbox = letter.getBBox();
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            gsap.set(letter, {
              scale: 0,
              rotation: randomAngle,
              strokeWidth: 6,
              svgOrigin: `${cx} ${cy}`,
            });
          });

          // Reveal SVG / logo now that all initial zeroed states are applied (prevents FOUC)
          if (logoSvg) {
            logoSvg.style.visibility = "visible";
          }
          const logoWrappers = loader.querySelectorAll(
            ".logo-animation, .two26-logo-svg",
          );
          logoWrappers.forEach((el) => {
            el.style.visibility = "visible";
          });

          // Build the Kinetic Logo Reveal Timeline (1.25x speed / 25% faster)
          logoTimeline = gsap.timeline({ delay: 0.25 }).timeScale(1.25);

          // Step A: Ribbon stroke growth and travel to W
          if (pathRibbon) {
            if (hasDrawSVG) {
              logoTimeline
                .to(
                  pathRibbon,
                  {
                    strokeWidth: 19,
                    duration: 1,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    drawSVG: "0% 7%",
                    duration: 0.7,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    drawSVG: "40% 47%",
                    duration: 1.2,
                    ease: "none",
                  },
                  0.7,
                );
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              logoTimeline
                .to(
                  pathRibbon,
                  {
                    strokeWidth: 19,
                    duration: 1,
                    ease: "power2.in",
                  },
                  0,
                )
                .to(
                  pathRibbon,
                  {
                    strokeDashoffset: len * 0.6,
                    duration: 1.9,
                    ease: "power1.inOut",
                  },
                  0,
                );
            }
          }

          // Step B: Standalone W stroke draws
          if (pathW) {
            if (hasDrawSVG) {
              logoTimeline.to(
                pathW,
                {
                  drawSVG: "100%",
                  duration: 1.1,
                  ease: "power2.out",
                },
                "-=0.4",
              );
            } else {
              logoTimeline.to(
                pathW,
                {
                  strokeDashoffset: 0,
                  duration: 1.1,
                  ease: "power2.out",
                },
                "-=0.4",
              );
            }
          }

          // Step C: Ribbon departs and strokeWidth drops
          if (pathRibbon) {
            if (hasDrawSVG) {
              logoTimeline.to(
                pathRibbon,
                {
                  drawSVG: "100% 100%",
                  duration: 1.1,
                  ease: "power2.inOut",
                },
                "-=0.5",
              );
              logoTimeline.to(
                pathRibbon,
                {
                  strokeWidth: 0,
                  duration: 0.5,
                  ease: "power2.in",
                },
                "-=0.55",
              );
            } else {
              const len = pathRibbon.getTotalLength
                ? pathRibbon.getTotalLength()
                : 2500;
              logoTimeline.to(
                pathRibbon,
                {
                  strokeDashoffset: -len * 0.05,
                  duration: 1.1,
                  ease: "power2.inOut",
                },
                "-=0.5",
              );
              logoTimeline.to(
                pathRibbon,
                {
                  strokeWidth: 0,
                  duration: 0.5,
                  ease: "power2.in",
                },
                "-=0.55",
              );
            }
          }

          // Step D: Shift entire SVG upward to center the full logo
          const allContentPaths = [pathW, letterT, letterO, letter2, letter6];
          let minY = Infinity,
            maxY = -Infinity;
          allContentPaths.forEach((p) => {
            if (!p) return;
            const b = p.getBBox();
            if (b.y < minY) minY = b.y;
            if (b.y + b.height > maxY) maxY = b.y + b.height;
          });
          const viewBoxHeight = 1004;
          const contentCenterY = (minY + maxY) / 2;
          const viewBoxCenterY = viewBoxHeight / 2;
          const offsetSVGUnits = contentCenterY - viewBoxCenterY;
          const svgRect = logoSvg.getBoundingClientRect();
          const scaleRatio =
            svgRect.height > 0 ? svgRect.height / viewBoxHeight : 1;
          const offsetPx = offsetSVGUnits * scaleRatio;

          logoTimeline.to(
            logoSvg,
            {
              y: -offsetPx,
              duration: 0.8,
              ease: "power2.inOut",
            },
            "+=0.1",
          );

          // Step E: Staggered bouncy pop-in for letters T, O, 2, 6
          logoTimeline.to(
            letters,
            {
              scale: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(3)",
            },
            "-=0.2",
          );
          logoTimeline.to(
            letters,
            {
              strokeWidth: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power1.in",
            },
            "<",
          );
        }
      }

      // -------------------------------------------------------------
      // 4. Loading State & Exit Animation Handler
      // -------------------------------------------------------------
      let isWindowLoaded = document.readyState === "complete";
      let isLogoDone = false;

      if (!isWindowLoaded) {
        window.addEventListener("load", () => {
          isWindowLoaded = true;
          checkAndTriggerExit();
        });
      }

      if (logoTimeline) {
        logoTimeline.eventCallback("onComplete", () => {
          isLogoDone = true;
          checkAndTriggerExit();
        });
      } else {
        // Fallback timer if no logo animation found
        setTimeout(() => {
          isLogoDone = true;
          checkAndTriggerExit();
        }, 2000);
      }

      let exitTriggered = false;

      // Hard safety timeout: if window.load or any third-party script hangs, force exit after 6s
      setTimeout(() => {
        if (!exitTriggered) {
          isWindowLoaded = true;
          isLogoDone = true;
          checkAndTriggerExit();
        }
      }, 6000);

      function checkAndTriggerExit() {
        // Only trigger exit when BOTH minimum animation duration is met AND page is loaded
        if (isLogoDone && isWindowLoaded && !exitTriggered) {
          exitTriggered = true;
          runLoaderExitSequence();
        }
      }

      // -------------------------------------------------------------
      // 5. Exit Sequence (Pink Wipe -> Orange Wipe -> Page Reveal)
      // -------------------------------------------------------------
      function runLoaderExitSequence() {
        const exitTl = gsap.timeline({
          onComplete: () => {
            // Restore scrolling
            document.body.style.overflow = originalOverflow;
            loader.style.display = "none";
            loader.style.pointerEvents = "none";

            // Refresh ScrollTrigger so all page animations sync accurately
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.refresh();
            }

            // Notify all hero / page entrance animations that loader is finished
            notifyLoaderComplete();
          },
        });

        // Small hold so user enjoys the complete logo for a moment
        exitTl.to({}, { duration: 0.2 });

        // Phase 1: Light Pink Stroke (#F9E2E1, Path 1) slithers down & right out of viewport (doubled speed)
        const SWEEP_DURATION = 0.65;

        if (pathPinkBg) {
          if (hasDrawSVG) {
            exitTl.to(
              pathPinkBg,
              {
                drawSVG: "50% 100%",
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: 900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart",
            );
          } else {
            const len1 = pathPinkBg.getTotalLength
              ? pathPinkBg.getTotalLength()
              : 3000;
            exitTl.to(
              pathPinkBg,
              {
                strokeDashoffset: -len1 * 0.5,
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: 900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart",
            );
          }
        }

        // Logo fades seamlessly into the Orange layer as Pink sweeps past 25%
        if (logoContainer || logoSvg) {
          exitTl.to(
            logoContainer || logoSvg,
            {
              opacity: 0,
              duration: 0.15,
              ease: "power1.out",
            },
            "pinkStart+=" + SWEEP_DURATION * 0.2,
          );
        }

        // Phase 2: Orange Stroke (#FF5400, Path 0) slithers down & left out of viewport (starts at 25% of pink)
        if (pathOrangeBg) {
          if (hasDrawSVG) {
            exitTl.to(
              pathOrangeBg,
              {
                drawSVG: "50% 100%",
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: -900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart+=" + SWEEP_DURATION * 0.25, // Exactly 25% into the pink animation
            );
          } else {
            const len0 = pathOrangeBg.getTotalLength
              ? pathOrangeBg.getTotalLength()
              : 3000;
            exitTl.to(
              pathOrangeBg,
              {
                strokeDashoffset: -len0 * 0.5,
                strokeWidth: BG_STROKE_WIDTH_END,
                y: 1800,
                x: -900,
                duration: SWEEP_DURATION,
                ease: "power2.inOut",
              },
              "pinkStart+=" + SWEEP_DURATION * 0.25,
            );
          }
        }
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26PageLoader);
    } else {
      initTwo26PageLoader();
    }
  })();

/* === SCRIPT 4 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 5 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 6 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".cta-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 7 === */
(function () {
    function initTwo26MobileSystem() {
      if (typeof gsap === "undefined") return;

      const hamNavbar = document.querySelector(".ham-navbar");
      const toggleButtons = Array.from(
        document.querySelectorAll(
          ".two26-nav-toggle-btn, .two26-toggle-btn, .menu-btn, .nav-toggle, [data-menu-toggle]",
        ),
      );

      let isMenuOpen = false;
      let navTimeline = null;
      let iconTimeline = null;

      // -------------------------------------------------------------
      // 1. Setup Toggle SVG Morphing Timeline (Horseshoe <-> 45deg Cross)
      // -------------------------------------------------------------
      const svgEls = Array.from(
        document.querySelectorAll(".two26-toggle-svg, .target-svg"),
      );

      let orangePath = null;
      let crossPath = null;
      let orangeTotalLen = 0;
      let crossTotalLen = 20;
      let horseshoeLen = 0;
      let stemLen = 20.0;
      let finalOffset = 0;
      let dashObj = null;

      if (svgEls.length) {
        const primarySvg = svgEls[0];
        orangePath =
          primarySvg.querySelector(".orange-path") ||
          primarySvg.querySelectorAll("path")[0];
        crossPath =
          primarySvg.querySelector(".cross-path") ||
          primarySvg.querySelectorAll("path")[1];

        if (orangePath && crossPath) {
          orangeTotalLen = orangePath.getTotalLength();
          crossTotalLen = crossPath.getTotalLength() || 20;

          horseshoeLen = orangeTotalLen * 0.44;
          for (let len = 0; len < orangeTotalLen; len += 0.2) {
            const pt = orangePath.getPointAtLength(len);
            if (len > 30 && pt.x <= 9.05 && Math.abs(pt.y - 16.02) < 0.3) {
              horseshoeLen = len;
              break;
            }
          }

          finalOffset = -(orangeTotalLen - stemLen);

          // Initial SVG state
          svgEls.forEach((svg) => {
            const op =
              svg.querySelector(".orange-path") ||
              svg.querySelectorAll("path")[0];
            const cp =
              svg.querySelector(".cross-path") ||
              svg.querySelectorAll("path")[1];
            if (op) {
              op.style.strokeDasharray = `${horseshoeLen} ${orangeTotalLen}`;
              op.style.strokeDashoffset = "0";
            }
            if (cp) {
              cp.style.strokeDasharray = `${crossTotalLen} ${crossTotalLen}`;
              cp.style.strokeDashoffset = `${crossTotalLen}`;
              gsap.set(cp, { strokeWidth: 0 });
            }
            gsap.set(svg, { rotation: 0, transformOrigin: "center center" });
          });

          iconTimeline = gsap.timeline({ paused: true });
          dashObj = { len: horseshoeLen, offset: 0 };

          iconTimeline
            .to(
              dashObj,
              {
                len: stemLen,
                offset: finalOffset,
                duration: 0.85,
                ease: "power2.inOut",
                onUpdate: () => {
                  svgEls.forEach((svg) => {
                    const op =
                      svg.querySelector(".orange-path") ||
                      svg.querySelectorAll("path")[0];
                    if (op) {
                      op.style.strokeDasharray = `${dashObj.len} ${orangeTotalLen}`;
                      op.style.strokeDashoffset = `${dashObj.offset}`;
                    }
                  });
                },
              },
              0,
            )
            .to(
              svgEls
                .map(
                  (svg) =>
                    svg.querySelector(".cross-path") ||
                    svg.querySelectorAll("path")[1],
                )
                .filter(Boolean),
              {
                strokeWidth: 4,
                duration: 0.12,
                ease: "back.out(2)",
              },
              0.1,
            )
            .to(
              svgEls
                .map(
                  (svg) =>
                    svg.querySelector(".cross-path") ||
                    svg.querySelectorAll("path")[1],
                )
                .filter(Boolean),
              {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.out",
              },
              0.2,
            )
            .to(
              svgEls,
              {
                rotation: 45,
                duration: 0.85,
                ease: "power3.inOut",
              },
              0,
            );
        }
      }

      // -------------------------------------------------------------
      // 2. Setup Fullscreen Menu Entrance & Stagger Links
      // -------------------------------------------------------------
      const linksContainer = hamNavbar
        ? hamNavbar.querySelector(".hamburger-links")
        : null;
      const linkItems = linksContainer
        ? Array.from(linksContainer.children)
        : [];

      function openMenu() {
        if (isMenuOpen) return;
        isMenuOpen = true;

        // Play Icon Morph
        if (iconTimeline) iconTimeline.play();

        if (hamNavbar) {
          document.body.style.overflow = "hidden";
          hamNavbar.classList.add("is-open");
          hamNavbar.style.display = "flex";
          hamNavbar.style.pointerEvents = "auto";

          if (navTimeline) navTimeline.kill();
          navTimeline = gsap.timeline();

          navTimeline.fromTo(
            hamNavbar,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: "power2.out" },
            0,
          );

          if (linkItems.length) {
            linkItems.forEach((item, index) => {
              const randomTilt = gsap.utils.random(-10, 10);
              navTimeline.fromTo(
                item,
                {
                  opacity: 0,
                  x: -35,
                  y: 50,
                  scale: 0.4,
                  rotation: randomTilt,
                },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 0.75,
                  ease: "back.out(2.2)", // Signature TWO 26 spring bounce
                },
                0.15 + index * 0.09,
              );
            });
          }
        }
      }

      function closeMenu() {
        if (!isMenuOpen) return;

        // Reverse Icon Morph
        if (iconTimeline) iconTimeline.reverse();

        if (hamNavbar) {
          if (navTimeline) navTimeline.kill();
          navTimeline = gsap.timeline({
            onComplete: () => {
              hamNavbar.classList.remove("is-open");
              hamNavbar.style.display = "none";
              hamNavbar.style.pointerEvents = "none";
              document.body.style.overflow = "";
              isMenuOpen = false;
            },
          });

          if (linkItems.length) {
            navTimeline.to(
              linkItems,
              {
                opacity: 0,
                y: 20,
                scale: 0.8,
                duration: 0.25,
                stagger: 0.04,
                ease: "power2.in",
              },
              0,
            );
          }

          navTimeline.to(
            hamNavbar,
            { opacity: 0, duration: 0.3, ease: "power2.inOut" },
            0.1,
          );
        } else {
          isMenuOpen = false;
        }
      }

      function toggleMenu(e) {
        if (e) e.stopPropagation();
        if (isMenuOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }

      // -------------------------------------------------------------
      // 3. Event Listeners
      // -------------------------------------------------------------
      toggleButtons.forEach((btn) => {
        if (!btn.__two26Bound) {
          btn.__two26Bound = true;
          btn.addEventListener("click", toggleMenu);
        }
      });

      // Close when clicking on any link inside the menu
      linkItems.forEach((item) => {
        const clickable =
          item.tagName.toLowerCase() === "a" ? item : item.querySelector("a");
        if (clickable) {
          clickable.addEventListener("click", () => {
            closeMenu();
          });
        }
      });

      // Global API
      window.__two26MobileMenu = {
        open: openMenu,
        close: closeMenu,
        toggle: toggleMenu,
        isOpen: () => isMenuOpen,
      };
    }

    // Defensive loading with GSAP polling
    function safeInit() {
      if (typeof gsap !== "undefined") {
        initTwo26MobileSystem();
      } else {
        let count = 0;
        const checkGsap = setInterval(() => {
          count++;
          if (typeof gsap !== "undefined") {
            clearInterval(checkGsap);
            initTwo26MobileSystem();
          } else if (count > 40) {
            clearInterval(checkGsap);
          }
        }, 80);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", safeInit);
    } else {
      safeInit();
    }

    window.addEventListener("load", safeInit);

    if (window.Webflow) {
      window.Webflow.push(function () {
        safeInit();
      });
    }
  })();

/* === SCRIPT 8 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 9 === */
(function () {
    function initNavbarBtns() {
      if (typeof gsap === 'undefined') return;

      if (typeof DrawSVGPlugin !== 'undefined') {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const buttons = document.querySelectorAll('.navbar-link-btn');

      buttons.forEach((btn) => {
        const svgs = btn.querySelectorAll('svg');
        svgs.forEach((svg) => {
          svg.style.overflow = 'visible';
          svg.style.width = '100%';
          svg.style.height = '100%';
        });

        const paths = btn.querySelectorAll('.stroke-fill path, .stroke-fill-code path, svg path');
        if (!paths.length) return;

        const strokeFill = btn.querySelector('.stroke-fill');
        if (strokeFill) strokeFill.style.pointerEvents = 'none';

        paths.forEach((path) => {
          path.style.strokeLinecap = 'round';
          path.style.strokeLinejoin = 'round';

          const targetStrokeWidth = parseFloat(path.getAttribute('stroke-width')) || 36;

          gsap.set(path, {
            drawSVG: '0%',
            strokeWidth: 0,
          });

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: 'power1.inOut' },
          });

          tl.to(path, {
            drawSVG: '100%',
            strokeWidth: targetStrokeWidth,
            duration: 0.5,
          });

          btn.addEventListener('mouseenter', () => tl.timeScale(1).play());
          btn.addEventListener('mouseleave', () => tl.timeScale(1.4).reverse());
        });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initNavbarBtns);
    } else {
      initNavbarBtns();
    }
  })();

/* === SCRIPT 10 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".cta-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 11 === */
(function () {
    function initTwo26ContactModal() {
      // 1. Defensive verification for GSAP & DrawSVG / SplitText
      if (typeof gsap === "undefined") return;

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const contactPage = document.querySelector(
        ".contact-page, [data-contact-page]",
      );
      if (!contactPage) return;

      const closeBtn = document.querySelector(
        ".close-btn, .close-btn-wrapper a, [data-contact-close]",
      );
      const openTriggers = Array.from(
        document.querySelectorAll(
          "[data-contact-trigger], .cta-btn, .nav-btn, a[href='#contact'], a[href*='contact']",
        ),
      ).filter(
        (btn) =>
          !btn.closest(".contact-page") &&
          !btn.classList.contains("close-btn") &&
          !btn.hasAttribute("data-contact-close"),
      );

      // Elements inside contact-page
      const contactNavbar = contactPage.querySelector(".contact-navbar");
      const contactContent = contactPage.querySelector(".contact-content");
      const contactHeadings = Array.from(
        contactPage.querySelectorAll(".contact-heading, .contact-left h2"),
      );
      const contactParas = Array.from(
        contactPage.querySelectorAll(".contact-para, .contact-left p"),
      );
      const emailHeadings = Array.from(
        contactPage.querySelectorAll(
          ".email-heading, .contact-right .email-heading",
        ),
      );
      const emailLinks = Array.from(
        contactPage.querySelectorAll(".email-link, a[href^='mailto:']"),
      );
      const contactSocials = Array.from(
        contactPage.querySelectorAll(".contact-social"),
      );
      const contactImg = contactPage.querySelector(
        ".contact-img, .contact-img-wrap img, .contact-img-wrap",
      );
      const transitionPaths = Array.from(
        contactPage.querySelectorAll(
          ".contact-transition svg path, .svg-tcontact svg path, .contact-transition path, .svg-tcontact path",
        ),
      );

      let isOpen = false;
      let openTl = null;

      // -----------------------------------------------------------------
      // 2. Prepare SplitText Masks & Initial States
      // -----------------------------------------------------------------

      // A. Contact Left Headings (Reduced-playfulness kinetic pop)
      let headingChars = [];
      contactHeadings.forEach((heading) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(heading, {
            type: "chars,words",
            charsClass: "contact-heading-char",
          });
          headingChars = headingChars.concat(split.chars);
        } else {
          const words = heading.textContent.trim().split(" ");
          heading.innerHTML = words
            .map(
              (w) =>
                `<span style="display:inline-block;">` +
                w
                  .split("")
                  .map((c) => `<span class="contact-heading-char">${c}</span>`)
                  .join("") +
                `</span>`,
            )
            .join(" ");
          headingChars = headingChars.concat(
            Array.from(heading.querySelectorAll(".contact-heading-char")),
          );
        }
      });

      // B. Contact Left Paragraph Lines
      let paraLines = [];
      contactParas.forEach((para) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(para, {
            type: "lines",
            linesClass: "contact-para-line",
          });
          split.lines.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "contact-para-line-mask";
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          });
          paraLines = paraLines.concat(split.lines);
        } else {
          const raw = para.innerHTML.trim();
          para.innerHTML = `<span class="contact-para-line-mask"><span class="contact-para-line">${raw}</span></span>`;
          paraLines = paraLines.concat(
            Array.from(para.querySelectorAll(".contact-para-line")),
          );
        }
      });

      // C. Contact Right Email Headings (Single-line word slide up with overflow hidden)
      let emailHeadingWords = [];
      emailHeadings.forEach((eh) => {
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(eh, {
            type: "words",
            wordsClass: "contact-word",
          });
          split.words.forEach((word) => {
            const mask = document.createElement("span");
            mask.className = "contact-word-mask";
            mask.style.display = "inline-block";
            word.parentNode.insertBefore(mask, word);
            mask.appendChild(word);
          });
          emailHeadingWords = emailHeadingWords.concat(split.words);
        } else {
          const raw = eh.textContent.trim().split(" ");
          eh.innerHTML = raw
            .map(
              (w) =>
                `<span class="contact-word-mask" style="display:inline-block; margin-right:0.25em;"><span class="contact-word">${w}</span></span>`,
            )
            .join("");
          emailHeadingWords = emailHeadingWords.concat(
            Array.from(eh.querySelectorAll(".contact-word")),
          );
        }
      });

      // D. Contact Right Email Links (Letter-by-Letter Split + Kinetic Hover, NO overflow hidden)
      emailLinks.forEach((el) => {
        // Split text nodes into characters for kinetic hover
        Array.from(el.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0
          ) {
            const span = document.createElement("span");
            span.className = "contact-email-text-wrap";
            span.style.display = "inline-block";

            const raw = node.textContent;
            span.innerHTML = raw
              .split("")
              .map((c) => {
                if (c === " ") return "&nbsp;";
                return `<span class="contact-email-char">${c}</span>`;
              })
              .join("");

            node.parentNode.replaceChild(span, node);
          }
        });

        const chars = Array.from(el.querySelectorAll(".contact-email-char"));
        if (!chars.length) return;

        // Hover In: Kinetic letter pop with random tilt, scale & bold shadow
        el.addEventListener("mouseenter", () => {
          chars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-7, 7);
            const charDelay = idx * 0.035;

            // Phase 1: Letter pop
            gsap.to(char, {
              scale: 1.14,
              rotation: randomTilt,
              textShadow:
                "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
              duration: 0.38,
              delay: charDelay,
              ease: "back.out(1.8)",
              overwrite: "auto",
              onComplete: () => {
                // Phase 2: Gentle settle
                gsap.to(char, {
                  scale: 1,
                  rotation: 0,
                  textShadow: "0px 0px 0px rgba(0,0,0,0)",
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
            });
          });
        });

        // Hover Out: Smooth return
        el.addEventListener("mouseleave", () => {
          gsap.to(chars, {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.35,
            stagger: 0.018,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });

      // Navbar Logo & Close Button
      const contactLogo = contactNavbar
        ? contactNavbar.querySelector(
            ".navbar-logo-contact, .logo-svg, a[class*='logo'], .navbar-logo-cont",
          )
        : null;

      const closeBtnText = closeBtn
        ? closeBtn.querySelector(
            ".back-btn-txt, [class*='txt'], [class*='text'], span",
          )
        : null;

      // -----------------------------------------------------------------
      // 3. Reset All Elements to Fresh Initial State
      // -----------------------------------------------------------------
      function resetModalElements() {
        if (openTl) openTl.kill();

        // Ensure parent wrappers are fully visible and clean
        if (contactContent) {
          gsap.set(contactContent, { opacity: 1, y: 0 });
        }
        if (contactNavbar) {
          gsap.set(contactNavbar, { opacity: 1, y: 0 });
        }
        if (contactLogo) {
          gsap.set(contactLogo, {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            transformOrigin: "center center",
          });
        }
        if (closeBtn) {
          gsap.set(closeBtn, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          if (closeBtnText) {
            gsap.set(closeBtnText, {
              opacity: 0,
              y: 15,
              display: "inline-block",
            });
          }
        }

        if (transitionPaths.length) {
          transitionPaths.forEach((path) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            gsap.set(path, {
              strokeDasharray: totalLen,
              strokeDashoffset: totalLen,
              strokeWidth: "0px",
            });
          });
        }

        if (headingChars.length) {
          gsap.set(headingChars, {
            opacity: 0,
            scale: 0.5,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
          });
        }

        if (paraLines.length) {
          gsap.set(paraLines, { y: "115%", opacity: 0 });
        }

        if (emailHeadingWords.length) {
          gsap.set(emailHeadingWords, { y: "105%", opacity: 0 });
        }

        if (emailLinks.length) {
          gsap.set(emailLinks, { opacity: 0, y: 15 });
        }

        const emailChars = contactPage.querySelectorAll(".contact-email-char");
        if (emailChars.length) {
          gsap.set(emailChars, {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
          });
        }

        if (contactSocials.length) {
          gsap.set(contactSocials, {
            opacity: 0,
            scale: 0.4,
            y: 20,
            transformOrigin: "center center",
          });
          contactSocials.forEach((pill) => {
            const pillText = pill.querySelector(
              ".contact-social-link, [class*='link'], [class*='text'], span",
            );
            if (pillText) {
              gsap.set(pillText, {
                opacity: 0,
                y: 15,
                display: "inline-block",
              });
            }
          });
        }

        if (contactImg) {
          gsap.set(contactImg, {
            opacity: 0,
            scale: 0.8,
            x: 0,
            y: 0,
            yPercent: 0,
            xPercent: 0,
            rotation: gsap.utils.random(-3, 3),
            transformOrigin: "bottom center",
          });
        }
      }

      resetModalElements();

      // -----------------------------------------------------------------
      // 4. Open Timeline Execution (Slow, Silky Pace + 1600px strokeWidth)
      // -----------------------------------------------------------------
      function openContactModal() {
        if (isOpen) return;
        isOpen = true;

        // Display modal overlay
        contactPage.classList.add("is-active");
        contactPage.style.display = "flex";
        contactPage.style.visibility = "visible";
        contactPage.style.pointerEvents = "auto";

        resetModalElements();

        openTl = gsap.timeline();

        // Step 1: Transition SVG Draw & Stroke Expansion (0 to 1600px)
        if (transitionPaths.length) {
          transitionPaths.forEach((path, i) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            openTl.fromTo(
              path,
              { strokeDashoffset: totalLen, strokeWidth: "0px" },
              {
                strokeDashoffset: 0,
                strokeWidth: "1600px",
                duration: 0.9,
                ease: "power2.inOut",
              },
              i * 0.1,
            );
          });
        }

        const contentStart = transitionPaths.length ? 0.45 : 0;

        // Step 2: Navbar Logo (Bounce Scale 0 -> 1) & Close Button (Pill Pop + Text Slide)
        if (contactLogo) {
          openTl.to(
            contactLogo,
            {
              scale: 1,
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "back.out(2.2)",
            },
            contentStart,
          );
        }

        if (closeBtn) {
          openTl.to(
            closeBtn,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.7,
              ease: "back.out(2.5)",
            },
            contentStart + 0.1,
          );

          if (closeBtnText) {
            openTl.to(
              closeBtnText,
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "back.out(1.6)",
              },
              contentStart + 0.22,
            );
          }
        }

        // Step 3: Contact Left Heading (Kinetic Letter Pop)
        if (headingChars.length) {
          headingChars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-6, 6);
            const charStart = contentStart + 0.15 + idx * 0.022;

            // Pop
            openTl.to(
              char,
              {
                opacity: 1,
                scale: 1.1,
                rotation: randomTilt,
                textShadow:
                  "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
                duration: 0.45,
                ease: "back.out(2)",
              },
              charStart,
            );

            // Settle
            openTl.to(
              char,
              {
                scale: 1,
                rotation: 0,
                textShadow: "0px 0px 0px rgba(0,0,0,0)",
                duration: 0.6,
                ease: "power2.out",
              },
              charStart + 0.45,
            );
          });
        }

        // Step 4: Contact Left Paragraph Lines
        if (paraLines.length) {
          openTl.to(
            paraLines,
            {
              y: "0%",
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: "back.out(1.4)",
            },
            contentStart + 0.3,
          );
        }

        // Step 5: Contact Right Email Headings (Word Slide Up with overflow hidden) & Email Links (Slide Up NO overflow hidden)
        if (emailHeadingWords.length) {
          openTl.to(
            emailHeadingWords,
            {
              y: "0%",
              opacity: 1,
              duration: 0.7,
              stagger: 0.06,
              ease: "back.out(1.5)",
            },
            contentStart + 0.25,
          );
        }

        if (emailLinks.length) {
          openTl.to(
            emailLinks,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "back.out(1.5)",
            },
            contentStart + 0.35,
          );
        }

        // Step 6: Contact Social Pills (Shell pop + inner text slide without overflow hidden)
        if (contactSocials.length) {
          contactSocials.forEach((pill, i) => {
            const pillStart = contentStart + 0.45 + i * 0.12;
            const pillText = pill.querySelector(
              ".contact-social-link, [class*='link'], [class*='text'], span",
            );

            openTl.to(
              pill,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.7,
                ease: "back.out(2.5)",
              },
              pillStart,
            );

            if (pillText) {
              openTl.to(
                pillText,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "back.out(1.6)",
                },
                pillStart + 0.15,
              );
            }
          });
        }

        // Step 7: Contact Image Pop (Locked to bottom: 0)
        if (contactImg) {
          openTl.to(
            contactImg,
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotation: 0,
              duration: 0.75,
              ease: "back.out(1.8)",
            },
            contentStart + 0.4,
          );
        }
      }

      // -----------------------------------------------------------------
      // 5. Close Timeline Execution
      // -----------------------------------------------------------------
      function closeContactModal() {
        if (!isOpen) return;

        if (openTl) openTl.kill();

        const closeTl = gsap.timeline({
          onComplete: () => {
            contactPage.classList.remove("is-active");
            contactPage.style.display = "none";
            contactPage.style.visibility = "hidden";
            contactPage.style.pointerEvents = "none";
            isOpen = false;
            resetModalElements();
          },
        });

        // Clean fade out of text, pills & navbar items
        closeTl.to(
          [closeBtn, contactContent, contactSocials].filter(Boolean),
          {
            opacity: 0,
            y: -15,
            duration: 0.3,
            ease: "power2.in",
          },
          0,
        );

        // Fade logo out in place without any y translation
        if (contactLogo) {
          closeTl.to(
            contactLogo,
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: "power2.in",
            },
            0,
          );
        }

        // Fade image without changing its y bottom-position
        if (contactImg) {
          closeTl.to(
            contactImg,
            {
              opacity: 0,
              scale: 0.85,
              duration: 0.3,
              ease: "power2.in",
            },
            0,
          );
        }

        // Reverse SVG transition wipe
        if (transitionPaths.length) {
          transitionPaths.forEach((path) => {
            const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
            closeTl.to(
              path,
              {
                strokeDashoffset: totalLen,
                strokeWidth: "0px",
                duration: 0.45,
                ease: "power2.in",
              },
              0.1,
            );
          });
        }
      }

      // -----------------------------------------------------------------
      // 6. Event Listeners (Direct Listeners + Document Delegation + ESC key)
      // -----------------------------------------------------------------
      openTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          openContactModal();
        });
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          closeContactModal();
        });
      }

      // Document-level click delegation (catches any .cta-btn clicked anywhere)
      document.addEventListener("click", (e) => {
        const ctaTarget = e.target.closest(".cta-btn, [data-contact-trigger]");
        if (ctaTarget && !ctaTarget.closest(".contact-page")) {
          e.preventDefault();
          openContactModal();
          return;
        }

        const aboutTarget = e.target.closest(
          "a[href='/about'], a[href='/about/'], a[href*='about']",
        );
        if (
          aboutTarget &&
          (aboutTarget.classList.contains("navbar-link-btn") ||
            aboutTarget.classList.contains("two26-mobile-nav-link") ||
            aboutTarget.closest(".navbar-links") ||
            aboutTarget.closest(".navbar-wrap"))
        ) {
          if (window.location.pathname.replace(/\/+$/, "") === "/about") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/about");
            return;
          }
        }

        const exploreTarget = e.target.closest(
          ".project-btn, a[href='/work'].project-btn, a[href*='work'].project-btn",
        );
        if (exploreTarget) {
          if (window.location.pathname.replace(/\/+$/, "") === "/work") {
            e.preventDefault();
            return;
          }
          if (typeof window.triggerPageTransition === "function") {
            e.preventDefault();
            window.triggerPageTransition("/work");
            return;
          }
        }

        const closeTarget = e.target.closest(
          ".close-btn, [data-contact-close]",
        );
        if (closeTarget) {
          e.preventDefault();
          closeContactModal();
          return;
        }
      });

      // Escape key closes modal
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
          closeContactModal();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26ContactModal);
    } else {
      initTwo26ContactModal();
    }
  })();

/* === SCRIPT 12 === */
(function () {
    function initTwo26HeroAnimation() {
      // Controlled by React component Hero.tsx
      return;
      const heroSection = document.querySelector(
        ".section-hero, section.hero, [data-section='hero']",
      );
      if (!heroSection) return;

      // -------------------------------------------------------------
      // 1. Elements Selection
      // -------------------------------------------------------------
      const headings = Array.from(
        heroSection.querySelectorAll(
          ".hero-text h1, .hero-text .heading, h1, [data-hero-heading]",
        ),
      );
      const pills = Array.from(heroSection.querySelectorAll(".hero-pill"));
      const allSvgPaths = Array.from(
        heroSection.querySelectorAll(
          ".hero-path-svg-left svg path, .hero-path-svg-right svg path, .hero-path-svg-left path, .hero-path-svg-right path",
        ),
      );

      // GSAP Fallback: If GSAP fails to load, make everything visible immediately
      if (typeof gsap === "undefined") {
        headings.forEach((h) => (h.style.opacity = "1"));
        pills.forEach((p) => {
          p.style.opacity = "1";
          p.style.transform = "none";
        });
        return;
      }

      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

      // -------------------------------------------------------------
      // 2. Line-by-Line Heading Splitting (Exact projects-end Style)
      // -------------------------------------------------------------
      let linesList = [];

      headings.forEach((heading) => {
        let lines = [];
        if (typeof SplitText !== "undefined") {
          const split = new SplitText(heading, {
            type: "lines",
            linesClass: "hero-line",
          });
          split.lines.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "hero-line-mask";
            mask.style.display = "block";
            mask.style.overflow = "hidden";
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          });
          lines = split.lines;
        } else {
          const rawText = heading.textContent.trim();
          heading.innerHTML = `<span class="hero-line-mask"><span class="hero-line">${rawText}</span></span>`;
          lines = Array.from(heading.querySelectorAll(".hero-line"));
        }

        gsap.set(heading, { opacity: 1 });
        gsap.set(lines, {
          y: "115%",
          opacity: 0,
          display: "block",
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
        });
      }

      // -------------------------------------------------------------
      // 4. Initial Setup for Hero SVG Paths (Draw 0 & Stroke 0)
      // -------------------------------------------------------------
      const pathData = [];
      if (allSvgPaths.length) {
        allSvgPaths.forEach((path) => {
          path.style.strokeLinecap = "round";
          path.style.strokeLinejoin = "round";

          const originalStrokeWidth =
            parseFloat(
              path.getAttribute("stroke-width") ||
                window.getComputedStyle(path).strokeWidth,
            ) || 12;

          pathData.push({ path, originalStrokeWidth });

          if (hasDrawSVG) {
            gsap.set(path, {
              drawSVG: "0%",
              strokeWidth: 0,
            });
          } else {
            const len = path.getTotalLength ? path.getTotalLength() : 1500;
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            gsap.set(path, { strokeWidth: 0 });
          }
        });
      }

      // -------------------------------------------------------------
      // 5. Build Master Hero Timeline (PAUSED - 0.75x Speed)
      // -------------------------------------------------------------
      const heroTl = gsap
        .timeline({
          paused: true,
          defaults: { ease: "power2.out" },
        })
        .timeScale(0.75);

      // A. Line-by-Line Heading Entrance (Exact projects-end parameters)
      if (linesList.length) {
        heroTl.to(
          linesList,
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

      const totalLinesTime = linesList.length
        ? linesList.length * 0.12 + 0.5
        : 1.2;

      // B. Animate Pills – shell pops in, inner text slides up from mask
      pills.forEach((pill, i) => {
        const pillStart =
          0.2 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.7;

        // Find inner text element (supports multiple naming conventions)
        const pillTextEl = pill.querySelector(
          ".hero-pill-text, [class*='pill-text'], [class*='pill-label'], span, div",
        );

        // Wrap text in overflow-hidden mask if not already wrapped
        if (pillTextEl && !pillTextEl.closest(".hero-pill-text-mask")) {
          const mask = document.createElement("span");
          mask.className = "hero-pill-text-mask";
          mask.style.overflow = "hidden";
          mask.style.display = "block";
          pillTextEl.parentNode.insertBefore(mask, pillTextEl);
          mask.appendChild(pillTextEl);

          // Set initial text state: start 105% below mask
          gsap.set(pillTextEl, { y: "105%", opacity: 0 });
        }

        // Phase 1: Pill shell appears (scale + y)
        heroTl.to(
          pill,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: "back.out(2.5)",
          },
          pillStart,
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
            },
            pillStart + 0.15,
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
                },
                startTime,
              )
              .to(
                item.path,
                {
                  strokeWidth: item.originalStrokeWidth,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              );
          } else {
            heroTl
              .to(
                item.path,
                {
                  strokeDashoffset: 0,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              )
              .to(
                item.path,
                {
                  strokeWidth: item.originalStrokeWidth,
                  duration: 0.9,
                  ease: "power2.out",
                },
                startTime,
              );
          }
        });
      }

      // -------------------------------------------------------------
      // 6. Play Hero – Always fires (loader OR no loader, hard refresh OR nav)
      // -------------------------------------------------------------
      let heroPlayed = false;
      function playHero() {
        if (heroPlayed) return;
        heroPlayed = true;
        heroTl.play();
      }

      // If loader already completed before this script ran (e.g. internal navigation
      // where loader skips itself and fires notifyLoaderComplete instantly)
      if (window.__two26LoaderDone) {
        playHero();
      } else {
        // Wait for loader to fire (hard refresh path) or skip-fire (any nav path)
        document.addEventListener("two26:loaderComplete", playHero, {
          once: true,
        });
        // Double-check: loader may have fired between the flag check and listener registration
        if (window.__two26LoaderDone) playHero();
        // Safety: only fires if the event genuinely never arrives (broken state)
        setTimeout(playHero, 8000);
      }
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26HeroAnimation);
    } else {
      initTwo26HeroAnimation();
    }
  })();

/* === SCRIPT 13 === */
(function () {
    function initHeroMarquee() {
      // Controlled by React component HeroMarquee.tsx
      return;
      if (typeof gsap === "undefined") return;

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }

      const bgPath = document.querySelector(".hero-marquee-bg");
      const maskPath = document.querySelector(".hero-marquee-mask-path");
      const textPath = document.querySelector(".hero-marquee-tp");
      const textGroup = document.querySelector(".hero-marquee-text-group");
      const unit = document.querySelector(".marquee-unit");
      const container =
        document.querySelector(".hero-marquee") ||
        (bgPath ? bgPath.closest("svg") : null);

      if (!bgPath || !maskPath || !textPath) return;

      // 1. Initial State: Start at 100% 100% (hidden on right end)
      gsap.set([bgPath, maskPath], { drawSVG: "100% 100%" });

      // 2. Start Seamless Infinite Marquee Loop
      const startInfiniteMarquee = () => {
        const unitLength = unit ? unit.getComputedTextLength() : 1600;
        const speedDuration = unitLength / 75; // Smooth slow reading pace

        gsap.to(textPath, {
          attr: { startOffset: -unitLength },
          duration: speedDuration,
          ease: "none",
          repeat: -1,
        });
      };

      startInfiniteMarquee();

      const scrollerEl = document.querySelector(".page") || window;

      // 3. ScrollTrigger: Draw Ribbon + Reveal Text simultaneously from Right to Left
      // On reveal complete: remove mask to release Safari CPU rasterizer for silky 60fps scrolling
      gsap.to([bgPath, maskPath], {
        drawSVG: "0% 100%",
        delay: window.innerWidth < 991 ? 0.3 : 0,
        duration: 1.3,
        ease: "power2.out",
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

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initHeroMarquee);
    } else {
      initHeroMarquee();
    }
  })();

/* === SCRIPT 14 === */
(function () {
    function initAboutPinned() {
      if (typeof gsap === 'undefined') return;

      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof SplitText !== 'undefined') {
        gsap.registerPlugin(SplitText);
      }

      const sections = document.querySelectorAll('.section-about');
      if (!sections.length) return;

      const scrollerEl = document.querySelector('.page') || window;

      // Responsive scroll distance calculation
      const getPinDistance = () => {
        const width = window.innerWidth;
        if (width < 480) return 1150; // Mobile (< 480px): 1100-1200px
        if (width < 992) return 1550; // Tablet (< 992px): 1500-1600px
        return 2200; // Desktop: 2200px
      };

      sections.forEach((section) => {
        const aboutPara = section.querySelector('.about-para');
        const pills = section.querySelectorAll('.about-pill');

        if (!aboutPara) return;

        // 1. Hardware acceleration & anti-blur on pinned container
        gsap.set(section, {
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          force3D: true,
        });

        // 2. Split Text into individual characters
        let chars = [];
        if (typeof SplitText !== 'undefined') {
          const split = new SplitText(aboutPara, {
            type: 'chars, words',
            charsClass: 'about-char',
          });
          chars = split.chars;
        } else {
          const text = aboutPara.textContent;
          aboutPara.innerHTML = text
            .split('')
            .map((c) => `<span class="about-char" style="display:inline-block;">${c === ' ' ? '&nbsp;' : c}</span>`)
            .join('');
          chars = aboutPara.querySelectorAll('.about-char');
        }

        if (!chars.length) return;

        // 3. Set Initial State
        gsap.set(chars, {
          color: 'rgba(255, 84, 0, 0.45)',
          scale: 1,
          rotation: 0,
          display: 'inline-block',
          transformOrigin: 'center center',
          textShadow: '0px 0px 0px rgba(255,84,0,0)',
          willChange: 'transform, color',
          backfaceVisibility: 'hidden',
        });

        // Pills: Hidden & scaled down
        if (pills.length) {
          gsap.set(pills, {
            opacity: 0,
            scale: 0.6,
            y: 24,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          });
        }

        // 4. Create Responsive Scrubbed Pinned Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller: scrollerEl,
            start: 'top top',
            end: () => `+=${getPinDistance()}`, // Dynamically scales per device screen
            pin: section,
            pinSpacing: true,
            scrub: window.innerWidth < 992 ? 0.6 : 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
            preventOverlaps: true,
          },
        });

        const totalChars = chars.length;
        const letterAnimSpan = 85;

        chars.forEach((char, i) => {
          const startTime = (i / totalChars) * letterAnimSpan;

          // Stage 1: Scale 1.12, Random ±3-4 deg tilt, Thick glowing #FF5400
          tl.to(
            char,
            {
              color: '#FF5400',
              scale: 1.12,
              rotation: () => gsap.utils.random(-4, 4),
              textShadow: '0.6px 0.6px 0 #FF5400, -0.6px -0.6px 0 #FF5400, 0.6px -0.6px 0 #FF5400, -0.6px 0.6px 0 #FF5400',
              duration: 3.5,
              ease: 'power1.out',
            },
            startTime,
          );

          // Stage 2: Settle to normal scale 1, 0 deg, clean black #000000
          tl.to(
            char,
            {
              color: '#000000',
              scale: 1,
              rotation: 0,
              textShadow: '0px 0px 0px rgba(0,0,0,0)',
              duration: 3.5,
              ease: 'power1.inOut',
            },
            startTime + 3.5,
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
              ease: 'back.out(2)',
            },
            35, // 35% scroll progress
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
              ease: 'back.out(2)',
            },
            72, // 72% scroll progress
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
              ease: 'back.out(2)',
            },
            96, // 96-100% scroll progress
          );
        }
      });
    }

    window.initAboutPinned = initAboutPinned;
  })();

/* === SCRIPT 15 === */
(function () {
    function initShowcaseMarquee() {
      if (typeof gsap === "undefined") return;

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }

      // 1. Target Unique Slider Wrappers (prevents duplicate loop execution)
      const allWrappers = Array.from(
        document.querySelectorAll(
          ".section-slider-wrapper, .section-slider-showcase .section-slider-wrapper",
        ),
      );

      const targetWrappers = allWrappers.length
        ? Array.from(new Set(allWrappers))
        : Array.from(
            document.querySelectorAll(
              ".section-slider-showcase, [data-section='showcase']",
            ),
          );

      if (!targetWrappers.length) return;

      const scrollerEl = document.querySelector(".page") || window;

      targetWrappers.forEach((wrapper) => {
        // Prevent double initialization
        if (wrapper.dataset.marqueeInitialized === "true") return;
        wrapper.dataset.marqueeInitialized = "true";

        const track =
          wrapper.querySelector(".showcase-slider") ||
          wrapper.querySelector("[class*='showcase-slider']");
        if (!track) return;

        const initialSlides = Array.from(
          track.querySelectorAll(".showcase-slide"),
        );
        if (!initialSlides.length) return;

        wrapper.style.overflow = "hidden";
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";

        track.style.display = "flex";
        track.style.flexDirection = "row";
        track.style.willChange = "transform";
        track.style.width = "max-content";

        // -------------------------------------------------------------
        // 2. Read Speed Level via Data Attribute (Checks Section, Wrapper & Ancestors)
        // Level 1 = 1.00x (Default / 1.5px), with +30% per level up to Level 5 (+120% / 3.3px)
        // -------------------------------------------------------------
        const speedSource =
          wrapper.closest("[data-marquee-speed]") ||
          wrapper.closest("[data-speed]") ||
          wrapper.closest("[data-speed-level]") ||
          wrapper.closest(".section-slider-showcase") ||
          wrapper;

        const rawSpeedAttr =
          speedSource?.getAttribute("data-marquee-speed") ||
          speedSource?.getAttribute("data-speed") ||
          speedSource?.getAttribute("data-speed-level") ||
          wrapper.getAttribute("data-marquee-speed") ||
          wrapper.getAttribute("data-speed") ||
          track.getAttribute("data-marquee-speed");

        let speedLevel = 1;
        if (rawSpeedAttr) {
          const parsed = parseFloat(rawSpeedAttr);
          if (!isNaN(parsed) && parsed > 0) {
            speedLevel = Math.max(1, Math.min(parsed, 5));
          }
        }

        // Base idle speed: Level 1 = 1.50px/frame; +30% per level
        const speedMultiplier = 1 + (speedLevel - 1) * 0.3;
        const BASE_SPEED = 1.5 * speedMultiplier;

        // -------------------------------------------------------------
        // 3. Clone Slides to Ensure Seamless Viewport Coverage (>= 3x Viewport)
        // -------------------------------------------------------------
        const numInitial = initialSlides.length;

        // Create enough sets so that one full set wrap is always outside the screen
        const setsNeeded = Math.max(
          3,
          Math.ceil(
            (window.innerWidth * 3.5) /
              (initialSlides[0].offsetWidth * numInitial || 1000),
          ),
        );

        for (let s = 1; s < setsNeeded; s++) {
          initialSlides.forEach((slide) => {
            const clone = slide.cloneNode(true);
            clone.classList.add("is-marquee-clone");
            clone.style.flexShrink = "0";
            clone.style.willChange = "transform";
            clone.style.transformOrigin = "center center";
            track.appendChild(clone);
          });
        }

        const allSlides = Array.from(track.querySelectorAll(".showcase-slide"));

        // -------------------------------------------------------------
        // 4. Precision Set-Width Measurement (Accounts for Flex Gap + Margins)
        // -------------------------------------------------------------
        let setWidth = 0;

        function measureSetWidth() {
          if (allSlides.length > numInitial) {
            const firstSlide = allSlides[0];
            const firstClone = allSlides[numInitial];
            if (firstSlide && firstClone) {
              const exactDistance =
                firstClone.offsetLeft - firstSlide.offsetLeft;
              if (exactDistance > 0) {
                setWidth = exactDistance;
                return;
              }
            }
          }

          // Fallback measurement: slide widths + computed gap + margins
          const trackStyle = window.getComputedStyle(track);
          const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
          let total = 0;
          initialSlides.forEach((slide) => {
            const style = window.getComputedStyle(slide);
            const margin =
              parseFloat(style.marginLeft || 0) +
              parseFloat(style.marginRight || 0);
            total +=
              (slide.offsetWidth || slide.getBoundingClientRect().width) +
              margin +
              gap;
          });
          if (total > 0) setWidth = total;
        }

        measureSetWidth();

        // Re-measure after image load & window load to prevent subpixel rounding drift
        const slideImages = track.querySelectorAll("img");
        slideImages.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", measureSetWidth, { once: true });
          }
        });
        window.addEventListener("load", measureSetWidth);
        window.addEventListener("resize", measureSetWidth);

        // -------------------------------------------------------------
        // 5. Motion Physics & Directional Velocity Control (Left-to-Right 120 FPS)
        // -------------------------------------------------------------
        let currentX = setWidth > 0 ? -2 * setWidth : -2000;
        let targetDirection = 1; // +1 = left-to-right ("bam theke dane")
        let currentDirection = 1;
        let scrollVelocityBoost = 0;

        // Listen for scroll direction and velocity
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.create({
            trigger: document.body,
            scroller: scrollerEl,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              const dir = self.direction === 1 ? 1 : -1;
              targetDirection = 1;

              const vel = Math.abs(self.getVelocity() || 0);
              scrollVelocityBoost =
                Math.min(vel / 200, 12 * speedMultiplier) * dir;
            },
          });
        }

        // -------------------------------------------------------------
        // 6. 120 FPS Render Loop (Zero Forced Reflows & GPU Transform)
        // -------------------------------------------------------------
        let wrapperRectLeft = 0;
        let wrapperCenter = 0;
        let halfWidth = 400;
        let slideOffsets = [];
        let slideHalfWidth = 150;
        const currentScales = new Array(allSlides.length).fill(1);

        function updateMeasurements() {
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
        updateMeasurements();
        window.addEventListener("resize", updateMeasurements);

        function tick() {
          currentDirection += (targetDirection - currentDirection) * 0.06;
          scrollVelocityBoost *= 0.92;

          const delta = BASE_SPEED * currentDirection + scrollVelocityBoost;
          currentX += delta;

          // Continuous seamless wrapping for left-to-right
          if (setWidth > 0) {
            while (currentX > -setWidth) {
              currentX -= setWidth;
            }
            while (currentX < -2 * setWidth) {
              currentX += setWidth;
            }
          }

          // Apply track position with hardware acceleration (120 FPS)
          track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0px, 0px)`;

          // Pure arithmetic proximity scale (ZERO forced reflows)
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
        }

        gsap.ticker.add(tick);
      });
    }

    window.initShowcaseMarquee = initShowcaseMarquee;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initShowcaseMarquee);
    } else {
      initShowcaseMarquee();
    }
  })();

/* === SCRIPT 16 === */
(function () {
    function initTwo26ProjectsSection() {
      // 1. Defensive verification for GSAP & ScrollTrigger
      if (typeof gsap === "undefined") {
        document
          .querySelectorAll(
            ".project-card, .projects-end-para, .projects-pill-first, .projects-pill-second, .projects-pill-third, .projects-pill-fourth, .project-btn",
          )
          .forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
            el.style.clipPath = "none";
          });
        return;
      }

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const section = document.querySelector(
        ".section-projects, section.projects, [data-section='projects']",
      );
      if (!section) return;
      if (section.dataset.projectsSectionInitialized === "true") return;
      section.dataset.projectsSectionInitialized = "true";

      const scrollerEl = document.querySelector(".page") || window;

      // -------------------------------------------------------------
      // 2. Project Cards Clip-Mask Reveal Animation (6 Cards)
      // - Starts from 15% width & 15% height (inset 42.5% all sides) + 36px radius
      // - Card starts scaled higher at 1.4 with 3D perspective tilt
      // - Reveals to 100% width & height (inset 0%) + 0px radius + scale 1 + 0deg tilt
      // - Duration: 1.25s (power3.out)
      // - Only animates when entering from top (plays downwards, stays on reverse up)
      // -------------------------------------------------------------
      const projectCards = Array.from(
        section.querySelectorAll(
          ".projects-list .project-card, .projects-vertical-wrapper .project-card, .project-item .project-card, .project-card",
        ),
      );

      projectCards.forEach((card, index) => {
        // Wrap card in clip mask container
        let maskWrapper = card.parentElement;
        if (!maskWrapper.classList.contains("project-card-clip-mask")) {
          maskWrapper = document.createElement("div");
          maskWrapper.className = "project-card-clip-mask";
          card.parentNode.insertBefore(maskWrapper, card);
          maskWrapper.appendChild(card);
        }

        // Initial State:
        // 15% width & 15% height mask (inset 42.5% each side) with 36px border radius
        gsap.set(maskWrapper, {
          clipPath: "inset(42.5% 42.5% 42.5% 42.5%)",
          webkitClipPath: "inset(42.5% 42.5% 42.5% 42.5%)",
          borderRadius: "36px",
          overflow: "hidden",
          willChange: "clip-path, border-radius",
        });

        // Inner card starts scaled at 1.45 with strong 3D perspective tilt
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

        // ScrollTrigger: only animates when entering from top (downwards scroll)
        // Stays fully revealed when coming back up from below
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
          0,
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
          0,
        );
      });

      // -------------------------------------------------------------
      // 3. Projects End Section Animation (.projects-end only)
      // Heading with LINE-BY-LINE slide up reveal + Milestone Pills
      // -------------------------------------------------------------
      const projectsEnd = section.querySelector(
        ".projects-end, .projects-end-inner-wrapper",
      );
      if (projectsEnd) {
        const endPara = projectsEnd.querySelector(
          ".projects-end-para, p, h2, h3, .heading",
        );
        const pills = Array.from(
          projectsEnd.querySelectorAll(
            ".projects-pill-first, .projects-pill-second, .projects-pill-third, .projects-pill-fourth, [class*='projects-pill']",
          ),
        );
        const projectBtn = projectsEnd.querySelector(
          ".project-btn, .cta-btn, a[class*='btn']",
        );

        if (endPara) {
          // A. Split Heading Line-by-Line
          let linesList = [];
          if (typeof SplitText !== "undefined") {
            const split = new SplitText(endPara, {
              type: "lines",
              linesClass: "project-line",
            });
            split.lines.forEach((line) => {
              const mask = document.createElement("span");
              mask.className = "project-line-mask";
              line.parentNode.insertBefore(mask, line);
              mask.appendChild(line);
            });
            linesList = split.lines;
          } else {
            const rawText = endPara.textContent.trim();
            endPara.innerHTML = `<span class="project-line-mask"><span class="project-line">${rawText}</span></span>`;
            linesList = Array.from(endPara.querySelectorAll(".project-line"));
          }

          // Initial state
          gsap.set(endPara, { opacity: 1 });
          gsap.set(linesList, {
            y: "115%",
            opacity: 0,
          });

          // B. Prepare Pills (Initial State)
          pills.forEach((pill) => {
            gsap.set(pill, {
              opacity: 0,
              scale: 0.4,
              y: 20,
              transformOrigin: "center center",
            });
            const pillInner = pill.querySelector("span, [class*='text'], div");
            if (pillInner) {
              gsap.set(pillInner, {
                opacity: 0,
                y: 15,
                display: "inline-block",
              });
            }
          });

          // C. Prepare Button (Initial State)
          if (projectBtn) {
            gsap.set(projectBtn, {
              opacity: 0,
              scale: 0.4,
              y: 20,
              transformOrigin: "center center",
            });
            const btnText = projectBtn.querySelector(
              ".cta-text, [class*='text'], span",
            );
            if (btnText) {
              gsap.set(btnText, {
                opacity: 0,
                y: 15,
                display: "inline-block",
              });
            }
          }

          // D. Build Master ScrollTrigger Timeline
          const masterTl = gsap.timeline({
            paused: true,
            scrollTrigger: {
              trigger: projectsEnd,
              scroller: scrollerEl,
              start: "top 80%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
              onEnter: () => masterTl.play(),
            },
          });

          masterTl.timeScale(0.75); // 75% speed matching hero section

          // Animate Heading Line-by-Line
          masterTl.to(
            linesList,
            {
              y: "0%",
              opacity: 1,
              duration: 0.85,
              stagger: 0.12,
              ease: "back.out(1.4)",
            },
            0,
          );

          const totalLinesTime = linesList.length * 0.12 + 0.5;

          // Animate Pills (milestone appearance)
          pills.forEach((pill, i) => {
            const pillStart =
              0.2 + (i / Math.max(1, pills.length)) * totalLinesTime * 0.7;
            const pillInner = pill.querySelector("span, [class*='text'], div");

            masterTl.to(
              pill,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.55,
                ease: "back.out(2.5)",
              },
              pillStart,
            );

            if (pillInner) {
              masterTl.to(
                pillInner,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "back.out(1.6)",
                },
                pillStart + 0.15,
              );
            }
          });

          // Animate Button
          if (projectBtn) {
            const btnStart = totalLinesTime + 0.15;
            const btnText = projectBtn.querySelector(
              ".cta-text, [class*='text'], span",
            );

            masterTl.to(
              projectBtn,
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.55,
                ease: "back.out(2.5)",
              },
              btnStart,
            );

            if (btnText) {
              masterTl.to(
                btnText,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "back.out(1.6)",
                },
                btnStart + 0.15,
              );
            }
          }
        }
      }
    }

    window.initTwo26ProjectsSection = initTwo26ProjectsSection;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26ProjectsSection);
    } else {
      initTwo26ProjectsSection();
    }
  })();

/* === SCRIPT 17 === */
(function () {
    function initProjectCardHover() {
      if (typeof gsap === "undefined") return;

      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }
      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const cards = document.querySelectorAll(".project-card");
      if (!cards.length) return;

      // Mask SVG path coordinates provided
      const MASK_PATH_D =
        "M25.007 729.507C25.007 729.507 136.507 1065.7 290.007 969.007C506.711 832.495 -164.765 175.16 89.5069 44.5066C315.057 -71.3883 462.507 559.507 615.507 515.007C768.507 470.507 615.507 25.0068 615.507 25.0068";
      const TARGET_STROKE_WIDTH = 1200;

      cards.forEach((card, index) => {
        const imgWrapper = card.querySelector(".project-card-img-wrapper");
        if (!imgWrapper) return;

        imgWrapper.style.position = "relative";
        imgWrapper.style.overflow = "hidden";

        const baseImg = imgWrapper.querySelector(".project-img");
        const hoverImg = imgWrapper.querySelector(".project-img-hover");
        const svgContainer = imgWrapper.querySelector(".project-img-svg");

        if (baseImg) {
          baseImg.style.display = "block";
          baseImg.style.width = "100%";
          baseImg.style.height = "100%";
          baseImg.style.objectFit = "cover";
          baseImg.style.objectPosition = "center";
        }

        // 1. Setup Foreground Brush SVG (.project-img-svg)
        let foregroundStrokePath = null;
        if (svgContainer) {
          svgContainer.style.position = "absolute";
          svgContainer.style.top = "0";
          svgContainer.style.left = "0";
          svgContainer.style.width = "100%";
          svgContainer.style.height = "100%";
          svgContainer.style.pointerEvents = "none";
          svgContainer.style.zIndex = "2";

          const innerSvg = svgContainer.querySelector("svg");
          if (innerSvg) {
            innerSvg.style.width = "100%";
            innerSvg.style.height = "100%";
            innerSvg.style.display = "block";
            innerSvg.style.overflow = "visible";
            if (!innerSvg.getAttribute("viewBox")) {
              innerSvg.setAttribute("viewBox", "0 0 709 1012");
            }
            innerSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
          }

          foregroundStrokePath = svgContainer.querySelector("path");
          if (foregroundStrokePath) {
            foregroundStrokePath.style.strokeLinecap = "round";
            foregroundStrokePath.style.strokeLinejoin = "round";
            foregroundStrokePath.style.willChange =
              "stroke-dashoffset, stroke-width";
          }
        }

        // 2. Setup Dynamic SVG Mask Layer for Hover Image (.project-img-hover)
        let maskStrokePath = null;
        if (hoverImg) {
          // Read image source from Webflow Image element
          const imgSrc =
            hoverImg.currentSrc ||
            hoverImg.getAttribute("src") ||
            hoverImg.getAttribute("data-src") ||
            "";

          // Hide original HTML <img> so it only displays inside our hardware-accelerated SVG mask
          hoverImg.style.display = "none";

          const maskId = `project-mask-${index}`;

          // Create SVG element with Mask & Clipped Image if not already present
          let maskSvg = imgWrapper.querySelector(".project-card-mask-overlay");
          if (!maskSvg) {
            maskSvg = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "svg",
            );
            maskSvg.setAttribute("class", "project-card-mask-overlay");
            maskSvg.setAttribute("viewBox", "0 0 709 1012");
            maskSvg.setAttribute("preserveAspectRatio", "xMidYMid slice");
            maskSvg.style.position = "absolute";
            maskSvg.style.top = "0";
            maskSvg.style.left = "0";
            maskSvg.style.width = "100%";
            maskSvg.style.height = "100%";
            maskSvg.style.pointerEvents = "none";
            maskSvg.style.zIndex = "3";
            maskSvg.style.overflow = "visible";

            maskSvg.innerHTML = `
              <defs>
                <mask id="${maskId}" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1109" height="1412">
                  <path class="mask-brush-path" d="${MASK_PATH_D}" stroke="#FFFFFF" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" fill="none" />
                </mask>
              </defs>
              <image href="${imgSrc}" xlink:href="${imgSrc}" x="0" y="0" width="709" height="1012" preserveAspectRatio="xMidYMid slice" mask="url(#${maskId})" />
            `;

            imgWrapper.appendChild(maskSvg);
          }

          // If hover image was still loading when initialized, update SVG image on load
          const svgImg = maskSvg.querySelector("image");
          if (!hoverImg.complete) {
            hoverImg.addEventListener("load", () => {
              const freshSrc =
                hoverImg.currentSrc ||
                hoverImg.getAttribute("src") ||
                hoverImg.src;
              if (freshSrc && svgImg) {
                svgImg.setAttribute("href", freshSrc);
                svgImg.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "xlink:href",
                  freshSrc,
                );
              }
            });
          }

          maskStrokePath = maskSvg.querySelector(".mask-brush-path");
          if (maskStrokePath) {
            maskStrokePath.style.willChange = "stroke-dashoffset, stroke-width";
          }
        }

        // 3. Setup Arrow (.projects-arrow)
        const arrow = card.querySelector(".projects-arrow");
        const arrowTarget = arrow ? arrow.querySelector("svg") || arrow : null;
        if (arrowTarget) {
          gsap.set(arrowTarget, {
            transformOrigin: "center center",
            rotation: 0,
            scale: 1,
            willChange: "transform",
          });
        }

        // 4. Create Sequenced Timeline: Foreground SVG First -> Mask Reveal Second (Top to Bottom)
        const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

        // Initial setup for Top-to-Bottom draw (100% 100% is at the top of the path: y:25)
        if (hasDrawSVG) {
          if (foregroundStrokePath) {
            gsap.set(foregroundStrokePath, {
              drawSVG: "100% 100%",
              strokeWidth: 0,
            });
          }
          if (maskStrokePath) {
            gsap.set(maskStrokePath, {
              drawSVG: "100% 100%",
              strokeWidth: 0,
            });
          }
        } else {
          [foregroundStrokePath, maskStrokePath]
            .filter(Boolean)
            .forEach((path) => {
              const length = path.getTotalLength ? path.getTotalLength() : 2500;
              path.style.strokeDasharray = length;
              path.style.strokeDashoffset = -length;
              path.style.strokeWidth = "0px";
            });
        }

        const hoverTl = gsap.timeline({
          paused: true,
          defaults: { ease: "power1.inOut" },
        });

        // Step 1: Foreground SVG stroke draws in first from top to bottom (stroke from 0 to 600)
        if (foregroundStrokePath) {
          if (hasDrawSVG) {
            hoverTl.to(
              foregroundStrokePath,
              {
                drawSVG: "0% 100%",
                strokeWidth: TARGET_STROKE_WIDTH,
                duration: 0.95,
              },
              0,
            );
          } else {
            hoverTl.to(
              foregroundStrokePath,
              {
                strokeDashoffset: 0,
                strokeWidth: TARGET_STROKE_WIDTH,
                duration: 0.95,
              },
              0,
            );
          }
        }

        // Step 2: Mask stroke draws from top to bottom, expanding to reveal hover image
        if (maskStrokePath) {
          if (hasDrawSVG) {
            hoverTl.to(
              maskStrokePath,
              {
                drawSVG: "0% 100%",
                strokeWidth: TARGET_STROKE_WIDTH,
                duration: 1.05,
              },
              0.35, // Sequenced start with fluid overlap
            );
          } else {
            hoverTl.to(
              maskStrokePath,
              {
                strokeDashoffset: 0,
                strokeWidth: TARGET_STROKE_WIDTH,
                duration: 1.05,
              },
              0.35,
            );
          }
        }

        // Step 3: Arrow Rotate to Top -45deg and Spring Back to 0deg with Prominent Elastic Bounce
        if (arrowTarget) {
          hoverTl
            .to(
              arrowTarget,
              {
                rotation: -45,
                duration: 0.28,
                ease: "power2.out",
              },
              0,
            )
            .to(
              arrowTarget,
              {
                rotation: 0,
                duration: 0.65,
                ease: "elastic.out(1.15, 0.35)",
              },
              0.28,
            );
        }

        // 5. Bind Hover Listeners
        card.addEventListener("mouseenter", () => {
          hoverTl.timeScale(1).play();
        });

        card.addEventListener("mouseleave", () => {
          hoverTl.timeScale(1.3).reverse();
        });
      });
    }

    window.initProjectCardHover = initProjectCardHover;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initProjectCardHover);
    } else {
      initProjectCardHover();
    }
  })();

/* === SCRIPT 18 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".project-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 19 === */
(function () {
    function initServicesPathAnimation() {
      if (typeof gsap === "undefined") return;

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof DrawSVGPlugin !== "undefined") {
        gsap.registerPlugin(DrawSVGPlugin);
      }

      const section =
        document.querySelector(".section-services-body") ||
        document.querySelector(".services-layers")?.closest("section") ||
        document.querySelector(".services-layers")?.parentElement;

      if (!section) return;

      const layers = Array.from(
        section.querySelectorAll(
          ".services-layers .service-layer, .service-layer",
        ),
      );

      // Target Desktop & Mobile SVG Dark Paths
      const desktopDarkPath = section.querySelector(
        ".services-path-svg-dark path, .services-path-svg-dark svg path, .service-path-svg-dark path, .service-path-svg-dark svg path, .services-path-svg path, .services-path-svg svg path",
      );
      const mobileDarkPath = section.querySelector(
        ".service-path-mobile-dark path, .service-path-mobile-dark svg path, .services-path-mobile-dark path, .services-path-mobile-dark svg path, .service-path-mobile path, .service-path-mobile svg path, .services-path-mobile path, .services-path-mobile svg path",
      );

      const allDarkPaths = [desktopDarkPath, mobileDarkPath].filter(Boolean);
      const scrollerEl = document.querySelector(".page") || window;

      // 1. Setup Dark SVG Path Initial State (Desktop & Mobile)
      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";
      allDarkPaths.forEach((path) => {
        path.style.strokeLinecap = "round";
        path.style.strokeLinejoin = "round";
        if (hasDrawSVG) {
          gsap.set(path, { drawSVG: "0%" });
        } else {
          const len = path.getTotalLength ? path.getTotalLength() : 2500;
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
        }
      });

      // 2. Setup Service Blocks Initial State & Measure Natural em Sizing
      layers.forEach((layer) => {
        const block = layer.querySelector(".service-block") || layer;
        const centerSvg = block.querySelector(".service-svg");
        const paraWrapper = block.querySelector(".service-block-para-wrapper");

        if (centerSvg) {
          // Read natural computed width (derived from em sizing in Webflow)
          const naturalWidth =
            centerSvg.getBoundingClientRect().width ||
            parseFloat(getComputedStyle(centerSvg).width) ||
            parseFloat(getComputedStyle(centerSvg).fontSize) * 2.5 ||
            40;

          centerSvg.dataset.targetWidth = naturalWidth;
          centerSvg.style.transformOrigin = "center center";
          centerSvg.style.willChange = "transform, width, opacity";
          centerSvg.style.flexShrink = "0";

          // Strictly constrain inner img/svg to stay inside container bounds
          const innerMedia = centerSvg.querySelectorAll(
            "img, svg, .service-img",
          );
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

      // 3. Create Master Scrubbed Timeline
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

      // A. Dark Path draws 0% to 100% across the full scrub duration (animates both desktop and mobile paths)
      allDarkPaths.forEach((path) => {
        if (hasDrawSVG) {
          masterTl.to(
            path,
            {
              drawSVG: "100%",
              ease: "none",
              duration: 1,
            },
            0,
          );
        } else {
          masterTl.to(
            path,
            {
              strokeDashoffset: 0,
              ease: "none",
              duration: 1,
            },
            0,
          );
        }
      });

      // B. Proximity Expansions for each of the 7 Service Layers (Slower & High Bounce)
      const totalLayers = layers.length;
      layers.forEach((layer, index) => {
        const block = layer.querySelector(".service-block") || layer;
        const centerSvg = block.querySelector(".service-svg");
        const paraWrapper = block.querySelector(".service-block-para-wrapper");

        // Map layer index evenly along the 0 -> 1 timeline progress
        const point = totalLayers > 1 ? index / (totalLayers - 1) : 0;
        const stepDuration = 0.14; // Slower, more deliberate expansion
        const startTime = Math.max(0, point - 0.04);

        // Center SVG container expands with prominent bounce
        if (centerSvg) {
          masterTl.to(
            centerSvg,
            {
              width: () => parseFloat(centerSvg.dataset.targetWidth) || "auto",
              scale: 1,
              opacity: 1,
              duration: stepDuration,
              ease: "back.out(3.5)",
            },
            startTime,
          );
        }

        // Paragraph wrapper pops with scale 1, -5deg rotation, and prominent bounce
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
            startTime + 0.02,
          );
        }
      });

      // Refresh on image/font load
      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initServicesPathAnimation);
    } else {
      initServicesPathAnimation();
    }
  })();

/* === SCRIPT 20 === */
(function () {
    function initTestimonialsStack() {
      if (typeof gsap === "undefined") return;

      const bodyBg = document.querySelector(".testimonials-body-bg");
      if (!bodyBg) return;

      // Query CMS collection items
      const cardElements = bodyBg.querySelectorAll(".testimonial-item").length
        ? Array.from(bodyBg.querySelectorAll(".testimonial-item"))
        : Array.from(bodyBg.querySelectorAll(".testimonial-card"));

      const totalCards = cardElements.length;
      if (totalCards === 0) return;

      // Clean up any inner card nested transforms so GSAP is the single source of truth
      cardElements.forEach((card) => {
        const innerCard = card.querySelector(
          ".testimonial-card, [class*='testimonial-card']",
        );
        if (innerCard && innerCard !== card) {
          innerCard.style.transform = "none";
          innerCard.style.position = "relative";
          innerCard.style.top = "auto";
          innerCard.style.left = "auto";
          innerCard.style.margin = "0 auto";
        }
      });

      const sidebar = bodyBg.querySelector(".side-bar");
      const navArrow = bodyBg.querySelector(".nav-arrow");

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

          card.style.zIndex = zIndex;
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
      let sidebarTicks = [];
      if (sidebar) {
        sidebar.innerHTML = "";
        sidebar.style.display = "flex";
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

      function updateSidebar(activeIdx, animate = true) {
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

      const isTouch =
        matchMedia("(pointer: coarse)").matches || window.innerWidth < 992;

      // -----------------------------------------------------------------
      // 3. Floating Custom Navigation Arrow (.nav-arrow)
      // -----------------------------------------------------------------
      if (navArrow) {
        if (isTouch) {
          // Hide custom cursor nav-arrow on mobile/tablets
          navArrow.style.display = "none";
        } else {
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

          bodyBg.addEventListener("mouseenter", (e) => {
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
          });

          bodyBg.addEventListener("mousemove", (e) => {
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
          });

          bodyBg.addEventListener("mouseleave", () => {
            gsap.to(navArrow, {
              scale: 0,
              opacity: 0,
              duration: 0.2,
              ease: "power2.in",
              overwrite: "auto",
            });
          });
        }
      }

      // -----------------------------------------------------------------
      // 4. Physical Deck Shuffle: Next (Top -> Bottom) & Prev (Bottom -> Top)
      // -----------------------------------------------------------------
      function reorderZIndices() {
        cardElements.forEach((card, i) => {
          const order = (i - currentIndex + totalCards) % totalCards;
          card.style.zIndex = totalCards - order;

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
            outgoingCard.style.zIndex = 1;

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
            incomingCard.style.zIndex = totalCards + 10;

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

      bodyBg.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches.length === 1) {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            isSwipeAction = false;
          }
        },
        { passive: true },
      );

      bodyBg.addEventListener(
        "touchend",
        (e) => {
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
        },
        { passive: true },
      );

      // -----------------------------------------------------------------
      // 6. Click Handler on .testimonials-body-bg (Desktop & Tap)
      // -----------------------------------------------------------------
      bodyBg.addEventListener("click", (e) => {
        // Prevent trigger if clicking on link/button inside card, or if just swiped
        if (e.target.closest("a, button") || isSwipeAction) return;

        const rect = bodyBg.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const isTopHalf = clickY < rect.height / 2;

        if (isTopHalf) {
          goToNextCard();
        } else {
          goToPrevCard();
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTestimonialsStack);
    } else {
      initTestimonialsStack();
    }
  })();

/* === SCRIPT 21 === */
(function () {
    function initFaqAccordion() {
      if (typeof gsap === "undefined") return;

      const items = Array.from(
        document.querySelectorAll(".faq-item, .faq-block"),
      );
      if (!items.length) return;

      // Filter to unique parent container if both .faq-item and .faq-block exist
      const faqItems = items.filter((item) => {
        return (
          item.classList.contains("faq-item") || !item.closest(".faq-item")
        );
      });

      let activeItem = null;

      const getOpenWidth = () => (window.innerWidth >= 992 ? "50%" : "75%");

      // 1. Initial State Setup
      faqItems.forEach((item, index) => {
        const qBlock = item.querySelector(".question-block");
        const aBlock = item.querySelector(".faq-block-btm, .faq-answer-block");
        const logo = item.querySelector(".faq-logo");
        const answerText = item.querySelector(".faq-answer");

        if (qBlock) {
          qBlock.style.cursor = "pointer";
          qBlock.style.willChange = "width, border-width";
        }
        if (aBlock) {
          aBlock.style.transformOrigin = "right bottom";
          aBlock.style.willChange = "transform, height, opacity";
        }
        if (logo) {
          logo.style.transformOrigin = "center center";
          logo.style.willChange = "transform";
        }
        if (answerText) {
          answerText.style.willChange = "transform, opacity";
        }

        if (index === 0) {
          // First FAQ item opens by default (50% desktop, 75% on < 992px)
          activeItem = item;
          item.classList.add("is-open");
          if (qBlock) {
            gsap.set(qBlock, {
              borderWidth: "1px",
              width: getOpenWidth(),
            });
          }
          if (aBlock) {
            gsap.set(aBlock, {
              height: "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              overflow: "visible",
              scale: 1,
              opacity: 1,
              transformOrigin: "right bottom",
            });
          }
          if (logo) gsap.set(logo, { scale: 1 });
          if (answerText) gsap.set(answerText, { opacity: 1, y: 0 });
        } else {
          // All other items closed (100% width on all displays, height 0, scale 0)
          item.classList.remove("is-open");
          if (qBlock) {
            gsap.set(qBlock, { borderWidth: "0px", width: "100%" });
          }
          if (aBlock) {
            gsap.set(aBlock, {
              height: 0,
              display: "none",
              overflow: "hidden",
              scale: 0,
              opacity: 0,
              transformOrigin: "right bottom",
            });
          }
          if (logo) gsap.set(logo, { scale: 0 });
          if (answerText) gsap.set(answerText, { opacity: 0, y: 20 });
        }
      });

      // 2. Open Item Timeline
      function openItem(item) {
        const qBlock = item.querySelector(".question-block");
        const aBlock = item.querySelector(".faq-block-btm, .faq-answer-block");
        const logo = item.querySelector(".faq-logo");
        const answerText = item.querySelector(".faq-answer");

        item.classList.add("is-open");

        const openTl = gsap.timeline({
          defaults: { ease: "power2.out" },
        });

        // Step A: Question block width to 50% (desktop) / 75% (<992px), border 0px to 1px
        if (qBlock) {
          openTl.to(
            qBlock,
            {
              width: getOpenWidth(),
              borderWidth: "1px",
              duration: 0.45,
            },
            0,
          );
        }

        // Step B: Answer block expands height from 0 to auto and scales up 0 -> 1 with flex-end alignment
        if (aBlock) {
          gsap.set(aBlock, {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            overflow: "hidden",
            opacity: 1,
          });
          openTl.fromTo(
            aBlock,
            { height: 0, scale: 0 },
            {
              height: "auto",
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.6)",
              onComplete: () => {
                gsap.set(aBlock, { overflow: "visible" });
              },
            },
            0.05,
          );
        }

        // Step C: Logo scales up
        if (logo) {
          openTl.to(
            logo,
            {
              scale: 1,
              duration: 0.45,
              ease: "back.out(2)",
            },
            0.15,
          );
        }

        // Step D: Answer text animates in from bottom with opacity after block scales
        if (answerText) {
          openTl.to(
            answerText,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            },
            0.35,
          );
        }
      }

      // 3. Close Item Timeline
      function closeItem(item) {
        const qBlock = item.querySelector(".question-block");
        const aBlock = item.querySelector(".faq-block-btm, .faq-answer-block");
        const logo = item.querySelector(".faq-logo");
        const answerText = item.querySelector(".faq-answer");

        item.classList.remove("is-open");

        const closeTl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
        });

        // Step A: Answer text disappears first
        if (answerText) {
          closeTl.to(
            answerText,
            {
              opacity: 0,
              y: 15,
              duration: 0.22,
              ease: "power2.in",
            },
            0,
          );
        }

        // Step B: Logo & Answer block scale down to 0 into bottom-right & collapse height
        if (logo) {
          closeTl.to(
            logo,
            {
              scale: 0,
              duration: 0.25,
              ease: "power2.in",
            },
            0.12,
          );
        }

        if (aBlock) {
          gsap.set(aBlock, { overflow: "hidden" });
          closeTl.to(
            aBlock,
            {
              scale: 0,
              height: 0,
              opacity: 0,
              duration: 0.4,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(aBlock, { display: "none" });
              },
            },
            0.15,
          );
        }

        // Step C: Question block expands back to 100% width on all displays, border back to 0px
        if (qBlock) {
          closeTl.to(
            qBlock,
            {
              width: "100%",
              borderWidth: "0px",
              duration: 0.45,
              ease: "power2.out",
            },
            0.18,
          );
        }
      }

      // 4. Resize listener to update active open width across breakpoints
      window.addEventListener("resize", () => {
        if (activeItem) {
          const qBlock = activeItem.querySelector(".question-block");
          if (qBlock) {
            gsap.set(qBlock, { width: getOpenWidth() });
          }
        }
      });

      // 4. Bind Click Triggers (One FAQ always remains open)
      faqItems.forEach((item) => {
        const trigger = item.querySelector(".question-block") || item;

        trigger.addEventListener("click", () => {
          // If already open, do nothing (one FAQ must always remain open)
          if (item === activeItem) return;

          // Close currently active item
          if (activeItem) {
            closeItem(activeItem);
          }

          // Open clicked item
          openItem(item);
          activeItem = item;
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initFaqAccordion);
    } else {
      initFaqAccordion();
    }
  })();

/* === SCRIPT 22 === */
(function () {
    function initTwo26FooterAnimation() {
      // 1. Defensive verification for GSAP & ScrollTrigger
      if (typeof gsap === "undefined") return;

      if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (typeof SplitText !== "undefined") {
        gsap.registerPlugin(SplitText);
      }

      const path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
      const isWorkCmsPage =
        path.startsWith("/work/") ||
        (path.indexOf("/work/") !== -1 && path !== "/work");
      const scrollerEl = isWorkCmsPage
        ? window
        : document.querySelector(".page") || window;

      // 2. Elements Selection matching Webflow Navigator
      const footer = document.querySelector(
        "footer, .footer, .footer-wrapper, [data-section='footer']",
      );
      if (!footer) return;

      if (typeof ScrollTrigger !== "undefined") {
        const oldHeading = ScrollTrigger.getById("footer-heading-reveal");
        if (oldHeading) oldHeading.kill();
        const oldLogo = ScrollTrigger.getById("footer-logo-bounce");
        if (oldLogo) oldLogo.kill();

        ScrollTrigger.getAll().forEach((st) => {
          if (
            st.trigger &&
            (st.trigger === footer ||
              footer.contains(st.trigger) ||
              !document.body.contains(st.trigger))
          ) {
            st.kill();
          }
        });
      }

      const footerBtm = footer.querySelector(".footer-btm");
      const footerHeadings = Array.from(
        footer.querySelectorAll(
          ".footer-heading, h2.footer-heading, .footer-top-left h2, .footer-top-left .heading",
        ),
      );

      // -------------------------------------------------------------
      // 3. Footer Heading: SplitText by Line with Overflow Clip & Bounce
      // -------------------------------------------------------------
      let allHeadingLines = [];

      footerHeadings.forEach((heading) => {
        let lines = [];
        const existingLines = heading.querySelectorAll(".footer-heading-line");

        if (existingLines.length > 0) {
          lines = Array.from(existingLines);
        } else if (typeof SplitText !== "undefined") {
          const split = new SplitText(heading, {
            type: "lines",
            linesClass: "footer-heading-line",
          });
          split.lines.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "footer-heading-line-mask";
            line.parentNode.insertBefore(mask, line);
            mask.appendChild(line);
          });
          lines = split.lines;
        } else {
          const raw = heading.innerHTML.trim();
          heading.innerHTML = `<span class="footer-heading-line-mask"><span class="footer-heading-line">${raw}</span></span>`;
          lines = Array.from(heading.querySelectorAll(".footer-heading-line"));
        }

        gsap.set(lines, {
          y: "115%",
          opacity: 0,
        });

        allHeadingLines = allHeadingLines.concat(lines);
      });

      if (allHeadingLines.length) {
        gsap.to(allHeadingLines, {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: {
            id: "footer-heading-reveal",
            trigger: footer,
            scroller: scrollerEl,
            start: "top 80%",
            toggleActions: "play none none none",
            invalidateOnRefresh: true,
          },
        });
      }

      // -------------------------------------------------------------
      // 4. Wolff Olins Signature Elastic Footer SVG Stretch & Settle
      // - Starts compressed (scaleY: 0.15) anchored to bottom
      // - Scrubs up to scaleY: 1.35 as footer scrolls into view with velocity reactivity
      // - When reaching page bottom, releases into a juicy elastic spring bounce (scaleY: 1)
      // -------------------------------------------------------------
      const footerLogo = footer.querySelector(".footer-btm") || footerBtm;

      if (footerLogo) {
        gsap.killTweensOf(footerLogo);
        gsap.set(footerLogo, {
          scaleY: 0.15,
          transformOrigin: "bottom center",
          display: "block",
          willChange: "transform",
        });

        let hasBounced = false;

        ScrollTrigger.create({
          id: "footer-logo-bounce",
          trigger: footer,
          scroller: scrollerEl,
          start: "top bottom", // Starts when footer top enters bottom of viewport
          end: "bottom bottom", // Ends when page is scrolled all the way to bottom
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const vel = Math.abs(self.getVelocity() || 0);
            const velStretch = Math.min(vel / 1500, 0.25); // Velocity-reactive stretch boost

            if (self.progress >= 0.9) {
              // Reached bottom region: release into juicy elastic spring bounce (scaleY: 1)
              if (!hasBounced) {
                hasBounced = true;
                gsap.killTweensOf(footerLogo);
                gsap.to(footerLogo, {
                  scaleY: 1,
                  duration: 1.4,
                  ease: "elastic.out(1.2, 0.35)", // Juicy Wolff Olins spring settle
                  overwrite: "auto",
                });
              }
            } else {
              // Scrolling above bottom threshold: reset bounce state so it can re-trigger
              hasBounced = false;

              // Retract when scrolling UP and stretch when scrolling DOWN
              const baseTarget =
                self.direction === 1
                  ? 0.15 + self.progress * 1.15 + velStretch
                  : 0.15 + self.progress * 0.95;

              const targetScaleY = Math.max(0.15, Math.min(baseTarget, 1.4));

              gsap.to(footerLogo, {
                scaleY: targetScaleY,
                duration: 0.1,
                ease: "power1.out",
                overwrite: "auto",
              });
            }
          },
          onLeave: () => {
            // Reached absolute end of scroll
            if (!hasBounced) {
              hasBounced = true;
              gsap.killTweensOf(footerLogo);
              gsap.to(footerLogo, {
                scaleY: 1,
                duration: 1.4,
                ease: "elastic.out(1.2, 0.35)",
                overwrite: "auto",
              });
            }
          },
          onLeaveBack: () => {
            // Reset when scrolling completely above the footer
            hasBounced = false;
            gsap.killTweensOf(footerLogo);
            gsap.to(footerLogo, {
              scaleY: 0.15,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        });
      }

      // -------------------------------------------------------------
      // 5. Kinetic Character Hover Animation on Footer Links & Email (Excludes .footer-link-header)
      // -------------------------------------------------------------
      const footerLinks = Array.from(
        footer.querySelectorAll(
          ".footer-link, a.footer-link, [class*='footer-link'], a[href^='mailto:'], .social-link a, .social-link",
        ),
      ).filter(
        (link) =>
          !link.classList.contains("footer-link-header") &&
          !link.closest(".footer-link-header"),
      );

      footerLinks.forEach((link) => {
        // Prevent double splitting
        if (link.querySelector(".footer-link-char")) return;

        // Split text nodes while preserving any nested elements (e.g. .footer-arrow-svg)
        Array.from(link.childNodes).forEach((node) => {
          if (
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0
          ) {
            const span = document.createElement("span");
            span.className = "footer-link-text-wrap";
            span.style.display = "inline-block";

            const raw = node.textContent;
            span.innerHTML = raw
              .split("")
              .map((c) => {
                if (c === " ") return "&nbsp;";
                return `<span class="footer-link-char">${c}</span>`;
              })
              .join("");

            node.parentNode.replaceChild(span, node);
          }
        });

        const chars = Array.from(link.querySelectorAll(".footer-link-char"));
        if (!chars.length) return;

        // Initial character state
        gsap.set(chars, {
          display: "inline-block",
          transformOrigin: "center center",
          scale: 1,
          rotation: 0,
          textShadow: "0px 0px 0px rgba(0,0,0,0)",
        });

        // Hover In: Staggered kinetic pop with random tilt, scale & bold shadow (slower, silky pace)
        link.addEventListener("mouseenter", () => {
          chars.forEach((char, idx) => {
            const randomTilt = gsap.utils.random(-7, 7);
            const charDelay = idx * 0.035;

            // Phase 1: Letter pop + random tilt + bold outline shadow
            gsap.to(char, {
              scale: 1.14,
              rotation: randomTilt,
              textShadow:
                "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
              duration: 0.38,
              delay: charDelay,
              ease: "back.out(1.8)",
              overwrite: "auto",
              onComplete: () => {
                // Phase 2: Gentle settle back to clean resting state
                gsap.to(char, {
                  scale: 1,
                  rotation: 0,
                  textShadow: "0px 0px 0px rgba(0,0,0,0)",
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                });
              },
            });
          });
        });

        // Hover Out: Smooth clean return
        link.addEventListener("mouseleave", () => {
          gsap.to(chars, {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.35,
            stagger: 0.018,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });
    }

    window.initTwo26FooterAnimation = initTwo26FooterAnimation;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initTwo26FooterAnimation);
    } else {
      initTwo26FooterAnimation();
    }
  })();

/* === SCRIPT 23 === */
(function () {
    function initCTAButtons() {
      if (typeof gsap === "undefined") return;

      const buttons = document.querySelectorAll(".cta-btn");

      buttons.forEach((btn) => {
        const text = btn.querySelector(".cta-text");
        const arrow = btn.querySelector(".cta-btn-arrow, .svg-arrow-cta");
        const fillHover = btn.querySelector(".cta-btn-fill-hover");

        let arrowLoop = null;

        // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
        btn.addEventListener("mouseenter", () => {
          if (fillHover) {
            gsap.to(fillHover, {
              scale: 10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          if (arrow) {
            gsap.set(arrow, { transformOrigin: "center center" });
            if (arrowLoop) arrowLoop.kill();

            arrowLoop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
            arrowLoop
              .to(arrow, {
                rotation: -25,
                duration: 0.22,
                ease: "power2.out",
              })
              .to(arrow, {
                rotation: 0,
                duration: 0.4,
                ease: "back.out(2.5)",
              });
          }
        });

        // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const currentX = gsap.getProperty(btn, "x") || 0;
          const currentY = gsap.getProperty(btn, "y") || 0;

          // True center of button before any transform offset
          const originCenterX = rect.left - currentX + rect.width / 2;
          const originCenterY = rect.top - currentY + rect.height / 2;

          const deltaX = e.clientX - originCenterX;
          const deltaY = e.clientY - originCenterY;

          // Button magnetic translation
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Inner elements parallax
          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: deltaX * 0.15,
              y: deltaY * 0.15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        // 3. Mouse Leave: Snap back with spring elasticity & reset
        btn.addEventListener("mouseleave", () => {
          if (arrowLoop) {
            arrowLoop.kill();
            arrowLoop = null;
          }
          if (arrow) {
            gsap.to(arrow, {
              rotation: 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1.1, 0.4)",
            overwrite: "auto",
          });

          const innerElements = [text, arrow].filter(Boolean);
          if (innerElements.length) {
            gsap.to(innerElements, {
              x: 0,
              y: 0,
              duration: 0.8,
              ease: "elastic.out(1.1, 0.4)",
              overwrite: "auto",
            });
          }

          if (fillHover) {
            gsap.to(fillHover, {
              scale: 1,
              duration: 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCTAButtons);
    } else {
      initCTAButtons();
    }
  })();

/* === SCRIPT 24 === */
gsap.registerPlugin(SplitText,ScrollTrigger,DrawSVGPlugin,MotionPathPlugin,CustomEase,CustomBounce);

/* === SCRIPT 25 === */
(function () {
    // Detect if we are on a Work CMS project page (/work/[slug])
    var path = window.location.pathname.toLowerCase().replace(/\/+$/, "");
    var isWorkCmsPage =
      path.startsWith("/work/") ||
      (path.indexOf("/work/") !== -1 && path !== "/work");

    if (isWorkCmsPage) {
      // 1. Remove the fixed/overflow-hidden styles from body and html
      var styleTag = document.getElementById("lenis-page-styles");
      if (styleTag) {
        styleTag.remove();
      }

      // 2. Set html, body, and .page to clean natural flow
      document.documentElement.style.cssText =
        "position: static !important; overflow-y: auto !important; overflow-x: hidden !important; height: auto !important; width: 100% !important; margin: 0 !important;";
      document.body.style.cssText =
        "position: static !important; overflow-y: auto !important; overflow-x: hidden !important; height: auto !important; width: 100% !important; margin: 0 !important;";

      function releaseWrapper() {
        var wrapper = document.querySelector(".page");
        if (wrapper) {
          wrapper.style.cssText =
            "position: relative !important; overflow: visible !important; height: auto !important; min-height: 100vh !important; width: 100% !important; box-sizing: border-box !important;";
        }
      }
      releaseWrapper();
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", releaseWrapper);
      }

      // 3. Initialize Lenis on BODY / WINDOW (no .page wrapper constraint)
      function initWorkLenis() {
        if (typeof Lenis === "undefined") return;
        if (window.lenis) return;

        var isTouch = matchMedia("(pointer: coarse)").matches;

        var lenis = new Lenis({
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          infinite: false,
          duration: isTouch ? 1.0 : 1.5,
          wheelMultiplier: 0.85,
          touchMultiplier: 1.2,
          syncTouch: false, // Prevents pull-back & touch fighting
          easing: function (t) {
            return Math.min(1, 1.001 - Math.pow(2, -10 * t));
          },
        });

        window.lenis = lenis;

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        window.addEventListener("load", function () {
          lenis.resize();
        });
        document.querySelectorAll("img").forEach(function (img) {
          if (!img.complete) {
            img.addEventListener("load", function () {
              lenis.resize();
            });
          }
        });
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initWorkLenis);
      } else {
        initWorkLenis();
      }

      return;
    }

    // =======================================================
    // OTHER PAGES (Home, About, Work listing, etc.)
    // Uses .page wrapper as before with full GSAP integration
    // =======================================================
    function initLenis() {
      if (typeof Lenis === "undefined") return;

      var wrapper = document.querySelector(".page");
      var content = document.querySelector(".main");
      if (!wrapper || !content) return;

      if (
        window.lenis &&
        window.lenis.dimensions &&
        window.lenis.dimensions.wrapper === wrapper &&
        document.body.contains(wrapper)
      ) {
        return;
      }

      if (window.lenis) {
        window.lenis.destroy();
        window.lenis = null;
      }

      var isTouch = matchMedia("(pointer: coarse)").matches;

      var lastH = window.innerHeight;
      function updateViewportHeight() {
        var currentH = window.innerHeight;
        // On mobile touch devices, prevent ScrollTrigger refreshes during minor URL bar collapses/expansions
        if (isTouch && Math.abs(currentH - lastH) < 80) {
          return;
        }
        lastH = currentH;
        var vh = currentH * 0.01;
        document.documentElement.style.setProperty("--vh", vh + "px");
        if (wrapper) {
          wrapper.style.height = currentH + "px";
        }
        if (window.lenis) {
          window.lenis.resize();
        }
        if (window.lenis && typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }

      updateViewportHeight();
      window.addEventListener("resize", updateViewportHeight);
      window.addEventListener("orientationchange", function () {
        lastH = 0;
        setTimeout(updateViewportHeight, 200);
      });
      if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", function () {
          if (!isTouch) updateViewportHeight();
        });
      }

      var lenis = new Lenis({
        wrapper: wrapper,
        content: content,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        infinite: false,
        duration: isTouch ? 1.0 : 1.7,
        wheelMultiplier: 0.9,
        touchMultiplier: isTouch ? 1.0 : 2.6,
        touchInertiaMultiplier: isTouch ? 18 : 50,
        syncTouch: false, // Prevents trackpad pull-back & touch fighting
        syncTouchLerp: isTouch ? 0.09 : 0.35,
        touchInertiaExponent: 2,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
      });

      window.lenis = lenis;

      var imgs = wrapper.querySelectorAll("img");
      imgs.forEach(function (img) {
        if (!img.complete) {
          img.addEventListener("load", function () {
            if (window.lenis) window.lenis.resize();
          });
        }
      });

      if (typeof gsap !== "undefined") {
        if (typeof ScrollTrigger !== "undefined") {
          gsap.registerPlugin(ScrollTrigger);

          lenis.on("scroll", ScrollTrigger.update);

          ScrollTrigger.scrollerProxy(wrapper, {
            scrollTop: function (value) {
              if (arguments.length) {
                lenis.scrollTo(value, { immediate: true });
              }
              return lenis.scroll;
            },
            getBoundingClientRect: function () {
              return {
                top: 0,
                left: 0,
                width: wrapper.clientWidth || window.innerWidth,
                height: wrapper.clientHeight || window.innerHeight,
              };
            },
            pinType: "transform",
          });

          ScrollTrigger.defaults({ scroller: wrapper });
          ScrollTrigger.addEventListener("refresh", function () {
            lenis.resize();
          });

          ScrollTrigger.refresh();
          window.addEventListener("load", function () {
            updateViewportHeight();
            ScrollTrigger.refresh();
          });
        }

        gsap.ticker.lagSmoothing(0);
        if (window._lenisTicker) {
          gsap.ticker.remove(window._lenisTicker);
        }
        window._lenisTicker = function (time) {
          if (window.lenis) {
            window.lenis.raf(time * 1000);
          }
        };
        gsap.ticker.add(window._lenisTicker);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }

    window.initLenis = initLenis;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initLenis);
    } else {
      initLenis();
    }
  })();
