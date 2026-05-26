import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { AuthShell } from "@/components/sections/AuthShell";
import { LoginForm } from "@/components/sections/LoginForm";

export const metadata: Metadata = {
  title: "Giriş Yap | BUBBLECUP WAFFLE",
  description: "BUBBLECUP WAFFLE hesabına giriş yap.",
};

export default async function GirisPage() {
  // Zaten giriş yapmışsa ana sayfaya gönder.
  const user = await getUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Tekrar hoş geldin 👋"
      subtitle="Hesabına giriş yaparak sipariş geçmişine ulaş."
      footer={
        <>
          Hesabın yok mu?{" "}
          <Link
            href="/kayit"
            className="font-medium text-pembe-koyu hover:underline"
          >
            Hemen kayıt ol
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
