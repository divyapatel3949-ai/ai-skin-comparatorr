import type { RGBColor, LABColor, SelectionRect, SkinAnalysisResult } from '../types';
import { rgbToLAB, rgbToHex, median } from './colorConversion';
import { isSkinPixel, analyzeImageQuality } from './skinDetection';

/**
 * Extract pixel data from a canvas for a given selection rectangle.
 */
export function getPixelsFromCanvas(
  canvas: HTMLCanvasElement,
  selection: SelectionRect
): RGBColor[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas 2D context');

  const { x, y, width, height } = selection;
  
  // Clamp selection to canvas bounds
  const clampedX = Math.max(0, Math.min(x, canvas.width - 1));
  const clampedY = Math.max(0, Math.min(y, canvas.height - 1));
  const clampedW = Math.min(width, canvas.width - clampedX);
  const clampedH = Math.min(height, canvas.height - clampedY);

  if (clampedW <= 0 || clampedH <= 0) return [];

  const imageData = ctx.getImageData(clampedX, clampedY, clampedW, clampedH);
  const data = imageData.data;
  const pixels: RGBColor[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    // Skip transparent pixels
    if (a < 128) continue;

    pixels.push({
      r: data[i],
      g: data[i + 1],
      b: data[i + 2],
    });
  }

  return pixels;
}

/**
 * Filter pixels to only include likely skin-colored pixels.
 * Returns original pixels if skin filtering removes too many.
 */
export function filterSkinPixels(pixels: RGBColor[]): RGBColor[] {
  const skinPixels = pixels.filter(p => isSkinPixel(p.r, p.g, p.b));
  
  // If less than 20% of pixels pass the skin filter,
  // the filter may be too aggressive — return all pixels with a warning
  if (skinPixels.length < pixels.length * 0.2 && skinPixels.length < 50) {
    return pixels;
  }
  
  return skinPixels.length > 0 ? skinPixels : pixels;
}

/**
 * Perform a trimmed filter: remove extreme outliers (top and bottom 5%).
 */
export function trimmedPixels(pixels: RGBColor[]): RGBColor[] {
  if (pixels.length < 20) return pixels;

  // Calculate luminance for each pixel for sorting
  const withLum = pixels.map(p => ({
    ...p,
    lum: 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b,
  }));

  withLum.sort((a, b) => a.lum - b.lum);

  const trimCount = Math.floor(withLum.length * 0.05);
  const trimmed = withLum.slice(trimCount, withLum.length - trimCount);

  return trimmed.map(({ r, g, b }) => ({ r, g, b }));
}

/**
 * Analyze a selected skin region and return comprehensive results.
 */
export function analyzeSkinRegion(
  canvas: HTMLCanvasElement,
  selection: SelectionRect
): SkinAnalysisResult {
  // Get all pixels from the selection
  let pixels = getPixelsFromCanvas(canvas, selection);

  if (pixels.length === 0) {
    throw new Error('No valid pixels found in the selected region. Please select a different area.');
  }

  // Check quality before filtering
  const warnings = analyzeImageQuality(pixels);

  // Filter to skin pixels
  pixels = filterSkinPixels(pixels);

  // Trim outliers
  pixels = trimmedPixels(pixels);

  if (pixels.length === 0) {
    throw new Error('No valid skin pixels found after filtering. Please select a region with visible skin.');
  }

  // Calculate median RGB
  const rValues = pixels.map(p => p.r);
  const gValues = pixels.map(p => p.g);
  const bValues = pixels.map(p => p.b);

  const medianRGB: RGBColor = {
    r: Math.round(median(rValues)),
    g: Math.round(median(gValues)),
    b: Math.round(median(bValues)),
  };

  // Convert to LAB
  const labValues = pixels.map(p => rgbToLAB(p));
  const lValues = labValues.map(l => l.L);
  const aValues = labValues.map(l => l.a);
  const bLabValues = labValues.map(l => l.b);

  const medianLAB: LABColor = {
    L: median(lValues),
    a: median(aValues),
    b: median(bLabValues),
  };

  return {
    medianRGB,
    medianLAB,
    hexColor: rgbToHex(medianRGB),
    pixelCount: pixels.length,
    selection,
    warnings,
  };
}
