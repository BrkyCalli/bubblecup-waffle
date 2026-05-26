"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "@/lib/cart";
import { signOut } from "@/lib/auth-actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/menu", label: "Menü" },
  { href: "/iletisim", label: "İletişim" },
];

// Oturum bilgisi sunucudan (layout) gelir — tarayıcıda cookie okumaya bağımlı değiliz.
export type HeaderUser = {
  email: string | null;
  fullName: string | null;
  isAdmin: boolean;
};

export function Header({ user }: { user: HeaderUser | null }) {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  const displayName = user?.fullName || user?.email || "Hesabım";

  return (
    <header className="sticky top-0 z-40 border-b border-pembe/15 bg-krem/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🧇
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-pembe-koyu">
            BUBBLECUP
            <span className="ml-1 text-altin">WAFFLE</span>
          </span>
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-metin transition-colors hover:text-pembe-koyu"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Masaüstü: giriş / kullanıcı */}
          <div className="hidden items-center md:flex">
            {user ? (
              <div className="flex items-center gap-1">
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-full px-3 py-2 text-sm font-semibold text-altin-koyu transition-colors hover:bg-altin/10"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/hesabim"
                  className="max-w-[10rem] truncate rounded-full px-3 py-2 text-sm font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                >
                  {displayName}
                </Link>
                <form action={signOut} className="flex">
                  <button
                    type="submit"
                    aria-label="Çıkış yap"
                    className="flex h-10 w-10 items-center justify-center rounded-full text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/giris"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
              >
                <UserIcon className="h-4 w-4" />
                Giriş
              </Link>
            )}
          </div>

          {/* Sepet ikonu */}
          <Link
            href="/sepet"
            aria-label="Sepetim"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-pembe px-1 text-xs font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobil hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Menüyü aç"
              className="flex h-10 w-10 items-center justify-center rounded-full text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu md:hidden"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-krem">
              <SheetHeader>
                <SheetTitle className="font-display text-pembe-koyu">
                  BUBBLECUP WAFFLE
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/sepet"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                >
                  Sepetim {itemCount > 0 && `(${itemCount})`}
                </Link>

                {/* Giriş / kullanıcı (mobil) */}
                <div className="mt-2 border-t border-pembe/15 pt-2">
                  {user ? (
                    <>
                      <span className="block px-3 py-2 text-sm text-metin-orta">
                        {displayName}
                      </span>
                      <Link
                        href="/hesabim"
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                      >
                        Hesabım
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-3 text-base font-semibold text-altin-koyu transition-colors hover:bg-altin/10"
                        >
                          Admin Paneli
                        </Link>
                      )}
                      <form action={signOut}>
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                        >
                          <LogOut className="h-5 w-5" />
                          Çıkış Yap
                        </button>
                      </form>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/giris"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                      >
                        <UserIcon className="h-5 w-5" />
                        Giriş Yap
                      </Link>
                      <Link
                        href="/kayit"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-3 text-base font-medium text-metin transition-colors hover:bg-pembe/10 hover:text-pembe-koyu"
                      >
                        Kayıt Ol
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
