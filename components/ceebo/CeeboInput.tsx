"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Mic } from "lucide-react"

const PLACEHOLDER =
  "Ask rough — pricing, crews, clock-ins, subs, safety, fit…"

/** Narrow Web Speech API surface (project TS may omit DOM speech typings). */
interface CeeboSpeechRecognitionInstance {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onresult: ((ev: CeeboSpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

interface CeeboSpeechRecognitionEvent {
  resultIndex: number
  results: ArrayLike<{
    isFinal: boolean
    0: { transcript: string }
  }>
}

type CeeboSpeechRecognitionCtor = new () => CeeboSpeechRecognitionInstance

function getSpeechRecognitionCtor(): CeeboSpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null
  const w = window as Window & {
    SpeechRecognition?: CeeboSpeechRecognitionCtor
    webkitSpeechRecognition?: CeeboSpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export interface CeeboInputProps {
  onSend: (text: string) => void
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  /** While CEEBO is preparing a reply — blocks send and mic. */
  busy?: boolean
}

export const CeeboInput = React.memo(function CeeboInput({
  onSend,
  placeholder = PLACEHOLDER,
  value: controlledValue,
  onChangeText: onControlledChange,
  busy = false,
}: CeeboInputProps) {
  const [internalText, setInternalText] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const [recording, setRecording] = useState(false)

  const recRef = useRef<CeeboSpeechRecognitionInstance | null>(null)
  const finalsRef = useRef("")

  const isControlled = controlledValue !== undefined
  const text = isControlled ? controlledValue : internalText
  const setText = useCallback(
    (v: string) => {
      if (isControlled) onControlledChange?.(v)
      else setInternalText(v)
    },
    [isControlled, onControlledChange]
  )

  useEffect(() => {
    setSpeechSupported(getSpeechRecognitionCtor() !== null)
  }, [])

  const stopListening = useCallback(() => {
    try {
      recRef.current?.stop()
    } catch {
      /* ignore */
    }
    recRef.current = null
    setRecording(false)
  }, [])

  const startListening = useCallback(() => {
    if (busy || !speechSupported) return
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return

    stopListening()

    finalsRef.current = ""
    const prefix = text
    const base =
      prefix.length === 0 || /\s$/.test(prefix) ? prefix : `${prefix} `

    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = /^es/i.test(navigator.language || "")
      ? "es-ES"
      : "en-US"

    rec.onresult = (event: CeeboSpeechRecognitionEvent) => {
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        const piece = res[0]?.transcript ?? ""
        if (res.isFinal) finalsRef.current += piece
        else interim += piece
      }
      const spoken = (finalsRef.current + interim).replace(/\s+/g, " ").trim()
      setText(spoken ? `${base}${spoken}` : prefix)
    }

    rec.onerror = () => {
      stopListening()
    }

    rec.onend = () => {
      recRef.current = null
      setRecording(false)
    }

    recRef.current = rec
    setRecording(true)
    try {
      rec.start()
    } catch {
      stopListening()
    }
  }, [busy, speechSupported, text, setText, stopListening])

  useEffect(() => () => stopListening(), [stopListening])

  const handleSend = useCallback(() => {
    if (busy) return
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
  }, [busy, text, onSend, setText])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const canSend = text.trim().length > 0 && !busy

  return (
    <div className="border-t border-white/10 bg-[#0D1B3D] px-6 pb-6 pt-3">
      <div className="mb-3 h-px bg-white/10" />
      <div className="flex flex-row items-center gap-4">
        <div className="flex min-h-[48px] flex-1 flex-row items-end gap-1 rounded-2xl border-2 border-slate-300/80 bg-[#0D1B3D] px-2 py-3 sm:gap-2 sm:px-4">
          {speechSupported && (
            <button
              type="button"
              disabled={busy}
              aria-label={recording ? "Release to stop voice input" : "Hold to speak"}
              onPointerDown={(e) => {
                if (e.button !== 0) return
                e.preventDefault()
                e.currentTarget.setPointerCapture(e.pointerId)
                startListening()
              }}
              onPointerUp={(e) => {
                try {
                  e.currentTarget.releasePointerCapture(e.pointerId)
                } catch {
                  /* not capturing */
                }
                stopListening()
              }}
              onPointerCancel={() => stopListening()}
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-[#0D1B3D] text-slate-200 transition-colors hover:border-white/25 hover:text-white disabled:opacity-40 motion-reduce:transition-none"
            >
              {recording ? (
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span
                    className="absolute inline-flex h-7 w-7 rounded-full bg-red-500/35 motion-safe:animate-ping"
                    aria-hidden
                  />
                  <Mic
                    className="relative z-[1] text-red-500 motion-safe:animate-pulse"
                    size={20}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              ) : (
                <Mic size={20} strokeWidth={2} aria-hidden />
              )}
            </button>
          )}
          <textarea
            className="min-h-[24px] flex-1 resize-none bg-transparent text-sm font-bold text-white placeholder-slate-400 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            maxLength={2000}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="rounded-[14px] border-2 border-slate-300/80 bg-[#0D1B3D] px-6 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  )
})
