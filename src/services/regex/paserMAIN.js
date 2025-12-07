import { brands } from "./allBrand.js";

export function parseMainboard(t) {
  if (!t) return {};
  const text = t.toUpperCase().replace(/\s+/g, " ");

  const mainBrand = brands.find((b) => t.includes(b.toUpperCase())) || null;

  const chipset =
    text.match(/\b(?:(?:[AHBZX]|TRX|WRX)\d{2,4})/i)?.[0] || null;

  const ramType = 
    text.match()

  return { brand: mainBrand, chipset };
}
