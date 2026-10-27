"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { initCTAButtons } from "@/lib/buttonAnimations";

interface FooterProps {
  onOpenContact?: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof (window as any).triggerPageTransition === "function") {
      (window as any).triggerPageTransition("/contact", () => {
        router.push("/contact");
      });
    } else {
      router.push("/contact");
    }
  };

  useEffect(() => {
    if (typeof (window as any).initTwo26FooterAnimation === "function") {
      (window as any).initTwo26FooterAnimation();
    }
    const cleanCta = initCTAButtons(footerRef.current);
    return () => {
      cleanCta();
    };
  }, []);

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-wrapper">
        <div className="footer-top">
          {/* Top Left: Main CTA and Direct Contact */}
          <div className="footer-top-left">
            <h2 className="footer-heading">
              HAVE A PROJECT IN MIND? LET’S CHAT!
            </h2>
            <button
              type="button"
              onClick={handleContactClick}
              className="cta-btn cursor-pointer"
            >
              <span className="cta-text">Let&apos;s talk</span>
              <div className="cta-btn-arrow">
                <div className="svg-arrow-cta">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_cta_arrow_footer)">
                      <path
                        d="M1.46439 8.53621L8.53546 1.46515M3.05538 1.28837L8.53546 1.46515L8.71223 6.94522"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_cta_arrow_footer">
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

          {/* Top Right: Address */}
          <div className="footer-top-right">
            <div className="footer-top-right-btm" style={{ marginTop: "auto" }}>
              <div className="footer-address">
                Dhaka,
                <br />
                Bangladesh
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom with LABIB Mega Logo */}
        <div className="footer-btm">
          <div className="footer-rights-text">
            © Labib Fohayer 2026
          </div>
          <div className="footer-logo-wrap">
            <div className="footer-svg-logo">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1400 309"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.00 4.50L0.00 304.50L199.72 304.50L199.72 262.12L49.93 262.12L49.93 4.50Z"
                  fill="#ECEAE5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M497.80 233.59L522.13 304.50L572.90 304.50L462.97 4.50L410.52 4.50L300.17 304.50L350.94 304.50L375.28 233.59ZM389.13 192.05L436.54 50.23L437.38 50.23L484.37 192.05Z"
                  fill="#ECEAE5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M899.51 80.02C899.51 31.77 863.85 4.50 802.17 4.50L673.36 4.50L673.36 304.50L809.30 304.50C871.40 304.50 911.26 274.71 911.26 216.81C911.26 171.91 884.41 148.84 852.94 143.38L852.94 142.54C877.69 134.15 899.51 116.95 899.51 80.02ZM723.29 128.70L723.29 46.88L803.43 46.88C833.22 46.88 849.58 61.56 849.58 88.00C849.58 114.43 836.15 128.70 800.49 128.70ZM723.29 166.04L810.98 166.04C842.45 166.04 861.33 183.24 861.33 213.87C861.33 241.98 848.32 262.12 805.52 262.12L723.29 262.12Z"
                  fill="#ECEAE5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1011.71 4.50L1011.71 304.50L1061.64 304.50L1061.64 4.50Z"
                  fill="#ECEAE5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1388.25 80.02C1388.25 31.77 1352.59 4.50 1290.91 4.50L1162.10 4.50L1162.10 304.50L1298.04 304.50C1360.14 304.50 1400.00 274.71 1400.00 216.81C1400.00 171.91 1373.15 148.84 1341.68 143.38L1341.68 142.54C1366.43 134.15 1388.25 116.95 1388.25 80.02ZM1212.03 128.70L1212.03 46.88L1292.17 46.88C1321.96 46.88 1338.32 61.56 1338.32 88.00C1338.32 114.43 1324.90 128.70 1289.23 128.70ZM1212.03 166.04L1299.72 166.04C1331.19 166.04 1350.07 183.24 1350.07 213.87C1350.07 241.98 1337.06 262.12 1294.27 262.12L1212.03 262.12Z"
                  fill="#ECEAE5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Noise Texture & Background Overlay */}
      <div className="footer-overlay-bg">
        <div className="footer-overlay" />
        <img
          loading="lazy"
          src="/cdn-assets/6aaad679fdb9d914f7f52067_footer-texture.svg"
          alt=""
          className="footer-texture"
        />
      </div>
    </footer>
  );
}
