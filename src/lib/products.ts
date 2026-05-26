import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "bardak-waffle",
    name: "Bardak Waffle",
    price: 250,
    category: "klasik",
    description:
      "Tek kişilik, pratik ve doyurucu. Sıcacık waffle parçaları, bol soslar ve sevdiğin malzemelerle bardakta servis.",
    image: "/images/products/bardak-waffle.png",
    personCount: 1,
  },
  {
    id: "2li-bardak-avantaj",
    name: "2'li Bardak Waffle Avantaj Paketi",
    price: 470,
    category: "ozel",
    description:
      "İki kişilik keyif, avantajlı fiyatla. İkiliyseniz bu paket tam size göre.",
    image: "/images/products/2li-bardak-avantaj.png",
    badge: "Avantaj",
    personCount: 2,
  },
  {
    id: "kova-waffle",
    name: "Kova Waffle",
    price: 330,
    category: "klasik",
    description:
      "Bol malzemeli, paylaşmalık kova waffle. Çıtır waffle parçaları ve birbirinden lezzetli soslarla dolu.",
    image: "/images/products/kova-waffle.png",
    personCount: 1,
  },
  {
    id: "2li-kova-avantajli",
    name: "2'li Kova Waffle Avantajlı",
    price: 580,
    category: "klasik",
    description:
      "İki kova waffle, avantajlı fiyatla. Kalabalık keyifler ve uzun sohbetler için ideal.",
    image: "/images/products/2li-kova-avantajli.png",
    badge: "Avantaj",
    personCount: 2,
  },
  {
    id: "paylasmali-kova",
    name: "Sevdiklerinle Paylaşmalık Kova Waffle Paketi (3 Kişilik)",
    price: 825,
    category: "ozel",
    description:
      "Üç kişilik dev kova paketi. Sevdiklerinle paylaşmak için bol bol waffle, sos ve meyve.",
    image: "/images/products/paylasmali-kova.png",
    badge: "3 Kişilik",
    personCount: 3,
  },
  {
    id: "5al4ode",
    name: "5 Al 4 ÖDE!",
    price: 1200,
    category: "sinirsiz",
    description:
      "5 waffle al, 4'ünü öde! Sınırsız seçim hakkıyla en avantajlı paket. Kalabalık gruplar için kaçırılmaz fırsat.",
    image: "/images/products/5al4ode.png",
    badge: "Fırsat",
    personCount: 5,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}
