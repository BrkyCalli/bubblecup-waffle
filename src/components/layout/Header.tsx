"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
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

export function Header() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
