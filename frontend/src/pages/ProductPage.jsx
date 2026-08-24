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
        <h1 className="font-marcellus text-4xl tracking-widest">Piece not found</h1>
        <Link to="/" className="lux-link text-wine font-marcellus text-[11px] tracking-[0.3em] uppercase mt-8 inline-block">Back to home</Link>
      </main>
    );
  }

  const images = product.images.map(resolveImg);
  const related = productsByCategory(product.category).filter((prod) => prod.id !== product.id).slice(0, 4);
  const discount = product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const specs = [
    { icon: Gem, label: "Material", value: product.material, testid: "product-material" },
    { icon: Scale, label: "Net Weight", value: product.weight, testid: "product-weight" },
    { icon: BadgeCheck, label: "Certification", value: "BIS Hallmarked", testid: "product-certification" },
    { icon: Store, label: "Availability", value: "In-store · Bolarum", testid: "product-availability" },
  ];

  const next = () => setImgIndex((i) => (i + 1) % images.length);
  const prev = () => setImgIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <main data-testid="product-page">
      <section className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <nav data-testid="breadcrumb" className="flex items-center gap-2 font-jost text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-ink/60 mb-8 md:mb-10 flex-wrap">
            <Link to="/" className="hover:text-wine transition-colors">Home</Link>
            <ChevronRight size={11} />
            <Link to={`/collections/${product.category}`} className="hover:text-wine transition-colors">{categoryName(product.category)}</Link>
            <ChevronRight size={11} />
            <span className="text-wine">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <Reveal className="lg:col-span-7">
              <div className="flex gap-4">
                <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      data-testid={`gallery-thumb-${i}`}
                      onClick={() => setImgIndex(i)}
                      className={`aspect-square overflow-hidden border transition-all duration-300 ${i === imgIndex ? "border-gold shadow-[0_8px_20px_-6px_rgba(197,160,89,0.5)]" : "border-gold/20 opacity-60 hover:opacity-100"}`}
                    >
                      <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="flex-1">
                  <div className="border border-gold/30 p-1.5 md:p-2 bg-white shadow-[0_30px_70px_-25px_rgba(197,160,89,0.4)]">
                    <div
                      data-testid="product-gallery-main"
                      className="relative aspect-[4/5] overflow-hidden border border-gold/20 bg-cream cursor-grab active:cursor-grabbing"
                    >
                      <motion.div
                        className="flex h-full"
                        style={{ width: `${images.length * 100}%` }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.12}
                        onDragEnd={(e, info) => {
                          if (info.offset.x < -60) next();
                          else if (info.offset.x > 60) prev();
                        }}
                        animate={{ x: `-${imgIndex * (100 / images.length)}%` }}
                        transition={{ type: "spring", stiffness: 280, damping: 32 }}
                      >
                        {images.map((img, i) => (
                          <div key={i} className="h-full shrink-0" style={{ width: `${100 / images.length}%` }}>
                            <img
                              src={img}
                              alt={`${product.name} view ${i + 1}`}
                              draggable={false}
                              className="w-full h-full object-cover pointer-events-none select-none"
                            />
                          </div>
                        ))}
                      </motion.div>

                      <button
                        data-testid="gallery-zoom-btn"
                        aria-label="Open lightbox"
                        onClick={() => setLightbox(true)}
                        className="absolute bottom-4 right-4 bg-ink/60 hover:bg-ink/80 text-white p-2.5 transition-colors"
                      >
                        <ZoomIn size={15} strokeWidth={1.5} />
                      </button>

                      {discount > 0 && (
                        <span data-testid="product-discount-badge" className="absolute top-4 left-4 bg-wine text-white font-marcellus text-[9px] tracking-[0.25em] uppercase px-3 py-1.5">Save {discount}%</span>
                      )}

                      <span className="absolute top-4 right-4 bg-ink/55 text-white/90 font-jost text-[10px] tracking-[0.2em] px-2.5 py-1">
                        {imgIndex + 1} / {images.length}
                      </span>

                      {images.length > 1 && (
                        <>
                          <button
                            data-testid="gallery-prev"
                            aria-label="Previous image"
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2.5 shadow-lg transition-all"
                          >
                            <ChevronLeft size={18} strokeWidth={1.5} />
                          </button>
                          <button
                            data-testid="gallery-next"
                            aria-label="Next image"
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-ink p-2.5 shadow-lg transition-all"
                          >
                            <ChevronRight size={18} strokeWidth={1.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex md:hidden justify-center gap-2 mt-4">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        data-testid={`gallery-dot-${i}`}
                        onClick={() => setImgIndex(i)}
                        aria-label={`Image ${i + 1}`}
                        className={`h-[3px] transition-all duration-400 ${i === imgIndex ? "w-8 bg-gold-dark" : "w-4 bg-gold/30"}`}
                      />
                    ))}
                  </div>
                  <p className="md:hidden text-center font-jost text-[9px] tracking-[0.3em] uppercase text-ink/50 mt-3">Swipe to view more</p>
                </div>
              </div>
            </Reveal>

            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <Reveal delay={0.12}>
                <span className="font-marcellus text-[10px] tracking-[0.45em] uppercase text-gold-dark">{categoryName(product.category)}</span>
                <h1 data-testid="product-name" className="font-marcellus text-3xl sm:text-4xl lg:text-[2.6rem] mt-4 leading-tight text-ink">{product.name}</h1>

                <div className="mt-7 bg-cream/70 border border-gold/30 p-5 md:p-6 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-jost text-[9px] tracking-[0.3em] uppercase text-ink/55 block mb-1.5">Indicative Price</span>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span data-testid="product-price" className="font-marcellus text-3xl text-ink tracking-wide">{inr(product.price)}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span data-testid="product-mrp" className="font-jost text-wine/70 line-through text-sm">{inr(product.mrp)}</span>
                      )}
                    </div>
                  </div>
                  {discount > 0 && (
                    <span className="bg-wine text-white font-marcellus text-[10px] tracking-[0.2em] uppercase px-3.5 py-2 shrink-0">Save {discount}%</span>
                  )}
                </div>
                <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-ink/55 mt-3">Confirm today's live rate on WhatsApp</p>

                <p data-testid="product-description" className="font-jost text-ink/80 leading-loose mt-7 text-[15px]">{product.description}</p>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  {specs.map((s) => (
                    <div key={s.label} className="border border-gold/25 bg-white p-4">
                      <s.icon size={16} strokeWidth={1.3} className="text-gold-dark" />
                      <span className="block font-jost text-[9px] tracking-[0.28em] uppercase text-ink/55 mt-3">{s.label}</span>
                      <span data-testid={s.testid} className="block font-marcellus text-[15px] text-ink mt-1">{s.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2.5 mt-7">
                  <span className="inline-flex items-center gap-1.5 border border-gold/40 text-gold-dark font-jost text-[9px] tracking-[0.25em] uppercase px-3.5 py-2">
                    <BadgeCheck size={12} strokeWidth={1.5} /> BIS Hallmarked
                  </span>
                  <span className="inline-flex items-center gap-1.5 border border-gold/40 text-gold-dark font-jost text-[9px] tracking-[0.25em] uppercase px-3.5 py-2">
                    <Landmark size={12} strokeWidth={1.5} /> {store.est}
                  </span>
                  <span className="inline-flex items-center gap-1.5 border border-gold/40 text-gold-dark font-jost text-[9px] tracking-[0.25em] uppercase px-3.5 py-2">
                    <Store size={12} strokeWidth={1.5} /> On Display
                  </span>
                </div>

                <div className="flex flex-col gap-3.5 mt-9">
                  <a
                    href={waLink(product)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="enquire-whatsapp-btn"
                    className="btn-lux group bg-wine text-white px-8 py-4 font-jost text-[11px] font-medium tracking-[0.3em] uppercase"
                  >
                    <span className="btn-fill bg-gold" />
                    <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-ink">
                      <MessageCircle size={15} strokeWidth={1.5} /> Enquire on WhatsApp
                    </span>
                  </a>
                  <Link
                    to="/#visit"
                    data-testid="product-visit-btn"
                    className="btn-lux group border border-gold text-gold-dark px-8 py-4 font-jost text-[11px] font-medium tracking-[0.3em] uppercase"
                  >
                    <span className="btn-fill bg-gold" />
                    <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-ink">
                      <MapPin size={15} strokeWidth={1.5} /> Visit Store to See It
                    </span>
                  </Link>
                </div>
                <p className="font-jost text-ink/60 text-[13px] mt-6 leading-relaxed">
                  This piece is on display at our Sadar Bazar store — open daily, 10 AM to 9 PM.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section data-testid="related-section" className="py-20 md:py-28 bg-cream/60 border-t border-gold/25">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <Reveal>
            <div className="relative mb-12">
              <span className="font-marcellus absolute -top-16 -left-2 text-[8rem] md:text-[12rem] leading-none text-gold/[0.07] select-none pointer-events-none">VI</span>
              <h2 className="relative font-marcellus text-2xl sm:text-3xl lg:text-4xl tracking-[0.1em] uppercase">More from {categoryName(product.category)}</h2>
              <div className="relative h-px w-20 bg-gold/70 mt-6" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {related.map((prod, i) => (
              <Reveal key={prod.id} delay={i * 0.07} className={i % 2 === 1 ? "lg:translate-y-10" : ""}>
                <ProductCard product={prod} testid={`related-card-${prod.id}`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={images}
          index={imgIndex}
          onClose={() => setLightbox(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </main>
  );
}
