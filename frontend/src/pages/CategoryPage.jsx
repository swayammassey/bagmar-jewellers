import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { useCatalogue } from "../context/CatalogueContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, productsByCategory } = useCatalogue();
  const category = categories.find((c) => c.slug === slug);
  const products = productsByCategory(slug);

  if (!category) {
    return (
      <main data-testid="category-not-found" className="py-32 text-center">
        <h1 className="font-cinzel text-4xl uppercase tracking-widest">Collection not found</h1>
        <Link to="/" className="lux-link text-wine font-cinzel text-[11px] tracking-[0.3em] uppercase mt-8 inline-block">Back to home</Link>
      </main>
    );
  }

  return (
    <main data-testid="category-page">
      <section className="relative bg-ink py-16 md:py-24 overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-wine" />
        <span className="font-cinzel absolute -right-4 -bottom-10 text-[10rem] md:text-[16rem] leading-none text-gold/[0.06] select-none pointer-events-none">
          {category.name.slice(0, 1)}
        </span>
        <div className="max-w-7xl mx-auto px-5 md:px-12 relative">
          <nav data-testid="breadcrumb" className="flex items-center gap-2 font-jost text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6">
            <Link to="/" className="hover:text-gold-light transition-colors">Home</Link>
            <ChevronRight size={11} /> <span className="text-gold-light">{category.name}</span>
          </nav>
          <h1 className="font-cinzel text-white text-4xl sm:text-5xl lg:text-6xl uppercase tracking-[0.12em]">{category.name}</h1>
          <div className="h-px w-20 bg-gold/60 my-6" />
          <p className="font-jost text-white/85 font-light max-w-lg leading-relaxed">{category.line} — {products.length} pieces in the current catalogue. Enquire on WhatsApp for today's rate.</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-8">
            {products.map((prod, i) => (
              <Reveal key={prod.id} delay={(i % 4) * 0.07} className={i % 2 === 1 ? "xl:translate-y-12" : ""}>
                <ProductCard product={prod} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
