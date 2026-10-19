import React, { useState } from 'react';
import { ChevronDown, Globe, ShieldCheck, Zap, Laptop } from 'lucide-react';

export const SeoContent: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the multi-lingual word counter count Asian and non-spaced languages?',
      a: 'Unlike basic counters that only split by whitespace, OmniTool leverages the standard ECMAScript Intl.Segmenter API with word granularity. This correctly identifies morphological word boundaries in Chinese (Hanzi), Japanese (Kanji/Hiragana/Katakana), Korean (Hangul), Thai, as well as complex scripts like Arabic, Urdu, and Hindi (Devanagari).'
    },
    {
      q: 'Is my text sent to any server or recorded in a database?',
      a: 'Never. 100% of text processing, tokenization, case conversion, and stopwatch calculations occur exclusively inside your web browser. No text data ever leaves your device, guaranteeing total privacy for sensitive documents, proprietary code, and creative writing.'
    },
    {
      q: 'How is the stopwatch and timer accuracy maintained when switching browser tabs?',
      a: 'Traditional JavaScript setInterval timers suffer from browser background throttling. OmniTool calculates time using high-resolution performance.now() and epoch timestamp deltas, ensuring absolute millisecond accuracy with zero drift even when your screen is locked or tab is minimized.'
    },
    {
      q: 'What case formats are supported by the Universal Case Converter?',
      a: 'The converter supports Sentence case, lowercase, UPPERCASE, Capitalized Case, Title Case (standard headline style with minor prepositions lowercased), alternating cAsE, plus developer formats including camelCase, kebab-case, snake_case, and PascalCase, along with extra whitespace removal.'
    }
  ];

  return (
    <section className="w-full mt-12 pt-10 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
            <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-2 mx-auto md:mx-0" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              Universal Multi-Lingual Support
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Engineered for writers, scholars, and professionals working in English, Spanish, Mandarin, Japanese, Arabic, Hindi, Urdu, and over 100 global languages.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
            <Zap className="w-6 h-6 text-amber-500 mb-2 mx-auto md:mx-0" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              Zero Drift Atomic Timing
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              High-precision performance.now() delta engine guarantees split-second millisecond stopwatch and countdown timer reliability across all platforms.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2 mx-auto md:mx-0" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              100% Client-Side Privacy
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No server storage, no tracking cookies, no telemetry. Your content stays in your browser cache with seamless offline local storage backup.
            </p>
          </div>
        </div>

        {/* Semantic SEO Article Blocks (Using exact required h3 keywords) */}
        <article className="prose dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Global All-In-One Text Utility
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              OmniTool is a comprehensive, ultra-fast single-page web application engineered to unify everyday digital productivity. By consolidating a real-time multi-language text analyzer, an intelligent case transformation engine, and an atomic precision stopwatch and countdown timer into a unified dashboard, users across North America, Europe, Asia, Latin America, and Africa eliminate the friction of juggling disconnected online tools.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Free Online Word Counter and Case Converter
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Our live word counter calculates word volume, total characters with spaces, raw characters without whitespace, sentence structures, paragraph divisions, line counts, and estimated reading and speaking durations simultaneously as you type. Combined with our universal case converter, you can effortlessly switch any document between Sentence case, Title Case, UPPERCASE, lowercase, Capitalized Case, and developer identifiers (camelCase, kebab-case, snake_case) with 100% syntactic accuracy.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              High-Precision Web Stopwatch
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Inspired by international atomic standards such as time.is, our stopwatch and countdown timer operate on hardware-synchronized delta timers rather than drift-prone intervals. Whether timing track laps, speech rehearsals, focus sprints (Pomodoro 25-minute intervals), or classroom exams, you benefit from millisecond precision, split-time tracking, fastest/slowest lap comparison, and Web Audio melodic completion signals.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Multi-language character counter for international writers and professionals
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Standard word counters frequently fail when evaluating non-Latin character sets such as Chinese (CJK), Japanese kanji/kana, Korean Hangul, Arabic, Urdu Nastaliq, or Hindi Devanagari due to absence of standard ASCII whitespace delimiters. OmniTool integrates modern international segmenters that adhere to Unicode standard Annex #29, providing accurate word, token, and character counts across any script.
            </p>
          </div>
        </article>

        {/* Global Reference Comparison Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
            Multi-Script Counting Benchmark Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-slate-400 font-medium">
                  <th className="p-3">Script Family</th>
                  <th className="p-3">Sample Languages</th>
                  <th className="p-3">Word Segmentation</th>
                  <th className="p-3">Punctuation Detection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 font-sans">Latin / Cyrillic / Greek</td>
                  <td className="p-3 text-slate-500 font-sans">English, Spanish, French, German, Russian</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400">Unicode Word Boundaries</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">. ! ?</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 font-sans">CJK (East Asian)</td>
                  <td className="p-3 text-slate-500 font-sans">Chinese (Simplified/Traditional), Japanese, Korean</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400">Intl.Segmenter Morphological</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">。 ！ ？</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 font-sans">Right-to-Left (RTL)</td>
                  <td className="p-3 text-slate-500 font-sans">Arabic, Urdu, Persian, Hebrew</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400">Unicode Tokenizer + Zero-Width Joiner</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">۔ ؟ .</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 font-sans">Indic (Brahmic)</td>
                  <td className="p-3 text-slate-500 font-sans">Hindi, Bengali, Tamil, Telugu, Marathi</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400">Matra & Virama Compound Clustering</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">। . ! ?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h4>
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-indigo-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
