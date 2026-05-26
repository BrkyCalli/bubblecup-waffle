import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { InstagramIcon } from "./InstagramIcon";

const quickLinks = [
  { href: "/menu", label: "Menü" },
  { href: "/sepet", label: "Sepetim" },
  { href: "/iletisim", label: "İletişim" },
];

const legalLinks = [
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/iade-politikasi", label: "İade Politikası" },
];

export function Footer() {
  return (
    <footer className="border-t border-pembe/15 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Marka */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">
              🧇
            </span>
            <span className="font-display text-lg font-semibold text-pembe-koyu">
              BUBBLECUP WAFFLE
            </span>
          </div>
          <p className="mt-3 text-sm text-metin-orta">
            Aydın Efeler&apos;de el yapımı, taptaze waffle keyfi. Sevdiklerinle
            paylaşmak için birbirinden lezzetli paketler.
          </p>
        </div>

        {/* Hızlı linkler */}
        <div>
          <h4 className="font-display text-sm font-semibold text-metin">
            Hızlı Bağlantılar
          </h4>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-metin-orta transition-colors hover:text-pembe-koyu"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Yasal */}
        <div>
          <h4 className="font-display text-sm font-semibold text-metin">
            Yasal
          </h4>
          <ul className="mt-4 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-metin-orta transition-colors hover:text-pembe-koyu"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* İletişim */}
        <div>
          <h4 className="font-display text-sm font-semibold text-metin">
            İletişim
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-metin-orta">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pembe" />
              <span>
                Orta Mahalle, Doğugazi Bulvarı No:114D, Efeler / Aydın
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-pembe" />
              <span>Her gün 12:00 - 03:00</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-pembe" />
              <a
                href="tel:+905424000524"
                className="transition-colors hover:text-pembe-koyu"
              >
                +90 542 400 0524
              </a>
            </li>
            <li className="flex items-center gap-2">
              <WhatsAppIcon className="h-4 w-4 shrink-0 text-[#25D366]" />
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pembe-koyu"
              >
                WhatsApp ile yazın
              </a>
            </li>
            <li className="flex items-center gap-2">
              <InstagramIcon className="h-4 w-4 shrink-0 text-pembe" />
              <a
                href="https://instagram.com/bubblecupwaffle09"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pembe-koyu"
              >
                @bubblecupwaffle09
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pembe/10 py-5">
        <p className="text-center text-xs text-metin-orta">
          © {new Date().getFullYear()} BUBBLECUP WAFFLE. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
