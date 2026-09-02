import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useCatalogue } from "../context/CatalogueContext";
import { resolveImg } from "../context/CatalogueContext";

export const SearchBar = ({ variant = "desktop", onNavigate }) => {
  const { products, categoryName, inr } = useCatalogue();
  const navigate = useNavigate();
  const [open, setOpen] = useState(variant === "mobile");
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (variant !== "desktop") return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [variant]);

  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter((p) =>
        [p.name, p.material, categoryName(p.category)].join(" ").toLowerCase().includes(term)
      ).slice(0, 6)
    : [];

  const goTo = (id) => {
    setQ("");
    setOpen(variant === "mobile");
    onNavigate?.();
    navigate(`/product/${id}`);
  };

  const Results = () =>
    term ? (
      <div data-testid="search-results" className="mt-2 max-h-[60vh] overflow-y-auto">
        {results.length === 0 ? (
          <p className="font-jost text-sm text-ink/50 px-4 py-4">No pieces match "{q}"</p>
        ) : (
          results.map((p) => (
            <button
              key={p.id}
              data-testid={`search-result-${p.id}`}
              onClick={() => goTo(p.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-cream/70 transition-colors duration-200"
            >
              <img src={resolveImg(p.images?.[0])} alt="" className="w-11 h-11 object-cover border border-gold/20 shrink-0" />
              <span className="min-w-0">
                <span className="block font-cormorant text-base text-ink truncate">{p.name}</span>
                <span className="block font-jost text-[10px] tracking-[0.2em] uppercase text-ink/50">{categoryName(p.category)} · {inr(p.price)}</span>
              </span>
            </button>
          ))
        )}
      </div>
    ) : null;

  if (variant === "mobile") {
    return (
      <div data-testid="mobile-search">
        <div className="flex items-center gap-3 border border-gold/30 bg-white px-4 h-12">
          <Search size={16} strokeWidth={1.5} className="text-gold-dark shrink-0" />
          <input
            ref={inputRef}
            data-testid="mobile-search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalogue…"
            className="flex-1 bg-transparent outline-none font-jost text-sm placeholder:text-ink/40"
          />
          {q && <button data-testid="mobile-search-clear" onClick={() => setQ("")} aria-label="Clear"><X size={15} className="text-ink/40" /></button>}
        </div>
        <Results />
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        data-testid="search-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Search"
        className="w-9 h-9 flex items-center justify-center text-ink hover:text-wine transition-colors duration-300"
      >
        {open ? <X size={17} strokeWidth={1.5} /> : <Search size={17} strokeWidth={1.5} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="search-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 w-[min(360px,calc(100vw-2rem))] bg-ivory border border-gold/30 shadow-[0_30px_60px_rgba(26,26,26,0.14)] p-3 z-50"
          >
            <div className="flex items-center gap-3 border-b border-gold/30 px-2 pb-2">
              <Search size={16} strokeWidth={1.5} className="text-gold-dark shrink-0" />
              <input
                ref={inputRef}
                data-testid="search-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the catalogue…"
                className="flex-1 bg-transparent outline-none font-jost text-sm placeholder:text-ink/40"
              />
            </div>
            <Results />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
