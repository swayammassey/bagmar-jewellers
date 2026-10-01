import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Gem, Landmark, Star, ArrowRight, MapPin, Phone, Clock, MessageCircle, Instagram } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { useCatalogue } from "../context/CatalogueContext";
import { getPrimaryMainCategories } from "../lib/categoryTree";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

export const GoldMarquee = ({ items }) => {
  const words = items || ["Bagmar Jewellers", "BIS Hallmarked", "A Legacy Since 1897", "Bolarum · Hyderabad", "Handcrafted Heirlooms"];
  const Row = () => (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-10 font-marcellus text-2xl md:text-4xl tracking-[0.2em] uppercase text-gold/60">{w}</span>
          <span className="text-gold/40 text-base">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div data-testid="gold-marquee" className="py-8 md:py-10 border-y border-gold/25 bg-ivory overflow-hidden">
      <div className="flex w-max animate-marquee-slow">
        <Row />
        <Row />
      </div>
    </div>
  );
};

const SectionHead = ({ numeral, kicker, title, italic }) => (
  <Reveal>
    <div className="relative mb-8 md:mb-10">
      <span className="font-jost text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald">{kicker}</span>
      <h2 className="font-marcellus text-2xl md:text-4xl text-ink mt-2 leading-tight">
        {title} {italic && <span className="font-cormorant italic font-medium text-emerald">{italic}</span>}
      </h2>
      <div className="h-px w-14 bg-gold mt-4" />
    </div>
  </Reveal>
);

const COL = { 4: "md:col-span-4", 5: "md:col-span-5", 6: "md:col-span-6", 7: "md:col-span-7", 12: "md:col-span-12" };
// Builds an abstract, gap-free layout: every row sums to the 12-col grid regardless of category count.
const buildTiles = (n) => {
  const cycle = [2, 3];
  const out = [];
  let i = 0, r = 0;
  while (i < n) {
    let size = cycle[r % cycle.length];
    const remaining = n - i;
    if (remaining < size) size = remaining;
    let cols, h, mob;
    if (size === 1) { cols = [12]; h = "md:h-[380px]"; mob = "col-span-2 h-[230px]"; }
    else if (size === 2) { cols = r % 2 === 0 ? [7, 5] : [5, 7]; h = "md:h-[520px]"; mob = "col-span-1 h-[230px]"; }
    else { cols = [4, 4, 4]; h = "md:h-[420px]"; mob = "col-span-2 h-[210px]"; }
    cols.forEach((c) => out.push(`${mob} ${COL[c]} ${h}`));
    i += size; r++;
  }
  return out;
};

export const CategoriesGrid = () => {
  const { categories } = useCatalogue();
  const mainCategories = getPrimaryMainCategories(categories);
  const visibleCategories = mainCategories.length
    ? mainCategories
    : categories.filter((category) => !category.parentSlug);
  return (
  <section id="collections" data-testid="categories-section" className="py-14 md:py-20 bg-neutral-50 border-y border-neutral-200">
    <div className="max-w-7xl mx-auto px-5 md:px-12">
      <div className="flex items-end justify-between gap-4">
        <SectionHead numeral="I" kicker="Shop the collections" title="Find your" italic="piece" />
        <span className="hidden sm:block mb-9 text-sm text-neutral-500">Four curated collections · Bolarum, Hyderabad</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {visibleCategories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.04}>
            <Link
              to={`/collections/${c.slug}`}
              data-testid={`category-tile-${c.slug}`}
              className="group block h-full bg-white border border-neutral-200 hover:border-emerald transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-3.5 sm:p-4">
                <h3 className="font-marcellus text-sm sm:text-base text-ink group-hover:text-emerald transition-colors">{c.name}</h3>
                <p className="mt-1 text-[10px] sm:text-xs text-neutral-500 line-clamp-2">{c.line}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald">Explore <ArrowRight size={13} /></p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};

export const FeaturedStrip = () => {
  const { featured } = useCatalogue();
  return (
  <section data-testid="featured-section" className="py-14 md:py-20 bg-white border-b border-neutral-200">
    <div className="max-w-7xl mx-auto px-5 md:px-12">
      <Carousel opts={{ align: "center", loop: true }}>
        <div className="flex items-end justify-between gap-4">
          <SectionHead numeral="II" kicker="Featured Collection" title="The signature" italic="edit" />
          <div className="mb-8 flex shrink-0 gap-2 md:mb-10">
            <CarouselPrevious aria-label="Previous featured products" className="static h-9 w-9 translate-y-0 rounded-none border-neutral-300 text-ink hover:bg-neutral-50" />
            <CarouselNext aria-label="Next featured products" className="static h-9 w-9 translate-y-0 rounded-none border-neutral-300 text-ink hover:bg-neutral-50" />
          </div>
        </div>
        <CarouselContent data-testid="featured-scroll" className="-ml-2 pb-4">
          {featured.map((prod, i) => (
            <CarouselItem key={prod.id} className="basis-[286px] pl-2 pr-2 md:basis-[326px]">
              <Reveal delay={i * 0.06}>
                <ProductCard product={prod} testid={`featured-card-${prod.id}`} />
              </Reveal>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  </section>
  );
};

const TRUST = [
  { icon: BadgeCheck, title: "BIS Hallmarked", sub: "100% certified gold" },
  { icon: Gem, title: "Certified Diamonds", sub: "Gemological Institute of America (GIA) & International Gemological Institute (IGI) certified" },
  { icon: Landmark, title: "1897 Legacy", sub: "Five generations of craft" },
  { icon: Star, title: "4.2 Rated", sub: "Google reviews, Bolarum" },
];

export const TrustBar = () => (
  <section data-testid="trust-bar" className="bg-ivory border-b border-gold/25 relative">
    <div className="max-w-7xl mx-auto px-5 md:px-12 py-14 md:py-16 grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0 lg:divide-x lg:divide-gold/25">
      {TRUST.map((t, i) => (
        <Reveal key={t.title} delay={i * 0.1}>
          <div data-testid={`trust-item-${i}`} className="group text-center px-4">
            <t.icon size={24} strokeWidth={1.5} className="text-emerald-800 mx-auto transition-colors duration-200 group-hover:text-wine" />
            <h3 className="font-cinzel text-sm tracking-[0.3em] uppercase mt-5">{t.title}</h3>
            <p className="font-jost text-ink/70 text-xs mt-2">{t.sub}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

const CHAPTERS = [
  ["01", "Provenance", "Every piece is traced to its karigar and its hallmark batch."],
  ["02", "Craftsmanship", "Hand-finished in our Bolarum atelier — never mass-cast."],
  ["03", "Trust", "Five generations of Hyderabad families buy their gold here."],
];

export const Heritage = () => {
  const { storeImage } = useCatalogue();
  return (
  <section id="heritage" data-testid="heritage-section" className="py-24 md:py-36 overflow-hidden">
    <div className="max-w-7xl mx-auto px-5 md:px-12">
      <SectionHead numeral="III" kicker="Our Heritage" title="A house built on" italic="trust" />
      <div className="grid grid-cols-1 md:grid-cols-12 items-start">
        <Reveal className="md:col-span-6">
          <div className="border border-gold/30 p-2 bg-white">
            <div className="relative border border-gold/20 overflow-hidden">
              <img src={storeImage} alt="Bagmar Jewellers store" loading="lazy" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute bottom-5 left-5 bg-wine text-white px-6 py-4">
                <span className="font-marcellus text-2xl block tracking-widest">1897</span>
                <span className="font-jost text-[9px] tracking-[0.35em] uppercase">A Living Legacy</span>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="md:col-span-6 md:-ml-20 md:mt-28 relative z-10 mt-8">
          <Reveal delay={0.15}>
            <div className="bg-ivory border border-gold/30 p-8 md:p-12 shadow-[0_30px_70px_-20px_rgba(197,160,89,0.25)]">
              <p className="font-jost text-ink/75 leading-loose text-sm md:text-base">
                For over a century, Bagmar Jewellers has stood in Sadar Bazar, Bolarum — opposite St. Ann's Boys School — crafting hallmarked gold for the families of Hyderabad. What began as a single counter is today a five-generation house of karigars, gemmologists and storytellers in metal.
              </p>
              <p className="font-cormorant text-xl md:text-2xl text-wine leading-relaxed mt-6">
                "We don't sell online. We invite you in — to hold the piece, feel its weight, and let it choose you."
              </p>
              <div className="mt-9 flex items-center gap-6 border-t border-gold/25 pt-8">
                <span className="font-marcellus text-5xl gold-foil-text">125+</span>
                <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-ink/60">Years of<br />hallmarked craft</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gold/25 border border-gold/25 mt-20">
        {CHAPTERS.map(([num, title, text], i) => (
          <Reveal key={num} delay={i * 0.1}>
            <div data-testid={`chapter-${num}`} className="group bg-white p-8 md:p-10 h-full transition-colors duration-500 hover:bg-cream/50">
              <span className="font-marcellus text-4xl text-emerald-800 inline-block">{num}</span>
              <h3 className="font-marcellus text-lg tracking-[0.15em] uppercase mt-5 transition-colors duration-500 group-hover:text-wine">{title}</h3>
              <p className="font-jost text-sm text-ink/60 leading-relaxed mt-3">{text}</p>
              <span className="mt-6 block h-px w-8 bg-gold/50 transition-all duration-500 group-hover:w-16" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};

export const InstagramSection = () => {
  const { instagram } = useCatalogue();
  const brands = [
    { ...instagram.gold, accent: "text-gold-dark", note: instagram.gold.tagline },
    { ...instagram.silver, accent: "text-ink", note: instagram.silver.tagline },
  ];
  return (
  <section data-testid="instagram-section" className="py-24 md:py-32 bg-cream/60 border-y border-gold/25">
    <div className="max-w-7xl mx-auto px-5 md:px-12">
      <SectionHead numeral="IV" kicker="Follow Our Ateliers" title="On" italic="Instagram" />
      <p className="font-jost text-sm text-ink/60 max-w-xl -mt-8 mb-12 leading-relaxed">
        Two houses, one legacy — follow along for new arrivals, bridal edits and behind-the-scenes from our karigars.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brands.map((b, i) => (
          <Reveal key={b.handle} delay={i * 0.12}>
            <a
              href={b.url}
              target="_blank"
              rel="noreferrer"
              data-testid={`insta-brand-${i}`}
              className="group block bg-white border border-neutral-200 p-2 h-full transition-colors duration-200 hover:border-gold-dark"
            >
              <div className="border border-gold/20 p-8 md:p-11 h-full flex flex-col items-start">
                <span className="w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center text-gold-dark transition-colors duration-500 group-hover:bg-wine group-hover:text-white group-hover:border-wine">
                  <Instagram size={24} strokeWidth={1.3} />
                </span>
                <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-cinzel text-xl md:text-2xl tracking-[0.12em] uppercase text-ink">{b.label}</h3>
                  {b.descriptor && <span className="border border-gold/60 bg-gold-light/35 px-2.5 py-1 font-jost text-[9px] font-medium tracking-[0.12em] uppercase text-wine">{b.descriptor}</span>}
                </div>
                <span className={`font-cormorant text-2xl md:text-3xl mt-1 ${b.accent}`}>@{b.handle}</span>
                <span className="font-jost text-[10px] tracking-[0.3em] uppercase text-ink/50 mt-4">{b.note}</span>
                <span className="mt-8 inline-flex items-center gap-2 font-marcellus text-[11px] tracking-[0.3em] uppercase text-wine group-hover:gap-3.5 transition-all duration-300">
                  Follow on Instagram <ArrowRight size={15} strokeWidth={1.5} />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};

const MapFrame = ({ mapsQuery }) => {
  const ref = useRef(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLoad(true); obs.disconnect(); } },
      { rootMargin: "500px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-[320px] md:h-[430px] border border-gold/20 overflow-hidden bg-cream/60">
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-cream/60">
          <MapPin size={26} strokeWidth={1} className="text-gold-dark animate-pulse" />
          <span className="font-jost text-[10px] tracking-[0.35em] uppercase text-gold-dark">Loading map…</span>
        </div>
      )}
      {load && (
        <iframe
          title="Bagmar Jewellers on Google Maps"
          data-testid="store-map"
          src={mapsQuery}
          className="w-full h-full grayscale-[0.35] contrast-[1.05]"
          loading="lazy"
          onLoad={() => setReady(true)}
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  );
};

export const VisitUs = () => {
  const { store } = useCatalogue();
  return (
  <section id="visit" data-testid="visit-section" className="py-24 md:py-36">
    <div className="max-w-7xl mx-auto px-5 md:px-12">
      <SectionHead numeral="V" kicker="Visit Us" title="The store on" italic="Sadar Bazar, Bolarum, Hyderabad" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-7">
          <div className="border border-gold/30 p-2 bg-white">
            <MapFrame mapsQuery="https://www.google.com/maps?q=Bagmar%20Jewellers%2C%20Sadar%20Bazar%2C%20Bolarum%2C%20Hyderabad%2C%20Telangana%20500010&output=embed" />
            <div className="flex items-center justify-between px-2 pt-3 pb-1">
              <span className="font-marcellus text-[10px] tracking-[0.35em] uppercase text-ink/60">Bolarum, Hyderabad</span>
              <a href={store.mapsUrl} target="_blank" rel="noreferrer" data-testid="maps-directions-link" className="lux-link font-marcellus text-[10px] tracking-[0.35em] uppercase text-gold-dark">
                Get Directions
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="lg:col-span-5">
          <div className="bg-white border border-gold/30 p-8 md:p-11 h-full flex flex-col justify-between gap-10">
            <ul className="space-y-7">
              <li className="flex gap-4">
                <MapPin size={17} strokeWidth={1.2} className="text-wine shrink-0 mt-1" />
                <p className="font-jost text-sm leading-relaxed text-ink/75">{store.address}</p>
              </li>
              <li className="flex gap-4 items-center">
                <Clock size={17} strokeWidth={1.2} className="text-wine shrink-0" />
                <p className="font-jost text-sm text-ink/75">{store.hours}</p>
              </li>
              <li className="flex gap-4 items-center">
                <Phone size={17} strokeWidth={1.2} className="text-wine shrink-0" />
                <a href={store.phoneHref} data-testid="visit-phone" className="lux-link font-jost text-sm text-ink/75 hover:text-wine transition-colors">{store.phone}</a>
              </li>
            </ul>
            <a
              href={store.whatsapp}
              target="_blank"
              rel="noreferrer"
              data-testid="visit-whatsapp-btn"
              className="btn-lux group bg-wine text-white px-8 py-4 font-marcellus text-[10px] tracking-[0.3em] uppercase"
            >
              <span className="btn-fill bg-gold" />
              <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-ink">
                <MessageCircle size={15} strokeWidth={1.5} /> Ask on WhatsApp
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
  );
};
