import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// E-posta doğrulama (ve ileride Google OAuth) bağlantısı buraya döner.
// URL'deki "code" parametresini geçerli bir oturuma (session) çevirir.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Kod yok ya da geçersiz → giriş sayfasına hata bilgisiyle dön.
  return NextResponse.redirect(`${origin}/giris?dogrulama=hata`);
}
