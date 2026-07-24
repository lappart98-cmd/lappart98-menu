"use client";

export default function Marquee() {
  const items = [
    "DTF",
    "BRODERIE",
    "STICKERS UV",
    "T-SHIRTS",
    "HOODIES",
    "MAILLOTS",
    "CASQUETTES",
    "TOTE BAGS",
    "SANS MINIMUM",
    "DEVIS GRATUIT",
  ];

  const repeated = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden bg-[#C5FF00] py-3">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-heading text-sm font-bold text-[#0A0A0A] uppercase tracking-wider mx-6 shrink-0"
          >
            {item}
            <span className="mx-6 text-[#0A0A0A]/30">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
