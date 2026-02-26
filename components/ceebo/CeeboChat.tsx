"use client"

import React, { useCallback, useState } from "react"
import { CeeboWelcome } from "./CeeboWelcome"
import { CeeboMessageList } from "./CeeboMessageList"
import { CeeboInput } from "./CeeboInput"
import { matchResponse } from "./ceeboKnowledge"
import type { ChatMessage } from "./CeeboMessageList"

export function CeeboChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])

    const response = matchResponse(trimmed)

    const ceeboMsg: ChatMessage = {
      id: `ceebo-${Date.now()}`,
      role: "ceebo",
      content: response,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, ceeboMsg])
  }, [])

  const handleQuickAction = useCallback((prompt: string) => {
    setInputValue(prompt)
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!hasMessages ? (
        <div className="flex-1 overflow-y-auto">
          <CeeboWelcome onQuickAction={handleQuickAction} />
        </div>
      ) : (
        <CeeboMessageList messages={messages} />
      )}
      <CeeboInput
        onSend={handleSend}
        value={inputValue}
        onChangeText={setInputValue}
      />
    </div>
  )
}
