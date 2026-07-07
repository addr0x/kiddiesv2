"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { contestants } from "./contestants_data";

const ZigZag = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 260 16"
    className={`w-full max-w-[260px] ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden>
    <polyline
      points="0,8 13,0 26,8 39,0 52,8 65,0 78,8 91,0 104,8 117,0 130,8 143,0 156,8 169,0 182,8 195,0 208,8 221,0 234,8 247,0 260,8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StampBadge = () => (
  <svg viewBox="0 0 200 200" className="w-32 h-32 lg:w-36 lg:h-36" aria-hidden>
    <circle
      cx="100"
      cy="100"
      r="94"
      fill="#FACC14"
      stroke="#111"
      strokeWidth="3"
    />
    <circle
      cx="100"
      cy="100"
      r="80"
      fill="none"
      stroke="#111"
      strokeWidth="1.5"
      strokeDasharray="4 3"
    />
    <defs>
      <path id="topArc" d="M 100,100 m -66,0 a 66,66 0 1,1 132,0" />
      <path id="botArc" d="M 100,100 m -66,0 a 66,66 0 0,0 132,0" />
    </defs>
    <text
      fontSize="9.5"
      fontWeight="900"
      fontFamily="var(--font-fredoka)"
      fill="#111"
      letterSpacing="2.5">
      <textPath href="#topArc" startOffset="4%">
        THE FUTURE STAR CHALLENGE
      </textPath>
    </text>
    <text
      fontSize="9.5"
      fontWeight="900"
      fontFamily="var(--font-fredoka)"
      fill="#111"
      letterSpacing="2.5">
      <textPath href="#botArc" startOffset="10%">
        ★ LEADRITEHUB.COM ★ 2025
      </textPath>
    </text>
    <text x="100" y="116" textAnchor="middle" fontSize="44" fill="#111">
      ★
    </text>
  </svg>
);

const blobStyles = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "40% 60% 70% 30% / 30% 60% 40% 70%",
  "70% 30% 40% 60% / 50% 60% 40% 50%",
  "30% 70% 60% 40% / 60% 40% 60% 40%",
];

const imageLabels = ["Champion", "Talented", "Adorable", "Future Star"];
const stickers = ["🌸", "⭐", "🌺", "💫"];

const pills = [
  {
    label: "Register",
    className: "bg-[#FACC14] text-black border-2 border-[#FACC14]",
  },
  {
    label: "Campaign",
    className: "bg-[#FB923C] text-black border-2 border-[#FB923C]",
  },
  {
    label: "Vote",
    className: "bg-[#A855F7] text-white border-2 border-[#A855F7]",
  },
  {
    label: "Win 🏆",
    className: "bg-[#22C55E] text-white border-2 border-[#22C55E]",
  },
];

export default function HeroPage() {
  return (
    <section className="full-bleed bg-white min-h-dvh pt-20 pb-16 px-6 lg:px-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Left column */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-7 max-w-xl">
        <h1 className="font-bold text-black leading-[1.05] text-[clamp(2.8rem,7vw,4.6rem)]">
          Nigeria&apos;s Most{" "}
          <span className="relative inline-block">
            <span className="relative z-10">Exciting</span>
            <span
              className="absolute inset-x-0 bottom-1 h-4 bg-[#FACC14] -z-0 -rotate-1 rounded"
              aria-hidden
            />
          </span>
          <br />
          Kids Contest!
        </h1>

        <div className="flex flex-wrap gap-3">
          {pills.map((p) => (
            <span
              key={p.label}
              className={`${p.className} px-5 py-2 rounded-full font-bold text-sm`}>
              {p.label}
            </span>
          ))}
        </div>

        <ZigZag className="text-black/20" />

        <p className="text-gray-700 font-semibold text-[1.05rem] leading-relaxed max-w-[42ch]">
          Register your child, campaign to gather votes, and watch them compete
          for a{" "}
          <strong className="text-black">
            ₦1,000,000 in cash prizes + 3-year scholarship
          </strong>{" "}
          in MyChild&I Contest for ages 0 to 8 years.
        </p>

        <div className="flex flex-wrap gap-4 items-center pt-1">
          {/* Wavy-border CTA */}
          <div className="relative inline-block">
            <svg
              viewBox="0 0 220 54"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              aria-hidden>
              <path
                d="M8,3 Q12,0 17,3 Q22,6 27,3 Q32,0 37,3 Q42,6 47,3 Q52,0 57,3 Q62,6 67,3 Q72,0 77,3 Q82,6 87,3 Q92,0 97,3 Q102,6 107,3 Q112,0 117,3 Q122,6 127,3 Q132,0 137,3 Q142,6 147,3 Q152,0 157,3 Q162,6 167,3 Q172,0 177,3 Q182,6 187,3 Q192,0 197,3 Q202,6 207,3 Q212,0 215,3 L218,3 Q220,3 220,6 L220,48 Q220,51 217,51 L215,51 Q212,54 207,51 Q202,48 197,51 Q192,54 187,51 Q182,48 177,51 Q172,54 167,51 Q162,48 157,51 Q152,54 147,51 Q142,48 137,51 Q132,54 127,51 Q122,48 117,51 Q112,54 107,51 Q102,48 97,51 Q92,54 87,51 Q82,48 77,51 Q72,54 67,51 Q62,48 57,51 Q52,54 47,51 Q42,48 37,51 Q32,54 27,51 Q22,48 17,51 Q12,54 8,51 L3,51 Q0,51 0,48 L0,6 Q0,3 3,3 Z"
                fill="none"
                stroke="#111"
                strokeWidth="2"
              />
            </svg>
            <Link
              href="/register"
              target="_blank"
              className="relative inline-flex items-center gap-2 font-bold text-black px-8 py-3.5 text-sm hover:opacity-70 transition">
              Register Now →
            </Link>
          </div>

          <Link
            href="/#about"
            className="inline-flex items-center font-bold text-black underline underline-offset-4 hover:text-[#A855F7] transition text-sm">
            Learn More
          </Link>
        </div>
      </motion.div>

      {/* Right column — blob image grid */}
      <div className="relative">
        <div className="absolute -top-6 -right-4 lg:-right-8 z-10 hidden lg:block">
          <StampBadge />
        </div>

        <div className="grid grid-cols-2 gap-6 lg:gap-8">
          {contestants.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 + i * 0.12,
                duration: 0.55,
                ease: [0.34, 1.4, 0.64, 1],
              }}
              className="flex flex-col items-center gap-3">
              <div className="relative">
                <span className="absolute -top-2 -right-2 z-10 text-xl select-none pointer-events-none">
                  {stickers[i]}
                </span>
                <div
                  className="w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 overflow-hidden relative bg-gray-100"
                  style={{ borderRadius: blobStyles[i] }}>
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 144px, (max-width: 1024px) 160px, 176px"
                  />
                </div>
              </div>
              <div className="bg-white border-2 border-black rounded-sm px-4 py-1 font-bold text-xs text-black shadow-[3px_3px_0px_#111]">
                {imageLabels[i]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
