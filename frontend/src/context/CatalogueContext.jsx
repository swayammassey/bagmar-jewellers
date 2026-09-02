import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";
import * as mock from "../data/catalogue";

const API = process.env.REACT_APP_BACKEND_URL;
const Ctx = createContext(null);

export const resolveImg = (u) => (u && u.startsWith("/api/") ? `${API}${u}` : u);

export const inr = mock.inr;

// Cache the last real Firestore data so the first paint shows the CURRENT
// catalogue (not old mock images) — eliminates the brief image swap on load.
const CACHE_KEY = "bagmar_catalogue_v1";
const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch { return {}; }
};
const writeCache = (patch) => {
  try {
    const prev = readCache();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...prev, ...patch }));
  } catch { /* storage full / unavailable — ignore */ }
};

export const CatalogueProvider = ({ children }) => {
  const cache = readCache();
  const [products, setProducts] = useState(cache.products?.length ? cache.products : mock.PRODUCTS);
  const [settings, setSettings] = useState(cache.settings || mock.STORE.goldRates);
  const [heroSlides, setHeroSlides] = useState(cache.heroSlides?.length ? cache.heroSlides : mock.HERO_SLIDES);
  const [categories, setCategories] = useState(cache.categories?.length ? cache.categories : mock.CATEGORIES);

  useEffect(() => {
    if (!firebaseReady) return;
    const unsubs = [];
    try {
      unsubs.push(
        onSnapshot(query(collection(db, "products"), orderBy("id")), (snap) => {
          const docs = snap.docs.map((d) => d.data());
          if (docs.length) { setProducts(docs); writeCache({ products: docs }); }
        }, () => {})
      );
      unsubs.push(
        onSnapshot(collection(db, "categories"), (snap) => {
          const docs = snap.docs.map((d) => d.data());
          if (docs.length) { setCategories(docs); writeCache({ categories: docs }); }
        }, () => {})
      );
      getDoc(doc(db, "settings", "gold_rates"))
        .then((s) => { if (s.exists()) { const r = { kt22: s.data().kt22, kt24: s.data().kt24 }; setSettings(r); writeCache({ settings: r }); } })
        .catch(() => {});
      getDoc(doc(db, "settings", "hero_slides"))
        .then((s) => { if (s.exists() && s.data().slides?.length) { setHeroSlides(s.data().slides); writeCache({ heroSlides: s.data().slides }); } })
        .catch(() => {});
    } catch { /* Firebase unreachable — cached/mock fallback stays */ }
    return () => unsubs.forEach((u) => u());
  }, []);

  const categoryName = (slug) => categories.find((c) => c.slug === slug)?.name || slug;

  const value = {
    products,
    settings,
    categories,
    store: { ...mock.STORE, goldRates: settings },
    heroSlides,
    instagramPosts: mock.INSTAGRAM_POSTS,
    instagram: mock.INSTAGRAM,
    storeImage: mock.STORE_IMAGE,
    featured: products.filter((p) => p.featured),
    getProduct: (id) => products.find((p) => p.id === Number(id)),
    productsByCategory: (slug) => products.filter((p) => p.category === slug),
    categoryName,
    inr: mock.inr,
    waLink: mock.waLink,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useCatalogue = () => useContext(Ctx);
