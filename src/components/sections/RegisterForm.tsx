"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signUp, type AuthState } from "@/lib/auth-actions";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signUp,
    {},
  );

  // Kayıt başarılı → form yerine "e-postanı kontrol et" mesajını göster.
  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pembe/10 text-2xl">
          ✉️
        </div>
        <p className="text-sm text-metin">{state.success}</p>
        <Link
          href="/giris"
          className="text-sm font-medium text-pembe-koyu hover:underline"
        >
          Giriş sayfasına git
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="full_name" className="text-sm font-medium text-metin">
          Ad Soyad
        </label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          placeholder="Adın Soyadın"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-metin">
          Telefon <span className="font-normal text-metin-orta">(isteğe bağlı)</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="05XX XXX XX XX"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-metin">
          E-posta
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="ornek@eposta.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-metin">
          Şifre
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="En az 6 karakter"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(buttonVariants(), "mt-2 h-12 w-full text-base")}
      >
        {isPending ? "Hesap oluşturuluyor…" : "Hesap Oluştur"}
      </button>
    </form>
  );
}
