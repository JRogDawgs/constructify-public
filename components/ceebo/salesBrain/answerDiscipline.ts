import type { SalesCategory } from "./types"

export type AnswerMode = "SHORT_PUNCHY" | "STANDARD_SALES" | "TRUST_BUILDING"

const SENT_SPLIT = /(?<=[.!?])\s+/

export function classifyAnswerMode(
  normalized: string,
  matchedCategory: SalesCategory | null
): AnswerMode {
  if (
    matchedCategory === "SECURITY_TRUST" ||
    /\benterprise\b|\bdivision\b|\bpermission\b|\bpermissions\b|\brole based\b|\baccess control\b|\biso\b|\baudit\b|\bdata security\b|\bwho can see\b/.test(
      normalized
    )
  ) {
    return "TRUST_BUILDING"
  }
  const words = normalized.split(/\s+/).filter(Boolean)
  if (
    words.length <= 4 ||
    normalized.length < 28 ||
    /\bhow much\b$|\blol\b|\bidk\b|\bwhatever\b|\bwhy\b.*\buse\b|\bso what\b/.test(normalized)
  ) {
    return "SHORT_PUNCHY"
  }
  if (/\bimpatient\b|\bjust tell me\b|\bquick\b|\bshort answer\b|\btldr\b/.test(normalized)) {
    return "SHORT_PUNCHY"
  }
  return "STANDARD_SALES"
}

const MODE_MAX: Record<AnswerMode, number> = {
  SHORT_PUNCHY: 4,
  STANDARD_SALES: 6,
  TRUST_BUILDING: 8,
}

function isStructuredSalesLayout(text: string): boolean {
  if (/[💥⚡📊🧠🚀]/u.test(text)) return true
  if (/\n\s*•\s/.test(text) || /\n\s*[\u2022]\s/.test(text)) return true
  if (/\n{2,}/.test(text)) return true
  return false
}

/** Hard cap on rambling; preserves line breaks for structured CEEBO layouts. */
export function capSentences(text: string, mode: AnswerMode): string {
  const max = MODE_MAX[mode]
  if (isStructuredSalesLayout(text)) {
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean)
    const lineMax = mode === "SHORT_PUNCHY" ? 12 : mode === "STANDARD_SALES" ? 18 : 22
    if (lines.length <= lineMax) return text.trim()
    return lines.slice(0, lineMax).join("\n").trim()
  }
  const parts = text.split(SENT_SPLIT).map((s) => s.trim()).filter(Boolean)
  if (parts.length <= max) return text.trim()
  return parts.slice(0, max).join(" ").trim()
}
