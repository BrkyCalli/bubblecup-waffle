"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateProfile, type ProfileState } from "@/lib/profile-actions";

export function AccountProfile({
  email,
  initialName,
  initialPhone,
}: {
  email: string;
  initialName: string;
  initialPhone: string;
}) {
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {},
  );

  return (
    <section className="rounded-2xl border border-pembe/15 bg-white p-6 shadow-sm">
      <h2 className="font-display text-2xl font-semibold text-metin">
        Profil Bilgilerim
      </h2>

      <form action={formAction} className="mt-4 space-y-4">
        {state?.error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        )}
        {state?.success && (
          <p className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            {state.success}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-metin">
            E-posta
          </label>
          <Input
            id="email"
            type="email"
            defaultValue={email}
            disabled
            className="bg-krem/50"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="full_name" className="text-sm font-medium text-metin">
            Ad Soyad
          </label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            defaultValue={initialName}
            autoComplete="name"
            required
            placeholder="Adın Soyadın"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-metin">
            Telefon{" "}
            <span className="font-normal text-metin-orta">(opsiyonel)</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={initialPhone}
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={cn(buttonVariants(), "h-11 px-6 text-base")}
        >
          {isPending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </section>
  );
}
