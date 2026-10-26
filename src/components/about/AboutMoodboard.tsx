"use client";

import React from "react";

const SLIDER_1_IMAGES = [
  "/images/about/behind-work-1.jpg",
  "/images/about/behind-work-2.jpg",
  "/images/about/behind-work-3.jpg",
  "/images/about/behind-work-4.jpg",
  "/images/about/behind-work-5.jpg",
];

const SLIDER_2_IMAGES = [
  "/images/about/behind-work-6.jpg",
  "/images/about/behind-work-7.jpg",
  "/images/about/behind-work-8.jpg",
  "/images/about/behind-work-9.jpg",
  "/images/about/behind-work-10.jpg",
];

// Continuous track sets (5 original images duplicated to ensure seamless infinite looping)
const ROW_1_SLIDES = [
  ...SLIDER_1_IMAGES,
  ...SLIDER_1_IMAGES,
  ...SLIDER_1_IMAGES,
  ...SLIDER_1_IMAGES,
];

const ROW_2_SLIDES = [
  ...SLIDER_2_IMAGES,
  ...SLIDER_2_IMAGES,
  ...SLIDER_2_IMAGES,
  ...SLIDER_2_IMAGES,
];

export default function AboutMoodboard() {
  return (
    <section className="section-moodboard">
      <div className="section-moodboard-wrapper">
        <div className="section-projects-header">
          <div className="section-about-text">OFF THE CLOCK</div>
          <div className="section-heading-wrapper">
            <h2 className="section-heading">Behind the work</h2>
            <h2 className="section-heading orange">Behind the work</h2>
          </div>
        </div>

        <div className="div-block-3">
          {/* Slider 1: Continuous Seamless Infinite Scroll (Moves Left) */}
          <div className="moodboard-slider-wrapper">
            <div className="moodboard-slider moodboard-slider-left">
              {ROW_1_SLIDES.map((src, i) => (
                <div key={i} className="moodboard-slide">
                  <img
                    src={src}
                    loading="lazy"
                    alt={`Moodboard ${(i % 5) + 1}`}
                    className="moodboard-img"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Slider 2: Continuous Seamless Infinite Scroll (Moves Right) */}
          <div className="moodboard-slider-wrapper">
            <div className="moodboard-slider moodboard-slider-right">
              {ROW_2_SLIDES.map((src, i) => (
                <div key={i} className="moodboard-slide">
                  <img
                    src={src}
                    loading="lazy"
                    alt={`Moodboard ${(i % 5) + 6}`}
                    className="moodboard-img"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
