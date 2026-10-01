import { lazy, Suspense, useEffect } from "react";
import "@/App.css";
import Lenis from "lenis";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CatalogueProvider } from "@/context/CatalogueContext";
import { TopBar } from "@/components/TopBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { MobileActionBar } from "@/components/MobileActionBar";
import { CookieConsent } from "@/components/CookieConsent";
import Home from "@/pages/Home";

const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

const PageLoading = () => (
  <main role="status" className="min-h-[40vh] flex items-center justify-center font-jost text-sm text-neutral-500">
    Loading page…
  </main>
);

const SiteLayout = ({ children }) => (
  <>
    <TopBar />
    <Header />
    {children}
    <Footer />
    <FloatingWhatsApp />
    <MobileActionBar />
    <CookieConsent />
  </>
);

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 });
        else el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <CatalogueProvider>
      <div className="App bg-ivory min-h-screen pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
        <BrowserRouter>
          <ScrollManager />
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
              <Route path="/collections/:slug" element={<SiteLayout><CategoryPage /></SiteLayout>} />
              <Route path="/product/:id" element={<SiteLayout><ProductPage /></SiteLayout>} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </CatalogueProvider>
  );
}

export default App;
