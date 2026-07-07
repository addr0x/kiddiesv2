"use client";

import Image from "next/image";
import childrenImg from "@/src/app/home/images/children.jpg";

/* Decorative ✕ cluster */
const XMark = ({
  color = "#FACC14",
  size = 22,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size * 1.6}
    height={size * 1.6}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden>
    <text x="0" y="14" fontSize="14" fontWeight="900" fill={color}>
      ✕
    </text>
    <text x="16" y="26" fontSize="14" fontWeight="900" fill={color}>
      ✕
    </text>
    <text x="8" y="38" fontSize="14" fontWeight="900" fill={color}>
      ✕
    </text>
  </svg>
);

/* Decorative ★ cluster */
const Stars = ({ color = "#FACC14" }: { color?: string }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
    <text x="0" y="18" fontSize="16" fontWeight="900" fill={color}>
      ★
    </text>
    <text x="20" y="32" fontSize="12" fontWeight="900" fill={color}>
      ★
    </text>
    <text x="6" y="44" fontSize="10" fontWeight="900" fill={color}>
      ★
    </text>
  </svg>
);

export default function CampaignPoster() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-12 px-4 overflow-auto">
      {/* ── POSTER ─────────────────────────────────────────────────── */}
      <div
        className="relative bg-white overflow-hidden w-full"
        style={{
          maxWidth: 560,
          fontFamily: "var(--font-fredoka), sans-serif",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}>
        {/* ── EMOTIONAL HOOK BANNER ── */}
        <div
          className="px-6 pt-3 pb-2 text-center"
          style={{ background: "#111" }}>
          <p
            className="font-black text-white leading-tight"
            style={{ fontSize: "1.15rem" }}>
            How much do you <span style={{ color: "#FACC14" }}>love</span> your child?
          </p>
          <p className="text-white/60 font-semibold text-[0.62rem] tracking-wide mt-0.5">
            Show the world how beautiful they are.
          </p>
        </div>

        {/* ── TOP BAR: logo + decorative ── */}
        <div className="flex items-center justify-between px-5 pt-2 pb-1">
          <Image src="/logo.svg" alt="Logo" width={76} height={20} />
          <div className="flex items-center gap-1 opacity-60">
            <XMark color="#FACC14" size={14} />
          </div>
        </div>

        {/* ── BODY: two-column ── */}
        <div className="grid grid-cols-[46%_54%] gap-0 px-4 pb-2 items-start">
          {/* LEFT — circular photo + age badge */}
          <div className="relative flex flex-col items-center gap-2 pt-1">
            <div
              className="relative overflow-hidden border-4 border-black"
              style={{
                width: 190,
                height: 215,
                borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
                boxShadow: "5px 5px 0px #111",
              }}>
              <Image src={childrenImg} alt="Kids" fill className="object-cover object-top" sizes="190px" />
            </div>

            {/* AGE badge */}
            <div
              className="flex flex-col items-center justify-center border-4 border-black bg-white font-black leading-tight"
              style={{ width: 96, height: 58, borderRadius: "50%", boxShadow: "3px 3px 0px #111" }}>
              <span className="text-[0.52rem] tracking-widest text-gray-500 uppercase font-bold">AGE:</span>
              <span className="text-[1.3rem] text-black leading-none">0–8</span>
            </div>

            <div className="absolute -bottom-1 -left-1 opacity-80">
              <Stars color="#22C55E" />
            </div>
          </div>

          {/* RIGHT — text content */}
          <div className="pt-1 pl-3 flex flex-col gap-1.5">
            <div className="flex justify-end mb-0.5">
              <XMark color="#A855F7" size={12} />
            </div>

            <p className="font-bold text-gray-700 text-[0.75rem] leading-snug">
              Your child was born for this.
            </p>

            {/* Prize amount */}
            <div>
              <p className="font-black leading-none text-black" style={{ fontSize: "2.6rem", textShadow: "3px 3px 0px rgba(0,0,0,0.12)" }}>
                ₦1,000,000
              </p>
              <p className="font-semibold text-gray-600 text-[0.68rem] leading-tight mt-0.5">
                + 3-year full scholarship
              </p>
              <div className="h-px bg-gray-200 my-1.5" />
              <p className="font-bold text-gray-700 text-[0.75rem]">and be crowned</p>
            </div>

            {/* Contest name */}
            <div className="leading-[0.85]">
              <p className="font-black uppercase text-[#FACC14]"
                style={{ fontSize: "1.85rem", WebkitTextStroke: "2px #111", paintOrder: "stroke fill", textShadow: "3px 3px 0px #111" }}>
                THE FUTURE
              </p>
              <p className="font-black uppercase text-[#FACC14]"
                style={{ fontSize: "2.1rem", WebkitTextStroke: "2px #111", paintOrder: "stroke fill", textShadow: "3px 3px 0px #111" }}>
                STAR
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-px flex-1 bg-black/20" />
                <p className="font-bold uppercase text-black/40 tracking-[0.2em] text-[0.5rem]">Challenge</p>
                <div className="h-px flex-1 bg-black/20" />
              </div>
            </div>

            {/* Prize breakdown card */}
            <div className="rounded-xl px-3 pt-2 pb-2.5 border-2 border-black"
              style={{ background: "#FACC14", boxShadow: "3px 3px 0px #111" }}>
              <p className="font-bold text-black/50 text-[0.5rem] tracking-wide mb-0.5">Winner</p>
              <div className="flex items-baseline gap-1.5 mb-2">
                <p className="font-black text-black leading-none text-[1.25rem]">₦1,000,000</p>
                <p className="font-black text-black/80 leading-none text-[0.7rem]">+ 3-year Scholarship</p>
              </div>
              <div className="grid grid-cols-2 gap-x-2 border-t border-black/20 pt-1.5">
                <div>
                  <p className="font-bold text-black/50 text-[0.48rem] tracking-wide mb-0.5">1st Runner up</p>
                  <p className="font-black text-black leading-none text-[1.05rem]">₦500,000</p>
                </div>
                <div>
                  <p className="font-bold text-black/50 text-[0.48rem] tracking-wide mb-0.5">2nd Runner up</p>
                  <p className="font-black text-black leading-none text-[1.05rem]">₦300,000</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 font-semibold text-[0.52rem]">**Registration closes soon</p>
          </div>
        </div>

        {/* ── REGISTER SECTION ── */}
        <div className="mx-4 mb-3">
          <div
            className="rounded-xl border-2 border-black px-4 py-2 flex items-center justify-between"
            style={{ background: "#111", boxShadow: "3px 3px 0px #FACC14" }}>
            <div>
              <p className="text-[#FACC14] font-black text-[0.52rem] tracking-[0.2em] uppercase">
                Secure Your Child&apos;s Spot At
              </p>
              <p className="text-white font-black text-[0.95rem] leading-tight">leadritehub.com</p>
            </div>
            <div className="rounded-full border-2 border-[#FACC14] px-3 py-1.5 font-black text-[#FACC14] text-[0.58rem] tracking-wide uppercase">
              FREE →
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t-2 border-black"
          style={{ background: "#FACC14" }}>
          <p className="font-black text-black text-[0.55rem] tracking-widest uppercase">
            The Future Star Challenge
          </p>
          <div className="flex gap-1.5">
            {["#111", "#A855F7", "#22C55E", "#FB923C"].map((c) => (
              <div
                key={c}
                className="w-2.5 h-2.5 rounded-full border-2 border-black"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Corner decoratives */}
        <div className="absolute top-12 right-3 opacity-50">
          <Stars color="#FB923C" />
        </div>
        <div className="absolute bottom-14 right-4 opacity-40">
          <XMark color="#A855F7" size={14} />
        </div>
      </div>

      <p className="fixed bottom-4 left-0 right-0 text-center text-gray-400 text-xs font-semibold tracking-widest uppercase pointer-events-none">
        Screenshot this poster to share on social media
      </p>
    </div>
  );
}
