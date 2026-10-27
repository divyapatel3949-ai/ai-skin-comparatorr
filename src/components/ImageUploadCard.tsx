import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, Replace, FileImage, AlertCircle, Camera } from 'lucide-react';
import { CameraModal } from './CameraModal';

interface ImageUploadCardProps {
  label: string;
  personId: 'A' | 'B';
  imageUrl: string | null;
  imageName: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  error: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  label,
  personId,
  imageUrl,
  imageName,
  imageWidth,
  imageHeight,
  error,
  isUploading,
  onUpload,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const accentColor = personId === 'A' ? 'indigo' : 'violet';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`px-5 py-3 bg-gradient-to-r ${personId === 'A' ? 'from-indigo-50 to-indigo-100/50' : 'from-violet-50 to-violet-100/50'} border-b border-gray-100`}>
        <h3 className={`font-semibold ${personId === 'A' ? 'text-indigo-900' : 'text-violet-900'}`}>
          {label}
        </h3>
      </div>

      <div className="p-5">
        {!imageUrl ? (
          /* Upload area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragOver
                ? `border-${accentColor}-400 bg-${accentColor}-50`
                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
            } ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label={`Upload photo for ${label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label={`Choose file for ${label}`}
            />

            <div className={`w-12 h-12 mx-auto rounded-full ${personId === 'A' ? 'bg-indigo-100' : 'bg-violet-100'} flex items-center justify-center mb-3`}>
              <Upload className={`w-6 h-6 ${personId === 'A' ? 'text-indigo-500' : 'text-violet-500'}`} />
            </div>

            <p className="text-sm font-medium text-gray-700 mb-1">
              {isDragOver ? 'Drop your image here' : `Upload Photo ${personId}`}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Drag & drop or click to browse
            </p>

            {/* Direct Live Camera button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCameraOpen(true);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold ${
                  personId === 'A'
                    ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
                    : 'text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200'
                } rounded-xl transition-all shadow-xs hover:shadow-sm`}
              >
                <Camera className="w-4 h-4" />
                Take Selfie (Camera)
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              JPG, PNG, WEBP • Max 10 MB
            </p>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          /* Image preview */
          <div>
            <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={imageUrl}
                alt={`Uploaded photo for ${label}`}
                className="w-full h-48 sm:h-56 object-contain"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <FileImage className="w-4 h-4 text-gray-400" />
              <span className="truncate font-medium">{imageName}</span>
              {imageWidth && imageHeight && (
                <span className="text-gray-400 flex-shrink-0">
                  {imageWidth} × {imageHeight}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Retake
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Replace className="w-4 h-4" />
                Replace
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label={`Replace file for ${label}`}
            />
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Live Camera Viewfinder Modal */}
        <CameraModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={onUpload}
          personLabel={label}
        />
      </div>
    </div>
  );
};
