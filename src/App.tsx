/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar, ViewMode } from './components/Navbar';
import { AdBanner } from './components/AdBanner';
import { WordCounter } from './components/WordCounter';
import { StopwatchTimer } from './components/StopwatchTimer';
import { SeoContent } from './components/SeoContent';
import { Footer } from './components/Footer';

const DEFAULT_SAMPLE_TEXT = `Welcome to OmniTool Global — the high-accuracy productivity suite built for creators, international writers, students, and engineers worldwide!

Whether you are writing academic essays, optimizing marketing headlines, timing sports laps, or conducting focus sessions, our real-time platform delivers atomic precision.

Try selecting any case conversion above: transform this paragraph into Title Case, UPPERCASE, Sentence case, or clean up extra spaces. Notice how our live word and character counters update instantaneously with zero latency.`;

const MULTILINGUAL_SAMPLE = `Hello world! Welcome to OmniTool Global.
¡Hola Mundo! Bienvenido a la herramienta global de texto.
Bonjour le monde! Bienvenue sur notre plateforme universelle.
こんにちは世界！高精度の多言語文字数・単語数カウントに対応しています。
你好，世界！支持精确的多语言字数统计与大小写转换。
مرحبا بالعالم! دعم فائق الدقة للغة العربية مع احتساب دقيق للكلمات والحروف.
ہیلو دنیا! اردو میں الفاظ اور حروف کی درست گنتی کا نظام۔
नमस्ते दुनिया! हिंदी और देवनागरी लिपि के लिए वास्तविक समय में शब्द गणना।`;

const CODE_SAMPLE = `// API Response Data
const userPayload = {
  first_name: "Alexander",
  last_name: "Hamilton",
  contact_email: "alexander@example.org",
  account_is_active: true,
  preferred_language: "en-US",
  session_timeout_seconds: 1800
};`;

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('omnitool_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('omnitool_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // View Mode: 'all' | 'text' | 'timer'
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // Text state
  const [text, setText] = useState<string>(() => {
    const saved = localStorage.getItem('omnitool_text');
    return saved !== null ? saved : DEFAULT_SAMPLE_TEXT;
  });

  // Sync dark class on root html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omnitool_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omnitool_theme', 'light');
    }
  }, [isDark]);

  // Persist text state
  useEffect(() => {
    try {
      localStorage.setItem('omnitool_text', text);
    } catch {
      // Ignore quota errors
    }
  }, [text]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('omnitool_sound', String(next));
      return next;
    });
  };

  const handleLoadSample = (sampleType: 'english' | 'multilingual' | 'code') => {
    if (sampleType === 'english') setText(DEFAULT_SAMPLE_TEXT);
    else if (sampleType === 'multilingual') setText(MULTILINGUAL_SAMPLE);
    else if (sampleType === 'code') setText(CODE_SAMPLE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Universal Top Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDark={isDark}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onLoadSample={handleLoadSample}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Requirement 3: Top Ad Space */}
        <AdBanner position="top" />

        {/* Dynamic Tool Interface based on View Mode */}
        {viewMode === 'all' && (
          <div className="space-y-8">
            {/* Tool 2 & Tool 3: Word Counter & Case Converter */}
            <section aria-label="Text & Case Utilities">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tool 1 & 2 • Live Text Counter & Universal Case Converter
                </h2>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Real-time • 100% Client-Side
                </span>
              </div>
              <WordCounter text={text} setText={setText} />
            </section>

            {/* Tool 1: High-Precision Stopwatch & Countdown Timer */}
            <section aria-label="Stopwatch & Timer Utilities">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tool 3 • High-Precision Web Stopwatch & Countdown Timer
                </h2>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Atomic Millisecond Precision
                </span>
              </div>
              <StopwatchTimer soundEnabled={soundEnabled} />
            </section>
          </div>
        )}

        {viewMode === 'text' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Live Global Text Counter & Case Converter
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Instant word, character, sentence, and reading-time calculations with one-click case transformations.
              </p>
            </div>
            <WordCounter text={text} setText={setText} />
          </div>
        )}

        {viewMode === 'timer' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                High-Precision Stopwatch & Countdown Timer
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Zero-drift millisecond split tracking and focus countdown with melodic alert signals.
              </p>
            </div>
            <StopwatchTimer soundEnabled={soundEnabled} />
          </div>
        )}

        {/* Requirement 3: Bottom Ad Space */}
        <AdBanner position="bottom" />

        {/* Requirement 4: Global Technical SEO Content block */}
        <SeoContent />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
