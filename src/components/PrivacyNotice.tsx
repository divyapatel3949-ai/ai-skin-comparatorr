import React from 'react';
import { Shield, Eye, Server, Lock } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Local Processing',
      description: 'All image analysis happens directly in your browser. Your photos are never uploaded to any server.',
    },
    {
      icon: Eye,
      title: 'No Facial Recognition',
      description: 'We do not perform facial recognition, identity matching, or infer ethnicity, race, or health information.',
    },
    {
      icon: Server,
      title: 'No Data Storage',
      description: 'Photos are not stored permanently. They exist only in your browser memory during the comparison session.',
    },
    {
      icon: Lock,
      title: 'Pixel Analysis Only',
      description: 'Results describe only the visible pixel colors in the uploaded images. They are not judgments about beauty or identity.',
    },
  ];

  return (
    <section id="privacy" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Your Privacy Matters</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We take privacy seriously. Here's how your data is handled.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
