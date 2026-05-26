import Link from "next/link";
import { formatPrice } from "@/lib/whatsapp";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  type OrderStatus,
} from "@/types/db";
import type { PersonSelection } from "@/types";

export type HistoryOrderItem = {
  id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  customizations: PersonSelection[];
  products: { name: string } | null;
};

export type HistoryOrder = {
  id: string;
  status: OrderStatus;
  total: number;
  notes: string | null;
  created_at: string;
  order_items: HistoryOrderItem[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderHistory({ orders }: { orders: HistoryOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-pembe/15 bg-white py-12 text-center shadow-sm">
        <p className="text-metin-orta">Henüz siparişin yok.</p>
        <Link
          href="/menu"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-pembe px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pembe-koyu"
        >
          Menüye Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-2xl border border-pembe/15 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-display font-semibold text-metin">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className="ml-3 text-sm text-metin-orta">
                {formatDate(order.created_at)}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${ORDER_STATUS_STYLES[order.status]}`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <ul className="mt-3 space-y-2 border-t border-pembe/10 pt-3">
            {order.order_items.map((item) => (
              <li key={item.id} className="text-sm">
                <div className="flex justify-between font-medium text-metin">
                  <span>
                    {item.products?.name ?? item.product_id ?? "Ürün"} ×
                    {item.quantity}
                  </span>
                  <span>{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
                {(item.customizations ?? []).map((person, i) => (
                  <p key={i} className="pl-3 text-xs text-metin-orta">
                    {item.customizations.length > 1 && `${i + 1}. Kişi → `}
                    Çikolata: {person.cikolatalar.join(", ")}
                    {person.drajeler.length > 0 &&
                      ` · Draje: ${person.drajeler.join(", ")}`}
                  </p>
                ))}
              </li>
            ))}
          </ul>

          {order.notes && (
            <p className="mt-3 rounded-lg bg-krem/70 px-3 py-2 text-sm text-metin">
              📝 {order.notes}
            </p>
          )}

          <div className="mt-3 flex justify-end border-t border-pembe/10 pt-3">
            <span className="font-display text-lg font-bold text-pembe-koyu">
              Toplam: {formatPrice(order.total)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
