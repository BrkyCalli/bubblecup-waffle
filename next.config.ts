import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Destekleyen tarayıcılara daha iyi sıkıştırılmış AVIF/WebP sun
    // (next/image zaten otomatik boyutlandırır; bu formatları da ekliyoruz).
    formats: ["image/avif", "image/webp"],
    // Google yorumlarındaki profil fotoğrafları bu host'tan gelir.
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
};

export default nextConfig;
