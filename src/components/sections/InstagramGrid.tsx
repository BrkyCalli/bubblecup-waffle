import { InstagramIcon } from "@/components/layout/InstagramIcon";

const INSTAGRAM_URL = "https://instagram.com/bubblecupwaffle09";

export function InstagramGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-metin sm:text-4xl">
          Instagram&apos;da Biz
        </h2>
        <p className="mt-3 text-metin-orta">
          En taze paylaşımlar için bizi takip edin: @bubblecupwaffle09
        </p>
      </div>

      {/* Görseller eklenince public/images/instagram/ig-1.jpg ... ig-6.jpg
          her kareye <Image> olarak yerleştirilecek */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <a
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-pembe/25 via-krem to-altin/25"
          >
            <span className="text-4xl opacity-70" aria-hidden="true">
              🧇
            </span>
            <div className="absolute inset-0 flex items-center justify-center bg-pembe-koyu/0 opacity-0 transition-all duration-200 group-hover:bg-pembe-koyu/70 group-hover:opacity-100">
              <InstagramIcon className="h-8 w-8 text-white" />
            </div>
          </a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-pembe px-7 py-3 text-base font-semibold text-white transition-colors hover:bg-pembe-koyu"
        >
          <InstagramIcon className="h-5 w-5" />
          Instagram&apos;da Takip Et
        </a>
      </div>
    </section>
  );
}
