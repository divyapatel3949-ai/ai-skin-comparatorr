export interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
  name: string;
}

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface LABColor {
  L: number;
  a: number;
  b: number;
}

export interface SkinAnalysisResult {
  medianRGB: RGBColor;
  medianLAB: LABColor;
  hexColor: string;
  pixelCount: number;
  selection: SelectionRect;
  warnings: string[];
}

export interface ComparisonResult {
  personA: SkinAnalysisResult;
  personB: SkinAnalysisResult;
  lighterPerson: 'A' | 'B' | 'equal';
  fairerPerson: 'A' | 'B' | 'equal';
  percentageDifference: number;
  canCalculatePercentage: boolean;
  explanation: string;
  hinglishExplanation: string;
}

export type AnalysisState = 'idle' | 'uploading' | 'selecting' | 'analyzing' | 'complete' | 'error';

export interface ImageUploadState {
  image: ImageData | null;
  selection: SelectionRect | null;
  analysis: SkinAnalysisResult | null;
  state: AnalysisState;
  error: string | null;
}

export interface QualityWarning {
  type: 'clipping' | 'underexposure' | 'color_cast' | 'low_contrast';
  message: string;
  severity: 'info' | 'warning' | 'error';
}
