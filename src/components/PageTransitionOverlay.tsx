"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;

    // Helper: Reset and completely hide overlay immediately
    const resetOverlay = () => {
      sessionStorage.removeItem("two26_transition_active");
      document.documentElement.classList.remove("page-transitioning");

      if (overlay) {
        overlay.style.display = "none";
        overlay.style.visibility = "hidden";
        overlay.style.pointerEvents = "none";
        overlay.style.opacity = "0";
      }
      if (path) {
        gsap.killTweensOf(path);
        const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
        path.style.strokeDasharray = `${totalLen}`;
        path.style.strokeDashoffset = `${totalLen}`;
        path.style.strokeWidth = "0px";
      }
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    // Helper: Animate overlay OUT (1600px -> 0px) to seamlessly reveal target page
    const animateOut = () => {
      sessionStorage.removeItem("two26_transition_active");
      document.documentElement.classList.remove("page-transitioning");

      overlay.style.display = "flex";
      overlay.style.visibility = "visible";
      overlay.style.pointerEvents = "auto";
      overlay.style.opacity = "1";

      const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
      path.style.strokeDasharray = `${totalLen}`;

      gsap.killTweensOf(path);
      gsap.fromTo(
        path,
        { strokeDashoffset: 0, strokeWidth: "1600px" },
        {
          strokeDashoffset: totalLen,
          strokeWidth: "0px",
          duration: 0.65,
          ease: "power2.inOut",
          onComplete: () => {
            resetOverlay();
          },
        }
      );
    };

    // Check if an incoming page transition is active
    const isTransitionActive =
      typeof window !== "undefined" &&
      sessionStorage.getItem("two26_transition_active") === "true";

    if (isTransitionActive) {
      animateOut();
    } else {
      resetOverlay();
    }

    // BFCache (Back/Forward Cache) & popstate handlers
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted || sessionStorage.getItem("two26_transition_active") !== "true") {
        resetOverlay();
      } else {
        animateOut();
      }
    };

    const handlePopState = () => {
      resetOverlay();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("popstate", handlePopState);

    // Safety timeout: Ensure overlay never remains visible longer than 1.5s
    const safetyTimer = setTimeout(() => {
      if (overlay && window.getComputedStyle(overlay).display !== "none") {
        resetOverlay();
      }
    }, 1500);

    // Expose global trigger function
    (window as any).triggerPageTransition = (
      url: string,
      navigateCallback?: () => void
    ) => {
      if (!overlay || !path) {
        if (navigateCallback) {
          navigateCallback();
        } else {
          window.location.href = url;
        }
        return;
      }

      sessionStorage.setItem("two26_transition_active", "true");
      document.documentElement.classList.add("page-transitioning");

      overlay.style.display = "flex";
      overlay.style.visibility = "visible";
      overlay.style.pointerEvents = "auto";
      overlay.style.opacity = "1";

      const totalLen = path.getTotalLength ? path.getTotalLength() : 3000;
      path.style.strokeDasharray = `${totalLen}`;
      path.style.strokeDashoffset = `${totalLen}`;

      gsap.killTweensOf(path);
      // Sweep IN (0 -> 1600px) matching Let's Talk button transition
      gsap.fromTo(
        path,
        { strokeDashoffset: totalLen, strokeWidth: "0px" },
        {
          strokeDashoffset: 0,
          strokeWidth: "1600px",
          duration: 0.65,
          ease: "power2.inOut",
          onComplete: () => {
            if (navigateCallback) {
              navigateCallback();
            } else {
              window.location.href = url;
            }
          },
        }
      );
    };

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("popstate", handlePopState);
      resetOverlay();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="page-transition-overlay"
      aria-hidden="true"
      style={{
        display: "none",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      <div className="svg-tcontact">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 998 901"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={pathRef}
            d="M372.5 886C372.5 886 879.181 886 855 766.5C801.982 504.5 19.5 1042.52 19.5 646.5C19.5 316.5 952.535 583.56 978 318.5C1000 89.5 193.6 431.263 111 221C34.6544 26.6589 565 19 565 19"
            stroke="#FF5400"
            strokeWidth="0"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
