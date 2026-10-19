import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  Trash2,
  RotateCcw,
  RotateCw,
  BookOpen,
  Volume2,
  GraduationCap,
  Sparkles,
  Layers,
  FileCheck2,
  FileText,
  Upload
} from 'lucide-react';
import { analyzeText, formatDuration, TextMetrics } from '../utils/textAnalytics';
import { convertCase, CaseType } from '../utils/caseConverter';
import { TextAnalyticsCharts } from './TextAnalyticsCharts';

interface WordCounterProps {
  text: string;
  setText: (newText: string) => void;
}

export const WordCounter: React.FC<WordCounterProps> = ({ text, setText }) => {
  const [metrics, setMetrics] = useState<TextMetrics>(() => analyzeText(text));
  const [copied, setCopied] = useState(false);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);

  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>([text]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isInternalHistoryChange = useRef(false);

  useEffect(() => {
    setMetrics(analyzeText(text));
    if (!isInternalHistoryChange.current) {
      // User typed or text changed from outside
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        if (next[next.length - 1] !== text) {
          return [...next, text].slice(-40); // keep last 40 states
        }
        return next;
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 39));
    }
    isInternalHistoryChange.current = false;
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const applyCaseConversion = (type: CaseType) => {
    setActiveCase(type);
    const converted = convertCase(text, type);
    setText(converted);
    setTimeout(() => setActiveCase(null), 600);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isInternalHistoryChange.current = true;
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isInternalHistoryChange.current = true;
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!text.trim()) return;
    const nowIso = new Date().toISOString();
    const dateFormatted = new Date().toUTCString();

    const reportContent = [
      '==================================================================',
      'OMNITOOL GLOBAL - WORD COUNT & TEXT METRICS REPORT',
      `Generated: ${dateFormatted} (${nowIso})`,
      'Security: 100% Client-Side Isolated Sandbox',
      '==================================================================',
      '',
      '1. WORD & CHARACTER METRICS SUMMARY',
      '------------------------------------------------------------------',
      `Total Words:                  ${metrics.words.toLocaleString()}`,
      `Characters (With Spaces):     ${metrics.charactersWithSpaces.toLocaleString()}`,
      `Characters (Without Spaces):  ${metrics.charactersWithoutSpaces.toLocaleString()}`,
      `Total Sentences:              ${metrics.sentences.toLocaleString()}`,
      `Total Lines:                  ${metrics.lines.toLocaleString()}`,
      `Paragraphs:                   ${metrics.paragraphs.toLocaleString()}`,
      `Estimated Silent Reading:    ${formatDuration(metrics.readingTimeSeconds)} (~225 wpm)`,
      `Estimated Spoken Pacing:      ${formatDuration(metrics.speakingTimeSeconds)} (~130 wpm)`,
      `Reading Grade Level:          ${metrics.readingGradeLevel}`,
      '',
      '==================================================================',
      '2. COMPLETE DOCUMENT TEXT CONTENT',
      '------------------------------------------------------------------',
      text,
      '',
      '==================================================================',
      'End of Report - OmniTool Global (https://omnitoolglobal.com/)',
      '=================================================================='
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `word_count_metrics_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setText(content);
        setImportedFileName(file.name);
        setTimeout(() => setImportedFileName(null), 3500);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    if (text && text.length > 0) {
      setText('');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Real-time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Words */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Words</span>
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {metrics.words.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Multi-language aware</p>
        </div>

        {/* Characters with spaces */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Characters</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">all</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {metrics.charactersWithSpaces.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">With spaces</p>
        </div>

        {/* Characters without spaces */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Chars (No Space)</span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">raw</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {metrics.charactersWithoutSpaces.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Excluding spaces</p>
        </div>

        {/* Sentences */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Sentences</span>
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {metrics.sentences.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Global punctuation</p>
        </div>

        {/* Lines */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Lines</span>
            <Layers className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {metrics.lines.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{metrics.paragraphs} paragraph{metrics.paragraphs === 1 ? '' : 's'}</p>
        </div>

        {/* Reading Time */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-all hover:border-indigo-400 dark:hover:border-indigo-500/50">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span>Reading Time</span>
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white tabular-nums">
            {formatDuration(metrics.readingTimeSeconds)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Speaking: {formatDuration(metrics.speakingTimeSeconds)}</p>
        </div>
      </div>

      {/* Main Text Editor & Universal Case Conversion Controls */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Editor Toolbar with Case Conversion Buttons */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-2.5">
          {/* Universal Case Convert Action Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Convert Case:
            </span>

            <button
              type="button"
              onClick={() => applyCaseConversion('sentence')}
              title="Capitalize the first letter of each sentence"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'sentence'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Sentence case
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('lower')}
              title="Convert all letters to lowercase"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'lower'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              lower case
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('upper')}
              title="Convert all letters to uppercase"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'upper'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              UPPERCASE
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('capitalized')}
              title="Capitalize the first letter of each word"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'capitalized'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Capitalized Case
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('title')}
              title="Smart Title Case (Standard headline capitalization)"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'title'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              Title Case
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('alternating')}
              title="aLtErNaTiNg cAsE"
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                activeCase === 'alternating'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              aLtErNaTiNg
            </button>

            {/* Developer code formats dropdown/pills */}
            <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-slate-300 dark:border-slate-700">
              <button
                type="button"
                onClick={() => applyCaseConversion('camel')}
                title="camelCase"
                className="px-2 py-1 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
              >
                camelCase
              </button>
              <button
                type="button"
                onClick={() => applyCaseConversion('kebab')}
                title="kebab-case"
                className="px-2 py-1 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
              >
                kebab-case
              </button>
              <button
                type="button"
                onClick={() => applyCaseConversion('snake')}
                title="snake_case"
                className="px-2 py-1 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
              >
                snake_case
              </button>
            </div>
          </div>

          {/* Quick Utility Actions: Undo, Redo, Clean spaces, Copy, Download, Clear */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => applyCaseConversion('clean')}
              title="Remove extra duplicate spaces and trim whitespace"
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600"
            >
              Trim & Clean
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".txt,.md,.rtf,.doc,.docx,.json,.csv,.text"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Import text content from a local file (.txt, .md, etc.)"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Import File
            </button>

            <button
              type="button"
              onClick={handleDownload}
              title="Export text input and complete word count metrics as .txt file"
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export .txt
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              title="Clear all text"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Type, paste, or drag your text here... OmniTool accurately counts words and characters across all global languages (English, Chinese, Japanese, Arabic, Urdu, Hindi, Spanish, and more) with real-time case conversion."
            rows={10}
            className="w-full p-4 sm:p-5 bg-transparent resize-y text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none text-base sm:text-lg leading-relaxed font-sans min-h-[220px]"
            spellCheck="true"
          />

          {/* Quick Clear Floating Badge when text is long or file is imported */}
          <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none">
            {importedFileName && (
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/90 border border-emerald-200 dark:border-emerald-800 backdrop-blur px-2 py-0.5 rounded shadow-xs">
                Imported: {importedFileName}
              </span>
            )}
            {text.length > 0 && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur px-2 py-0.5 rounded shadow-xs">
                {metrics.words} words • {metrics.charactersWithSpaces} chars
              </span>
            )}
          </div>
        </div>

        {/* Text Insight Bar: Readability & Top Keywords */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">Estimated Reading Level:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {metrics.readingGradeLevel}
            </span>
          </div>

          {/* Top Keywords Density */}
          {metrics.topKeywords.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-slate-400 font-medium">Top Keywords:</span>
              {metrics.topKeywords.map((item) => (
                <span
                  key={item.word}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/40 text-[11px]"
                >
                  <span className="font-medium">{item.word}</span>
                  <span className="text-[10px] text-indigo-400">({item.count})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recharts Data Visualization Suite */}
      <TextAnalyticsCharts text={text} />
    </div>
  );
};

