/**
 * CEEBO — Typewriter effect hook
 *
 * Animates text character by character. Cleans up timers properly.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTypewriterOptions {
  text: string;
  speedMs?: number;
  onComplete?: () => void;
  enabled?: boolean;
}

export function useTypewriter({
  text,
  speedMs = 30,
  onComplete,
  enabled = true,
}: UseTypewriterOptions): { display: string; isComplete: boolean } {
  const [display, setDisplay] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplay('');
      setIsComplete(false);
      indexRef.current = 0;
      clearTimer();
      return;
    }

    indexRef.current = 0;
    setDisplay('');
    setIsComplete(false);
    clearTimer();

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplay(next);

      if (indexRef.current >= text.length) {
        clearTimer();
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speedMs);

    return clearTimer;
  }, [text, speedMs, enabled, clearTimer]);

  return { display, isComplete };
}
