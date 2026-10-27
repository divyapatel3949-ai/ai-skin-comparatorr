import React from 'react';
import { Scan } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-md flex items-center justify-center">
              <Scan className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">SkinTone AI</span>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Image-based skin tone comparison tool. All processing happens locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
};
