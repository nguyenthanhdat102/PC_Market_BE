import { brands } from "./allBrand.js";

// 🧩 Hàm chính parse PSU
export function parsePSU(title) {
  const t = title.toUpperCase().replace(/\s+/g, " ");
  // Detect brand
  const psuBrand = brands.find((b) => t.includes(b.toUpperCase())) || null;

  // Detect công suất (W)
  const wattMatch = t.match(/(\d{3,4})\s*W/);
  const watt = wattMatch ? `${wattMatch[1]}W` : null;

  // Detect chuẩn 80 Plus (VD: 80 Plus Gold / Bronze / Platinum)
  const efficiencyMatch = t.match(
    /(\d{2}\s*\+|\d{2}\s*PLUS)\s*(GOLD|BRONZE|SILVER|PLATINUM|TITANIUM)?/i
  );
  const efficiency = efficiencyMatch
    ? `80 Plus ${efficiencyMatch[2] || ""}`.trim()
    : null;

  return {
    brand: psuBrand,
    watt,
    efficiency,
  };
}
