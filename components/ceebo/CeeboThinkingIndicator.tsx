"use client"

import React from "react"
import { CeeboAvatar } from "./CeeboAvatar"

export const CeeboThinkingIndicator = React.memo(function CeeboThinkingIndicator() {
  return (
    <div className="ceebo-thinking-row mb-4 flex items-end justify-start">
      <div className="mb-0.5 mr-2">
        <CeeboAvatar size={24} />
      </div>
      <div className="max-w-[85%] rounded-[10px] border border-white/10 bg-[rgba(22,37,92,0.55)] px-3 py-2">
        <p className="ceebo-thinking-text text-sm font-bold leading-5 text-slate-300">
          Ceebo is thinking
          <span className="ceebo-thinking-dots" aria-hidden>
            …
          </span>
        </p>
      </div>
    </div>
  )
})
