import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin, Search, ShoppingBag, X } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { ProductCard } from "./ProductCard";
import { useCatalogue } from "../context/CatalogueContext";
import { getMainCollectionKey, getPrimaryMainCategories } from "../lib/categoryTree";
import { API_BASE_URL } from "../lib/api";

const ACTIONS = [
  { id: "shop", label: "Shop", icon: ShoppingBag },
  { id: "search", label: "Search", icon: Search },
  { id: "appointment", label: "Book", icon: CalendarDays },
  { id: "visit", label: "Visit", icon: MapPin },
];

export const MobileActionBar = () => {
  const { categories, store, featured, products } = useCatalogue();
  const [panel, setPanel] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [appointmentError, setAppointmentError] = useState("");
  const [appointmentSaved, setAppointmentSaved] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const mainCategories = getPrimaryMainCategories(categories);
  const categoryRoots = categories.filter((category) => !category.parentSlug);
  const shopCategories = mainCategories.length
    ? mainCategories
    : categoryRoots;
  const primaryMainSlugs = new Set(mainCategories.map((category) => category.slug));
  const primaryMainKeys = new Set(mainCategories.map(getMainCollectionKey).filter(Boolean));
  const otherCollections = mainCategories.length
    ? categoryRoots.filter((category) =>
        !primaryMainSlugs.has(category.slug) &&
        !(getMainCollectionKey(category) && primaryMainKeys.has(getMainCollectionKey(category)))
      )
    : [];
  const recommended = (featured.length ? featured : products).slice(0, 6);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (!panel) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [panel]);

  const bookAppointment = async (event) => {
    event.preventDefault();
    setAppointmentError("");
    setWhatsappHref("");
    if (!API_BASE_URL) {
      setAppointmentError("Appointment requests are not connected yet. Please contact us directly on WhatsApp.");
      return;
    }

    const message = `Hi Bagmar Jewellers, I would like to request a store appointment. Name: ${name}. Phone: ${phone}. Preferred date: ${date}. Preferred time: ${time}.`;
    const whatsappUrl = `${store.whatsapp}?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open("about:blank", "_blank");
    if (whatsappWindow) whatsappWindow.opener = null;
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, appointment_date: date, appointment_time: time }),
      });
      if (!response.ok) throw new Error("Appointment request could not be saved.");

      setAppointmentSaved(true);
      if (whatsappWindow) whatsappWindow.location.href = whatsappUrl;
      else setWhatsappHref(whatsappUrl);
    } catch {
      whatsappWindow?.close();
      setAppointmentError("We could not save your request. Please try again or contact us directly on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const title = {
    shop: "Shop collections",
    search: "Search the catalogue",
    appointment: "Book a store visit",
    visit: "Visit our store",
  }[panel];

  return (
    <>
      <nav data-testid="mobile-action-bar" aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto grid min-h-[68px] max-w-lg grid-cols-4 px-2">
          {ACTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-testid={`mobile-action-${id}`}
              aria-label={label}
              aria-haspopup="dialog"
              aria-expanded={panel === id}
              onClick={() => setPanel((current) => current === id ? null : id)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${panel === id ? "text-emerald" : "text-neutral-600 hover:text-emerald"}`}
            >
              <Icon size={20} strokeWidth={1.7} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {panel && (
          <motion.div
            key="mobile-action-sheet"
            className="fixed inset-0 z-[80] flex items-end bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => { if (event.target === event.currentTarget) setPanel(null); }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-action-title"
              className={`w-full overflow-y-auto border-t border-neutral-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] ${panel === "shop" || panel === "search" ? "h-[100dvh] max-h-[100dvh] pt-[calc(env(safe-area-inset-top)+1.25rem)]" : "max-h-[82dvh] pt-5"}`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="mx-auto max-w-lg">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 id="mobile-action-title" className="font-marcellus text-xl text-ink">{title}</h2>
                  <button type="button" onClick={() => setPanel(null)} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center text-ink hover:text-emerald">
                    <X size={21} />
                  </button>
                </div>

                {panel === "shop" && (
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      {shopCategories.map((category) => (
                        <Link
                          key={category.slug}
                          to={`/collections/${category.slug}`}
                          onClick={() => setPanel(null)}
                          className="border border-neutral-200 px-4 py-4 font-marcellus text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    {otherCollections.length > 0 && (
                      <section data-testid="shop-other-collections" className="mt-5 border-t border-neutral-200 pt-4">
                        <h3 className="font-jost text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Other collections</h3>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {otherCollections.map((category) => (
                            <Link
                              key={category.slug}
                              to={`/collections/${category.slug}`}
                              onClick={() => setPanel(null)}
                              className="border border-neutral-200 px-4 py-3 font-marcellus text-sm text-ink transition-colors hover:border-emerald hover:text-emerald"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </section>
                    )}
                    {recommended.length > 0 && (
                      <section data-testid="shop-recommendations" className="mt-8 border-t border-neutral-200 pt-6">
                        <p className="font-jost text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald">A few favourites</p>
                        <h3 className="mt-1 font-marcellus text-lg text-ink">Recommended pieces</h3>
                        <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-4 no-scrollbar">
                          {recommended.map((product) => (
                            <div key={product.id} className="w-[168px] shrink-0">
                              <ProductCard product={product} testid={`shop-recommendation-${product.id}`} />
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {panel === "search" && <SearchBar variant="mobile" onNavigate={() => setPanel(null)} />}

                {panel === "appointment" && (
                  appointmentSaved ? (
                    <div role="status" className="space-y-3">
                      <p className="font-jost text-sm leading-relaxed text-neutral-600">Your request has been saved. Review and send the prefilled message in WhatsApp to contact the store.</p>
                      {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center bg-emerald px-5 text-sm font-semibold text-white">Continue to WhatsApp</a>}
                    </div>
                  ) : (
                    <form onSubmit={bookAppointment} className="space-y-4">
                      <p className="font-jost text-sm leading-relaxed text-neutral-600">We’ll save these details to coordinate your visit. WhatsApp opens with a prefilled message for you to review and send.</p>
                      <label className="block font-jost text-xs font-medium text-neutral-600">
                        Your name
                        <input data-testid="appointment-name" type="text" autoComplete="name" minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} required className="mt-1.5 h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-ink" />
                      </label>
                      <label className="block font-jost text-xs font-medium text-neutral-600">
                        Phone number
                        <input data-testid="appointment-phone" type="tel" inputMode="tel" autoComplete="tel" minLength={8} maxLength={20} value={phone} onChange={(event) => setPhone(event.target.value)} required className="mt-1.5 h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-ink" />
                      </label>
                      <label className="block font-jost text-xs font-medium text-neutral-600">
                        Preferred date
                        <input data-testid="appointment-date" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} required className="mt-1.5 h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-ink" />
                      </label>
                      <label className="block font-jost text-xs font-medium text-neutral-600">
                        Preferred time
                        <input data-testid="appointment-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} required className="mt-1.5 h-12 w-full border border-neutral-300 bg-white px-3 text-sm text-ink" />
                      </label>
                      {appointmentError && <p role="alert" className="font-jost text-sm text-red-700">{appointmentError}</p>}
                      <button type="submit" disabled={submitting} className="min-h-12 w-full bg-emerald px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark disabled:cursor-wait disabled:opacity-60">{submitting ? "Saving request…" : "Request on WhatsApp"}</button>
                    </form>
                  )
                )}

                {panel === "visit" && (
                  <div>
                    <p className="font-jost text-sm leading-relaxed text-neutral-600">{store.address}</p>
                    <p className="mt-3 font-jost text-sm text-neutral-600">{store.hours}</p>
                    <a href={store.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 flex min-h-12 items-center justify-center gap-2 bg-emerald px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-dark">
                      <MapPin size={17} /> Get directions
                    </a>
                  </div>
                )}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};