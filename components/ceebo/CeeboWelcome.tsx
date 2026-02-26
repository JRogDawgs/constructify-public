"use client"

import React from "react"
import { CeeboAvatar } from "./CeeboAvatar"
import { CeeboQuickActions } from "./CeeboQuickActions"

const GREETING_TEXT = "Hi, I'm Ceebo. How can I help you learn about Constructify?"
const CAPABILITY_TEXT =
  "I can help you navigate pages, explain features, answer project questions, and translate languages."

const EXAMPLE_PROMPTS = [
  "How do I schedule a worker?",
  "Where do I edit company settings?",
  "Why can't this employee clock in?",
  "Translate this message to Spanish.",
  "Explain this dashboard.",
]

export interface CeeboWelcomeProps {
  onQuickAction: (prompt: string) => void
}

export const CeeboWelcome = React.memo(function CeeboWelcome({
  onQuickAction,
}: CeeboWelcomeProps) {
  return (
    <div className="flex flex-col items-center px-6 py-6">
      <div className="mb-4 flex flex-col items-center">
        <CeeboAvatar size={48} />
        <div className="mt-4 flex flex-col items-center">
          <p className="text-center text-lg font-bold text-[#D2B48C]">
            {GREETING_TEXT}
          </p>
        </div>
      </div>

      <p className="mb-6 text-center text-sm font-bold leading-5 text-white">
        {CAPABILITY_TEXT}
      </p>

      <div className="my-4 h-px w-full self-stretch bg-white/10" />
      <div className="mb-0 flex w-full flex-col items-center">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-[#D2B48C]">
          What you can ask
        </p>
        <div className="flex max-w-[340px] flex-col self-center">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <div key={i} className="mb-1 flex flex-row items-start gap-1.5">
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="flex-1 text-xs font-bold leading-[18px] text-slate-200">
                &quot;{prompt}&quot;
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="my-4 h-px w-full self-stretch bg-white/10" />
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-[#D2B48C]">
        Quick actions
      </p>
      <CeeboQuickActions onSelect={onQuickAction} />
    </div>
  )
})
