import type { CartItem, CustomerInfo } from "@/types";
import { formatTurkishPhone } from "@/lib/validation";

// Uluslararası formatta, başında + olmadan (wa.me bunu ister)
export const WHATSAPP_NUMBER = "905424000524";

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("tr-TR")} ₺`;
}

/** Sepetteki ürünlerden WhatsApp sipariş mesajı metni üretir. */
export function buildOrderMessage(
  items: CartItem[],
  total: number,
  note?: string,
  customer?: CustomerInfo,
): string {
  const lines: string[] = ["Merhaba! Sipariş vermek istiyorum 🧇", ""];

  items.forEach((item) => {
    const lineTotal = item.product.price * item.quantity;
    lines.push(
      `${item.product.name} x${item.quantity} - ${lineTotal.toLocaleString("tr-TR")}₺`,
    );

    (item.selections ?? []).forEach((person, index) => {
      let detail = `  • ${index + 1}. Kişi → Çikolata: ${person.cikolatalar.join(", ")}`;
      if (person.drajeler.length > 0) {
        detail += ` | Draje: ${person.drajeler.join(", ")}`;
      }
      lines.push(detail);
    });

    lines.push("");
  });

  // Müşteri / teslimat bilgileri
  if (customer) {
    let address = customer.address.trim();
    if (customer.unit.trim()) {
      address += ` (Daire/Kapı: ${customer.unit.trim()})`;
    }
    lines.push(
      `👤 Ad: ${customer.name.trim()}`,
      `📞 Telefon: ${formatTurkishPhone(customer.phone)}`,
      `📍 Adres: ${address}`,
      "",
    );
  }

  const trimmedNote = note?.trim();
  if (trimmedNote) {
    lines.push(`📝 Not: ${trimmedNote}`);
  }

  lines.push(
    "🚚 Teslimat: Ücretsiz",
    `💰 Toplam: ${total.toLocaleString("tr-TR")}₺`,
  );

  return lines.join("\n");
}

/** Sepetten doğrudan sipariş için tıklanabilir wa.me linki üretir. */
export function buildOrderUrl(
  items: CartItem[],
  total: number,
  note?: string,
  customer?: CustomerInfo,
): string {
  const message = buildOrderMessage(items, total, note, customer);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Genel amaçlı (serbest metinli) WhatsApp linki üretir. */
export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
