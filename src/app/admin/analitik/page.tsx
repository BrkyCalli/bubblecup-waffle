import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { computeAnalytics, type AnalyticsOrder } from "@/lib/analytics";
import { formatPrice } from "@/lib/whatsapp";
import { AdminNav } from "@/components/sections/AdminNav";
import { MonthlyOrdersChart } from "@/components/sections/MonthlyOrdersChart";

export const metadata: Metadata = {
  title: "Analitik | BUBBLECUP WAFFLE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-pembe/15 bg-white p-5 shadow-sm">
      <div className="text-2xl" aria-hidden="true">
        {icon}
      </div>
      <p className="mt-2 text-sm text-metin-orta">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-metin">{value}</p>
      {hint && <p className="mt-1 text-xs text-metin-orta">{hint}</p>}
    </div>
  );
}

export default async function AnalitikPage() {
  const user = await getUser();
  if (!user) redirect("/giris");
  if (!isAdmin(user)) redirect("/");

  const supabase = await createClient();
  // Analitik için tüm siparişler (Supabase varsayılan üst sınırı 1000 satır —
  // ileride sipariş çok artarsa sunucu tarafı toplama / sayfalama gerekir).
  const { data } = await supabase
    .from("orders")
    .select("id, user_id, status, total, customer_name, customer_phone, created_at");

  const orders = (data ?? []) as AnalyticsOrder[];
  const a = computeAnalytics(orders);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-metin">Analitik</h1>
      <p className="mt-2 text-metin-orta">İşletmenin genel görünümü</p>

      <div className="mt-6">
        <AdminNav active="analitik" />
      </div>

      {/* Özet kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon="📦"
          label="Toplam Sipariş"
          value={String(a.totalOrders)}
          hint={a.cancelledOrders > 0 ? `${a.cancelledOrders} iptal` : undefined}
        />
        <StatCard
          icon="💰"
          label="Toplam Ciro"
          value={formatPrice(a.totalRevenue)}
          hint="iptal hariç"
        />
        <StatCard
          icon="📅"
          label="Bugünkü Siparişler"
          value={String(a.todayOrders)}
        />
        <StatCard
          icon="🔁"
          label="Tekrar Sipariş Oranı"
          value={`%${Math.round(a.repeatRate * 100)}`}
          hint={`${a.repeatCustomers}/${a.distinctCustomers} müşteri tekrar etti`}
        />
      </div>

      {/* Aylık grafik */}
      <section className="mt-8 rounded-2xl border border-pembe/15 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl font-semibold text-metin">
          Aylık Sipariş Grafiği
        </h2>
        <MonthlyOrdersChart data={a.monthly} />
      </section>

      {/* En çok sipariş veren müşteriler */}
      <section className="mt-8 rounded-2xl border border-pembe/15 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-display text-xl font-semibold text-metin">
          En Çok Sipariş Veren 10 Müşteri
        </h2>
        {a.topCustomers.length === 0 ? (
          <p className="py-4 text-sm text-metin-orta">Henüz müşteri verisi yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pembe/10 text-left text-metin-orta">
                  <th className="py-2 pr-2 font-medium">#</th>
                  <th className="py-2 pr-2 font-medium">Müşteri</th>
                  <th className="py-2 pr-2 font-medium">Telefon</th>
                  <th className="py-2 pr-2 text-right font-medium">Sipariş</th>
                  <th className="py-2 text-right font-medium">Harcama</th>
                </tr>
              </thead>
              <tbody>
                {a.topCustomers.map((c, i) => (
                  <tr key={c.phone} className="border-b border-pembe/5">
                    <td className="py-2 pr-2 text-metin-orta">{i + 1}</td>
                    <td className="py-2 pr-2 font-medium text-metin">{c.name}</td>
                    <td className="py-2 pr-2 text-metin-orta">{c.phone}</td>
                    <td className="py-2 pr-2 text-right font-semibold text-metin">
                      {c.orderCount}
                    </td>
                    <td className="py-2 text-right text-pembe-koyu">
                      {formatPrice(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
