import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";

const CONSENT_COOKIE = "bagmar_cookie_consent";
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

const hasConsentChoice = () => document.cookie.split(";").some((cookie) => cookie.trim().startsWith(`${CONSENT_COOKIE}=`));

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setVisible(!hasConsentChoice());
  }, []);

  const choose = async (choice) => {
    setSaving(true);
    setError("");
    try {
      if (!firebaseReady || !db) throw new Error("Firebase is not configured.");
      await addDoc(collection(db, "cookie_consents"), {
        choice,
        submitted_at: serverTimestamp(),
      });

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${CONSENT_COOKIE}=${choice}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
      setVisible(false);
    } catch (saveError) {
      if (saveError.code === "permission-denied") {
        setError("Firestore denied this save. Publish the cookie-consent rule in Firebase Console, then try again.");
      } else if (saveError.code === "unavailable" || saveError instanceof TypeError) {
        setError("Connection problem. Check your internet connection and try again.");
      } else {
        setError("Your preference could not be saved. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Cookie preferences"
          className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[75] border border-neutral-200 bg-white p-4 shadow-[0_12px_36px_rgba(23,39,36,0.16)] md:bottom-6 md:left-auto md:right-6 md:w-[min(560px,calc(100vw-3rem))] md:p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="font-marcellus text-base text-ink">Your cookie choice</h2>
          <p className="mt-1.5 font-jost text-xs leading-relaxed text-neutral-600">
            Essential cookies keep the catalogue working. Choose whether to allow optional cookies; your preference is saved for one year.
          </p>
          {error && <p role="alert" className="mt-3 font-jost text-xs text-red-700">{error}</p>}
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button type="button" disabled={saving} onClick={() => choose("essential")} className="min-h-10 border border-neutral-300 px-4 font-jost text-xs font-medium text-ink hover:border-emerald disabled:opacity-60">
              {saving ? "Saving…" : "Reject optional"}
            </button>
            <button type="button" disabled={saving} onClick={() => choose("all")} className="min-h-10 bg-emerald px-4 font-jost text-xs font-semibold text-white hover:bg-emerald-dark disabled:opacity-60">
              {saving ? "Saving…" : "Allow all"}
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
