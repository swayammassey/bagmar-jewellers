import { MessageCircle } from "lucide-react";
import { STORE } from "../data/catalogue";

export const FloatingWhatsApp = () => (
  <a
    href={STORE.whatsapp}
    target="_blank"
    rel="noreferrer"
    data-testid="floating-whatsapp-btn"
    aria-label="Ask on WhatsApp"
    className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_12px_30px_rgba(37,211,102,0.35)] hover:scale-110 transition-transform duration-300 flex items-center justify-center"
  >
    <MessageCircle size={24} strokeWidth={1.8} />
  </a>
);
