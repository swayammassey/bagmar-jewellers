import { useCatalogue } from "../context/CatalogueContext";

export const TopBar = () => {
  const { store } = useCatalogue();
  const TICKER = [
    { text: "Today's Gold Rate", chip: true },
    { text: `22KT ${store.goldRates.kt22} / g`, strong: true },
    { text: `24KT ${store.goldRates.kt24} / g`, strong: true },
    { text: "Indicative · Updated Daily" },
    { text: `BIS Hallmarked · ${store.est}` },
    { text: "Bolarum · Hyderabad" },
    { text: store.phone },
    { text: store.hours },
  ];
  const Row = () => (
    <div className="flex shrink-0 items-center">
      {TICKER.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className={`px-8 ${t.chip ? "text-gold-light font-semibold" : t.strong ? "font-semibold text-gold-light" : "text-white/70"}`}>{t.text}</span>
          <span className="h-3 w-px bg-gold-light/25" />
        </span>
      ))}
    </div>
  );
  return (
    <div
      data-testid="top-bar"
      className="bg-wine border-b border-wine-dark py-2.5 md:py-3 font-marcellus text-[10px] md:text-xs tracking-[0.22em] uppercase overflow-hidden"
    >
      <div data-testid="gold-rate-ticker" className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
};
