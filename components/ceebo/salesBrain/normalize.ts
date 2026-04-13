/**
 * Normalize user text for substring phrase matching — rough speech, typos, punctuation.
 */

import { applyLingoAliases } from "./lingoMap"

const TYPO_REPLACEMENTS: readonly [RegExp, string][] = [
  [/schedualing|schedual/gi, "schedule"],
  [/timeshet|time shet/gi, "timesheet"],
  [/payrol\b/gi, "payroll"],
  [/subcontracter|subcontractor/gi, "subcontractor"],
  [/subcontractors/gi, "subcontractors"],
  [/subcontractor/gi, "subcontractor"],
  [/crews\b/gi, "crew"],
  [/jobsite|job site/gi, "jobsite"],
  [/time theft|tim theft/gi, "time theft"],
  [/quickbooks|quick books/gi, "quickbooks"],
  [/procore/gi, "procore"],
  [/spreadsheet|spreadshet/gi, "spreadsheet"],
  [/babysit|baby sit/gi, "babysit"],
  [/gonna/gi, "going to"],
  [/gotta/gi, "got to"],
  [/wanna/gi, "want to"],
  [/aint|ain't/gi, "is not"],
  [/yall|ya'll/gi, "you all"],
]

export function normalizeForMatch(raw: string): string {
  let s = applyLingoAliases(raw).toLowerCase().trim()
  for (const [re, rep] of TYPO_REPLACEMENTS) {
    s = s.replace(re, rep)
  }
  s = s.replace(/[^\p{L}\p{N}\s]/gu, " ")
  s = s.replace(/\s+/g, " ").trim()
  return s
}
