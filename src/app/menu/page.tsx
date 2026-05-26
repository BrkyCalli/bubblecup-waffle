import type { Metadata } from "next";
import { MenuClient } from "@/components/sections/MenuClient";

export const metadata: Metadata = {
  title: "Menü | BUBBLECUP WAFFLE",
  description:
    "BUBBLECUP WAFFLE menüsü: bardak waffle, kova waffle, avantaj paketleri ve 5 al 4 öde fırsatı. Aydın Efeler'de taptaze waffle.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-metin sm:text-5xl">
          Menümüz
        </h1>
        <p className="mt-3 text-metin-orta">
          Birbirinden lezzetli wafflelerimizi keşfedin ve sepete ekleyin.
        </p>
      </div>

      <MenuClient />
    </div>
  );
}
