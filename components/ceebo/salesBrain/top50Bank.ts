import { softClose } from "./cta"
import { normalizeForMatch } from "./normalize"
import type { PathCloseContext } from "./pathControl"

export type QaEntry = {
  /** Substrings after normalizeForMatch; longest match wins across bank */
  triggers: string[]
  /** Full answer; CTA appended in engine via seed — omit duplicate CTAs if answer already has one */
  answer: string
}

function a(triggers: string[], body: string): QaEntry {
  return { triggers, answer: body }
}

/**
 * 50+ grounded sales / pre-sales answers. Engine appends rotating CTA unless answer ends with "—" skip flag... simpler: always append softClose in engine for TOP50 - might double CTA. 
 * Instead: TOP50 answers end without CTA; engine always appends one softClose(seed+i).
 */
export const TOP50_QA: QaEntry[] = [
  a(["payroll turns into a guessing game"], `When payroll turns into a guessing game, you're already losing. Constructify gives you clock data tied to work so you're not paying off texts and memory.`),
  a(["stop time theft", "time theft", "buddy punch"], `Time theft is usually a process problem, not a morality speech. Tight clock-in tied to real assignments cuts the easy angles—then approvals aren't a fight.`),
  a(["jack their time", "inflate hours"], `If hours magically inflate on busy weeks, you need a source of truth that isn't the crew's group chat. That's the core of what we fix.`),
  a(["payroll headache", "payroll headaches"], `Payroll headaches are almost always bad time data upstream. Clean who / where / when first; the rest of the week gets calmer.`),
  a(["see where my people are", "know who is where", "who is where"], `You need to know who's supposed to be on which job—not spy-movie tracking. Constructify is built around assignments and clock-ins so supers stop playing detective.`),
  a(["gps", "track my guys location"], `We're not selling creepy surveillance. It's about crew placement and accountability: who's clocked, on what work, with a paper trail that holds up when there's a dispute.`),
  a(["does this work for subs", "subcontractors on one job"], `Subs stacked on one job is where visibility dies first. You run mixed crews with clearer assignments and clock accountability—so the GC story and the payroll story match.`),
  a(["temp labor", "leased labor", "staffing agency"], `Temp and leased crews still need the same truth as your W2 folks: who showed, for how long, on what scope. Same system—less gray area.`),
  a(["10 crews", "many crews"], `Lots of crews means lots of ways to double-book people. Scheduling plus time in one ops layer is how you stop sending the same names to two gates.`),
  a(["electricians plumbers labor supers mixed"], `Mixed trades isn't exotic—it's Tuesday. You need assignments and time that work for supers, trades, and laborers without three different hacks.`),
  a(["just another timesheet app"], `If it were only a grid of hours, I'd agree—that's not enough. Constructify is aimed at construction ops: crews, jobs, visibility, compliance pressure—not a generic timesheet toy.`),
  a(["jobsite clock", "job site clock ins"], `Jobsite clock-ins are the backbone: fast for the field, defensible for the office. That's the habit everything else hangs on.`),
  a(["quickbooks", "quick books"], `QuickBooks is great at books—terrible at standing in the mud telling you who clocked in. Use Constructify for field truth; keep your accounting stack.`),
  a(["procore"], `Procore is a beast at project docs and coordination. Constructify is the ops layer for who is on the clock where—different job. Many teams run both; we're not pretending we're the same product.`),
  a(["spreadsheets", "excel", "google sheets"], `Spreadsheets don't fail from math—they fail from stale cells and nobody owning updates. You need live clock and assignment behavior, not another tab nobody trusts.`),
  a(["too expensive", "cant afford", "can't afford"], `Margin is thin—I get it. Stack the cost against one bad payroll week or one OT fight you lose because you can't prove hours. Usually the math flips fast.`),
  a(["my guys wont use", "won't use it"], `Then don't roll like a corporate IT project. Pilot one crew, one job, prove the supers save time—field adoption follows usefulness, not slogans.`),
  a(["too small", "little company"], `Small crews bleed faster because one leak is the whole week. If you've got people in the field, you can get value without "enterprise" headcount.`),
  a(["too busy to switch"], `Busy teams are exactly who lose money to chaos. You don't need a big bang—narrow the first win to time capture on your worst job.`),
  a(["babysit software", "another login"], `If it doesn't delete texts and arguments, it's not worth it. The point here is less chasing, not more dashboards to admire.`),
  a(["old way worked"], `The old way worked until scale, subs, and lawsuits got real. If you're still fine, cool—if payroll fights are growing, you're reading this for a reason.`),
  a(["dont need all that", "don't need all that"], `Then don't buy "all that." Start with clock-ins and approvals—the smallest slice that stops one class of leaks.`),
  a(["just need time tracking"], `Perfect—nail clock-in/out and approvals first. Everything else is there when the pain moves to scheduling or certs.`),
  a(["how do i know it works", "actually works"], `Don't trust a chatbot—trust your eyes. Role demos on the site and YouTube walk real flows; signup is real software, not a brochure.`),
  a(["is this legit", "is this real"], `Legit question. Published pricing, public demos, signup to the real app—no fake "integrations" promised in this chat.`),
  a(["why constructify", "why you"], `Because construction field ops is the product—not generic HR bingo. If your pain is crews, time, and visibility, we're built for that lane.`),
  a(["only for construction", "just for construction"], `Built for construction field workflows. If you have zero field clock-ins, we're probably not your fight.`),
  a(["grow with me", "scale"], `Pricing is active-user based with license tiers—so you're not punished for seasonal swings the way flat-seat models punish you.`),
  a(["osha", "safety"], `Safety pressure is real—expired certs and sloppy tracking cost more than software. Training and compliance signals live next to time and crews so it's one picture.`),
  a(["certification", "certifications"], `Certs expiring quietly is how you get surprised before inspections. Track completion and renewals so it's boring—in a good way.`),
  a(["implementation", "how long"], `Designed to get operational without a science fair. Pilot a crew, prove cleaner time data, widen when supers ask for it—not when PowerPoint says so.`),
  a(["reporting", "analytics"], `Reporting only matters if the inputs aren't garbage. Get clock and assignment data clean first—then visibility actually means something.`),
  a(["mobile", "phone app"], `Field-first means it has to work from the truck and the mud. Mobile clock-in and supervisor flows are the point, not an afterthought.`),
  a(["payroll integration", "integrate payroll"], `We give you clean time truth your payroll process can consume. We're not in this chat claiming a specific payroll vendor button—your accountant still runs payroll.`),
  a(["multi project", "multiple projects"], `Multiple jobs is where scheduling and time earn their keep—who's billed where, who's double-booked, who no-showed.`),
  a(["change orders"], `Change orders wreck schedules; you still need who-was-where truth when arguments start. Clock and assignment history is your receipts.`),
  a(["union", "union rules"], `Union jobs have extra rules—this chat won't fake legal advice. The practical win is auditable time and assignments your stewards can actually see.`),
  a(["international", "outside us", "outside usa"], `Go-to-market and compliance details vary by country—hit contact for a straight answer for your region instead of me guessing.`),
  a(["data export", "export data"], `Operational truth should be portable enough for your workflows—ask contact about export expectations for your setup.`),
  a(
    ["free trial", "do you offer a trial", "is there a trial"],
    `Best path: watch the role demos, read /pricing, then /signup on a tight pilot if it fits. I won't invent promo periods or custom pricing in chat—use the real pages.`
  ),
  a(["contract length", "annual contract"], `Pricing page shows annual license tiers plus per active user—no gotcha language here; read it alongside your CFO.`),
  a(
    ["cancel anytime", "cancel subscription"],
    `Commercial terms aren't something I should freestyle in chat—cancellation and billing language lives on /terms; read it there instead of trusting chat paraphrase.`
  ),
  a(["support", "help me fix"], `I'm the public-site sales guide—not logged-in support. For product break/fix, you'll use in-app support channels after signup.`),
  a(["compare procore"], `Procore shines at construction project information. Constructify targets workforce time and ops visibility—apples and oranges, often complementary.`),
  a(["compare buildertrend", "buildertrend"], `If you're comparing homeowner remodel CRMs to field workforce control, mismatch. We're focused on crews, time, and jobsite ops for construction teams.`),
  a(["roofing", "electrical", "plumbing"], `Trades all share the same pain: who's on the clock, on what job, with proof. The industry label changes; the leak doesn't.`),
  a(["gc", "general contractor"], `GCs juggling subs need the same thread: assignments + clock truth so the story matches payroll and site reality.`),
  a(["superintendent", "superintendents", "supers"], `Supers stop winning when they're full-time detectives. Give them assignments and clock visibility they can run from the field.`),
  a(["foreman"], `Foremen need fast answers: who's here, what's late, who to call. Less radio drama, more logged behavior.`),
  a(["workers", "field workers"], `Workers win when clock-in is stupid simple and expectations are clear—otherwise they fight the tool instead of the job.`),
  a(["training overload"], `Training can't be another homework portal nobody opens. Track what matters, renew what expires, keep it adjacent to the work.`),
  a(["compliance", "audit"], `Audits love receipts. Time and training signals in one operational picture beats a folder nobody updated since last year.`),
  a(["lost money", "losing money"], `If you're bleeding margin on payroll guesses and rework, software cost is rarely the real line item—chaos is.`),
  a(
    ["book demo", "schedule demo", "want a demo", "see a demo"],
    `Watch the homepage role demos first—that's the fastest proof. /pricing for numbers, /signup when you want to try it on one crew and one job.`
  ),
  a(
    [
      "where are the role demos",
      "where are role demos",
      "what should i watch first",
      "watch the demos",
    ],
    `On this site, scroll the homepage to the role demos block — Admin, Supervisor, Worker — or jump straight to /#role-demos. Watch the role that matches your worst weekly headache first.`
  ),
]

/** Number of distinct Q&A entries (each may have multiple trigger phrases). */
export const TOP50_QUESTION_COUNT = TOP50_QA.length

/** Longest trigger match across TOP50_QA */
export function matchTop50(
  userNormalized: string,
  seed: number,
  pathCtx: PathCloseContext
): string | null {
  let bestLen = 0
  let bestIdx = -1
  TOP50_QA.forEach((entry, idx) => {
    for (const t of entry.triggers) {
      const nt = normalizeForMatch(t)
      if (!nt) continue
      if (userNormalized.includes(nt)) {
        const len = nt.length
        if (len > bestLen) {
          bestLen = len
          bestIdx = idx
        }
      }
    }
  })
  if (bestIdx < 0) return null
  return TOP50_QA[bestIdx].answer + softClose(seed + bestIdx, pathCtx)
}
