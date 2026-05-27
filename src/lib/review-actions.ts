"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitReviewResult = { ok: boolean; error?: string };

// SQL fonksiyonundan gelen (Türkçe) hata mesajını kullanıcıya uygun hale getirir.
function friendly(message: string): string {
  if (message.includes("Geçersiz bağlantı")) return "Bu yorum bağlantısı geçersiz.";
  if (message.includes("zaten yorum"))
    return "Bu sipariş için zaten bir yorum bırakılmış.";
  if (message.includes("Puan")) return "Lütfen 1-5 arası bir puan seçin.";
  return "Yorum gönderilemedi. Lütfen tekrar deneyin.";
}

// Müşteri yorumunu token ile gönderir (giriş gerektirmez — token kimliktir).
export async function submitReview(
  token: string,
  rating: number,
  comment: string,
): Promise<SubmitReviewResult> {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Lütfen 1-5 arası bir puan seçin." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_review", {
    p_token: token,
    p_rating: rating,
    p_comment: comment,
  });

  if (error) {
    console.error("submitReview hatası:", error);
    return { ok: false, error: friendly(error.message) };
  }

  return { ok: true };
}
