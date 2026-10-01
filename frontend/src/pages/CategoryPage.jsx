import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { useCatalogue } from "../context/CatalogueContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const { categories, productsByCategory } = useCatalogue();
  const category = categories.find((c) => c.slug === slug);
  const parentCategory = categories.find((c) => c.slug === category?.parentSlug);
  const products = productsByCategory(slug);
  const subcategories = categories.filter((c) => c.parentSlug === slug);

  if (!category) {
    return (
      <main data-testid="category-not-found" className="py-32 text-center">
        <h1 className="font-cinzel text-4xl uppercase tracking-widest">Collection not found</h1>
        <Link to="/" className="lux-link text-wine font-cinzel text-[11px] tracking-[0.3em] uppercase mt-8 inline-block">Back to home</Link>
      </main>
    );
  }

  return (
    <main data-testid="category-page" className="bg-white min-h-[60vh]">
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-9">
          <nav data-testid="breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500 mb-5 flex-wrap">
            <Link to="/" className="hover:text-emerald">Home</Link>
            {parentCategory && <><ChevronRight size={13} /><Link to={`/collections/${parentCategory.slug}`} className="hover:text-emerald">{parentCategory.name}</Link></>}
            <ChevronRight size={13} /> <span className="text-ink">{category.name}</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="font-jost text-[10px] font-semibold tracking-[0.16em] uppercase text-emerald">Bagmar Jewellers · A Legacy Since 1897</p>
              <h1 className="font-marcellus text-3xl md:text-4xl text-ink mt-2">{category.name}</h1>
              <p className="font-jost text-sm text-neutral-600 mt-2">{category.line}</p>
            </div>
            <span className="text-xs text-neutral-500">{products.length} {products.length === 1 ? "piece" : "pieces"}</span>
          </div>
          {subcategories.length > 0 && (
            <nav aria-label={`${category.name} subcategories`} className="flex flex-wrap gap-2 mt-5">
              {subcategories.map((subcategory) => (
                <Link key={subcategory.slug} to={`/collections/${subcategory.slug}`} className="border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-700 hover:border-emerald hover:text-emerald transition-colors">
                  {subcategory.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <h2 className="font-marcellus text-2xl text-ink">Pieces are being added</h2>
              <p className="mt-2 text-sm text-neutral-500">Contact our Bolarum store for the latest collection.</p>
            </div>
          ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {products.map((prod, i) => (
              <Reveal key={prod.id} delay={(i % 4) * 0.04}>
                <ProductCard product={prod} />
              </Reveal>
            ))}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}
