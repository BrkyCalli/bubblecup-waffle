import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchGoogleReviews } from "@/lib/google-reviews";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Vercel cron, CRON_SECRET ayarlıysa "Authorization: Bearer <secret>" gönderir.
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const reviews = await fetchGoogleReviews();
  if (reviews.length === 0) {
    return NextResponse.json({ fetched: 0, upserted: 0, failed: 0 });
  }

  const supabase = await createClient();
  let upserted = 0;
  let failed = 0;
  for (const r of reviews) {
    const { error } = await supabase.rpc("upsert_google_review", {
      p_google_review_id: r.googleReviewId,
      p_author: r.author,
      p_rating: r.rating,
      p_comment: r.comment,
      p_photo: r.photo,
      p_published_at: r.publishedAt,
    });
    if (error) {
      console.error("upsert_google_review hatası:", error);
      failed += 1;
    } else {
      upserted += 1;
    }
  }

  revalidatePath("/"); // ana sayfa yeni yorumları göstersin
  return NextResponse.json({ fetched: reviews.length, upserted, failed });
}
