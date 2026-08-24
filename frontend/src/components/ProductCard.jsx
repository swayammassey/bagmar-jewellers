import { Link } from "react-router-dom";
import { inr, resolveImg } from "../context/CatalogueContext";

export const ProductCard = ({ product, testid }) => (
  <Link
    to={`/product/${product.id}`}
    data-testid={testid || `product-card-${product.id}`}
    className="group block bg-white border border-gold/25 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_28px_50px_-18px_rgba(197,160,89,0.4)]"
  >
    <div className="p-1.5 md:p-2 border-b border-gold/20">
      <div className="relative aspect-[4/5] overflow-hidden border border-gold/20">
        <img
          src={resolveImg(product.images[0])}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:-rotate-1"
        />
        <span
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: "radial-gradient(340px circle at 50% 32%, rgba(229,193,88,0.28), transparent 70%)" }}
        />
        {product.mrp && product.mrp > product.price && (
          <span data-testid={`discount-badge-${product.id}`} className="absolute top-2 left-2 md:top-3 md:left-3 bg-wine text-white font-marcellus text-[8px] md:text-[9px] tracking-[0.25em] uppercase px-2 py-1 md:px-3 md:py-1.5">
            Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
          </span>
        )}
      </div>
    </div>
    <div className="p-3.5 md:p-6">
      <h3 className="font-cormorant text-lg md:text-xl leading-snug group-hover:text-wine transition-colors duration-500">{product.name}</h3>
      <p className="font-jost text-[8px] md:text-[10px] tracking-[0.22em] md:tracking-[0.28em] uppercase text-ink/70 mt-1.5 md:mt-2">
        {product.material} · {product.weight}
      </p>
      <p className="mt-2.5 md:mt-4 flex items-baseline gap-2 md:gap-3 flex-wrap">
        <span className="font-marcellus text-sm md:text-base text-ink tracking-wide">{inr(product.price)}</span>
        {product.mrp && product.mrp > product.price && (
          <span className="font-jost text-wine/60 line-through text-[10px] md:text-xs">{inr(product.mrp)}</span>
        )}
      </p>
      <span className="lux-link inline-block mt-3 md:mt-5 font-marcellus text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.35em] uppercase text-gold-dark group-hover:text-wine transition-colors duration-500">
        Enquire
      </span>
    </div>
  </Link>
);
