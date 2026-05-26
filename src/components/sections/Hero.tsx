import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { ImageWithFallback } from "./ImageWithFallback";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
      {/* Arka plan: hero.png varsa gösterilir, yoksa gradyan yer tutucu kalır */}
      <ImageWithFallback
        src="/images/hero.png"
        alt="BUBBLECUP WAFFLE"
        className="absolute inset-0"
        sizes="100vw"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pembe-koyu via-pembe to-altin" />
      </ImageWithFallback>
      {/* Metin okunurluğu için koyu overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
        <span className="mb-5 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          🧇 Aydın Efeler&apos;in tatlı durağı
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          BUBBLECUP WAFFLE
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90 sm:text-xl">
          Aydın&apos;ın en lezzetli wafflesi. Taptaze, bol malzemeli ve
          paylaşmalık. Hemen sipariş ver, keyfine bak!
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/menu"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-semibold text-pembe-koyu shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            Menüyü Keşfet
          </Link>
          <a
            href={buildWhatsAppUrl(
              "Merhaba BUBBLECUP WAFFLE 🧇 Sipariş vermek istiyorum.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp ile Sipariş
          </a>
        </div>
      </div>
    </section>
  );
}
