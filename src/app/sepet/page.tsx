import type { Metadata } from "next";
import { createClient, getUser } from "@/lib/supabase/server";
import { CartClient } from "@/components/sections/CartClient";

export const metadata: Metadata = {
  title: "Sepetim | BUBBLECUP WAFFLE",
  description:
    "Sepetinizi gözden geçirin ve WhatsApp ile kolayca sipariş verin. Aydın Efeler'de ücretsiz teslimat.",
};

export default async function CartPage() {
  // Giriş yapmış kullanıcının ad/telefonunu profilinden çekip forma ön-dolduralım.
  const user = await getUser();
  let initialName = "";
  let initialPhone = "";

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .single();
    initialName = profile?.full_name ?? "";
    initialPhone = profile?.phone ?? "";
  }
  // Üyenin e-postası hesabından gelir (misafir boş başlar)
  const initialEmail = user?.email ?? "";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="mb-8 font-display text-4xl font-bold text-metin sm:text-5xl">
        Sepetim
      </h1>
      <CartClient
        initialName={initialName}
        initialPhone={initialPhone}
        initialEmail={initialEmail}
      />
    </div>
  );
}
