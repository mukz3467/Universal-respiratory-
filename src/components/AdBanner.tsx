import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  const isTop = position === 'top';
  const label = isTop ? '[ Future Ad Space - Top Banner ]' : '[ Future Ad Space - Bottom Banner ]';
  const dimensions = '728 × 90 Leaderboard / 320 × 50 Mobile';

  return (
    <aside
      aria-label={`Advertisement ${position}`}
      className={`w-full flex flex-col items-center justify-center my-6 transition-all ${className}`}
    >
      {/* Reserved container with fixed min-height to guarantee ZERO Cumulative Layout Shift (CLS) */}
      <div className="w-full max-w-[728px] min-h-[90px] h-[90px] px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 flex flex-col items-center justify-center text-center relative overflow-hidden select-none transition-colors">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="flex items-center gap-2 mb-1 z-10">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-200/80 dark:bg-slate-800/80 px-2 py-0.5 rounded">
            ADVERTISEMENT
          </span>
          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono z-10 flex items-center gap-1.5">
          <span>{dimensions}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Google AdSense / Media.net Compatible</span>
        </p>
      </div>
    </aside>
  );
};
