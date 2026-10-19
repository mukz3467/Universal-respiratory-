import React from 'react';
import { Sparkles, Heart, Shield, Code2, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-10 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              OmniTool Global Utility Suite
            </div>
            <p className="text-[11px] text-slate-400">
              Built for writers, students, engineers, and creators worldwide.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            100% Client-Side Privacy
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
            Global UTF-8 Standards
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-500" />
            Zero-Latency Architecture
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-slate-500 dark:text-slate-400 font-medium">
          <a href="index.html" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home Hub</a>
          <span>•</span>
          <a href="word-counter.html" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Word Counter</a>
          <span>•</span>
          <a href="case-converter.html" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Case Converter</a>
          <span>•</span>
          <a href="universal-time.html" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Universal UTC Clock</a>
        </div>

        <div className="text-center md:text-right text-[11px] text-slate-400">
          <div>© {new Date().getFullYear()} OmniTool Global. All rights reserved.</div>
          <div className="mt-0.5">High-Accuracy Web Utilities • AdSense Ready</div>
        </div>
      </div>
    </footer>
  );
};
