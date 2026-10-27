import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { RGBColor, LABColor } from '../types';

interface SkinToneSwatchProps {
  hexColor: string;
  rgb: RGBColor;
  lab: LABColor;
  label: string;
  personId: 'A' | 'B';
}

export const SkinToneSwatch: React.FC<SkinToneSwatchProps> = ({
  hexColor,
  rgb,
  lab,
  label,
  personId: _personId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hexColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div
        className="h-20 w-full"
        style={{ backgroundColor: hexColor }}
        role="img"
        aria-label={`Skin color swatch for ${label}: ${hexColor}`}
      />
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-800">{label}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy HEX value"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>{hexColor}</span>
              </>
            )}
          </button>
        </div>
        <div className="text-xs text-gray-500 space-y-0.5">
          <div>RGB: {rgb.r}, {rgb.g}, {rgb.b}</div>
          <div>L*: {lab.L.toFixed(1)} | a*: {lab.a.toFixed(1)} | b*: {lab.b.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};
