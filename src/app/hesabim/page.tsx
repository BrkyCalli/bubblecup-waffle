import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { AccountProfile } from "@/components/sections/AccountProfile";
import { OrderHistory, type HistoryOrder } from "@/components/sections/OrderHistory";

export const metadata: Metadata = {
  title: "Hesabım | BUBBLECUP WAFFLE",
  robots: { index: false, follow: false },
};

// Kişiye özel veri → her zaman taze
export const dynamic = "force-dynamic";

export default async function HesabimPage() {
  const user = await getUser();
  if (!user) redirect("/giris");

  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .single();

  const { data: ordersData } = await supabase
    .from("orders")
    .select(
      "id, status, total, notes, created_at, order_items(id, product_id, quantity, unit_price, customizations, products(name))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Supabase tipsiz; tekil "products" embed'i çalışma anında tek nesne döner.
  const orders = (ordersData ?? []) as unknown as HistoryOrder[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-metin">Hesabım</h1>

      <div className="mt-8 space-y-10">
        <AccountProfile
          email={user.email ?? ""}
          initialName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
        />

        <section>
          <h2 className="font-display text-2xl font-semibold text-metin">
            Siparişlerim
          </h2>
          <div className="mt-4">
            <OrderHistory orders={orders} />
          </div>
        </section>
      </div>
    </div>
  );
}
