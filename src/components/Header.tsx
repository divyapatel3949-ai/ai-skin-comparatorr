import React from 'react';
import { Scan, Menu, X } from 'lucide-react';

interface HeaderProps {
  onStartComparing: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartComparing }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              SkinTone <span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('home')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('privacy')}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={onStartComparing}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm hover:shadow-md"
            >
              Start Comparing
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollTo('home')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollTo('privacy')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 text-left"
              >
                Privacy
              </button>
              <button
                onClick={() => {
                  onStartComparing();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-lg w-full"
              >
                Start Comparing
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
