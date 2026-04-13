"use client"

import React from "react"
import { CeeboAvatar } from "./CeeboAvatar"
import { CeeboQuickActions } from "./CeeboQuickActions"

const GREETING_TEXT =
  "I'm Ceebo — I answer straight questions about Constructify before you burn time on a call."

const CAPABILITY_TEXT =
  "Pricing, crews, clock-ins, scheduling, subs, safety certs, fit for your size — and where to go next on this site. I'm not logged-in app support and I won't navigate a product screen for you."

const EXAMPLE_PROMPTS = [
  "How much does this cost for ~30 guys in the field?",
  "My supers are drowning in last-minute crew changes — does this help?",
  "We run subs and temps on the same jobs — how do you handle that mess?",
  "My guys round hours up every week — can this tighten that up?",
  "We're on QuickBooks and spreadsheets — where does Constructify actually fit?",
  "We're small — is this overkill for a 12-person shop?",
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
          Ask it rough — I speak contractor
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
        Quick starts
      </p>
      <CeeboQuickActions onSelect={onQuickAction} />
    </div>
  )
})
