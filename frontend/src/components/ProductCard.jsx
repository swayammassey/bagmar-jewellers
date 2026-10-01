import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { inr, resolveImg } from "../context/CatalogueContext";

export const ProductCard = ({ product, testid }) => (
  <Link
    to={`/product/${product.id}`}
    data-testid={testid || `product-card-${product.id}`}
    className="group block h-full bg-white border border-neutral-200 transition-colors duration-200 hover:border-emerald"
  >
    <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <img
          src={resolveImg(product.images[0])}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/[0.025] transition-colors duration-200" />
    </div>
    <div className="flex h-[150px] flex-col p-3.5 md:p-4">
      <p className="font-jost text-[9px] font-medium tracking-[0.1em] uppercase text-neutral-500 truncate">{product.material}</p>
      <h3 className="mt-1.5 font-cormorant text-xl md:text-2xl leading-tight text-ink group-hover:text-emerald transition-colors">{product.name}</h3>
      <p className="font-jost text-[11px] text-neutral-500 mt-1 truncate">
        {product.grossWeight && product.netWeight ? `Gross ${product.grossWeight} g · Net ${product.netWeight} g` : product.weight}
      </p>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <span className="font-jost text-sm font-semibold text-ink">{inr(product.price)}</span>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-emerald">View <ArrowRight size={13} /></span>
      </div>
    </div>
  </Link>
);
