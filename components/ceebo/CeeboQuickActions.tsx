"use client"

import React from "react"

export const QUICK_ACTIONS = [
  {
    id: "navigate",
    label: "Navigate Help",
    prompt: "Where do I find navigation and go to different pages?",
  },
  {
    id: "explain",
    label: "Explain This Page",
    prompt: "Explain what this page does and how to use it.",
  },
  {
    id: "translate",
    label: "Translate Text",
    prompt: "Translate: ",
  },
  {
    id: "scheduling",
    label: "Scheduling Help",
    prompt: "How do I schedule a worker?",
  },
] as const

export interface CeeboQuickActionsProps {
  onSelect: (prompt: string) => void
}

export const CeeboQuickActions = React.memo(function CeeboQuickActions({
  onSelect,
}: CeeboQuickActionsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          className="rounded-[14px] border-2 border-slate-300/80 bg-[#0D1B3D] px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.03]"
          onClick={() => onSelect(action.prompt)}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
})
