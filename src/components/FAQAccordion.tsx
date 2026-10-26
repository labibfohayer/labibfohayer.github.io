"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import CatIllustration from "./CatIllustration";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What kind of projects do you take on?",
    answer:
      "Web design, full-stack development, and AI automation. Basically, if it lives on a screen and needs to look good while doing smart things, I build it. If it involves fixing your printer or hacking your ex's Facebook account, please call someone else!",
  },
  {
    id: 2,
    question: "How much does a website or automation project cost?",
    answer:
      "It depends! Every project is like a custom suit—one size does not fit all. However, my minimum project rate starts at $150 (I literally don't touch my keyboard for less than that). I price based on what you actually need, rather than pulling a mysterious number out of a hat (I don't even own a hat). Tell me your ideas, and we’ll figure out a fair price from there.",
  },
  {
    id: 3,
    question: "Can you redesign or upgrade an existing website?",
    answer:
      "Of course! Not everything needs to be burned to the ground. Sometimes your website just needs a fresh coat of code, some modern UI love, and a bit of automation magic so it stops looking like it was built in 2005.",
  },
  {
    id: 4,
    question: "Do you work with clients outside Bangladesh?",
    answer:
      "Absolutely. I'm based in Bangladesh, but thankfully my code and Wi-Fi don't need a passport or visa to travel. Whether you're in New York, London, or sitting on a remote island (as long as you have internet), we can work together!",
  },
  {
    id: 5,
    question: "What if we don't like the first concepts?",
    answer:
      "We will respectfully agree to disagree... just kidding! Feedback is completely fine. I build things for your business, not for my own ego. If something doesn't vibe with you, we tweak it until it does. No hard feelings!",
  },
  {
    id: 6,
    question: "How involved do we need to be?",
    answer:
      "Just involved enough to tell me what you want and approve the magic. Don't worry, I won't make you sit next to me on a 3-hour Zoom call while I move a button two pixels to the left.",
  },
  {
    id: 7,
    question: "Can you start yesterday?",
    answer:
      "I checked my time machine, and unfortunately, it's currently in the shop for repairs. So yesterday is fully booked. But send me a message, and I'll tell you exactly when we can realistically get the ball rolling!",
  },
  {
    id: 8,
    question: "Do you work with small businesses?",
    answer:
      "Yep! Whether you're a one-person army working from a garage or a growing startup, I care more about the vision than the company size. Plus, small businesses usually have the best snacks.",
  },
  {
    id: 9,
    question: "Do you handle both design and coding?",
    answer:
      "Yes, I am that rare hybrid. I don't just paint a pretty picture; I write the hardcore code to actually make it work. So yes, your dream website won't just stay a Figma design file forever—it will actually become a real website.",
  },
  {
    id: 10,
    question: "How long does a typical project take?",
    answer:
      "A simple landing page might take a week, while a complex AI workflow might take a few weeks. It really depends on what we are building. But I promise I work faster than a sloth on vacation. Let’s discuss the details, and I'll give you a real timeline!",
  },
];

export default function FAQAccordion() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 120 FPS hardware acceleration configuration
    gsap.ticker.fps(120);
    gsap.ticker.lagSmoothing(500, 16);

    const items = Array.from(
      container.querySelectorAll<HTMLElement>(".faq-item, .faq-block")
    );
    if (!items.length) return;

    // Filter to unique parent container if both .faq-item and .faq-block exist
    const faqItems = items.filter((item) => {
      return item.classList.contains("faq-item") || !item.closest(".faq-item");
    });

    let activeItem: HTMLElement | null = null;

    const getOpenWidth = () =>
      typeof window !== "undefined" && window.innerWidth >= 992 ? "50%" : "75%";

    // 1. Initial State Setup with 120 FPS GPU promotion
    faqItems.forEach((item, index) => {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(
        ".faq-block-btm, .faq-answer-block"
      );
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      if (qBlock) {
        qBlock.style.cursor = "pointer";
        qBlock.style.willChange = "width, border-width";
        qBlock.style.backfaceVisibility = "hidden";
      }
      if (aBlock) {
        aBlock.style.transformOrigin = "right bottom";
        aBlock.style.willChange = "transform, height, opacity";
        aBlock.style.backfaceVisibility = "hidden";
      }
      if (logo) {
        logo.style.transformOrigin = "center center";
        logo.style.willChange = "transform";
        logo.style.backfaceVisibility = "hidden";
      }
      if (answerText) {
        answerText.style.willChange = "transform, opacity";
        answerText.style.backfaceVisibility = "hidden";
      }

      if (index === 0) {
        // First FAQ item opens by default (50% desktop, 75% on < 992px)
        activeItem = item;
        item.classList.add("is-open");
        if (qBlock) {
          gsap.set(qBlock, {
            borderWidth: "1px",
            width: getOpenWidth(),
            force3D: true,
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
            force3D: true,
          });
        }
        if (logo) gsap.set(logo, { scale: 1, force3D: true });
        if (answerText) gsap.set(answerText, { opacity: 1, y: 0, force3D: true });
      } else {
        // All other items closed (100% width on all displays, height 0, scale 0)
        item.classList.remove("is-open");
        if (qBlock) {
          gsap.set(qBlock, { borderWidth: "0px", width: "100%", force3D: true });
        }
        if (aBlock) {
          gsap.set(aBlock, {
            height: 0,
            display: "none",
            overflow: "hidden",
            scale: 0,
            opacity: 0,
            transformOrigin: "right bottom",
            force3D: true,
          });
        }
        if (logo) gsap.set(logo, { scale: 0, force3D: true });
        if (answerText) gsap.set(answerText, { opacity: 0, y: 20, force3D: true });
      }
    });

    // 2. Open Item Timeline (120 FPS hardware accelerated)
    function openItem(item: HTMLElement) {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(
        ".faq-block-btm, .faq-answer-block"
      );
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      item.classList.add("is-open");

      const openTl = gsap.timeline({
        defaults: { ease: "power2.out", force3D: true },
      });

      // Step A: Question block width to 50% (desktop) / 75% (<992px), border 0px to 1px
      if (qBlock) {
        openTl.to(
          qBlock,
          {
            width: getOpenWidth(),
            borderWidth: "1px",
            duration: 0.45,
            force3D: true,
            overwrite: "auto",
          },
          0
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
          force3D: true,
        });
        openTl.fromTo(
          aBlock,
          { height: 0, scale: 0, force3D: true },
          {
            height: "auto",
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.6)",
            force3D: true,
            overwrite: "auto",
            onComplete: () => {
              gsap.set(aBlock, { overflow: "visible" });
            },
          },
          0.05
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
            force3D: true,
            overwrite: "auto",
          },
          0.15
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
            force3D: true,
            overwrite: "auto",
          },
          0.35
        );
      }
    }

    // 3. Close Item Timeline (120 FPS hardware accelerated)
    function closeItem(item: HTMLElement) {
      const qBlock = item.querySelector<HTMLElement>(".question-block");
      const aBlock = item.querySelector<HTMLElement>(
        ".faq-block-btm, .faq-answer-block"
      );
      const logo = item.querySelector<HTMLElement>(".faq-logo");
      const answerText = item.querySelector<HTMLElement>(".faq-answer");

      item.classList.remove("is-open");

      const closeTl = gsap.timeline({
        defaults: { ease: "power2.inOut", force3D: true },
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
            force3D: true,
            overwrite: "auto",
          },
          0
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
            force3D: true,
            overwrite: "auto",
          },
          0.12
        );
      }

      if (aBlock) {
        gsap.set(aBlock, { overflow: "hidden", force3D: true });
        closeTl.to(
          aBlock,
          {
            scale: 0,
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            force3D: true,
            overwrite: "auto",
            onComplete: () => {
              gsap.set(aBlock, { display: "none" });
            },
          },
          0.15
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
            force3D: true,
            overwrite: "auto",
          },
          0.18
        );
      }
    }

    // 4. Resize listener to update active open width across breakpoints
    const onResize = () => {
      if (activeItem) {
        const qBlock = activeItem.querySelector<HTMLElement>(".question-block");
        if (qBlock) {
          gsap.set(qBlock, { width: getOpenWidth(), force3D: true });
        }
      }
    };
    window.addEventListener("resize", onResize);

    // 5. Bind Click Triggers (One FAQ always remains open)
    const cleanupListeners: (() => void)[] = [];
    faqItems.forEach((item) => {
      const trigger = item.querySelector<HTMLElement>(".question-block") || item;

      const onClick = () => {
        // If already open, do nothing (one FAQ must always remain open)
        if (item === activeItem) return;

        // Close currently active item
        if (activeItem) {
          closeItem(activeItem);
        }

        // Open clicked item
        openItem(item);
        activeItem = item;
      };

      trigger.addEventListener("click", onClick);
      cleanupListeners.push(() => trigger.removeEventListener("click", onClick));
    });

    return () => {
      window.removeEventListener("resize", onResize);
      cleanupListeners.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section ref={containerRef} className="section-faq">
      <div className="section-faq-wrapper">
        {/* Left: Headers & Authentic Cat illustration */}
        <div className="faq-left">
          <div className="section-faq-header">
            <div className="about-text">Frequently Asked Questions</div>
            <div className="section-heading-wrapper">
              <h2 className="section-heading left-align">
                THINGS YOU MIGHT ASK
              </h2>
            </div>
          </div>
          <CatIllustration />
        </div>

        {/* Right: Authentic Accordion List */}
        <div className="faq-right">
          <div className="faq-list-wrapper w-dyn-list">
            <div role="list" className="faq-list w-dyn-items">
              {FAQS.map((faq) => (
                <div
                  key={faq.id}
                  role="listitem"
                  className="faq-item w-dyn-item"
                >
                  <div className="faq-block">
                    <div className="question-block">
                      <div className="faq-ques">{faq.question}</div>
                    </div>

                    <div className="faq-block-btm">
                      <div className="answer-block">
                        <p className="faq-answer">{faq.answer}</p>
                      </div>
                      <div className="faq-logo">
                        <div className="faq-logo-svg w-embed">
                          <span
                            className="faq-logo-text select-none"
                            style={{
                              fontFamily: 'var(--font-primary, "MDNichrome", serif)',
                              fontSize: "2.1em",
                              fontWeight: 700,
                              color: "#EBEAE6",
                              lineHeight: 1,
                              letterSpacing: "-0.01em",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              userSelect: "none",
                            }}
                          >
                            LF
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 120 FPS GPU Compositing Acceleration Layer */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .faq-block,
              .question-block,
              .faq-block-btm,
              .answer-block,
              .faq-logo,
              .faq-answer {
                will-change: transform, opacity;
                backface-visibility: hidden;
                -webkit-backface-visibility: hidden;
                transform-style: preserve-3d;
              }
            `,
          }}
        />
      </div>
    </section>
  );
}
