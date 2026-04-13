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

/** Hard cap on rambling; keeps closes/URLs intact when possible. */
export function capSentences(text: string, mode: AnswerMode): string {
  const max = MODE_MAX[mode]
  const parts = text.split(SENT_SPLIT).map((s) => s.trim()).filter(Boolean)
  if (parts.length <= max) return text.trim()
  return parts.slice(0, max).join(" ").trim()
}
