import type { AnswerMode } from "./answerDiscipline"
import type { SalesCategory } from "./types"

/** Calm “cost of waiting” — no fake scarcity, no trials. */
const BY_CAT: Partial<Record<SalesCategory, string>> = {
  TIME_TRACKING_PAYROLL:
    "Every week you wait is another week you're paying off memory instead of proof.",
  SCHEDULING_CREW:
    "Chaos doesn't pause because you're busy—double-books and wrong gates still cost money tonight.",
  EXTERNAL_WORKFORCE:
    "Stacked subs is exactly when visibility rots fastest; letting it ride is expensive.",
  PRICING:
    "Price is a line item—payroll mistakes and OT fights are the real invoice.",
  FEATURES:
    "If the field is messy today, tomorrow's margin is already spoken for.",
  OBJECTIONS_PRICE:
    "Waiting doesn't make payroll cleaner—it just hides the leak longer.",
  OBJECTIONS_TOO_BUSY:
    "Busy teams lose the most when nobody owns the truth—stalling keeps that pattern alive.",
}

export function urgencyLine(
  category: SalesCategory | null,
  mode: AnswerMode
): string | null {
  if (mode === "TRUST_BUILDING" || mode === "SHORT_PUNCHY") return null
  if (!category) return null
  return BY_CAT[category] ?? null
}
