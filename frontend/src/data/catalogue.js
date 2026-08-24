const px = (id, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const us = (path, w = 900) => `https://images.unsplash.com/${path}?q=80&w=${w}&auto=format&fit=crop`;

export const STORE = {
  name: "Bagmar Jewellers",
  tagline: "Heirlooms handcrafted in gold",
  phone: "+91 90301 28008",
  phoneHref: "tel:+919030128008",
  whatsapp: "https://wa.me/919030128008",
  est: "Est. 1987",
  hours: "Open Daily · 10 AM – 9 PM",
  address: "Sadar Bazar, Opp. St. Ann's Boys School, Aditya Bank Colony, Bolarum, Secunderabad, Telangana 500010",
  rating: "4.2",
  goldRates: { kt22: "₹7,245", kt24: "₹7,904" },
  mapsUrl:
    "https://www.google.com/maps/place/Bagmar+jewellers/data=!4m2!3m1!1s0x0:0xe8637bc761aff050",
};

export const waLink = (product) =>
  `${STORE.whatsapp}?text=${encodeURIComponent(
    `Hello Bagmar Jewellers, I'd like to enquire about "${product.name}" (${product.material}, ${product.weight}).\nView it here: ${typeof window !== "undefined" ? window.location.origin : ""}/product/${product.id}`
  )}`;

const IMAGES = {
  necklaces: [
    us("photo-1744369382892-eb5b6a2fdc6f"),
    px(20858950), px(32780784), px(4735890), px(4735888),
    px(8706570), px(29013500), px(4735895), px(36772490),
  ],
  jhumkas: [
    px(37601639), px(13595577), px(13786772), px(11104326),
    px(17184901), px(5585346), px(28851464),
  ],
  tops: [
    us("photo-1693213085235-ea6deadf8cee"), px(13595577), px(4735890),
    px(11104326), us("photo-1611625177738-1cefc4145636"),
    us("photo-1526648856597-c2b6745ad7bd"), px(37601639),
  ],
  bracelets: [
    px(34399145), us("photo-1721206624468-2b3496c3bcfc"), px(8886971),
    px(38765152), px(8886967), px(14873626), px(27024458), px(8886987),
    px(30193752),
  ],
  mens: [
    px(20685355), px(11091437), px(25724263), px(15947180),
    px(38209690), px(936025), us("photo-1575862980756-b0fc07ca49d9"),
  ],
  womens: [
    px(17238390), px(36599395), px(5585346), px(28851464),
    px(17184901), px(30193752), px(27024458), px(13786772),
  ],
  rings: [
    px(936025), us("photo-1611625177738-1cefc4145636"),
    us("photo-1526648856597-c2b6745ad7bd"), px(36599395),
  ],
};

export const HERO_SLIDES = [
  {
    image: px(17238390, 1600),
    kicker: "The Heritage Edit",
    title: "Gold that carries generations",
  },
  {
    image: us("photo-1611591437281-460bfbe1220a", 1600),
    kicker: "Bridal Atelier",
    title: "Every bride deserves a legacy",
  },
  {
    image: px(37601639, 1600),
    kicker: "The Jhumka Vault",
    title: "Bells of gold, whispered in detail",
  },
];

const p = (id, name, cat, material, weight, price, mrp, desc, featured = false) => ({
  id,
  name,
  category: cat,
  material,
  weight,
  price,
  mrp: mrp || null,
  description: desc,
  featured,
  images: [
    IMAGES[cat][id % IMAGES[cat].length],
    IMAGES[cat][(id + 3) % IMAGES[cat].length],
    IMAGES[cat][(id + 5) % IMAGES[cat].length],
  ],
});

export const PRODUCTS = [
  // Necklaces
  p(1, "Rajwadi Temple Haram", "necklaces", "22KT Gold", "48.2 g", 462000, 489000, "A long temple-work haram with Lakshmi motifs, hand-finished by our in-house karigars.", true),
  p(2, "Meenakshi Choker", "necklaces", "22KT Gold", "21.6 g", 198500, null, "A close-set choker with delicate filigree petals — quiet grandeur for intimate evenings."),
  p(3, "Antique Kasu Mala", "necklaces", "22KT Antique Gold", "34.8 g", 331000, null, "Coin-strung kasu mala in an aged finish, echoing old Deccan treasury pieces."),
  p(4, "Nakshi Peacock Necklace", "necklaces", "22KT Gold", "29.4 g", 276400, 299000, "Twin peacocks carved in nakshi relief, strung on a woven gold chain.", true),
  p(5, "Polki Bridal Ranihaar", "necklaces", "22KT Gold · Polki", "56.1 g", 598000, null, "Uncut polki diamonds layered over a bridal-length ranihaar silhouette."),
  p(6, "Everyday Box Chain", "necklaces", "18KT Gold", "8.3 g", 62400, null, "A featherlight box chain made for daily wear — subtle, strong, essential."),
  p(7, "Emerald Drop Necklace", "necklaces", "22KT Gold · Emerald", "17.9 g", 214700, null, "A single Zambian emerald suspended from a hand-linked gold chain."),
  p(8, "Guttapusalu Pearl Necklace", "necklaces", "22KT Gold · Pearl", "38.5 g", 389000, 412000, "Classic Hyderabadi guttapusalu — cascades of rice pearls over temple gold."),
  // Jhumkas
  p(9, "Kundan Dome Jhumkas", "jhumkas", "22KT Gold · Kundan", "18.4 g", 176800, 192000, "Bell-domed jhumkas set with kundan polki and a fringe of gold beads.", true),
  p(10, "Chandbali Pearl Jhumkas", "jhumkas", "22KT Gold · Pearl", "14.2 g", 138500, null, "Crescent chandbali tops flowing into pearl-dropped jhumka bells."),
  p(11, "Antique Ruby Jhumkas", "jhumkas", "22KT Antique Gold", "16.7 g", 162300, null, "Oxidised antique finish with burmese-hued ruby studs."),
  p(12, "Meenakari Jhumkas", "jhumkas", "22KT Gold · Enamel", "12.9 g", 121400, null, "Wine-red meenakari enamelwork on classic dome jhumkas."),
  p(13, "Bridal Layered Jhumkas", "jhumkas", "22KT Gold", "24.6 g", 236900, 251000, "Three-tiered bridal jhumkas with temple bell clusters.", true),
  p(14, "Minimal Gold Drops", "jhumkas", "18KT Gold", "5.8 g", 44200, null, "Pared-back drop jhumkas for workday elegance."),
  p(15, "Nakshi Bell Jhumkas", "jhumkas", "22KT Gold", "19.3 g", 184600, null, "Hand-carved nakshi bells with a soft antique lustre."),
  p(16, "Emerald Bead Jhumkas", "jhumkas", "22KT Gold · Emerald", "15.1 g", 158900, null, "Dome jhumkas fringed with faceted emerald beads."),
  // Tops
  p(17, "Solitaire Stud Tops", "tops", "18KT Gold · Diamond", "3.2 g", 58900, 64500, "Certified solitaire studs in a four-prong 18KT setting.", true),
  p(18, "Floral Gold Tops", "tops", "22KT Gold", "4.6 g", 42800, null, "Five-petal floral tops with a satin-matte finish."),
  p(19, "Pearl Button Tops", "tops", "22KT Gold · Pearl", "3.9 g", 36500, null, "South-sea pearl buttons rimmed in rope-twist gold."),
  p(20, "Geometric Bar Tops", "tops", "18KT Gold", "2.7 g", 24900, null, "Architectural bar studs — the modern minimal earring."),
  p(21, "Ruby Cluster Tops", "tops", "22KT Gold · Ruby", "4.1 g", 47200, 51800, "A cluster of pigeon-blood rubies in classic prong setting."),
  p(22, "Temple Motif Tops", "tops", "22KT Gold", "5.3 g", 49600, null, "Miniature temple-paisley tops with granulation detail."),
  p(23, "Diamond Dewdrop Tops", "tops", "18KT Gold · Diamond", "2.9 g", 61300, null, "A single dewdrop diamond suspended on a fine stem."),
  p(24, "Heritage Coin Tops", "tops", "22KT Antique Gold", "6.4 g", 58700, null, "Coin-disc tops with an aged, museum-piece patina."),
  // Bracelets
  p(25, "Maharani Kada", "bracelets", "22KT Gold", "32.7 g", 314000, 336000, "A bold open-mouth kada with engraved maharani scrollwork.", true),
  p(26, "Tennis Line Bracelet", "bracelets", "18KT Gold · Diamond", "9.8 g", 148500, null, "A river of bezel-set diamonds on a flexible 18KT line."),
  p(27, "Twisted Rope Bangle", "bracelets", "22KT Gold", "14.5 g", 139200, null, "Hand-twisted rope bangle with a high-polish finish."),
  p(28, "Antique Broad Kada", "bracelets", "22KT Antique Gold", "41.2 g", 396800, null, "A museum-broad kada in deep antique gold."),
  p(29, "Pearl Strand Bracelet", "bracelets", "22KT Gold · Pearl", "11.6 g", 98700, 108000, "Twin strands of pearls meeting at a gold filigree clasp."),
  p(30, "Minimal Cuff", "bracelets", "18KT Gold", "8.9 g", 68400, null, "A clean open cuff — one line, no noise."),
  p(31, "Bridal Bangle Pair", "bracelets", "22KT Gold", "27.3 g", 262100, null, "A matched pair of bridal bangles with cutwork edges."),
  p(32, "Emerald Link Bracelet", "bracelets", "22KT Gold · Emerald", "13.4 g", 132600, null, "Emerald cabochons linked in polished gold."),
  // Men's Collection
  p(33, "Figaro Gold Chain", "mens", "22KT Gold", "26.8 g", 257400, 271000, "A weighty figaro chain — the everyday signature for him.", true),
  p(34, "Royal Signet Ring", "mens", "22KT Gold", "11.2 g", 107800, null, "A broad signet ring with a hand-engraved crest face."),
  p(35, "Cuban Link Bracelet", "mens", "22KT Gold", "19.6 g", 188900, null, "Tight cuban links with a box clasp, built to last decades."),
  p(36, "Onyx Stud Ring", "mens", "22KT Gold · Onyx", "9.4 g", 89700, 96200, "A black onyx tablet set in brushed 22KT gold."),
  p(37, "Rudraksha Gold Mala", "mens", "22KT Gold · Rudraksha", "22.1 g", 212600, null, "Gold-capped rudraksha beads on a woven chain."),
  p(38, "Classic Belt Kada", "mens", "22KT Gold", "28.9 g", 277300, null, "A flat belt-textured kada with a concealed hinge."),
  p(39, "Diamond Solitaire Ring", "mens", "18KT Gold · Diamond", "7.8 g", 124600, null, "A single princess-cut diamond in a masculine bezel."),
  p(40, "Curb Chain Lite", "mens", "18KT Gold", "12.3 g", 94800, null, "A lighter curb chain for everyday layering."),
  // Women's Collection
  p(41, "Bridal Polki Set", "womens", "22KT Gold · Polki", "112.4 g", 1186000, 1249000, "The complete bridal parure — necklace, jhumkas, maang tikka.", true),
  p(42, "Mangalsutra Royale", "womens", "22KT Gold · Diamond", "14.8 g", 168700, null, "Black-bead mangalsutra with a diamond paisley pendant."),
  p(43, "Cocktail Bloom Ring", "womens", "18KT Gold · Diamond", "6.2 g", 96400, 104800, "A blooming cocktail ring paved with brilliant cuts."),
  p(44, "Layered Chain Set", "womens", "18KT Gold", "16.4 g", 126300, null, "Three graduated chains worn as one effortless layer."),
  p(45, "Heritage Vaddanam", "womens", "22KT Antique Gold", "86.3 g", 842000, null, "A waist belt of temple medallions — the bridal heirloom."),
  p(46, "Maang Tikka Pearl", "womens", "22KT Gold · Pearl", "8.7 g", 78900, null, "A pearl-fringed maang tikka with a polki centre."),
  p(47, "Everyday Hoop Pair", "womens", "18KT Gold", "4.4 g", 34200, null, "Perfect-weight hoops for every single day."),
  p(48, "Emerald Pendant Set", "womens", "22KT Gold · Emerald", "19.6 g", 208500, 219000, "Pendant and tops set with matched Zambian emeralds."),
  // Rings
  p(49, "Solitaire Promise Ring", "rings", "18KT Gold · Diamond", "3.8 g", 68400, 74500, "A single brilliant-cut solitaire on a knife-edge 18KT band.", true),
  p(50, "Antique Cocktail Ring", "rings", "22KT Antique Gold", "7.6 g", 72900, null, "A bold temple-work cocktail ring with an aged patina."),
  p(51, "Couple Band Pair", "rings", "22KT Gold", "9.8 g", 94200, null, "A matched pair of satin-finish bands, made for two."),
  p(52, "Navratna Ring", "rings", "22KT Gold · Navratna", "6.9 g", 88700, null, "Nine auspicious stones set in a classic temple bezel."),
];

export const CATEGORIES = [
  {
    slug: "necklaces",
    name: "Necklaces",
    line: "Harams, chokers & ranihaars",
    image: us("photo-1601121141461-9d6647bca1ed", 1200),
  },
  {
    slug: "jhumkas",
    name: "Jhumkas",
    line: "Bells of gold & pearl",
    image: us("photo-1596944924616-7b38e7cfac36", 1200),
  },
  {
    slug: "tops",
    name: "Tops",
    line: "Studs for every hour",
    image: us("photo-1535632066927-ab7c9ab60908", 1200),
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    line: "Kadas, cuffs & bangles",
    image: us("photo-1515562141207-7a88fb7ce338", 1200),
  },
  {
    slug: "mens",
    name: "Men's Collection",
    line: "Chains, rings & kadas",
    image: px(11091437, 1200),
  },
  {
    slug: "womens",
    name: "Women's Collection",
    line: "The bridal treasury",
    image: px(36599395, 1600),
  },
  {
    slug: "rings",
    name: "Rings",
    line: "Solitaires & bands",
    image: px(936025, 1200),
  },
];

export const categoryName = (slug) =>
  CATEGORIES.find((c) => c.slug === slug)?.name || slug;

export const productsByCategory = (slug) =>
  PRODUCTS.filter((prod) => prod.category === slug);

export const getProduct = (id) =>
  PRODUCTS.find((prod) => prod.id === Number(id));

export const featuredProducts = PRODUCTS.filter((prod) => prod.featured);

export const inr = (n) => "₹" + n.toLocaleString("en-IN");

export const INSTAGRAM_POSTS = [
  { image: us("photo-1611085583191-a3b181a88401", 800), label: "The Jhumka Vault" },
  { image: px(17238390, 800), label: "Bride Notes" },
  { image: us("photo-1589674781759-c21c37956a44", 800), label: "Inside the Atelier" },
  { image: us("photo-1543294001-f7cd5d7fb516", 800), label: "Henna & Gold" },
  { image: px(37601639, 800), label: "For Her" },
  { image: px(27024458, 800), label: "Detail Study" },
];

export const STORE_IMAGE = px(33257668, 1200);
