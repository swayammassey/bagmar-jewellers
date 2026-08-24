import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pencil, Trash2, Plus, X, LogOut, Upload, Star, FolderPlus, Database, LayoutDashboard, Coins, Image as ImageIcon, FolderOpen, Gem, ExternalLink } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch, query, orderBy } from "firebase/firestore";
import { auth, db, firebaseReady } from "../../lib/firebase";
import { Logo } from "../../components/Logo";
import { resolveImg } from "../../context/CatalogueContext";
import * as mock from "../../data/catalogue";

const EMPTY_FORM = { name: "", category: "necklaces", material: "22KT Gold", weight: "", price: "", mrp: "", description: "", featured: false, images: [] };
const EMPTY_CAT = { name: "", line: "", image: "" };
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "rates", label: "Gold Rates", icon: Coins },
  { id: "hero", label: "Hero Banner", icon: ImageIcon },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "catalogue", label: "Catalogue", icon: Gem },
];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

const Card = ({ id, title, sub, action, children, testid }) => (
  <section id={id} data-testid={testid} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 md:p-7 mb-6 scroll-mt-24">
    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
      <div>
        <h2 className="font-marcellus text-lg md:text-xl text-neutral-900">{title}</h2>
        {sub && <p className="font-jost text-[13px] text-neutral-500 mt-1">{sub}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

const Field = ({ label, children }) => (
  <div>
    <label className="font-jost text-[11px] font-medium tracking-wide uppercase text-neutral-600 block mb-2">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full border border-neutral-300 bg-white rounded-lg px-4 py-2.5 font-jost text-sm text-neutral-900 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition";
const btnWine = "bg-wine text-white rounded-lg px-6 py-3 font-jost text-[11px] font-medium tracking-[0.2em] uppercase hover:bg-wine-dark transition-colors disabled:opacity-60";
const btnGhost = "border border-neutral-300 rounded-lg px-4 py-2.5 font-jost text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-600 hover:border-wine hover:text-wine transition-colors";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [settings, setSettings] = useState({ kt22: "", kt24: "" });
  const [slides, setSlides] = useState(null);
  const [form, setForm] = useState(null);
  const [catForm, setCatForm] = useState(null);
  const [filter, setFilter] = useState("all");
  const [offersOnly, setOffersOnly] = useState(false);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2600); };

  const load = async () => {
    setLoadError(false);
    try {
      const [p, c, s] = await Promise.all([
        getDocs(query(collection(db, "products"), orderBy("id"))),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "settings")),
      ]);
      setProducts(p.docs.map((d) => d.data()));
      setCats(c.docs.map((d) => d.data()));
      const rates = s.docs.find((d) => d.id === "gold_rates");
      if (rates) setSettings({ kt22: rates.data().kt22, kt24: rates.data().kt24 });
      const hero = s.docs.find((d) => d.id === "hero_slides");
      setSlides(hero && hero.data().slides?.length ? hero.data().slides : mock.HERO_SLIDES);
    } catch (e) {
      setLoadError(true);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!firebaseReady) { navigate("/admin/login"); return; }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setMe({ email: user.email });
        load();
      } else {
        navigate("/admin/login");
      }
      setChecking(false);
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await signOut(auth).catch(() => {});
    navigate("/admin/login");
  };

  // Free-tier: compress + resize in the browser, return a data URL stored directly in Firestore.
  const compressToDataUrl = (file, maxDim = 1200, quality = 0.7) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read-failed"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("decode-failed"));
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxDim) { height = Math.round((height * maxDim) / width); width = maxDim; }
          else if (height >= width && height > maxDim) { width = Math.round((width * maxDim) / height); height = maxDim; }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          // Step quality down until it comfortably fits Firestore's 1MB doc limit.
          let q = quality;
          let out = canvas.toDataURL("image/jpeg", q);
          while (out.length > 300000 && q > 0.4) { q -= 0.08; out = canvas.toDataURL("image/jpeg", q); }
          resolve(out);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

  const uploadFile = async (file) => {
    if (file && file.type && !file.type.startsWith("image/")) { notify("Please choose an image file"); return null; }
    notify("Processing photo…");
    // Optional: use Cloudinary if configured (better for very large libraries).
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    if (cloudName && preset) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", preset);
        const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        const d = await r.json();
        if (r.ok && d.secure_url) { notify("Photo uploaded"); return d.secure_url; }
        notify("Upload failed — check Cloudinary preset is Unsigned");
        return null;
      } catch {
        notify("Upload failed — Cloudinary unreachable");
        return null;
      }
    }
    // Default free path — no paid storage needed. Image is optimised and saved with the product.
    try {
      const dataUrl = await compressToDataUrl(file);
      notify("Photo ready — remember to press Save");
      return dataUrl;
    } catch {
      const isHeic = /\.(heic|heif)$/i.test(file?.name || "") || /heic|heif/i.test(file?.type || "");
      notify(isHeic
        ? "iPhone HEIC photos aren't supported — save as JPEG first (Share → Options → JPEG)"
        : "Could not read that image — try a JPG or PNG");
      return null;
    }
  };

  const uploadImage = async (file) => {
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, images: [...f.images, url] }));
  };

  const saveRates = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "gold_rates"), settings);
      notify("Gold rates updated live on the website");
    } catch {
      notify("Save failed — check your connection and try again");
    } finally {
      setSaving(false);
    }
  };

  const saveSlides = async () => {
    if (JSON.stringify({ slides }).length > 1000000) {
      notify("Hero images are too large together — re-upload smaller photos");
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "hero_slides"), { slides });
      notify("Hero banner updated on the website");
    } catch {
      notify("Save failed — try smaller hero photos");
    } finally {
      setSaving(false);
    }
  };

  const setSlide = (i, patch) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const saveProduct = async () => {
    const isNew = !form.id;
    const id = isNew ? Math.max(0, ...products.map((p) => p.id || 0)) + 1 : form.id;
    const payload = { ...form, id, price: parseInt(form.price, 10) || 0, mrp: form.mrp ? parseInt(form.mrp, 10) : null };
    if (JSON.stringify(payload).length > 1000000) {
      notify("Too many/large photos for one product — keep it to ~2 images");
      return;
    }
    const prev = products;
    const next = (isNew ? [...products, payload] : products.map((p) => (p.id === id ? payload : p))).sort((a, b) => (a.id || 0) - (b.id || 0));
    const draft = form;
    setProducts(next); // optimistic — feels instant
    setForm(null);
    notify(isNew ? "Product added" : "Product updated");
    try {
      await setDoc(doc(db, "products", String(id)), payload);
    } catch {
      setProducts(prev);
      setForm(draft); // reopen editor so typed changes aren't lost
      notify("Couldn't save — check your internet and try again");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this piece from the catalogue?")) return;
    const prev = products;
    setProducts(products.filter((p) => p.id !== id));
    notify("Product deleted");
    try { await deleteDoc(doc(db, "products", String(id))); }
    catch { setProducts(prev); notify("Couldn't delete — try again"); }
  };

  const saveCategory = async () => {
    if (!catForm.name.trim()) { notify("Category needs a name"); return; }
    const slug = catForm.slug || slugify(catForm.name);
    if (!catForm.slug && cats.find((c) => c.slug === slug)) { notify("Category already exists"); return; }
    const record = { name: catForm.name.trim(), slug, line: catForm.line || "", image: catForm.image || "" };
    const prev = cats;
    const draft = catForm;
    const isEdit = !!catForm.slug;
    setCats(isEdit ? cats.map((c) => (c.slug === slug ? record : c)) : [...cats, record]); // optimistic
    setCatForm(null);
    notify(isEdit ? "Category updated" : "Category added — it is live on the website");
    try { await setDoc(doc(db, "categories", slug), record); }
    catch { setCats(prev); setCatForm(draft); notify("Couldn't save — try a smaller image or check your internet"); }
  };

  const removeCategory = async (slug) => {
    if (!window.confirm("Delete this category? It must have no products in it.")) return;
    const count = products.filter((p) => p.category === slug).length;
    if (count) { notify(`${count} products still use this category`); return; }
    const prev = cats;
    setCats(cats.filter((c) => c.slug !== slug));
    notify("Category removed");
    try { await deleteDoc(doc(db, "categories", slug)); }
    catch { setCats(prev); notify("Couldn't delete — try again"); }
  };

  const seedCatalogue = async () => {
    if (products.length > 0) { notify("Your catalogue already has products — no need to import"); return; }
    if (!window.confirm("Import the 52-piece sample catalogue into Firebase? Only do this once, on an empty database.")) return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      mock.PRODUCTS.forEach((p) => batch.set(doc(db, "products", String(p.id)), p));
      mock.CATEGORIES.forEach((c) => batch.set(doc(db, "categories", c.slug), c));
      batch.set(doc(db, "settings", "gold_rates"), { kt22: "₹7,245", kt24: "₹7,904" });
      batch.set(doc(db, "settings", "hero_slides"), { slides: mock.HERO_SLIDES });
      await batch.commit();
      await load();
      notify("Sample catalogue imported — the website is live from Firebase");
    } catch (e) {
      notify("Import failed — check Firestore rules allow writes");
    }
    setSeeding(false);
  };

  const visible = products.filter((p) =>
    (filter === "all" || p.category === filter) && (!offersOnly || (p.mrp && p.mrp > p.price))
  );
  const catName = (slug) => cats.find((c) => c.slug === slug)?.name || slug;
  const catCount = (slug) => products.filter((p) => p.category === slug).length;

  if (checking || !me) return <main className="min-h-screen bg-neutral-100 flex items-center justify-center font-jost text-sm text-neutral-500">Loading…</main>;

  const discount = form && form.mrp && form.price && Number(form.mrp) > Number(form.price)
    ? Math.round(((Number(form.mrp) - Number(form.price)) / Number(form.mrp)) * 100)
    : 0;

  const stats = [
    { label: "Pieces", value: products.length },
    { label: "Live Offers", value: products.filter((p) => p.mrp && p.mrp > p.price).length },
    { label: "Featured", value: products.filter((p) => p.featured).length },
    { label: "Categories", value: cats.length },
  ];

  return (
    <main data-testid="admin-dashboard" className="min-h-screen bg-neutral-100 md:flex">
      <aside className="hidden md:flex w-60 shrink-0 bg-ink flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-white/10">
          <Logo compact white />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              data-testid={`admin-nav-${n.id}`}
              onClick={() => scrollTo(n.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-jost text-sm text-white/70 hover:text-gold-light hover:bg-white/5 transition-colors text-left"
            >
              <n.icon size={16} strokeWidth={1.5} className="text-gold" /> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link to="/" data-testid="admin-view-site" className="flex items-center gap-3 px-4 py-3 rounded-lg font-jost text-sm text-white/70 hover:text-gold-light hover:bg-white/5 transition-colors">
            <ExternalLink size={15} strokeWidth={1.5} className="text-gold" /> View Website
          </Link>
          <button data-testid="admin-logout-btn" onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-jost text-sm text-white/70 hover:text-white hover:bg-wine transition-colors text-left">
            <LogOut size={15} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-30 bg-ink px-4 py-3 flex items-center justify-between">
          <Logo compact white />
          <div className="flex items-center gap-2">
            <Link to="/" className="text-gold-light font-jost text-xs flex items-center gap-1.5"><ExternalLink size={13} /> Site</Link>
            <button data-testid="admin-logout-btn-m" onClick={logout} className="text-white/70 font-jost text-xs flex items-center gap-1.5"><LogOut size={13} /> Logout</button>
          </div>
        </div>
        <div className="md:hidden sticky top-[52px] z-30 bg-white border-b border-neutral-200 px-3 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <button key={n.id} data-testid={`admin-nav-m-${n.id}`} onClick={() => scrollTo(n.id)} className="shrink-0 flex items-center gap-1.5 border border-neutral-200 rounded-full px-3.5 py-1.5 font-jost text-xs text-neutral-700">
              <n.icon size={13} className="text-gold-dark" /> {n.label}
            </button>
          ))}
        </div>

        {toast && (
          <div data-testid="admin-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-gold-light font-jost text-xs tracking-wide px-6 py-3.5 rounded-lg shadow-xl whitespace-nowrap">
            {toast}
          </div>
        )}

        <div className="p-4 md:p-8 max-w-5xl">
          <div id="overview" className="scroll-mt-24 mb-6">
            <h1 className="font-marcellus text-2xl text-neutral-900">Overview</h1>
            <p className="font-jost text-[13px] text-neutral-500 mt-1">Signed in as {me.email}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4 md:p-5">
                <span className="font-marcellus text-2xl md:text-3xl text-neutral-900 block">{s.value}</span>
                <span className="font-jost text-[11px] font-medium uppercase tracking-wide text-neutral-500">{s.label}</span>
              </div>
            ))}
          </div>

          {!loaded && (
            <div data-testid="loading-card" className="bg-white rounded-xl border border-neutral-200 p-6 md:p-7 mb-6 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
              <p className="font-jost text-sm text-neutral-600">Loading your catalogue from Firebase…</p>
            </div>
          )}

          {loaded && loadError && (
            <div data-testid="load-error-card" className="bg-white rounded-xl border-2 border-red-300 p-6 md:p-7 mb-6">
              <h2 className="font-marcellus text-lg text-neutral-900">Couldn't load your catalogue</h2>
              <p className="font-jost text-sm text-neutral-600 leading-relaxed max-w-2xl mt-2">
                This is usually a network hiccup — your data is safe in Firebase. Please try again. (Do not import the sample catalogue; your products are still there.)
              </p>
              <button data-testid="load-retry-btn" onClick={load} className={`${btnWine} mt-5`}>Try Again</button>
            </div>
          )}

          {loaded && !loadError && products.length === 0 && (
            <div data-testid="seed-card" className="bg-white rounded-xl border-2 border-dashed border-wine/40 p-6 md:p-7 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Database size={18} strokeWidth={1.5} className="text-wine" />
                <h2 className="font-marcellus text-lg text-neutral-900">Your Firebase database is empty</h2>
              </div>
              <p className="font-jost text-sm text-neutral-600 leading-relaxed max-w-2xl">
                Import the 52-piece sample catalogue (products, categories, hero slides and gold rates) to get started — then edit or delete anything from here.
              </p>
              <button data-testid="seed-import-btn" onClick={seedCatalogue} disabled={seeding} className={`${btnWine} mt-5`}>
                {seeding ? "Importing…" : "Import Sample Catalogue"}
              </button>
            </div>
          )}

          <Card id="rates" title="Today's Gold Rate" sub="Shown on the ticker and hero — updates the website instantly." testid="rates-card"
            action={<button data-testid="rates-save-btn" onClick={saveRates} disabled={saving} className={btnWine}>{saving ? "Saving…" : "Publish Rates"}</button>}>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <Field label="22KT / gram">
                <input data-testid="rate-22-input" value={settings.kt22} onChange={(e) => setSettings({ ...settings, kt22: e.target.value })} className={inputCls} />
              </Field>
              <Field label="24KT / gram">
                <input data-testid="rate-24-input" value={settings.kt24} onChange={(e) => setSettings({ ...settings, kt24: e.target.value })} className={inputCls} />
              </Field>
            </div>
          </Card>

          <Card id="hero" title="Hero Banner" sub="The rotating slides on the home page — photo, kicker and caption." testid="hero-card"
            action={<button data-testid="hero-save-btn" onClick={saveSlides} disabled={saving || !slides} className={btnWine}>{saving ? "Saving…" : "Publish Banner"}</button>}>
            {slides && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slides.map((s, i) => (
                  <div key={i} data-testid={`hero-slide-editor-${i}`} className="border border-neutral-200 rounded-lg p-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-neutral-200 mb-3 bg-neutral-100">
                      <img src={resolveImg(s.image)} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <label className="block border border-dashed border-neutral-300 rounded-lg py-2.5 text-center font-jost text-[11px] font-medium text-neutral-500 cursor-pointer hover:border-wine hover:text-wine transition-colors mb-3">
                      Upload Photo
                      <input data-testid={`hero-upload-${i}`} type="file" accept="image/*" className="hidden"
                        onChange={async (e) => { const f = e.target.files[0]; if (!f) return; const url = await uploadFile(f); if (url) setSlide(i, { image: url }); e.target.value = ""; }} />
                    </label>
                    <input data-testid={`hero-image-url-${i}`} value={s.image} onChange={(e) => setSlide(i, { image: e.target.value })} placeholder="…or image URL" className={`${inputCls} mb-2.5 !text-xs`} />
                    <input data-testid={`hero-kicker-${i}`} value={s.kicker} onChange={(e) => setSlide(i, { kicker: e.target.value })} placeholder="Kicker · e.g. The Heritage Edit" className={`${inputCls} mb-2.5 !text-xs`} />
                    <input data-testid={`hero-title-${i}`} value={s.title} onChange={(e) => setSlide(i, { title: e.target.value })} placeholder="Caption · e.g. Gold that carries generations" className={`${inputCls} !text-xs`} />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card id="categories" title="Categories" sub="Collections shown across the website. A category can be removed only when it has no products." testid="categories-card"
            action={<button data-testid="category-add-btn" onClick={() => setCatForm({ ...EMPTY_CAT })} className="inline-flex items-center gap-2 bg-ink text-gold-light rounded-lg px-5 py-3 font-jost text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-wine transition-colors"><FolderPlus size={13} /> Add Category</button>}>
            {catForm && (
              <div data-testid="category-form" className="border border-neutral-200 rounded-lg bg-neutral-50 p-4 md:p-5 mb-5 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <Field label="Name">
                  <input data-testid="category-name-input" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Anklets" className={inputCls} />
                </Field>
                <Field label="Tagline">
                  <input data-testid="category-line-input" value={catForm.line} onChange={(e) => setCatForm({ ...catForm, line: e.target.value })} placeholder="e.g. Grace for every step" className={inputCls} />
                </Field>
                <div className="flex gap-2">
                  <label className={`${btnGhost} border-dashed cursor-pointer whitespace-nowrap`}>
                    Tile Photo
                    <input data-testid="category-upload-input" type="file" accept="image/*" className="hidden"
                      onChange={async (e) => { const f = e.target.files[0]; if (!f) return; const url = await uploadFile(f); if (url) setCatForm((c) => ({ ...c, image: url })); e.target.value = ""; }} />
                  </label>
                  <button data-testid="category-save-btn" onClick={saveCategory} disabled={saving} className={btnWine}>Save</button>
                  <button onClick={() => setCatForm(null)} className={btnGhost}>Cancel</button>
                </div>
                {catForm.image && (
                  <div className="md:col-span-3 flex items-center gap-4 rounded-lg border border-gold/40 bg-gold/5 p-3">
                    <img data-testid="category-form-preview" src={resolveImg(catForm.image)} alt="" className="w-24 h-20 object-cover rounded-md border border-neutral-200 shrink-0" />
                    <div>
                      <p className="font-jost text-sm font-medium text-wine">New photo selected</p>
                      <p className="font-jost text-xs text-neutral-500 mt-0.5">Press <span className="font-semibold">Save</span> to publish it to the website.</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cats.map((c) => {
                const pendingEdit = catForm && catForm.slug === c.slug;
                const tileImg = pendingEdit && catForm.image ? catForm.image : c.image;
                return (
                <div key={c.slug} data-testid={`category-row-${c.slug}`} className={`border rounded-lg overflow-hidden ${pendingEdit ? "border-gold ring-1 ring-gold/40" : "border-neutral-200"}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    {tileImg && <img src={resolveImg(tileImg)} alt={c.name} className="w-full h-full object-cover" />}
                    {pendingEdit && catForm.image && catForm.image !== c.image && (
                      <span className="absolute top-2 left-2 bg-wine text-white font-jost text-[9px] tracking-[0.15em] uppercase px-2 py-1 rounded">Unsaved photo</span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="font-marcellus text-sm text-neutral-900 truncate">{c.name}</p>
                    <p className="font-jost text-[11px] text-neutral-500 mt-0.5">{catCount(c.slug)} pieces</p>
                    <div className="mt-2 flex items-center gap-4">
                      <button data-testid={`category-edit-${c.slug}`} onClick={() => setCatForm({ name: c.name, line: c.line || "", image: c.image || "", slug: c.slug })} className="inline-flex items-center gap-1.5 font-jost text-[11px] font-medium text-neutral-400 hover:text-wine transition-colors">
                        <Pencil size={11} /> Edit
                      </button>
                      <button data-testid={`category-delete-${c.slug}`} onClick={() => removeCategory(c.slug)} className="inline-flex items-center gap-1.5 font-jost text-[11px] font-medium text-neutral-400 hover:text-wine transition-colors">
                        <Trash2 size={11} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </Card>

          <section id="catalogue" className="scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-marcellus text-lg md:text-xl text-neutral-900">Catalogue · {visible.length} pieces</h2>
              <div className="flex flex-wrap items-center gap-2.5">
                <select data-testid="filter-category" value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputCls} !w-auto`}>
                  <option value="all">All Categories</option>
                  {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                <button data-testid="filter-offers-btn" onClick={() => setOffersOnly(!offersOnly)}
                  className={`rounded-lg px-4 py-2.5 font-jost text-[11px] font-medium tracking-[0.15em] uppercase border transition-colors ${offersOnly ? "bg-wine text-white border-wine" : "border-neutral-300 text-neutral-600 hover:border-wine hover:text-wine"}`}>
                  Offers Only
                </button>
                <button data-testid="product-add-btn" onClick={() => setForm({ ...EMPTY_FORM, category: cats[0]?.slug || "necklaces" })} className="inline-flex items-center gap-2 bg-ink text-gold-light rounded-lg px-4 py-2.5 font-jost text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-wine transition-colors">
                  <Plus size={13} /> Add Product
                </button>
              </div>
            </div>

            <div className="hidden md:block bg-white rounded-xl border border-neutral-200 shadow-sm overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b border-neutral-200 font-jost text-[11px] font-medium tracking-wide uppercase text-neutral-500">
                    <th className="px-5 py-3.5">Piece</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Offer</th>
                    <th className="px-5 py-3.5">Featured</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr key={p.id} data-testid={`product-row-${p.id}`} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={resolveImg(p.images?.[0])} alt="" className="w-11 h-11 object-cover rounded-md border border-neutral-200" />
                          <span className="font-cormorant text-base text-neutral-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-jost text-[13px] text-neutral-600">{catName(p.category)}</td>
                      <td className="px-5 py-3 font-jost text-sm text-neutral-900">₹{p.price?.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3">
                        {p.mrp && p.mrp > p.price ? (
                          <span className="bg-wine text-white font-jost text-[10px] font-medium tracking-wide uppercase px-2.5 py-1 rounded">Save {Math.round(((p.mrp - p.price) / p.mrp) * 100)}%</span>
                        ) : <span className="font-jost text-xs text-neutral-400">—</span>}
                      </td>
                      <td className="px-5 py-3">{p.featured ? <Star size={15} strokeWidth={1.4} className="text-gold-dark fill-gold/30" /> : <span className="font-jost text-xs text-neutral-400">—</span>}</td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button data-testid={`product-edit-${p.id}`} onClick={() => setForm({ ...p, mrp: p.mrp || "" })} className="p-2 border border-neutral-200 rounded-md hover:border-wine hover:text-wine transition-colors" aria-label="Edit"><Pencil size={14} strokeWidth={1.5} /></button>
                          <button data-testid={`product-delete-${p.id}`} onClick={() => remove(p.id)} className="p-2 border border-neutral-200 rounded-md hover:border-wine hover:text-wine transition-colors" aria-label="Delete"><Trash2 size={14} strokeWidth={1.5} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {visible.map((p) => (
                <div key={p.id} data-testid={`product-card-admin-${p.id}`} className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center gap-3.5 shadow-sm">
                  <img src={resolveImg(p.images?.[0])} alt="" className="w-16 h-16 object-cover rounded-lg border border-neutral-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-cormorant text-base leading-tight truncate text-neutral-900">{p.name}</p>
                    <p className="font-jost text-[11px] text-neutral-500 mt-0.5">{catName(p.category)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-jost text-sm text-neutral-900">₹{p.price?.toLocaleString("en-IN")}</span>
                      {p.mrp && p.mrp > p.price && (
                        <span className="bg-wine text-white font-jost text-[9px] font-medium uppercase px-2 py-0.5 rounded">Save {Math.round(((p.mrp - p.price) / p.mrp) * 100)}%</span>
                      )}
                      {p.featured && <Star size={12} strokeWidth={1.4} className="text-gold-dark fill-gold/30" />}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button data-testid={`product-edit-m-${p.id}`} onClick={() => setForm({ ...p, mrp: p.mrp || "" })} className="p-2.5 border border-neutral-200 rounded-md hover:border-wine hover:text-wine transition-colors" aria-label="Edit"><Pencil size={14} strokeWidth={1.5} /></button>
                    <button data-testid={`product-delete-m-${p.id}`} onClick={() => remove(p.id)} className="p-2.5 border border-neutral-200 rounded-md hover:border-wine hover:text-wine transition-colors" aria-label="Delete"><Trash2 size={14} strokeWidth={1.5} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {form && (
        <div data-testid="product-editor" className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-start md:items-center justify-center overflow-y-auto p-3 md:p-8">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto">
            <div className="p-5 md:p-8 max-h-[88vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-marcellus text-lg md:text-xl text-neutral-900">{form.id ? "Edit Piece" : "New Piece"}</h3>
                <button data-testid="editor-close-btn" onClick={() => setForm(null)} className="p-2 hover:text-wine transition-colors" aria-label="Close"><X size={18} strokeWidth={1.5} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Field label="Name"><input data-testid="editor-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
                </div>
                <Field label="Category">
                  <select data-testid="editor-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                    {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Material"><input data-testid="editor-material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputCls} /></Field>
                <Field label="Net Weight"><input data-testid="editor-weight" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="e.g. 18.4 g" className={inputCls} /></Field>
                <Field label="Selling Price (₹)"><input data-testid="editor-price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} /></Field>
                <Field label="Original Price MRP (₹) · creates offer"><input data-testid="editor-mrp" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} placeholder="Leave empty for no offer" className={inputCls} /></Field>
                <div className="flex items-end">
                  {discount > 0 && <span data-testid="editor-offer-preview" className="bg-wine text-white font-jost text-[10px] font-medium tracking-wide uppercase px-3 py-2 rounded">Live offer · Save {discount}%</span>}
                </div>
                <div className="md:col-span-2">
                  <Field label="Description"><textarea data-testid="editor-description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} /></Field>
                </div>
                <label className="md:col-span-2 flex items-center gap-3 font-jost text-sm text-neutral-700 cursor-pointer">
                  <input data-testid="editor-featured" type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#722F37] w-4 h-4" />
                  Show in Featured Collection strip on the home page
                </label>

                <div className="md:col-span-2">
                  <label className="font-jost text-[11px] font-medium tracking-wide uppercase text-neutral-600 block mb-3">Images</label>
                  <div className="flex flex-wrap gap-3">
                    {form.images.map((img, i) => (
                      <div key={i} data-testid={`editor-image-${i}`} className="relative w-20 h-20 rounded-lg border border-neutral-200 overflow-hidden">
                        <img src={resolveImg(img)} alt="" className="w-full h-full object-cover" />
                        <button data-testid={`editor-image-remove-${i}`} onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })} className="absolute top-1 right-1 bg-wine text-white rounded-full p-1" aria-label="Remove image"><X size={10} /></button>
                      </div>
                    ))}
                    <label data-testid="editor-upload-label" className="w-20 h-20 rounded-lg border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-wine hover:text-wine transition-colors text-neutral-500">
                      <Upload size={15} strokeWidth={1.5} />
                      <span className="font-jost text-[9px] font-medium uppercase">Upload</span>
                      <input data-testid="editor-upload-input" type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files[0]; if (f) await uploadImage(f); e.target.value = ""; }} />
                    </label>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input data-testid="editor-image-url" placeholder="…or paste an image URL and press Add" className={`${inputCls} !text-xs`}
                      onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) { setForm({ ...form, images: [...form.images, e.target.value.trim()] }); e.target.value = ""; } }} />
                    <button data-testid="editor-image-url-add"
                      onClick={(e) => { const input = e.target.closest("div").querySelector("input"); if (input.value.trim()) { setForm({ ...form, images: [...form.images, input.value.trim()] }); input.value = ""; } }}
                      className={btnGhost}>Add</button>
                  </div>
                </div>
              </div>

              <button data-testid="editor-save-btn" onClick={saveProduct} disabled={saving} className={`${btnWine} w-full mt-7 !py-4`}>
                {saving ? "Saving…" : "Save to Catalogue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
