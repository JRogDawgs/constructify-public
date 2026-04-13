import { CTA_SIGNUP } from "./cta"
import type { SalesCategory } from "./types"
import type { CeeboSessionState, UserTypeGuess } from "./sessionTypes"
import { OBJECTION_CATEGORIES } from "./types"

const CLOSE_LINES = [
  `At this point the clean move is get you set up and run it on one real job—that's where it clicks. ${CTA_SIGNUP}`,
  `You'll know fast once it's on a live job with your supers—not from more back-and-forth here. ${CTA_SIGNUP} Role demos: /#role-demos`,
  `Best next step: set up your company in Constructify and point one crew at it—tight scope, real proof. ${CTA_SIGNUP}`,
] as const

function pickClose(seed: number): string {
  return CLOSE_LINES[Math.abs(seed) % CLOSE_LINES.length]
}

export function shouldHardClose(args: {
  session: CeeboSessionState
  matchedCategory: SalesCategory | null
  intentIsCompanySize: boolean
  exchangeCount: number
  askedPricingThisTurn: boolean
}): boolean {
  const { session, matchedCategory, intentIsCompanySize, exchangeCount, askedPricingThisTurn } =
    args

  const objectionThisTurn =
    matchedCategory !== null && OBJECTION_CATEGORIES.has(matchedCategory)
  if (objectionThisTurn || session.objectionFlags.length >= 1) return true
  if (askedPricingThisTurn || session.askedPricing) return true
  if (intentIsCompanySize) return true
  if (exchangeCount >= 5) return true
  if (
    session.userType === "gc_admin" &&
    matchedCategory &&
    (matchedCategory === "EXTERNAL_WORKFORCE" ||
      matchedCategory === "SCHEDULING_CREW") &&
    exchangeCount >= 3
  ) {
    return true
  }
  return false
}

/** At most ONE question; skip if last reply already asked, or we already have headcount. */
export function pickQualifyingQuestion(args: {
  session: CeeboSessionState
  matchedCategory: SalesCategory | null
  companySize: number | null
  exchangeCount: number
  seed: number
}): string | null {
  const { session, matchedCategory, companySize, exchangeCount, seed } = args

  if (session.lastReplyHadQuestion) return null
  if (exchangeCount < 1) return null
  if (exchangeCount % 3 !== 1) return null

  if (companySize !== null && matchedCategory !== "EXTERNAL_WORKFORCE") return null

  if (matchedCategory === "EXTERNAL_WORKFORCE") {
    return "Is the bigger headache subs you don't directly pay, or your own crew's clock-ins?"
  }
  if (matchedCategory === "TIME_TRACKING_PAYROLL" || matchedCategory === "PRICING") {
    return "Roughly how many people would actually clock in on a nasty busy week—even a guess helps."
  }
  if (matchedCategory === "SCHEDULING_CREW") {
    return "Are you mostly fighting your own crew schedule, or a zoo of subs on the same job?"
  }
  if (matchedCategory === null || matchedCategory === "GENERAL_SALES_REDIRECT") {
    return "What's eating the most time right now—payroll truth, scheduling, or knowing who's where?"
  }
  if (matchedCategory && OBJECTION_CATEGORIES.has(matchedCategory)) {
    return "Ballpark how many field people would touch clock-in if you rolled this out tomorrow?"
  }
  if (Math.abs(seed) % 5 === 0) {
    return "You running mostly your own W2s, or a mix with subs and temps?"
  }
  return null
}

export function appendCloseIfNeeded(
  response: string,
  args: {
    session: CeeboSessionState
    matchedCategory: SalesCategory | null
    intentIsCompanySize: boolean
    exchangeCount: number
    askedPricingThisTurn: boolean
    seed: number
  }
): { text: string; usedClose: boolean; lastCTA: string | null } {
  if (!shouldHardClose(args)) {
    return { text: response, usedClose: false, lastCTA: null }
  }
  if (args.session.lastCTA === "hard_close" && args.exchangeCount < 4) {
    return { text: response, usedClose: false, lastCTA: null }
  }
  const block = `\n\n${pickClose(args.seed)}`
  return { text: response + block, usedClose: true, lastCTA: "hard_close" }
}

/** Vague one-liner inputs → steer before CTAs. */
export function isVagueInput(normalized: string): boolean {
  const words = normalized.split(/\s+/).filter(Boolean)
  if (words.length <= 5 && normalized.length < 55) return true
  if (
    /\bwhat is this\b|\bwhat's this\b|\bwhat is constructify\b|\bworth it\b|\bdo i need\b|\bshould i\b/.test(
      normalized
    )
  ) {
    return true
  }
  return false
}

export function steerVagueSuffix(userType: UserTypeGuess): string {
  if (userType === "gc_admin") {
    return ` Are you mainly trying to tighten oversight across crews and subs, or fix payroll time truth first?`
  }
  if (userType === "subcontractor") {
    return ` Are you trying to prove hours and crews to GCs, or clean up your own payroll chaos?`
  }
  if (userType === "small_owner") {
    return ` Are you trying to stop payroll leaks, get scheduling under control, or both?`
  }
  return ` Are you trying to fix payroll time truth, scheduling, or just get clearer visibility across jobs?`
}
