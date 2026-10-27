import React, { useRef, useState, useCallback, useEffect } from 'react';
import { MousePointer, Wand2, RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';
import type { SelectionRect, SkinAnalysisResult } from '../types';

interface SkinRegionSelectorProps {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  personId: 'A' | 'B';
  selection: SelectionRect | null;
  analysis: SkinAnalysisResult | null;
  onSelectionChange: (selection: SelectionRect | null) => void;
  onAutoDetect: (canvas: HTMLCanvasElement) => SelectionRect | null;
  onAnalyze: (canvas: HTMLCanvasElement, selection: SelectionRect) => SkinAnalysisResult;
  onAnalysisComplete: (result: SkinAnalysisResult | null) => void;
  onError: (error: string | null) => void;
}

export const SkinRegionSelector: React.FC<SkinRegionSelectorProps> = ({
  imageUrl,
  imageWidth: _imageWidth,
  imageHeight: _imageHeight,
  personId,
  selection,
  analysis,
  onSelectionChange,
  onAutoDetect,
  onAnalyze,
  onAnalysisComplete,
  onError,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<SelectionRect | null>(null);
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Load the image onto the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        setImageLoaded(true);
        imgRef.current = img;
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Redraw selection overlay
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw the image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgRef.current, 0, 0);

    const sel = selection || currentRect;
    if (sel) {
      // Draw semi-transparent overlay outside selection
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      // Top
      ctx.fillRect(0, 0, canvas.width, sel.y);
      // Bottom
      ctx.fillRect(0, sel.y + sel.height, canvas.width, canvas.height - sel.y - sel.height);
      // Left
      ctx.fillRect(0, sel.y, sel.x, sel.height);
      // Right
      ctx.fillRect(sel.x + sel.width, sel.y, canvas.width - sel.x - sel.width, sel.height);

      // Draw selection border
      ctx.strokeStyle = personId === 'A' ? '#6366f1' : '#8b5cf6';
      ctx.lineWidth = Math.max(2, Math.min(canvas.width, canvas.height) * 0.003);
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(sel.x, sel.y, sel.width, sel.height);
      ctx.setLineDash([]);

      // Corner handles
      const handleSize = Math.max(6, Math.min(canvas.width, canvas.height) * 0.008);
      ctx.fillStyle = personId === 'A' ? '#6366f1' : '#8b5cf6';
      const corners = [
        [sel.x, sel.y],
        [sel.x + sel.width, sel.y],
        [sel.x, sel.y + sel.height],
        [sel.x + sel.width, sel.y + sel.height],
      ];
      for (const [cx, cy] of corners) {
        ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
      }
    }
  }, [selection, currentRect, imageLoaded, personId]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : ('clientX' in e ? e.clientX : 0);
      const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : ('clientY' in e ? e.clientY : 0);

      return {
        x: Math.round((clientX - rect.left) * scaleX),
        y: Math.round((clientY - rect.top) * scaleY),
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCanvasCoords(e);
      setIsDrawing(true);
      setDrawStart(coords);
      setCurrentRect(null);
      onSelectionChange(null);
      onAnalysisComplete(null);
      onError(null);
    },
    [getCanvasCoords, onSelectionChange, onAnalysisComplete, onError]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (e.touches.length !== 1) return;
      const coords = getCanvasCoords(e);
      setIsDrawing(true);
      setDrawStart(coords);
      setCurrentRect(null);
      onSelectionChange(null);
      onAnalysisComplete(null);
      onError(null);
    },
    [getCanvasCoords, onSelectionChange, onAnalysisComplete, onError]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !drawStart) return;
      const coords = getCanvasCoords(e);
      const x = Math.min(drawStart.x, coords.x);
      const y = Math.min(drawStart.y, coords.y);
      const width = Math.abs(coords.x - drawStart.x);
      const height = Math.abs(coords.y - drawStart.y);

      if (width > 5 && height > 5) {
        setCurrentRect({ x, y, width, height });
      }
    },
    [isDrawing, drawStart, getCanvasCoords]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !drawStart || e.touches.length !== 1) return;
      const coords = getCanvasCoords(e);
      const x = Math.min(drawStart.x, coords.x);
      const y = Math.min(drawStart.y, coords.y);
      const width = Math.abs(coords.x - drawStart.x);
      const height = Math.abs(coords.y - drawStart.y);

      if (width > 5 && height > 5) {
        setCurrentRect({ x, y, width, height });
      }
    },
    [isDrawing, drawStart, getCanvasCoords]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentRect && currentRect.width > 10 && currentRect.height > 10) {
      onSelectionChange(currentRect);
      setCurrentRect(null);

      // Auto-analyze after selection
      const canvas = canvasRef.current;
      if (canvas) {
        setIsAnalyzing(true);
        try {
          const result = onAnalyze(canvas, currentRect);
          onAnalysisComplete(result);
        } catch (err) {
          onError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
          setIsAnalyzing(false);
        }
      }
    }
    setIsDrawing(false);
    setDrawStart(null);
  }, [isDrawing, currentRect, onSelectionChange, onAnalyze, onAnalysisComplete, onError]);

  const handleAutoDetect = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAnalyzing(true);
    onError(null);

    try {
      const detected = onAutoDetect(canvas);
      if (detected) {
        onSelectionChange(detected);
        const result = onAnalyze(canvas, detected);
        onAnalysisComplete(result);
      } else {
        onError('Could not automatically detect a skin region. Please select an area manually.');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Auto-detection failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAutoDetect, onSelectionChange, onAnalyze, onAnalysisComplete, onError]);

  const handleReset = useCallback(() => {
    onSelectionChange(null);
    onAnalysisComplete(null);
    onError(null);
    setCurrentRect(null);
    setZoom(1);
  }, [onSelectionChange, onAnalysisComplete, onError]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);

  const accentBg = personId === 'A' ? 'bg-indigo-600' : 'bg-violet-600';
  const accentHover = personId === 'A' ? 'hover:bg-indigo-700' : 'hover:bg-violet-700';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`px-5 py-3 ${personId === 'A' ? 'bg-indigo-50' : 'bg-violet-50'} border-b border-gray-100`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${personId === 'A' ? 'text-indigo-900' : 'text-violet-900'} flex items-center gap-2`}>
            <MousePointer className="w-4 h-4" />
            Select Skin Area — Person {personId}
          </h3>
          {analysis && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              ✓ Analyzed
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Instructions */}
        <div className="flex items-start gap-2 text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Draw a rectangle over a visible skin area (e.g., cheek or forehead). Avoid hair, eyes, lips, facial hair, clothing, and background.
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={handleAutoDetect}
            disabled={isAnalyzing || !imageLoaded}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white ${accentBg} ${accentHover} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Auto Detect
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative overflow-auto rounded-xl border border-gray-200 bg-gray-50"
          style={{ maxHeight: '400px' }}
        >
          <canvas
            ref={canvasRef}
            className="block cursor-crosshair"
            style={{
              width: `${100 * zoom}%`,
              maxWidth: 'none',
              touchAction: 'none',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          />

          {isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
                Analyzing...
              </div>
            </div>
          )}
        </div>

        {/* Analysis result preview */}
        {analysis && (
          <div className="mt-3 flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div
              className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: analysis.hexColor }}
              title={`Sampled color: ${analysis.hexColor}`}
            />
            <div className="text-xs text-gray-600">
              <div className="font-medium text-gray-800">
                L*: {analysis.medianLAB.L.toFixed(1)} | RGB({analysis.medianRGB.r}, {analysis.medianRGB.g}, {analysis.medianRGB.b})
              </div>
              <div className="text-gray-500">
                {analysis.pixelCount.toLocaleString()} pixels sampled
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
