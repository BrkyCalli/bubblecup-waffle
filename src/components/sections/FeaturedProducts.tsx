import Link from "next/link";
import { products } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function FeaturedProducts() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-metin sm:text-4xl">
            Öne Çıkan Lezzetler
          </h2>
          <p className="mt-3 text-metin-orta">
            En sevilen wafflelerimiz, sepete eklemek için bir tık uzakta.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border-2 border-pembe px-7 py-3 text-base font-semibold text-pembe-koyu transition-colors hover:bg-pembe hover:text-white"
          >
            Tüm Menüyü Gör
          </Link>
        </div>
      </div>
    </section>
  );
}
