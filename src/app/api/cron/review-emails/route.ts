import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EnqueueRow = {
  token: string;
  email_to: string;
  customer_name: string | null;
};

// Resend REST API ile yorum e-postası gönderir (SDK gerekmez).
// NOT: Resend test modunda yalnızca kendi hesabının e-postasına teslim eder.
// Alan adı doğrulandığında "from" adresini değiştirmek yeterli.
async function sendReviewEmail(
  to: string,
  name: string | null,
  link: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY tanımlı değil");
    return false;
  }

  const greeting = name ? `Merhaba ${name},` : "Merhaba,";
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f1f1f">
    <h1 style="font-size:22px;margin:0 0 16px">🧇 BUBBLECUP WAFFLE</h1>
    <p style="margin:0 0 12px">${greeting}</p>
    <p style="margin:0 0 12px">Siparişin nasıldı? Deneyimini bizimle paylaşır mısın? Sadece 30 saniye sürer ve bize çok yardımcı olur. 💛</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#ec4899;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;font-weight:600;display:inline-block">Yorumumu Bırak</a>
    </p>
    <p style="font-size:12px;color:#6b7280;margin:0">Buton çalışmazsa bu bağlantıyı tarayıcına yapıştır:<br>${link}</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BUBBLECUP WAFFLE <onboarding@resend.dev>",
        to: [to],
        subject: "Siparişin nasıldı? 🧇 Yorumunu bekliyoruz",
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend hatası:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("Resend gönderim hatası:", e);
    return false;
  }
}

export async function GET(request: Request) {
  // Vercel cron, CRON_SECRET ayarlıysa "Authorization: Bearer <secret>" gönderir.
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("enqueue_review_emails");
  if (error) {
    console.error("enqueue_review_emails hatası:", error);
    return NextResponse.json({ error: "Sıraya alınamadı" }, { status: 500 });
  }

  const rows = (data ?? []) as EnqueueRow[];
  const origin = new URL(request.url).origin;

  let sent = 0;
  let failed = 0;
  for (const r of rows) {
    if (!r.email_to) {
      failed += 1;
      continue;
    }
    const ok = await sendReviewEmail(
      r.email_to,
      r.customer_name,
      `${origin}/yorum/${r.token}`,
    );
    if (ok) sent += 1;
    else failed += 1;
  }

  return NextResponse.json({ enqueued: rows.length, sent, failed });
}
