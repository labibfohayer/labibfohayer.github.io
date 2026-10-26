import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Two26 Studio | Boutique Branding & Digital Design Studio",
  description:
    "Two26 is a boutique design studio creating brands with strategy, personality and a healthy obsession for the details.",
  keywords: [
    "Two26 Studio",
    "Branding Studio",
    "Packaging Design",
    "Webflow Development",
    "Bucharest Design Studio",
  ],
  openGraph: {
    title: "Two26 Studio | Boutique Branding & Digital Design Studio",
    description:
      "Creating brands with strategy, personality and a healthy obsession for the details.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head />
      <body className="body antialiased">
        {/* Core GSAP Suite & jQuery */}
        <Script src="/js/jquery-3.5.1.min.dc5e7f18c8.js" strategy="beforeInteractive" />
        <Script src="/js/gsap.min.js" strategy="beforeInteractive" />
        <Script src="/js/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="/js/SplitText.min.js" strategy="beforeInteractive" />
        <Script src="/js/DrawSVGPlugin.min.js" strategy="beforeInteractive" />
        <Script src="/js/MotionPathPlugin.min.js" strategy="beforeInteractive" />
        <Script src="/js/CustomEase.min.js" strategy="beforeInteractive" />
        <Script src="/js/CustomBounce.min.js" strategy="beforeInteractive" />
        <Script src="/js/lenis.min.js" strategy="beforeInteractive" />
        <Script src="/js/two26-bundle.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
