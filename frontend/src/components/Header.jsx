import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, MessageCircle, Phone, Clock, X, ArrowRight, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { useCatalogue } from "../context/CatalogueContext";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [collExp, setCollExp] = useState(false);
  const { categories, store } = useCatalogue();
  const navigate = useNavigate();

  // Single source of truth keeps the body scroll-lock in sync with the menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => { if (!open) setCollExp(false); }, [open]);

  const go = (to) => { setOpen(false); navigate(to); };
  const navCls = "uppercase text-ink/80 hover:text-wine transition-colors duration-300";

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 backdrop-blur-xl bg-ivory/90 border-b border-gold/25"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-24 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden lg:flex items-center gap-8 font-marcellus text-[11px] tracking-[0.25em]">
          <NavLink to="/" data-testid="nav-home" className={navCls}>Home</NavLink>
          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button data-testid="nav-collections" className={`flex items-center gap-1.5 py-10 ${navCls}`}>
              Collections <ChevronDown size={12} strokeWidth={1.5} className={`transition-transform duration-300 ${mega ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {mega && (
                <motion.div
                  data-testid="mega-menu"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-0 top-full w-[600px] bg-ivory border border-gold/30 shadow-[0_30px_60px_rgba(26,26,26,0.12)] p-3"
                >
                  <div className="border border-gold/25 p-8 grid grid-cols-2 gap-x-10 gap-y-7">
                    {categories.map((c, i) => (
                      <Link
                        key={c.slug}
                        to={`/collections/${c.slug}`}
                        data-testid={`mega-${c.slug}`}
                        className="group flex items-baseline gap-3"
                        onClick={() => setMega(false)}
                      >
                        <span className="font-marcellus text-gold/60 text-[10px]">{["I", "II", "III", "IV", "V", "VI", "VII"][i]}</span>
                        <span>
                          <span className="block font-cormorant text-xl normal-case tracking-normal group-hover:text-wine transition-colors duration-300">{c.name}</span>
                          <span className="block font-jost text-[10px] tracking-[0.25em] uppercase text-ink/70 mt-1">{c.line}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link to="/#heritage" data-testid="nav-heritage" className={navCls}>Heritage</Link>
        </nav>

        <Link to="/" className="lg:justify-self-center shrink-0" aria-label="Bagmar Jewellers home">
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center justify-end gap-6 font-marcellus text-[11px] tracking-[0.25em]">
          <SearchBar variant="desktop" />
          <Link to="/#visit" data-testid="nav-visit" className={navCls}>Visit Us</Link>
          <Link
            to="/#visit"
            data-testid="visit-store-btn"
            className="btn-lux group inline-flex items-center gap-2 bg-wine text-white px-7 py-3 uppercase"
          >
            <span className="btn-fill bg-gold" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-ink">
              <MapPin size={13} strokeWidth={1.5} /> Visit Store
            </span>
          </Link>
        </div>

        {/* Mobile controls — search sits to the LEFT of the menu button */}
        <div className="lg:hidden flex items-center gap-1.5">
          <SearchBar variant="desktop" />
          <button
            data-testid="mobile-menu-btn"
            className="relative z-[70] w-11 h-11 flex items-center justify-center text-ink"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <X size={24} strokeWidth={1.5} />
                </motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Menu size={24} strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              data-testid="mobile-menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden fixed inset-0 z-[60] bg-ivory flex flex-col"
            >
              <div className="h-24 px-5 flex items-center justify-between border-b border-gold/25">
                <Logo compact />
                <button
                  data-testid="mobile-menu-close"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 border border-gold/30 flex items-center justify-center text-ink hover:bg-wine hover:border-wine hover:text-white transition-colors duration-300"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
                <motion.button
                  initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go("/")}
                  data-testid="mobile-nav-home"
                  className="group w-full flex items-center justify-between py-[18px] border-b border-gold/20 text-left"
                >
                  <span className="font-marcellus text-2xl text-ink tracking-[0.06em] group-hover:text-wine transition-colors duration-300">Home</span>
                  <ArrowRight size={18} strokeWidth={1.2} className="text-gold-dark group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>

                {/* Collections — expandable dropdown */}
                <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="border-b border-gold/20">
                  <button
                    data-testid="mobile-collections-toggle"
                    onClick={() => setCollExp((v) => !v)}
                    aria-expanded={collExp}
                    className="group w-full flex items-center justify-between py-[18px] text-left"
                  >
                    <span className="font-marcellus text-2xl text-ink tracking-[0.06em] group-hover:text-wine transition-colors duration-300">Collections</span>
                    <ChevronDown size={20} strokeWidth={1.4} className={`text-gold-dark transition-transform duration-300 ${collExp ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {collExp && (
                      <motion.div
                        data-testid="mobile-collections-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pl-1">
                          {categories.map((c, i) => (
                            <button
                              key={c.slug}
                              onClick={() => go(`/collections/${c.slug}`)}
                              data-testid={`mobile-nav-${c.slug}`}
                              className="group w-full flex items-center gap-3 py-3 text-left"
                            >
                              <span className="font-marcellus text-gold/60 text-[10px] w-5">{["I", "II", "III", "IV", "V", "VI", "VII"][i]}</span>
                              <span className="flex-1">
                                <span className="block font-cormorant text-xl text-ink group-hover:text-wine transition-colors duration-300">{c.name}</span>
                                <span className="block font-jost text-[9px] tracking-[0.25em] uppercase text-ink/50">{c.line}</span>
                              </span>
                              <ArrowRight size={15} strokeWidth={1.2} className="text-gold-dark group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {[{ name: "Heritage", to: "/#heritage", testid: "mobile-nav-heritage" }, { name: "Visit Us", to: "/#visit", testid: "mobile-nav-visit" }].map((item, i) => (
                  <motion.button
                    key={item.testid}
                    initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => go(item.to)}
                    data-testid={item.testid}
                    className="group w-full flex items-center justify-between py-[18px] border-b border-gold/20 text-left"
                  >
                    <span className="font-marcellus text-2xl text-ink tracking-[0.06em] group-hover:text-wine transition-colors duration-300">{item.name}</span>
                    <ArrowRight size={18} strokeWidth={1.2} className="text-gold-dark group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                ))}
              </nav>

              <div className="px-6 pb-8 pt-5 border-t border-gold/25 bg-cream/60">
                <div className="flex items-center justify-between font-jost text-[10px] tracking-[0.25em] uppercase text-ink/55 mb-5">
                  <span className="flex items-center gap-2"><Phone size={13} className="text-gold-dark" /> {store.phone}</span>
                  <span className="flex items-center gap-2"><Clock size={13} className="text-gold-dark" /> 10:30 AM – 9 PM</span>
                </div>
                <div className="flex gap-3">
                  <a href={store.whatsapp} target="_blank" rel="noreferrer" data-testid="mobile-whatsapp-btn" className="flex-1 bg-wine text-white py-4 text-center font-jost text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                    <MessageCircle size={14} /> Enquire
                  </a>
                  <button onClick={() => go("/#visit")} data-testid="mobile-visit-btn" className="flex-1 border border-gold text-gold-dark py-4 font-jost text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                    <MapPin size={14} /> Visit Store
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>, document.body)}
    </header>
  );
};
