"use client"

import React from "react"

const BULLET_PREFIX = /^[•\u2022]\s*/

/** Section lead icons (CEEBO sales rhythm) — keep in sync with copy in salesBrain. */
const ICON_LINE = /^[💥⚡📊🧠🚀]\s*[^\n]+/

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function renderBlock(block: string, blockIndex: number): React.ReactNode {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean)
  const bulletIdx = lines.findIndex((l) => BULLET_PREFIX.test(l))

  if (bulletIdx === -1) {
    return (
      <div key={blockIndex} className="space-y-1.5">
        {lines.map((line, i) => (
          <p
            key={i}
            className={blockIndex === 0 && i === 0 ? "font-semibold text-slate-50" : ""}
          >
            {line}
          </p>
        ))}
      </div>
    )
  }

  const head = lines.slice(0, bulletIdx)
  const bullets = lines.slice(bulletIdx).filter((l) => BULLET_PREFIX.test(l))

  return (
    <div key={blockIndex} className="space-y-2">
      {head.map((line, i) => (
        <p
          key={`h-${i}`}
          className={blockIndex === 0 && i === 0 ? "font-semibold text-slate-50" : ""}
        >
          {line}
        </p>
      ))}
      <ul className="list-none space-y-1 pl-0.5">
        {bullets.map((line, i) => (
          <li key={i} className="flex gap-2 break-words">
            <span className="shrink-0 text-amber-200/90" aria-hidden>
              •
            </span>
            <span>{line.replace(BULLET_PREFIX, "").trim()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Scannable CEEBO body: paragraphs, optional • bullets, preserved line breaks.
 * Plain text only — no HTML from user input (content is assistant-generated).
 */
export const CeeboFormattedContent = React.memo(function CeeboFormattedContent({
  content,
}: {
  content: string
}) {
  const trimmed = content.trim()
  if (!trimmed.includes("\n")) {
    return (
      <p
        className={`break-words text-sm leading-relaxed ${
          ICON_LINE.test(trimmed)
            ? "font-semibold text-slate-50"
            : "font-normal text-slate-200"
        }`}
      >
        {trimmed}
      </p>
    )
  }

  const paragraphs = splitParagraphs(trimmed)
  if (paragraphs.length === 1) {
    return (
      <div className="space-y-2 break-words text-sm font-normal leading-relaxed text-slate-200">
        {renderBlock(paragraphs[0]!, 0)}
      </div>
    )
  }

  return (
    <div className="space-y-2.5 break-words text-sm font-normal leading-relaxed text-slate-200">
      {paragraphs.map((p, i) => renderBlock(p, i))}
    </div>
  )
})
