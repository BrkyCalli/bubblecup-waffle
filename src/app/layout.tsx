import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getUser } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BUBBLECUP WAFFLE | Aydın'ın En Lezzetli Wafflesi",
  description:
    "Aydın Efeler'de waffle siparişi. Bardak waffle, kova waffle ve özel paketler. WhatsApp ile kolayca sipariş verin.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Oturumu sunucuda çöz; Header'a hazır olarak geçir (üretimde güvenilir).
  const user = await getUser();
  const headerUser = user
    ? {
        email: user.email ?? null,
        fullName:
          (user.user_metadata?.full_name as string | undefined) ?? null,
        isAdmin: isAdmin(user),
      }
    : null;

  return (
    <html lang="tr">
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased`}>
        <CartProvider>
          <Header user={headerUser} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
