import { brands } from "./allBrand.js";
// 🧩 Hàm chính parse RAM
export function parseRAM(title) {
  const t = title.toUpperCase();

  // Detect brand
  const ramBrand = brands.find((b) => t.includes(b.toUpperCase())) || null;

  // 1️⃣ Detect dung lượng (VD: 16GB, 8G)
  const sizeMatch = t.match(/(\d+)\s*(?:GB|G)\b/);
  const size = sizeMatch ? `${sizeMatch[1]}GB` : null;

  // 2️⃣ Detect bus speed (VD: 3200MHz, 6000MHZ)
  const speedMatch = t.match(/(\d{3,5})\s*M?HZ/);
  const speed = speedMatch ? `${speedMatch[1]}MHz` : null;

  // 3️⃣ Detect DDR gen (VD: DDR4, DDR5)
  const ddrMatch = t.match(/\bD{1,2}R?R?[3456]\b/i);
  const ddr = ddrMatch ? ddrMatch[0].replace(/\s+/g, "") : null;

  // 5️⃣ Detect brand + series
  return {
    brand: ramBrand,
    size,
    speed,
    ddr,
  };
}
