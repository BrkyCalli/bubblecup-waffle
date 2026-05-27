"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

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

export type ModerateResult = { ok: boolean; error?: string };

// Yorumu onaylar/reddeder. Yalnızca admin (RLS de admin'e kısıtlar).
export async function moderateReview(
  id: string,
  status: "approved" | "rejected",
): Promise<ModerateResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user)) {
    return { ok: false, error: "Bu işlem için yetkiniz yok." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("moderateReview hatası:", error);
    return { ok: false, error: "Yorum güncellenemedi." };
  }

  revalidatePath("/admin/yorumlar");
  revalidatePath("/"); // ana sayfa onaylı yorumları yeniden çeksin
  return { ok: true };
}
