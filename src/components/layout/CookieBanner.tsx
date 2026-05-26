"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "bubblecup-cerez-onay";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-pembe/15 bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-metin-orta">
          Bu site, deneyiminizi iyileştirmek için çerez kullanır. Detaylar için{" "}
          <Link href="/kvkk" className="font-medium text-pembe-koyu underline">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni inceleyebilirsiniz.
        </p>
        <Button
          onClick={accept}
          className="h-10 shrink-0 bg-pembe px-6 text-white hover:bg-pembe-koyu"
        >
          Kabul Et
        </Button>
      </div>
    </div>
  );
}
