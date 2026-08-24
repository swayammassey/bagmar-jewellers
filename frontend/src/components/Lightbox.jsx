import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const Lightbox = ({ images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  let startX = 0;

  return (
    <div
      data-testid="lightbox"
      className="fixed inset-0 z-[70] bg-ink/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={(e) => (startX = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 50) onPrev();
        if (dx < -50) onNext();
      }}
    >
      <button data-testid="lightbox-close" onClick={onClose} aria-label="Close" className="absolute top-5 right-5 text-white/80 hover:text-gold-light transition-colors p-2">
        <X size={26} strokeWidth={1.2} />
      </button>
      <button
        data-testid="lightbox-prev"
        aria-label="Previous image"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 md:left-8 text-white/70 hover:text-gold-light transition-colors p-2"
      >
        <ChevronLeft size={34} strokeWidth={1} />
      </button>
      <img
        src={images[index]}
        alt="Product view"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[82vh] max-w-[88vw] object-contain shadow-2xl"
      />
      <button
        data-testid="lightbox-next"
        aria-label="Next image"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 md:right-8 text-white/70 hover:text-gold-light transition-colors p-2"
      >
        <ChevronRight size={34} strokeWidth={1} />
      </button>
    </div>
  );
};
