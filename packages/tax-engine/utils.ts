export const floorTo = (value: number, unit: number): number => {
  return Math.floor(value / unit) * unit;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const safeNumber = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return value;
};
