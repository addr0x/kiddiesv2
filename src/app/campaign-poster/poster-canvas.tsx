"use client";

import Image from "next/image";

export type PosterData = {
  contestantId: string;
  firstName: string;
  lastName: string;
  age: string;
  ageUnit: string;
  pic: string | null;
  gender: "male" | "female";
  profileUrl: string;
};

const Star = ({
  color = "#FACC14",
  size = 14,
}: {
  color?: string;
  size?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} aria-hidden>
    <polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,11.5 3.5,15 5,9.5 1,6 6,6" />
  </svg>
);

const toRad = (d: number) => (d * Math.PI) / 180;
const r4 = (n: number) => Math.round(n * 10000) / 10000;
const SUNBURST_PATHS = Array.from({ length: 20 }, (_, i) => {
  const cx = 180,
    cy = 180,
    r = 175,
    halfSpread = 5;
  const angle = (i * 360) / 20;
  const x1 = r4(cx + r * Math.cos(toRad(angle - halfSpread)));
  const y1 = r4(cy + r * Math.sin(toRad(angle - halfSpread)));
  const x2 = r4(cx + r * Math.cos(toRad(angle + halfSpread)));
  const y2 = r4(cy + r * Math.sin(toRad(angle + halfSpread)));
  return `M 180 180 L ${x1} ${y1} L ${x2} ${y2} Z`;
});

const Sunburst = () => (
  <svg
    width="360"
    height="360"
    viewBox="0 0 360 360"
    aria-hidden
    className="absolute pointer-events-none"
    style={{ top: -56, left: "50%", transform: "translateX(-50%)", zIndex: 0 }}>
    {SUNBURST_PATHS.map((d, i) => (
      <path key={i} d={d} fill="#FACC14" opacity="0.18" />
    ))}
  </svg>
);

const CONFETTI = [
  { x: "7%", y: "6%", color: "#FACC14", size: 10, rotate: 15 },
  { x: "82%", y: "4%", color: "#A855F7", size: 8, rotate: -20 },
  { x: "5%", y: "38%", color: "#22C55E", size: 7, rotate: 30 },
  { x: "88%", y: "32%", color: "#FB923C", size: 9, rotate: -10 },
  { x: "14%", y: "68%", color: "#A855F7", size: 6, rotate: 45 },
  { x: "80%", y: "65%", color: "#22C55E", size: 8, rotate: -35 },
  { x: "45%", y: "3%", color: "#FB923C", size: 6, rotate: 20 },
  { x: "55%", y: "78%", color: "#FACC14", size: 7, rotate: -25 },
  { x: "25%", y: "15%", color: "#A855F7", size: 5, rotate: 0 },
  { x: "70%", y: "18%", color: "#22C55E", size: 5, rotate: 55 },
];

export default function PosterCanvas({ data }: { data: PosterData }) {
  const name = `${data.firstName} ${data.lastName}`;

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center py-12 px-4 gap-4">
      <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase text-center">
        Preview — screenshot to share on WhatsApp / Instagram
      </p>

      {/* ── POSTER — 480×480 square ── */}
      <div
        id="poster"
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 480,
          height: 480,
          fontFamily: "var(--font-fredoka), sans-serif",
          border: "3px solid #111",
          boxShadow: "8px 8px 0px #111",
          background: "#FFFDF0",
          flexShrink: 0,
        }}>
        {/* Background confetti dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle, #FACC14 1.5px, transparent 1.5px),
              radial-gradient(circle, #A855F7 1.5px, transparent 1.5px),
              radial-gradient(circle, #22C55E 1.5px, transparent 1.5px),
              radial-gradient(circle, #FB923C 1.5px, transparent 1.5px)
            `,
            backgroundSize: "48px 48px, 48px 48px, 48px 48px, 48px 48px",
            backgroundPosition: "0 0, 12px 12px, 24px 24px, 36px 36px",
            opacity: 0.18,
          }}
        />

        {/* Corner large faint stars */}
        <div
          className="absolute -top-2 -left-2 pointer-events-none"
          style={{ opacity: 0.12 }}>
          <Star color="#FACC14" size={64} />
        </div>
        <div
          className="absolute -top-2 -right-2 pointer-events-none"
          style={{ opacity: 0.12, transform: "rotate(20deg)" }}>
          <Star color="#A855F7" size={56} />
        </div>
        <div
          className="absolute bottom-[76px] -left-3 pointer-events-none"
          style={{ opacity: 0.1, transform: "rotate(-15deg)" }}>
          <Star color="#22C55E" size={52} />
        </div>
        <div
          className="absolute bottom-[72px] -right-3 pointer-events-none"
          style={{ opacity: 0.1, transform: "rotate(10deg)" }}>
          <Star color="#FB923C" size={48} />
        </div>

        {/* ── TOP BAR ── */}
        <div
          className="flex items-center justify-between px-4 border-b-2 border-black shrink-0 z-10"
          style={{ height: 58, background: "#FACC14" }}>
          <Image src="/logo.svg" alt="Logo" width={72} height={18} />
          <div className="flex items-center gap-1">
            <Star color="#111" size={9} />
            <span className="font-black text-black text-[0.48rem] tracking-widest uppercase">
              The Future Star Contest
            </span>
            <Star color="#111" size={9} />
          </div>
        </div>

        {/* ── STAGE RIBBON ── */}
        <div
          className="relative shrink-0 z-20 overflow-hidden"
          style={{ height: 36, background: "#111" }}>
          <div className="flex items-center justify-center h-full gap-3">
            <Star color="#FACC14" size={11} />
            <span
              className="font-black text-white tracking-[0.25em] uppercase"
              style={{ fontSize: "0.75rem", letterSpacing: "0.3em" }}>
              Stage Two
            </span>
            <Star color="#FACC14" size={11} />
          </div>
        </div>

        {/* ── MAIN BODY ── */}
        <div className="relative flex flex-col items-center flex-1 overflow-hidden">
          {/* Sunburst behind photo */}
          <Sunburst />

          {/* Scattered confetti pieces */}
          {CONFETTI.map(({ x, y, color, size, rotate }, i) => (
            <div
              key={i}
              className="absolute pointer-events-none rounded-sm"
              style={{
                left: x,
                top: y,
                width: size,
                height: size * 0.55,
                background: color,
                opacity: 0.75,
                transform: `rotate(${rotate}deg)`,
                border: "1.5px solid rgba(0,0,0,0.15)",
              }}
            />
          ))}

          {/* Small accent stars scattered */}
          <div className="absolute top-5 left-[20%] opacity-60 pointer-events-none">
            <Star color="#FACC14" size={12} />
          </div>
          <div className="absolute top-9 right-[18%] opacity-50 pointer-events-none">
            <Star color="#A855F7" size={10} />
          </div>
          <div className="absolute bottom-[96px] left-[16%] opacity-50 pointer-events-none">
            <Star color="#22C55E" size={11} />
          </div>
          <div className="absolute bottom-[92px] right-[14%] opacity-50 pointer-events-none">
            <Star color="#FB923C" size={10} />
          </div>

          {/* ── CIRCULAR PHOTO ── */}
          <div
            className="relative mt-3 shrink-0 z-10"
            style={{ width: 160, height: 160 }}>
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: "0 0 0 6px #FACC14, 0 0 0 9px #111" }}
            />
            {/* Photo circle */}
            <div
              className="relative w-full h-full rounded-full overflow-hidden border-4 border-black"
              style={{ boxShadow: "4px 4px 0 #FACC14" }}>
              <Image
                src={
                  data.pic
                    ? `/poster-pics/${data.pic}`
                    : `/avatar-${data.gender}.jpg`
                }
                alt={name}
                fill
                className="object-cover object-top"
                style={data.pic ? {} : { opacity: 0.55 }}
                sizes="160px"
                unoptimized
              />
            </div>

            {/* Age badge — bottom-right of circle */}
            <div
              className="absolute -bottom-2 -right-2 flex flex-col items-center justify-center border-2 border-black font-black leading-none"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#FACC14",
                boxShadow: "2px 2px 0 #111",
              }}>
              <span className="text-[0.36rem] tracking-widest text-black/50 uppercase font-bold">
                AGE
              </span>
              <div className="flex items-baseline justify-center gap-[2px] leading-none w-full px-1">
                <span className="text-[1.1rem] text-black leading-none">
                  {data.age}
                </span>
                <span className="text-[0.44rem] tracking-wide text-black/50 uppercase font-bold">
                  {data.ageUnit}
                </span>
              </div>
            </div>

            {/* Contestant number badge — bottom-left of circle */}
            <div
              className="absolute -bottom-2 -left-2 flex flex-col items-center justify-center border-2 border-black font-black leading-none bg-white"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                boxShadow: "2px 2px 0 #111",
              }}>
              <span className="text-[0.5rem] tracking-widest text-gray-400 uppercase font-bold">
                ID
              </span>
              <span className="text-[1.1rem] text-black leading-none">
                {data.contestantId}
              </span>
            </div>
          </div>

          {/* ── NAME ── */}
          <div className="flex flex-col items-center mt-2 leading-none z-10">
            <p
              className="font-black text-black uppercase"
              style={{
                fontSize: "2.1rem",
                textShadow: "2px 2px 0 rgba(0,0,0,0.12)",
                letterSpacing: "-0.01em",
              }}>
              {data.firstName}
            </p>
            <p
              className="font-black uppercase leading-none"
              style={{
                fontSize: "1.75rem",
                color: "#FACC14",
                WebkitTextStroke: "1.5px #111",
                paintOrder: "stroke fill",
                letterSpacing: "-0.01em",
              }}>
              {data.lastName}
            </p>
          </div>

          {/* Vote for me label */}
          <div className="flex items-center gap-1.5 mt-2 z-10">
            <Star color="#FACC14" size={10} />
            <p className="font-black text-black/50 text-[0.55rem] tracking-[0.2em] uppercase">
              Vote for me!
            </p>
            <Star color="#FACC14" size={10} />
          </div>

          {/* Voter incentive */}
          <p className="font-bold text-black/40 text-[0.48rem] tracking-wide text-center mt-1 z-10 italic">
            Back a future star — vote now!
          </p>
        </div>

        {/* ── BOTTOM PANEL ── */}
        <div
          className="shrink-0 border-t-2 border-black z-10"
          style={{ background: "#FACC14" }}>
          {/* CTA row */}
          <div className="flex items-center justify-between px-4 py-2.5 gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-black text-black/50 text-[0.44rem] tracking-[0.18em] uppercase mb-0.5">
                Cast your vote at
              </p>
              <p className="font-black text-black text-[0.82rem] leading-tight truncate">
                {data.profileUrl}
              </p>
            </div>

            {/* Prize pills */}
            <div className="flex items-center gap-1 shrink-0">
              {[
                { label: "1st", amount: "₦1m", scholar: true },
                { label: "2nd", amount: "₦500k" },
                { label: "3rd", amount: "₦300k" },
              ].map(({ label, amount, scholar }) => (
                <div
                  key={label}
                  className="flex flex-col items-center border-2 border-black rounded-lg px-2.5 py-1.5 bg-white"
                  style={{ boxShadow: "2px 2px 0 #111", minWidth: 57 }}>
                  <span className="font-bold text-black/40 text-[0.5rem] uppercase tracking-wide">
                    {label}
                  </span>
                  <span className="font-black text-black text-[0.94rem] leading-none">
                    {amount}
                  </span>
                  <span
                    className="font-bold text-[0.46rem] leading-tight mt-0.5"
                    style={{
                      color: scholar ? "rgba(0,0,0,0.5)" : "transparent",
                    }}>
                    + 3-year scholar
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between px-4 pb-2">
            <p className="font-black text-black/50 text-[0.44rem] tracking-widest uppercase">
              The Future Star Contest
            </p>
            <div className="flex gap-1">
              {["#111", "#A855F7", "#22C55E", "#FB923C"].map((c) => (
                <div
                  key={c}
                  className="w-2 h-2 rounded-full border border-black/30"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-[0.62rem] font-semibold tracking-widest uppercase text-center max-w-xs">
        Dynamic version will auto-populate each contestant&apos;s photo, name,
        age &amp; link
      </p>
    </div>
  );
}
