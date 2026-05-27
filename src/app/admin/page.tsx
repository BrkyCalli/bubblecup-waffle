import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/sections/AdminNav";
import { AdminOrders, type AdminOrder } from "@/components/sections/AdminOrders";

export const metadata: Metadata = {
  title: "Admin | BUBBLECUP WAFFLE",
  robots: { index: false, follow: false },
};

// Her ziyarette taze veri (sipariş listesi anlık olmalı)
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/giris");
  if (!isAdmin(user)) redirect("/");

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, total, notes, whatsapp_sent, created_at, customer_name, customer_phone, delivery_address, delivery_unit, order_items(id, product_id, quantity, unit_price, customizations, products(name))",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  // Supabase istemcisi tipsiz; iç içe "products" embed'ini dizi olarak çıkarsıyor
  // ama tekil ilişki (order_items → products) çalışma anında tek nesne döndürür.
  // Bu yüzden unknown üzerinden beklenen şekle dönüştürüyoruz.
  const orders = (data ?? []) as unknown as AdminOrder[];

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-metin">Siparişler</h1>
      <p className="mt-2 text-metin-orta">
        Toplam {orders.length} sipariş
        {pendingCount > 0 && (
          <span className="ml-2 inline-flex items-center rounded-full bg-altin/15 px-2.5 py-0.5 text-sm font-semibold text-altin-koyu">
            {pendingCount} yeni
          </span>
        )}
      </p>

      <div className="mt-6">
        <AdminNav active="siparisler" />
      </div>

      <AdminOrders orders={orders} />
    </div>
  );
}
