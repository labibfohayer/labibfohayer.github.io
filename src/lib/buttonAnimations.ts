"use client";

import gsap from "gsap";

/**
 * Authentic Two26 Studio Navbar Capsule Buttons Animation
 * Animates the blooming SVG stroke path underneath .navlink-text
 */
export function initNavbarBtns(container?: HTMLElement | Document | null): () => void {
  if (typeof window === "undefined" || !gsap) return () => {};

  const root = container || document;
  const buttons = Array.from(
    root.querySelectorAll<HTMLElement>(
      ".navbar-link-btn, .close-btn"
    )
  );

  const cleanups: (() => void)[] = [];

  const DrawSVGPlugin = (window as any).DrawSVGPlugin;
  if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

  buttons.forEach((btn) => {
    if (btn.dataset.navlinkInited === "true") return;
    btn.dataset.navlinkInited = "true";

    const svgs = Array.from(btn.querySelectorAll<SVGSVGElement>(".stroke-fill svg"));
    svgs.forEach((svg) => {
      svg.style.overflow = "visible";
      svg.style.width = "100%";
      svg.style.height = "100%";
    });

    const paths = Array.from(
      btn.querySelectorAll<SVGPathElement>(
        ".stroke-fill path, .stroke-fill-code path"
      )
    );
    if (!paths.length) return;

    const strokeFill = btn.querySelector<HTMLElement>(
      ".stroke-fill"
    );
    if (strokeFill) strokeFill.style.pointerEvents = "none";

    paths.forEach((path) => {
      path.style.strokeLinecap = "round";
      path.style.strokeLinejoin = "round";

      const targetStrokeWidth =
        parseFloat(path.getAttribute("stroke-width") || "24") || 24;

      const hasDrawSVG = typeof DrawSVGPlugin !== "undefined";

      let totalLen = 228.893;
      try {
        if (typeof path.getTotalLength === "function") {
          const l = path.getTotalLength();
          if (l > 0) totalLen = l;
        }
      } catch {
        // Fallback to pre-calculated length
      }

      if (hasDrawSVG) {
        gsap.set(path, { drawSVG: "0%", strokeWidth: 0 });
      } else {
        path.style.strokeDasharray = `${totalLen}px ${totalLen}px`;
        path.style.strokeDashoffset = `${totalLen}px`;
        gsap.set(path, { strokeWidth: 0 });
      }

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut" },
      });

      if (hasDrawSVG) {
        tl.to(path, {
          drawSVG: "100%",
          strokeWidth: targetStrokeWidth,
          duration: 0.5,
        });
      } else {
        tl.to(path, {
          strokeDashoffset: 0,
          strokeWidth: targetStrokeWidth,
          duration: 0.5,
        });
      }

      const onEnter = () => tl.timeScale(1).play();
      const onLeave = () => tl.timeScale(1.4).reverse();

      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("mouseleave", onLeave);
        tl.kill();
        btn.dataset.navlinkInited = "";
      });
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

/**
 * Authentic Two26 Studio CTA & Project Buttons Animation
 * - Fill expansion: 10x scale radiating outward from circular arrow badge
 * - Arrow: Infinite looping spring bounce (-25deg -> 0deg back.out(2.5))
 * - Magnetic Physics: Jitter-free static origin cursor tracking
 * - Elastic snap back on mouse leave
 */
export function initCTAButtons(container?: HTMLElement | Document | null): () => void {
  if (typeof window === "undefined" || !gsap) return () => {};

  const root = container || document;
  const buttons = Array.from(
    root.querySelectorAll<HTMLElement>(".cta-btn, .project-btn")
  );

  const cleanups: (() => void)[] = [];

  buttons.forEach((btn) => {
    if (btn.dataset.ctaInited === "true") return;
    btn.dataset.ctaInited = "true";

    const text = btn.querySelector<HTMLElement>(".cta-text");
    const arrow = btn.querySelector<HTMLElement>(".cta-btn-arrow, .svg-arrow-cta");
    const fillHover = btn.querySelector<HTMLElement>(".cta-btn-fill-hover");

    let arrowLoop: gsap.core.Timeline | null = null;

    if (fillHover) {
      gsap.set(fillHover, { scale: 1, transformOrigin: "center center" });
    }

    // 1. Mouse Enter: Scale 10x Fill + Looping Arrow Rotation Bounce
    const onEnter = () => {
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
    };

    // 2. Magnetic Movement (Jitter-Free: Uses true static origin)
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const currentX = (gsap.getProperty(btn, "x") as number) || 0;
      const currentY = (gsap.getProperty(btn, "y") as number) || 0;

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
      const innerElements = [text, arrow].filter(Boolean) as HTMLElement[];
      if (innerElements.length) {
        gsap.to(innerElements, {
          x: deltaX * 0.15,
          y: deltaY * 0.15,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    // 3. Mouse Leave: Snap back with spring elasticity & reset
    const onLeave = () => {
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

      const innerElements = [text, arrow].filter(Boolean) as HTMLElement[];
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
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);

    cleanups.push(() => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
      if (arrowLoop) arrowLoop.kill();
      gsap.killTweensOf([btn, text, arrow, fillHover].filter(Boolean) as HTMLElement[]);
      btn.dataset.ctaInited = "";
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}
