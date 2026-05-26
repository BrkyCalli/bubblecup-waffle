"use client";

import { useEffect, useState } from "react";
import type { PersonSelection, Product } from "@/types";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/whatsapp";
import {
  cikolataSecenekleri,
  createEmptySelections,
  drajeSecenekleri,
  selectionsValid,
} from "@/lib/customization";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Props {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded?: () => void;
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        selected
          ? "border-pembe bg-pembe text-white"
          : "border-pembe/30 bg-white text-metin hover:border-pembe"
      }`}
    >
      {label}
    </button>
  );
}

export function ProductCustomizeModal({
  product,
  open,
  onOpenChange,
  onAdded,
}: Props) {
  const { addItem } = useCart();
  const [selections, setSelections] = useState<PersonSelection[]>(() =>
    createEmptySelections(product.personCount),
  );

  // Modal her açıldığında seçimleri sıfırla
  useEffect(() => {
    if (open) {
      setSelections(createEmptySelections(product.personCount));
    }
  }, [open, product.personCount]);

  const toggle = (
    personIndex: number,
    group: "cikolatalar" | "drajeler",
    value: string,
  ) => {
    setSelections((prev) =>
      prev.map((person, i) => {
        if (i !== personIndex) return person;
        const current = person[group];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...person, [group]: next };
      }),
    );
  };

  const valid = selectionsValid(selections);

  const handleAdd = () => {
    if (!valid) return;
    addItem(product, selections);
    onAdded?.();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
      >
        <SheetHeader className="border-b border-pembe/15">
          <SheetTitle className="font-display text-lg text-metin">
            {product.name}
          </SheetTitle>
          <SheetDescription>
            {product.personCount > 1
              ? `${product.personCount} kişilik — her kişi için ayrı seçim yapın.`
              : "Çikolata ve draje seçiminizi yapın."}
          </SheetDescription>
        </SheetHeader>

        {/* Seçim bölümleri (kaydırılabilir) */}
        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
          {selections.map((person, personIndex) => {
            const personValid = person.cikolatalar.length > 0;
            return (
              <div
                key={personIndex}
                className="rounded-2xl border border-pembe/15 bg-krem/40 p-4"
              >
                {product.personCount > 1 && (
                  <h3 className="mb-3 font-display font-semibold text-pembe-koyu">
                    {personIndex + 1}. Kişi
                  </h3>
                )}

                <div>
                  <p className="mb-2 text-sm font-semibold text-metin">
                    Çikolata{" "}
                    <span className="font-normal text-metin-orta">
                      (en az 1 seçin)
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {cikolataSecenekleri.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        selected={person.cikolatalar.includes(option)}
                        onClick={() =>
                          toggle(personIndex, "cikolatalar", option)
                        }
                      />
                    ))}
                  </div>
                  {!personValid && (
                    <p className="mt-2 text-xs text-pembe-koyu">
                      Lütfen en az bir çikolata seçin.
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-metin">
                    Draje{" "}
                    <span className="font-normal text-metin-orta">
                      (opsiyonel)
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {drajeSecenekleri.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        selected={person.drajeler.includes(option)}
                        onClick={() => toggle(personIndex, "drajeler", option)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <SheetFooter className="border-t border-pembe/15">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-metin-orta">Tutar</span>
            <span className="font-display text-lg font-bold text-pembe-koyu">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!valid}
            className="w-full rounded-full bg-pembe px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-pembe-koyu disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sepete Ekle
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
