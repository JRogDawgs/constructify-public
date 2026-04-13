import type { ChatLangHint } from "./languageDetect"
import type { BrainReply, SalesCategory } from "./types"

export type { ChatLangHint } from "./languageDetect"

/** Who we're likely talking to — rule-based guess, refined over the session. */
export type UserTypeGuess = "small_owner" | "gc_admin" | "subcontractor" | "unknown"

/** Short-term memory for one chat session (React state in CeeboChat). */
export interface CeeboSessionState {
  /** Last routed product category (or pricing-size path). */
  lastCategory: SalesCategory | "COMPANY_SIZE" | "GENERAL_SALES_REDIRECT" | null
  userType: UserTypeGuess
  askedPricing: boolean
  /** Objection category ids seen this session. */
  objectionFlags: string[]
  /** Label of last heavy CTA / close line (dedupe / analytics). */
  lastCTA: string | null
  /** So we never stack two questions in a row. */
  lastReplyHadQuestion: boolean
  /** Hint from lightweight detection — future Spanish copy; replies stay English until then. */
  chatLanguage?: ChatLangHint
  /** One-time line offering Spanish when input looks Spanish. */
  spanishHintShown?: boolean
}

export const DEFAULT_CEEBO_SESSION: CeeboSessionState = {
  lastCategory: null,
  userType: "unknown",
  askedPricing: false,
  objectionFlags: [],
  lastCTA: null,
  lastReplyHadQuestion: false,
  spanishHintShown: false,
}

export type BrainReplyWithSession = BrainReply & {
  /** Merge into React session after each assistant turn. */
  sessionPatch: Partial<CeeboSessionState>
}
