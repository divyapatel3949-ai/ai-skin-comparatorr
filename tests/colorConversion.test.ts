import { describe, it, expect } from 'vitest';
import {
  srgbToLinear,
  rgbToLAB,
  rgbToHex,
  median,
} from '../src/utils/colorConversion';

describe('colorConversion utilities', () => {
  describe('srgbToLinear', () => {
    it('correctly linearizes 0 (black)', () => {
      expect(srgbToLinear(0)).toBe(0);
    });

    it('correctly linearizes 255 (white)', () => {
      expect(srgbToLinear(255)).toBeCloseTo(1.0, 4);
    });

    it('correctly applies gamma expansion for intermediate values', () => {
      // 128 / 255 ≈ 0.50196 -> > 0.04045 -> ((0.50196 + 0.055) / 1.055) ^ 2.4 ≈ 0.21586
      const linear = srgbToLinear(128);
      expect(linear).toBeGreaterThan(0.21);
      expect(linear).toBeLessThan(0.22);
    });
  });

  describe('rgbToLAB with standard reference colors', () => {
    it('converts pure black (0, 0, 0) to L* = 0', () => {
      const lab = rgbToLAB({ r: 0, g: 0, b: 0 });
      expect(lab.L).toBeCloseTo(0, 1);
      expect(lab.a).toBeCloseTo(0, 1);
      expect(lab.b).toBeCloseTo(0, 1);
    });

    it('converts pure white (255, 255, 255) to L* = 100', () => {
      const lab = rgbToLAB({ r: 255, g: 255, b: 255 });
      expect(lab.L).toBeCloseTo(100, 1);
      expect(lab.a).toBeCloseTo(0, 1);
      expect(lab.b).toBeCloseTo(0, 1);
    });

    it('converts neutral mid-gray (128, 128, 128) to L* ~ 53.6', () => {
      const lab = rgbToLAB({ r: 128, g: 128, b: 128 });
      expect(lab.L).toBeGreaterThan(53);
      expect(lab.L).toBeLessThan(54.5);
      expect(Math.abs(lab.a)).toBeLessThan(1);
      expect(Math.abs(lab.b)).toBeLessThan(1);
    });

    it('converts typical light skin tone RGB(235, 195, 175) to valid L* a* b*', () => {
      const lab = rgbToLAB({ r: 235, g: 195, b: 175 });
      // Light skin has L* around 75-85, a* > 0 (reddish), b* > 0 (yellowish)
      expect(lab.L).toBeGreaterThan(75);
      expect(lab.L).toBeLessThan(85);
      expect(lab.a).toBeGreaterThan(5);
      expect(lab.b).toBeGreaterThan(10);
    });

    it('converts typical dark skin tone RGB(90, 55, 40) to valid L* a* b*', () => {
      const lab = rgbToLAB({ r: 90, g: 55, b: 40 });
      // Dark skin has L* around 25-35, a* > 0, b* > 0
      expect(lab.L).toBeGreaterThan(20);
      expect(lab.L).toBeLessThan(35);
      expect(lab.a).toBeGreaterThan(5);
      expect(lab.b).toBeGreaterThan(5);
    });
  });

  describe('rgbToHex', () => {
    it('converts black to #000000', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('converts white to #ffffff', () => {
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
    });

    it('converts skin tone (220, 175, 140) to #dcb08c', () => {
      expect(rgbToHex({ r: 220, g: 176, b: 140 })).toBe('#dcb08c');
    });

    it('clamps out of bounds values gracefully', () => {
      expect(rgbToHex({ r: -10, g: 300, b: 128 })).toBe('#00ff80');
    });
  });

  describe('median', () => {
    it('returns 0 for empty array', () => {
      expect(median([])).toBe(0);
    });

    it('returns single element for length 1', () => {
      expect(median([42])).toBe(42);
    });

    it('returns middle element for odd length', () => {
      expect(median([5, 1, 9])).toBe(5);
    });

    it('returns average of two middle elements for even length', () => {
      expect(median([1, 2, 4, 8])).toBe(3);
    });

    it('handles unsorted input with duplicates', () => {
      expect(median([10, 20, 20, 50, 40, 20, 30])).toBe(20);
    });
  });
});
