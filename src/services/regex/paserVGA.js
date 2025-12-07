import { brands } from "./allBrand.js";

export function parseVGA(t) {
  // try several chip patterns including NVIDIA A-series and Quadro lines
  const chipPatterns = [
    /\b(?:RTX|GTX|RX|Arc|Iris\sXe)\s*\w*\d*(?:\s*(?:TI|SUPER|XT|XTX|MAX))?\b/i, // RTX 3080 TI, GTX 1660 SUPER, RX 6700 XT
    /\bRTX\s*A\d{3,4}\b/, // RTX A6000 style
    /\bA\d{3,4}\b/, // A6000, A5000 (NVIDIA professional A-series)
    /\bQUADRO(?:\s*RTX)?\s*\d{3,4}(?:\s*SUPER)?\b/i, // Quadro, Quadro RTX 4000, Quadro RTX 5000 SUPER
    /\bP\d{3,4}\b/, // older Quadro P-series (P2000, P5000)
  ];

  let chip = null;
  for (const re of chipPatterns) {
    const m = t.match(re);
    if (m) {
      chip = m[0];
      break;
    }
  }

  const vgaBrand = brands.find((b) => t.includes(b.toUpperCase())) || null;

  // Detect VRAM
  let vram = null;
  const vramMatch = t.match(/(\d{1,3})\s*G(?:B)?\b/i);
  if (vramMatch) {
    vram = vramMatch[1] + "GB";
  }

  return { brand: vgaBrand, chip, vram };
}
