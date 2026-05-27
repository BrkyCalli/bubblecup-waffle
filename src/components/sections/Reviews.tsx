import Image from "next/image";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type ReviewSource = "site" | "google";

type ApprovedReview = {
  id: string;
  rating: number | null;
  comment: string | null;
  customer_name: string | null;
  source: ReviewSource;
  author_photo: string | null;
};

// Gizlilik: "Berkay Callı" → "Berkay C." (yalnızca site yorumlarında)
function shortName(full: string | null): string {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Müşteri";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

export async function Reviews() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment, customer_name, source, author_photo")
    .eq("status", "approved")
    .not("comment", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(12);

  const reviews = (data ?? []) as ApprovedReview[];

  // Henüz onaylı (yorum metinli) değerlendirme yoksa bölümü gizle
  if (reviews.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-metin sm:text-4xl">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="mt-3 text-metin-orta">
            Lezzetimizi deneyenlerin gerçek yorumları.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => {
            const rating = review.rating ?? 5;
            const isGoogle = review.source === "google";
            return (
              <figure
                key={review.id}
                className="flex flex-col rounded-2xl border border-pembe/15 bg-krem p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex gap-0.5"
                    aria-label={`5 üzerinden ${rating} yıldız`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < rating
                            ? "h-5 w-5 fill-altin text-altin"
                            : "h-5 w-5 text-metin-orta/25"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isGoogle
                        ? "bg-altin/15 text-altin-koyu"
                        : "bg-pembe/15 text-pembe-koyu"
                    }`}
                  >
                    {isGoogle ? "🗺️ Google" : "✍️ Site"}
                  </span>
                </div>

                <blockquote className="mt-4 flex-1 text-metin-orta">
                  “{review.comment}”
                </blockquote>

                <figcaption className="mt-4 flex items-center gap-3">
                  {isGoogle && review.author_photo && (
                    <Image
                      src={review.author_photo}
                      alt={review.customer_name ?? "Google kullanıcısı"}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  )}
                  <span className="font-display font-semibold text-metin">
                    {isGoogle
                      ? review.customer_name ?? "Google Kullanıcısı"
                      : shortName(review.customer_name)}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
