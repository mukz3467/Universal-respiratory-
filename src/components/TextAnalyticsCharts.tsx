import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import { BarChart3, Type, AlignLeft, Info } from 'lucide-react';
import {
  computeWordLengthDistribution,
  computeCharacterFrequency
} from '../utils/textAnalytics';

interface TextAnalyticsChartsProps {
  text: string;
}

export const TextAnalyticsCharts: React.FC<TextAnalyticsChartsProps> = ({ text }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'words' | 'chars'>('both');

  const wordLengthStats = useMemo(() => computeWordLengthDistribution(text), [text]);
  const charFreqStats = useMemo(() => computeCharacterFrequency(text), [text]);

  const hasData = text.trim().length > 0 && wordLengthStats.data.length > 0;

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mt-6">
      {/* Header with Title and Mode Switcher */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Text Distribution Visualizer (Recharts)</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60">
                Live
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive bar charts displaying word length variations and character frequencies.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-200/70 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'both'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('words')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'words'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Word Lengths
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chars')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'chars'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Character Frequency
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center text-slate-400 dark:text-slate-600 space-y-2">
          <BarChart3 className="w-10 h-10 mx-auto opacity-40 mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            No text entered yet to visualize.
          </p>
          <p className="text-xs max-w-sm mx-auto">
            Type, paste, or import text above to instantly generate dynamic Recharts distributions of word lengths and character occurrences.
          </p>
        </div>
      ) : (
        <div className="p-5 space-y-6">
          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Average Word Length</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {wordLengthStats.averageLength} letters
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Most Common Length</span>
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {wordLengthStats.mostCommonLength}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Vowels vs Consonants</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                {charFreqStats.vowelsCount} / {charFreqStats.consonantsCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Top Character</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {charFreqStats.topCharacters.length > 0
                  ? `"${charFreqStats.topCharacters[0].display}" (${charFreqStats.topCharacters[0].count}×)`
                  : '–'}
              </span>
            </div>
          </div>

          {/* Charts Container */}
          <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Chart 1: Word Length Distribution */}
            {(activeTab === 'both' || activeTab === 'words') && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-indigo-500" />
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Word Length Distribution
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {wordLengthStats.totalWords} words analyzed
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={wordLengthStats.data}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={<CustomTooltip type="words" />}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {wordLengthStats.data.map((entry, index) => {
                          const isPeak = entry.name === wordLengthStats.mostCommonLength;
                          return (
                            <Cell
                              key={`cell-word-${index}`}
                              fill={isPeak ? '#4f46e5' : '#818cf8'}
                              opacity={isPeak ? 1 : 0.85}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Chart 2: Character Frequency Distribution */}
            {(activeTab === 'both' || activeTab === 'chars') && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-cyan-500" />
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      Top Character Frequency
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {charFreqStats.totalChars} glyphs analyzed
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={charFreqStats.topCharacters}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                      <XAxis
                        dataKey="display"
                        tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={<CustomTooltip type="chars" />}
                        cursor={{ fill: 'rgba(6, 182, 212, 0.08)' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {charFreqStats.topCharacters.map((_, index) => (
                          <Cell
                            key={`cell-char-${index}`}
                            fill={index === 0 ? '#0891b2' : '#22d3ee'}
                            opacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: {
    name?: string;
    display?: string;
    count?: number;
    percentage?: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  type: 'words' | 'chars';
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, type }) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    if (!item) return null;

    const label = type === 'words' ? item.name : `Character "${item.display}"`;

    return (
      <div className="px-3 py-2 rounded-lg bg-slate-900 text-white dark:bg-slate-800 border border-slate-700 shadow-xl text-xs space-y-1">
        <div className="font-bold text-slate-200">{label}</div>
        <div className="flex items-center gap-3 text-slate-300 font-mono">
          <span>Count: <strong className="text-white">{item.count?.toLocaleString()}</strong></span>
          <span>Share: <strong className="text-cyan-400">{item.percentage}%</strong></span>
        </div>
      </div>
    );
  }
  return null;
};
