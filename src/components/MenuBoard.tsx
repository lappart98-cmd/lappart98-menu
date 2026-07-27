"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useMemo } from "react";
import {
  Star,
  Users,
  Trophy,
  X,
  ChevronRight,
  Check,
  Plus,
  Minus,
  ArrowUp,
  MessageCircle,
  Mail,
} from "lucide-react";

interface MenuItem {
  name: string;
  quantity: string;
  min: number;
  max: number | null;
  price: number;
  tier: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  popular?: boolean;
  special?: boolean;
}

interface TextileOption {
  id: string;
  name: string;
  image: string;
  darkProduct?: boolean;
  flocageFlat?: number;
}

interface CartItem {
  textileId: string;
  qty: number;
}

const textiles: TextileOption[] = [
  { id: "tshirt-basique", name: "T-Shirt Basique 190g", image: "/tshirt-190g.png" },
  { id: "tshirt-oversize", name: "T-Shirt Oversize 220g", image: "/tshirt-noir.png" },
  { id: "sweat", name: "Sweat Col Rond 280g", image: "/sweat-noir.png" },
  { id: "hoodie-classic", name: "Hoodie Classic 260g", image: "/hoodie-kaki.png" },
  { id: "totebag", name: "Tote Bag", image: "/totebag.png", flocageFlat: 5 },
  { id: "casquette", name: "Casquette Snapback", image: "/casquette-noire.png", flocageFlat: 5 },
  { id: "polo", name: "Polo 210g", image: "/polo-noir.png" },
];

const productPricing: Record<string, Record<string, number>> = {
  "tshirt-basique":  { solo: 9, team: 7, bestof: 6, xxl: 4, club: 14 },
  "tshirt-oversize": { solo: 15, team: 13, bestof: 11, xxl: 9, club: 18 },
  "sweat":           { solo: 23, team: 19, bestof: 17, xxl: 14, club: 22 },
  "hoodie-classic":  { solo: 17, team: 14, bestof: 12, xxl: 10, club: 18 },
  "casquette":       { solo: 8, team: 6, bestof: 5, xxl: 4, club: 10 },
  "totebag":         { solo: 5, team: 4, bestof: 3, xxl: 2, club: 5 },
  "polo":            { solo: 11, team: 9, bestof: 8, xxl: 6, club: 16 },
};

const flocageOptions = [
  { id: "dos", name: "Dos", price: 5 },
  { id: "coeur", name: "Coeur", price: 3 },
];

const techniques = [
  {
    id: "dtf",
    name: "DTF",
    desc: "Impression haute qualite, couleurs vives, tous textiles",
    tag: "Recommande",
  },
  {
    id: "uv",
    name: "Stickers UV",
    desc: "Vitrophanie, stickers, surfaces rigides",
    tag: "Sur demande",
  },
  {
    id: "broderie",
    name: "Broderie",
    desc: "Rendu premium, ideal logos & casquettes",
    tag: "Sur demande",
  },
];

const menus: MenuItem[] = [
  {
    name: "LE P'TIT SOLO",
    quantity: "1 A 4",
    min: 1,
    max: 4,
    price: 14,
    tier: "solo",
    description: "Ta piece perso, flocage + textile au choix",
    icon: Star,
  },
  {
    name: "LE MENU TEAM",
    quantity: "5 A 14",
    min: 5,
    max: 14,
    price: 12,
    tier: "team",
    description: "Parfait equipes, assos & familles",
    icon: Users,
  },
  {
    name: "LE MAXI BEST-OF",
    quantity: "15 A 40",
    min: 15,
    max: 40,
    price: 11,
    tier: "bestof",
    description: "Le plus commande — rapport qualite/prix",
    icon: Trophy,
    popular: true,
  },
];

function getMenuForQuantity(totalQty: number): MenuItem {
  for (let i = menus.length - 1; i >= 0; i--) {
    if (totalQty >= menus[i].min) return menus[i];
  }
  return menus[0];
}

function PriceBurst({
  price,
  inverted,
}: {
  price: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 w-14 h-14 sm:w-18 sm:h-18 rounded-full border-[3px] shadow-[0_0_20px_rgba(197,255,0,0.3)] ${
        inverted
          ? "bg-[#0A0A0A] border-[#0A0A0A]"
          : "bg-[#C5FF00] border-[#C5FF00]"
      }`}
    >
      <div className="flex flex-col items-center">
        <span
          className={`font-heading text-[10px] sm:text-xs font-bold uppercase ${
            inverted ? "text-[#C5FF00]" : "text-[#0A0A0A]"
          }`}
        >
          Des
        </span>
        <span
          className={`font-heading font-black leading-none text-2xl sm:text-3xl ${
            inverted ? "text-[#C5FF00]" : "text-[#0A0A0A]"
          }`}
        >
          {price}
        </span>
        <span
          className={`font-heading text-[9px] sm:text-xs font-bold ${
            inverted ? "text-[#C5FF00]" : "text-[#0A0A0A]"
          }`}
        >
          &euro;/piece*
        </span>
      </div>
    </div>
  );
}

function QtySelector({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(Math.max(0, qty - 1));
        }}
        className="w-8 h-8 rounded-lg bg-[#0A0A0A]/10 hover:bg-[#0A0A0A]/20 flex items-center justify-center text-[#0A0A0A]/50 hover:text-[#0A0A0A] cursor-pointer transition-colors duration-150"
        aria-label="Reduire"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-8 text-center font-heading text-sm font-bold text-[#0A0A0A]">
        {qty}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(qty + 1);
        }}
        className="w-8 h-8 rounded-lg bg-[#0A0A0A]/15 hover:bg-[#0A0A0A]/25 flex items-center justify-center text-[#0A0A0A] cursor-pointer transition-colors duration-150"
        aria-label="Ajouter"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function Configurator({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTechnique, setSelectedTechnique] = useState("dtf");
  const [selectedFlocage, setSelectedFlocage] = useState({
    dos: false,
    coeur: false,
    logoSup: 0,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const updateQty = (textileId: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.textileId === textileId);
      if (qty <= 0) return prev.filter((c) => c.textileId !== textileId);
      if (existing)
        return prev.map((c) =>
          c.textileId === textileId ? { ...c, qty } : c
        );
      return [...prev, { textileId, qty }];
    });
  };

  const getQty = (textileId: string) =>
    cart.find((c) => c.textileId === textileId)?.qty || 0;

  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);

  const activeMenu = useMemo(() => {
    if (item.special) return item;
    const calculated = getMenuForQuantity(totalQty);
    return calculated.price < item.price ? calculated : item;
  }, [totalQty, item]);

  const upgraded = activeMenu.name !== item.name && !item.special;
  const tierKey = activeMenu.tier;

  const textileTotal = useMemo(() => {
    return cart.reduce((sum, c) => {
      const unitPrice = productPricing[c.textileId]?.[tierKey] ?? 0;
      return sum + c.qty * unitPrice;
    }, 0);
  }, [cart, tierKey]);

  const standardQty = item.special
    ? 0
    : cart
        .filter((c) => {
          const t = textiles.find((tx) => tx.id === c.textileId);
          return c.qty > 0 && !t?.flocageFlat;
        })
        .reduce((sum, c) => sum + c.qty, 0);

  const flatFlocageItems = item.special
    ? []
    : cart
        .filter((c) => {
          const t = textiles.find((tx) => tx.id === c.textileId);
          return c.qty > 0 && t?.flocageFlat;
        })
        .map((c) => {
          const t = textiles.find((tx) => tx.id === c.textileId)!;
          return { ...c, name: t.name, flocageFlat: t.flocageFlat! };
        });

  const standardFlocagePerPiece =
    (selectedFlocage.dos ? 5 : 0) +
    (selectedFlocage.coeur ? 3 : 0) +
    selectedFlocage.logoSup * 2;

  const standardFlocageTotal = standardQty * standardFlocagePerPiece;
  const flatFlocageTotal = flatFlocageItems.reduce(
    (sum, c) => sum + c.qty * c.flocageFlat,
    0
  );
  const flocageTotal = standardFlocageTotal + flatFlocageTotal;
  const totalEstimate = textileTotal + flocageTotal;

  const cartLines = cart
    .filter((c) => c.qty > 0)
    .map((c) => {
      const t = textiles.find((tx) => tx.id === c.textileId);
      const unitPrice = productPricing[c.textileId]?.[tierKey] ?? 0;
      return `- ${c.qty}x ${t?.name} (${unitPrice}€/pc)`;
    })
    .join("\n");

  const flocageParts: string[] = [];
  if (item.special) {
    flocageParts.push("Nom + numero + logo (inclus)");
  } else {
    if (selectedFlocage.dos) flocageParts.push("Dos (5€/pc)");
    if (selectedFlocage.coeur) flocageParts.push("Coeur (3€/pc)");
    if (selectedFlocage.logoSup > 0)
      flocageParts.push(
        `${selectedFlocage.logoSup} logo(s) sup. (2€/pc/logo)`
      );
    flatFlocageItems.forEach((fi) =>
      flocageParts.push(`${fi.name} (${fi.flocageFlat}€/pc)`)
    );
  }
  const flocageDesc =
    flocageParts.length > 0 ? flocageParts.join(", ") : "Aucun";

  const devisBody = `Salut ! Je voudrais un devis pour le ${activeMenu.name}.\n\nArticles :\n${cartLines || "A definir"}\n\nFlocage : ${flocageDesc}\nTechnique : ${techniques.find((t) => t.id === selectedTechnique)?.name || "DTF"}\nTotal pieces : ${totalQty}\nEstimation : ~${totalEstimate}€ HT\n\nMerci !`;
  const whatsappMsg = encodeURIComponent(devisBody);
  const emailSubject = encodeURIComponent(`Demande de devis - ${activeMenu.name}`);
  const emailBody = encodeURIComponent(devisBody);
  const mailtoUrl = `mailto:contact@lappart98.fr?subject=${emailSubject}&body=${emailBody}`;

  const steps = [
    { title: "LE TEXTILE", subtitle: "Choisis ton support" },
    { title: "PERSONNALISATION", subtitle: "Flocage & technique" },
    { title: "RECAPITULATIF", subtitle: "Estimation & envoi" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#111] border border-[#333] w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl"
      >
        <div
          className={`sticky top-0 z-10 p-5 sm:p-6 border-b border-[#222] ${
            item.special ? "bg-[#C5FF00]" : "bg-[#141414]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`font-heading text-xl sm:text-2xl font-black uppercase ${
                  item.special ? "text-[#0A0A0A]" : "text-white"
                }`}
              >
                {upgraded ? activeMenu.name : item.name}
              </h3>
              <p
                className={`font-body text-sm mt-0.5 ${
                  item.special ? "text-[#0A0A0A]/60" : "text-white/50"
                }`}
              >
                {totalQty > 0
                  ? `${totalQty} pieces · ~${totalEstimate}€`
                  : `${item.quantity} pieces`}
              </p>
            </div>
            <button
              onClick={onClose}
              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 ${
                item.special
                  ? "bg-[#0A0A0A]/10 hover:bg-[#0A0A0A]/20 text-[#0A0A0A]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {upgraded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-lg ${
                item.special ? "bg-[#0A0A0A]/10" : "bg-[#C5FF00]/10"
              }`}
            >
              <ArrowUp className="w-4 h-4 text-[#C5FF00]" />
              <span className="font-body text-xs text-[#C5FF00]">
                Tu es passe au {activeMenu.name} &mdash; tarif reduit !
              </span>
            </motion.div>
          )}

          <div className="flex gap-2 mt-4">
            {steps.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setStep(i)}
                className={`flex-1 py-2 text-center font-heading text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-200 ${
                  step === i
                    ? item.special
                      ? "bg-[#0A0A0A] text-[#C5FF00]"
                      : "bg-[#C5FF00] text-[#0A0A0A]"
                    : item.special
                      ? "bg-[#0A0A0A]/10 text-[#0A0A0A]/60"
                      : "bg-white/5 text-white/40"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <p className="font-body text-sm text-white/50 mb-5">
                  Ajoute les textiles et choisis la quantite pour chacun.
                </p>
                <div className="flex flex-col gap-3">
                  {textiles.map((textile) => {
                    const qty = getQty(textile.id);
                    const isActive = qty > 0;
                    const unitPrice =
                      productPricing[textile.id]?.[tierKey] ?? 0;
                    return (
                      <motion.div
                        key={textile.id}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-[#d4d4d4] ring-2 ring-[#C5FF00]"
                            : "bg-[#e8e8e8]"
                        }`}
                      >
                        <img src={textile.image} alt={textile.name} className="w-20 h-20 shrink-0 object-contain transition-transform duration-300 hover:scale-[1.6]" />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-heading text-sm font-bold uppercase tracking-wider block ${
                              isActive ? "text-[#0A0A0A]" : "text-[#1a1a1a]"
                            }`}
                          >
                            {textile.name}
                          </span>
                          <span className="font-body text-xs text-[#666]">
                            {unitPrice}&euro;/piece
                          </span>
                        </div>
                        <QtySelector
                          qty={qty}
                          onChange={(n) => updateQty(textile.id, n)}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {totalQty > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 bg-[#1a1a1a] border border-[#333] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-white/60">
                        Total pieces
                      </span>
                      <span className="font-heading text-lg font-black text-white">
                        {totalQty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-body text-sm text-white/60">
                        Formule
                      </span>
                      <span className="font-heading text-sm font-bold text-[#C5FF00]">
                        {activeMenu.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-body text-sm text-white/60">
                        Sous-total textile
                      </span>
                      <span className="font-heading text-lg font-black text-[#C5FF00]">
                        {textileTotal}&euro;
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {item.special ? (
                  <div className="mb-6">
                    <h4 className="font-heading text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
                      Flocage inclus
                    </h4>
                    <div className="bg-[#C5FF00]/10 border border-[#C5FF00]/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Check
                          className="w-4 h-4 text-[#C5FF00]"
                          strokeWidth={3}
                        />
                        <span className="font-heading text-sm font-bold text-[#C5FF00]">
                          Nom + numero (dos)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check
                          className="w-4 h-4 text-[#C5FF00]"
                          strokeWidth={3}
                        />
                        <span className="font-heading text-sm font-bold text-[#C5FF00]">
                          Logo sponsor
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    {standardQty > 0 && (
                      <>
                        <h4 className="font-heading text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
                          Emplacements flocage
                        </h4>
                        <div className="flex flex-col gap-3">
                          {flocageOptions.map((opt) => {
                            const isSelected =
                              selectedFlocage[
                                opt.id as keyof typeof selectedFlocage
                              ] === true;
                            return (
                              <motion.button
                                key={opt.id}
                                onClick={() =>
                                  setSelectedFlocage((prev) => ({
                                    ...prev,
                                    [opt.id]:
                                      !prev[opt.id as "dos" | "coeur"],
                                  }))
                                }
                                whileTap={{ scale: 0.98 }}
                                className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? "border-[#C5FF00] bg-[#C5FF00]/10"
                                    : "border-[#333] bg-[#1a1a1a] hover:border-[#C5FF00]/40"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                      isSelected
                                        ? "bg-[#C5FF00] border-[#C5FF00]"
                                        : "border-[#555] bg-transparent"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check
                                        className="w-3.5 h-3.5 text-[#0A0A0A]"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </div>
                                  <span
                                    className={`font-heading text-sm font-bold uppercase ${
                                      isSelected
                                        ? "text-[#C5FF00]"
                                        : "text-white"
                                    }`}
                                  >
                                    {opt.name}
                                  </span>
                                </div>
                                <span className="font-heading text-sm font-bold text-white/50">
                                  +{opt.price}&euro;/piece
                                </span>
                              </motion.button>
                            );
                          })}

                          <div
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                              selectedFlocage.logoSup > 0
                                ? "border-[#C5FF00] bg-[#C5FF00]/10"
                                : "border-[#333] bg-[#1a1a1a]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  selectedFlocage.logoSup > 0
                                    ? "bg-[#C5FF00] border-[#C5FF00]"
                                    : "border-[#555] bg-transparent"
                                }`}
                              >
                                {selectedFlocage.logoSup > 0 && (
                                  <Check
                                    className="w-3.5 h-3.5 text-[#0A0A0A]"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                              <div>
                                <span
                                  className={`font-heading text-sm font-bold uppercase block ${
                                    selectedFlocage.logoSup > 0
                                      ? "text-[#C5FF00]"
                                      : "text-white"
                                  }`}
                                >
                                  Logo(s) supplementaire(s)
                                </span>
                                <span className="font-body text-xs text-white/40">
                                  +2&euro;/logo/piece
                                </span>
                              </div>
                            </div>
                            <QtySelector
                              qty={selectedFlocage.logoSup}
                              onChange={(n) =>
                                setSelectedFlocage((prev) => ({
                                  ...prev,
                                  logoSup: n,
                                }))
                              }
                            />
                          </div>
                        </div>

                        {standardFlocagePerPiece > 0 && standardQty > 0 && (
                          <div className="mt-3 text-right">
                            <span className="font-body text-xs text-white/40">
                              Flocage : {standardFlocagePerPiece}&euro;/piece
                              &times; {standardQty} ={" "}
                              {standardFlocageTotal}&euro;
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {flatFlocageItems.length > 0 && (
                      <>
                        <h4
                          className={`font-heading text-sm font-bold text-white/40 uppercase tracking-wider mb-3 ${
                            standardQty > 0 ? "mt-6" : ""
                          }`}
                        >
                          Flocage accessoires
                        </h4>
                        <div className="flex flex-col gap-3">
                          {flatFlocageItems.map((fi) => (
                            <div
                              key={fi.textileId}
                              className="flex items-center justify-between p-4 rounded-xl border-2 border-[#C5FF00] bg-[#C5FF00]/10"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-md bg-[#C5FF00] border-2 border-[#C5FF00] flex items-center justify-center">
                                  <Check
                                    className="w-3.5 h-3.5 text-[#0A0A0A]"
                                    strokeWidth={3}
                                  />
                                </div>
                                <span className="font-heading text-sm font-bold uppercase text-[#C5FF00]">
                                  {fi.name}
                                </span>
                              </div>
                              <span className="font-heading text-sm font-bold text-white/50">
                                {fi.flocageFlat}&euro;/piece &times; {fi.qty} ={" "}
                                {fi.qty * fi.flocageFlat}&euro;
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <h4 className="font-heading text-sm font-bold text-white/40 uppercase tracking-wider mb-3">
                  Technique
                </h4>
                <div className="flex flex-col gap-3">
                  {techniques.map((tech) => (
                    <motion.button
                      key={tech.id}
                      onClick={() => setSelectedTechnique(tech.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedTechnique === tech.id
                          ? "border-[#C5FF00] bg-[#C5FF00]/10"
                          : "border-[#333] bg-[#1a1a1a] hover:border-[#C5FF00]/40"
                      }`}
                    >
                      {selectedTechnique === tech.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-[#C5FF00] rounded-full flex items-center justify-center"
                        >
                          <Check
                            className="w-3.5 h-3.5 text-[#0A0A0A]"
                            strokeWidth={3}
                          />
                        </motion.div>
                      )}
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-heading text-base sm:text-lg font-bold uppercase ${
                            selectedTechnique === tech.id
                              ? "text-[#C5FF00]"
                              : "text-white"
                          }`}
                        >
                          {tech.name}
                        </span>
                        {tech.tag && (
                          <span
                            className={`px-2 py-0.5 font-heading text-[9px] font-bold uppercase tracking-wider ${
                              tech.id === "dtf"
                                ? "bg-[#C5FF00] text-[#0A0A0A]"
                                : "bg-white/10 text-white/50"
                            }`}
                          >
                            {tech.tag}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-sm text-white/50 mt-1">
                        {tech.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-[#f5f0e8] text-[#1a1a1a] rounded-sm p-6 sm:p-8 font-mono shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative">
                  <div className="absolute top-0 left-0 right-0 h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyMCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAxMkwxMCAwTDIwIDEyIiBmaWxsPSIjZjVmMGU4Ii8+PC9zdmc+')] bg-repeat-x bg-[length:20px_12px] -translate-y-full" />

                  <div className="text-center mb-4">
                    <p className="font-heading text-2xl font-black tracking-wider uppercase">
                      L&apos;APPART 98
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/50 mt-1">
                      65 rue Charles Frerot, 94250 Gentilly
                    </p>
                    <p className="text-[11px] text-[#1a1a1a]/50">
                      06 75 00 86 33
                    </p>
                  </div>

                  <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />

                  <div className="flex justify-between text-[11px] text-[#1a1a1a]/50 mb-3">
                    <span>FORMULE</span>
                    <span className="font-bold text-[#1a1a1a]">
                      {activeMenu.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#1a1a1a]/50 mb-1">
                    <span>TECHNIQUE</span>
                    <span>
                      {techniques.find((t) => t.id === selectedTechnique)
                        ?.name || "DTF"}
                    </span>
                  </div>

                  <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />

                  <div className="flex justify-between text-[10px] text-[#1a1a1a]/40 mb-2 uppercase tracking-wider">
                    <span>Textiles</span>
                    <div className="flex gap-4">
                      <span className="w-8 text-right">Qte</span>
                      <span className="w-12 text-right">P.U.</span>
                      <span className="w-14 text-right">Prix</span>
                    </div>
                  </div>

                  {cart.filter((c) => c.qty > 0).length > 0 ? (
                    <div className="space-y-2">
                      {cart
                        .filter((c) => c.qty > 0)
                        .map((c) => {
                          const t = textiles.find(
                            (tx) => tx.id === c.textileId
                          );
                          const unitPrice =
                            productPricing[c.textileId]?.[tierKey] ?? 0;
                          return (
                            <div
                              key={c.textileId}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-none">
                                {t?.name}
                              </span>
                              <div className="flex gap-4">
                                <span className="w-8 text-right text-sm text-[#1a1a1a]/60">
                                  x{c.qty}
                                </span>
                                <span className="w-12 text-right text-sm text-[#1a1a1a]/60">
                                  {unitPrice}&euro;
                                </span>
                                <span className="w-14 text-right text-sm font-bold">
                                  {c.qty * unitPrice}&euro;
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-[#1a1a1a]/40 text-center py-2">
                      Aucun article ajoute
                    </p>
                  )}

                  <div className="flex justify-between mt-3 text-sm">
                    <span className="text-[#1a1a1a]/60">
                      Sous-total textile
                    </span>
                    <span className="font-bold">{textileTotal}&euro;</span>
                  </div>

                  {!item.special && flocageTotal > 0 && (
                    <>
                      <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />

                      <div className="flex justify-between text-[10px] text-[#1a1a1a]/40 mb-2 uppercase tracking-wider">
                        <span>Flocage</span>
                        <span className="w-14 text-right">Prix</span>
                      </div>

                      <div className="space-y-2">
                        {selectedFlocage.dos && standardQty > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Dos</span>
                            <div className="flex gap-4">
                              <span className="text-sm text-[#1a1a1a]/60">
                                {standardQty} &times; 5&euro;
                              </span>
                              <span className="w-14 text-right text-sm font-bold">
                                {standardQty * 5}&euro;
                              </span>
                            </div>
                          </div>
                        )}
                        {selectedFlocage.coeur && standardQty > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Coeur</span>
                            <div className="flex gap-4">
                              <span className="text-sm text-[#1a1a1a]/60">
                                {standardQty} &times; 3&euro;
                              </span>
                              <span className="w-14 text-right text-sm font-bold">
                                {standardQty * 3}&euro;
                              </span>
                            </div>
                          </div>
                        )}
                        {selectedFlocage.logoSup > 0 && standardQty > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Logo sup. x{selectedFlocage.logoSup}
                            </span>
                            <div className="flex gap-4">
                              <span className="text-sm text-[#1a1a1a]/60">
                                {standardQty} &times;{" "}
                                {selectedFlocage.logoSup * 2}&euro;
                              </span>
                              <span className="w-14 text-right text-sm font-bold">
                                {standardQty * selectedFlocage.logoSup * 2}
                                &euro;
                              </span>
                            </div>
                          </div>
                        )}
                        {flatFlocageItems.map((fi) => (
                          <div
                            key={fi.textileId}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-medium">
                              Flocage {fi.name}
                            </span>
                            <div className="flex gap-4">
                              <span className="text-sm text-[#1a1a1a]/60">
                                {fi.qty} &times; {fi.flocageFlat}&euro;
                              </span>
                              <span className="w-14 text-right text-sm font-bold">
                                {fi.qty * fi.flocageFlat}&euro;
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between mt-3 text-sm">
                        <span className="text-[#1a1a1a]/60">
                          Sous-total flocage
                        </span>
                        <span className="font-bold">{flocageTotal}&euro;</span>
                      </div>
                    </>
                  )}

                  {!item.special && flocageTotal === 0 && (
                    <>
                      <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />
                      <p className="text-sm text-[#1a1a1a]/40 text-center py-2">
                        Aucun flocage selectionne
                      </p>
                    </>
                  )}

                  {item.special && (
                    <>
                      <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />
                      <div className="text-sm text-[#1a1a1a]/60 text-center">
                        Flocage inclus : nom + numero + logo
                      </div>
                    </>
                  )}

                  <div className="border-t-2 border-solid border-[#1a1a1a]/30 mt-4 pt-3">
                    <div className="flex justify-between items-end">
                      <span className="font-heading text-lg font-black uppercase">
                        Estimation
                      </span>
                      <span className="font-heading text-3xl font-black">
                        ~{totalEstimate}&euro;*
                      </span>
                    </div>
                  </div>

                  <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-4" />

                  <p className="text-[10px] text-[#1a1a1a]/40 text-center leading-relaxed">
                    *Prix indicatif HT &mdash; devis final apres validation du
                    BAT selon textile et visuel.
                  </p>
                  <p className="text-center mt-3 text-sm font-bold tracking-wider uppercase">
                    Merci de votre visite !
                  </p>

                  <div className="border-t-2 border-dashed border-[#1a1a1a]/20 my-3" />
                  <p className="text-[11px] text-[#1a1a1a]/60 text-center leading-relaxed">
                    Pour recevoir ton devis final et nous envoyer ton logo,
                    ecris-nous sur{" "}
                    <a
                      href="https://wa.me/33675008633"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#25D366] hover:underline"
                    >
                      WhatsApp
                    </a>{" "}
                    ou par{" "}
                    <a
                      href="mailto:contact@lappart98.fr"
                      className="font-bold text-[#1a1a1a]/80 hover:underline"
                    >
                      mail
                    </a>
                  </p>

                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyMCAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwTDEwIDEyTDIwIDAiIGZpbGw9IiNmNWYwZTgiLz48L3N2Zz4=')] bg-repeat-x bg-[length:20px_12px] translate-y-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sticky bottom-0 p-5 sm:p-6 border-t border-[#222] bg-[#111] flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-3 border border-[#333] font-heading text-sm font-bold uppercase tracking-wider text-white/60 hover:text-white hover:border-white/30 transition-colors duration-200 cursor-pointer"
            >
              Retour
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#C5FF00] text-[#0A0A0A] px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
            >
              Suivant
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          ) : (
            <>
              <a
                href={`https://wa.me/33675008633?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#1da851] transition-colors duration-200 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
                WhatsApp
              </a>
              <a
                href={mailtoUrl}
                className="flex-1 flex items-center justify-center gap-2 bg-[#C5FF00] text-[#0A0A0A] px-4 py-3 font-heading text-sm font-bold uppercase tracking-wider hover:bg-[#9ECC00] transition-colors duration-200 cursor-pointer"
              >
                <Mail className="w-4 h-4" strokeWidth={2.5} />
                Email
              </a>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const [showConfigurator, setShowConfigurator] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: "easeOut" as const,
        }}
      >
        <motion.div
          onClick={() => setShowConfigurator(true)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
            item.special
              ? "bg-[#C5FF00] text-[#0A0A0A]"
              : "bg-[#141414] text-white border border-[#222] hover:border-[#C5FF00]/50"
          } ${item.popular ? "ring-2 ring-[#C5FF00]" : ""}`}
        >
          {item.popular && (
            <div className="absolute top-0 right-0 bg-[#C5FF00] text-[#0A0A0A] px-4 py-1">
              <span className="font-heading text-[10px] font-bold tracking-widest uppercase">
                Le + commande
              </span>
            </div>
          )}

          {item.special && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#0A0A0A] text-[#C5FF00] px-3 py-1 font-heading text-[10px] font-bold tracking-widest uppercase">
                Special Club
              </span>
            </div>
          )}

          <div className="p-5 sm:p-8 flex items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
              <div
                className={`hidden sm:flex w-14 h-14 rounded-xl items-center justify-center shrink-0 ${
                  item.special ? "bg-[#0A0A0A]/10" : "bg-[#C5FF00]/10"
                }`}
              >
                <item.icon
                  className={`w-7 h-7 ${
                    item.special ? "text-[#0A0A0A]" : "text-[#C5FF00]"
                  }`}
                  strokeWidth={1.5}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-black uppercase">
                    {item.name}
                  </h3>
                  <span
                    className={`px-3 py-0.5 font-heading text-[10px] sm:text-xs font-bold tracking-wider shrink-0 ${
                      item.special
                        ? "bg-[#0A0A0A] text-[#C5FF00]"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {item.quantity}
                  </span>
                </div>
                <p
                  className={`font-body text-sm mt-1 ${
                    item.special ? "text-[#0A0A0A]/70" : "text-white/50"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>

            <PriceBurst price={String(item.price)} inverted={item.special} />
          </div>

          <div
            className={`h-1 ${
              item.popular
                ? "bg-[#C5FF00]"
                : item.special
                  ? "bg-[#0A0A0A]"
                  : "bg-[#222]"
            }`}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showConfigurator && (
          <Configurator
            item={item}
            onClose={() => setShowConfigurator(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default function MenuBoard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="menus" className="py-24 sm:py-32 relative" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#111_0%,_#0A0A0A_70%)]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="font-heading text-xs tracking-[0.3em] text-white/40 uppercase">
            Sers-toi, c&apos;est a la commande
          </span>
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl font-black uppercase mt-3">
            LES <span className="text-[#C5FF00]">MENUS</span>
          </h2>
          <p className="font-body text-base text-white/50 mt-4 max-w-lg mx-auto">
            Choisis ta formule selon la quantite &mdash; clique pour composer ta
            commande
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {menus.map((item, index) => (
            <MenuCard key={item.name} item={item} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-[#C5FF00] px-6 py-3">
            <p className="font-heading text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
              Chaque menu = ton textile + ton flocage + la pose
            </p>
          </div>
          <p className="font-body text-xs text-white/30 mt-4">
            *Prix indicatifs T-Shirt Basique + flocage dos. Tarif selon textile
            et emplacements.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
