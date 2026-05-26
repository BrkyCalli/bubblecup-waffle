import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { InstagramIcon } from "@/components/layout/InstagramIcon";

export const metadata: Metadata = {
  title: "İletişim | BUBBLECUP WAFFLE",
  description:
    "BUBBLECUP WAFFLE Aydın Efeler şubesi. Adres, çalışma saatleri, telefon ve WhatsApp ile bize ulaşın.",
};

const MAPS_QUERY = encodeURIComponent(
  "Doğugazi Bulvarı No:114D, Orta Mahalle, Efeler, Aydın",
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-metin sm:text-5xl">
          İletişim
        </h1>
        <p className="mt-3 text-metin-orta">
          Sorularınız için bize ulaşın ya da şubemize uğrayın!
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Şube bilgi kartı */}
        <div className="rounded-2xl border border-pembe/15 bg-white p-7 shadow-sm">
          <h2 className="font-display text-2xl font-semibold text-pembe-koyu">
            Aydın Şubesi
          </h2>
          <p className="mt-1 text-sm text-metin-orta">Efeler</p>

          <ul className="mt-6 space-y-5">
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pembe/10 text-pembe">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-metin">Adres</p>
                <p className="text-sm text-metin-orta">
                  Orta Mahalle, Doğugazi Bulvarı No:114D, Efeler / Aydın
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pembe/10 text-pembe">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-metin">Çalışma Saatleri</p>
                <p className="text-sm text-metin-orta">Her gün 12:00 - 03:00</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pembe/10 text-pembe">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-metin">Telefon</p>
                <a
                  href="tel:+905424000524"
                  className="text-sm text-metin-orta transition-colors hover:text-pembe-koyu"
                >
                  +90 542 400 0524
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildWhatsAppUrl(
                "Merhaba BUBBLECUP WAFFLE 🧇 Bilgi almak istiyorum.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1fb855]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </a>
            <a
              href="https://instagram.com/bubblecupwaffle09"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-pembe px-6 py-3 text-base font-semibold text-pembe-koyu transition-colors hover:bg-pembe hover:text-white"
            >
              <InstagramIcon className="h-5 w-5" />
              Instagram
            </a>
          </div>
        </div>

        {/* Harita */}
        <div className="overflow-hidden rounded-2xl border border-pembe/15 shadow-sm">
          <iframe
            title="BUBBLECUP WAFFLE Aydın şube konumu"
            src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
            className="h-full min-h-[320px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
