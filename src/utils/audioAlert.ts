/**
 * Web Audio API based melodic chime generator.
 * Zero external audio files required, 100% offline-ready and instant.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function playTimerCompletionChime(volume = 0.4): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Gentle 4-tone chime: C5, E5, G5, C6
  const notes = [
    { freq: 523.25, time: 0.0, dur: 0.18 },
    { freq: 659.25, time: 0.16, dur: 0.18 },
    { freq: 783.99, time: 0.32, dur: 0.22 },
    { freq: 1046.5, time: 0.50, dur: 0.60 }
  ];

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    // Envelope
    gain.gain.setValueAtTime(0.001, now + note.time);
    gain.gain.exponentialRampToValueAtTime(volume, now + note.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.dur + 0.05);
  });
}

export function playButtonTick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(800, now);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}
