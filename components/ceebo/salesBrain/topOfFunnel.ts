/**
 * Broad, normal buyer questions — should never fall through to cold drift copy.
 */

export const BROAD_VALUE_OVERVIEW =
  `Constructify helps construction teams run field workforce ops in one layer: who's assigned where, clock-in/out tied to real jobs, and visibility your supers can trust—so payroll, scheduling, and site reality stop fighting each other. ` +
  `What's hitting hardest right now—time and payroll truth, scheduling and crews, or visibility across jobs and subs?`

/** True when the user is asking what the product does for them (not pricing-only, not support micro-requests). */
export function isBroadProductQuestion(norm: string): boolean {
  if (norm.length < 14) return false
  if (/\bhow much\b|\bper user\b|\bannual\b|\blicense\b/.test(norm) && norm.length < 55) {
    return false
  }

  const patterns: RegExp[] = [
    /\bhow can\b.{0,48}\bhelp\b.{0,36}\b(my|our|me|us)\b/,
    /\bhelp my (company|business|crew|team|operation)\b/,
    /\bwhat does (this|constructify|the app|your app)\b.*\bdo\b/,
    /\bwhat is (this|constructify|the app)\b.*\bfor\b/,
    /\bwhat is constructify\b/,
    /\bwhy would i use (this|constructify|it)\b/,
    /\bwhat problem\b.*\bsolv/,
    /\bhow does this help\b/,
    /\bhow does constructify help\b/,
    /\bcan (this|constructify|it)\b.{0,40}\bhelp\b/,
    /\bwhat does constructify do\b/,
    /\bwhat is this app\b/,
    /\bwhat s this app\b/, // apostrophe stripped in normalize → "what s"
    /\bvalue (prop|proposition)\b/,
    /\bbenefit\b.*\b(my|our)\b/,
    /\b(is this|can this) (worth|right)\b/,
  ]

  return patterns.some((re) => re.test(norm))
}
