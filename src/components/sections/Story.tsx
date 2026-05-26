import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";
import { ImageWithFallback } from "./ImageWithFallback";

export function Story() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Görsel: story.png varsa gösterilir, yoksa gradyan yer tutucu kalır */}
        <ImageWithFallback
          src="/images/story.png"
          alt="BUBBLECUP WAFFLE hikayemiz"
          className="aspect-[4/3] rounded-3xl shadow-sm"
          sizes="(max-width: 768px) 100vw, 50vw"
        >
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-altin/30 via-krem to-pembe/30">
            <span className="text-7xl" aria-hidden="true">
              🧇
            </span>
          </div>
        </ImageWithFallback>

        <div>
          <span className="text-sm font-semibold tracking-wide text-pembe-koyu uppercase">
            Hikayemiz
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-metin sm:text-4xl">
            Sevgiyle, taptaze, el yapımı
          </h2>
          <p className="mt-4 text-metin-orta">
            BUBBLECUP WAFFLE olarak her wafflemizi siparişiniz üzerine, taze
            malzemelerle hazırlıyoruz. Çıtır hamurumuz, gerçek çikolata
            soslarımız ve mevsim meyvelerimizle her lokmada el yapımı lezzetin
            farkını hissedeceksiniz.
          </p>
          <p className="mt-3 text-metin-orta">
            Aydın Efeler&apos;deki şubemizde sizi ağırlamaktan ya da
            WhatsApp&apos;tan siparişinizi almaktan mutluluk duyarız.
          </p>

          <a
            href={buildWhatsAppUrl(
              "Merhaba BUBBLECUP WAFFLE 🧇 Bilgi almak istiyorum.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-pembe px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-pembe-koyu"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Bize Yazın
          </a>
        </div>
      </div>
    </section>
  );
}
