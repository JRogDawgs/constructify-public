import { getDemoSectionHashUrl, getYoutubeWatchUrl } from "@/lib/demoVideos"
import type { DemoRoleId } from "@/lib/demoVideos"
import { defaultPathCloseContext, primaryPathSuffix, type PathCloseContext } from "./pathControl"

/** Plain-text CTAs — real site routes; chat renders plain text (no markdown). */
export const CTA_SIGNUP = `Ready to move? Get started: ${"/signup"} (redirects to the Constructify app sign-in / sign-up).`

export const CTA_PRICING_PAGE = `Full numbers: ${"/pricing"}.`

export const CTA_CONTACT = `Want a walkthrough with a human: ${"/contact"}.`

/** Rotating single-line CTA (rare); chat replies use path-controlled softClose. */
export function pickPrimaryCta(seed: number): string {
  const pool = [CTA_SIGNUP, ctaWatchDemos(), CTA_PRICING_PAGE]
  return pool[Math.abs(seed) % pool.length]
}

export function ctaWatchDemos(): string {
  const demos = getDemoSectionHashUrl()
  return `Watch the role demos on the homepage: ${demos}`
}

export function ctaYoutubeRole(role: DemoRoleId): string {
  const url = getYoutubeWatchUrl(role)
  const label = role === "admin" ? "Admin" : role === "supervisor" ? "Supervisor" : "Worker"
  return `${label} demo (YouTube): ${url}`
}

/** One-path-forward CTA tail; pass ctx from engine for conversation control. */
export function softClose(seed: number, ctx?: PathCloseContext): string {
  return ` ${primaryPathSuffix(seed, ctx ?? defaultPathCloseContext())}`
}

export type { PathCloseContext } from "./pathControl"
