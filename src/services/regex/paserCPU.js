// CPU Parser
export function parseCPU(t) {
  if (!t) return {};
  const text = t.toUpperCase().replace(/\s+/g, " ");

  const cpuRegex = {
    brand: /\b(INTEL|AMD)\b/,
    line: /\bI[3579]|ULTRA\s[3579]|XEON(?:\sGOLD)?(?:(?:\sPROCESSOR)?(?:\s[EDW][357]?(?=[-| ])|PLATINUM|GOLD|SILVER|BRONZE))?|CELERON|PENTIUM(?:\sGOLD)?|(?:RYZEN\s(?:[3579]|THREADRIPPER(?:\sPRO)?))|EPYC|ATHLON|FX\b/i,
    model: /\b[A-Z]{0,3}\d{3,5}(?=[A-Z]{0,4})/i,
    suffix: /(?:(?<=\d{3,5})[a-z][a-z0-9]*)/i,
  };

  function regexSpecs(t, regex) {
    const regexString = regex;
    const match = t.match(regexString);
    return match ? match[0] : null;
  }

  let specsCPU = {};
  for (const [key, regex] of Object.entries(cpuRegex)) {
    cpuRegex[key] = regexSpecs(text, regex);
    specsCPU = { ...specsCPU, [key]: cpuRegex[key] };
  }

  return specsCPU;
}
