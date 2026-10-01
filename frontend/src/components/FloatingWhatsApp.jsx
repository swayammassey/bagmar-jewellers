import { FaWhatsapp } from "react-icons/fa";
import { STORE } from "../data/catalogue";

const message = "Hi Bagmar Jewellers, I am browsing your website and would like to know more about your collections. Could you please assist me?";

export const FloatingWhatsApp = () => (
  <a
    href={`${STORE.whatsapp}?text=${encodeURIComponent(message)}`}
    target="_blank"
    rel="noreferrer"
    data-testid="floating-whatsapp-btn"
    aria-label="Chat with Bagmar Jewellers on WhatsApp"
    title="Chat with us on WhatsApp"
    className="fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition-transform duration-300 hover:scale-110 md:bottom-6 md:right-6 md:p-4"
  >
    <FaWhatsapp aria-hidden="true" size={26} />
  </a>
);
