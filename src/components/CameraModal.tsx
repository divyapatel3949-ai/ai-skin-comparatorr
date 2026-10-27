import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, X, SwitchCamera, AlertCircle, RefreshCw } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  personLabel: string;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  personLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Stop current active stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Check available cameras
  useEffect(() => {
    if (!isOpen) return;

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Start camera stream
  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access is not supported in this browser. Please use HTTPS or upload a photo.');
      setIsLoading(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video play interrupted:', playErr);
        }
      }
      setIsLoading(false);
      setError(null);
    } catch (err: unknown) {
      console.error('Camera stream error:', err);
      const errorObj = err as { name?: string; message?: string };
      let msg = 'Could not access camera. Please allow camera permissions in your browser.';
      if (errorObj.name === 'NotAllowedError' || errorObj.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please click the camera/lock icon in your browser address bar to allow access.';
      } else if (errorObj.name === 'NotFoundError' || errorObj.name === 'DevicesNotFoundError') {
        msg = 'No camera found on this device.';
      } else if (errorObj.name === 'NotReadableError' || errorObj.name === 'TrackStartError') {
        msg = 'Camera is already in use by another app or tab.';
      }
      setError(msg);
      setIsLoading(false);
    }
  }, [stopStream]);

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, startCamera, stopStream]);

  // Handle capture
  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontal if using front camera so saved image matches preview
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `selfie_${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopStream();
        onCapture(file);
        onClose();
      },
      'image/jpeg',
      0.95
    );
  }, [facingMode, onCapture, onClose, stopStream]);

  // Switch camera (front/back)
  const handleToggleCamera = useCallback(() => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  }, [facingMode, startCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Take Selfie Camera</h3>
              <p className="text-xs text-gray-400">{personLabel}</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative flex-1 bg-black aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm text-gray-300">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-white mb-2">Camera Access Error</p>
              <p className="text-xs text-gray-400 mb-4">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />

              {/* Face Guide Oval */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-64 sm:w-56 sm:h-72 rounded-full border-2 border-white/40 border-dashed shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] flex items-end justify-center pb-4">
                  <span className="text-[11px] font-medium tracking-wide bg-black/60 text-white/90 px-3 py-1 rounded-full backdrop-blur-xs">
                    Position face inside oval
                  </span>
                </div>
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Starting camera...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Camera Controls */}
        <div className="px-6 py-5 bg-gray-900 border-t border-gray-800 flex items-center justify-between">
          {/* Flip camera button */}
          <div className="w-12">
            {hasMultipleCameras && !error && (
              <button
                onClick={handleToggleCamera}
                className="p-3 text-gray-300 hover:text-white rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Switch Camera"
                aria-label="Switch Camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Shutter capture button */}
          <button
            onClick={handleCapture}
            disabled={isLoading || !!error}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 bg-transparent hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
            aria-label="Take Photo"
          >
            <div className="w-full h-full bg-white rounded-full shadow-lg" />
          </button>

          {/* Spacer to keep shutter centered */}
          <div className="w-12" />
        </div>
      </div>
    </div>
  );
};
