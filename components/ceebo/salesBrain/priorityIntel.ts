import { softClose } from "./cta"
import type { AnswerMode } from "./answerDiscipline"
import { normalizeForMatch } from "./normalize"
import type { PathCloseContext } from "./pathControl"
import {
  ENTERPRISE_FLEX,
  EXAMPLE_MODE,
  ONBOARDING_EASY,
  SEE_COMPANY_STRUCTURE,
  STACKED_SUBS_DOMINANCE,
} from "./hierarchyWeapon"
import { BROAD_VALUE_OVERVIEW } from "./topOfFunnel"
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

type Row = {
  triggers: string[]
  response: string
  cat: SalesCategory | null
  mode: AnswerMode
  /** Answer already ends with a narrowing question */
  skipQualifyOverride?: boolean
}

/**
 * Arbitration: highest-specificity wins (longest trigger). Runs BEFORE top50/category.
 * Copy stays grounded: role-based visibility, assignments, multi-party jobs — no fake compliance claims.
 */
const ROWS: Row[] = [
  {
    triggers: [
      "how can this app help my company",
      "how can this help my company",
      "how can constructify help my company",
      "how can this help my business",
      "what does this do for a business like mine",
      "what is this app actually for",
      "what does this app actually do",
      "what problem does this solve",
      "how does this help my business",
      "what does this do for my business",
      "how does this help me",
      "what is this app for",
      "why would i use this",
    ],
    response: BROAD_VALUE_OVERVIEW,
    cat: "FEATURES",
    mode: "STANDARD_SALES",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "how does onboarding work",
      "how do i set this up",
      "how do i add my team",
      "how do projects work",
      "how do i organize crews",
      "how do subs fit in",
      "how does this handle multiple companies",
      "how does hierarchy work",
      "team structure in the app",
      "see my company in",
    ],
    response: SEE_COMPANY_STRUCTURE,
    cat: "IMPLEMENTATION",
    mode: "STANDARD_SALES",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "still confused",
      "explain it simpler",
      "give me an example",
      "how would this look for me",
      "real world example",
      "walk me through an example",
    ],
    response: EXAMPLE_MODE,
    cat: "IMPLEMENTATION",
    mode: "STANDARD_SALES",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "is setup hard",
      "how long does it take",
      "how long does setup",
      "how long to get started",
      "is onboarding hard",
      "how hard is setup",
      "onboarding process",
    ],
    response: ONBOARDING_EASY,
    cat: "IMPLEMENTATION",
    mode: "STANDARD_SALES",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "many projects at once",
      "multiple active jobs",
      "scaling construction",
      "complex workforce",
      "big operation",
      "lots of jobs",
      "run many jobs",
    ],
    response: ENTERPRISE_FLEX,
    cat: "WHO_IS_THIS_FOR",
    mode: "TRUST_BUILDING",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "procore and quickbooks",
      "quickbooks and procore",
      "why would i care",
      "already use procore and quickbooks",
    ],
    response:
      "Procore coordinates project info; QuickBooks runs the books.\n\n⚡ Neither one stands in the mud and tells you who clocked in where—Constructify is field ops: assignments + clock truth so payroll stops being a negotiation.",
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
      "staffing agency",
      "leased labor",
      "temp labor",
      "multiple subcontractor companies",
      "subs and staffing",
    ],
    response: STACKED_SUBS_DOMINANCE,
    cat: "EXTERNAL_WORKFORCE",
    mode: "STANDARD_SALES",
    skipQualifyOverride: true,
  },
  {
    triggers: [
      "not another timesheet",
      "just a timesheet",
      "another timesheet app",
    ],
    response:
      "If it were only a grid of hours, I'd tell you to skip it.\n\n⚡ Constructify is the ops layer—crews, jobs, who's on the clock where—so supers stop playing detective and payroll stops negotiating with fiction.",
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
      "📊 Bigger operations don't need buzzwords—they need clean roles, controlled visibility, and field data that doesn't turn political.\n\n⚡ Constructify is workforce ops: who's assigned where, who clocked in, what supers trust when it's loud.\n\nScale tracks active users + license tiers—add crews without getting punished for it.",
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
      "🧠 Serious question—evaluate like a buyer.\n\n📊 Public pricing, real signup, demos you can verify with your eyes—no vaporware pitch in chat.\n\nDeep legal/security vetting belongs outside marketing copy; the product story is ops-grade field control, not a toy clock app.",
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
      "⚡ Most apps are a pretty office grid or a rugged field toy—pick your chaos.\n\nConstructify runs construction ops: crews, jobs, clock truth, role visibility—payroll and site reality stay aligned.",
    cat: "DIFFERENTIATION",
    mode: "STANDARD_SALES",
  },
  {
    triggers: [
      "wait how does this actually work",
      "how does this actually work",
      "what do i do first",
      "how do i start",
      "what does setup look like",
      "is this complicated",
      "so what do i do first",
      "how do you start",
    ],
    response:
      "⚡ Simple path:\n• Company in the app\n• People + jobs added\n• Clock one real job the same week\n\nField-first: supers see who's clocked where. Not a six-month science fair.",
    cat: "IMPLEMENTATION",
    mode: "STANDARD_SALES",
  },
  {
    triggers: [
      "why not just use quickbooks",
      "why not just use procore",
      "why not just use spreadsheets",
      "why not just use excel",
      "why not just use a spreadsheet",
      "we already track time in quickbooks",
      "track time in procore",
    ],
    response:
      "QuickBooks runs books. Procore runs project info. Spreadsheets don't do 6am gates.\n\n⚡ Constructify is the ops layer between schedule, field clock-ins, and payroll truth—not another pretty hours grid.\n\nBuilt for crews, not desk-only workflows.",
    cat: "DIFFERENTIATION",
    mode: "STANDARD_SALES",
  },
  {
    triggers: [
      "my guys wont use it",
      "guys wont use it",
      "crews wont use",
      "sounds like a pain",
      "setup will suck",
      "this sounds like work",
      "sounds complicated",
      "dont have time for this",
      "don't have time for this",
    ],
    response:
      "💥 You don't need to babysit every click.\n\n⚡ Field flow is simple: clock in, see what's assigned, move.\n\nStart one crew on one job—if supers save time Friday, crews follow usefulness, not speeches.",
    cat: "OBJECTIONS_ADOPTION",
    mode: "STANDARD_SALES",
  },
]

export function matchPriorityIntel(
  norm: string,
  seed: number,
  pathCtx: PathCloseContext
): PriorityHit | null {
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
    row.cat === "WHO_IS_THIS_FOR" ||
    row.cat === "IMPLEMENTATION" ||
    row.cat === "DIFFERENTIATION" ||
    row.cat === "OBJECTIONS_ADOPTION" ||
    row.skipQualifyOverride === true
  return {
    response: `${row.response.trim()}${softClose(seed, pathCtx)}`,
    matchedCategory: row.cat,
    intent: (row.cat ?? "GENERAL_SALES_REDIRECT") as BrainIntent,
    answerMode: row.mode,
    skipQualify,
    skipLead,
  }
}
