/**
 * Contractor / sloppy phrasing → phrasing our matchers already understand.
 * Runs before normalize (case-insensitive). Word-boundary safe where possible.
 */
const ALIASES: readonly [RegExp, string][] = [
  [/\bwho the hell is on my job\b/gi, "who is on my job"],
  [/\bpeople on site\b/gi, "workers on site"],
  [/\bcontract labor\b/gi, "external workers"],
  [/\b1099 guys?\b/gi, "external workers"],
  [/\brandom workers?\b/gi, "external workers"],
  [/\bmy guys\b/gi, "my workers"],
  [/\bmy crews?\b/gi, "my teams"],
  [/\bbodies on\b/gi, "workers on"],
  [/\bbodies\b/gi, "workers"],
  [/\btemps\b/gi, "external workers"],
  [/\btemp labor\b/gi, "external workers"],
  [/\bsubs\b/gi, "subcontractors"],
  [/\bcrew\b/gi, "team"],
  [/\bcrews\b/gi, "teams"],
]

export function applyLingoAliases(raw: string): string {
  let s = raw
  for (const [re, rep] of ALIASES) {
    s = s.replace(re, rep)
  }
  return s
}
