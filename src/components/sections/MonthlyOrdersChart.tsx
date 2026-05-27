import type { MonthlyPoint } from "@/lib/analytics";

// Saf CSS bar chart — son 12 ayın sipariş sayısı (grafik kütüphanesi gerekmez)
export function MonthlyOrdersChart({ data }: { data: MonthlyPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <p className="py-8 text-center text-sm text-metin-orta">
        Grafik için henüz yeterli sipariş yok.
      </p>
    );
  }

  return (
    <div>
      {/* Sayılar */}
      <div className="flex gap-1.5">
        {data.map((p) => (
          <span
            key={p.month}
            className="flex-1 text-center text-[11px] font-semibold text-metin"
          >
            {p.count > 0 ? p.count : ""}
          </span>
        ))}
      </div>

      {/* Çubuklar */}
      <div className="flex h-44 items-end gap-1.5">
        {data.map((p) => (
          <div
            key={p.month}
            title={`${p.label}: ${p.count} sipariş`}
            className="flex-1 rounded-t-md bg-pembe transition-all hover:bg-pembe-koyu"
            style={{
              height: p.count > 0 ? `${Math.max(4, (p.count / max) * 100)}%` : "2px",
            }}
          />
        ))}
      </div>

      {/* Ay etiketleri */}
      <div className="mt-1 flex gap-1.5">
        {data.map((p) => (
          <span
            key={p.month}
            className="flex-1 text-center text-[10px] text-metin-orta"
          >
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}
