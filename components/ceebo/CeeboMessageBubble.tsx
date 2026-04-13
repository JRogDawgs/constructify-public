"use client"

import React, { useEffect, useMemo, useState } from "react"
import { CeeboAvatar } from "./CeeboAvatar"
import { CeeboFormattedContent } from "./ceeboFormattedContent"
import {
  CEEBO_HOOK_PAUSE_MS,
  revealScheduleMs,
  splitRevealChunks,
} from "./ceeboRevealUtils"

export type MessageRole = "ceebo" | "user"

export interface CeeboMessageBubbleProps {
  role: MessageRole
  content: string
  showAvatar?: boolean
  timestamp?: string
  /** Staggered paragraph reveal (assistant only; respects reduced motion). */
  staggerReveal?: boolean
  reduceMotion?: boolean
}

export const CeeboMessageBubble = React.memo(function CeeboMessageBubble({
  role,
  content,
  showAvatar = role === "ceebo",
  timestamp,
  staggerReveal = false,
  reduceMotion = false,
}: CeeboMessageBubbleProps) {
  const isCeebo = role === "ceebo"

  const chunks = useMemo(() => splitRevealChunks(content), [content])
  const schedule = useMemo(() => revealScheduleMs(chunks.length), [chunks.length])

  const [revealed, setRevealed] = useState(() =>
    !isCeebo || !staggerReveal || reduceMotion ? content : ""
  )
  const [placeholder, setPlaceholder] = useState(
    () => Boolean(isCeebo && staggerReveal && !reduceMotion && chunks.length > 0)
  )

  useEffect(() => {
    if (!isCeebo || !staggerReveal || reduceMotion) {
      setRevealed(content)
      setPlaceholder(false)
      return
    }
    if (chunks.length === 0) {
      setRevealed(content)
      setPlaceholder(false)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    let cancelled = false

    const apply = (upTo: number) => {
      if (cancelled) return
      setPlaceholder(false)
      setRevealed(chunks.slice(0, upTo + 1).join("\n\n"))
    }

    timers.push(
      setTimeout(() => {
        apply(0)
      }, CEEBO_HOOK_PAUSE_MS)
    )

    for (let i = 1; i < chunks.length; i++) {
      const at = CEEBO_HOOK_PAUSE_MS + i * schedule.gapMs
      timers.push(
        setTimeout(() => {
          apply(i)
        }, at)
      )
    }

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [isCeebo, staggerReveal, reduceMotion, content, chunks, schedule.gapMs])

  return (
    <div
      className={`ceebo-bubble-animate mb-4 flex items-end ${
        isCeebo ? "justify-start" : "justify-end"
      }`}
    >
      {isCeebo && showAvatar && (
        <div className="mb-0.5 mr-2">
          <CeeboAvatar size={24} />
        </div>
      )}
      <div className="max-w-[85%]">
        <div
          className={`rounded-[10px] px-3 py-2 ${
            isCeebo
              ? "bg-[rgba(22,37,92,0.9)] shadow-[0_0_6px_rgba(210,180,140,0.08)]"
              : "bg-[#0D1B3D]"
          }`}
        >
          {isCeebo ? (
            placeholder ? (
              <p className="min-h-[1.25rem] text-sm font-bold text-slate-500" aria-hidden>
                …
              </p>
            ) : (
              <CeeboFormattedContent content={revealed} />
            )
          ) : (
            <p className="break-words text-sm font-bold leading-5 text-slate-200">
              {content}
            </p>
          )}
        </div>
        {timestamp && (
          <p className="mt-0.5 ml-0.5 text-xs font-bold text-slate-400">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
})
