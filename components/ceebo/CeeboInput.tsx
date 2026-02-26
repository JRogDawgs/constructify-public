"use client"

import React, { useCallback, useState } from "react"

const PLACEHOLDER =
  "Ask about this page, scheduling, workers, or translations…"

export interface CeeboInputProps {
  onSend: (text: string) => void
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
}

export const CeeboInput = React.memo(function CeeboInput({
  onSend,
  placeholder = PLACEHOLDER,
  value: controlledValue,
  onChangeText: onControlledChange,
}: CeeboInputProps) {
  const [internalText, setInternalText] = useState("")
  const isControlled = controlledValue !== undefined
  const text = isControlled ? controlledValue : internalText
  const setText = useCallback(
    (v: string) => {
      if (isControlled) onControlledChange?.(v)
      else setInternalText(v)
    },
    [isControlled, onControlledChange]
  )

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText("")
  }, [text, onSend, setText])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const canSend = text.trim().length > 0

  return (
    <div className="border-t border-white/10 bg-[#0D1B3D] px-6 pb-6 pt-3">
      <div className="mb-3 h-px bg-white/10" />
      <div className="flex flex-row items-center gap-4">
        <div className="flex min-h-[48px] flex-1 flex-row items-end rounded-2xl border-2 border-slate-300/80 bg-[#0D1B3D] px-4 py-3">
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
