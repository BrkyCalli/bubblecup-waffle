import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "İade Politikası | BUBBLECUP WAFFLE",
  description:
    "BUBBLECUP WAFFLE iade ve sipariş iptali koşulları. Aydın Efeler waffle siparişleri için iade politikası.",
};

export default function IadePolitikasiPage() {
  return (
    <LegalLayout title="İade Politikası" lastUpdated="26 Mayıs 2026">
      <p>
        BUBBLECUP WAFFLE olarak müşteri memnuniyeti bizim için önceliklidir.
        Ürünlerimiz taze gıda maddesi olduğundan, iade koşulları aşağıda
        açıklanmıştır.
      </p>

      <h2>1. Gıda Ürünlerinde İade</h2>
      <p>
        Wafflelerimiz siparişe özel ve taze hazırlanan gıda ürünleridir. Bu
        nedenle, teslim edilmiş ve hazırlanmış ürünlerde, sağlık ve hijyen
        kuralları gereği iade kabul edilememektedir.
      </p>

      <h2>2. Sipariş İptali</h2>
      <p>
        Siparişinizi, hazırlık aşamasına geçilmeden önce{" "}
        <strong>+90 542 400 0524</strong> numaralı WhatsApp hattımızdan bize
        ulaşarak iptal edebilirsiniz. Hazırlanmaya başlanan siparişler iptal
        edilemez.
      </p>

      <h2>3. Yanlış veya Eksik Ürün</h2>
      <p>
        Siparişinizde yanlış, eksik veya hasarlı bir ürün olması durumunda,
        teslimattan itibaren mümkün olan en kısa sürede bizimle iletişime geçin.
        Bu gibi durumlarda ürünü ücretsiz olarak yeniden hazırlayıp gönderir ya
        da bedelini iade ederiz.
      </p>
      <ul>
        <li>Yanlış ürün gönderimi</li>
        <li>Eksik ürün veya seçim (çikolata/draje)</li>
        <li>Teslimat sırasında hasar görmüş ürün</li>
      </ul>

      <h2>4. İade ve Ücret İadesi Süreci</h2>
      <p>
        Onaylanan iade taleplerinde, ödeme yönteminize göre ücret iadesi makul
        süre içinde gerçekleştirilir. Süreç boyunca WhatsApp üzerinden
        bilgilendirilirsiniz.
      </p>

      <h2>5. İletişim</h2>
      <p>
        İade ve iptal talepleriniz için: <strong>+90 542 400 0524</strong>{" "}
        (telefon / WhatsApp) veya <strong>berkaycalli96@gmail.com</strong>.
      </p>
    </LegalLayout>
  );
}
