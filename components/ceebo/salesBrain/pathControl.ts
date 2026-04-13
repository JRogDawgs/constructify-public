import { getDemoSectionHashUrl } from "@/lib/demoVideos"
import type { SalesCategory } from "./types"

/** Session + last user text for one dominant “next move” (not three equal CTAs). */
export type PathCloseContext = {
  exchangeCount: number
  companySize: number | null
  askedPricingSession: boolean
  norm: string
  matchedCategory: SalesCategory | null
}

export type PathStage = "early" | "mid" | "close"

/** Mirrors closerQualify.isVagueInput — avoid importing closerQualify (breaks cta cycle). */
function isVagueForPath(norm: string): boolean {
  const words = norm.split(/\s+/).filter(Boolean)
  if (words.length <= 5 && norm.length < 55) return true
  if (
    /\bwhat is this\b|\bwhat's this\b|\bwhat is constructify\b|\bworth it\b|\bdo i need\b|\bshould i\b/.test(
      norm
    )
  ) {
    return true
  }
  return false
}

export function classifyPathStage(ctx: PathCloseContext): PathStage {
  const vague = isVagueForPath(ctx.norm)
  const warmed =
    ctx.companySize !== null ||
    ctx.askedPricingSession ||
    ctx.exchangeCount >= 4 ||
    ctx.matchedCategory === "PRICING"

  if (warmed) return "close"
  if (vague && ctx.exchangeCount <= 2) return "early"
  if (ctx.exchangeCount <= 1) return "early"
  return "mid"
}

/** When callers have no context (tests / legacy); biases mid, demos-first. */
export function defaultPathCloseContext(): PathCloseContext {
  return {
    exchangeCount: 2,
    companySize: null,
    askedPricingSession: false,
    norm: "scheduling crews across multiple jobs payroll visibility",
    matchedCategory: null,
  }
}

function demoUrl(): string {
  return getDemoSectionHashUrl()
}

/**
 * One primary path + optional secondary — never three equal options.
 * Plain text for chat (no markdown).
 */
export function primaryPathSuffix(seed: number, ctx: PathCloseContext): string {
  const stage = classifyPathStage(ctx)
  const demos = demoUrl()

  if (stage === "early") {
    return `Next: name the loudest problem—payroll truth, scheduling/crews, stacked subs, or certs—so I stop guessing. Proof when you want it: ${demos}`
  }

  const pricingPriority =
    ctx.askedPricingSession ||
    ctx.matchedCategory === "PRICING" ||
    /\bprice\b|\bcost\b|\bhow much\b|\bquote\b/.test(ctx.norm)

  if (stage === "mid") {
    if (pricingPriority) {
      return `Your move: /pricing for straight numbers first, then ${demos} to see field flows.`
    }
    return `Your move: ${demos} first—fastest way to end confusion—then /pricing when the math matters.`
  }

  const secondary = Math.abs(seed) % 3 !== 0 ? ` If you need visuals first: ${demos}` : ""
  return `Your move: /signup on one crew and one job—that's where this becomes real.${secondary}`
}

export function hasForwardMomentum(text: string): boolean {
  const lower = text.toLowerCase()
  if (text.includes("?")) return true
  if (lower.includes("/signup")) return true
  if (lower.includes("/pricing")) return true
  if (lower.includes("/#role-demos") || lower.includes("#role-demos")) return true
  if (lower.includes("role demos")) return true
  if (/\bnext step\b|\bnext move\b|\bget started\b|\bone real job\b|\bone crew\b/.test(lower)) {
    return true
  }
  return false
}

export function ensureNoDeadEnd(text: string, seed: number, ctx: PathCloseContext): string {
  if (hasForwardMomentum(text)) return text.trim()
  return `${text.trim()}\n\n${primaryPathSuffix(seed + 17, ctx)}`.trim()
}
