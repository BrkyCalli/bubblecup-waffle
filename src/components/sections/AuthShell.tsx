import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

// Giriş ve kayıt sayfalarının ortak kabuğu: ortalanmış marka logosu + beyaz kart.
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">
            🧇
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-pembe-koyu">
            BUBBLECUP<span className="ml-1 text-altin">WAFFLE</span>
          </span>
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-pembe/10 sm:p-8">
        <h1 className="font-display text-2xl font-semibold text-metin">
          {title}
        </h1>
        <p className="mt-1 text-sm text-metin-orta">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      <p className="mt-6 text-center text-sm text-metin-orta">{footer}</p>
    </div>
  );
}
