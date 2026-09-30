import { calculateProductPricing, deriveGoldRatesFrom24 } from "./pricing";

describe("deriveGoldRatesFrom24", () => {
  it("derives 18KT and 22KT rates from the entered 24KT rate", () => {
    expect(deriveGoldRatesFrom24(7904)).toEqual({ kt18: 5928, kt22: 7245.33, kt24: 7904 });
  });

  it("clears derived rates when the 24KT rate is empty", () => {
    expect(deriveGoldRatesFrom24("")).toEqual({ kt18: "", kt22: "", kt24: "" });
  });
});

describe("calculateProductPricing", () => {
  it("calculates gold, VA, and 3% GST using net weight and karat rate", () => {
    const pricing = calculateProductPricing(
      { karat: 22, grossWeight: "12 g", netWeight: "10 g", vaPercent: "10" },
      { kt22: "₹1,000" }
    );

    expect(pricing).toMatchObject({
      goldValue: 10000,
      vaAmount: 1000,
      gstAmount: 330,
      total: 11330,
    });
  });

  it("keeps legacy pricing when VA has not been entered", () => {
    expect(calculateProductPricing(
      { material: "22KT Gold", grossWeight: "12 g", netWeight: "10 g", vaPercent: "" },
      { kt22: 1000 }
    )).toBeNull();
  });
});