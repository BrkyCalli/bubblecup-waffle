"use client";

import { useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import type { ProductCategory } from "@/types";

type Filter = "hepsi" | ProductCategory;

const filters: { value: Filter; label: string }[] = [
  { value: "hepsi", label: "Hepsi" },
  { value: "klasik", label: "Klasik" },
  { value: "ozel", label: "Avantaj/Özel" },
  { value: "sinirsiz", label: "Sınırsız Seçim" },
];

export function MenuClient() {
  const [active, setActive] = useState<Filter>("hepsi");

  const filtered =
    active === "hepsi"
      ? products
      : products.filter((product) => product.category === active);

  return (
    <div>
      {/* Filtre butonları */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              active === filter.value
                ? "bg-pembe text-white shadow-sm"
                : "border border-pembe/30 bg-white text-metin hover:border-pembe hover:text-pembe-koyu"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Ürün grid'i */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
