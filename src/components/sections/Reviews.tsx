import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type ApprovedReview = {
  id: string;
  rating: number | null;
  comment: string | null;
  customer_name: string | null;
};

// Gizlilik: "Berkay Callı" → "Berkay C."
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
    .select("id, rating, comment, customer_name")
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
            return (
              <figure
                key={review.id}
                className="flex flex-col rounded-2xl border border-pembe/15 bg-krem p-6 shadow-sm"
              >
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
                <blockquote className="mt-4 flex-1 text-metin-orta">
                  “{review.comment}”
                </blockquote>
                <figcaption className="mt-4 font-display font-semibold text-metin">
                  {shortName(review.customer_name)}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
