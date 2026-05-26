import type { User } from "@supabase/supabase-js";

// Admin paneline erişebilecek e-postalar. İleride buraya ekleme yapılabilir
// (ör. "frkncll09@gmail.com"). Aynı liste SQL'deki is_admin() ile eşleşmeli.
export const ADMIN_EMAILS = ["berkaycalli96@gmail.com"];

export function isAdmin(user: User | null | undefined): boolean {
  return !!user?.email && ADMIN_EMAILS.includes(user.email);
}
