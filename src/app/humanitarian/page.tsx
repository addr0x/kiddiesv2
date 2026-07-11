import Image from "next/image";
import Link from "next/link";
import { Heart, HandHelping, Users, Video, Camera } from "lucide-react";

import pic1 from "./pictures/20230310_141551.jpg";
import pic2 from "./pictures/20230310_141823.jpg";
import pic3 from "./pictures/20230310_141849.jpg";
import pic4 from "./pictures/20230816_145923.jpg";
import pic5 from "./pictures/20230816_151127.jpg";
import pic6 from "./pictures/20230922_131607.jpg";
import pic7 from "./pictures/20230922_132003.jpg";
import pic8 from "./pictures/20230922_132129.jpg";
import pic9 from "./pictures/20230922_132148.jpg";

const stats = [
  { icon: Heart, value: "500+", label: "Children Reached" },
  { icon: HandHelping, value: "5+", label: "IDP Camps Visited" },
  { icon: Users, value: "200+", label: "Families Supported" },
];

const gallery = [
  { id: 1, label: "Distribution at IDP Camp", src: pic1 },
  { id: 2, label: "Playing with the Children", src: pic2 },
  { id: 3, label: "School Supplies Donation", src: pic3 },
  { id: 4, label: "Medical Outreach", src: pic4 },
  { id: 5, label: "Food Pack Distribution", src: pic5 },
  { id: 6, label: "Community Engagement", src: pic6 },
  { id: 7, label: "Outreach Team", src: pic7 },
  { id: 8, label: "Giving Back", src: pic8 },
  { id: 9, label: "Moments of Joy", src: pic9 },
];

const videos = [
  {
    id: 1,
    label: "Our Humanitarian Mission",
    href: "https://www.youtube.com/shorts/o1CACAFPmkw?feature=share",
  },
];

export default function HumanitarianPage() {
  return (
    <main className="fb-col-wrapper space-y-16 pt-28 pb-16">
      {/* Hero */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-2 bg-[#FB923C] text-white font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase mx-auto">
          <Heart size={12} />
          Our Humanitarian Work
        </span>
        <h1 className="font-bold text-black text-[clamp(2.2rem,5vw,3.6rem)] leading-tight">
          Bringing Hope to{" "}
          <span className="relative inline-block">
            <span className="relative z-10">IDP Camps</span>
            <span
              className="absolute inset-x-0 bottom-1 h-4 bg-[#FACC14] -z-0 -rotate-1 rounded"
              aria-hidden
            />
          </span>
        </h1>
        <p className="text-gray-600 font-semibold text-lg leading-relaxed max-w-2xl mx-auto">
          We visit Internally Displaced Persons (IDP) camps across Nigeria to
          provide material support — food, clothing, school supplies, and
          medical aid — to children and families in need. Every smile we see
          reminds us why we do this.
        </p>
        <div className="flex justify-center gap-4 flex-wrap pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
            Support Our Mission →
          </Link>
          <Link
            href="/#humanitarian"
            className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto w-full">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="bg-white border-2 border-black rounded-2xl p-6 text-center space-y-2 shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition duration-200">
            <Icon size={28} className="mx-auto text-[#FB923C]" />
            <p className="font-bold text-[clamp(1.8rem,3vw,2.4rem)] text-black leading-none">
              {value}
            </p>
            <p className="font-semibold text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </section>

      {/* Photo Gallery */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 bg-[#A855F7] text-white font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase mx-auto">
            <Camera size={12} />
            Photo Gallery
          </span>
          <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">
            Moments That{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Matter</span>
              <span
                className="absolute inset-x-0 bottom-1 h-3.5 bg-[#A855F7]/30 -z-0 -rotate-1 rounded"
                aria-hidden
              />
            </span>
          </h2>
          <p className="text-gray-500 font-semibold text-sm max-w-xl mx-auto">
            Glimpses from our visits to IDP camps — the laughter, the love, and
            the hope we share together.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="relative border-2 border-black rounded-2xl overflow-hidden group shadow-[3px_3px_0px_#111] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#111] transition duration-200">
              <div className="aspect-[4/3] relative">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  quality={75}
                  placeholder="blur"
                  className="object-cover group-hover:scale-105 transition duration-500 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                <p className="text-white font-bold text-xs">{photo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 bg-[#22C55E] text-white font-bold text-xs px-4 py-1.5 rounded-full w-fit tracking-wider uppercase mx-auto">
            <Video size={12} />
            Video Stories
          </span>
          <h2 className="font-bold text-black text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">
            Watch Our{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Impact</span>
              <span
                className="absolute inset-x-0 bottom-1 h-3.5 bg-[#22C55E]/30 -z-0 -rotate-1 rounded"
                aria-hidden
              />
            </span>
          </h2>
          <p className="text-gray-500 font-semibold text-sm max-w-xl mx-auto">
            Short videos capturing our humanitarian visits and the beautiful
            children we meet.
          </p>
        </div>
        <div className="flex justify-center">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative border-2 border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_#111] max-w-md w-full">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.youtube.com/embed/o1CACAFPmkw"
                  title="Our Humanitarian Mission"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="full-bleed bg-[#111] py-16 px-6 lg:px-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Heart size={40} className="mx-auto text-[#FACC14]" />
          <h2 className="font-bold text-white text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">
            Want to Make a{" "}
            <span className="text-[#FACC14]">Difference</span>?
          </h2>
          <p className="text-gray-300 font-semibold text-sm max-w-lg mx-auto leading-relaxed">
            Your support helps us reach more IDP camps and provide essential
            supplies to children who need it most. Partner with us to bring
            smiles to more faces.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#FACC14] text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
              Donate / Support
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-3 rounded-full border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
              Volunteer With Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
