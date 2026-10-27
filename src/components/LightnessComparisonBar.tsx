import React from 'react';

interface LightnessComparisonBarProps {
  lA: number;
  lB: number;
  labelA: string;
  labelB: string;
}

export const LightnessComparisonBar: React.FC<LightnessComparisonBarProps> = ({
  lA,
  lB,
  labelA,
  labelB,
}) => {
  // L* ranges from 0 to 100
  const posA = Math.max(0, Math.min(100, lA));
  const posB = Math.max(0, Math.min(100, lB));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h4 className="text-sm font-semibold text-gray-800 mb-4">L* Lightness Comparison</h4>

      <div className="relative">
        {/* Scale labels */}
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>0 (Dark)</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100 (Light)</span>
        </div>

        {/* Bar */}
        <div className="relative h-8 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-100 rounded-lg overflow-visible">
          {/* Person A marker */}
          <div
            className="absolute top-0 h-full flex items-center"
            style={{ left: `${posA}%`, transform: 'translateX(-50%)' }}
          >
            <div className="relative">
              <div className="w-4 h-8 bg-indigo-500 rounded-sm border-2 border-white shadow-md" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-bold text-indigo-600">{labelA}: {lA.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Person B marker */}
          <div
            className="absolute top-0 h-full flex items-center"
            style={{ left: `${posB}%`, transform: 'translateX(-50%)' }}
          >
            <div className="relative">
              <div className="w-4 h-8 bg-violet-500 rounded-sm border-2 border-white shadow-md" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-bold text-violet-600">{labelB}: {lB.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer for labels */}
        <div className="h-8" />
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        L* scale: CIELAB perceptual lightness. Values represent measured image pixels, not natural skin tone.
      </p>
    </div>
  );
};
