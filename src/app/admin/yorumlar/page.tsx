import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/sections/AdminNav";
import { AdminReviews, type AdminReview } from "@/components/sections/AdminReviews";

export const metadata: Metadata = {
  title: "Yorumlar | BUBBLECUP WAFFLE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminYorumlarPage() {
  const user = await getUser();
  if (!user) redirect("/giris");
  if (!isAdmin(user)) redirect("/");

  const supabase = await createClient();
  // Müşterinin gönderdiği yorumlar (pending = henüz yanıtlamadı, gösterme)
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, comment, customer_name, status, submitted_at, source")
    .in("status", ["submitted", "approved", "rejected"])
    .order("submitted_at", { ascending: false, nullsFirst: false });

  const reviews = (data ?? []) as AdminReview[];
  const pendingCount = reviews.filter((r) => r.status === "submitted").length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-metin">Yorumlar</h1>
      <p className="mt-2 text-metin-orta">
        Müşteri yorumlarını onayla veya reddet
        {pendingCount > 0 && (
          <span className="ml-2 inline-flex items-center rounded-full bg-altin/15 px-2.5 py-0.5 text-sm font-semibold text-altin-koyu">
            {pendingCount} bekliyor
          </span>
        )}
      </p>

      <div className="mt-6">
        <AdminNav active="yorumlar" />
      </div>

      <AdminReviews reviews={reviews} />
    </div>
  );
}
