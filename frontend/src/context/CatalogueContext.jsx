import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseReady } from "../lib/firebase";
import * as mock from "../data/catalogue";

const API = process.env.REACT_APP_BACKEND_URL;
const Ctx = createContext(null);

export const resolveImg = (u) => (u && u.startsWith("/api/") ? `${API}${u}` : u);

export const inr = mock.inr;

export const CatalogueProvider = ({ children }) => {
  const [products, setProducts] = useState(mock.PRODUCTS);
  const [settings, setSettings] = useState(mock.STORE.goldRates);
  const [heroSlides, setHeroSlides] = useState(mock.HERO_SLIDES);
  const [categories, setCategories] = useState(mock.CATEGORIES);

  useEffect(() => {
    if (!firebaseReady) return;
    const unsubs = [];
    try {
      unsubs.push(
        onSnapshot(query(collection(db, "products"), orderBy("id")), (snap) => {
          const docs = snap.docs.map((d) => d.data());
          if (docs.length) setProducts(docs);
        }, () => {})
      );
      unsubs.push(
        onSnapshot(collection(db, "categories"), (snap) => {
          const docs = snap.docs.map((d) => d.data());
          if (docs.length) setCategories(docs);
        }, () => {})
      );
      getDoc(doc(db, "settings", "gold_rates"))
        .then((s) => { if (s.exists()) setSettings({ kt22: s.data().kt22, kt24: s.data().kt24 }); })
        .catch(() => {});
      getDoc(doc(db, "settings", "hero_slides"))
        .then((s) => { if (s.exists() && s.data().slides?.length) setHeroSlides(s.data().slides); })
        .catch(() => {});
    } catch { /* Firebase unreachable — mock fallback stays */ }
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
