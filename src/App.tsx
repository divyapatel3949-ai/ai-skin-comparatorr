import { useCallback, useRef } from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PrivacyNotice } from './components/PrivacyNotice';
import { Footer } from './components/Footer';
import { ImageUploadCard } from './components/ImageUploadCard';
import { SkinRegionSelector } from './components/SkinRegionSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { useImageUpload } from './hooks/useImageUpload';
import { useSkinToneAnalysis } from './hooks/useSkinToneAnalysis';

function App() {
  const personA = useImageUpload();
  const personB = useImageUpload();
  const analysis = useSkinToneAnalysis();
  const comparisonRef = useRef<HTMLDivElement>(null);

  const scrollToComparison = useCallback(() => {
    comparisonRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCompare = useCallback(() => {
    if (personA.uploadState.analysis && personB.uploadState.analysis) {
      analysis.compareResults(personA.uploadState.analysis, personB.uploadState.analysis);
    }
  }, [personA.uploadState.analysis, personB.uploadState.analysis, analysis]);

  const handleReset = useCallback(() => {
    personA.reset();
    personB.reset();
    analysis.resetComparison();
  }, [personA, personB, analysis]);

  const bothUploaded = !!personA.uploadState.image && !!personB.uploadState.image;
  const bothAnalyzed = !!personA.uploadState.analysis && !!personB.uploadState.analysis;
  const hasResults = !!analysis.comparison;

  return (
    <div className="min-h-screen bg-white">
      <Header onStartComparing={scrollToComparison} />
      <Hero onComparePhotos={scrollToComparison} />

      {/* Comparison Section */}
      <section ref={comparisonRef} id="comparison" className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Upload & Compare
            </h2>
            <p className="mt-2 text-gray-600">
              Upload two photos and select skin regions to compare.
            </p>
          </div>

          {/* Upload cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ImageUploadCard
              label="Person A"
              personId="A"
              imageUrl={personA.uploadState.image?.url || null}
              imageName={personA.uploadState.image?.name || null}
              imageWidth={personA.uploadState.image?.width || null}
              imageHeight={personA.uploadState.image?.height || null}
              error={!personA.uploadState.image ? personA.uploadState.error : null}
              isUploading={personA.uploadState.state === 'uploading'}
              onUpload={personA.handleUpload}
              onRemove={personA.reset}
            />
            <ImageUploadCard
              label="Person B"
              personId="B"
              imageUrl={personB.uploadState.image?.url || null}
              imageName={personB.uploadState.image?.name || null}
              imageWidth={personB.uploadState.image?.width || null}
              imageHeight={personB.uploadState.image?.height || null}
              error={!personB.uploadState.image ? personB.uploadState.error : null}
              isUploading={personB.uploadState.state === 'uploading'}
              onUpload={personB.handleUpload}
              onRemove={personB.reset}
            />
          </div>

          {/* Skin region selectors */}
          {bothUploaded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {personA.uploadState.image && (
                <SkinRegionSelector
                  imageUrl={personA.uploadState.image.url}
                  imageWidth={personA.uploadState.image.width}
                  imageHeight={personA.uploadState.image.height}
                  personId="A"
                  selection={personA.uploadState.selection}
                  analysis={personA.uploadState.analysis}
                  onSelectionChange={personA.setSelection}
                  onAutoDetect={analysis.autoDetectRegion}
                  onAnalyze={analysis.analyzeRegion}
                  onAnalysisComplete={personA.setAnalysis}
                  onError={personA.setError}
                />
              )}
              {personB.uploadState.image && (
                <SkinRegionSelector
                  imageUrl={personB.uploadState.image.url}
                  imageWidth={personB.uploadState.image.width}
                  imageHeight={personB.uploadState.image.height}
                  personId="B"
                  selection={personB.uploadState.selection}
                  analysis={personB.uploadState.analysis}
                  onSelectionChange={personB.setSelection}
                  onAutoDetect={analysis.autoDetectRegion}
                  onAnalyze={analysis.analyzeRegion}
                  onAnalysisComplete={personB.setAnalysis}
                  onError={personB.setError}
                />
              )}
            </div>
          )}

          {/* Selection errors */}
          {personA.uploadState.image && personA.uploadState.error && (
            <div className="mb-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Person A: {personA.uploadState.error}</span>
            </div>
          )}
          {personB.uploadState.image && personB.uploadState.error && (
            <div className="mb-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Person B: {personB.uploadState.error}</span>
            </div>
          )}

          {/* Compare button */}
          {bothUploaded && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={handleCompare}
                disabled={!bothAnalyzed}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
              >
                {bothAnalyzed ? 'Compare Skin Tones' : 'Select skin regions in both photos first'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </button>
            </div>
          )}

          {/* Analysis error */}
          {analysis.error && (
            <div className="mb-8 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{analysis.error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {hasResults && analysis.comparison && personA.uploadState.image && personB.uploadState.image && (
          <ResultsDashboard
            result={analysis.comparison}
            imageUrlA={personA.uploadState.image.url}
            imageUrlB={personB.uploadState.image.url}
          />
        )}
      </section>

      <HowItWorks />
      <PrivacyNotice />
      <Footer />
    </div>
  );
}

export default App;
