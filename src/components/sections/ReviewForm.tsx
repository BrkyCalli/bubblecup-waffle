"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitReview } from "@/lib/review-actions";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COMMENT_MAX = 400;

export function ReviewForm({
  token,
  customerName,
}: {
  token: string;
  customerName: string | null;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    if (rating < 1) {
      setError("Lütfen bir puan seç.");
      return;
    }
    startTransition(async () => {
      const res = await submitReview(token, rating, comment);
      if (res.ok) setDone(true);
      else setError(res.error ?? "Bir hata oluştu.");
    });
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
          🎉
        </div>
        <p className="text-metin">
          Teşekkürler! Yorumun alındı. Onaylandıktan sonra sitede yayınlanacak.
        </p>
        <Link
          href="/"
          className="text-sm font-medium text-pembe-koyu hover:underline"
        >
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const active = hover || rating;

  return (
    <div className="flex flex-col gap-5">
      {customerName && (
        <p className="text-metin-orta">
          Merhaba <span className="font-semibold text-metin">{customerName}</span>! 🧇
        </p>
      )}

      {/* Yıldız puanı */}
      <div>
        <label className="text-sm font-medium text-metin">Puanın</label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              aria-label={`${n} yıldız`}
              className="text-4xl leading-none transition-transform hover:scale-110"
            >
              <span className={active >= n ? "text-altin" : "text-metin-orta/25"}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Yorum */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="yorum" className="text-sm font-medium text-metin">
          Yorumun <span className="font-normal text-metin-orta">(opsiyonel)</span>
        </label>
        <textarea
          id="yorum"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
          rows={4}
          placeholder="Lezzet nasıldı? Bizimle paylaş…"
          className="w-full resize-none rounded-lg border border-input bg-white p-3 text-sm text-metin outline-none focus:border-pembe focus:ring-2 focus:ring-pembe/20"
        />
        <span className="text-right text-xs text-metin-orta">
          {comment.length}/{COMMENT_MAX}
        </span>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className={cn(buttonVariants(), "h-12 w-full text-base")}
      >
        {isPending ? "Gönderiliyor…" : "Yorumu Gönder"}
      </button>
    </div>
  );
}
