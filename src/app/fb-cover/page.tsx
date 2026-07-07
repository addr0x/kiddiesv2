"use client";

import Image from "next/image";
import childrenImg from "@/src/app/home/images/children.jpg";

export default function FacebookCover() {
  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center py-12 px-4">
      <p className="fixed top-4 left-0 right-0 text-center text-gray-500 text-xs font-semibold tracking-widest uppercase pointer-events-none z-50">
        Screenshot &amp; upload to Facebook (Retina = 2× = 1120px+)
      </p>

      {/* Cover card */}
      <div
        className="relative bg-white overflow-hidden w-full"
        style={{
          maxWidth: 560,
          fontFamily: "var(--font-fredoka), sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "3px solid #111",
        }}
      >
        {/* ── YELLOW HEADER ── */}
        <div
          className="flex items-center justify-between px-6 py-3 border-b-2 border-black"
          style={{ background: "#FACC14" }}
        >
          <Image src="/logo.svg" alt="Logo" width={100} height={28} />
          <div className="rounded-full border-2 border-black bg-black px-4 py-1 font-black text-[#FACC14] text-[0.65rem] tracking-widest uppercase">
            Ages 0–8 Years
          </div>
        </div>

        {/* ── PHOTO + HOOK ── */}
        <div className="relative w-full" style={{ height: 260 }}>
          <Image
            src={childrenImg}
            alt="Kids"
            fill
            className="object-cover object-top"
            sizes="560px"
          />
          {/* gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 40%, transparent 100%)" }}
          />
          {/* Hook text */}
          <div className="absolute bottom-5 left-6 right-6">
            <p
              className="font-black text-white leading-tight"
              style={{ fontSize: "1.9rem", textShadow: "2px 2px 0 #111" }}
            >
              How much do you{" "}
              <span style={{ color: "#FACC14" }}>love</span> your child?
            </p>
            <p className="text-white/70 font-semibold text-[0.75rem] mt-1">
              Show the world how beautiful they are.
            </p>
          </div>
        </div>

        {/* ── PRIZE SECTION ── */}
        <div className="px-6 pt-5 pb-4 space-y-4">
          <div>
            <p className="font-bold text-gray-600 text-[0.82rem]">Your child was born for this. Stand a chance to win</p>
            <p
              className="font-black text-black leading-none"
              style={{ fontSize: "3.4rem", textShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}
            >
              ₦1,000,000
            </p>
            <p className="font-semibold text-gray-500 text-[0.78rem] mt-0.5">+ 3-year full scholarship</p>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <p className="font-bold text-gray-600 text-[0.8rem] mb-1">and be crowned</p>
            <div className="leading-[0.86]">
              <p
                className="font-black uppercase text-[#FACC14]"
                style={{ fontSize: "2.1rem", WebkitTextStroke: "2px #111", paintOrder: "stroke fill", textShadow: "4px 4px 0 #111" }}
              >
                THE FUTURE
              </p>
              <p
                className="font-black uppercase text-[#FACC14]"
                style={{ fontSize: "2.5rem", WebkitTextStroke: "2px #111", paintOrder: "stroke fill", textShadow: "4px 4px 0 #111" }}
              >
                STAR
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-px flex-1 bg-black/15" />
                <p className="text-[0.52rem] font-bold uppercase tracking-[0.22em] text-black/35">Challenge</p>
                <div className="h-px flex-1 bg-black/15" />
              </div>
            </div>
          </div>

          {/* Prize breakdown card */}
          <div
            className="rounded-2xl px-4 pt-3 pb-3.5 border-2 border-black"
            style={{ background: "#FACC14", boxShadow: "4px 4px 0 #111" }}
          >
            <p className="font-bold text-black/50 text-[0.55rem] tracking-wide mb-0.5">Winner</p>
            <div className="flex items-baseline gap-2 mb-2.5">
              <p className="font-black text-black leading-none text-[1.5rem]">₦1,000,000</p>
              <p className="font-black text-black/75 leading-none text-[0.85rem]">+ Scholarship</p>
            </div>
            <div className="grid grid-cols-2 gap-x-3 border-t border-black/20 pt-2">
              <div>
                <p className="font-bold text-black/50 text-[0.52rem] tracking-wide mb-0.5">1st Runner up</p>
                <p className="font-black text-black leading-none text-[1.2rem]">₦500,000</p>
              </div>
              <div>
                <p className="font-bold text-black/50 text-[0.52rem] tracking-wide mb-0.5">2nd Runner up</p>
                <p className="font-black text-black leading-none text-[1.2rem]">₦300,000</p>
              </div>
            </div>
          </div>

          {/* Register bar */}
          <div
            className="rounded-xl border-2 border-black px-5 py-3 flex items-center justify-between"
            style={{ background: "#111", boxShadow: "4px 4px 0 #FACC14" }}
          >
            <div>
              <p className="text-[#FACC14] font-black text-[0.55rem] tracking-[0.22em] uppercase">
                Secure Your Child&apos;s Spot At
              </p>
              <p className="text-white font-black text-[1.05rem] leading-tight">leadritehub.com</p>
            </div>
            <div className="rounded-full border-2 border-[#FACC14] px-4 py-1.5 font-black text-[#FACC14] text-[0.6rem] tracking-wide uppercase">
              FREE →
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          className="flex items-center justify-between px-6 py-2.5 border-t-2 border-black"
          style={{ background: "#FACC14" }}
        >
          <p className="font-black text-black text-[0.58rem] tracking-widest uppercase">
            The Future Star Challenge
          </p>
          <div className="flex gap-1.5">
            {["#111", "#A855F7", "#22C55E", "#FB923C"].map((c) => (
              <div
                key={c}
                className="w-3 h-3 rounded-full border-2 border-black"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
