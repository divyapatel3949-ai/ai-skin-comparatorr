import { useState, useCallback } from 'react';
import type { ComparisonResult, SkinAnalysisResult, SelectionRect } from '../types';
import { analyzeSkinRegion } from '../utils/imageProcessing';
import { detectSkinRegion } from '../utils/skinDetection';
import { calculateComparison } from '../utils/comparisonCalculator';

export function useSkinToneAnalysis() {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeRegion = useCallback(
    (canvas: HTMLCanvasElement, selection: SelectionRect): SkinAnalysisResult => {
      return analyzeSkinRegion(canvas, selection);
    },
    []
  );

  const autoDetectRegion = useCallback(
    (canvas: HTMLCanvasElement): SelectionRect | null => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return detectSkinRegion(imageData, canvas.width, canvas.height);
    },
    []
  );

  const compareResults = useCallback(
    (personA: SkinAnalysisResult, personB: SkinAnalysisResult) => {
      try {
        const result = calculateComparison(personA, personB);
        setComparison(result);
        setError(null);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Comparison failed');
        return null;
      }
    },
    []
  );

  const resetComparison = useCallback(() => {
    setComparison(null);
    setIsAnalyzing(false);
    setError(null);
  }, []);

  return {
    comparison,
    isAnalyzing,
    error,
    setIsAnalyzing,
    analyzeRegion,
    autoDetectRegion,
    compareResults,
    resetComparison,
  };
}
