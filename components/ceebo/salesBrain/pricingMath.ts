/** Mirrors public pricing page tiers + per-user fee. */

export const ROADMAP_SIGNAL =
  "Constructify is built as the operational layer for crews, time, and jobsite visibility—so you're not duct-taping spreadsheets and texts forever."

export const EARLY_ADOPTER_FRAME =
  "Teams that lock in clean time and crew data early stop bleeding margin on payroll guesswork and rework."

const LICENSE_TIERS = [
  { min: 1, max: 25, annual: 1500 },
  { min: 26, max: 100, annual: 5000 },
  { min: 101, max: Infinity, annual: 9999 },
] as const

export const PER_USER_MONTHLY = 19.99

export function getAnnualLicense(users: number): number {
  for (const tier of LICENSE_TIERS) {
    if (users >= tier.min && users <= tier.max) return tier.annual
  }
  return LICENSE_TIERS[2].annual
}

export function calculateMonthlyCost(users: number): number {
  const licenseAnnual = getAnnualLicense(users)
  const licenseMonthly = licenseAnnual / 12
  return Math.round(users * PER_USER_MONTHLY + licenseMonthly)
}

export function extractCompanySize(input: string): number | null {
  const lower = input.trim().toLowerCase()
  const numMatch = lower.match(/\b(\d{1,4})\b/)
  if (numMatch) {
    const n = parseInt(numMatch[1], 10)
    if (n >= 1 && n <= 9999) return n
  }
  if (
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|twenty-five|thirty|fifty|hundred)\b/.test(
      lower
    )
  ) {
    const map: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
      eleven: 11,
      twelve: 12,
      fifteen: 15,
      twenty: 20,
      "twenty-five": 25,
      thirty: 30,
      fifty: 50,
      hundred: 100,
    }
    for (const [word, num] of Object.entries(map)) {
      if (lower.includes(word)) return num
    }
  }
  return null
}
