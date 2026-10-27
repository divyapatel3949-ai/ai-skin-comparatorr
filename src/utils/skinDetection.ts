import type { RGBColor, SelectionRect } from '../types';

/**
 * Check if a pixel color is likely skin using a documented color-based heuristic.
 *
 * This uses a combination of RGB and relative-channel rules adapted from
 * common skin detection literature (e.g., Peer et al. 2003, Kovac et al. 2003).
 *
 * This is NOT a perfect skin detector — it's a heuristic that works reasonably
 * well for a range of skin tones under neutral lighting.
 */
export function isSkinPixel(r: number, g: number, b: number): boolean {
  // Rule 1: All channels must have minimum intensity (not too dark)
  if (r < 20 || g < 20 || b < 20) return false;

  // Rule 2: Not extreme highlights (likely overexposed)
  if (r > 250 && g > 250 && b > 250) return false;

  // Rule 3: Red channel should generally be the highest for most skin tones
  // But for very dark skin tones, we relax this constraint
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);

  // Rule 4: Not too saturated (avoid pure colors like red clothing)
  // and not too desaturated (avoid grey/white/black)
  const diff = maxChannel - minChannel;
  if (diff < 5) return false; // Too grey
  if (diff > 200) return false; // Too saturated

  // Rule 5: Skin-tone heuristic
  // For lighter skin: R > G > B typically
  // For darker skin: channels are closer together
  // General rule: R should be significant, and B should generally be lowest
  if (r > 40 && g > 20 && b > 15) {
    // Check that the color is in a plausible skin range
    // R should be at least as large as G in most cases
    if (r >= g - 20) {
      // B should generally not dominate
      if (b < r + 30) {
        // The ratio of R to G shouldn't be extreme
        const rgRatio = r / g;
        if (rgRatio > 0.5 && rgRatio < 2.5) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Detect skin pixels in an image and return a bounding rectangle
 * around the largest cluster of skin-colored pixels.
 *
 * Returns null if no reliable skin region is found.
 */
export function detectSkinRegion(
  imageData: globalThis.ImageData,
  imageWidth: number,
  imageHeight: number
): SelectionRect | null {
  const data = imageData.data;
  const skinPixels: { x: number; y: number }[] = [];

  // Sample every other pixel for performance on large images
  const step = Math.max(1, Math.floor(Math.min(imageWidth, imageHeight) / 500));

  for (let y = 0; y < imageHeight; y += step) {
    for (let x = 0; x < imageWidth; x += step) {
      const idx = (y * imageWidth + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      if (isSkinPixel(r, g, b)) {
        skinPixels.push({ x, y });
      }
    }
  }

  if (skinPixels.length < 50) {
    return null;
  }

  // Find the bounding box of skin pixels
  let minX = imageWidth, maxX = 0, minY = imageHeight, maxY = 0;
  for (const p of skinPixels) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  // Focus on the central region of the skin area (likely face/cheek)
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const regionWidth = Math.min((maxX - minX) * 0.3, imageWidth * 0.15);
  const regionHeight = Math.min((maxY - minY) * 0.3, imageHeight * 0.15);

  // Ensure minimum size
  const finalWidth = Math.max(regionWidth, 30);
  const finalHeight = Math.max(regionHeight, 30);

  const selection: SelectionRect = {
    x: Math.max(0, Math.round(centerX - finalWidth / 2)),
    y: Math.max(0, Math.round(centerY - finalHeight / 2)),
    width: Math.round(Math.min(finalWidth, imageWidth - Math.max(0, centerX - finalWidth / 2))),
    height: Math.round(Math.min(finalHeight, imageHeight - Math.max(0, centerY - finalHeight / 2))),
  };

  return selection;
}

/**
 * Analyze skin quality warnings for a set of pixel values.
 */
export function analyzeImageQuality(pixels: RGBColor[]): string[] {
  const warnings: string[] = [];
  if (pixels.length === 0) return warnings;

  let clippedHighCount = 0;
  let clippedLowCount = 0;
  let totalR = 0, totalG = 0, totalB = 0;

  for (const p of pixels) {
    if (p.r > 250 && p.g > 250 && p.b > 250) clippedHighCount++;
    if (p.r < 5 && p.g < 5 && p.b < 5) clippedLowCount++;
    totalR += p.r;
    totalG += p.g;
    totalB += p.b;
  }

  const count = pixels.length;

  if (clippedHighCount / count > 0.2) {
    warnings.push('Excessive highlight clipping detected. The image may be overexposed.');
  }

  if (clippedLowCount / count > 0.2) {
    warnings.push('Severe underexposure detected. The image may be too dark.');
  }

  // Check for color cast
  const avgR = totalR / count;
  const avgG = totalG / count;
  const avgB = totalB / count;
  const avgAll = (avgR + avgG + avgB) / 3;

  if (avgAll > 0) {
    const rDev = Math.abs(avgR - avgAll) / avgAll;
    const gDev = Math.abs(avgG - avgAll) / avgAll;
    const bDev = Math.abs(avgB - avgAll) / avgAll;

    if (rDev > 0.4 || gDev > 0.4 || bDev > 0.4) {
      warnings.push('Possible color cast detected. White balance may affect the accuracy of this comparison.');
    }
  }

  return warnings;
}
