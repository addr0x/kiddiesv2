import Link from "next/link";
import Image from "next/image";
import { Button } from "@ui/button";
import {
  Mail,
  MapPinHouse,
  Phone,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import BackToTop from "./back-to-top";

const quickLinks = [
  { name: "Home", link: "/" },
  { name: "About", link: "/#about" },
  { name: "All Contestants", link: "/contestants" },
  { name: "Leader Board", link: "/leaderboard" },
  { name: "Register", link: "/register" },
  { name: "Humanitarian", link: "/humanitarian" },
  { name: "Privacy Policy", link: "/privacy-policy" },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/leadritehub/",
    label: "Instagram",
  },
  {
    icon: Facebook,
    href: "https://web.facebook.com/leadritehub",
    label: "Facebook",
  },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="full-bleed mt-32" id="contact">
      {/* CTA Banner */}
      <div className="flex justify-between flex-col lg:flex-row items-start lg:items-center bg-[#FACC14] border-b-2 border-black px-8 py-8 lg:px-20 lg:py-10 gap-6">
        <div className="font-bold space-y-1">
          <div className="inline-flex items-center gap-2 bg-black text-[#FACC14] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
            <span>Join the Fun</span>
          </div>
          <h2 className="text-black text-[clamp(1.6rem,4vw,2.4rem)] leading-tight">
            Ready to Enroll?
          </h2>
          <p className="text-black/70 font-semibold">
            Take the opportunity now!
          </p>
        </div>
        <Button
          asChild
          className="h-12 px-8 font-bold bg-black hover:bg-gray-900 text-[#FACC14] max-w-fit rounded-full border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
          size="lg">
          <Link href="/register" target="_blank">
            REGISTER NOW
          </Link>
        </Button>
      </div>

      {/* Main Footer Body */}
      <div className="footer px-6 py-10 grid gap-10 lg:grid-cols-3 lg:px-20">
        {/* Brand column */}
        <div className="space-y-4">
          <Image
            src="/logo.svg"
            alt="The Future Star Contest logo"
            width={100}
            height={30}
            className="invert opacity-70"
          />
          <p className="text-[#ababab] text-sm max-w-[30ch]">
            Celebrating the cutest and most talented kids in Nigeria. Crown your
            child&apos;s shine! 👑
          </p>
          {/* Social links */}
          <div className="flex gap-4 pt-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#ababab] hover:bg-sky-500 hover:text-white transition">
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links column */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl">Quick Links</h3>
          <ul className="space-y-2 grid grid-cols-2">
            {quickLinks.map((quickLink) => (
              <li key={quickLink.name}>
                <Link
                  href={quickLink.link}
                  className="text-[#ababab] hover:text-white transition ease-in-out duration-300 text-sm">
                  {quickLink.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info column */}
        <div className="space-y-4 text-[#ababab]">
          <h3 className="font-bold text-xl">Contact Info</h3>
          <div className="flex gap-3">
            <MapPinHouse size={40} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              Irama complex, plot 4, sa&apos;adu zungur avenue, off wole soyinka
              avenue, 4th avenue, Gwarinpa Abuja.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Phone size={16} className="shrink-0" />
            <p className="text-sm">+234 80 5903 3275 </p>
          </div>
          <div className="flex gap-3 items-center">
            <Mail size={16} className="shrink-0" />
            <p className="text-sm">leadritehub@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer border-t border-white/10 px-6 py-4 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-[#ababab]">
          © {new Date().getFullYear()} The Future Star Contest. All rights
          reserved.
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
