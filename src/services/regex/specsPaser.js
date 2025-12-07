import { parseVGA } from "./paserVGA.js";
import { parseCPU } from "./paserCPU.js";
import { parseMainboard } from "./paserMAIN.js";
import { parsePSU } from "./paserPSU.js";
import { parseRAM } from "./paserRAM.js";

export function parseSpecs(title = null, category = null) {
  if (!title) return {};

  const t = title.toUpperCase().replace(/\s+/g, " ").trim();
  let specs = {};

  switch (category.toUpperCase()) {
    case "CPU":
      specs = parseCPU(t);
      break;
    case "VGA":
      specs = parseVGA(t);
      break;
    case "MAIN":
      specs = parseMainboard(t);
      break;
    case "RAM":
      specs = parseRAM(t);
      break;
    case "PSU":
      specs = parsePSU(t);
      break;
  }

  return specs;
}

