"use client";

const ITEMS = [
  "BRANDING",
  "PACKAGING DESIGN",
  "CREATIVE STRATEGY",
  "DIGITAL EXPERIENCES",
  "WEBFLOW DEVELOPMENT",
  "3D MOTION GRAPHICS",
  "VISUAL IDENTITY",
];

export default function Marquee() {
  return (
    <div className="w-full overflow-hidden bg-black py-4 select-none border-y border-black">
      <div className="flex w-max animate-marquee gap-8 items-center">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-nichrome font-bold text-sm sm:text-base tracking-widest text-[#f8eee8] uppercase whitespace-nowrap">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#ff5400] inline-block" />
          </div>
        ))}
      </div>
    </div>
  );
}
