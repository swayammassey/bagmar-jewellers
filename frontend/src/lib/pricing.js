export const parseAmount = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const parseWeightGrams = (value) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const getProductKarat = (product) => {
  const explicitKarat = Number(product?.karat);
  if ([18, 22, 24].includes(explicitKarat)) return explicitKarat;
  const match = String(product?.material ?? "").match(/\b(18|22|24)\s*KT\b/i);
  return match ? Number(match[1]) : null;
};

export const calculateProductPricing = (product, rates) => {
  const karat = getProductKarat(product);
  const grossWeight = parseWeightGrams(product?.grossWeight);
  const netWeight = parseWeightGrams(product?.netWeight);
  const vaPercent = product?.vaPercent === "" || product?.vaPercent == null
    ? null
    : Number(product.vaPercent);
  const rate = karat ? parseAmount(rates?.[`kt${karat}`]) : 0;

  if (
    !grossWeight ||
    !netWeight ||
    netWeight > grossWeight ||
    vaPercent == null ||
    !Number.isFinite(vaPercent) ||
    vaPercent < 0 ||
    !rate
  ) return null;

  const goldValue = netWeight * rate;
  const vaAmount = goldValue * (vaPercent / 100);
  const subtotal = goldValue + vaAmount;
  const gstAmount = subtotal * 0.03;

  return {
    karat,
    grossWeight,
    netWeight,
    goldValue: Math.round(goldValue),
    vaAmount: Math.round(vaAmount),
    gstAmount: Math.round(gstAmount),
    total: Math.round(subtotal + gstAmount),
  };
};

export const formatGoldRate = (value) => {
  const amount = parseAmount(value);
  return amount ? `₹${amount.toLocaleString("en-IN")}` : "—";
};

export const deriveGoldRatesFrom24 = (value) => {
  const kt24 = parseAmount(value);
  if (kt24 <= 0) return { kt18: "", kt22: "", kt24: value };
  const roundRate = (rate) => Math.round(rate * 100) / 100;
  return {
    kt18: roundRate(kt24 * 18 / 24),
    kt22: roundRate(kt24 * 22 / 24),
    kt24,
  };
};