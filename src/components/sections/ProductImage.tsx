import { cn } from "@/lib/utils";

interface ProductImageProps {
  alt: string;
  className?: string;
}

// NOT: Gerçek ürün fotoğrafları public/images/products/ altına eklenince
// bu placeholder'ı next/image <Image> ile değiştireceğiz. Şimdilik markaya
// uygun pembe/altın gradyan + waffle emoji gösteriyoruz.
export function ProductImage({ alt, className }: ProductImageProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-pembe/25 via-krem to-altin/25",
        className,
      )}
    >
      <span className="text-5xl opacity-80 sm:text-6xl" aria-hidden="true">
        🧇
      </span>
      <span className="sr-only">{alt}</span>
    </div>
  );
}
