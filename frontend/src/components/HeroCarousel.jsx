import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCatalogue } from "../context/CatalogueContext";
import { Link } from "react-router-dom";
import { MessageCircle, MapPin, BadgeCheck, Star } from "lucide-react";

const MaskedLine = ({ children, delay = 0, className = "" }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const HeroCarousel = () => {
  const { store, heroSlides } = useCatalogue();
  const [active, setActive] = useState(0);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 60, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 60, damping: 18 });

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % heroSlides.length), 5500);
    return () => clearInterval(t);
  }, [heroSlides.length]);

  const slide = heroSlides[active];

  const handleTilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section data-testid="hero-carousel" className="relative bg-ivory overflow-hidden">
      <span className="font-marcellus absolute -bottom-8 -right-4 text-[24vw] leading-none text-gold/[0.05] select-none pointer-events-none">
        1987
      </span>

      <div className="max-w-7xl mx-auto px-5 md:px-12 pt-8 pb-14 md:pt-14 md:pb-20 grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">
        <div className="lg:col-span-6 relative z-10 order-2 lg:order-1 lg:-mr-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:bg-ivory lg:border lg:border-gold/35 lg:p-2 lg:shadow-[0_40px_90px_-30px_rgba(197,160,89,0.35)]"
          >
            <div className="lg:border lg:border-gold/25 p-1 md:p-11">
              <div className="flex items-center gap-4">
                <motion.span
                  className="h-px bg-gold origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ width: "3rem" }}
                />
                <span data-testid="hero-kicker" className="font-jost text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-gold-dark">
                  {store.est} · Bolarum, Secunderabad
                </span>
              </div>

              <h1
                data-testid="hero-title"
                className="font-marcellus text-ink text-4xl sm:text-5xl lg:text-6xl leading-[1.12] mt-6"
              >
                <MaskedLine delay={0.35}>Heirlooms in gold,</MaskedLine>
                <MaskedLine delay={0.5}>
                  <span>crafted for </span>
                  <span className="font-cormorant gold-foil-text">generations</span>
                </MaskedLine>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="font-jost text-ink/65 text-sm md:text-base leading-loose mt-6 max-w-md"
              >
                BIS hallmarked gold and certified diamonds from Bolarum's trusted house of jewellery. Browse the catalogue — enquire when a piece speaks to you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-4 mt-9"
              >
                <a
                  href={store.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="hero-whatsapp-btn"
                  className="btn-lux group bg-wine text-white px-8 py-4 font-jost text-[11px] tracking-[0.3em] uppercase"
                >
                  <span className="btn-fill bg-gold" />
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-ink">
                    <MessageCircle size={15} strokeWidth={1.5} /> Enquire on WhatsApp
                  </span>
                </a>
                <Link
                  to="/#visit"
                  data-testid="hero-visit-btn"
                  className="btn-lux group border border-ink/25 text-ink px-8 py-4 font-jost text-[11px] tracking-[0.3em] uppercase"
                >
                  <span className="btn-fill bg-ink" />
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-gold-light">
                    <MapPin size={15} strokeWidth={1.5} /> Visit Our Store
                  </span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10 pt-7 border-t border-gold/25"
              >
                <span className="flex items-center gap-2 font-jost text-[10px] tracking-[0.25em] uppercase text-ink/70">
                  <BadgeCheck size={14} strokeWidth={1.4} className="text-gold-dark" /> BIS Hallmarked
                </span>
                <span className="flex items-center gap-2 font-jost text-[10px] tracking-[0.25em] uppercase text-ink/70">
                  <Star size={14} strokeWidth={1.4} className="text-gold-dark" /> 4.2 Google Rated
                </span>
                <span data-testid="hero-gold-rate" className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine">
                  Today · 22KT {store.goldRates.kt22}/g · 24KT {store.goldRates.kt24}/g
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 relative" style={{ perspective: "1200px" }}>
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleTilt}
            onMouseLeave={() => { mx.set(0); my.set(0); }}
            className="border border-gold/30 p-2 bg-white"
          >
            <div className="relative h-[48vh] md:h-[68vh] border border-gold/20 overflow-hidden">
              {heroSlides.map((s, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: i === active ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: "easeInOut" }}
                >
                  <motion.img
                    src={s.image}
                    alt={s.title}
                    className="w-full h-full object-cover"
                    initial={false}
                    animate={{ scale: i === active ? 1 : 1.1 }}
                    transition={{ duration: 7, ease: "easeOut" }}
                  />
                </motion.div>
              ))}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                <span data-testid="hero-slide-caption" className="font-cormorant text-white/90 text-lg md:text-xl">
                  {slide.kicker} — {slide.title.toLowerCase()}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                data-testid={`hero-dot-${i}`}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[2px] transition-all duration-500 ${i === active ? "w-10 bg-gold-dark" : "w-5 bg-gold/30 hover:bg-gold/60"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
