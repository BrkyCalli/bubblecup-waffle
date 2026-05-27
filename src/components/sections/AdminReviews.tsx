"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { moderateReview } from "@/lib/review-actions";

export type AdminReview = {
  id: string;
  rating: number | null;
  comment: string | null;
  customer_name: string | null;
  status: "submitted" | "approved" | "rejected";
  submitted_at: string | null;
  source: "site" | "google";
};

const STATUS_LABEL: Record<AdminReview["status"], string> = {
  submitted: "Bekliyor",
  approved: "Onaylı",
  rejected: "Reddedildi",
};
const STATUS_STYLE: Record<AdminReview["status"], string> = {
  submitted: "bg-altin/15 text-altin-koyu",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminReviews({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function act(id: string, status: "approved" | "rejected") {
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await moderateReview(id, status);
      if (!res.ok) setError(res.error ?? "Bir hata oluştu.");
      else router.refresh();
      setBusyId(null);
    });
  }

  if (reviews.length === 0) {
    return (
      <p className="rounded-2xl border border-pembe/15 bg-white py-16 text-center text-metin-orta shadow-sm">
        Henüz değerlendirilecek yorum yok.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {reviews.map((r) => {
        const rating = r.rating ?? 0;
        const busy = isPending && busyId === r.id;
        return (
          <div
            key={r.id}
            className="rounded-2xl border border-pembe/15 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5" aria-label={`${rating} yıldız`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < rating
                          ? "h-4 w-4 fill-altin text-altin"
                          : "h-4 w-4 text-metin-orta/25"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-sm text-metin-orta">
                  {formatDate(r.submitted_at)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    r.source === "google"
                      ? "bg-altin/15 text-altin-koyu"
                      : "bg-pembe/15 text-pembe-koyu"
                  }`}
                >
                  {r.source === "google" ? "🗺️ Google" : "✍️ Site"}
                </span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[r.status]}`}
              >
                {STATUS_LABEL[r.status]}
              </span>
            </div>

            {r.comment ? (
              <blockquote className="mt-3 text-metin">“{r.comment}”</blockquote>
            ) : (
              <p className="mt-3 text-sm text-metin-orta italic">
                (Yorum metni yok — yalnızca puan)
              </p>
            )}

            <p className="mt-2 text-sm font-medium text-metin">
              {r.customer_name ?? "Müşteri"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-pembe/10 pt-3">
              {r.status !== "approved" && (
                <button
                  type="button"
                  onClick={() => act(r.id, "approved")}
                  disabled={busy}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {busy ? "…" : "Onayla"}
                </button>
              )}
              {r.status !== "rejected" && (
                <button
                  type="button"
                  onClick={() => act(r.id, "rejected")}
                  disabled={busy}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {r.status === "approved" ? "Yayından Kaldır" : "Reddet"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
