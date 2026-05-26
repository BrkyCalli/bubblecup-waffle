"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  // Fotoğraf yokken/yüklenemezken gösterilecek yer tutucu (gradyan vb.)
  children: ReactNode;
}

// Fotoğraf varsa next/image ile üstte gösterir; dosya bulunamazsa (404)
// alttaki yer tutucu (children) görünür kalır.
export function ImageWithFallback({
  src,
  alt,
  className,
  sizes,
  children,
}: Props) {
  const [error, setError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      {!error && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
