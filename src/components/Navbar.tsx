"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Mail } from "lucide-react";

const links = [
  { label: "Menus", href: "#menus" },
  { label: "Catalogue", href: "#catalogue" },
  { label: "Comment ca marche", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [devisOpen, setDevisOpen] = useState(false);

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
        <a href="#" className="cursor-pointer block">
          <img
            src="/logo-lappart98.png"
            alt="L'Appart 98"
            className="h-8 w-auto invert"
          />
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
          <div className="relative">
            <button
              onClick={() => setDevisOpen(!devisOpen)}
              onBlur={() => setTimeout(() => setDevisOpen(false), 200)}
              className="bg-[#C5FF00] text-[#0A0A0A] px-5 py-2 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
            >
              Devis gratuit
            </button>
            {devisOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[#141414] border border-[#333] rounded-lg overflow-hidden shadow-xl min-w-[180px] z-50">
                <a
                  href="https://wa.me/33675008633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#25D366] hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                  <span className="font-heading text-sm uppercase tracking-wider">WhatsApp</span>
                </a>
                <a
                  href="mailto:contact@lappart98.fr?subject=Demande%20de%20devis&body=Salut%20!%20Je%20voudrais%20un%20devis%20pour%20du%20textile%20personnalis%C3%A9.%0AMerci%20!"
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#C5FF00] hover:text-[#0A0A0A] transition-colors duration-200 cursor-pointer"
                >
                  <Mail className="w-4 h-4" strokeWidth={2} />
                  <span className="font-heading text-sm uppercase tracking-wider">Email</span>
                </a>
              </div>
            )}
          </div>
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
              <div className="flex gap-3 mt-2">
                <a
                  href="https://wa.me/33675008633"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#1da851] transition-colors duration-200 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                  WhatsApp
                </a>
                <a
                  href="mailto:contact@lappart98.fr?subject=Demande%20de%20devis&body=Salut%20!%20Je%20voudrais%20un%20devis%20pour%20du%20textile%20personnalis%C3%A9.%0AMerci%20!"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C5FF00] text-[#0A0A0A] px-4 py-3 font-heading text-sm font-bold tracking-wider uppercase hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
                >
                  <Mail className="w-4 h-4" strokeWidth={2} />
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
