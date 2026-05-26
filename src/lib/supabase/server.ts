import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Sunucu (server component / route handler / server action) tarafı Supabase istemcisi
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component içinden çağrıldığında set hata verebilir;
            // session yenilemesini middleware hallediyor, sorun değil.
          }
        },
      },
    },
  );
}

// Giriş yapmış kullanıcıyı döndürür (yoksa null)
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
