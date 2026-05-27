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
  const filtered = (data.reviews ?? []).filter(
    (r) => (r.rating ?? 0) >= MIN_RATING && r.name,
  );

  // Türkçe yorumları öne al, ardından yeni tarihliyi öne sırala.
  filtered.sort((a, b) => {
    const aTr = isTurkish(a);
    const bTr = isTurkish(b);
    if (aTr !== bTr) return aTr ? -1 : 1;
    return (b.publishTime ?? "").localeCompare(a.publishTime ?? "");
  });

  return filtered.map((r): GoogleReview => {
    const original = r.originalText ?? r.text; // çeviri değil, orijinal metin
    return {
      googleReviewId: r.name as string,
      author: r.authorAttribution?.displayName?.trim() || "Google Kullanıcısı",
      rating: r.rating ?? 5,
      comment: (original?.text ?? "").trim(),
      photo: r.authorAttribution?.photoUri ?? null,
      publishedAt: r.publishTime ?? new Date().toISOString(),
    };
  });
}
