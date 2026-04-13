"use client"

import React from "react"

export const QUICK_ACTIONS = [
  {
    id: "pricing",
    label: "Pricing / headcount",
    prompt: "How much does Constructify cost and what do I need to tell you to get a real number?",
  },
  {
    id: "time",
    label: "Time & payroll pain",
    prompt: "My guys jack their time and payroll is a fight every Friday — what actually changes with Constructify?",
  },
  {
    id: "subs",
    label: "Subs & temp labor",
    prompt: "We run subcontractors and temp labor on the same jobs — how does Constructify keep that from turning into chaos?",
  },
  {
    id: "demos",
    label: "Watch demos",
    prompt: "Where are the role demos and what should I watch first?",
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
