import type { AnswerMode } from "./answerDiscipline"
import { softClose } from "./cta"
import type { PathCloseContext } from "./pathControl"
import type { SalesCategory } from "./types"

function close(seed: number, ctx?: PathCloseContext): string {
  return softClose(seed, ctx)
}

const BODIES: Record<SalesCategory, string> = {
  PRICING:
    `💥 Money questions are fair—payroll drama usually costs more than the subscription.\n\n` +
    `We're per active user + tiered annual license (all on /pricing).\n\n` +
    `Ballpark who actually clocks in on a bad week—even a rough number—and I'll line up real math next message.`,

  FEATURES:
    `If your week is a fire drill of texts, paper, and "I thought he was on Job B," that's exactly where margin dies. ` +
    `Constructify pulls scheduling, time, workforce visibility, and compliance signals into one operational hub so you're not chasing ghosts. ` +
    `That is how you get cleaner handoffs between office and field and fewer "he said / she said" fights around hours.`,

  TIME_TRACKING_PAYROLL:
    `When guys round up hours or you're paying from memory, margin walks out the door—full stop. ` +
    `Constructify is built around honest clock-in / clock-out tied to work and projects so approvals stop being a negotiation every Friday. ` +
    `You still run payroll your way; we give you defensible time data instead of a pile of texts.`,

  SCHEDULING_CREW:
    `Last-minute crew shuffles eat your supers alive. ` +
    `You get scheduling with role-based assignments and clearer who's-on-what visibility — fewer trucks sent to the wrong gate. ` +
    `The point isn't a prettier calendar; it's fewer expensive mix-ups on site.`,

  EXTERNAL_WORKFORCE:
    `💥 Subs, temps, leased crews—visibility breaks here first.\n\n` +
    `⚡ Assignments + clock-ins across who's actually on the clock, without pretending chat fixes labor law.\n\n` +
    `You're giving supers a system people can actually follow.`,

  TRAINING_SAFETY:
    `Expired certs and missed safety touchpoints are the kind of "small" misses that turn into big checks. ` +
    `Training Hub style tracking — certifications, renewals, completion — lives alongside the rest of your workforce picture. ` +
    `Less scrambling before inspections; fewer "nobody told me" moments.`,

  WHO_IS_THIS_FOR:
    `If you run field crews on construction work — GC, sub, or growing trade shop — and you're tired of operating off group texts, you're the profile. ` +
    `Small teams use it to stop payroll leaks; bigger ones use it for multi-site visibility. ` +
    `If you're purely back-office with zero field clock-ins, we're probably not your fight.`,

  IMPLEMENTATION:
    `Nobody wants a six-month science project. ` +
    `The product is built to get teams operational fast: you stand up users, projects, and clock-in behavior without a PhD in enterprise software. ` +
    `Big bang isn't required — start with one crew, prove the time data, then roll wider.`,

  OBJECTIONS_PRICE:
    `💥 Every line item gets squeezed when material prices are nuts.\n\n` +
    `Flip it: one bad payroll week from padded hours or missed OT often swallows the subscription.\n\n` +
    `📊 Cleaner time truth + less firefighting—and pricing is published so you're not guessing.`,

  OBJECTIONS_ADOPTION:
    `"My guys won't use it" usually means the last tool looked like homework. ` +
    `Field flows here are meant to be fast: clock in, see what's assigned, move. Supers get control without standing over shoulders. ` +
    `Pilot one crew on one job — if the supers won't fight you on it, you scale.`,

  OBJECTIONS_ALREADY_USING_SOMETHING:
    `QuickBooks / Procore / spreadsheets aren't the enemy.\n\n` +
    `⚡ No single "who's on the clock where" story is.\n\n` +
    `Constructify sits in the ops layer—crews, time, visibility—without ripping your accounting stack.\n\nWatch the demos to see a real day.`,

  OBJECTIONS_TOO_SMALL:
    `Small doesn't mean safe from payroll bleed — sometimes it's worse because one bad week is the whole margin. ` +
    `If you've got even a handful of people in the field, clean time and assignments pay back fast. ` +
    `Pricing scales by active users, so you're not buying an aircraft carrier to move a pickup load.`,

  OBJECTIONS_TOO_BUSY:
    `Busy is exactly when flying blind costs the most — that's when hours walk and jobs get double-staffed by accident. ` +
    `You don't need a perfect migration Monday; you need a narrow pilot that stops one class of leaks this month. ` +
    `Pick your worst payroll headache; we line up the smallest win first.`,

  OBJECTIONS_OTHER:
    `Fair pushback. If software feels like another kid to babysit, the win is systems that reduce texts and arguments — not more dashboards for fun. ` +
    `If you "only" need time tracking, cool: nail clock-ins and approvals first; everything else is optional depth. ` +
    `Proof beats talk — role demos on the site show real flows, not slides.`,

  DIFFERENTIATION:
    `⚡ Pretty office grid vs rugged field toy—most teams still get chaos between them.\n\n` +
    `Constructify runs construction ops: crews, time, visibility, compliance pressure—not HR bingo.\n\n` +
    `Judge it on whether supers would actually run their week off it.`,

  SECURITY_TRUST:
    `🧠 Smart to ask—half the industry got burned by vaporware.\n\n` +
    `📊 Public pricing, YouTube demos, signup to the real app.\n\n` +
    `No magic claims in chat—watch flows first; serious security vetting belongs outside marketing copy.`,

  GENERAL_SALES_REDIRECT:
    `Straight talk: if field time, crew placement, or compliance tracking is costing you money or sleep, we're in your lane. ` +
    `Give me rough field headcount or name the fire—payroll truth, scheduling, visibility—and I'll aim the answer.`,
}

/** Tighter copy when the session is in SHORT_PUNCHY mode. */
const BODIES_SHORT: Partial<Record<SalesCategory, string>> = {
  PRICING:
    `Per active user + tiered annual license—numbers are on /pricing. Rough crew count gets you a real ballpark next message.`,
  TIME_TRACKING_PAYROLL:
    `Payroll fights start with bad time truth. Constructify ties clock-in/out to real work so you're not paying off texts.`,
  EXTERNAL_WORKFORCE:
    `Stacked subs is where visibility rots—assignments + clock accountability keep each party tied to their crews instead of group-text chaos.`,
  SECURITY_TRUST:
    `Published pricing, real signup, demos on video—evaluate like a buyer. Deep security Q&A belongs in a real vetting thread, not invented here.`,
  DIFFERENTIATION:
    `Not a generic timesheet—it's construction field ops: crews, jobs, who's on the clock where.`,
  OBJECTIONS_ALREADY_USING_SOMETHING:
    `QuickBooks/Procore don't replace field truth. Constructify sits on the ops layer—who clocked, where, on what—without ripping out your stack.`,
}

export function bodyForCategory(category: SalesCategory): string {
  return BODIES[category]
}

export function bodyForCategoryMode(
  category: SalesCategory,
  mode: AnswerMode
): string {
  if (mode === "SHORT_PUNCHY" && BODIES_SHORT[category]) {
    return BODIES_SHORT[category]!
  }
  return BODIES[category]
}

export function replyForCategory(
  category: SalesCategory,
  seed: number,
  withClose = true,
  pathCtx?: PathCloseContext
): string {
  const body = bodyForCategory(category)
  return withClose ? body + close(seed, pathCtx) : body
}

export function replyForCategoryMode(
  category: SalesCategory,
  seed: number,
  mode: AnswerMode,
  withClose = true,
  pathCtx?: PathCloseContext
): string {
  const body = bodyForCategoryMode(category, mode)
  return withClose ? body + close(seed, pathCtx) : body
}
