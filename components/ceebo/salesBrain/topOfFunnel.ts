/**
 * Broad, normal buyer questions — should never fall through to cold drift copy.
 */

export const BROAD_VALUE_OVERVIEW =
  `💥 You've got people moving across jobs and nobody owns the truth in one place—that's where margin dies.\n\n` +
  `⚡ Constructify is one workforce ops layer for:\n` +
  `• Who's assigned where\n` +
  `• Clock-in/out tied to real jobs\n` +
  `• What supers can trust when the week gets loud\n\n` +
  `That keeps payroll, scheduling, and site reality aligned—not three different stories.\n\n` +
  `What's loudest for you—time/payroll truth, scheduling and crews, or visibility across jobs and subs?`

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
