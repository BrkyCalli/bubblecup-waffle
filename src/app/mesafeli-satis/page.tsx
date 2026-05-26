import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi | BUBBLECUP WAFFLE",
  description:
    "BUBBLECUP WAFFLE mesafeli satış sözleşmesi: taraflar, ürün, ödeme, teslimat ve cayma hakkı koşulları.",
};

export default function MesafeliSatisPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi" lastUpdated="26 Mayıs 2026">
      <h2>1. Taraflar</h2>
      <p>
        İşbu sözleşme, aşağıda bilgileri yer alan satıcı ile sipariş veren alıcı
        arasında, aşağıdaki şartlar dahilinde elektronik ortamda kurulmuştur.
      </p>
      <ul>
        <li>
          <strong>Satıcı:</strong> BUBBLECUP WAFFLE
        </li>
        <li>
          <strong>Adres:</strong> Orta Mahalle, Doğugazi Bulvarı No:114D, Efeler
          / Aydın
        </li>
        <li>
          <strong>Telefon:</strong> +90 542 400 0524
        </li>
        <li>
          <strong>Alıcı:</strong> Siparişi veren ve iletişim/teslimat
          bilgilerini paylaşan müşteri.
        </li>
      </ul>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>
        İşbu sözleşmenin konusu, alıcının BUBBLECUP WAFFLE&apos;dan elektronik
        ortamda (WhatsApp) sipariş ettiği, nitelikleri ve satış fiyatı menüde
        belirtilen ürünlerin satışı ve teslimi ile ilgili tarafların hak ve
        yükümlülüklerinin belirlenmesidir.
      </p>

      <h2>3. Ürün Bilgileri</h2>
      <p>
        Ürünlerin türü, miktarı, kişiye özel seçimleri (çikolata, draje vb.) ve
        satış bedeli, sipariş anında menüde ve sepet özetinde belirtildiği
        gibidir. Tüm fiyatlara KDV dahildir ve fiyatlar Türk Lirası (₺)
        cinsindendir.
      </p>

      <h2>4. Ödeme</h2>
      <p>
        Sipariş bedeli, teslimat sırasında nakit veya işletmenin sunduğu ödeme
        yöntemleriyle tahsil edilir. Online kart ile ödeme seçeneği ileride
        hizmete sunulacaktır.
      </p>

      <h2>5. Teslimat</h2>
      <p>
        Ürünler, Aydın Efeler bölgesi içinde, sipariş onayını takiben tahmini
        olarak 30 dakika içinde teslim edilmeye çalışılır. Teslimat ücretsizdir.
        Yoğunluk ve hava koşullarına bağlı olarak teslimat süresi
        değişebilir.
      </p>

      <h2>6. Cayma Hakkı</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği uyarınca, çabuk bozulabilen veya son
        kullanma tarihi geçebilecek gıda ürünleri ile müşteri talebine göre özel
        olarak hazırlanan ürünlerde cayma hakkı bulunmamaktadır. Wafflelerimiz
        siparişe özel ve taze hazırlandığından bu istisna kapsamındadır.
      </p>

      <h2>7. Uyuşmazlıkların Çözümü</h2>
      <p>
        İşbu sözleşmeden doğabilecek uyuşmazlıklarda, ilgili mevzuatta belirtilen
        parasal sınırlar dahilinde Tüketici Hakem Heyetleri ve Tüketici
        Mahkemeleri yetkilidir.
      </p>
    </LegalLayout>
  );
}
