"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { initNavbarBtns, initCTAButtons } from "@/lib/buttonAnimations";

interface NavbarProps {
  onOpenContact?: () => void;
}

export default function Navbar({ onOpenContact }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/contact") return;
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/contact", () => {
        router.push("/contact");
      });
    } else {
      router.push("/contact");
    }
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/about") return;
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/about", () => {
        router.push("/about");
      });
    } else {
      router.push("/about");
    }
  };

  const handleWorkClick = (e: React.MouseEvent) => {
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
  const svgRef = useRef<SVGSVGElement>(null);
  const navOverlayRef = useRef<HTMLDivElement>(null);
  const iconTlRef = useRef<gsap.core.Timeline | null>(null);
  const navTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const cleanNavBtns = initNavbarBtns(headerRef.current);
    const cleanCtaBtns = initCTAButtons(headerRef.current);

    const primarySvg = svgRef.current;
    if (!primarySvg) return;

    const orangePath = primarySvg.querySelector<SVGPathElement>(".orange-path");
    const crossPath = primarySvg.querySelector<SVGPathElement>(".cross-path");
    if (!orangePath || !crossPath) return;

    const orangeTotalLen = orangePath.getTotalLength ? orangePath.getTotalLength() : 111.029;
    const crossTotalLen = crossPath.getTotalLength ? crossPath.getTotalLength() : 20;

    let horseshoeLen = 52.6;
    try {
      for (let len = 0; len < orangeTotalLen; len += 0.2) {
        const pt = orangePath.getPointAtLength(len);
        if (len > 30 && pt.x <= 9.05 && Math.abs(pt.y - 16.02) < 0.3) {
          horseshoeLen = len;
          break;
        }
      }
    } catch {
      // Fallback to pre-calculated Labib length
    }

    const stemLen = 20.0;
    const finalOffset = -(orangeTotalLen - stemLen);

    orangePath.style.strokeDasharray = `${horseshoeLen} ${orangeTotalLen}`;
    orangePath.style.strokeDashoffset = "0";

    crossPath.style.strokeDasharray = `${crossTotalLen} ${crossTotalLen}`;
    crossPath.style.strokeDashoffset = `${crossTotalLen}`;
    gsap.set(crossPath, { strokeWidth: 0 });
    gsap.set(primarySvg, { rotation: 0, transformOrigin: "center center" });

    const iconTl = gsap.timeline({ paused: true });
    const dashObj = { len: horseshoeLen, offset: 0 };

    iconTl
      .to(
        dashObj,
        {
          len: stemLen,
          offset: finalOffset,
          duration: 0.85,
          ease: "power2.inOut",
          onUpdate: () => {
            orangePath.style.strokeDasharray = `${dashObj.len} ${orangeTotalLen}`;
            orangePath.style.strokeDashoffset = `${dashObj.offset}`;
          },
        },
        0
      )
      .to(
        crossPath,
        {
          strokeWidth: 4,
          duration: 0.12,
          ease: "back.out(2)",
        },
        0.1
      )
      .to(
        crossPath,
        {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        0.2
      )
      .to(
        primarySvg,
        {
          rotation: 45,
          duration: 0.85,
          ease: "power3.inOut",
        },
        0
      );

    iconTlRef.current = iconTl;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      cleanNavBtns();
      cleanCtaBtns();
      iconTl.kill();
      if (navTlRef.current) navTlRef.current.kill();
      document.body.style.overflow = "";
    };
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
    iconTlRef.current?.play();
    const hamNavbar = navOverlayRef.current;
    if (!hamNavbar) return;

    document.body.style.overflow = "hidden";
    hamNavbar.classList.add("is-open");
    hamNavbar.style.display = "flex";
    hamNavbar.style.pointerEvents = "auto";

    if (navTlRef.current) navTlRef.current.kill();
    const navTl = gsap.timeline();
    navTl.fromTo(
      hamNavbar,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" },
      0
    );

    const linksContainer = hamNavbar.querySelector(".hamburger-links");
    const linkItems = linksContainer ? Array.from(linksContainer.children) : [];
    if (linkItems.length) {
      linkItems.forEach((item, index) => {
        const randomTilt = gsap.utils.random(-10, 10);
        navTl.fromTo(
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
          0.15 + index * 0.09
        );
      });
    }
    navTlRef.current = navTl;
  };

  const closeMenu = () => {
    iconTlRef.current?.reverse();
    const hamNavbar = navOverlayRef.current;
    if (!hamNavbar) {
      setIsMenuOpen(false);
      return;
    }

    if (navTlRef.current) navTlRef.current.kill();
    const navTl = gsap.timeline({
      onComplete: () => {
        hamNavbar.classList.remove("is-open");
        hamNavbar.style.display = "none";
        hamNavbar.style.pointerEvents = "none";
        document.body.style.overflow = "";
        setIsMenuOpen(false);
      },
    });

    const linksContainer = hamNavbar.querySelector(".hamburger-links");
    const linkItems = linksContainer ? Array.from(linksContainer.children) : [];
    if (linkItems.length) {
      navTl.to(
        linkItems,
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.25,
          stagger: 0.04,
          ease: "power2.in",
        },
        0
      );
    }

    navTl.to(
      hamNavbar,
      { opacity: 0, duration: 0.3, ease: "power2.inOut" },
      0.1
    );
    navTlRef.current = navTl;
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  return (
    <header ref={headerRef} className="header">
      <nav className="navbar-wrap">
        {/* Left Navigation Capsule Buttons */}
        <div className="navbar-links">
          <Link
            href="/work"
            onClick={handleWorkClick}
            className="navbar-link-btn group cursor-pointer"
          >
            <span className="navlink-text">Work</span>
            <div className="stroke-fill">
              <div className="stroke-fill-code">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 75 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible w-full h-full"
                >
                  <path
                    d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                    stroke="#FF5400"
                    strokeWidth="24"
                    strokeLinecap="round"
                    className="draw-svg-path"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/about"
            onClick={handleAboutClick}
            className="navbar-link-btn group cursor-pointer"
          >
            <span className="navlink-text">About me</span>
            <div className="stroke-fill">
              <div className="stroke-fill-code">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 75 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible w-full h-full"
                >
                  <path
                    d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                    stroke="#FF5400"
                    strokeWidth="24"
                    strokeLinecap="round"
                    className="draw-svg-path"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Brand Logo */}
        <Link href="/" aria-current="page" aria-label="Fohayer" className="navbar-logo !w-auto">
          <div className="logo-svg !w-auto h-full flex items-center justify-center">
            <span
              className="text-[#FF5400] select-none whitespace-nowrap inline-block"
              style={{
                fontFamily: '"GreatVibes", cursive',
                fontSize: '3.1em',
                lineHeight: 1,
                fontWeight: 400,
                color: '#FF5400',
                transform: 'translateY(1px)',
              }}
            >
              Fohayer
            </span>
          </div>
        </Link>

        {/* Right Timing & Let's Talk CTA */}
        <div className="navbar-right">
          <div className="navbar-timing">
            Monday–Friday<br />10:00 – 17:00
          </div>
          <div className="cta-wrap">
            <button
              onClick={handleContactClick}
              className="cta-btn cursor-pointer"
            >
              <span className="cta-text">Let&apos;s Talk</span>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_cta_arrow)">
                      <path
                        d="M1.46439 8.53621L8.53546 1.46515M3.05538 1.28837L8.53546 1.46515L8.71223 6.94522"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_cta_arrow">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(10) rotate(90)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="cta-btn-fill-hover" />
            </button>
          </div>

          {/* TWO 26 Authentic Morphing Hamburger Button (Mobile <= 768px only) */}
          <div className="ham-btn">
            <button
              type="button"
              className="two26-nav-toggle-btn"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                ref={svgRef}
                className="two26-toggle-svg"
                viewBox="-2 6.52 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Looping Horseshoe -> Vertical Stem Path */}
                <path
                  className="orange-path"
                  d="M7.01247 34.0204C7.01247 34.0204 10.1314 34.0204 20.8246 34.0204C31.5179 34.0204 31.2364 16.0204 20.8246 16.0205C10.4128 16.0205 9.00975 16.0196 9.00975 16.0196C5.0415 16.0196 2 12.8812 2 9.00979C2 5.13839 5.13839 2 9.00979 2C12.8679 2.01076 15.9893 5.1363 16 8.98937V34.5196"
                  stroke="#FF5400"
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ strokeDasharray: "52.6, 111.029", strokeDashoffset: "0" }}
                />
                {/* Cross Bar (Left -> Right) */}
                <path
                  className="cross-path"
                  d="M6 24.52H26"
                  stroke="#FF5400"
                  strokeWidth="0"
                  strokeLinecap="round"
                  style={{ strokeDasharray: "20, 20", strokeDashoffset: "20", strokeWidth: "0px" }}
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* TWO 26 Authentic Fullscreen Mobile Navigation Drawer (Mobile <= 768px only) */}
      <div ref={navOverlayRef} className="ham-navbar">
        <div className="hamburger-links">
          <Link
            href="/work"
            onClick={(e) => {
              closeMenu();
              handleWorkClick(e);
            }}
            className="navbar-link-btn group cursor-pointer"
          >
            <span className="navlink-text">Work</span>
            <div className="stroke-fill">
              <div className="stroke-fill-code">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 75 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible w-full h-full"
                >
                  <path
                    d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                    stroke="#FF5400"
                    strokeWidth="24"
                    strokeLinecap="round"
                    className="draw-svg-path"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/about"
            onClick={(e) => {
              closeMenu();
              handleAboutClick(e);
            }}
            className="navbar-link-btn group cursor-pointer"
          >
            <span className="navlink-text">About me</span>
            <div className="stroke-fill">
              <div className="stroke-fill-code">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 75 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible w-full h-full"
                >
                  <path
                    d="M0 21.5571C0 21.5571 6.56744 2.8501 15.4762 4.44988C25.7691 6.2982 5.66141 21.3471 12.5002 29.1915C22.9246 41.1486 29.3907 -7.93025 42.4603 1.12139C53.3211 8.6432 27.1823 26.7575 37.6982 34.7461C50.754 44.6641 58.0718 -7.92618 67.2619 5.59531C72.4564 13.2381 57.9637 30.3713 67.2619 30.3713C70.8333 30.3713 75 19.753 75 19.753"
                    stroke="#FF5400"
                    strokeWidth="24"
                    strokeLinecap="round"
                    className="draw-svg-path"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <div className="ham-cta">
            <button
              onClick={(e) => {
                closeMenu();
                handleContactClick(e);
              }}
              className="cta-btn cursor-pointer"
            >
              <span className="cta-text">Let&apos;s Talk</span>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_cta_arrow_ham)">
                      <path
                        d="M1.46439 8.53621L8.53546 1.46515M3.05538 1.28837L8.53546 1.46515L8.71223 6.94522"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_cta_arrow_ham">
                        <rect
                          width="10"
                          height="10"
                          fill="white"
                          transform="translate(10) rotate(90)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="cta-btn-fill-hover" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
