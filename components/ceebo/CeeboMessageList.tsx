"use client"

import React, { useEffect, useRef } from "react"
import { CeeboMessageBubble } from "./CeeboMessageBubble"

export interface ChatMessage {
  id: string
  role: "ceebo" | "user"
  content: string
  timestamp?: number
}

export interface CeeboMessageListProps {
  messages: ChatMessage[]
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  })
}

export const CeeboMessageList = React.memo(function CeeboMessageList({
  messages,
}: CeeboMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3.5 py-2.5 pb-2"
    >
      {messages.map((msg) => (
        <CeeboMessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          showAvatar={msg.role === "ceebo"}
          timestamp={
            msg.timestamp
              ? formatTime(new Date(msg.timestamp))
              : undefined
          }
        />
      ))}
    </div>
  )
})
