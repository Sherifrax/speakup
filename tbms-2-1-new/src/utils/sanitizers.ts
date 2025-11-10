// src/utils/sanitizers.ts

// ✅ Ensure a valid integer (fallback if null/undefined/NaN)
export const sanitizeNumber = (val: any, fallback: number = -1): number =>
  typeof val === "number" && !isNaN(val) ? val : fallback;

// ✅ Ensure a valid decimal/float
export const sanitizeDecimal = (val: any, fallback: number = 0.0): number => {
  const parsed = parseFloat(val);
  return !isNaN(parsed) ? parsed : fallback;
};

// ✅ Ensure boolean (accepts truthy/falsy or "1"/"0")
export const sanitizeBoolean = (val: any, fallback: boolean = false): boolean => {
  if (typeof val === "boolean") return val;
  if (val === "1" || val === 1) return true;
  if (val === "0" || val === 0) return false;
  return fallback;
};

// ✅ Ensure a safe string (trim + fallback)
export const sanitizeString = (val: any, fallback: string = ""): string =>
  typeof val === "string" ? val.trim() : fallback;
