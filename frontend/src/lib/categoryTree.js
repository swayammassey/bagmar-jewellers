const MAIN_COLLECTIONS = [
  { key: "women", slug: "womens-collection", name: "womenscollection" },
  { key: "men", slug: "mens-collection", name: "menscollection" },
  { key: "bridal", slug: "bridal-collection", name: "bridalcollection" },
  { key: "diamond", slug: "diamond-collection", name: "diamondcollection" },
];

export const getMainCollectionKey = (category) => {
  if (!category) return null;
  const normalizedName = String(category.name ?? "").toLowerCase().replace(/[^a-z]/g, "");
  return MAIN_COLLECTIONS.find((collection) => category.slug === collection.slug || normalizedName === collection.name)?.key ?? null;
};

export const isMainCategory = (category) => category?.type === "main" || getMainCollectionKey(category) !== null;

export const getPrimaryMainCategories = (categories) => {
  const primaryByKey = new Map();
  categories.filter((category) => !category.parentSlug && isMainCategory(category)).forEach((category) => {
    const key = getMainCollectionKey(category) ?? `custom:${category.slug}`;
    const previous = primaryByKey.get(key);
    const canonicalSlug = MAIN_COLLECTIONS.find((collection) => collection.key === key)?.slug;
    if (!previous || category.slug === canonicalSlug) primaryByKey.set(key, category);
  });
  return [...primaryByKey.entries()]
    .sort(([leftKey], [rightKey]) => {
      const leftOrder = MAIN_COLLECTIONS.findIndex((collection) => collection.key === leftKey);
      const rightOrder = MAIN_COLLECTIONS.findIndex((collection) => collection.key === rightKey);
      return (leftOrder < 0 ? MAIN_COLLECTIONS.length : leftOrder) - (rightOrder < 0 ? MAIN_COLLECTIONS.length : rightOrder);
    })
    .map(([, category]) => category);
};

export const getCategoryDescendantSlugs = (categories, parentSlug) => {
  const descendants = new Set();
  const pending = [parentSlug];
  const parent = categories.find((category) => category.slug === parentSlug);
  const parentCollectionKey = getMainCollectionKey(parent);

  if (parentCollectionKey) {
    categories.forEach((category) => {
      if (category.slug !== parentSlug && !category.parentSlug && getMainCollectionKey(category) === parentCollectionKey) {
        descendants.add(category.slug);
        pending.push(category.slug);
      }
    });
  }

  while (pending.length) {
    const currentSlug = pending.pop();
    categories
      .filter((category) => category.parentSlug === currentSlug)
      .forEach((category) => {
        if (!descendants.has(category.slug)) {
          descendants.add(category.slug);
          pending.push(category.slug);
        }
      });
  }

  return descendants;
};