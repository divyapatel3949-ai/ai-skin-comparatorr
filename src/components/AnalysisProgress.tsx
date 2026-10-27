import React from 'react';
import { Loader2 } from 'lucide-react';

interface AnalysisProgressProps {
  message: string;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
      <span className="text-sm text-gray-600 font-medium">{message}</span>
    </div>
  );
};
