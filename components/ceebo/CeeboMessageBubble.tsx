"use client"

import React from "react"
import { CeeboAvatar } from "./CeeboAvatar"

export type MessageRole = "ceebo" | "user"

export interface CeeboMessageBubbleProps {
  role: MessageRole
  content: string
  showAvatar?: boolean
  timestamp?: string
}

export const CeeboMessageBubble = React.memo(function CeeboMessageBubble({
  role,
  content,
  showAvatar = role === "ceebo",
  timestamp,
}: CeeboMessageBubbleProps) {
  const isCeebo = role === "ceebo"

  return (
    <div
      className={`mb-4 flex items-end ${
        isCeebo ? "justify-start" : "justify-end"
      }`}
    >
      {isCeebo && showAvatar && (
        <div className="mb-0.5 mr-2">
          <CeeboAvatar size={24} />
        </div>
      )}
      <div className="max-w-[85%]">
        <div
          className={`rounded-[10px] px-3 py-2 ${
            isCeebo
              ? "bg-[rgba(22,37,92,0.9)] shadow-[0_0_6px_rgba(210,180,140,0.08)]"
              : "bg-[#0D1B3D]"
          }`}
        >
          <p className="text-sm font-bold leading-5 text-slate-200">{content}</p>
        </div>
        {timestamp && (
          <p className="mt-0.5 ml-0.5 text-xs font-bold text-slate-400">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  )
})
