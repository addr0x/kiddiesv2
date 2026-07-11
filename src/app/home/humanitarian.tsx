import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import campPhoto from "../humanitarian/pictures/20230922_132003.jpg";

export default function Humanitarian() {
  return (
    <section
      className="full-bleed grid lg:grid-cols-2 bg-[#111]"
      id="humanitarian">
      {/* Left — image */}
      <div className="overflow-hidden relative min-h-72 lg:min-h-0 order-2 lg:order-1">
        <Image
          src={campPhoto}
          alt="IDP camp outreach visit"
          fill
          quality={75}
          priority
          placeholder="blur"
          className="object-cover hover:scale-105 transition duration-500 ease-in-out"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute bottom-5 left-5 bg-[#FB923C] border-2 border-black rounded-xl px-5 py-3 shadow-[4px_4px_0px_#111]">
          <p className="font-bold text-black text-sm leading-none">IDP</p>
          <p className="font-bold text-black text-3xl leading-tight">
            Outreach
          </p>
        </div>
      </div>

      {/* Right — content */}
      <div className="p-10 lg:p-16 space-y-7 flex flex-col justify-center order-1 lg:order-2">
        <span className="inline-flex items-center gap-2 bg-[#FB923C] text-white font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase">
          <Heart size={12} />
          Humanitarian Work
        </span>

        <h2 className="font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-tight">
          Bringing Hope to{" "}
          <span className="text-[#FB923C]">IDP Communities</span>
        </h2>

        <p className="text-gray-300 font-semibold leading-relaxed text-sm">
          Beyond the contest, we are committed to making a real difference. We
          visit IDP camps across Nigeria to provide food, clothing, school
          supplies, and essential support to children and families in need.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center space-y-1 border border-white/10">
            <p className="font-bold text-[#FACC14] text-2xl">500+</p>
            <p className="text-gray-400 text-xs font-semibold">
              Children Reached
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center space-y-1 border border-white/10">
            <p className="font-bold text-[#22C55E] text-2xl">5+</p>
            <p className="text-gray-400 text-xs font-semibold">
              IDP Camps Visited
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center space-y-1 border border-white/10">
            <p className="font-bold text-[#A855F7] text-2xl">200+</p>
            <p className="text-gray-400 text-xs font-semibold">
              Families Supported
            </p>
          </div>
        </div>

        <Link
          href="/humanitarian"
          className="inline-flex items-center gap-2 bg-[#FB923C] text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-[#FB923C] shadow-[3px_3px_0px_rgba(0,0,0,0.3)] w-fit hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
          See Our Impact
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
