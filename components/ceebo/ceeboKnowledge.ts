/**
 * Public landing CEEBO — re-exports the deterministic sales brain (no LLM).
 */

export type { BrainIntent as CeeboIntent } from "./salesBrain/types"
export { OBJECTION_CATEGORIES } from "./salesBrain/types"
export type { SalesCategory } from "./salesBrain/types"

export type {
  CeeboSessionState,
  UserTypeGuess,
  BrainReplyWithSession,
} from "./salesBrain/sessionTypes"
export { DEFAULT_CEEBO_SESSION } from "./salesBrain/sessionTypes"

export {
  buildBrainReply as buildSalesResponse,
  LOOP_GUARD_RESPONSE,
  DRIFT_REDIRECT,
  CTA_ESCALATION_SUFFIX,
} from "./salesBrain/engine"

export {
  ROADMAP_SIGNAL,
  EARLY_ADOPTER_FRAME,
  calculateMonthlyCost,
  extractCompanySize,
} from "./salesBrain/pricingMath"

export { TOP50_QA, TOP50_QUESTION_COUNT } from "./salesBrain/top50Bank"

export { VIDEO_LIBRARY } from "./salesBrain/videoPrompts"
export { detectChatLanguage } from "./salesBrain/languageDetect"
