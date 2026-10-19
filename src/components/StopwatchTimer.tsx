import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Flag,
  Timer as TimerIcon,
  Clock as ClockIcon,
  Globe,
  Bell,
  Plus,
  Volume2,
  Trash2,
  Trophy
} from 'lucide-react';
import { playTimerCompletionChime, playButtonTick } from '../utils/audioAlert';

interface LapRecord {
  lapNumber: number;
  lapTime: number; // in milliseconds
  overallTime: number; // in milliseconds
}

interface StopwatchTimerProps {
  soundEnabled: boolean;
}

export const StopwatchTimer: React.FC<StopwatchTimerProps> = ({ soundEnabled }) => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'countdown' | 'worldclock'>('stopwatch');

  // -------------------------------------------------------------
  // STOPWATCH STATE (Drift-proof high-precision via performance.now)
  // -------------------------------------------------------------
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0); // in ms
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const swStartTimeRef = useRef<number>(0);
  const swAccumulatedRef = useRef<number>(0);
  const swAnimationIdRef = useRef<number | null>(null);

  const updateStopwatch = useCallback(() => {
    if (swRunning) {
      const now = performance.now();
      const current = swAccumulatedRef.current + (now - swStartTimeRef.current);
      setSwElapsed(current);
      swAnimationIdRef.current = requestAnimationFrame(updateStopwatch);
    }
  }, [swRunning]);

  useEffect(() => {
    if (swRunning) {
      swStartTimeRef.current = performance.now();
      swAnimationIdRef.current = requestAnimationFrame(updateStopwatch);
    } else {
      if (swAnimationIdRef.current) {
        cancelAnimationFrame(swAnimationIdRef.current);
      }
    }
    return () => {
      if (swAnimationIdRef.current) {
        cancelAnimationFrame(swAnimationIdRef.current);
      }
    };
  }, [swRunning, updateStopwatch]);

  const toggleStopwatch = () => {
    if (soundEnabled) playButtonTick();
    if (swRunning) {
      // Pause
      swAccumulatedRef.current += performance.now() - swStartTimeRef.current;
      setSwRunning(false);
    } else {
      // Start/Resume
      swStartTimeRef.current = performance.now();
      setSwRunning(true);
    }
  };

  const resetStopwatch = () => {
    if (soundEnabled) playButtonTick();
    setSwRunning(false);
    swAccumulatedRef.current = 0;
    setSwElapsed(0);
    setLaps([]);
  };

  const recordLap = () => {
    if (soundEnabled) playButtonTick();
    const currentTotal = swElapsed;
    const lastTotal = laps.length > 0 ? laps[0].overallTime : 0;
    const lapDuration = currentTotal - lastTotal;

    const newLap: LapRecord = {
      lapNumber: laps.length + 1,
      lapTime: lapDuration,
      overallTime: currentTotal
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  // Find fastest & slowest lap
  const fastestLapTime = laps.length > 1 ? Math.min(...laps.map((l) => l.lapTime)) : null;
  const slowestLapTime = laps.length > 1 ? Math.max(...laps.map((l) => l.lapTime)) : null;

  // -------------------------------------------------------------
  // COUNTDOWN TIMER STATE
  // -------------------------------------------------------------
  const [cdInitialSeconds, setCdInitialSeconds] = useState(300); // 5 minutes default
  const [cdRemainingSeconds, setCdRemainingSeconds] = useState(300);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdFinished, setCdFinished] = useState(false);
  const [cdCustomInput, setCdCustomInput] = useState({ hours: 0, minutes: 5, seconds: 0 });

  const cdEndTimeRef = useRef<number>(0);
  const cdPausedRemainingRef = useRef<number>(300);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (cdRunning) {
      cdEndTimeRef.current = Date.now() + cdPausedRemainingRef.current * 1000;
      interval = setInterval(() => {
        const remainingMs = cdEndTimeRef.current - Date.now();
        const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
        setCdRemainingSeconds(remainingSec);
        cdPausedRemainingRef.current = remainingSec;

        if (remainingSec <= 0) {
          setCdRunning(false);
          setCdFinished(true);
          if (soundEnabled) {
            playTimerCompletionChime(0.6);
          }
          if (interval) clearInterval(interval);
        }
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cdRunning, soundEnabled]);

  const toggleCountdown = () => {
    if (soundEnabled) playButtonTick();
    if (cdFinished) {
      setCdFinished(false);
      setCdRemainingSeconds(cdInitialSeconds);
      cdPausedRemainingRef.current = cdInitialSeconds;
      setCdRunning(true);
      return;
    }

    if (cdRunning) {
      setCdRunning(false);
    } else {
      if (cdRemainingSeconds <= 0) {
        setCdRemainingSeconds(cdInitialSeconds);
        cdPausedRemainingRef.current = cdInitialSeconds;
      }
      setCdFinished(false);
      setCdRunning(true);
    }
  };

  const resetCountdown = () => {
    if (soundEnabled) playButtonTick();
    setCdRunning(false);
    setCdFinished(false);
    setCdRemainingSeconds(cdInitialSeconds);
    cdPausedRemainingRef.current = cdInitialSeconds;
  };

  const addTime = (additionalSeconds: number) => {
    if (soundEnabled) playButtonTick();
    const newRemaining = cdRemainingSeconds + additionalSeconds;
    setCdRemainingSeconds(newRemaining);
    cdPausedRemainingRef.current = newRemaining;
    if (cdRunning) {
      cdEndTimeRef.current = Date.now() + newRemaining * 1000;
    }
    setCdFinished(false);
  };

  const applyPreset = (seconds: number) => {
    if (soundEnabled) playButtonTick();
    setCdRunning(false);
    setCdFinished(false);
    setCdInitialSeconds(seconds);
    setCdRemainingSeconds(seconds);
    cdPausedRemainingRef.current = seconds;
  };

  const handleCustomSet = (e: React.FormEvent) => {
    e.preventDefault();
    const totalSec =
      Math.max(0, cdCustomInput.hours) * 3600 +
      Math.max(0, cdCustomInput.minutes) * 60 +
      Math.max(0, cdCustomInput.seconds);
    if (totalSec > 0) {
      applyPreset(totalSec);
    }
  };

  // -------------------------------------------------------------
  // WORLD CLOCK (time.is inspired precision time display)
  // -------------------------------------------------------------
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Helpers
  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
      centiseconds: pad(centiseconds)
    };
  };

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds)
    };
  };

  const swFormatted = formatStopwatch(swElapsed);
  const cdFormatted = formatCountdown(cdRemainingSeconds);
  const cdProgressPercent =
    cdInitialSeconds > 0 ? Math.max(0, Math.min(100, (cdRemainingSeconds / cdInitialSeconds) * 100)) : 0;

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Sub-Navigation Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('stopwatch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'stopwatch'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClockIcon className="w-3.5 h-3.5" />
            <span>Precision Stopwatch</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('countdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'countdown'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TimerIcon className="w-3.5 h-3.5" />
            <span>Countdown Timer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('worldclock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'worldclock'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>World Clocks</span>
          </button>
        </div>

        {/* Global Reference Status */}
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>UTC: {currentTime.toISOString().substring(11, 19)}</span>
        </div>
      </div>

      <div className="p-6">
        {/* ======================================================== */}
        {/* TAB 1: STOPWATCH */}
        {/* ======================================================== */}
        {activeTab === 'stopwatch' && (
          <div className="space-y-6">
            {/* Display */}
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="text-5xl sm:text-7xl md:text-8xl font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums flex items-baseline">
                {Number(swFormatted.hours) > 0 && (
                  <>
                    <span>{swFormatted.hours}</span>
                    <span className="text-slate-400 mx-1">:</span>
                  </>
                )}
                <span>{swFormatted.minutes}</span>
                <span className="text-slate-400 mx-1">:</span>
                <span>{swFormatted.seconds}</span>
                <span className="text-2xl sm:text-4xl text-indigo-600 dark:text-indigo-400 font-semibold ml-2">
                  .{swFormatted.centiseconds}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                High-precision millisecond timing • Zero drift
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleStopwatch}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all ${
                  swRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {swRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> {swElapsed > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={recordLap}
                disabled={!swRunning}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <Flag className="w-4 h-4 text-indigo-500" />
                <span>Lap / Split</span>
              </button>

              <button
                type="button"
                onClick={resetStopwatch}
                disabled={swElapsed === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Laps List */}
            {laps.length > 0 && (
              <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>LAP RECORD ({laps.length})</span>
                  <button
                    type="button"
                    onClick={() => setLaps([])}
                    className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Laps
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
                  {laps.map((lap) => {
                    const isFastest = laps.length > 1 && lap.lapTime === fastestLapTime;
                    const isSlowest = laps.length > 1 && lap.lapTime === slowestLapTime;
                    const formattedLap = formatStopwatch(lap.lapTime);
                    const formattedTotal = formatStopwatch(lap.overallTime);

                    return (
                      <div
                        key={lap.lapNumber}
                        className={`px-4 py-2 flex items-center justify-between transition-colors ${
                          isFastest
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300'
                            : isSlowest
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300'
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-400 w-12">
                            Lap {lap.lapNumber.toString().padStart(2, '0')}
                          </span>
                          {isFastest && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Trophy className="w-2.5 h-2.5" /> Best
                            </span>
                          )}
                          {isSlowest && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">
                              Slowest
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <span className="font-bold">
                            +{formattedLap.minutes}:{formattedLap.seconds}.{formattedLap.centiseconds}
                          </span>
                          <span className="text-slate-400">
                            {formattedTotal.minutes}:{formattedTotal.seconds}.{formattedTotal.centiseconds}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: COUNTDOWN TIMER */}
        {/* ======================================================== */}
        {activeTab === 'countdown' && (
          <div className="space-y-6">
            {/* Countdown Display & Radial Bar */}
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
              {/* Progress bar background line */}
              <div
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-300 ${
                  cdFinished ? 'bg-rose-500 animate-pulse w-full' : 'bg-indigo-600 dark:bg-indigo-500'
                }`}
                style={{ width: `${cdFinished ? 100 : cdProgressPercent}%` }}
              />

              <div
                className={`text-6xl sm:text-7xl md:text-8xl font-mono font-bold tracking-tight tabular-nums transition-colors ${
                  cdFinished
                    ? 'text-rose-600 dark:text-rose-400 animate-bounce'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {Number(cdFormatted.hours) > 0 && (
                  <>
                    <span>{cdFormatted.hours}</span>
                    <span className="text-slate-400 mx-1">:</span>
                  </>
                )}
                <span>{cdFormatted.minutes}</span>
                <span className="text-slate-400 mx-1">:</span>
                <span>{cdFormatted.seconds}</span>
              </div>

              {cdFinished ? (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-sm font-semibold mt-2">
                  <Bell className="w-4 h-4 animate-spin" /> Time Completed!
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {cdRunning ? 'Timer counting down...' : 'Set duration or choose a quick preset'}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleCountdown}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all ${
                  cdRunning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25'
                }`}
              >
                {cdRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> {cdFinished ? 'Restart' : 'Start'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => addTime(60)}
                className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> 1 Min
              </button>

              <button
                type="button"
                onClick={() => addTime(300)}
                className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> 5 Min
              </button>

              <button
                type="button"
                onClick={resetCountdown}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => playTimerCompletionChime(0.5)}
                title="Test completion chime audio"
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Quick Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '1 Min', sec: 60 },
                  { label: '3 Min', sec: 180 },
                  { label: '5 Min', sec: 300 },
                  { label: '10 Min', sec: 600 },
                  { label: '15 Min', sec: 900 },
                  { label: '25m Pomodoro', sec: 1500 },
                  { label: '45m Focus', sec: 2700 },
                  { label: '60m (1 Hr)', sec: 3600 }
                ].map((preset) => (
                  <button
                    key={preset.sec}
                    type="button"
                    onClick={() => applyPreset(preset.sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      cdInitialSeconds === preset.sec
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Hours / Minutes / Seconds Setup */}
            <form
              onSubmit={handleCustomSet}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Custom Duration:</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={cdCustomInput.hours}
                    onChange={(e) =>
                      setCdCustomInput((prev) => ({ ...prev, hours: parseInt(e.target.value) || 0 }))
                    }
                    className="w-14 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-slate-900 dark:text-white"
                  />
                  <span>h</span>

                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={cdCustomInput.minutes}
                    onChange={(e) =>
                      setCdCustomInput((prev) => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))
                    }
                    className="w-14 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-slate-900 dark:text-white"
                  />
                  <span>m</span>

                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={cdCustomInput.seconds}
                    onChange={(e) =>
                      setCdCustomInput((prev) => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))
                    }
                    className="w-14 p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center text-slate-900 dark:text-white"
                  />
                  <span>s</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Set Custom Timer
              </button>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: WORLD CLOCKS (time.is inspired) */}
        {/* ======================================================== */}
        {activeTab === 'worldclock' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-precision atomic reference times across major international time zones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Your Local Time', timeZone: undefined, badge: 'Current Device' },
                { name: 'Universal Time (UTC)', timeZone: 'UTC', badge: 'UTC / GMT' },
                { name: 'London', timeZone: 'Europe/London', badge: 'BST / GMT' },
                { name: 'New York', timeZone: 'America/New_York', badge: 'EDT / EST' },
                { name: 'Tokyo', timeZone: 'Asia/Tokyo', badge: 'JST (+9)' },
                { name: 'Sydney', timeZone: 'Australia/Sydney', badge: 'AEST (+10)' }
              ].map((zone) => {
                const formatter = new Intl.DateTimeFormat('en-US', {
                  timeZone: zone.timeZone,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false
                });
                const dateFormatter = new Intl.DateTimeFormat('en-US', {
                  timeZone: zone.timeZone,
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={zone.name}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{zone.name}</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {zone.badge}
                      </span>
                    </div>
                    <div className="text-2xl font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                      {formatter.format(currentTime)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {dateFormatter.format(currentTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
