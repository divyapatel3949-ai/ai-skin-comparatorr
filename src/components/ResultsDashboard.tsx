import React from 'react';
import { BarChart3, AlertTriangle, Sparkles } from 'lucide-react';
import type { ComparisonResult } from '../types';
import { ComparisonSummary } from './ComparisonSummary';
import { LightnessComparisonBar } from './LightnessComparisonBar';
import { SkinToneSwatch } from './SkinToneSwatch';

interface ResultsDashboardProps {
  result: ComparisonResult;
  imageUrlA: string;
  imageUrlB: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  imageUrlA,
  imageUrlB,
}) => {
  const { personA, personB, lighterPerson, percentageDifference } = result;

  const isAFairer = lighterPerson === 'A';
  const isBFairer = lighterPerson === 'B';

  const allWarnings = [
    ...personA.warnings.map(w => ({ person: 'A', message: w })),
    ...personB.warnings.map(w => ({ person: 'B', message: w })),
  ];

  return (
    <section id="results" className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Analysis Complete</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Skin Tone Comparison Results
          </h2>
          <p className="mt-2 text-gray-600">
            Detailed measurement of sampled skin lightness and relative fairness percentage.
          </p>
        </div>

        {/* Warnings */}
        {allWarnings.length > 0 && (
          <div className="mb-6 space-y-2">
            {allWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-amber-800">
                  Person {w.person}: {w.message}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Main comparison card with Fairer statement */}
        <div className="mb-8">
          <ComparisonSummary result={result} />
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Person A */}
          <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
            isAFairer ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'
          }`}>
            <div className={`px-5 py-3 border-b flex items-center justify-between ${
              isAFairer ? 'bg-emerald-50/70 border-emerald-100' : 'bg-indigo-50 border-gray-100'
            }`}>
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                Person A
              </h3>
              {isAFairer && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  {percentageDifference.toFixed(1)}% Fairer
                </span>
              )}
              {isBFairer && (
                <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                  Baseline
                </span>
              )}
            </div>

            <div className="p-5">
              <div className="rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
                <img
                  src={imageUrlA}
                  alt="Person A uploaded photo"
                  className="w-full h-44 object-contain"
                />
                <div className="absolute bottom-2 right-2 bg-indigo-600/80 text-white text-xs px-2 py-1 rounded-md">
                  Region selected
                </div>
              </div>

              {/* Color swatch */}
              <div
                className="h-12 rounded-lg mb-3 border border-gray-200 shadow-inner"
                style={{ backgroundColor: personA.hexColor }}
                role="img"
                aria-label={`Person A skin color: ${personA.hexColor}`}
              />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                  <span className="text-gray-600 font-medium">Skin Fairness (Lightness L*)</span>
                  <span className={`font-bold text-base ${isAFairer ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {personA.medianLAB.L.toFixed(1)}
                    {isAFairer && ` (+${percentageDifference.toFixed(1)}%)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">a* (green–red tint)</span>
                  <span className="font-medium text-gray-700">{personA.medianLAB.a.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">b* (blue–yellow tint)</span>
                  <span className="font-medium text-gray-700">{personA.medianLAB.b.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">RGB</span>
                  <span className="font-medium text-gray-700">
                    {personA.medianRGB.r}, {personA.medianRGB.g}, {personA.medianRGB.b}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">HEX Code</span>
                  <span className="font-mono text-gray-700">{personA.hexColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pixels sampled</span>
                  <span className="font-medium text-gray-700">{personA.pixelCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Person B */}
          <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
            isBFairer ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'
          }`}>
            <div className={`px-5 py-3 border-b flex items-center justify-between ${
              isBFairer ? 'bg-emerald-50/70 border-emerald-100' : 'bg-violet-50 border-gray-100'
            }`}>
              <h3 className="font-semibold text-violet-900 flex items-center gap-2">
                Person B
              </h3>
              {isBFairer && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  {percentageDifference.toFixed(1)}% Fairer
                </span>
              )}
              {isAFairer && (
                <span className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                  Baseline
                </span>
              )}
            </div>

            <div className="p-5">
              <div className="rounded-xl overflow-hidden bg-gray-100 mb-4 relative">
                <img
                  src={imageUrlB}
                  alt="Person B uploaded photo"
                  className="w-full h-44 object-contain"
                />
                <div className="absolute bottom-2 right-2 bg-violet-600/80 text-white text-xs px-2 py-1 rounded-md">
                  Region selected
                </div>
              </div>

              <div
                className="h-12 rounded-lg mb-3 border border-gray-200 shadow-inner"
                style={{ backgroundColor: personB.hexColor }}
                role="img"
                aria-label={`Person B skin color: ${personB.hexColor}`}
              />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-50">
                  <span className="text-gray-600 font-medium">Skin Fairness (Lightness L*)</span>
                  <span className={`font-bold text-base ${isBFairer ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {personB.medianLAB.L.toFixed(1)}
                    {isBFairer && ` (+${percentageDifference.toFixed(1)}%)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">a* (green–red tint)</span>
                  <span className="font-medium text-gray-700">{personB.medianLAB.a.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">b* (blue–yellow tint)</span>
                  <span className="font-medium text-gray-700">{personB.medianLAB.b.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">RGB</span>
                  <span className="font-medium text-gray-700">
                    {personB.medianRGB.r}, {personB.medianRGB.g}, {personB.medianRGB.b}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">HEX Code</span>
                  <span className="font-mono text-gray-700">{personB.hexColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pixels sampled</span>
                  <span className="font-medium text-gray-700">{personB.pixelCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lightness comparison bar */}
        <div className="mb-8">
          <LightnessComparisonBar
            lA={personA.medianLAB.L}
            lB={personB.medianLAB.L}
            labelA="Person A"
            labelB="Person B"
          />
        </div>

        {/* Side-by-side swatches */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <SkinToneSwatch
            hexColor={personA.hexColor}
            rgb={personA.medianRGB}
            lab={personA.medianLAB}
            label="Person A"
            personId="A"
          />
          <SkinToneSwatch
            hexColor={personB.hexColor}
            rgb={personB.medianRGB}
            lab={personB.medianLAB}
            label="Person B"
            personId="B"
          />
        </div>

        {/* Additional interpretation */}
        <div className="bg-gray-50 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed border border-gray-100">
          {Math.abs(personA.medianLAB.L - personB.medianLAB.L) < 3 ? (
            <p>
              Dono sampled regions ki lightness values lagbhag barabar hain (similar values). Minor difference ambient lighting, exposure ya camera white balance ki wajah se ho sakta hai.
            </p>
          ) : (
            <p>
              Photo analysis ke mutabik <strong>Person {lighterPerson === 'A' ? 'A' : 'B'}</strong> ki sampled skin region ka measured lightness score (L*) <strong>Person {lighterPerson === 'A' ? 'B' : 'A'}</strong> se <strong>{percentageDifference.toFixed(1)}%</strong> zyada fair / light paya gaya hai. Yeh score selected image pixels par adharit hai jisme lighting aur camera exposure ka asar ho sakta hai.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
