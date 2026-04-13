/**
 * Landing-page CEEBO sales brain — category IDs for routing + analytics hooks later.
 */

export type SalesCategory =
  | "PRICING"
  | "FEATURES"
  | "TIME_TRACKING_PAYROLL"
  | "SCHEDULING_CREW"
  | "EXTERNAL_WORKFORCE"
  | "TRAINING_SAFETY"
  | "WHO_IS_THIS_FOR"
  | "IMPLEMENTATION"
  | "OBJECTIONS_PRICE"
  | "OBJECTIONS_ADOPTION"
  | "OBJECTIONS_ALREADY_USING_SOMETHING"
  | "OBJECTIONS_TOO_SMALL"
  | "OBJECTIONS_TOO_BUSY"
  | "OBJECTIONS_OTHER"
  | "DIFFERENTIATION"
  | "SECURITY_TRUST"
  | "GENERAL_SALES_REDIRECT"

/** After size detection we tag intent for conversation stage logic. */
export type BrainIntent = SalesCategory | "COMPANY_SIZE" | null

export const OBJECTION_CATEGORIES: ReadonlySet<SalesCategory> = new Set([
  "OBJECTIONS_PRICE",
  "OBJECTIONS_ADOPTION",
  "OBJECTIONS_ALREADY_USING_SOMETHING",
  "OBJECTIONS_TOO_SMALL",
  "OBJECTIONS_TOO_BUSY",
  "OBJECTIONS_OTHER",
])

export type BrainReply = {
  response: string
  intent: BrainIntent
  detectedSize: number | null
  shouldAppendRoadmap: boolean
}
