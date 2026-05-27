"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { buildOrderUrl, formatPrice } from "@/lib/whatsapp";
import { createOrder, type OrderItemInput } from "@/lib/order-actions";
import { isValidTurkishPhone, isValidEmail } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import type { PersonSelection, CustomerInfo } from "@/types";
import { ProductImage } from "./ProductImage";
import { WhatsAppIcon } from "@/components/layout/WhatsAppIcon";

const NOTE_MAX = 200;

function SelectionSummary({
  selections,
  multiPerson,
}: {
  selections?: PersonSelection[];
  multiPerson: boolean;
}) {
  const list = selections ?? [];
  if (list.length === 0) return null;

  return (
    <ul className="mt-2 space-y-1 text-xs text-metin-orta">
      {list.map((person, index) => (
        <li key={index}>
          {multiPerson && (
            <span className="font-semibold text-metin">
              {index + 1}. Kişi →{" "}
            </span>
          )}
          <span>Çikolata: {person.cikolatalar.join(", ")}</span>
          {person.drajeler.length > 0 && (
            <span> · Draje: {person.drajeler.join(", ")}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CartClient({
  initialName,
  initialPhone,
  initialEmail,
}: {
  initialName: string;
  initialPhone: string;
  initialEmail: string;
}) {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [note, setNote] = useState("");
  const [mounted, setMounted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placedUrl, setPlacedUrl] = useState("");

  // Müşteri / teslimat bilgileri (üye ise ad + telefon profilden ön-dolu)
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState("");
  const [unit, setUnit] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // localStorage'dan sepet okunana kadar bekle (boş ekranın yanıp sönmesini önler)
  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleOrder() {
    setError(null);
    setFormError(null);

    // Müşteri bilgilerini doğrula (WhatsApp sekmesini açmadan önce)
    if (!name.trim()) {
      setFormError("Lütfen ad soyad girin.");
      return;
    }
    if (!isValidTurkishPhone(phone)) {
      setFormError("Geçerli bir telefon numarası girin (05XX XXX XX XX).");
      return;
    }
    if (!isValidEmail(email)) {
      setFormError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (!address.trim()) {
      setFormError("Lütfen teslimat adresini girin.");
      return;
    }

    setPlacing(true);

    const customer: CustomerInfo = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      unit: unit.trim(),
    };

    // Popup engelleyiciyi aşmak için boş sekmeyi tık anında aç,
    // siparişi kaydettikten sonra adresini WhatsApp'a çevir.
    const waWindow = window.open("", "_blank");
    const url = buildOrderUrl(items, total, note, customer);

    const payload: OrderItemInput[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selections: item.selections ?? [],
    }));

    const result = await createOrder(payload, note, customer);

    if (!result.ok) {
      waWindow?.close();
      setError(result.error);
      setPlacing(false);
      return;
    }

    if (waWindow) {
      waWindow.location.href = url;
    } else {
      // Sekme açılamadıysa (popup engeli) aynı sekmede aç
      window.location.href = url;
    }

    setPlacedUrl(url);
    setPlacedOrderId(result.orderId);
    clearCart();
    setPlacing(false);
  }

  if (!mounted) {
    return (
      <p className="py-20 text-center text-metin-orta">Sepet yükleniyor…</p>
    );
  }

  // Sipariş kaydedildi → onay ekranı (sepet temizlendiği için bundan önce gelir)
  if (placedOrderId) {
    const shortId = placedOrderId.slice(0, 8).toUpperCase();
    return (
      <div className="flex flex-col items-center rounded-2xl border border-pembe/15 bg-white py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          🎉
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-metin">
          Siparişiniz alındı!
        </h2>
        <p className="mt-3 max-w-md px-6 text-metin-orta">
          Sipariş numaranız{" "}
          <span className="font-semibold text-metin">#{shortId}</span>. Açılan
          WhatsApp penceresinden mesajı göndererek siparişinizi{" "}
          <strong className="text-metin">onaylamayı unutmayın</strong>.
        </p>
        <p className="mt-2 text-sm text-metin-orta">
          WhatsApp açılmadıysa aşağıdaki butona tıklayın.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={placedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1fb855]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp&apos;ı Aç
          </a>
          <Link
            href="/menu"
            className="flex items-center justify-center rounded-full border border-pembe/30 px-6 py-3 text-base font-semibold text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
          >
            Menüye Dön
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-pembe/15 bg-white py-16 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pembe/10 text-pembe">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold text-metin">
          Sepetiniz boş
        </h2>
        <p className="mt-2 text-metin-orta">
          Henüz ürün eklemediniz. Hadi menüye göz atalım!
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-pembe px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-pembe-koyu"
        >
          Menüye Git
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Sol: ürün listesi + not */}
      <div className="lg:col-span-2">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.cartItemId}
              className="flex gap-4 rounded-2xl border border-pembe/15 bg-white p-4 shadow-sm"
            >
              <ProductImage
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-24 shrink-0 rounded-xl"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-metin">
                    {item.product.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem(item.cartItemId)}
                    aria-label={`${item.product.name} ürününü kaldır`}
                    className="text-metin-orta transition-colors hover:text-pembe-koyu"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-metin-orta">
                  {formatPrice(item.product.price)}
                </p>

                <SelectionSummary
                  selections={item.selections}
                  multiPerson={item.product.personCount > 1}
                />

                <div className="mt-auto flex items-center justify-between pt-3">
                  {/* Adet kontrolü */}
                  <div className="flex items-center gap-1 rounded-full border border-pembe/30 p-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity - 1)
                      }
                      aria-label="Adet azalt"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-metin">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartItemId, item.quantity + 1)
                      }
                      aria-label="Adet artır"
                      className="flex h-7 w-7 items-center justify-center rounded-full text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-display font-bold text-pembe-koyu">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Sipariş notu */}
        <div className="mt-6 rounded-2xl border border-pembe/15 bg-white p-5 shadow-sm">
          <label
            htmlFor="siparis-notu"
            className="font-display font-semibold text-metin"
          >
            Sipariş Notu
          </label>
          <p className="mt-1 text-sm text-metin-orta">
            Özel isteğiniz varsa buraya yazabilirsiniz (örn. az şekerli, ekstra
            sos).
          </p>
          <textarea
            id="siparis-notu"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
            maxLength={NOTE_MAX}
            rows={3}
            placeholder="Notunuzu yazın…"
            className="mt-3 w-full resize-none rounded-xl border border-pembe/30 bg-krem/50 p-3 text-sm text-metin outline-none focus:border-pembe focus:ring-2 focus:ring-pembe/20"
          />
          <p className="mt-1 text-right text-xs text-metin-orta">
            {note.length}/{NOTE_MAX}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="mt-4 text-sm font-medium text-metin-orta transition-colors hover:text-pembe-koyu"
        >
          Sepeti Temizle
        </button>
      </div>

      {/* Sağ: teslimat bilgileri + özet */}
      <div className="space-y-6 lg:col-span-1">
        {/* Teslimat bilgileri formu */}
        <div className="rounded-2xl border border-pembe/15 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-metin">
            Teslimat Bilgileri
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="ad-soyad"
                className="text-sm font-medium text-metin"
              >
                Ad Soyad <span className="text-pembe-koyu">*</span>
              </label>
              <Input
                id="ad-soyad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="telefon"
                className="text-sm font-medium text-metin"
              >
                Telefon <span className="text-pembe-koyu">*</span>
              </label>
              <Input
                id="telefon"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="05XX XXX XX XX"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="eposta" className="text-sm font-medium text-metin">
                E-posta <span className="text-pembe-koyu">*</span>
              </label>
              <Input
                id="eposta"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="ornek@eposta.com"
              />
              <span className="text-xs text-metin-orta">
                Siparişin sonrası deneyimini sormak için kullanılır.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="adres" className="text-sm font-medium text-metin">
                Teslimat Adresi <span className="text-pembe-koyu">*</span>
              </label>
              <textarea
                id="adres"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Mahalle, sokak/cadde, no…"
                className="w-full resize-none rounded-lg border border-input bg-white p-3 text-sm text-metin outline-none focus:border-pembe focus:ring-2 focus:ring-pembe/20"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="daire" className="text-sm font-medium text-metin">
                Daire / Kapı No{" "}
                <span className="font-normal text-metin-orta">(opsiyonel)</span>
              </label>
              <Input
                id="daire"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Örn. D:3"
              />
            </div>
          </div>

          {formError && (
            <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </p>
          )}
        </div>

        {/* Sipariş özeti */}
        <div className="rounded-2xl border border-pembe/15 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-metin">
            Sipariş Özeti
          </h2>

          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-altin/15 px-3 py-1 text-sm font-semibold text-altin-koyu">
            🚚 Ücretsiz Teslimat
          </span>

          <div className="mt-4 space-y-2 border-t border-pembe/10 pt-4 text-sm">
            <div className="flex justify-between text-metin-orta">
              <span>Ara Toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-metin-orta">
              <span>Teslimat</span>
              <span className="font-medium text-altin-koyu">Ücretsiz</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between border-t border-pembe/10 pt-4">
            <span className="font-display text-lg font-semibold text-metin">
              Toplam
            </span>
            <span className="font-display text-lg font-bold text-pembe-koyu">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-3 rounded-xl bg-krem/70 px-3 py-2 text-sm text-metin-orta">
            🕐 Tahmini hazırlanma ve teslimat süresi: ~30 dakika
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleOrder}
            disabled={placing}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1fb855] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {placing ? "Sipariş kaydediliyor…" : "WhatsApp ile Sipariş Ver"}
          </button>

          <button
            type="button"
            disabled
            className="mt-3 w-full cursor-not-allowed rounded-full border border-pembe/20 bg-krem/50 px-6 py-3.5 text-base font-semibold text-metin-orta"
          >
            Kart ile Öde (Yakında)
          </button>
        </div>
      </div>
    </div>
  );
}
