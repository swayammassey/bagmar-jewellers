import { useCatalogue } from "../context/CatalogueContext";
import { formatGoldRate } from "../lib/pricing";

export const TopBar = () => {
  const { store } = useCatalogue();
  return (
    <div
      data-testid="top-bar"
      className="bg-emerald text-white border-b border-emerald-dark font-jost"
    >
      <div data-testid="gold-rate-ticker" className="max-w-7xl mx-auto min-h-9 px-4 md:px-8 grid grid-cols-3 sm:flex sm:items-center sm:justify-between gap-2 py-2 text-[9px] sm:text-[10px] tracking-[0.08em] sm:tracking-[0.12em] uppercase">
        {store.goldRates.kt18 && <span className="text-center sm:text-left whitespace-nowrap">18KT <strong className="font-semibold">{formatGoldRate(store.goldRates.kt18)}</strong>/g</span>}
        <span className="text-center sm:text-left whitespace-nowrap">22KT <strong className="font-semibold">{formatGoldRate(store.goldRates.kt22)}</strong>/g</span>
        <span className="text-center sm:text-left whitespace-nowrap">24KT <strong className="font-semibold">{formatGoldRate(store.goldRates.kt24)}</strong>/g</span>
        <span className="hidden md:block text-white/75">BIS Hallmarked · {store.est} · Bolarum</span>
      </div>
    </div>
  );
};
