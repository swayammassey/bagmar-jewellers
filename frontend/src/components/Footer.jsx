import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Phone, MapPin, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { useCatalogue } from "../context/CatalogueContext";

export const Footer = () => {
  const { store, categories } = useCatalogue();
  return (
  <footer data-testid="site-footer" className="bg-ink text-white/70 relative overflow-hidden">
    <div className="h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    <span className="font-marcellus absolute bottom-0 left-1/2 -translate-x-1/2 text-[16vw] leading-none text-white/[0.03] select-none pointer-events-none whitespace-nowrap">
      BAGMAR
    </span>
    <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <span className="inline-block">
          <Logo compact white />
        </span>
        <p className="font-jost text-sm leading-loose mt-7 max-w-xs">
          BIS hallmarked gold and certified diamonds, handcrafted in Secunderabad since 1987. A catalogue house — visit us, or enquire on WhatsApp.
        </p>
        <div className="flex gap-5 mt-7">
          <a href="#" data-testid="social-instagram" aria-label="Instagram" className="text-gold hover:text-gold-light transition-colors duration-300"><Instagram size={17} strokeWidth={1.2} /></a>
          <a href="#" data-testid="social-facebook" aria-label="Facebook" className="text-gold hover:text-gold-light transition-colors duration-300"><Facebook size={17} strokeWidth={1.2} /></a>
          <a href="#" data-testid="social-youtube" aria-label="YouTube" className="text-gold hover:text-gold-light transition-colors duration-300"><Youtube size={17} strokeWidth={1.2} /></a>
        </div>
      </div>
      <div className="md:col-span-3">
        <h4 className="font-marcellus text-[10px] tracking-[0.4em] uppercase text-gold mb-7">Collections</h4>
        <ul className="space-y-3.5 font-jost text-sm">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/collections/${c.slug}`} data-testid={`footer-link-${c.slug}`} className="lux-link hover:text-gold-light transition-colors duration-300">{c.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-5">
        <h4 className="font-marcellus text-[10px] tracking-[0.4em] uppercase text-gold mb-7">Visit the Store</h4>
        <ul className="space-y-5 font-jost text-sm">
          <li className="flex gap-3"><MapPin size={15} strokeWidth={1.2} className="text-gold shrink-0 mt-0.5" />{store.address}</li>
          <li className="flex gap-3 items-center"><Phone size={15} strokeWidth={1.2} className="text-gold shrink-0" /><a href={store.phoneHref} data-testid="footer-phone" className="lux-link hover:text-gold-light transition-colors duration-300">{store.phone}</a></li>
          <li className="flex gap-3 items-center"><Clock size={15} strokeWidth={1.2} className="text-gold shrink-0" />{store.hours}</li>
        </ul>
      </div>
    </div>
    <div className="relative border-t border-white/10 py-7 text-center font-marcellus text-[9px] tracking-[0.35em] uppercase text-white/40">
      © {new Date().getFullYear()} Bagmar Jewellers · Bolarum, Secunderabad
    </div>
  </footer>
  );
};
