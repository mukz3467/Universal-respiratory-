import React from 'react';
import {
  Sparkles,
  Sun,
  Moon,
  LayoutGrid,
  FileText,
  Clock,
  Volume2,
  VolumeX,
  Globe2
} from 'lucide-react';

export type ViewMode = 'all' | 'text' | 'timer';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isDark: boolean;
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onLoadSample: (sampleType: 'english' | 'multilingual' | 'code') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  isDark,
  toggleTheme,
  soundEnabled,
  toggleSound,
  onLoadSample
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                OmniTool Global
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/60">
                <Globe2 className="w-3 h-3" /> Universal
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Word Counter • Case Converter • High-Precision Timer
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
        <nav className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800" aria-label="Tool views">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span>
            <span className="md:hidden">All</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'text'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Text & Case</span>
            <span className="md:hidden">Text</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('timer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'timer'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timer & Clock</span>
          </button>
        </nav>

        {/* Right side controls: Samples, Sound, Theme */}
        <div className="flex items-center gap-1.5">
          {/* Standalone Pages Dropdown */}
          <div className="relative group hidden sm:block">
            <button
              type="button"
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1"
            >
              <span>Standalone Pages</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
            <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-xs">
              <a
                href="word-counter.html"
                className="block px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium"
              >
                📝 Word Counter (HTML)
              </a>
              <a
                href="case-converter.html"
                className="block px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium"
              >
                🔠 Case Converter (HTML)
              </a>
              <a
                href="universal-time.html"
                className="block px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 font-medium"
              >
                🌐 UTC Clock & Timer (HTML)
              </a>
            </div>
          </div>

          {/* Quick multilingual sample loader */}
          <div className="relative group hidden lg:block">
            <button
              type="button"
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1"
            >
              <span>Load Sample</span>
              <span className="text-[10px] text-slate-400">▾</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <button
                type="button"
                onClick={() => onLoadSample('english')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600"
              >
                English Article
              </button>
              <button
                type="button"
                onClick={() => onLoadSample('multilingual')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600"
              >
                Global Multilingual (CJK/Arabic/Hindi)
              </button>
              <button
                type="button"
                onClick={() => onLoadSample('code')}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600"
              >
                Developer JSON/Code
              </button>
            </div>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Timer Sound On (Click to Mute)' : 'Timer Sound Muted (Click to Unmute)'}
            aria-label="Toggle sound"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
