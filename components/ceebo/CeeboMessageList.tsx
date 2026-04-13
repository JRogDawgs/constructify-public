"use client"

import React, { useEffect, useRef } from "react"
import { CeeboMessageBubble } from "./CeeboMessageBubble"
import { CeeboThinkingIndicator } from "./CeeboThinkingIndicator"

export interface ChatMessage {
  id: string
  role: "ceebo" | "user"
  content: string
  timestamp?: number
  /** Assistant message: reveal paragraphs progressively. */
  staggerReveal?: boolean
}

export interface CeeboMessageListProps {
  messages: ChatMessage[]
  showThinking?: boolean
  reduceMotion?: boolean
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })
}

export const CeeboMessageList = React.memo(function CeeboMessageList({
  messages,
  showThinking = false,
  reduceMotion = false,
}: CeeboMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, showThinking])

  return (
    <div
      ref={scrollRef}
      className="ceebo-scroll-area flex-1 overflow-y-auto px-3.5 py-2.5 pb-2"
    >
      {messages.map((msg) => (
        <CeeboMessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          showAvatar={msg.role === "ceebo"}
          staggerReveal={msg.role === "ceebo" && Boolean(msg.staggerReveal)}
          reduceMotion={reduceMotion}
          timestamp={
            msg.timestamp
              ? formatTime(new Date(msg.timestamp))
              : undefined
          }
        />
      ))}
      {showThinking && <CeeboThinkingIndicator />}
    </div>
  )
})
