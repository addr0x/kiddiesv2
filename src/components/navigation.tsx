"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Contestants", href: "/contestants" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Humanitarian", href: "/humanitarian" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white border-b-2 border-black z-50">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <Image
          className="w-20 md:w-24"
          src="/logo.svg"
          alt="The Future Star Contest logo"
          width={96}
          height={20}
          priority
        />

        <div className="space-x-7 hidden md:flex items-center">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-black text-sm font-bold hover:text-[#A855F7] transition">
              {link.name}
            </Link>
          ))}
          <Link
            href="/register"
            className="bg-[#FACC14] text-black font-bold text-sm px-5 py-2.5 rounded-full border-2 border-black shadow-[3px_3px_0px_#111] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition">
            REGISTER
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden p-2 border-2 border-black rounded text-black hover:bg-black hover:text-white transition">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t-2 border-black">
            <div className="px-5 py-5 flex flex-col gap-5">
              {navigationLinks.map((link) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={link.name}
                  href={link.href}
                  className="text-black text-sm font-bold hover:text-[#A855F7] transition">
                  {link.name}
                </Link>
              ))}
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="bg-[#FACC14] text-black font-bold text-sm px-5 py-3 rounded-full border-2 border-black text-center shadow-[3px_3px_0px_#111]">
                REGISTER
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
