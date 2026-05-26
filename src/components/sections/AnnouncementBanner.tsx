const messages = [
  "5 Al 4 ÖDE kampanyası devam ediyor! 🎉",
  "Aydın Efeler'de taptaze waffle 🧇",
  "WhatsApp'tan hızlı sipariş ☎️",
  "Sevdiklerinle paylaşmalık kova paketleri 🍫",
];

export function AnnouncementBanner() {
  // Kesintisiz akış için mesaj listesini iki kez basıyoruz
  const loop = [...messages, ...messages];

  return (
    <div className="overflow-hidden bg-pembe-koyu py-2.5 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {loop.map((message, index) => (
          <span
            key={index}
            className="mx-6 flex items-center text-sm font-medium"
          >
            {message}
            <span className="ml-6 text-altin" aria-hidden="true">
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
