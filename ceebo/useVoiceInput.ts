/**
 * CEEBO — Web Speech API voice input hook
 *
 * Uses SpeechRecognition (webkit prefix fallback).
 * Cleans up on unmount. Graceful fallback if unsupported.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  0?: { transcript: string };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { resultIndex: number; results: SpeechRecognitionResultItem[] }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

const SpeechRecognitionAPI =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
    : undefined;

export function useVoiceInput({
  onResult,
  continuous = false,
  interimResults = true,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognitionAPI>> | null>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const isSupported = Boolean(SpeechRecognitionAPI);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        // Ignore if already stopped
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    setError(null);
    setTranscript('');

    const rec = new SpeechRecognitionAPI();
    rec.continuous = continuous;
    rec.interimResults = interimResults;
    rec.lang = 'en-US';

    rec.onresult = (e: { resultIndex: number; results: SpeechRecognitionResultItem[] }) => {
      let final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i += 1) {
        const result = e.results[i];
        const t = result?.[0]?.transcript ?? '';
        if (result.isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      const full = final || interim;
      if (full) {
        setTranscript((prev) => (prev + full).trim());
      }
    };

    rec.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    rec.onerror = (e: { error: string }) => {
      if (e.error === 'aborted' || e.error === 'no-speech') return;
      setError(e.error === 'not-allowed' ? 'Microphone access denied.' : `Voice error: ${e.error}`);
    };

    try {
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    } catch (err) {
      setError('Could not start voice recognition.');
    }
  }, [continuous, interimResults]);

  useEffect(() => {
    return () => {
      const rec = recognitionRef.current;
      if (rec) {
        try {
          rec.abort();
        } catch {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (transcript && onResultRef.current) {
      onResultRef.current(transcript);
    }
  }, [transcript]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    error,
  };
}
