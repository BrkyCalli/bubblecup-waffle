import type { Metadata } from "next";
import { CartClient } from "@/components/sections/CartClient";

export const metadata: Metadata = {
  title: "Sepetim | BUBBLECUP WAFFLE",
  description:
    "Sepetinizi gözden geçirin ve WhatsApp ile kolayca sipariş verin. Aydın Efeler'de ücretsiz teslimat.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-4xl font-bold text-metin sm:text-5xl">
        Sepetim
      </h1>
      <CartClient />
    </div>
  );
}
