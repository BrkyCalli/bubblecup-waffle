// Google Places API (New)'den işletme yorumlarını çeker.
// NOT: Places API bir mekan için EN FAZLA 5 yorum döndürür (Google'ın sınırı) —
// tüm yorumları çekmek API ile mümkün değildir.

const PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

// Sadece ihtiyaç duyduğumuz alanları field mask ile isteriz (maliyet + hız).
const FIELD_MASK = [
  "reviews.name",
  "reviews.rating",
  "reviews.text",
  "reviews.originalText",
  "reviews.authorAttribution",
  "reviews.publishTime",
].join(",");

const MIN_RATING = 4; // yalnızca 4-5 yıldızlı yorumlar
const MIN_COMMENT_LENGTH = 20; // çok kısa yorumları ele

// Yorumda geçmesini İSTEMEDİĞİMİZ konum/adres ifadeleri.
// - Belirgin/çok kelimeli olanlar alt dize (substring) ile eşleşir.
// - Generic tek kelimeler TAM KELİME olarak eşleşir; böylece "il" → "filiz",
//   "aydın" → "aydınlık" gibi yanlış yakalamalar olmaz.
const LOCATION_PHRASES = ["orta mahalle", "doğugazi", "doğu gazi"];
const LOCATION_WORDS = new Set([
  "aydın",
  "efeler",
  "sokak",
  "cadde",
  "mahalle",
  "semt",
  "ilçe",
  "şehir",
  "il",
  "adres",
]);

// Önceliklendirmede geriye atılan kişisel/personel ifadeleri (filtre değil).
const STAFF_WORDS = ["personel", "garson", "çalışan"];

// Sitede gösterilecek, normalize edilmiş yorum.
export type GoogleReview = {
  googleReviewId: string; // Google'ın kararlı review "name"i (duplicate kontrolü)
  author: string;
  rating: number;
  comment: string;
  photo: string | null;
  publishedAt: string; // ISO 8601
};

// Google yanıtının yalnızca kullandığımız kısmı (any kullanmıyoruz).
type LocalizedText = { text?: string; languageCode?: string };
type AuthorAttribution = { displayName?: string; photoUri?: string };
type RawGoogleReview = {
  name?: string;
  rating?: number;
  text?: LocalizedText;
  originalText?: LocalizedText;
  authorAttribution?: AuthorAttribution;
  publishTime?: string;
};
type PlaceDetailsResponse = { reviews?: RawGoogleReview[] };

// Yorum dili Türkçe mi? (orijinal metni, yoksa çeviriyi baz al)
function isTurkish(r: RawGoogleReview): boolean {
  return (r.originalText?.languageCode ?? r.text?.languageCode) === "tr";
}

// Orijinal (çevrilmemiş) yorum metni.
function commentText(r: RawGoogleReview): string {
  return (r.originalText?.text ?? r.text?.text ?? "").trim();
}

// Yorumda konum/adres kelimesi geçiyor mu?
function hasLocationWord(comment: string): boolean {
  const lower = comment.toLocaleLowerCase("tr");
  if (LOCATION_PHRASES.some((p) => lower.includes(p))) return true;
  // Türkçe harf/rakam dışındaki her şeyde böl → tam kelime kontrolü
  const tokens = lower.split(/[^a-zçğıöşü0-9]+/).filter(Boolean);
  return tokens.some((t) => LOCATION_WORDS.has(t));
}

// Yorumda personel/kişisel ifade geçiyor mu? (önceliklendirme için)
function mentionsStaff(comment: string): boolean {
  const lower = comment.toLocaleLowerCase("tr");
  return STAFF_WORDS.some((w) => lower.includes(w));
}

export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.PLACE_ID;
  if (!apiKey || !placeId) {
    console.error("GOOGLE_PLACES_API_KEY veya PLACE_ID tanımlı değil");
    return [];
  }

  let res: Response;
  try {
    res = await fetch(`${PLACES_ENDPOINT}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      cache: "no-store", // cron her gün taze veri çeksin
    });
  } catch (e) {
    console.error("Google Places isteği başarısız:", e);
    return [];
  }

  if (!res.ok) {
    console.error("Google Places hatası:", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as PlaceDetailsResponse;
  const all = (data.reviews ?? []).filter((r) => r.name); // dedup id şart

  // Ortak ön koşul: Türkçe + 4-5 yıldız (hem sıkı filtrede hem fallback'te geçerli)
  const turkishGood = all.filter(
    (r) => isTurkish(r) && (r.rating ?? 0) >= MIN_RATING,
  );

  // Sıkı filtre: ayrıca en az 20 karakter + konum/adres kelimesi içermesin.
  const strict = turkishGood.filter((r) => {
    const c = commentText(r);
    return c.length >= MIN_COMMENT_LENGTH && !hasLocationWord(c);
  });

  // Sıkı filtre hiç sonuç vermezse: konum + uzunluk koşullarını bırak,
  // yalnızca metinli Türkçe 4-5 yıldızlı yorumları al.
  const chosen =
    strict.length > 0
      ? strict
      : turkishGood.filter((r) => commentText(r).length > 0);

  // Sıralama: personel/kişisel ifade GEÇMEYENLER önce, sonra yeni tarihli önce.
  chosen.sort((a, b) => {
    const aStaff = mentionsStaff(commentText(a));
    const bStaff = mentionsStaff(commentText(b));
    if (aStaff !== bStaff) return aStaff ? 1 : -1;
    return (b.publishTime ?? "").localeCompare(a.publishTime ?? "");
  });

  return chosen.map((r): GoogleReview => ({
    googleReviewId: r.name as string,
    author: r.authorAttribution?.displayName?.trim() || "Google Kullanıcısı",
    rating: r.rating ?? 5,
    comment: commentText(r),
    photo: r.authorAttribution?.photoUri ?? null,
    publishedAt: r.publishTime ?? new Date().toISOString(),
  }));
}
