import type { RGBColor, LABColor } from '../types';

// D65 reference white point
const REF_X = 95.047;
const REF_Y = 100.0;
const REF_Z = 108.883;

/**
 * Linearize an sRGB component (0-255) to linear RGB (0-1).
 * Applies the inverse sRGB companding function.
 */
export function srgbToLinear(value: number): number {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB (0-1) to XYZ using the sRGB matrix (D65 illuminant).
 */
export function linearRGBToXYZ(r: number, g: number, b: number): [number, number, number] {
  const X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const Y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const Z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
  return [X * 100, Y * 100, Z * 100];
}

/**
 * Apply the CIELAB f(t) function.
 */
function labF(t: number): number {
  const delta = 6 / 29;
  if (t > delta * delta * delta) {
    return Math.cbrt(t);
  }
  return t / (3 * delta * delta) + 4 / 29;
}

/**
 * Convert XYZ to CIELAB using D65 reference white.
 */
export function xyzToLAB(X: number, Y: number, Z: number): LABColor {
  const fx = labF(X / REF_X);
  const fy = labF(Y / REF_Y);
  const fz = labF(Z / REF_Z);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { L, a, b };
}

/**
 * Convert an sRGB color (0-255 per channel) to CIELAB.
 * This is the standard sRGB → linear RGB → XYZ (D65) → CIELAB pipeline.
 */
export function rgbToLAB(color: RGBColor): LABColor {
  const rLinear = srgbToLinear(color.r);
  const gLinear = srgbToLinear(color.g);
  const bLinear = srgbToLinear(color.b);
  const [X, Y, Z] = linearRGBToXYZ(rLinear, gLinear, bLinear);
  return xyzToLAB(X, Y, Z);
}

/**
 * Convert an RGB color to a hex string.
 */
export function rgbToHex(color: RGBColor): string {
  const toHex = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Compute the median of a numeric array.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
