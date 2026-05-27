import Link from "next/link";

// Admin alt sekmeleri (Siparişler / Analitik)
export function AdminNav({ active }: { active: "siparisler" | "analitik" }) {
  const base = "rounded-full px-4 py-2 text-sm font-semibold transition-colors";
  const on = "bg-pembe text-white";
  const off = "text-metin hover:bg-pembe/10";

  return (
    <nav className="mb-6 flex gap-2">
      <Link
        href="/admin"
        className={`${base} ${active === "siparisler" ? on : off}`}
      >
        Siparişler
      </Link>
      <Link
        href="/admin/analitik"
        className={`${base} ${active === "analitik" ? on : off}`}
      >
        📊 Analitik
      </Link>
    </nav>
  );
}
