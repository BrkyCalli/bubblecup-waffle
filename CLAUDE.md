CLAUDE.md
# Waffle E-Ticaret Sitesi — Proje Anayasası

## 📌 Proje Özeti
Türkiye'de bir waffle işletmesi için tam donanımlı bir e-ticaret sitesi yapıyoruz.
İşletme adı: Belçika Tadında (placeholder — sonra değişebilir).
Hedef pazar: İzmir merkezli, sonra Türkiye geneli.

## 👤 Kullanıcı Profili
- Başlangıç seviyesinde geliştirici (biraz HTML/CSS bilir, JavaScript/React bilmez)
- Türkiye'den, Türkçe konuşan
- macOS kullanıyor (Mac)
- İlk profesyonel projesi

## 🎯 Hedef
Müşterilerin online sipariş verebileceği, WhatsApp ile yönlendirilebileceği,
ileride iyzico/PayTR ile gerçek ödeme alabileceği bir site.

## 🧰 Teknoloji Yığını
- Next.js 15 (App Router, TypeScript strict mode)
- TailwindCSS + shadcn/ui
- Supabase (PostgreSQL database + Auth) — sonradan eklenecek
- iyzico Node.js SDK (Faz 3'te)
- PayTR (alternatif, sonradan)
- Vercel (deploy)

## 🎨 Tasarım — "Bubble Pembe + Krem + Altın" teması
- Pembe (primary):     #F472B6  (canlı bubble pembe — butonlar, vurgular)
- Koyu pembe (hover):  #EC4899  (buton hover, vurgu)
- Krem (background):   #FFF5F7  (sayfa arka planı, açık pembe-krem)
- Altın (accent):      #F59E0B  (kampanya, rozet, yıldız)
- Altın koyu:          #D97706  (altın hover)
- Koyu metin:          #1F1F1F  (başlıklar, koyu yazılar)
- Orta metin:          #6B7280  (açıklamalar)
- Beyaz:               #FFFFFF  (kartlar, temiz alanlar)
- Display font: Fraunces (Google Fonts) — başlıklar
- Body font: DM Sans (Google Fonts) — gövde metni
- Stil: Sıcak, eğlenceli, premium, el yapımı hissi
- Mobile-first responsive

## 📋 Geliştirme Kuralları

### Kod kalitesi
- TypeScript strict mode. `any` kullanma; mecbur kalırsan yorum satırı ile gerekçe yaz.
- Her component için bir dosya, max 200 satır. Aşıyorsa böl.
- Server component default, client component sadece gerektiğinde ('use client').

### Klasör yapısı
src/
  app/                  # Next.js App Router sayfaları
  components/
    ui/                 # shadcn/ui bileşenleri
    layout/             # Header, Footer
    sections/           # Hero, Menu, Reviews vb.
  lib/                  # Yardımcı fonksiyonlar
  types/                # TypeScript tipleri

### Türkçe/SEO
- Tüm kullanıcı yüzü metinleri Türkçe.
- Sayfa başlıkları SEO için optimize: "İzmir Waffle | Belçika Tadında"
- Tüm görsellere `alt` ekle.
- Para birimi: ₺ (Türk Lirası)

### Türkiye'ye özel
- KVKK uyumlu (cookie banner, aydınlatma metni)
- Mesafeli satış sözleşmesi sayfası gerekli
- Adres formatı: İl > İlçe > Mahalle > Sokak > No

## 🚫 ASLA Yapma
- `.env`, `.env.local` dosyalarını commit etme
- API key veya secret hardcode etme
- `npm install -g` ile global paket kurma
- Bana sormadan production'a deploy etme

## ✅ Mutlaka Yap
- Her büyük özellik sonrası commit at (anlamlı mesajla)
- Mobile'de test et (Chrome DevTools responsive mode)
- Yeni paket eklerken neden gerektiğini söyle
- Tehlikeli işlemler için izin iste

## 🗣️ Konuşma Tarzı
- Türkçe konuş benimle
- Teknik terimleri ilk geçtiğinde parantez içinde Türkçe açıklama ekle
  Örnek: "props (component'lara veri geçişi)"
- Çok adımlı işlerde plan moduna geç, onayımı bekle
- Hata çıkarsa beni suçlama — açıkla ve çöz
- Her commit'ten önce yaptığın değişikliği özetle

## 📞 İşletme Bilgileri (placeholder, sonradan değişecek)
- İsim: BUBBLECUP WAFFLE
- Şube 1 - AYDIN: Orta Mahalle,Doğugazi Bulvarı No:114D,Efeler (12:00-03:00)
- Telefon: +90 542 400 0524
- WhatsApp: +90 542 400 0524
- Instagram: @bubblecupwaffle09
- Email: berkaycalli96@gmail.com
- Email: frkncll09@gmail.com

## 🍫 Başlangıç Ürün Listesi
| Ürün | Kategori | Fiyat |
|---|---|---|
| Bardak Waffle | klasik | 250 ₺ |
| 2 li Bardak Waffle Avantaj Paketi | ozel | 470 ₺ |
| Kova Waffle | klasik | 330 ₺ |
| 2'li Kova Waffle Avantajlı | Klasik | 580 ₺ |
| Sevdiklerinle Paylaşmalık Kova Waffle Paketi (3 Kişilik) | ozel | 825 ₺ |
| 5 al 4 ÖDE! | Sınırsız Seçim | 1200 ₺ |


## 🚀 Faz Sırası
**Faz 1 (şimdi):** Statik + WhatsApp sipariş + güzel görünüm + lokal çalışıyor
**Faz 2:** Supabase entegrasyonu + admin paneli + üyelik
**Faz 3:** iyzico sandbox + gerçek ödeme akışı + email otomasyonu
**Faz 4:** Vercel'e deploy + canlı domain + iyzico production
