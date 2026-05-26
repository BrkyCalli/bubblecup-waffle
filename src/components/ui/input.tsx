import * as React from "react";

import { cn } from "@/lib/utils";

// Basit, temayla uyumlu metin girişi (input) bileşeni.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border border-input bg-white px-3 py-2 text-base text-metin shadow-sm transition-colors",
        "placeholder:text-metin-orta/60",
        "focus-visible:border-pembe focus-visible:ring-2 focus-visible:ring-pembe/30 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
