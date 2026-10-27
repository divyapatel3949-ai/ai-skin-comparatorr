import React from 'react';
import { ArrowRight, Camera, BarChart3, Info } from 'lucide-react';

interface HeroProps {
  onComparePhotos: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onComparePhotos }) => {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            Compare Skin Tones with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Image Analysis
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
            Upload two photos to measure and compare the visible lightness of selected skin regions.
          </p>

          {/* Visual previews */}
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-8">
            <div className="w-24 h-28 sm:w-32 sm:h-36 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-2 p-3">
              <Camera className="w-8 h-8 text-indigo-500" />
              <span className="text-xs text-gray-500 font-medium">Person A</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="w-5 h-5 text-indigo-400" />
              <BarChart3 className="w-6 h-6 text-violet-500" />
              <ArrowRight className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="w-24 h-28 sm:w-32 sm:h-36 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center gap-2 p-3">
              <Camera className="w-8 h-8 text-violet-500" />
              <span className="text-xs text-gray-500 font-medium">Person B</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-10">
            <button
              onClick={onComparePhotos}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Compare Photos
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Notice */}
          <div className="mt-8 inline-flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 max-w-xl">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="text-left">
              Results describe the selected pixels in the uploaded images and may be affected by lighting and camera conditions.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
