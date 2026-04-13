import { bodyForCategoryMode, replyForCategoryMode } from "./categoryResponses"
import { matchCategory } from "./categoryMatchers"
import {
  appendCloseIfNeeded,
  isVagueInput,
  pickQualifyingQuestion,
  steerVagueSuffix,
} from "./closerQualify"
import {
  EARLY_ADOPTER_FRAME,
  getAnnualLicense,
  PER_USER_MONTHLY,
  extractCompanySize,
  ROADMAP_SIGNAL,
} from "./pricingMath"
import type { CeeboSessionState } from "./sessionTypes"
import type { BrainReplyWithSession } from "./sessionTypes"
import { authorityStackLine } from "./confidenceStack"
import { CTA_PRICING_PAGE, CTA_SIGNUP, softClose } from "./cta"
import {
  classifyPathStage,
  ensureNoDeadEnd,
  type PathCloseContext,
} from "./pathControl"
import { normalizeForMatch } from "./normalize"
import { matchTop50 } from "./top50Bank"
import type { BrainIntent, SalesCategory } from "./types"
import { OBJECTION_CATEGORIES } from "./types"
import { refineUserType, userTypeLeadIn, type LeadCategory } from "./userTypeDetection"
import { classifyAnswerMode, capSentences, type AnswerMode } from "./answerDiscipline"
import { urgencyLine } from "./urgencyLayer"
import { matchPriorityIntel } from "./priorityIntel"
import { BROAD_VALUE_OVERVIEW, isBroadProductQuestion } from "./topOfFunnel"

export const LOOP_GUARD_RESPONSE =
  `I need one real number from you to stop guessing — rough field headcount using Constructify in a busy week (even 5, 20, 80). ` +
  `Then I'll tie price to your world, not generic noise. ` +
  `${CTA_PRICING_PAGE} ${CTA_SIGNUP}`

export const DRIFT_REDIRECT =
  `I can't see your jobs from here—name the fire: payroll time truth, scheduling/crews, subs/temps, or certs/safety. ` +
  `Or drop a rough crew count and I'll aim pricing.`

/** Late-chat nudge: one dominant move + optional proof. */
export const CTA_ESCALATION_SUFFIX =
  ` Your move: /signup on one crew and one job. If you still need visuals: /#role-demos`

function hashSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

function pricingAsk(norm: string, cat: SalesCategory | null): boolean {
  if (cat === "PRICING") return true
  return /\bhow much\b|\bpricing\b|\bcost\b|\bquote\b|\bprice\b|\bpay\b/.test(norm)
}

function finalizeLayer(args: {
  response: string
  intent: BrainIntent
  detectedSize: number | null
  shouldAppendRoadmap: boolean
  matchedCategory: SalesCategory | null
  norm: string
  seed: number
  session: CeeboSessionState
  exchangeCount: number
  companySize: number | null
  askedPricingThisTurn: boolean
  isLoopGuard: boolean
  isDrift: boolean
  answerMode?: AnswerMode
  skipQualify?: boolean
  skipLead?: boolean
  pathCtx: PathCloseContext
}): BrainReplyWithSession {
  const {
    norm,
    seed,
    session,
    exchangeCount,
    companySize,
    askedPricingThisTurn,
    isLoopGuard,
    isDrift,
  } = args
  let response = args.response
  const intent = args.intent
  const detectedSize = args.detectedSize
  const shouldAppendRoadmap = args.shouldAppendRoadmap

  if (isLoopGuard) {
    return {
      response,
      intent,
      detectedSize,
      shouldAppendRoadmap,
      sessionPatch: { lastReplyHadQuestion: false },
    }
  }

  const pathCtx = args.pathCtx

  const answerMode =
    args.answerMode ?? classifyAnswerMode(norm, args.matchedCategory)

  const userType = refineUserType(norm, session.userType)

  const lastCategory: LeadCategory | null =
    intent === "COMPANY_SIZE"
      ? "COMPANY_SIZE"
      : args.matchedCategory ??
        (intent === "GENERAL_SALES_REDIRECT" ? "GENERAL_SALES_REDIRECT" : null)

  const catForLead: LeadCategory = lastCategory ?? "GENERAL_SALES_REDIRECT"
  const lead = userTypeLeadIn(userType, catForLead)
  if (!args.skipLead && lead && (exchangeCount + Math.abs(seed)) % 2 === 0) {
    response = `${lead} ${response}`
  }

  if (isDrift && isVagueInput(norm) && exchangeCount >= 1) {
    response = `${response.trimEnd()}${steerVagueSuffix(userType)}`
  }

  const u = urgencyLine(args.matchedCategory, answerMode)
  if (u) {
    response = `${response.trimEnd()}\n\n${u}`
  }

  const pathStage = classifyPathStage(pathCtx)
  const auth = authorityStackLine(pathStage, answerMode, seed + exchangeCount)
  if (auth) {
    response = `${response.trimEnd()}\n\n${auth}`
  }

  const q = args.skipQualify
    ? null
    : pickQualifyingQuestion({
        session,
        matchedCategory: args.matchedCategory,
        companySize,
        exchangeCount,
        seed,
      })
  response = capSentences(response.trim(), answerMode)

  if (q) {
    response = `${response.trimEnd()}\n\n${q}`
  }

  const closeOut = appendCloseIfNeeded(response, {
    session: { ...session, userType },
    matchedCategory: args.matchedCategory,
    intentIsCompanySize: intent === "COMPANY_SIZE",
    exchangeCount,
    askedPricingThisTurn: askedPricingThisTurn || session.askedPricing,
    seed,
  })
  response = closeOut.text

  response = ensureNoDeadEnd(response, seed, pathCtx)

  let objectionFlags = session.objectionFlags
  if (args.matchedCategory && OBJECTION_CATEGORIES.has(args.matchedCategory)) {
    const id = args.matchedCategory
    if (!objectionFlags.includes(id)) {
      objectionFlags = [...objectionFlags, id]
    }
  }

  const askedPricing =
    session.askedPricing ||
    askedPricingThisTurn ||
    args.matchedCategory === "PRICING" ||
    intent === "COMPANY_SIZE"

  const lastCTA = closeOut.usedClose
    ? closeOut.lastCTA
    : q
      ? "qualify_question"
      : session.lastCTA

  return {
    response,
    intent,
    detectedSize,
    shouldAppendRoadmap,
    sessionPatch: {
      userType,
      lastCategory,
      askedPricing,
      objectionFlags,
      lastCTA,
      lastReplyHadQuestion: Boolean(q),
    },
  }
}

function pricingWithSize(
  detectedSize: number,
  roadmapShown: boolean,
  conversationStage: string,
  matchedCategory: ReturnType<typeof matchCategory>,
  seed: number,
  pathCtx: PathCloseContext
): Omit<BrainReplyWithSession, "sessionPatch"> {
  const annual = getAnnualLicense(detectedSize)
  const perUserMonthlyTotal = Math.round(detectedSize * PER_USER_MONTHLY)
  const baseResponse = `At ${detectedSize} active users, your annual platform license is $${annual.toLocaleString()}/year, and per-user fees are $${PER_USER_MONTHLY.toFixed(
    2
  )} × ${detectedSize} users — about $${perUserMonthlyTotal.toLocaleString()}/month for those seats on top of the license. That's straight from the public pricing model — not a custom quote.`

  const canShowRoadmap =
    !roadmapShown &&
    (conversationStage === "EXPLAIN_VALUE" ||
      matchedCategory === "PRICING" ||
      conversationStage === "QUALIFY_SIZE" ||
      matchedCategory === null)

  const roadmapBlock = canShowRoadmap ? ` ${ROADMAP_SIGNAL} ${EARLY_ADOPTER_FRAME}` : ""

  return {
    response: `${baseResponse}${roadmapBlock}${softClose(seed, pathCtx)}`,
    intent: "COMPANY_SIZE",
    detectedSize,
    shouldAppendRoadmap: canShowRoadmap,
  }
}

/**
 * Main entry — deterministic sales brain + closer + arbitration (no LLM).
 */
export function buildBrainReply(
  userInput: string,
  conversationStage: string,
  companySize: number | null,
  roadmapShown: boolean,
  exchangeCount: number,
  session: CeeboSessionState
): BrainReplyWithSession {
  const seed = hashSeed(userInput)
  const norm = normalizeForMatch(userInput)
  const detectedSize = extractCompanySize(userInput)
  const matchedCategory = matchCategory(norm)

  const pathCtx: PathCloseContext = {
    exchangeCount,
    companySize,
    askedPricingSession: session.askedPricing,
    norm,
    matchedCategory,
  }

  if (
    exchangeCount >= 6 &&
    companySize === null &&
    conversationStage !== "CTA"
  ) {
    return finalizeLayer({
      response: LOOP_GUARD_RESPONSE,
      intent: null,
      detectedSize: null,
      shouldAppendRoadmap: false,
      matchedCategory,
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: pricingAsk(norm, matchedCategory),
      isLoopGuard: true,
      isDrift: false,
      answerMode: "SHORT_PUNCHY",
      pathCtx,
    })
  }

  const objectionOnly =
    matchedCategory && OBJECTION_CATEGORIES.has(matchedCategory)

  const pricingNumericPath =
    detectedSize !== null &&
    !objectionOnly &&
    (matchedCategory === "PRICING" ||
      conversationStage === "QUALIFY_SIZE" ||
      matchedCategory === null)

  if (pricingNumericPath) {
    const inner = pricingWithSize(
      detectedSize!,
      roadmapShown,
      conversationStage,
      matchedCategory,
      seed,
      pathCtx
    )
    return finalizeLayer({
      ...inner,
      matchedCategory,
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: true,
      isLoopGuard: false,
      isDrift: false,
      answerMode: "STANDARD_SALES",
      pathCtx,
    })
  }

  const priority = matchPriorityIntel(norm, seed, pathCtx)
  if (priority) {
    return finalizeLayer({
      response: priority.response,
      intent: priority.intent,
      detectedSize: null,
      shouldAppendRoadmap: false,
      matchedCategory: priority.matchedCategory,
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: pricingAsk(norm, priority.matchedCategory),
      isLoopGuard: false,
      isDrift: false,
      answerMode: priority.answerMode,
      skipQualify: priority.skipQualify,
      skipLead: priority.skipLead,
      pathCtx,
    })
  }

  const top50Hit = matchTop50(norm, seed, pathCtx)
  if (top50Hit) {
    const asked = pricingAsk(norm, null)
    const mode = classifyAnswerMode(norm, null)
    return finalizeLayer({
      response: top50Hit,
      intent: "GENERAL_SALES_REDIRECT",
      detectedSize: null,
      shouldAppendRoadmap: false,
      matchedCategory: null,
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: asked,
      isLoopGuard: false,
      isDrift: false,
      answerMode: mode,
      pathCtx,
    })
  }

  if (matchedCategory) {
    const mode = classifyAnswerMode(norm, matchedCategory)
    const canShowRoadmap =
      !roadmapShown &&
      (conversationStage === "EXPLAIN_VALUE" ||
        matchedCategory === "FEATURES")

    let shouldAppendRoadmap = false
    let response: string

    if (canShowRoadmap && matchedCategory === "FEATURES") {
      shouldAppendRoadmap = true
      response =
        bodyForCategoryMode("FEATURES", mode) +
        ` ${ROADMAP_SIGNAL} ${EARLY_ADOPTER_FRAME}` +
        softClose(seed, pathCtx)
    } else {
      response = replyForCategoryMode(matchedCategory, seed, mode, true, pathCtx)
    }

    return finalizeLayer({
      response,
      intent: matchedCategory as BrainIntent,
      detectedSize: null,
      shouldAppendRoadmap,
      matchedCategory,
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: pricingAsk(norm, matchedCategory),
      isLoopGuard: false,
      isDrift: false,
      answerMode: mode,
      pathCtx,
    })
  }

  if (isBroadProductQuestion(norm)) {
    return finalizeLayer({
      response: `${BROAD_VALUE_OVERVIEW}${softClose(seed, pathCtx)}`,
      intent: "GENERAL_SALES_REDIRECT",
      detectedSize: null,
      shouldAppendRoadmap: false,
      matchedCategory: "FEATURES",
      norm,
      seed,
      session,
      exchangeCount,
      companySize,
      askedPricingThisTurn: pricingAsk(norm, "FEATURES"),
      isLoopGuard: false,
      isDrift: false,
      answerMode: "STANDARD_SALES",
      skipQualify: true,
      pathCtx,
    })
  }

  const driftMode = classifyAnswerMode(norm, null)
  return finalizeLayer({
    response: `${DRIFT_REDIRECT}${softClose(seed + 3, pathCtx)}`,
    intent: "GENERAL_SALES_REDIRECT",
    detectedSize: null,
    shouldAppendRoadmap: false,
    matchedCategory: null,
    norm,
    seed,
    session,
    exchangeCount,
    companySize,
    askedPricingThisTurn: pricingAsk(norm, null),
    isLoopGuard: false,
    isDrift: true,
    answerMode: driftMode,
    pathCtx,
  })
}
