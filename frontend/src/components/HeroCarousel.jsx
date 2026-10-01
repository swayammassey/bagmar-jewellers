import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCatalogue } from "../context/CatalogueContext";
import { formatGoldRate } from "../lib/pricing";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

export const HeroCarousel = () => {
  const { store, heroSlides } = useCatalogue();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  const slide = heroSlides[active];

  return (
    <section data-testid="hero-carousel" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 md:py-8 grid lg:grid-cols-[0.88fr_1.12fr] gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 py-2 lg:py-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p data-testid="hero-kicker" className="inline-flex items-center gap-2 text-emerald font-jost text-xs font-semibold tracking-[0.12em] uppercase">
              <span className="w-7 h-px bg-gold-dark" /> Bagmar Jewellers · A Legacy Since 1897
            </p>
            <h1 data-testid="hero-title" className="mt-5 text-4xl sm:text-5xl xl:text-6xl leading-[1.04] tracking-[-0.02em] text-ink font-marcellus">
              Gold & diamond
              <span className="block mt-1 font-cormorant italic font-medium text-emerald">jewellery</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-neutral-600">
              Discover hallmarked gold and certified diamonds, selected for life’s most meaningful moments.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/#collections" data-testid="hero-shop-btn" className="inline-flex min-h-12 items-center justify-center gap-2 bg-emerald px-6 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark">
                Shop collections <ArrowRight size={16} />
              </Link>
              <Link to="/#visit" data-testid="hero-visit-btn" className="inline-flex min-h-12 items-center justify-center gap-2 border border-neutral-300 px-5 text-sm font-medium text-ink transition-colors hover:border-emerald hover:text-emerald">
                <MapPin size={16} /> Visit our store
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck size={15} className="text-emerald" /> BIS hallmarked</span>
              <span className="inline-flex items-center gap-1.5"><Star size={14} className="text-gold-dark" /> 4.2 Google rating</span>
              <span data-testid="hero-gold-rate" className="inline-flex items-center gap-1.5">24KT {formatGoldRate(store.goldRates.kt24)}/g</span>
            </div>
          </motion.div>
        </div>

        <div className="order-1 lg:order-2 relative min-w-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
            {heroSlides.map((item, index) => (
              <img
                key={`${item.image}-${index}`}
                src={item.image}
                alt={item.title}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${index === active ? "opacity-100" : "opacity-0"}`}
                aria-hidden={index !== active}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-4 sm:p-6">
              <p data-testid="hero-slide-caption" className="max-w-[75%] text-sm sm:text-base font-medium text-white">{slide.kicker} <span className="text-white/75">· {slide.title}</span></p>
              <div className="flex shrink-0 gap-2">
                <button data-testid="hero-prev" aria-label="Previous collection image" onClick={() => setActive((index) => (index - 1 + heroSlides.length) % heroSlides.length)} className="flex h-9 w-9 items-center justify-center border border-white/50 text-white transition-colors hover:bg-white hover:text-ink"><ChevronLeft size={17} /></button>
                <button data-testid="hero-next" aria-label="Next collection image" onClick={() => setActive((index) => (index + 1) % heroSlides.length)} className="flex h-9 w-9 items-center justify-center border border-white/50 text-white transition-colors hover:bg-white hover:text-ink"><ChevronRight size={17} /></button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Explore the Bagmar collection</span>
            <div className="flex gap-1.5" aria-label="Choose hero image">
              {heroSlides.map((item, index) => (
                <button key={item.title} data-testid={`hero-dot-${index}`} aria-label={`Show ${item.title}`} aria-pressed={index === active} onClick={() => setActive(index)} className={`h-1.5 transition-all ${index === active ? "w-6 bg-emerald" : "w-2 bg-neutral-300 hover:bg-neutral-500"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
