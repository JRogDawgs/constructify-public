import { softClose } from "./cta"
import type { AnswerMode } from "./answerDiscipline"
import { normalizeForMatch } from "./normalize"
import type { BrainIntent, SalesCategory } from "./types"

export type PriorityHit = {
  response: string
  matchedCategory: SalesCategory | null
  intent: BrainIntent
  answerMode: AnswerMode
  /** Skip one-shot qualify when answer is already dense. */
  skipQualify: boolean
  /** Skip lead-in line for tight SHORT replies. */
  skipLead: boolean
}

type Row = { triggers: string[]; response: string; cat: SalesCategory | null; mode: AnswerMode }

/**
 * Arbitration: highest-specificity wins (longest trigger). Runs BEFORE top50/category.
 * Copy stays grounded: role-based visibility, assignments, multi-party jobs — no fake compliance claims.
 */
const ROWS: Row[] = [
  {
    triggers: [
      "procore and quickbooks",
      "quickbooks and procore",
      "why would i care",
      "already use procore and quickbooks",
    ],
    response:
      "Procore coordinates project information; QuickBooks runs the books. Neither one stands in the mud and tells you who clocked in where. Constructify is the field ops layer—assignments + clock truth—so payroll stops being a negotiation.",
    cat: "OBJECTIONS_ALREADY_USING_SOMETHING",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "gc see everyone",
      "gc see everybody",
      "general contractor see",
      "subs only see their own",
      "sub only see their",
      "each sub see",
      "four subcontractors",
      "4 subs",
      "three subcontractors",
      "stacked on one site",
      "stacked on one job",
      "multiple companies on one project",
      "multiple companies one job",
      "bunch of subs on one job",
      "subs on one job",
      "vendors on the same job",
      "shared labor",
      "labor shared",
      "external workers without losing control",
      "two supers",
      "2 supers",
      "supers on one job",
    ],
    response:
      "Stacked subs on one site is where most systems turn into group texts and denials. Constructify is built for real field ops: assignments and clock-ins tied to work, with role-based visibility so the GC side can run site-wide oversight while vendors and subs stay tied to their own crews—not a free-for-all where everybody reads everybody's payroll. One project can carry multiple companies when you run it that way—that's the differentiator.",
    cat: "EXTERNAL_WORKFORCE",
    mode: "STANDARD_SALES",
  },
  {
    triggers: [
      "not another timesheet",
      "just a timesheet",
      "another timesheet app",
    ],
    response:
      "If it were only a grid of hours, I'd tell you to skip it. Constructify is the ops layer—crews, jobs, who's on the clock where—so supers stop playing detective and payroll stops negotiating with fiction.",
    cat: "DIFFERENTIATION",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "dont want to call anybody",
      "don't want to call",
      "without calling",
      "no phone call",
      "figure this out myself",
    ],
    response:
      "You shouldn't need a sales call to understand the shape of the product. Public pricing, role demos on the site, and signup are the whole self-serve path—I'm here to shortcut the questions, not drag you into a calendar game.",
    cat: "GENERAL_SALES_REDIRECT",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "not doing a free trial",
      "no free trial",
      "without a trial",
    ],
    response:
      "Fair—I'm not here to invent promo periods. Watch the demos, read pricing, and if it fits, get started on one crew and one job—that's the real proof.",
    cat: "OBJECTIONS_OTHER",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "multiple divisions",
      "several divisions",
      "many crews",
      "80 later",
      "12 guys now",
      "grow with us",
      "scale with us",
      "big company",
      "large company",
      "real operations",
      "not just small shops",
      "small shops only",
      "permissions work",
      "only see what",
      "supposed to see",
      "role based access",
    ],
    response:
      "Bigger operations don't need buzzwords—they need clean roles, controlled visibility, and field data that doesn't turn into politics. Constructify is aimed at construction workforce ops: who is assigned where, who clocked in, and what supers can trust when the job gets loud. Scale is active users plus license tiers—so you're not punished the second you add crews.",
    cat: "WHO_IS_THIS_FOR",
    mode: "TRUST_BUILDING",
  },
  {
    triggers: [
      "is this secure",
      "data secure",
      "security serious",
      "legit enough for a big company",
      "enterprise ready",
    ],
    response:
      "Serious question. What you get on the public side is transparent pricing, real app signup, and demos you can verify with your own eyes—no vaporware pitch in chat. For legal/security specifics beyond what marketing can responsibly claim here, that's a straight documentation / human conversation—but the product story is operations-grade field control, not a toy clock app.",
    cat: "SECURITY_TRUST",
    mode: "TRUST_BUILDING",
  },
  {
    triggers: [
      "my guys are a mess",
      "foremen suck",
      "paperwork",
      "payroll is a mess",
      "who is where",
      "what job theyre on",
    ],
    response:
      "That's the whole fight: who was where, on what scope, with proof. Constructify centers clock-ins and assignments so foremen aren't the weak link in your paper trail—and payroll stops being a negotiation.",
    cat: "TIME_TRACKING_PAYROLL",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: ["lol", "idk", "whatever", "u there", "hello"],
    response:
      "I'm here. In one line: Constructify is field clock + crew visibility + scheduling discipline for construction ops. Tell me payroll, scheduling, subs, or pricing—or drop a crew count.",
    cat: "GENERAL_SALES_REDIRECT",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "how much",
      "so what is this",
      "what is this",
      "why would i use this",
      "does it work",
      "can it do payroll",
    ],
    response:
      "Constructify is field workforce ops—who's assigned where, clock-in/out tied to work, and visibility your supers can run a week off. It doesn't replace your payroll engine; it feeds it cleaner time truth. Rough active headcount gets you real pricing math.",
    cat: "GENERAL_SALES_REDIRECT",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "babysit software",
      "dont have time to babysit",
      "don't have time to babysit",
      "no time for software",
    ],
    response:
      "Fair. The win isn't more dashboards—it's one place for clock and assignments so foremen stop inventing paperwork Friday night. Pilot one crew on one job; if supers won't fight you on it, you scale.",
    cat: "OBJECTIONS_TOO_BUSY",
    mode: "SHORT_PUNCHY",
  },
  {
    triggers: [
      "different from every other app",
      "what makes this different",
      "why constructify",
    ],
    response:
      "Most apps are either a pretty office grid or a field toy. Constructify is aimed at construction ops: crews on jobs, clock truth, role visibility—so payroll and site reality stop arguing with each other.",
    cat: "DIFFERENTIATION",
    mode: "STANDARD_SALES",
  },
]

export function matchPriorityIntel(norm: string, seed: number): PriorityHit | null {
  let best: { len: number; row: Row } | null = null
  for (const row of ROWS) {
    for (const t of row.triggers) {
      const nt = normalizeForMatch(t)
      if (!nt || !norm.includes(nt)) continue
      const len = nt.length
      if (!best || len > best.len) best = { len, row }
    }
  }
  if (!best) return null
  const row = best.row
  const skipLead = row.mode === "SHORT_PUNCHY"
  const skipQualify =
    row.mode === "SHORT_PUNCHY" ||
    row.cat === "EXTERNAL_WORKFORCE" ||
    row.cat === "SECURITY_TRUST" ||
    row.cat === "WHO_IS_THIS_FOR"
  return {
    response: `${row.response.trim()}${softClose(seed)}`,
    matchedCategory: row.cat,
    intent: (row.cat ?? "GENERAL_SALES_REDIRECT") as BrainIntent,
    answerMode: row.mode,
    skipQualify,
    skipLead,
  }
}
