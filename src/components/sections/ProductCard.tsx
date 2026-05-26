"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/whatsapp";
import { ProductImage } from "./ProductImage";
import { ProductCustomizeModal } from "./ProductCustomizeModal";

export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdded = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-pembe/15 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <ProductImage
          alt={product.name}
          className="aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-altin px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-metin">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-metin-orta">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-display text-xl font-bold text-pembe-koyu">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${product.name} ürününü özelleştir ve sepete ekle`}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${
              added ? "bg-altin" : "bg-pembe hover:bg-pembe-koyu"
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> Eklendi
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Sepete Ekle
              </>
            )}
          </button>
        </div>
      </div>

      <ProductCustomizeModal
        product={product}
        open={open}
        onOpenChange={setOpen}
        onAdded={handleAdded}
      />
    </article>
  );
}
