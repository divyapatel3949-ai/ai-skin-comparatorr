import type { SkinAnalysisResult, ComparisonResult } from '../types';

/**
 * Calculate the relative measured-lightness difference between two skin analysis results.
 *
 * Uses the lower positive L* value as the denominator:
 *   percentage = ((higher - lower) / lower) * 100
 *
 * The L* values come from the CIELAB color space and represent perceptual lightness
 * in the measured image.
 */
export function calculateComparison(
  personA: SkinAnalysisResult,
  personB: SkinAnalysisResult
): ComparisonResult {
  const LA = personA.medianLAB.L;
  const LB = personB.medianLAB.L;

  // Case 3: Both values are equal (within floating point tolerance)
  if (Math.abs(LA - LB) < 0.005) {
    return {
      personA,
      personB,
      lighterPerson: 'equal',
      fairerPerson: 'equal',
      percentageDifference: 0,
      canCalculatePercentage: true,
      explanation: 'Both sampled regions have the same measured skin lightness (0.0% difference).',
      hinglishExplanation: 'Dono persons ka skin tone barabar (equal) hai (0.0% difference).',
    };
  }

  const higher = Math.max(LA, LB);
  const lower = Math.min(LA, LB);
  const lighterPerson: 'A' | 'B' = LA > LB ? 'A' : 'B';

  // Case 4: Denominator is zero or too close to zero
  if (lower < 0.01) {
    return {
      personA,
      personB,
      lighterPerson,
      fairerPerson: lighterPerson,
      percentageDifference: 0,
      canCalculatePercentage: false,
      explanation: `The relative percentage cannot be calculated reliably because Person ${lighterPerson === 'A' ? 'B' : 'A'}'s measured L* value (${lower.toFixed(1)}) is too close to zero.`,
      hinglishExplanation: `Person ${lighterPerson === 'A' ? 'B' : 'A'} ki skin lightness 0 ke kareeb hone ki wajah se percentage calculate nahi kiya ja sakta.`,
    };
  }

  // Cases 1 & 2: Normal calculation
  const percentageDifference = ((higher - lower) / lower) * 100;

  const lighterName = `Person ${lighterPerson}`;
  const darkerName = `Person ${lighterPerson === 'A' ? 'B' : 'A'}`;

  return {
    personA,
    personB,
    lighterPerson,
    fairerPerson: lighterPerson,
    percentageDifference,
    canCalculatePercentage: true,
    explanation: `${lighterName} is ${percentageDifference.toFixed(1)}% fairer than ${darkerName} (higher measured skin lightness).`,
    hinglishExplanation: `${lighterName}, ${darkerName} ki tulna me ${percentageDifference.toFixed(1)}% zyada fair (light) hai.`,
  };
}

/**
 * Format a percentage to one decimal place for display.
 */
export function formatPercentage(value: number): string {
  return value.toFixed(1);
}
