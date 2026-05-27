import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AuthShell } from "@/components/sections/AuthShell";
import { ReviewForm } from "@/components/sections/ReviewForm";

export const metadata: Metadata = {
  title: "Yorum Yap | BUBBLECUP WAFFLE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ReviewRow = {
  status: string;
  rating: number | null;
  comment: string | null;
  customer_name: string | null;
};

export default async function YorumPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = await createClient();
  const { data } = await supabase.rpc("get_review_by_token", { p_token: token });
  const review = (Array.isArray(data) && data[0]) as ReviewRow | undefined;

  const homeLink = (
    <Link href="/" className="font-medium text-pembe-koyu hover:underline">
      Ana sayfaya dön
    </Link>
  );

  // Geçersiz / bulunamayan token
  if (!review) {
    return (
      <AuthShell
        title="Geçersiz bağlantı"
        subtitle="Bu yorum bağlantısı geçersiz ya da süresi dolmuş olabilir."
        footer={homeLink}
      >
        <p className="text-center text-metin-orta">
          Bağlantıyı e-postandaki butondan tekrar açmayı dene.
        </p>
      </AuthShell>
    );
  }

  // Zaten yorum yapılmış (submitted/approved/rejected)
  if (review.status !== "pending") {
    return (
      <AuthShell
        title="Teşekkürler! 🎉"
        subtitle="Bu sipariş için yorumun zaten alınmış."
        footer={homeLink}
      >
        <p className="text-center text-metin-orta">
          Görüşlerin bizim için çok değerli. Yine bekleriz! 🧇
        </p>
      </AuthShell>
    );
  }

  // Yorum bekleniyor → formu göster
  return (
    <AuthShell
      title="Siparişin nasıldı?"
      subtitle="Puan ver ve birkaç kelimeyle deneyimini paylaş."
      footer={homeLink}
    >
      <ReviewForm token={token} customerName={review.customer_name} />
    </AuthShell>
  );
}
