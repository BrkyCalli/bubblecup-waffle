// Türkiye cep telefonu doğrulama ve biçimlendirme yardımcıları.
// Kabul edilen girişler: "05XX XXX XX XX", "5XXXXXXXXX", "+90 5XX...",
// "90 5XX...", aralarda boşluk/tire/parantez olabilir.

// Geçerliyse 10 haneli yerel numarayı ("5XXXXXXXXX") döndürür, değilse null.
export function normalizeTurkishPhone(input: string): string | null {
  let digits = (input ?? "").replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  // Cep telefonu: 10 hane ve 5 ile başlamalı
  if (digits.length === 10 && digits.startsWith("5")) {
    return digits;
  }
  return null;
}

export function isValidTurkishPhone(input: string): boolean {
  return normalizeTurkishPhone(input) !== null;
}

// Okunabilir biçim: "05XX XXX XX XX". Geçersizse girişi olduğu gibi döndürür.
export function formatTurkishPhone(input: string): string {
  const local = normalizeTurkishPhone(input);
  if (!local) return input;
  return `0${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
}

// Basit ama yeterli e-posta doğrulaması (xxx@yyy.zzz)
export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((input ?? "").trim());
}
