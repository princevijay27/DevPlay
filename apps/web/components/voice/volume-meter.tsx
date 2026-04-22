"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const BAR_COUNT = 5;

export function VolumeMeter({ stream }: { stream: MediaStream | null }) {
  const [levels, setLevels] = useState(Array.from({ length: BAR_COUNT }, () => 0.18));

  useEffect(() => {
    if (!stream) {
      setLevels(Array.from({ length: BAR_COUNT }, () => 0.18));
      return;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    const audioContext = new AudioContextCtor();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.82;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    let frameId = 0;

    const tick = () => {
      analyser.getByteFrequencyData(buffer);
      const bucketSize = Math.max(1, Math.floor(buffer.length / BAR_COUNT));

      const nextLevels = Array.from({ length: BAR_COUNT }, (_, index) => {
        const start = index * bucketSize;
        const end = Math.min(buffer.length, start + bucketSize);
        const slice = buffer.slice(start, end);
        const average = slice.reduce((sum, value) => sum + value, 0) / Math.max(1, slice.length);
        return Math.max(0.18, average / 180);
      });

      setLevels(nextLevels);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
      source.disconnect();
      analyser.disconnect();
      void audioContext.close();
      setLevels(Array.from({ length: BAR_COUNT }, () => 0.18));
    };
  }, [stream]);

  return (
    <div aria-hidden="true" className="flex h-20 items-end justify-center gap-2">
      {levels.map((level, index) => (
        <motion.div
          key={index}
          animate={{ scaleY: level }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className="h-14 w-3 origin-bottom rounded-full bg-[var(--color-accent)]"
        />
      ))}
    </div>
  );
}
