"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeTurkishPhone, formatTurkishPhone } from "@/lib/validation";

export type ProfileState = {
  error?: string;
  success?: string;
};

// Kullanıcının kendi profil bilgilerini günceller (RLS yalnızca kendi satırına izin verir).
export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    return { error: "Ad Soyad boş olamaz." };
  }

  let phone: string | null = null;
  if (phoneRaw) {
    if (!normalizeTurkishPhone(phoneRaw)) {
      return { error: "Geçerli bir telefon numarası girin (05XX XXX XX XX)." };
    }
    phone = formatTurkishPhone(phoneRaw);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Oturum bulunamadı. Lütfen tekrar giriş yapın." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone })
    .eq("id", user.id);

  if (error) {
    console.error("updateProfile hatası:", error);
    return { error: "Bilgiler güncellenemedi. Lütfen tekrar deneyin." };
  }

  revalidatePath("/hesabim");
  return { success: "Bilgilerin güncellendi." };
}
