"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/lib/order-actions";
import { formatPrice } from "@/lib/whatsapp";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  NEXT_STATUS,
  type OrderStatus,
} from "@/types/db";
import type { PersonSelection } from "@/types";

export type AdminOrderItem = {
  id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  customizations: PersonSelection[];
  products: { name: string } | null;
};

export type AdminOrder = {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total: number;
  notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_address: string | null;
  delivery_unit: string | null;
  order_items: AdminOrderItem[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminOrders({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function changeStatus(orderId: string, status: OrderStatus) {
    setError(null);
    setUpdatingId(orderId);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (!res.ok) setError(res.error ?? "Bir hata oluştu.");
      else router.refresh();
      setUpdatingId(null);
    });
  }

  if (orders.length === 0) {
    return (
      <p className="rounded-2xl border border-pembe/15 bg-white py-16 text-center text-metin-orta shadow-sm">
        Henüz sipariş yok.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {orders.map((order) => {
        const next = NEXT_STATUS[order.status];
        const closed =
          order.status === "delivered" || order.status === "cancelled";
        const busy = isPending && updatingId === order.id;

        return (
          <div
            key={order.id}
            className="rounded-2xl border border-pembe/15 bg-white p-5 shadow-sm"
          >
            {/* Üst satır: kimlik + durum */}
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

            {/* Müşteri / teslimat */}
            <div className="mt-2 space-y-0.5 text-sm text-metin-orta">
              <p>
                👤 {order.customer_name || "—"}
                {order.user_id && (
                  <span className="ml-2 rounded-full bg-pembe/10 px-2 py-0.5 text-xs font-semibold text-pembe-koyu">
                    Üye
                  </span>
                )}
              </p>
              {order.customer_phone && (
                <p>
                  📞{" "}
                  <a
                    href={`tel:${order.customer_phone.replace(/\s/g, "")}`}
                    className="hover:text-pembe-koyu"
                  >
                    {order.customer_phone}
                  </a>
                </p>
              )}
              {order.delivery_address && (
                <p>
                  📍 {order.delivery_address}
                  {order.delivery_unit && ` (Daire/Kapı: ${order.delivery_unit})`}
                </p>
              )}
            </div>

            {/* Ürünler */}
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
                      {order.order_items.length > 0 &&
                        item.customizations.length > 1 &&
                        `${i + 1}. Kişi → `}
                      Çikolata: {person.cikolatalar.join(", ")}
                      {person.drajeler.length > 0 &&
                        ` · Draje: ${person.drajeler.join(", ")}`}
                    </p>
                  ))}
                </li>
              ))}
            </ul>

            {/* Not */}
            {order.notes && (
              <p className="mt-3 rounded-lg bg-krem/70 px-3 py-2 text-sm text-metin">
                📝 {order.notes}
              </p>
            )}

            {/* Alt satır: toplam + aksiyonlar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-pembe/10 pt-3">
              <span className="font-display text-lg font-bold text-pembe-koyu">
                Toplam: {formatPrice(order.total)}
              </span>

              <div className="flex flex-wrap gap-2">
                {next && (
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, next)}
                    disabled={busy}
                    className="rounded-full bg-pembe px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pembe-koyu disabled:opacity-50"
                  >
                    {busy ? "…" : `${ORDER_STATUS_LABELS[next]} yap`}
                  </button>
                )}
                {!closed && (
                  <button
                    type="button"
                    onClick={() => changeStatus(order.id, "cancelled")}
                    disabled={busy}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    İptal
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
