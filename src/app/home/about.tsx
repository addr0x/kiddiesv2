import Image from "next/image";
import imageOfKids from "./images/children.jpg";
import Link from "next/link";

const prizes = [
  {
    rank: "🏆 Grand Winner",
    prize: "₦500,000 + 3-year Scholarship",
    className:
      "bg-[#FACC14] text-black border-2 border-black shadow-[3px_3px_0px_#111]",
  },
  {
    rank: "🥈 1st Runner Up",
    prize: "₦300,000",
    className:
      "bg-[#A855F7] text-white border-2 border-[#A855F7] shadow-[3px_3px_0px_#7E22CE]",
  },
  {
    rank: "🥉 2nd Runner Up",
    prize: "₦200,000",
    className:
      "bg-[#22C55E] text-white border-2 border-[#22C55E] shadow-[3px_3px_0px_#15803D]",
  },
];

export default function About() {
  return (
    <section className="full-bleed grid lg:grid-cols-2" id="about">
      {/* Left — dark panel */}
      <div className="bg-[#111] p-10 lg:p-16 space-y-7 flex flex-col justify-center">
        <span className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase">
          About the Contest
        </span>

        <h2 className="font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-tight">
          Celebrating <br />
          Nigeria&apos;s <span className="text-[#FACC14]">Future Stars</span>
        </h2>

        <p className="text-gray-300 font-semibold leading-relaxed max-w-[46ch] text-sm">
          The Future Star Challenge is Nigeria&apos;s most exciting
          children&apos;s talent competition for kids aged 0–8. We celebrate
          brilliance, confidence, and personality. Parents and children campaign
          together — register, get votes, and win life-changing prizes!
        </p>

        <div className="space-y-3">
          {prizes.map((p) => (
            <div
              key={p.rank}
              className={`${p.className} rounded-xl px-5 py-3 flex items-center justify-between`}>
              <span className="font-bold text-sm">{p.rank}</span>
              <span className="font-bold text-sm">{p.prize}</span>
            </div>
          ))}
        </div>

        <Link
          href="/register"
          target="_blank"
          className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black w-fit shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
          Register Your Child →
        </Link>
      </div>

      {/* Right — image */}
      <div className="overflow-hidden relative min-h-72 lg:min-h-0">
        <Image
          src={imageOfKids}
          alt="Happy kids at the contest"
          fill
          className="object-cover hover:scale-105 transition duration-500 ease-in-out"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute bottom-5 right-5 bg-[#FACC14] border-2 border-black rounded-xl px-5 py-3 shadow-[4px_4px_0px_#111]">
          <p className="font-bold text-black text-sm leading-none">For ages</p>
          <p className="font-bold text-black text-3xl leading-tight">0–8</p>
          <p className="font-bold text-black text-xs">Years Old</p>
        </div>
      </div>
    </section>
  );
}
