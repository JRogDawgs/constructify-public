"use client"

import React, { useCallback, useState } from "react"
import { CeeboWelcome } from "./CeeboWelcome"
import { CeeboMessageList } from "./CeeboMessageList"
import { CeeboInput } from "./CeeboInput"
import {
  buildSalesResponse,
  LOOP_GUARD_RESPONSE,
  CTA_ESCALATION_SUFFIX,
} from "./ceeboKnowledge"
import type { CeeboIntent } from "./ceeboKnowledge"
import type { ChatMessage } from "./CeeboMessageList"

type ConversationStage =
  | "INTRO"
  | "QUALIFY_SIZE"
  | "EXPLAIN_VALUE"
  | "HANDLE_OBJECTION"
  | "CTA"

export function CeeboChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [conversationStage, setConversationStage] =
    useState<ConversationStage>("INTRO")
  const [companySize, setCompanySize] = useState<number | null>(null)
  const [roadmapShown, setRoadmapShown] = useState(false)
  const [exchangeCount, setExchangeCount] = useState(0)
  const [ctaEscalationShown, setCtaEscalationShown] = useState(false)

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

    let response: string
    let intent: CeeboIntent | null
    let detectedSize: number | null
    let shouldAppendRoadmap = false

    const loopGuardActive =
      exchangeCount >= 6 &&
      companySize === null &&
      conversationStage !== "CTA"

    if (loopGuardActive) {
      response = LOOP_GUARD_RESPONSE
      intent = null
      detectedSize = null
    } else {
      const result = buildSalesResponse(
        trimmed,
        conversationStage,
        companySize,
        roadmapShown
      )
      response = result.response
      intent = result.intent
      detectedSize = result.detectedSize
      shouldAppendRoadmap = result.shouldAppendRoadmap
    }

    if (shouldAppendRoadmap) {
      setRoadmapShown(true)
    }

    if (detectedSize !== null) {
      setCompanySize(detectedSize)
      setConversationStage("EXPLAIN_VALUE")
    } else if (intent === "PRICING") {
      setConversationStage("QUALIFY_SIZE")
    } else if (
      intent === "OBJECTION_COST" ||
      intent === "OBJECTION_COMPLEXITY" ||
      intent === "OBJECTION_GENERAL"
    ) {
      setConversationStage("HANDLE_OBJECTION")
    } else if (intent !== null) {
      setConversationStage("CTA")
    }

    const ctaEscalationActive =
      exchangeCount >= 8 && !ctaEscalationShown
    if (ctaEscalationActive) {
      response = `${response}${CTA_ESCALATION_SUFFIX}`
      setCtaEscalationShown(true)
    }

    const ceeboMsg: ChatMessage = {
      id: `ceebo-${Date.now()}`,
      role: "ceebo",
      content: response,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, ceeboMsg])
    setExchangeCount((c) => c + 1)
  }, [conversationStage, companySize, roadmapShown, exchangeCount, ctaEscalationShown])

  const handleQuickAction = useCallback((prompt: string) => {
    setInputValue(prompt)
  }, [])

  const hasMessages = messages.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!hasMessages ? (
        <div className="ceebo-scroll-area flex-1 overflow-y-auto">
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
