import type { Metadata } from "next";
import { LegalLayout } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | BUBBLECUP WAFFLE",
  description:
    "BUBBLECUP WAFFLE kişisel verilerin korunması (KVKK) aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" lastUpdated="26 Mayıs 2026">
      <p>
        İşbu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
        (&quot;KVKK&quot;) kapsamında, <strong>BUBBLECUP WAFFLE</strong>{" "}
        (&quot;İşletme&quot;) tarafından veri sorumlusu sıfatıyla
        hazırlanmıştır. Amacımız, kişisel verilerinizin hangi amaçlarla
        işlendiği konusunda sizi bilgilendirmektir.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        Kişisel verileriniz, veri sorumlusu olarak BUBBLECUP WAFFLE tarafından
        aşağıda açıklanan kapsamda işlenebilecektir.
      </p>
      <ul>
        <li>
          <strong>İşletme:</strong> BUBBLECUP WAFFLE
        </li>
        <li>
          <strong>Adres:</strong> Orta Mahalle, Doğugazi Bulvarı No:114D, Efeler
          / Aydın
        </li>
        <li>
          <strong>Telefon:</strong> +90 542 400 0524
        </li>
        <li>
          <strong>E-posta:</strong> berkaycalli96@gmail.com
        </li>
      </ul>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <p>
        Sipariş ve iletişim süreçlerinde aşağıdaki kişisel verileriniz
        işlenebilir:
      </p>
      <ul>
        <li>Kimlik bilgileri (ad, soyad)</li>
        <li>İletişim bilgileri (telefon numarası, teslimat adresi)</li>
        <li>Sipariş bilgileri (ürün tercihleri, sipariş notu)</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Siparişlerinizin alınması, hazırlanması ve teslim edilmesi</li>
        <li>WhatsApp üzerinden sipariş ve iletişim taleplerinin yönetilmesi</li>
        <li>Müşteri memnuniyetinin sağlanması ve taleplerin yanıtlanması</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi</li>
      </ul>

      <h2>4. Kişisel Verilerin Aktarılması</h2>
      <p>
        Kişisel verileriniz, yalnızca siparişinizin teslimi ve yasal
        yükümlülüklerin yerine getirilmesi amacıyla, gerekli olduğu ölçüde ve
        ilgili mevzuata uygun olarak üçüncü taraflarla (ör. teslimat
        görevlileri, yetkili kamu kurumları) paylaşılabilir.
      </p>

      <h2>5. KVKK Kapsamındaki Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi uyarınca; kişisel verilerinizin işlenip
        işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme
        amacını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme,
        silinmesini veya yok edilmesini talep etme haklarına sahipsiniz.
      </p>

      <h2>6. İletişim</h2>
      <p>
        Haklarınıza ilişkin taleplerinizi <strong>+90 542 400 0524</strong>{" "}
        numaralı telefon veya <strong>berkaycalli96@gmail.com</strong> e-posta
        adresi üzerinden bize iletebilirsiniz.
      </p>
    </LegalLayout>
  );
}
