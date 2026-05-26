"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Çıkış: oturum cookie'lerini SUNUCUDA temizler (tarayıcı JS'ine bağımlı değil).
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// Form sonucu: hata varsa error, kayıt başarılıysa success mesajı taşır.
export type AuthState = {
  error?: string;
  success?: string;
};

// Supabase'in İngilizce hata mesajlarını anlaşılır Türkçeye çevirir.
function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "E-posta veya şifre hatalı.";
  if (m.includes("email not confirmed"))
    return "E-postanı henüz doğrulamadın. Gelen kutunu kontrol et.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.";
  if (m.includes("password should be at least"))
    return "Şifre en az 6 karakter olmalı.";
  if (m.includes("invalid email") || m.includes("unable to validate email"))
    return "Geçerli bir e-posta adresi gir.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Çok fazla deneme yaptın. Lütfen biraz sonra tekrar dene.";
  return "Bir şeyler ters gitti. Lütfen tekrar dene.";
}

// E-posta + şifre ile giriş. Başarılıysa ana sayfaya yönlendirir.
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunlu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// Yeni hesap oluşturur. E-posta doğrulaması açık olduğu için
// kullanıcı henüz giriş yapmaz; doğrulama maili gönderilir.
export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Ad Soyad, e-posta ve şifre zorunlu." };
  }
  if (password.length < 6) {
    return { error: "Şifre en az 6 karakter olmalı." };
  }

  // Doğrulama mailindeki bağlantının geri döneceği adres.
  const origin = (await headers()).get("origin") ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone: phone || null },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  return {
    success:
      "Hesabın oluşturuldu! E-postana bir doğrulama bağlantısı gönderdik. Bağlantıya tıklayıp hesabını onayladıktan sonra giriş yapabilirsin.",
  };
}
