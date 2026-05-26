import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ayşe K.",
    text: "Bardak waffle'ı çok beğendim, sosları bol ve taptaze. Kesinlikle tekrar sipariş vereceğim!",
  },
  {
    name: "Mehmet T.",
    text: "5 al 4 öde kampanyası gerçekten müthiş. Arkadaşlarla sipariş verdik, herkes bayıldı.",
  },
  {
    name: "Zeynep A.",
    text: "Kova waffle paketini denedik, harika bir deneyimdi. Sunum ve lezzet on numara.",
  },
];

export function Reviews() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-metin sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="mt-3 text-metin-orta">
            Lezzetimizi deneyenlerin yorumları.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-2xl border border-pembe/15 bg-krem p-6 shadow-sm"
            >
              <div className="flex gap-0.5" aria-label="5 üzerinden 5 yıldız">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-altin text-altin"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-metin-orta">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-4 font-display font-semibold text-metin">
                {review.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
