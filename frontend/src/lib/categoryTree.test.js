import { getCategoryDescendantSlugs, getPrimaryMainCategories, isMainCategory } from "./categoryTree";
import { CATEGORIES, PRODUCTS } from "../data/catalogue";

describe("getCategoryDescendantSlugs", () => {
  const categories = [
    { slug: "women", type: "main" },
    { slug: "jewelry", parentSlug: "women" },
    { slug: "rings", parentSlug: "jewelry" },
    { slug: "men", type: "main" },
    { slug: "chains", parentSlug: "men" },
    { slug: "legacy" },
  ];

  it("collects nested descendants without including unrelated or legacy categories", () => {
    expect(getCategoryDescendantSlugs(categories, "women")).toEqual(new Set(["jewelry", "rings"]));
  });

  it("returns an empty set for categories without children", () => {
    expect(getCategoryDescendantSlugs(categories, "legacy")).toEqual(new Set());
  });
});

describe("sample category hierarchy", () => {
  it("contains the four requested main collections", () => {
    expect(CATEGORIES.filter((category) => category.type === "main").map((category) => category.slug)).toEqual([
      "womens-collection",
      "mens-collection",
      "bridal-collection",
      "diamond-collection",
    ]);
  });

  it("assigns every sample product to an existing subcategory", () => {
    const subcategorySlugs = new Set(CATEGORIES.filter((category) => category.type === "subcategory").map((category) => category.slug));
    expect(PRODUCTS.every((product) => subcategorySlugs.has(product.category))).toBe(true);
  });
});

describe("isMainCategory", () => {
  it("recognizes legacy root records by canonical collection name or slug", () => {
    expect(isMainCategory({ slug: "diamond-collection", name: "Diamond Collection" })).toBe(true);
    expect(isMainCategory({ slug: "diamond", name: "Diamond Collection" })).toBe(true);
    expect(isMainCategory({ slug: "diamond", name: "Diamond Rings" })).toBe(false);
  });
});

describe("getPrimaryMainCategories", () => {
  it("prefers canonical roots and avoids duplicate main collections", () => {
    const categories = [
      { slug: "womens", type: "main", name: "Women's Collection" },
      { slug: "diamond-collection", name: "Diamond Collection" },
      { slug: "womens-collection", type: "main", name: "Women's Collection" },
      { slug: "mens-collection", type: "main", name: "Men's Collection" },
    ];

    expect(getPrimaryMainCategories(categories).map((category) => category.slug)).toEqual([
      "womens-collection",
      "mens-collection",
      "diamond-collection",
    ]);
  });

  it("includes duplicate-root products in the canonical parent collection", () => {
    const categories = [
      { slug: "womens", type: "main", name: "Women's Collection" },
      { slug: "womens-collection", type: "main", name: "Women's Collection" },
    ];

    expect(getCategoryDescendantSlugs(categories, "womens-collection")).toContain("womens");
  });
});