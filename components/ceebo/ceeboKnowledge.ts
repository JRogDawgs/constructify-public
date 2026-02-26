/**
 * CEEBO — Sales conversational engine
 * Intent classification + deterministic responses. No AI model.
 */

export type CeeboIntent =
  | "PRICING"
  | "FEATURES"
  | "SCHEDULING"
  | "TIME_TRACKING"
  | "TRAINING"
  | "OBJECTION_COST"
  | "OBJECTION_COMPLEXITY"
  | "OBJECTION_GENERAL"
  | "COMPANY_SIZE"
  | "GENERAL"

export interface KnowledgeEntry {
  intent: CeeboIntent
  keywords: string[]
  response: string
}

/** Roadmap block — shown once when escalating to value explanation. Exported for CeeboChat. */
export const ROADMAP_SIGNAL =
  "Constructify today represents the first structured layer of a broader platform architecture designed to expand as construction operations become more connected and data-driven."

export const EARLY_ADOPTER_FRAME =
  "Companies that implement structured systems early tend to compound efficiency gains over time."

export const ceeboKnowledge: KnowledgeEntry[] = [
  {
    intent: "OBJECTION_COST",
    keywords: ["expensive", "cost too much", "too expensive", "can't afford", "overpriced", "budget"],
    response:
      "I hear you on cost—and here's the flip side: most construction teams lose $2,000–$8,000 per month on manual paperwork, missed certifications, and scheduling chaos. Constructify often pays for itself in the first month. How many team members would be using it? I'll show you the exact numbers.",
  },
  {
    intent: "OBJECTION_COMPLEXITY",
    keywords: ["complicated", "complex", "confusing", "hard to use", "difficult", "steep learning"],
    response:
      "Constructify is built for construction teams—not engineers. Setup takes about 15 minutes, and most crews are productive the same day. We also offer 24/7 support. The next step is simple — we can walk you through it live or show you the numbers for your team size. Which works better for you?",
  },
  {
    intent: "OBJECTION_GENERAL",
    keywords: ["not sure", "do we need this", "maybe later", "thinking about it", "on the fence"],
    response:
      "Understood. The companies that move fastest are usually the ones bleeding the most on inefficiency. A rough sense helps—how many people would use Constructify? I can show you what it looks like and you can decide from there.",
  },
  {
    intent: "PRICING",
    keywords: ["price", "cost", "how much", "pricing", "pay", "subscription"],
    response:
      "Great question. How many team members would be using Constructify? Once I know your size, I can give you a concrete monthly number.",
  },
  {
    intent: "SCHEDULING",
    keywords: ["schedule", "scheduling", "shifts", "roster"],
    response:
      "Constructify includes advanced scheduling with role-based assignments, shift planning, and real-time availability. You can assign workers to projects, track hours, and manage last-minute changes from desktop or mobile. The next step is simple — we can get you started or walk you through it live. Which works better for you?",
  },
  {
    intent: "TIME_TRACKING",
    keywords: ["time tracking", "time track", "clock in", "clock out", "timesheet", "hours worked"],
    response:
      "Our time tracking lets workers clock in and out from their mobile device or kiosk. Managers can approve timesheets, track overtime, and integrate with payroll. All data syncs in real time. The next step is simple — we can get you started or walk you through it live. Which works better for you?",
  },
  {
    intent: "TRAINING",
    keywords: ["training", "training hub", "certification", "courses", "learn"],
    response:
      "The Training Hub helps you manage certifications, OSHA training, and skill development. Track completion dates, send renewal alerts, and ensure your workforce stays compliant. The next step is simple — we can get you started or walk you through it live. Which works better for you?",
  },
  {
    intent: "FEATURES",
    keywords: ["notification", "notifications", "workforce", "workers", "employees", "team", "staff", "crew", "feature", "features", "what can", "capabilities", "does it do", "include"],
    response:
      "Constructify includes project management, scheduling, time tracking, safety compliance (OSHA), Training Hub, employee profiles, payroll integration, mobile apps, and reporting. All plans include cloud storage, real-time sync, and 24/7 support. The next step is simple — we can get you started or walk you through it live. Which works better for you?",
  },
  {
    intent: "GENERAL",
    keywords: ["overview", "what is", "introduction", "tell me about", "explain constructify", "safety", "compliance", "osha", "project", "projects", "job", "job site", "mobile", "app", "phone", "integration", "integrate", "quickbooks", "payroll"],
    response:
      "Constructify is a construction management platform built for contractors and project teams. We combine project management, workforce management, safety compliance, and time tracking in one place so you can run jobs, track people, and stay compliant—all from a single system. The next step is simple — we can get you started or walk you through it live. Which works better for you?",
  },
]

const DEFAULT_RESPONSE =
  "Tell me a bit about your team size and I'll show you what Constructify looks like for your company."

/** When no intent match and stage !== CTA — redirect to value discussion. */
export const DRIFT_REDIRECT =
  "I want to make this practical for you. If you share your team size, I can outline exactly what Constructify would look like operationally and financially."

/** Loop guard — when exchangeCount >= 6 and no companySize and stage !== CTA. */
export const LOOP_GUARD_RESPONSE =
  "To make this useful, it helps to anchor this to your team size. Roughly how many people would be using Constructify?"

/** CTA escalation — when exchangeCount >= 8, append once. */
export const CTA_ESCALATION_SUFFIX =
  " At this point, the fastest way forward is a live walkthrough. We can align it directly to your operations. Would you prefer that, or to get started immediately?"

/** Annual license tiers: 1–25, 26–100, 101+ */
const LICENSE_TIERS = [
  { min: 1, max: 25, annual: 1500 },
  { min: 26, max: 100, annual: 5000 },
  { min: 101, max: Infinity, annual: 9999 },
] as const

const PER_USER_MONTHLY = 19.99

/**
 * Get annual license for user count.
 */
function getAnnualLicense(users: number): number {
  for (const tier of LICENSE_TIERS) {
    if (users >= tier.min && users <= tier.max) return tier.annual
  }
  return LICENSE_TIERS[2].annual
}

/**
 * Calculate approximate monthly cost.
 */
export function calculateMonthlyCost(users: number): number {
  const licenseAnnual = getAnnualLicense(users)
  const licenseMonthly = licenseAnnual / 12
  return Math.round(users * PER_USER_MONTHLY + licenseMonthly)
}

/**
 * Extract approximate user count from free-form input.
 * Returns null if no number detected.
 */
export function extractCompanySize(input: string): number | null {
  const lower = input.trim().toLowerCase()
  const numMatch = lower.match(/\b(\d{1,4})\b/)
  if (numMatch) {
    const n = parseInt(numMatch[1], 10)
    if (n >= 1 && n <= 9999) return n
  }
  if (/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|twenty-five|thirty|fifty|hundred)\b/.test(lower)) {
    const map: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12, fifteen: 15, twenty: 20, "twenty-five": 25, thirty: 30, fifty: 50, hundred: 100,
    }
    for (const [word, num] of Object.entries(map)) {
      if (lower.includes(word)) return num
    }
  }
  return null
}

/**
 * Classify user input intent.
 */
export function classifyIntent(userInput: string): CeeboIntent | null {
  const lower = userInput.toLowerCase().trim()
  if (!lower) return null

  for (const entry of ceeboKnowledge) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.intent
    }
  }

  return null
}

/**
 * Get response for intent (no company-size logic).
 */
function getResponseForIntent(intent: CeeboIntent): string {
  const entry = ceeboKnowledge.find((e) => e.intent === intent)
  return entry?.response ?? DEFAULT_RESPONSE
}

/**
 * Match user input and return appropriate response.
 * Used when no conversation state / company size needed.
 */
export function matchResponse(userInput: string): string {
  const intent = classifyIntent(userInput)
  if (intent) return getResponseForIntent(intent)
  return DEFAULT_RESPONSE
}

/**
 * Build sales response with optional company size and cost.
 * Returns shouldAppendRoadmap when roadmap block should be appended by caller (once per conversation).
 */
export function buildSalesResponse(
  userInput: string,
  conversationStage: string,
  companySize: number | null,
  roadmapShown: boolean
): {
  response: string
  intent: CeeboIntent | null
  detectedSize: number | null
  shouldAppendRoadmap: boolean
} {
  const lower = userInput.toLowerCase().trim()
  const detectedSize = extractCompanySize(userInput)
  const intent = classifyIntent(userInput)

  const canShowRoadmap =
    !roadmapShown &&
    (conversationStage === "EXPLAIN_VALUE" ||
      (detectedSize !== null && (intent === "PRICING" || conversationStage === "QUALIFY_SIZE" || intent === null)))

  if (detectedSize !== null && (intent === "PRICING" || conversationStage === "QUALIFY_SIZE" || intent === null)) {
    const monthly = calculateMonthlyCost(detectedSize)
    const annual = getAnnualLicense(detectedSize)
    const baseResponse = `At ${detectedSize} users, your monthly cost would be approximately $${monthly.toLocaleString()}/month (that includes $${(detectedSize * PER_USER_MONTHLY).toFixed(0)} for users plus $${(annual / 12).toFixed(0)}/month for the annual platform license). Most companies your size lose far more than this in scheduling inefficiencies alone.`
    const roadmapBlock = canShowRoadmap ? ` ${ROADMAP_SIGNAL} ${EARLY_ADOPTER_FRAME}` : ""
    return {
      response: `${baseResponse}${roadmapBlock} The next step is simple — we can get you started or walk you through it live. Which works better for you?`,
      intent: intent ?? "COMPANY_SIZE",
      detectedSize,
      shouldAppendRoadmap: canShowRoadmap,
    }
  }

  if (intent) {
    const baseResponse = getResponseForIntent(intent)
    if (
      canShowRoadmap &&
      (intent === "GENERAL" || intent === "FEATURES")
    ) {
      const insertBefore = " The next step is simple"
      const idx = baseResponse.indexOf(insertBefore)
      const roadmapBlock = ` ${ROADMAP_SIGNAL} ${EARLY_ADOPTER_FRAME}.`
      const response =
        idx >= 0
          ? baseResponse.slice(0, idx) + roadmapBlock + baseResponse.slice(idx)
          : baseResponse + roadmapBlock
      return {
        response,
        intent,
        detectedSize: null,
        shouldAppendRoadmap: true,
      }
    }
    return {
      response: baseResponse,
      intent,
      detectedSize: null,
      shouldAppendRoadmap: false,
    }
  }

  return {
    response:
      conversationStage === "CTA"
        ? DEFAULT_RESPONSE
        : DRIFT_REDIRECT,
    intent: null,
    detectedSize: null,
    shouldAppendRoadmap: false,
  }
}
