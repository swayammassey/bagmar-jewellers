import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, MessageCircle, MapPin, BadgeCheck, ZoomIn, Gem, Scale, Store, Landmark } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { Lightbox } from "../components/Lightbox";
import { useCatalogue, resolveImg } from "../context/CatalogueContext";

export default function ProductPage() {
      const { id } = useParams();
      const { getProduct, productsByCategory, categoryName, inr, waLink, store } = useCatalogue();
      const product = getProduct(id);
      const [imgIndex, setImgIndex] = useState(0);
      const [lightbox, setLightbox] = useState(false);

      if (!product) {
        return (
          <main data-testid="product-not-found" className="py-32 text-center">
            <h1 className="font-marcellus text-4xl text-ink">Piece not found</h1>
            <Link to="/" className="mt-6 inline-flex text-emerald hover:underline">Back to home</Link>
          </main>
        );
      }

      const images = product.images.map(resolveImg);
      const related = productsByCategory(product.category).filter((item) => item.id !== product.id).slice(0, 4);
      const specs = [
        { icon: Gem, label: "Material", value: product.material, testid: "product-material" },
        ...(product.grossWeight && product.netWeight
          ? [
              { icon: Scale, label: "Gross weight", value: `${product.grossWeight} g`, testid: "product-gross-weight" },
              { icon: Scale, label: "Net gold weight", value: `${product.netWeight} g`, testid: "product-weight" },
            ]
          : [{ icon: Scale, label: "Weight", value: product.weight, testid: "product-weight" }]),
        { icon: BadgeCheck, label: "Certification", value: "BIS Hallmarked", testid: "product-certification" },
        { icon: Store, label: "Availability", value: "In-store · Bolarum", testid: "product-availability" },
      ];
      const next = () => setImgIndex((index) => (index + 1) % images.length);
      const prev = () => setImgIndex((index) => (index - 1 + images.length) % images.length);

      return (
        <main data-testid="product-page" className="bg-white">
          <section className="py-5 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <nav data-testid="breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-5 md:mb-7">
                <Link to="/" className="hover:text-emerald">Home</Link>
                <ChevronRight size={13} />
                <Link to={`/collections/${product.category}`} className="hover:text-emerald">{categoryName(product.category)}</Link>
                <ChevronRight size={13} />
                <span className="text-ink">{product.name}</span>
              </nav>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-start">
                <Reveal className="lg:col-span-7">
                  <div className="flex flex-col-reverse md:flex-row gap-3">
                    <div className="hidden md:flex flex-col gap-2 w-[76px] shrink-0">
                      {images.map((image, index) => (
                        <button key={image + index} data-testid={`gallery-thumb-${index}`} onClick={() => setImgIndex(index)} aria-label={`View image ${index + 1}`} className={`aspect-square overflow-hidden border ${index === imgIndex ? "border-emerald ring-1 ring-emerald" : "border-neutral-200 opacity-70 hover:opacity-100"}`}>
                          <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div data-testid="product-gallery-main" className="relative aspect-[4/5] max-h-[760px] overflow-hidden border border-neutral-200 bg-neutral-50">
                        <motion.div className="flex h-full" style={{ width: `${images.length * 100}%` }} animate={{ x: `-${imgIndex * (100 / images.length)}%` }} transition={{ type: "spring", stiffness: 280, damping: 32 }}>
                          {images.map((image, index) => (
                            <div key={image + index} className="h-full shrink-0" style={{ width: `${100 / images.length}%` }}>
                              <img src={image} alt={`${product.name} view ${index + 1}`} draggable={false} className="w-full h-full object-cover pointer-events-none select-none" />
                            </div>
                          ))}
                        </motion.div>
                        <button data-testid="gallery-zoom-btn" aria-label="Open lightbox" onClick={() => setLightbox(true)} className="absolute bottom-4 right-4 bg-white text-ink p-2.5 border border-neutral-200 hover:text-emerald">
                          <ZoomIn size={17} />
                        </button>
                        <span className="absolute top-4 right-4 bg-white/95 text-neutral-600 text-xs px-2.5 py-1">{imgIndex + 1} / {images.length}</span>
                        {images.length > 1 && <>
                          <button data-testid="gallery-prev" aria-label="Previous image" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-ink p-2.5 border border-neutral-200 hover:text-emerald"><ChevronLeft size={18} /></button>
                          <button data-testid="gallery-next" aria-label="Next image" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-ink p-2.5 border border-neutral-200 hover:text-emerald"><ChevronRight size={18} /></button>
                        </>}
                      </div>
                      <div className="flex md:hidden justify-center gap-2 mt-4">
                        {images.map((image, index) => <button key={image + index} data-testid={`gallery-dot-${index}`} onClick={() => setImgIndex(index)} aria-label={`Image ${index + 1}`} aria-pressed={index === imgIndex} className={`h-1.5 transition-all ${index === imgIndex ? "w-6 bg-emerald" : "w-2 bg-neutral-300"}`} />)}
                      </div>
                    </div>
                  </div>
                </Reveal>

                <div className="lg:col-span-5 lg:sticky lg:top-28">
                  <Reveal delay={0.08}>
                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-emerald">{categoryName(product.category)}</span>
                    <h1 data-testid="product-name" className="font-marcellus text-3xl sm:text-4xl mt-2 leading-tight text-ink">{product.name}</h1>
                    <div className="mt-5 bg-white border border-neutral-200 p-4 md:p-5">
                      <span className="block text-xs text-neutral-500 mb-1">{product.pricing ? "Price · includes 3% GST" : "Current price"}</span>
                      <span data-testid="product-price" className="text-3xl font-semibold text-ink">{inr(product.price)}</span>
                    </div>
                    {product.pricing && <dl data-testid="product-price-breakdown" className="mt-3 border-b border-neutral-200 pb-3 space-y-2 text-sm text-neutral-600">
                      <div className="flex justify-between gap-4"><dt>Gold value · {product.pricing.netWeight} g · {product.pricing.karat}KT</dt><dd className="text-ink">{inr(product.pricing.goldValue)}</dd></div>
                      <div className="flex justify-between gap-4"><dt>Value addition</dt><dd className="text-ink">{inr(product.pricing.vaAmount)}</dd></div>
                      <div className="flex justify-between gap-4"><dt>GST · 3%</dt><dd className="text-ink">{inr(product.pricing.gstAmount)}</dd></div>
                    </dl>}
                    <p className="text-xs text-neutral-500 mt-2">Confirm today’s live rate on WhatsApp.</p>
                    <p data-testid="product-description" className="text-neutral-600 leading-7 mt-5 text-sm">{product.description}</p>

                    <div className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
                      {specs.map((spec) => <div key={spec.label} className="flex items-center gap-3 py-3">
                        <spec.icon size={17} className="text-emerald shrink-0" />
                        <span className="text-xs text-neutral-500">{spec.label}</span>
                        <span data-testid={spec.testid} className="ml-auto text-right text-sm font-medium text-ink">{spec.value}</span>
                      </div>)}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-light text-emerald text-[10px] font-medium px-3 py-1.5"><BadgeCheck size={13} /> BIS Hallmarked</span>
                      <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-[10px] font-medium px-3 py-1.5"><Landmark size={13} /> {store.est}</span>
                      <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-[10px] font-medium px-3 py-1.5"><Store size={13} /> On Display</span>
                    </div>

                    <div className="flex flex-col gap-2.5 mt-6">
                      <a href={waLink(product)} target="_blank" rel="noreferrer" data-testid="enquire-whatsapp-btn" className="flex min-h-12 items-center justify-center gap-2 bg-emerald px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-dark">
                        <MessageCircle size={17} /> Enquire on WhatsApp
                      </a>
                      <Link to="/#visit" data-testid="product-visit-btn" className="flex min-h-12 items-center justify-center gap-2 border border-neutral-300 px-6 py-3 text-sm font-medium text-ink hover:border-emerald hover:text-emerald">
                        <MapPin size={17} /> Visit store to see it
                      </Link>
                    </div>
                    <p className="text-neutral-500 text-xs mt-4 leading-relaxed">This piece is on display at our Sadar Bazar store — open daily, 10:30 AM to 9 PM.</p>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          <section data-testid="related-section" className="py-14 md:py-20 bg-neutral-50 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
              <Reveal><h2 className="font-marcellus text-2xl sm:text-3xl text-ink mb-7">More from {categoryName(product.category)}</h2></Reveal>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                {related.map((item, index) => <Reveal key={item.id} delay={index * 0.04}><ProductCard product={item} testid={`related-card-${item.id}`} /></Reveal>)}
              </div>
            </div>
          </section>

          {lightbox && <Lightbox images={images} index={imgIndex} onClose={() => setLightbox(false)} onPrev={prev} onNext={next} />}
        </main>
      );
    }
