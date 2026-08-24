import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, MessageCircle, Phone, Clock, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { useCatalogue } from "../context/CatalogueContext";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { categories, store } = useCatalogue();
  const navigate = useNavigate();

  const go = (to) => {
    setOpen(false);
    document.body.style.overflow = "";
    navigate(to);
  };

  const toggle = () => {
    setOpen(!open);
    document.body.style.overflow = open ? "" : "hidden";
  };

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 backdrop-blur-xl bg-ivory/90 border-b border-gold/25"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-24 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden lg:flex items-center gap-8 font-marcellus text-[11px] tracking-[0.25em] uppercase">
          <NavLink to="/" data-testid="nav-home" className="lux-link hover:text-wine transition-colors duration-300">Home</NavLink>
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <button data-testid="nav-collections" className="flex items-center gap-1.5 uppercase hover:text-wine transition-colors duration-300 py-10">
              Collections <ChevronDown size={12} strokeWidth={1.5} />
            </button>
            {mega && (
              <div
                data-testid="mega-menu"
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
                      <span className="font-marcellus text-gold/60 text-[10px]">{["I", "II", "III", "IV", "V", "VI"][i]}</span>
                      <span>
                        <span className="block font-cormorant text-xl normal-case tracking-normal group-hover:text-wine transition-colors duration-300">{c.name}</span>
                        <span className="block font-jost text-[10px] tracking-[0.25em] uppercase text-ink/70 mt-1">{c.line}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/#heritage" data-testid="nav-heritage" className="lux-link hover:text-wine transition-colors duration-300">Heritage</Link>
        </nav>

        <Link to="/" className="lg:justify-self-center shrink-0" aria-label="Bagmar Jewellers home">
          <Logo />
        </Link>

        <div className="hidden lg:flex items-center justify-end gap-8 font-marcellus text-[11px] tracking-[0.25em] uppercase">
          <Link to="/#visit" data-testid="nav-visit" className="lux-link hover:text-wine transition-colors duration-300">Visit Us</Link>
          <Link
            to="/#visit"
            data-testid="visit-store-btn"
            className="btn-lux group inline-flex items-center gap-2 bg-wine text-white px-7 py-3"
          >
            <span className="btn-fill bg-gold" />
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-ink">
              <MapPin size={13} strokeWidth={1.5} /> Visit Store
            </span>
          </Link>
        </div>

        <button
          data-testid="mobile-menu-btn"
          className="lg:hidden relative z-[70] w-10 h-10 flex flex-col items-center justify-center gap-[7px]"
          onClick={toggle}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`block w-6 h-px ${open ? "bg-wine" : "bg-ink"}`}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`block w-6 h-px ${open ? "bg-wine" : "bg-ink"}`}
          />
        </button>
      </div>

      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden fixed inset-0 z-[60] bg-ivory flex flex-col"
          >
            <div className="h-24 px-5 flex items-center justify-between border-b border-gold/25">
              <Logo compact />
              <button
                data-testid="mobile-menu-close"
                onClick={toggle}
                aria-label="Close menu"
                className="w-11 h-11 border border-gold/30 flex items-center justify-center hover:bg-wine hover:border-wine hover:text-white transition-colors duration-300"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6">
              {[{ slug: "", name: "Home", to: "/" }, ...categories.map((c) => ({ slug: c.slug, name: c.name, to: `/collections/${c.slug}` }))].map((item, i) => (
                <motion.button
                  key={item.slug || "home"}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(item.to)}
                  data-testid={item.slug ? `mobile-nav-${item.slug}` : "mobile-nav-home"}
                  className="group w-full flex items-center justify-between py-5 border-b border-gold/20 text-left"
                >
                  <span className="font-marcellus text-2xl text-ink tracking-[0.06em] group-hover:text-wine group-hover:pl-2 transition-all duration-300">
                    {item.name}
                  </span>
                  <ArrowRight size={18} strokeWidth={1.2} className="text-gold-dark group-hover:text-wine group-hover:translate-x-1 transition-all duration-300" />
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="px-6 pb-8 pt-5 border-t border-gold/25 bg-cream/60"
            >
              <div className="flex items-center justify-between font-jost text-[10px] tracking-[0.25em] uppercase text-ink/55 mb-5">
                <span className="flex items-center gap-2"><Phone size={13} className="text-gold-dark" /> {store.phone}</span>
                <span className="flex items-center gap-2"><Clock size={13} className="text-gold-dark" /> 10 AM – 9 PM</span>
              </div>
              <div className="flex gap-3">
                <a href={store.whatsapp} target="_blank" rel="noreferrer" data-testid="mobile-whatsapp-btn" className="flex-1 bg-wine text-white py-4 text-center font-jost text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> Enquire
                </a>
                <button onClick={() => go("/#visit")} data-testid="mobile-visit-btn" className="flex-1 border border-gold text-gold-dark py-4 font-jost text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-2">
                  <MapPin size={14} /> Visit Store
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}
    </header>
  );
};
