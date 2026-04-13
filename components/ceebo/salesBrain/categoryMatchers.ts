import { normalizeForMatch } from "./normalize"
import type { SalesCategory } from "./types"

type RawMatcher = { category: SalesCategory; phrases: string[] }

/**
 * Phrase lists (matched with normalizeForMatch on user input).
 * Order in array = tie-break priority when two phrases match same length (earlier wins).
 */
const RAW: RawMatcher[] = [
  {
    category: "OBJECTIONS_PRICE",
    phrases: [
      "too expensive",
      "too much money",
      "cost too much",
      "cant afford",
      "can't afford",
      "overpriced",
      "budget is tight",
      "how much is this shit",
      "how much is this",
      "cheaper option",
      "not paying that",
      "rip off",
      "pricey",
      "too high",
      "money grab",
    ],
  },
  {
    category: "OBJECTIONS_ADOPTION",
    phrases: [
      "wont use it",
      "won't use it",
      "guys wont",
      "guys will not",
      "my guys",
      "crew wont",
      "they hate apps",
      "never use software",
      "not tech savvy",
      "too dumb for apps",
      "field guys",
      "do i gotta train everybody",
      "train everybody",
      "too much training",
      "adoption",
      "resistance",
    ],
  },
  {
    category: "OBJECTIONS_ALREADY_USING_SOMETHING",
    phrases: [
      "already use quickbooks",
      "already use procore",
      "we use quickbooks",
      "we use procore",
      "use spreadsheets",
      "use excel",
      "google sheets",
      "already have software",
      "another app",
      "stack of tools",
      "integrated with",
      "switch from",
    ],
  },
  {
    category: "OBJECTIONS_TOO_SMALL",
    phrases: [
      "too small",
      "little company",
      "small shop",
      "only a few guys",
      "mom and pop",
      "two man crew",
      "we are tiny",
      "not big enough",
      "is this for little companies",
      "small contractor",
    ],
  },
  {
    category: "OBJECTIONS_TOO_BUSY",
    phrases: [
      "too busy",
      "no time to switch",
      "swamped",
      "in the middle of jobs",
      "cant switch now",
      "can't switch now",
      "not right now",
      "maybe later",
      "next quarter",
      "too much going on",
    ],
  },
  {
    category: "OBJECTIONS_OTHER",
    phrases: [
      "babysit another software",
      "babysit software",
      "another login",
      "pain in the ass",
      "pain in the butt",
      "too complicated",
      "too complex",
      "old way",
      "keep doing it the old way",
      "dont need all that",
      "don't need all that",
      "just need time tracking",
      "only need time tracking",
      "just timesheets",
      "how do i know this actually works",
      "does it actually work",
      "is this legit",
      "is this vaporware",
      "sounds fake",
      "dont need all that",
      "not another dashboard",
    ],
  },
  {
    category: "SECURITY_TRUST",
    phrases: [
      "is this real",
      "is it real",
      "scam",
      "trust",
      "security",
      "where is my data",
      "who are you",
      "how do i know youre legit",
      "safe data",
      "hack",
      "privacy",
    ],
  },
  {
    category: "DIFFERENTIATION",
    phrases: [
      "why constructify",
      "why you over",
      "vs procore",
      "versus procore",
      "competitor",
      "different from",
      "what makes you different",
      "better than",
      "compare to",
      "why not use",
      "just another timesheet app",
      "another timesheet",
    ],
  },
  {
    category: "TIME_TRACKING_PAYROLL",
    phrases: [
      "can this fix payroll",
      "fix payroll headaches",
      "payroll headache",
      "payroll headaches",
      "fix payroll",
      "jack their time",
      "pad hours",
      "time theft",
      "steal time",
      "buddy punching",
      "round up hours",
      "overtime mess",
      "hours wrong",
      "timesheet fight",
      "payroll guessing game",
      "paying from memory",
      "clock in",
      "clock out",
      "jobsite clock",
      "job site clock",
      "track jobsite clock",
      "who clocked in",
      "timesheet",
      "time tracking",
      "track hours",
      "hour tracking",
      "labor cost",
      "wage theft",
    ],
  },
  {
    category: "SCHEDULING_CREW",
    phrases: [
      "10 crews",
      "ten crews",
      "multiple crews",
      "crew assignment",
      "assign workers",
      "schedule a worker",
      "how do i schedule",
      "shift planning",
      "who is on what job",
      "who is where",
      "where my people are",
      "where are my people",
      "last minute change",
      "roster",
      "scheduling",
      "schedule",
      "shifts",
    ],
  },
  {
    category: "EXTERNAL_WORKFORCE",
    phrases: [
      "multiple subcontractor companies",
      "staffing agency",
      "subcontractor",
      "subcontractors",
      "subs on one job",
      "stacked subs",
      "multi sub",
      "temp labor",
      "leased labor",
      "external workforce",
      "does this work for subs",
      "work for subs",
      "electricians plumbers labor supers",
      "mixed trades",
      "mixed crew",
      "different trades",
    ],
  },
  {
    category: "TRAINING_SAFETY",
    phrases: [
      "osha",
      "safety training",
      "certification",
      "certifications",
      "training hub",
      "compliance",
      "expired cert",
      "renewal",
      "toolbox talk",
      "incident",
    ],
  },
  {
    category: "IMPLEMENTATION",
    phrases: [
      "how does onboarding work",
      "how do i add my team",
      "how do projects work",
      "how does hierarchy work",
      "implementation",
      "how long setup",
      "how fast setup",
      "get started how",
      "onboarding",
      "roll out",
      "rollout",
      "migration",
      "switch over",
      "setup time",
      "easy setup",
      "hard to implement",
    ],
  },
  {
    category: "WHO_IS_THIS_FOR",
    phrases: [
      "many projects at once",
      "multiple active jobs",
      "who is this for",
      "is this for me",
      "good fit",
      "too big for us",
      "enterprise only",
      "only for construction",
      "just for construction",
      "other industries",
      "grow with me",
      "scale with",
      "mid size",
      "midsize",
    ],
  },
  {
    category: "FEATURES",
    phrases: [
      "how can this app help my company",
      "how can this help my company",
      "help my company",
      "help my business",
      "how can this help",
      "what does this do for my business",
      "what does this app do",
      "what does constructify do",
      "what can it do",
      "capabilities",
      "what features",
      "does it include",
      "reporting",
      "analytics",
      "visibility",
      "workforce control",
      "mobile app",
      "project management",
    ],
  },
  {
    category: "PRICING",
    phrases: [
      "how much",
      "pricing",
      "subscription",
      "per user",
      "license cost",
      "annual fee",
      "monthly cost",
      "ballpark price",
      "quote",
      "cost per",
    ],
  },
]

export type PreparedMatcher = {
  category: SalesCategory
  /** Longest-first within category for greedy match */
  phrasesNorm: string[]
}

function prepare(): PreparedMatcher[] {
  return RAW.map(({ category, phrases }) => {
    const norms = [...new Set(phrases.map((p) => normalizeForMatch(p)))].sort(
      (a, b) => b.length - a.length
    )
    return { category, phrasesNorm: norms }
  })
}

export const PREPARED_MATCHERS: PreparedMatcher[] = prepare()

const PRIORITY_INDEX = new Map<SalesCategory, number>()
PREPARED_MATCHERS.forEach((m, i) => PRIORITY_INDEX.set(m.category, i))

/**
 * Longest matching phrase wins; ties broken by category order in RAW (earlier = higher priority).
 */
export function matchCategory(userNormalized: string): SalesCategory | null {
  let bestLen = 0
  let bestCat: SalesCategory | null = null
  let bestPri = 999

  for (const { category, phrasesNorm } of PREPARED_MATCHERS) {
    const pri = PRIORITY_INDEX.get(category) ?? 999
    for (const p of phrasesNorm) {
      if (!p) continue
      if (userNormalized.includes(p)) {
        const len = p.length
        if (len > bestLen || (len === bestLen && pri < bestPri)) {
          bestLen = len
          bestCat = category
          bestPri = pri
        }
      }
    }
  }
  return bestCat
}
