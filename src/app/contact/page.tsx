"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { initNavbarBtns } from "@/lib/buttonAnimations";

const SOCIAL_LINKS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/8801580506445",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/labibfohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/labibfohayer/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@LabibFohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@labibfohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.03 3.32-1.46 3.48-3.27.06-2.15.03-4.3.04-6.46V0l.21.02z" />
      </svg>
    ),
  },
  {
    name: "Telegram",
    href: "https://t.me/the_labib_fohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/labibfohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Behance",
    href: "https://www.behance.net/labibfohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.659 0-6-2.588-6-6 0-3.657 2.384-6 6-6 3.562 0 5.85 2.502 5.688 6.471h-8.688c.08 1.809 1.353 3.129 3 3.129 1.213 0 2.073-.654 2.44-1.6h2.286zm-5.726-5.4c-.09-1.351-1.011-2.2-2.274-2.2-1.294 0-2.146.862-2.316 2.2h4.59zm-13.435-7.6h4.86c1.674 0 2.916.36 3.725 1.08.736.657 1.109 1.547 1.109 2.67 0 1.21-.498 2.14-1.493 2.79 1.272.63 1.909 1.74 1.909 3.33 0 1.28-.463 2.33-1.389 3.15-.99.87-2.348 1.31-4.073 1.31h-4.648v-14.33zm3.178 5.77h1.492c.797 0 1.389-.13 1.776-.39.387-.26.58-.69.58-1.29 0-.58-.198-.99-.594-1.23-.396-.24-.984-.36-1.762-.36h-1.492v3.27zm0 5.84h1.746c.883 0 1.531-.17 1.944-.51.413-.34.62-.86.62-1.56 0-.69-.215-1.22-.645-1.59-.43-.37-1.121-.55-2.073-.55h-1.592v4.21z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/labibfohayer",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/labibfohayer/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const socialStackRef = useRef<HTMLDivElement>(null);

  // Close handler: smoothly returns to previous page / home using wave transition
  const handleClose = useCallback(() => {
    let targetPath = "/";
    try {
      if (typeof document !== "undefined" && document.referrer) {
        const refUrl = new URL(document.referrer, window.location.origin);
        if (refUrl.host === window.location.host && !refUrl.pathname.includes("/contact")) {
          targetPath = refUrl.pathname;
        }
      }
    } catch {
      targetPath = "/";
    }

    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition(targetPath, () => {
        router.push(targetPath);
      });
    } else {
      router.push(targetPath);
    }
  }, [router]);

  useEffect(() => {
    document.title = "Let's Talk | Labib Fohayer";
    document.body.style.backgroundColor = "#FF5400";

    const logo = logoRef.current;
    const closeBtn = closeBtnRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    const socialStack = socialStackRef.current;

    const headingChars = Array.from(
      document.querySelectorAll<HTMLElement>(".contact-heading-char")
    );
    const paraLines = Array.from(
      document.querySelectorAll<HTMLElement>(".contact-para-line")
    );
    const emailWords = Array.from(
      document.querySelectorAll<HTMLElement>(".contact-word")
    );
    const emailLinks = Array.from(
      document.querySelectorAll<HTMLElement>(".email-link")
    );

    // Initial animation setup
    if (content) gsap.set(content, { opacity: 1, y: 0 });
    if (logo) gsap.set(logo, { scale: 0, opacity: 0, transformOrigin: "center center" });
    if (closeBtn) gsap.set(closeBtn, { scale: 0.4, opacity: 0, y: 20, transformOrigin: "center center" });
    if (socialStack) gsap.set(socialStack, { opacity: 0 });
    if (img) gsap.set(img, { scale: 0.8, opacity: 0, x: 0, y: 0, rotation: 0, transformOrigin: "bottom center" });

    if (headingChars.length) gsap.set(headingChars, { opacity: 0, scale: 0.5, rotation: 0 });
    if (paraLines.length) gsap.set(paraLines, { y: "115%", opacity: 0 });
    if (emailWords.length) gsap.set(emailWords, { y: "105%", opacity: 0 });
    if (emailLinks.length) gsap.set(emailLinks, { opacity: 0, y: 15 });

    const tl = gsap.timeline();

    // 1. Navbar Logo (Fohayer signature) & Close button
    if (logo) {
      tl.to(
        logo,
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(2)",
        },
        0.1
      );
    }

    if (closeBtn) {
      tl.to(
        closeBtn,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(2.2)",
        },
        0.15
      );
    }

    // 2. Heading characters pop & settle
    if (headingChars.length) {
      headingChars.forEach((char, idx) => {
        const randomTilt = gsap.utils.random(-6, 6);
        const charStart = 0.2 + idx * 0.02;

        tl.to(
          char,
          {
            opacity: 1,
            scale: 1.1,
            rotation: randomTilt,
            textShadow:
              "0.4px 0.4px 0 currentColor, -0.4px -0.4px 0 currentColor, 0.4px -0.4px 0 currentColor, -0.4px 0.4px 0 currentColor",
            duration: 0.4,
            ease: "back.out(2)",
          },
          charStart
        ).to(
          char,
          {
            scale: 1,
            rotation: 0,
            textShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.5,
            ease: "power2.out",
          },
          charStart + 0.4
        );
      });
    }

    // 3. Subtext line slide up
    if (paraLines.length) {
      tl.to(
        paraLines,
        {
          y: "0%",
          opacity: 1,
          duration: 0.55,
          ease: "power3.out",
        },
        0.35
      );
    }

    // 4. Email Headings & links
    if (emailWords.length) {
      tl.to(
        emailWords,
        {
          y: "0%",
          opacity: 1,
          duration: 0.55,
          stagger: 0.04,
          ease: "power3.out",
        },
        0.25
      );
    }

    if (emailLinks.length) {
      tl.to(
        emailLinks,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.6)",
        },
        0.38
      );
    }

    // 5. Social capsules entrance (Static: zero button motion or hover flip)
    if (socialStack) {
      tl.to(
        socialStack,
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        0.35
      );
    }

    // 6. Contact Hand Graphic Pop
    if (img) {
      tl.to(
        img,
        {
          scale: 1,
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.75,
          ease: "back.out(1.8)",
        },
        0.4
      );
    }

    // Keyboard ESC listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    let cleanNavbarBtns: (() => void) | undefined;
    if (pageRef.current) {
      cleanNavbarBtns = initNavbarBtns(pageRef.current);
    }

    return () => {
      document.body.style.backgroundColor = "";
      window.removeEventListener("keydown", handleKeyDown);
      if (cleanNavbarBtns) cleanNavbarBtns();
      tl.kill();
    };
  }, [handleClose]);

  // Kinetic letter hover effect for email addresses
  const handleEmailLetterHover = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    const randomTilt = gsap.utils.random(-8, 8);
    gsap.to(el, {
      scale: 1.18,
      rotation: randomTilt,
      duration: 0.22,
      ease: "back.out(2)",
      onComplete: () => {
        gsap.to(el, {
          scale: 1,
          rotation: 0,
          duration: 0.35,
          ease: "power2.out",
        });
      },
    });
  };

  return (
    <div
      ref={pageRef}
      className="contact-page is-active standalone-contact-page"
      style={{
        backgroundColor: "#FF5400",
        minHeight: "100svh",
        width: "100%",
        display: "flex",
      }}
    >
      {/* Isolated Header strictly for Let's Talk: Fohayer Logo & Close Button ONLY */}
      <div className="contact-navbar">
        <div ref={logoRef} className="navbar-logo-contact">
          <span
            className="text-[#F8EEE8] select-none whitespace-nowrap inline-block"
            style={{
              fontFamily: '"GreatVibes", cursive',
              fontSize: "3.1em",
              lineHeight: 1,
              fontWeight: 400,
              color: "#F8EEE8",
              transform: "translateY(1px)",
            }}
          >
            Fohayer
          </span>
        </div>

        <div className="close-btn-wrapper">
          <button
            ref={closeBtnRef}
            onClick={handleClose}
            className="close-btn cursor-pointer"
            aria-label="Close"
          >
            <div className="stroke-fill">
              <div className="stroke-fill-code">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 75 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                    stroke="#FF5400"
                    strokeWidth="28"
                    strokeLinecap="round"
                    className="draw-svg-path"
                  />
                </svg>
              </div>
            </div>
            <div
              className="back-arrow"
              style={{
                width: 8,
                height: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.86328 0.5L0.499281 6.864M6.86328 6.864L0.499281 0.5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            <span className="back-btn-txt" style={{ position: "relative", zIndex: 2 }}>Close</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div ref={contentRef} className="contact-content">
        {/* Left Typography Block */}
        <div className="contact-left">
          <h2 className="contact-heading" aria-label="want to">
            <span style={{ display: "inline-block", marginRight: "0.26em" }}>
              {["W", "A", "N", "T"].map((c, i) => (
                <span key={i} className="contact-heading-char">
                  {c}
                </span>
              ))}
            </span>
            <span style={{ display: "inline-block" }}>
              {["T", "O"].map((c, i) => (
                <span key={i} className="contact-heading-char">
                  {c}
                </span>
              ))}
            </span>
          </h2>

          <h2 className="contact-heading" aria-label="start">
            <span style={{ display: "inline-block" }}>
              {["S", "T", "A", "R", "T"].map((c, i) => (
                <span key={i} className="contact-heading-char">
                  {c}
                </span>
              ))}
            </span>
          </h2>

          <h2 className="contact-heading right" aria-label="a new">
            <span style={{ display: "inline-block", marginRight: "0.28em" }}>
              <span className="contact-heading-char">A</span>
            </span>
            <span style={{ display: "inline-block" }}>
              {["N", "E", "W"].map((c, i) => (
                <span key={i} className="contact-heading-char">
                  {c}
                </span>
              ))}
            </span>
          </h2>

          <h2 className="contact-heading left" aria-label="project?">
            <span style={{ display: "inline-block" }}>
              {["P", "R", "O", "J", "E", "C", "T"].map((c, i) => (
                <span key={i} className="contact-heading-char">
                  {c}
                </span>
              ))}
              <span
                className="contact-heading-char"
                style={{
                  display: "inline-block",
                  verticalAlign: "baseline",
                  width: "0.50em",
                  height: "0.69em",
                  position: "relative",
                  marginLeft: "0.05em",
                }}
              >
                <img
                  src="/nichrome-question.png"
                  alt="?"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </span>
            </span>
          </h2>

          <p className="contact-para left" aria-label="or just say hello!">
            <span className="contact-para-line-mask">
              <span className="contact-para-line">or just say hello!</span>
            </span>
          </p>
        </div>

        {/* Right Email Inquiries Block */}
        <div className="contact-right">
          <div className="contact-email-wrap">
            <div className="email-heading" aria-label="Inquiries & Commissions">
              <span className="contact-word-mask">
                <span className="contact-word">INQUIRIES</span>
              </span>{" "}
              <span className="contact-word-mask">
                <span className="contact-word">&amp;</span>
              </span>{" "}
              <span className="contact-word-mask">
                <span className="contact-word">COMMISSIONS</span>
              </span>
            </div>
            <a
              href="mailto:labibfohayer@gmail.com?subject=Inquiries%20%26%20commissions"
              className="email-link"
            >
              {"labibfohayer@gmail.com".split("").map((c, i) => (
                <span
                  key={i}
                  className="contact-email-char"
                  onMouseEnter={handleEmailLetterHover}
                >
                  {c}
                </span>
              ))}
            </a>
          </div>

          <div className="contact-email-wrap">
            <div className="email-heading" aria-label="Job Applications">
              <span className="contact-word-mask">
                <span className="contact-word">JOB</span>
              </span>{" "}
              <span className="contact-word-mask">
                <span className="contact-word">APPLICATIONS</span>
              </span>
            </div>
            <a
              href="mailto:zayanarham07@gmail.com?subject=Job%20Applications"
              className="email-link"
            >
              {"zayanarham07@gmail.com".split("").map((c, i) => (
                <span
                  key={i}
                  className="contact-email-char"
                  onMouseEnter={handleEmailLetterHover}
                >
                  {c}
                </span>
              ))}
            </a>
          </div>
        </div>
      </div>

      {/* Right Social Media & Contact Links Stack (100% Static - zero motion) */}
      <div ref={socialStackRef} className="contact-social-stack">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-capsule-btn"
            aria-label={item.name}
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
      </div>

      {/* Hand Graphic Illustration */}
      <div className="contact-img-wrap">
        <img
          ref={imgRef}
          src="/cdn-assets/6aaad679fdb9d914f7f5206b_contact.svg"
          alt="Let's Talk"
          className="contact-img"
          loading="lazy"
        />
      </div>
    </div>
  );
}
