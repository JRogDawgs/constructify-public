import type { AnswerMode } from "./answerDiscipline"
import type { PathStage } from "./pathControl"

const LINES = [
  "This is built for real job sites—clock-ins and assignments your supers can trust when the week gets loud.",
  "Most margin fights here start as weak field truth, not mysterious market forces—that's the lane we're in.",
  "Teams use this as daily ops software: who's on the clock, on what job, with a trail that holds up.",
] as const

/** Grounded authority—no logos, no fake testimonials. */
export function authorityStackLine(
  stage: PathStage,
  mode: AnswerMode,
  seed: number
): string | null {
  if (stage === "early" || mode === "SHORT_PUNCHY") return null
  if (Math.abs(seed) % 5 === 0) return null
  return LINES[Math.abs(seed) % LINES.length]
}
