"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Menus", href: "#menus" },
  { label: "Comment ca marche", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#222]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-baseline gap-1 cursor-pointer">
          <span className="text-[#C5FF00] font-heading text-sm font-bold">
            98
          </span>
          <span className="font-heading text-xl font-bold tracking-wider text-white">
            L&apos;APPART
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm tracking-widest uppercase text-white/70 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/33675008633"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C5FF00] text-[#0A0A0A] px-5 py-2 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
          >
            Devis gratuit
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white cursor-pointer"
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#222] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-lg tracking-widest uppercase text-white/80 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://wa.me/33675008633"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5FF00] text-[#0A0A0A] px-5 py-3 font-heading text-sm font-bold tracking-wider uppercase text-center hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer mt-2"
              >
                Devis gratuit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
