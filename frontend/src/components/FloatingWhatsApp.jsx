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
    className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_12px_30px_rgba(37,211,102,0.35)] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
  >
    <FaWhatsapp aria-hidden="true" size={26} />
  </a>
);
