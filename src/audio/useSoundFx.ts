import { useCallback, useMemo, useRef, useState } from "react";
import type { BoardFxType } from "../3d/types/render3d";

type SoundShape = {
  frequency: number;
  endFrequency: number;
  duration: number;
  gain: number;
  wave: OscillatorType;
};

const soundMap: Record<BoardFxType | "ui", SoundShape> = {
  spawn: { frequency: 220, endFrequency: 660, duration: 0.34, gain: 0.08, wave: "triangle" },
  select: { frequency: 520, endFrequency: 380, duration: 0.09, gain: 0.035, wave: "sine" },
  group: { frequency: 330, endFrequency: 880, duration: 0.42, gain: 0.07, wave: "triangle" },
  capture: { frequency: 120, endFrequency: 48, duration: 0.28, gain: 0.09, wave: "sawtooth" },
  mission: { frequency: 440, endFrequency: 990, duration: 0.55, gain: 0.07, wave: "sine" },
  ui: { frequency: 320, endFrequency: 460, duration: 0.08, gain: 0.025, wave: "square" }
};

function createContext(): AudioContext | undefined {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return undefined;
  return new AudioContextCtor();
}

export function useSoundFx(initialMuted = false) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(initialMuted);

  const play = useCallback(
    (type: BoardFxType | "ui") => {
      if (muted || typeof window === "undefined") return;

      const context = audioContextRef.current ?? createContext();
      if (!context) return;
      audioContextRef.current = context;

      if (context.state === "suspended") {
        void context.resume();
      }

      const shape = soundMap[type];
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;

      oscillator.type = shape.wave;
      oscillator.frequency.setValueAtTime(shape.frequency, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, shape.endFrequency), now + shape.duration);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(shape.gain, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + shape.duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + shape.duration + 0.03);
    },
    [muted]
  );

  return useMemo(
    () => ({
      muted,
      play,
      toggleMuted: () => setMuted((value) => !value)
    }),
    [muted, play]
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
