import type { UserTypeGuess } from "./sessionTypes"
import type { SalesCategory } from "./types"

export type LeadCategory = SalesCategory | "COMPANY_SIZE" | "GENERAL_SALES_REDIRECT"

const GC_SIGNALS = [
  "my crews",
  "our crews",
  "multiple crews",
  "ten crews",
  "10 crews",
  "subs",
  "subcontractors",
  "vendors",
  "gc ",
  "general contractor",
  "multi site",
  "multi-site",
  "sites we run",
  "supers",
  "superintendents",
  "project managers",
  "roll all trades",
]

const SUB_SIGNALS = [
  "subcontractor",
  "we do electrical",
  "we do plumbing",
  "hvac",
  "mechanical",
  "trade contractor",
  "under the gc",
  "working for the gc",
  "gc schedules",
  "our crews work for",
  "sub to",
]

const OWNER_SIGNALS = [
  "my guys",
  "my shop",
  "small shop",
  "mom and pop",
  "i own",
  "we are small",
  "family business",
  "couple guys",
  "few guys",
  "i run the",
  "owner",
  "eight guys",
  "8 guys",
  "12 guys",
  "a dozen",
]

/**
 * Sticky upgrade: stronger signals override unknown; rarely downgrade.
 */
export function refineUserType(
  normalizedUserText: string,
  prev: UserTypeGuess
): UserTypeGuess {
  const t = normalizedUserText
  const score = (phrases: string[]) =>
    phrases.reduce((n, p) => (t.includes(p) ? n + 1 : n), 0)

  const gc = score(GC_SIGNALS)
  const sub = score(SUB_SIGNALS)
  const own = score(OWNER_SIGNALS)

  if (gc >= 2 || (gc >= 1 && sub >= 1)) return "gc_admin"
  if (gc >= 1 && own === 0) return "gc_admin"
  if (sub >= 1 && gc === 0) return "subcontractor"
  if (own >= 1) return "small_owner"
  if (gc >= 1) return "gc_admin"

  if (prev !== "unknown") return prev
  return "unknown"
}

/** One-line lead-in — not every response; caller gates frequency. */
export function userTypeLeadIn(userType: UserTypeGuess, category: LeadCategory): string | null {
  if (userType === "unknown") return null
  if (category === "COMPANY_SIZE") {
    if (userType === "small_owner") return "When you're sizing this off a real crew count—"
    return null
  }
  if (userType === "gc_admin") {
    if (
      category === "EXTERNAL_WORKFORCE" ||
      category === "SCHEDULING_CREW" ||
      category === "FEATURES"
    ) {
      return "Multi-crew and stacked subs is where the story falls apart without a system—"
    }
    return "When you're running real volume across jobs—"
  }
  if (userType === "subcontractor") {
    return "Under GCs you still need receipts for your own hours and crews—"
  }
  if (userType === "small_owner") {
    return "Small crews feel every payroll leak—"
  }
  return null
}
