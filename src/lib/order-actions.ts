"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import {
  normalizeTurkishPhone,
  formatTurkishPhone,
  isValidEmail,
} from "@/lib/validation";
import type { PersonSelection, CustomerInfo } from "@/types";
import type { OrderStatus } from "@/types/db";

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
  customer: CustomerInfo,
): Promise<CreateOrderResult> {
  if (!items || items.length === 0) {
    return { ok: false, error: "Sepetiniz boş görünüyor." };
  }

  // Müşteri bilgilerini sunucuda doğrula (client'a güvenme)
  const name = customer.name?.trim() ?? "";
  const email = customer.email?.trim() ?? "";
  const address = customer.address?.trim() ?? "";
  if (!name) {
    return { ok: false, error: "Ad Soyad zorunlu." };
  }
  if (!normalizeTurkishPhone(customer.phone ?? "")) {
    return {
      ok: false,
      error: "Geçerli bir telefon numarası girin (05XX XXX XX XX).",
    };
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: "Geçerli bir e-posta adresi girin." };
  }
  if (!address) {
    return { ok: false, error: "Teslimat adresi zorunlu." };
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
    p_customer_name: name,
    p_customer_phone: formatTurkishPhone(customer.phone),
    p_delivery_address: address,
    p_delivery_unit: customer.unit?.trim() ?? "",
    p_customer_email: email,
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

export type UpdateStatusResult = { ok: boolean; error?: string };

// Sipariş durumunu günceller. Yalnızca admin çağırabilir (RLS de admin'e kısıtlar).
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<UpdateStatusResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user)) {
    return { ok: false, error: "Bu işlem için yetkiniz yok." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("updateOrderStatus hatası:", error);
    return { ok: false, error: "Durum güncellenemedi." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
