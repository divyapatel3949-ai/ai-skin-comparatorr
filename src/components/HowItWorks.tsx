import React from 'react';
import { Upload, MousePointer, BarChart3, Lightbulb } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      step: '1',
      title: 'Upload Two Photos',
      description: 'Upload clear, well-lit photos of two people. JPG, PNG, and WEBP formats are supported.',
    },
    {
      icon: MousePointer,
      step: '2',
      title: 'Select Skin Regions',
      description: 'Select comparable skin areas in both photos, such as cheeks or foreheads. Avoid hair, eyes, and lips.',
    },
    {
      icon: BarChart3,
      step: '3',
      title: 'View Comparison',
      description: 'See measured color values and the relative lightness difference between the two selected regions.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Three simple steps to compare skin tone measurements from your photos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="relative mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-5">
                <s.icon className="w-7 h-7 text-indigo-600" />
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 bg-amber-50 rounded-xl p-4 max-w-2xl mx-auto">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            For best results, use photos with neutral lighting, similar exposure settings, no filters, and comparable camera conditions.
          </p>
        </div>
      </div>
    </section>
  );
};
