import { useState, useCallback } from 'react';
import type { ImageData as AppImageData, ImageUploadState, SelectionRect, SkinAnalysisResult, AnalysisState } from '../types';
import { validateImageFile, validateImageDimensions, loadImage } from '../utils/validation';

const initialState: ImageUploadState = {
  image: null,
  selection: null,
  analysis: null,
  state: 'idle',
  error: null,
};

export function useImageUpload() {
  const [uploadState, setUploadState] = useState<ImageUploadState>(initialState);

  const handleUpload = useCallback(async (file: File) => {
    // Validate file
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      setUploadState(prev => ({
        ...prev,
        state: 'error',
        error: fileValidation.error || 'Invalid file',
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      state: 'uploading',
      error: null,
    }));

    try {
      const { img, width, height } = await loadImage(file);

      // Validate dimensions
      const dimValidation = validateImageDimensions(width, height);
      if (!dimValidation.valid) {
        URL.revokeObjectURL(img.src);
        setUploadState(prev => ({
          ...prev,
          state: 'error',
          error: dimValidation.error || 'Invalid dimensions',
        }));
        return;
      }

      const imageData: AppImageData = {
        file,
        url: img.src,
        width,
        height,
        name: file.name,
      };

      setUploadState({
        image: imageData,
        selection: null,
        analysis: null,
        state: 'selecting',
        error: null,
      });
    } catch (err) {
      setUploadState(prev => ({
        ...prev,
        state: 'error',
        error: err instanceof Error ? err.message : 'Failed to load image',
      }));
    }
  }, []);

  const setSelection = useCallback((selection: SelectionRect | null) => {
    setUploadState(prev => ({
      ...prev,
      selection,
      analysis: null,
    }));
  }, []);

  const setAnalysis = useCallback((analysis: SkinAnalysisResult | null) => {
    setUploadState(prev => ({
      ...prev,
      analysis,
      state: analysis ? 'complete' : prev.state,
    }));
  }, []);

  const setState = useCallback((state: AnalysisState) => {
    setUploadState(prev => ({ ...prev, state }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setUploadState(prev => ({ ...prev, error, state: error ? 'error' : prev.state }));
  }, []);

  const reset = useCallback(() => {
    // Revoke the object URL if it exists
    if (uploadState.image?.url) {
      URL.revokeObjectURL(uploadState.image.url);
    }
    setUploadState(initialState);
  }, [uploadState.image]);

  return {
    uploadState,
    handleUpload,
    setSelection,
    setAnalysis,
    setState,
    setError,
    reset,
  };
}
