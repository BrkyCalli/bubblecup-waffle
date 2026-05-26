import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

// Yasal sayfalar için ortak kabuk. İçindeki h2/p/ul/li/a/strong
// elemanları otomatik olarak markaya uygun stillenir.
export function LegalLayout({
  title,
  lastUpdated,
  children,
}: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-metin sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-metin-orta">
        Son güncelleme: {lastUpdated}
      </p>

      <div className="mt-4 rounded-xl border border-altin/30 bg-altin/10 p-4 text-sm text-metin-orta">
        ⚠️ Bu metin örnek (placeholder) içeriktir. Siteyi yayına almadan önce
        bir hukuk danışmanına gözden geçirtmeniz önerilir.
      </div>

      <div className="mt-6 [&_a]:text-pembe-koyu [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-metin [&_li]:leading-relaxed [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-metin-orta [&_strong]:text-metin [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-metin-orta">
        {children}
      </div>
    </div>
  );
}
