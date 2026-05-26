import type { PersonSelection } from "@/types";

export const cikolataSecenekleri = [
  "Sütlü Çikolata",
  "Beyaz Çikolata",
  "Bitter Çikolata",
  "Frambuazlı Çikolata",
  "Antep Fıstıklı Çikolata",
  "Karamel",
  "Lotus Bisküvi",
];

export const drajeSecenekleri = [
  "Fındık",
  "Fıstık",
  "Antep Fıstığı",
  "Sütlü Pirinç Patlağı",
  "Frambuazlı Pirinç Patlağı",
  "Oreo",
  "Lotus",
  "Hindistan Cevizi",
  "Sütlü Damla Çikolata",
  "Frambuazlı Damla Çikolata",
  "Beyaz Damla Çikolata",
  "Çakıltaşı",
  "Bonibon",
  "Krep Kırığı",
];

/** Verilen kişi sayısı kadar boş seçim bölümü oluşturur. */
export function createEmptySelections(personCount: number): PersonSelection[] {
  return Array.from({ length: personCount }, () => ({
    cikolatalar: [],
    drajeler: [],
  }));
}

/** Her kişinin en az bir çikolata seçmiş olması gerekir. */
export function selectionsValid(selections: PersonSelection[]): boolean {
  return selections.every((person) => person.cikolatalar.length > 0);
}

/** Ürün + seçimlere göre benzersiz, deterministik bir satır kimliği üretir. */
export function buildCartItemId(
  productId: string,
  selections: PersonSelection[],
): string {
  const encoded = selections
    .map(
      (person) =>
        `${[...person.cikolatalar].sort().join(",")}|${[...person.drajeler].sort().join(",")}`,
    )
    .join(";");
  return `${productId}::${encoded}`;
}
