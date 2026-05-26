import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { AuthShell } from "@/components/sections/AuthShell";
import { RegisterForm } from "@/components/sections/RegisterForm";

export const metadata: Metadata = {
  title: "Kayıt Ol | BUBBLECUP WAFFLE",
  description: "BUBBLECUP WAFFLE'da ücretsiz hesap oluştur.",
};

export default async function KayitPage() {
  // Zaten giriş yapmışsa ana sayfaya gönder.
  const user = await getUser();
  if (user) redirect("/");

  return (
    <AuthShell
      title="Aramıza katıl 🧇"
      subtitle="Hesap oluştur, siparişlerini takip et."
      footer={
        <>
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="font-medium text-pembe-koyu hover:underline"
          >
            Giriş yap
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
