export type ProductCategory = "klasik" | "ozel" | "sinirsiz";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
  image: string;
  badge?: string;
  // Kaç kişilik → özelleştirme modalında o kadar ayrı seçim bölümü açılır
  personCount: number;
}

// Tek bir kişinin seçimleri
export interface PersonSelection {
  cikolatalar: string[]; // en az 1 zorunlu
  drajeler: string[]; // opsiyonel
}

export interface CartItem {
  cartItemId: string; // ürün + seçimlere göre benzersiz satır kimliği
  product: Product;
  quantity: number;
  // Uzunluğu product.personCount kadar. Eski localStorage kayıtlarında
  // bulunmayabilir, bu yüzden opsiyonel — okurken [] varsayılır.
  selections?: PersonSelection[];
}

// Sipariş sırasında alınan müşteri / teslimat bilgileri
export interface CustomerInfo {
  name: string; // Ad Soyad (zorunlu)
  phone: string; // Telefon (zorunlu, TR formatı)
  email: string; // E-posta (zorunlu — yorum maili için)
  address: string; // Teslimat adresi (zorunlu)
  unit: string; // Daire/Kapı No (opsiyonel)
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  klasik: "Klasik",
  ozel: "Avantaj/Özel",
  sinirsiz: "Sınırsız Seçim",
};
