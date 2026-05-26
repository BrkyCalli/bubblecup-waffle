"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Fotoğraf varsa next/image ile gösterir; dosya bulunamazsa (404) markaya
// uygun pembe/altın gradyan + waffle emoji yer tutucuya düşer.
export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-pembe/25 via-krem to-altin/25",
        className,
      )}
    >
      {!error && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={() => setError(true)}
        />
      )}
      {error && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-5xl opacity-80 sm:text-6xl" aria-hidden="true">
            🧇
          </span>
          <span className="sr-only">{alt}</span>
        </div>
      )}
    </div>
  );
}
