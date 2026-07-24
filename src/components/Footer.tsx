"use client";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#222] py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-[#C5FF00] font-heading text-sm font-bold">
            98
          </span>
          <span className="font-heading text-base font-bold tracking-wider text-white">
            L&apos;APPART
          </span>
          <span className="font-body text-xs text-white/30 ml-2">
            atelier Paris
          </span>
        </div>

        <p className="font-body text-xs text-white/30 text-center">
          &copy; {new Date().getFullYear()} L&apos;Appart 98 — Atelier textile,
          Gentilly (94)
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/lappart_98"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-white/40 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
          >
            Instagram
          </a>
          <a
            href="https://wa.me/33675008633"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-white/40 hover:text-[#C5FF00] transition-colors duration-200 cursor-pointer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
