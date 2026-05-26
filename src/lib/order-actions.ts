"use server";

import { createClient } from "@/lib/supabase/server";
import type { PersonSelection } from "@/types";

export type OrderItemInput = {
  productId: string;
  quantity: number;
  selections: PersonSelection[];
};

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

// Sepeti veritabanına kaydeder. Fiyatlar ve toplam, güvenlik için
// veritabanındaki create_order fonksiyonu tarafından (products tablosundan)
// hesaplanır — client'tan gelen fiyatlara güvenilmez.
export async function createOrder(
  items: OrderItemInput[],
  note: string,
): Promise<CreateOrderResult> {
  if (!items || items.length === 0) {
    return { ok: false, error: "Sepetiniz boş görünüyor." };
  }

  // create_order fonksiyonunun beklediği biçim
  const payload = items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
    customizations: item.selections ?? [],
  }));

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_items: payload,
    p_note: note,
  });

  if (error || !data) {
    // Gerçek hatayı sunucu log'una yaz (kullanıcıya genel mesaj gösterilir).
    console.error("createOrder RPC hatası:", error);
    return {
      ok: false,
      error: "Sipariş kaydedilemedi. Lütfen birazdan tekrar deneyin.",
    };
  }

  // create_order, oluşturulan siparişin uuid'sini döndürür
  return { ok: true, orderId: data as string };
}
