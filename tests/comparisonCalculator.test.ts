import { describe, it, expect } from 'vitest';
import { calculateComparison, formatPercentage } from '../src/utils/comparisonCalculator';
import type { SkinAnalysisResult } from '../src/types';

function createMockSkinResult(L: number, a = 12, b = 18, hex = '#d2a688'): SkinAnalysisResult {
  return {
    medianRGB: { r: 210, g: 166, b: 136 },
    medianLAB: { L, a, b },
    hexColor: hex,
    pixelCount: 1500,
    selection: { x: 50, y: 50, width: 80, height: 80 },
    warnings: [],
  };
}

describe('comparisonCalculator', () => {
  describe('Case 1: Person A has higher L* value', () => {
    it('calculates relative percentage difference using Person B (lower) as denominator', () => {
      // LA = 75, LB = 50 -> ((75 - 50) / 50) * 100 = 50%
      const personA = createMockSkinResult(75);
      const personB = createMockSkinResult(50);

      const result = calculateComparison(personA, personB);

      expect(result.lighterPerson).toBe('A');
      expect(result.fairerPerson).toBe('A');
      expect(result.canCalculatePercentage).toBe(true);
      expect(result.percentageDifference).toBeCloseTo(50.0, 1);
      expect(result.explanation).toContain('Person A is 50.0% fairer than Person B');
      expect(result.hinglishExplanation).toContain('Person A, Person B ki tulna me 50.0% zyada fair');
    });

    it('handles fractional percentage differences correctly', () => {
      // LA = 65, LB = 60 -> ((65 - 60) / 60) * 100 = 8.333...%
      const personA = createMockSkinResult(65);
      const personB = createMockSkinResult(60);

      const result = calculateComparison(personA, personB);

      expect(result.lighterPerson).toBe('A');
      expect(result.percentageDifference).toBeCloseTo(8.333, 2);
      expect(result.explanation).toContain('8.3% fairer');
    });
  });

  describe('Case 2: Person B has higher L* value', () => {
    it('calculates relative percentage difference using Person A (lower) as denominator', () => {
      // LA = 40, LB = 60 -> ((60 - 40) / 40) * 100 = 50%
      const personA = createMockSkinResult(40);
      const personB = createMockSkinResult(60);

      const result = calculateComparison(personA, personB);

      expect(result.lighterPerson).toBe('B');
      expect(result.fairerPerson).toBe('B');
      expect(result.canCalculatePercentage).toBe(true);
      expect(result.percentageDifference).toBeCloseTo(50.0, 1);
      expect(result.explanation).toContain('Person B is 50.0% fairer than Person A');
      expect(result.hinglishExplanation).toContain('Person B, Person A ki tulna me 50.0% zyada fair');
    });
  });

  describe('Case 3: Equal L* values', () => {
    it('returns equal result with 0.0% relative difference', () => {
      const personA = createMockSkinResult(62.5);
      const personB = createMockSkinResult(62.5);

      const result = calculateComparison(personA, personB);

      expect(result.lighterPerson).toBe('equal');
      expect(result.fairerPerson).toBe('equal');
      expect(result.canCalculatePercentage).toBe(true);
      expect(result.percentageDifference).toBe(0);
      expect(result.explanation).toContain('Both sampled regions have the same measured skin lightness');
    });

    it('treats floating point values within 0.005 tolerance as equal', () => {
      const personA = createMockSkinResult(62.501);
      const personB = createMockSkinResult(62.503);

      const result = calculateComparison(personA, personB);

      expect(result.lighterPerson).toBe('equal');
      expect(result.percentageDifference).toBe(0);
    });
  });

  describe('Case 4: Denominator is zero or near zero', () => {
    it('handles L* = 0 denominator safely without Infinity or NaN', () => {
      const personA = createMockSkinResult(45);
      const personB = createMockSkinResult(0);

      const result = calculateComparison(personA, personB);

      expect(result.canCalculatePercentage).toBe(false);
      expect(result.percentageDifference).toBe(0);
      expect(Number.isFinite(result.percentageDifference)).toBe(true);
      expect(result.explanation).toContain('cannot be calculated reliably');
    });

    it('handles denominator < 0.01 safely', () => {
      const personA = createMockSkinResult(0.005);
      const personB = createMockSkinResult(50);

      const result = calculateComparison(personA, personB);

      expect(result.canCalculatePercentage).toBe(false);
      expect(result.percentageDifference).toBe(0);
      expect(result.explanation).toContain('too close to zero');
    });
  });

  describe('Symmetry and Swapping Behavior', () => {
    it('swapping Person A and Person B reverses the lighterPerson and preserves calculation', () => {
      const person1 = createMockSkinResult(70);
      const person2 = createMockSkinResult(50);

      const resA = calculateComparison(person1, person2);
      expect(resA.lighterPerson).toBe('A');
      expect(resA.percentageDifference).toBeCloseTo(40.0, 1);

      const resB = calculateComparison(person2, person1);
      expect(resB.lighterPerson).toBe('B');
      expect(resB.percentageDifference).toBeCloseTo(40.0, 1);

      expect(resA.percentageDifference).toBe(resB.percentageDifference);
    });
  });

  describe('formatPercentage', () => {
    it('rounds to one decimal place', () => {
      expect(formatPercentage(12.345)).toBe('12.3');
      expect(formatPercentage(12.365)).toBe('12.4');
      expect(formatPercentage(0)).toBe('0.0');
    });
  });
});
