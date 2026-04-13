"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { CeeboWelcome } from "./CeeboWelcome"
import { CeeboMessageList } from "./CeeboMessageList"
import { CeeboInput } from "./CeeboInput"
import {
  buildSalesResponse,
  LOOP_GUARD_RESPONSE,
  CTA_ESCALATION_SUFFIX,
  OBJECTION_CATEGORIES,
} from "./ceeboKnowledge"
import type { CeeboIntent } from "./ceeboKnowledge"
import type { SalesCategory } from "./ceeboKnowledge"
import { DEFAULT_CEEBO_SESSION } from "./ceeboKnowledge"
import type { CeeboSessionState } from "./ceeboKnowledge"
import type { ChatMessage } from "./CeeboMessageList"

type ConversationStage =
  | "INTRO"
  | "QUALIFY_SIZE"
  | "EXPLAIN_VALUE"
  | "HANDLE_OBJECTION"
  | "CTA"

function isObjectionIntent(intent: CeeboIntent): boolean {
  return intent !== null && OBJECTION_CATEGORIES.has(intent as SalesCategory)
}

function mergeSession(
  prev: CeeboSessionState,
  patch: Partial<CeeboSessionState>
): CeeboSessionState {
  return {
    ...prev,
    ...patch,
    objectionFlags: patch.objectionFlags ?? prev.objectionFlags,
    askedPricing: patch.askedPricing ?? prev.askedPricing,
    userType: patch.userType ?? prev.userType,
    lastCategory:
      patch.lastCategory !== undefined ? patch.lastCategory : prev.lastCategory,
    lastCTA: patch.lastCTA !== undefined ? patch.lastCTA : prev.lastCTA,
    lastReplyHadQuestion:
      patch.lastReplyHadQuestion ?? prev.lastReplyHadQuestion,
    chatLanguage: patch.chatLanguage ?? prev.chatLanguage,
    spanishHintShown: patch.spanishHintShown ?? prev.spanishHintShown,
  }
}

export function CeeboChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [conversationStage, setConversationStage] =
    useState<ConversationStage>("INTRO")
  const [companySize, setCompanySize] = useState<number | null>(null)
  const [roadmapShown, setRoadmapShown] = useState(false)
  const [exchangeCount, setExchangeCount] = useState(0)
  const [ctaEscalationShown, setCtaEscalationShown] = useState(false)
  const [session, setSession] = useState<CeeboSessionState>(DEFAULT_CEEBO_SESSION)
  const [ceeboThinking, setCeeboThinking] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const replyInFlightRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(
    () => () => {
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current)
      replyInFlightRef.current = false
    },
    []
  )

  const thinkingMs = reducedMotion ? 0 : 400

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || replyInFlightRef.current) return

      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current)
        thinkingTimerRef.current = null
      }

      replyInFlightRef.current = true

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])

      let response: string
      let intent: CeeboIntent
      let detectedSize: number | null
      let shouldAppendRoadmap = false
      let sessionPatch: Partial<CeeboSessionState> = {}
      let loopGuardSessionUpdate = false

      const loopGuardActive =
        exchangeCount >= 6 &&
        companySize === null &&
        conversationStage !== "CTA"

      if (loopGuardActive) {
        response = LOOP_GUARD_RESPONSE
        intent = null
        detectedSize = null
        loopGuardSessionUpdate = true
      } else {
        const result = buildSalesResponse(
          trimmed,
          conversationStage,
          companySize,
          roadmapShown,
          exchangeCount,
          session
        )
        response = result.response
        intent = result.intent
        detectedSize = result.detectedSize
        shouldAppendRoadmap = result.shouldAppendRoadmap
        sessionPatch = result.sessionPatch
      }

      const ctaEscalationActive =
        exchangeCount >= 8 &&
        !ctaEscalationShown &&
        sessionPatch.lastCTA !== "hard_close"

      if (ctaEscalationActive) {
        response = `${response}${CTA_ESCALATION_SUFFIX}`
      }

      if (thinkingMs > 0) setCeeboThinking(true)

      const flushReply = () => {
        if (loopGuardSessionUpdate) {
          setSession((prev) => mergeSession(prev, { lastReplyHadQuestion: false }))
        }

        if (shouldAppendRoadmap) {
          setRoadmapShown(true)
        }

        if (detectedSize !== null) {
          setCompanySize(detectedSize)
          setConversationStage("EXPLAIN_VALUE")
        } else if (intent === "PRICING") {
          setConversationStage("QUALIFY_SIZE")
        } else if (isObjectionIntent(intent)) {
          setConversationStage("HANDLE_OBJECTION")
        } else if (intent !== null) {
          setConversationStage("CTA")
        }

        if (ctaEscalationActive) {
          setCtaEscalationShown(true)
        }

        const ceeboMsg: ChatMessage = {
          id: `ceebo-${Date.now()}`,
          role: "ceebo",
          content: response,
          timestamp: Date.now(),
          staggerReveal: true,
        }
        setMessages((prev) => [...prev, ceeboMsg])
        setExchangeCount((c) => c + 1)
        if (Object.keys(sessionPatch).length > 0) {
          setSession((prev) => mergeSession(prev, sessionPatch))
        }

        replyInFlightRef.current = false
        setCeeboThinking(false)
      }

      if (thinkingMs === 0) {
        flushReply()
      } else {
        thinkingTimerRef.current = setTimeout(() => {
          thinkingTimerRef.current = null
          flushReply()
        }, thinkingMs)
      }
    },
    [
      conversationStage,
      companySize,
      roadmapShown,
      exchangeCount,
      ctaEscalationShown,
      session,
      thinkingMs,
    ]
  )

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
        <CeeboMessageList
          messages={messages}
          showThinking={ceeboThinking}
          reduceMotion={reducedMotion}
        />
      )}
      <CeeboInput
        onSend={handleSend}
        value={inputValue}
        onChangeText={setInputValue}
        busy={ceeboThinking}
      />
    </div>
  )
}
