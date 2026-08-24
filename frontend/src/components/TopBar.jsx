import { useCatalogue } from "../context/CatalogueContext";

export const TopBar = () => {
  const { store } = useCatalogue();
  const TICKER = [
    { text: "Today's Gold Rate", chip: true },
    { text: `22KT ${store.goldRates.kt22} / g`, strong: true },
    { text: `24KT ${store.goldRates.kt24} / g`, strong: true },
    { text: "Indicative · Updated Daily" },
    { text: `BIS Hallmarked · ${store.est}` },
    { text: "Bolarum · Secunderabad" },
    { text: store.phone },
    { text: store.hours },
  ];
  const Row = () => (
    <div className="flex shrink-0 items-center">
      {TICKER.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {t.chip ? (
            <span className="ml-7 bg-gold text-ink px-3.5 py-1 tracking-[0.25em] font-semibold">{t.text}</span>
          ) : (
            <span className={`px-7 ${t.strong ? "font-semibold text-gold-light" : "text-white/75"}`}>{t.text}</span>
          )}
          <span className="text-gold-light/40">✦</span>
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
