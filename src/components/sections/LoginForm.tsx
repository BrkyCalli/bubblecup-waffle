"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn, type AuthState } from "@/lib/auth-actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

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
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(buttonVariants(), "mt-2 h-12 w-full text-base")}
      >
        {isPending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
    </form>
  );
}
