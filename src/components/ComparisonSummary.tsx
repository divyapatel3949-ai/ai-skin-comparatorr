import React from 'react';
import { Sparkles, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { ComparisonResult } from '../types';

interface ComparisonSummaryProps {
  result: ComparisonResult;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ result }) => {
  const { lighterPerson, percentageDifference, canCalculatePercentage, explanation, hinglishExplanation, personA, personB } = result;

  const isEqual = lighterPerson === 'equal';
  const fairerPersonName = lighterPerson === 'A' ? 'Person A' : lighterPerson === 'B' ? 'Person B' : null;
  const otherPersonName = lighterPerson === 'A' ? 'Person B' : 'Person A';

  return (
    <div className="bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/90 rounded-3xl border-2 border-indigo-200/80 p-6 sm:p-10 shadow-lg relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Fairer Verdict Badge */}
      <div className="text-center mb-6">
        {canCalculatePercentage && !isEqual && fairerPersonName && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm sm:text-base shadow-md mb-4">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>{fairerPersonName} is Fairer</span>
          </div>
        )}

        {isEqual && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-md mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <span>Equal Skin Lightness</span>
          </div>
        )}

        {/* Big percentage & headline */}
        {canCalculatePercentage && !isEqual && fairerPersonName && (
          <>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              <span className={lighterPerson === 'A' ? 'text-indigo-600' : 'text-violet-600'}>
                {fairerPersonName}
              </span>{' '}
              is{' '}
              <span className="text-emerald-600 font-black">
                {percentageDifference.toFixed(1)}% Fairer
              </span>{' '}
              than {otherPersonName}
            </h3>

            {/* Hindi / Hinglish translation */}
            <p className="text-base sm:text-lg font-medium text-gray-600 bg-white/80 inline-block px-4 py-1.5 rounded-xl border border-gray-100 shadow-sm mt-1">
              ✨ {hinglishExplanation}
            </p>
          </>
        )}

        {isEqual && (
          <>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Both Persons Have the Same Skin Fairness (0.0% Difference)
            </h3>
            <p className="text-base text-gray-600 font-medium">
              {hinglishExplanation}
            </p>
          </>
        )}

        {!canCalculatePercentage && (
          <div className="flex items-center justify-center gap-2 text-amber-700 bg-amber-50 p-4 rounded-xl">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span>{explanation}</span>
          </div>
        )}
      </div>

      {/* Side-by-side Score Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
        {/* Person A card */}
        <div className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
          lighterPerson === 'A'
            ? 'bg-indigo-50/70 border-indigo-400 shadow-sm ring-2 ring-indigo-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 text-sm">Person A</span>
            {lighterPerson === 'A' && (
              <span className="text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                Fairer (+{percentageDifference.toFixed(1)}%)
              </span>
            )}
            {lighterPerson === 'B' && (
              <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                Baseline Reference
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700">
            L* {personA.medianLAB.L.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Measured Lightness Score (0-100)
          </div>
        </div>

        {/* Person B card */}
        <div className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
          lighterPerson === 'B'
            ? 'bg-violet-50/70 border-violet-400 shadow-sm ring-2 ring-violet-200'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-800 text-sm">Person B</span>
            {lighterPerson === 'B' && (
              <span className="text-xs bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                Fairer (+{percentageDifference.toFixed(1)}%)
              </span>
            )}
            {lighterPerson === 'A' && (
              <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full">
                Baseline Reference
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-violet-700">
            L* {personB.medianLAB.L.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Measured Lightness Score (0-100)
          </div>
        </div>
      </div>

      {/* Mathematical transparency notice */}
      {canCalculatePercentage && !isEqual && (
        <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-white/70 rounded-xl p-3.5 border border-indigo-100 max-w-xl mx-auto">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
          <span>
            <strong>Calculation Method:</strong> Relative fairness is calculated as:
            (({Math.max(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)} − {Math.min(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)}) / {Math.min(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)}) × 100 = <strong>{percentageDifference.toFixed(1)}%</strong>. This measures CIELAB L* visible pixel lightness of the selected skin samples under camera lighting.
          </span>
        </div>
      )}
    </div>
  );
};
