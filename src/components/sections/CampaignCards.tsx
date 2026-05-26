import { buildWhatsAppUrl } from "@/lib/whatsapp";

const campaigns = [
  {
    emoji: "🎉",
    title: "5 Al 4 ÖDE!",
    description: "Sınırsız seçim hakkıyla en avantajlı paket. Gruplar için ideal.",
    price: "1.200 ₺",
    accent: "bg-altin",
    message: "Merhaba 🧇 '5 Al 4 ÖDE' kampanyasından sipariş vermek istiyorum.",
  },
  {
    emoji: "🍫",
    title: "Paylaşmalık Kova",
    description: "3 kişilik dev kova paketi. Sevdiklerinle paylaşmak için.",
    price: "825 ₺",
    accent: "bg-pembe",
    message:
      "Merhaba 🧇 'Sevdiklerinle Paylaşmalık Kova' paketinden sipariş vermek istiyorum.",
  },
  {
    emoji: "💕",
    title: "2'li Bardak Avantaj",
    description: "İkiliyseniz tam size göre. İki bardak waffle, avantajlı fiyat.",
    price: "470 ₺",
    accent: "bg-pembe-koyu",
    message:
      "Merhaba 🧇 '2'li Bardak Waffle Avantaj Paketi'nden sipariş vermek istiyorum.",
  },
];

export function CampaignCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-metin sm:text-4xl">
          Fırsat Paketleri
        </h2>
        <p className="mt-3 text-metin-orta">
          Kaçırılmayacak kampanyalarla daha çok lezzet, daha az ödeme.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.title}
            className="flex flex-col items-center rounded-2xl border border-pembe/15 bg-white p-7 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${campaign.accent} text-3xl shadow-sm`}
            >
              {campaign.emoji}
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-metin">
              {campaign.title}
            </h3>
            <p className="mt-2 flex-1 text-sm text-metin-orta">
              {campaign.description}
            </p>
            <p className="mt-4 font-display text-2xl font-bold text-pembe-koyu">
              {campaign.price}
            </p>
            <a
              href={buildWhatsAppUrl(campaign.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-pembe px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pembe-koyu"
            >
              Sipariş Ver
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
