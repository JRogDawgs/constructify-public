/**
 * CEEBO — Speech controller (Phase 3.9.1 Hardening)
 *
 * States: idle | listening | processing
 * - Accumulate all final results (no replace)
 * - Duplicate guard at chunk level
 * - interimResults = false
 * - Restart on browser-induced onend (mobile)
 * - 900ms finalize, 2000ms auto-stop
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { SpeechState, TranscriptPipelineResult } from './ceebo.types';
import { collapseRepeatedPhrase, normalizeTranscript } from './voiceTranscriptUtils';

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  0?: { transcript: string };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  onresult: ((e: { resultIndex: number; results: SpeechRecognitionResultItem[] }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onaudiostart?: () => void;
  onspeechstart?: () => void;
  onspeechend?: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

const SILENCE_FINALIZE_MS = 900;
const SILENCE_AUTO_STOP_MS = 2000;

const SpeechAPI =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
    : undefined;

export interface UseCeeboSpeechOptions {
  onFinalTranscript?: (result: TranscriptPipelineResult) => void;
}

export interface UseCeeboSpeechReturn {
  state: SpeechState;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

function isDuplicateAtEnd(existing: string, chunk: string): boolean {
  const c = chunk.trim().toLowerCase();
  if (!c) return true;
  const e = existing.trim().toLowerCase();
  if (!e) return false;
  return e.endsWith(c) || e.endsWith(c + ' ');
}

export function useCeeboSpeech({
  onFinalTranscript,
}: UseCeeboSpeechOptions = {}): UseCeeboSpeechReturn {
  const [state, setState] = useState<SpeechState>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = useRef('');
  const finalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeechAtRef = useRef(0);
  const intentionalStopRef = useRef(false);
  const onFinalRef = useRef(onFinalTranscript);
  onFinalRef.current = onFinalTranscript;

  const clearFinalizeTimer = useCallback(() => {
    if (finalizeTimerRef.current) {
      clearTimeout(finalizeTimerRef.current);
      finalizeTimerRef.current = null;
    }
  }, []);

  const clearAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    intentionalStopRef.current = true;
    clearFinalizeTimer();
    clearAutoStopTimer();
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    }
    setState('idle');
  }, [clearFinalizeTimer, clearAutoStopTimer]);

  const commitFinalTranscript = useCallback(() => {
    const raw = finalTranscriptRef.current.trim();
    if (!raw) return;

    const collapsed = collapseRepeatedPhrase(raw);
    const normalized = normalizeTranscript(collapsed);

    if (process.env.NODE_ENV !== "production") {
      const timeSince = Date.now() - lastSpeechAtRef.current;
      console.log('[VOICE] Final transcript committed', { length: normalized.length, timeSinceLastSpeechMs: timeSince, transcript: normalized.slice(0, 80) });
    }

    setTranscript(normalized);
    onFinalRef.current?.({
      raw: collapsed,
      normalized,
      final: normalized,
    });
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechAPI) {
      setError('Voice input is not supported.');
      return;
    }
    setError(null);
    setTranscript('');
    finalTranscriptRef.current = '';
    intentionalStopRef.current = false;
    clearFinalizeTimer();
    clearAutoStopTimer();
    lastSpeechAtRef.current = Date.now();

    const rec = new SpeechAPI();
    rec.continuous = true;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.lang = 'en-US';

    rec.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultItem[] }) => {
      if (process.env.NODE_ENV !== "production") {
        console.log('[VOICE] resultIndex:', e.resultIndex);
      }

      const { results } = e;

      for (let i = e.resultIndex; i < results.length; i += 1) {
        if (results[i]?.isFinal !== true) continue;

        const chunk = (results[i]?.[0]?.transcript ?? '').trim();
        if (!chunk) continue;

        if (isDuplicateAtEnd(finalTranscriptRef.current, chunk)) continue;

        finalTranscriptRef.current += chunk + ' ';
      }

      lastSpeechAtRef.current = Date.now();

      if (process.env.NODE_ENV !== "production") {
        console.log('[VOICE] finalTranscript length:', finalTranscriptRef.current.length);
      }

      const cleaned = normalizeTranscript(finalTranscriptRef.current);
      setTranscript(cleaned);

      clearFinalizeTimer();
      finalizeTimerRef.current = setTimeout(commitFinalTranscript, SILENCE_FINALIZE_MS);

      clearAutoStopTimer();
      autoStopTimerRef.current = setTimeout(stopListening, SILENCE_AUTO_STOP_MS);
    };

    rec.onend = () => {
      clearFinalizeTimer();
      clearAutoStopTimer();
      recognitionRef.current = null;

      if (intentionalStopRef.current) {
        setState((s) => (s === 'listening' ? 'idle' : s));
        return;
      }

      try {
        rec.start();
        recognitionRef.current = rec;
        if (process.env.NODE_ENV !== "production") console.log('[VOICE] restarted recognition');
      } catch {
        setState('idle');
      }
    };

    rec.onerror = (e: { error: string }) => {
      if (e.error === 'aborted' || e.error === 'no-speech') return;
      setError(e.error === 'not-allowed' ? 'Microphone access denied.' : `Voice: ${e.error}`);
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setState('listening');
    } catch {
      setError('Could not start voice recognition.');
    }
  }, [commitFinalTranscript, clearFinalizeTimer, clearAutoStopTimer, stopListening]);

  useEffect(() => {
    return () => {
      intentionalStopRef.current = true;
      clearFinalizeTimer();
      clearAutoStopTimer();
      const rec = recognitionRef.current;
      if (rec) {
        try {
          rec.abort();
        } catch {
          /* ignore */
        }
      }
    };
  }, [clearFinalizeTimer, clearAutoStopTimer]);

  return {
    state,
    isSupported: Boolean(SpeechAPI),
    transcript,
    startListening,
    stopListening,
    error,
  };
}
