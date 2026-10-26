import type { Metadata } from "next";
import Script from "next/script";
import PageTransitionOverlay from "@/components/PageTransitionOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labib Fohayer | Web Designer & AI Automation Engineer",
  description:
    "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
  openGraph: {
    title: "Labib Fohayer | Web Designer & AI Automation Engineer",
    description:
      "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
    siteName: "Labib Fohayer",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Labib Fohayer | Web Designer & AI Automation Engineer",
    description:
      "Portfolio of Labib Fohayer. Blending creative web design with intelligent AI automation to build scalable business systems.",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof sessionStorage!=='undefined'&&sessionStorage.getItem('two26_transition_active')==='true'){document.documentElement.classList.add('page-transitioning');}`,
          }}
        />
      </head>
      <body className="body antialiased">
        <PageTransitionOverlay />
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
        <Script src="/js/labibfohayer-bundle.js" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
