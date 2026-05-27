import type { OrderStatus } from "@/types/db";

// Analitik için gereken sade sipariş şekli (order_items gerekmez; ciro orders.total'dan)
export type AnalyticsOrder = {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  created_at: string;
};

export type TopCustomer = {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number; // iptal hariç
};

export type MonthlyPoint = { month: string; label: string; count: number };

export type Analytics = {
  totalOrders: number;
  cancelledOrders: number;
  totalRevenue: number; // iptal hariç
  todayOrders: number;
  distinctCustomers: number;
  repeatCustomers: number;
  repeatRate: number; // 0..1 (birden fazla sipariş veren müşteri oranı)
  topCustomers: TopCustomer[];
  monthly: MonthlyPoint[]; // son 12 ay, kronolojik
};

const TZ = "Europe/Istanbul";
const TR_MONTHS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

// "YYYY-MM-DD" — İstanbul saatine göre (sunucu UTC olsa bile doğru)
function istanbulDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TZ });
}

// Son 12 ayın anahtarlarını (kronolojik) üretir, eksik ayları 0 ile doldurur
function buildLast12Months(monthCounts: Map<string, number>): MonthlyPoint[] {
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  let year = Number(todayKey.slice(0, 4));
  let month = Number(todayKey.slice(5, 7)); // 1..12

  const points: MonthlyPoint[] = [];
  for (let i = 0; i < 12; i++) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    points.unshift({
      month: key,
      label: `${TR_MONTHS[month - 1]} ${String(year).slice(2)}`,
      count: monthCounts.get(key) ?? 0,
    });
    month -= 1;
    if (month === 0) {
      month = 12;
      year -= 1;
    }
  }
  return points;
}

export function computeAnalytics(orders: AnalyticsOrder[]): Analytics {
  const todayKey = new Date().toLocaleDateString("en-CA", { timeZone: TZ });

  let totalRevenue = 0;
  let cancelledOrders = 0;
  let todayOrders = 0;

  const byCustomer = new Map<string, TopCustomer>();
  const monthCounts = new Map<string, number>();

  for (const o of orders) {
    const cancelled = o.status === "cancelled";
    if (cancelled) cancelledOrders += 1;
    if (!cancelled) totalRevenue += Number(o.total) || 0;

    if (istanbulDateKey(o.created_at) === todayKey) todayOrders += 1;

    // Aylık (tüm siparişler)
    const monthKey = istanbulDateKey(o.created_at).slice(0, 7); // YYYY-MM
    monthCounts.set(monthKey, (monthCounts.get(monthKey) ?? 0) + 1);

    // Müşteri grubu — kimlik telefon
    const phone = (o.customer_phone ?? "").trim();
    if (phone) {
      const c = byCustomer.get(phone) ?? {
        phone,
        name: o.customer_name?.trim() || "—",
        orderCount: 0,
        totalSpent: 0,
      };
      c.orderCount += 1;
      if (!cancelled) c.totalSpent += Number(o.total) || 0;
      if (o.customer_name?.trim()) c.name = o.customer_name.trim();
      byCustomer.set(phone, c);
    }
  }

  const customers = [...byCustomer.values()];
  const distinctCustomers = customers.length;
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const repeatRate =
    distinctCustomers > 0 ? repeatCustomers / distinctCustomers : 0;

  const topCustomers = [...customers]
    .sort((a, b) => b.orderCount - a.orderCount || b.totalSpent - a.totalSpent)
    .slice(0, 10);

  return {
    totalOrders: orders.length,
    cancelledOrders,
    totalRevenue,
    todayOrders,
    distinctCustomers,
    repeatCustomers,
    repeatRate,
    topCustomers,
    monthly: buildLast12Months(monthCounts),
  };
}
