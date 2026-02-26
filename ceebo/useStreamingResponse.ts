/**
 * CEEBO — Streaming response with typing simulation
 *
 * Word-based streaming. Supports cancellation.
 * No layout shift. Preserves markdown (passed through as text).
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseStreamingResponseOptions {
  fullText: string;
  speedMs?: number;
  onComplete?: () => void;
  cancelled?: boolean;
}

export interface UseStreamingResponseReturn {
  display: string;
  isComplete: boolean;
  isCancelled: boolean;
}

export function useStreamingResponse({
  fullText,
  speedMs = 35,
  onComplete,
  cancelled = false,
}: UseStreamingResponseOptions): UseStreamingResponseReturn {
  const [display, setDisplay] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const prevFullTextRef = useRef('');
  onCompleteRef.current = onComplete;

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const wasCancelled =
      cancelled ||
      (prevFullTextRef.current.length > 0 && fullText.length === 0);
    prevFullTextRef.current = fullText;

    if (wasCancelled || fullText.length === 0) {
      stop();
      setDisplay(fullText);
      setIsComplete(true);
      return;
    }

    indexRef.current = 0;
    setDisplay('');
    setIsComplete(false);
    stop();

    const words = fullText.split(/(\s+)/);
    let i = 0;

    timerRef.current = setInterval(() => {
      if (i >= words.length) {
        stop();
        setIsComplete(true);
        onCompleteRef.current?.();
        return;
      }
      const next = words.slice(0, i + 1).join('');
      setDisplay(next);
      i += 1;
    }, speedMs);

    return stop;
  }, [fullText, speedMs, cancelled, stop]);

  return {
    display,
    isComplete,
    isCancelled: cancelled,
  };
}
