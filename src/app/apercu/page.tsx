import type { Metadata } from "next";
import ApercuPage from "@/components/ApercuPage";

export const metadata: Metadata = {
  title: "Essaie ton logo | L'Appart 98",
  description:
    "Dépose ton visuel et vois-le sur le t-shirt : cœur, grand devant, petit centré ou dos. Aperçu immédiat, puis devis en deux clics.",
};

export default function Page() {
  return <ApercuPage />;
}
