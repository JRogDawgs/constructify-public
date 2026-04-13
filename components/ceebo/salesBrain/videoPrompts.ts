import { getDemoSectionHashUrl, getYoutubeWatchUrl } from "@/lib/demoVideos"
import type { DemoRoleId } from "@/lib/demoVideos"
import type { BrainIntent } from "./types"

export const VIDEO_LIBRARY = {
  admin: "Admin full workflow demo",
  supervisor: "Supervisor day-to-day demo",
  worker: "Worker clock-in / tasks demo",
  overview: "Full system walkthrough",
} as const

export type VideoLibraryKey = keyof typeof VIDEO_LIBRARY

export type VideoRoleMatch = DemoRoleId | "overview"

/** Role-specific “show me X” — returns null if no match. */
export function matchVideoRoleQuery(norm: string): VideoRoleMatch | null {
  if (/\bshow me admin\b|\badmin demo\b|\badmin view\b|\bwatch admin\b/.test(norm)) return "admin"
  if (
    /\bshow me supervisor\b|\bsupervisor demo\b|\bhow does supervisor use\b|\bwatch supervisor\b/.test(norm)
  ) {
    return "supervisor"
  }
  if (/\bshow me worker\b|\bworker demo\b|\bwatch worker\b/.test(norm)) return "worker"
  if (/\boverview demo\b|\bfull system walkthrough\b|\ball three roles\b/.test(norm)) return "overview"
  return null
}

function roleBullets(role: DemoRoleId): string {
  if (role === "admin") {
    return "• Company + projects\n• Who sees what across jobs\n• Oversight without spreadsheet fiction"
  }
  if (role === "supervisor") {
    return "• Assign crews\n• Track who's on site\n• Clock-ins tied to jobs\n• Multiple subs in one operational view"
  }
  return "• Fast clock in/out\n• Clear assignments\n• Less end-of-week paperwork fights"
}

/** Tight copy + real YouTube URLs (no embeds). */
export function videoRoleReply(role: VideoRoleMatch): string {
  if (role === "overview") {
    const demos = getDemoSectionHashUrl()
    return (
      `⚡ ${VIDEO_LIBRARY.overview}:\n` +
      `• Company → projects → crews / vendors\n` +
      `• Each party brings their own people\n` +
      `• Clock-ins stay tied to real work\n\n` +
      `📊 Homepage role demos or jump straight:\n${demos}\n\n` +
      `🚀 Use the "Watch demos" button above the chat, or ask for admin / supervisor / worker.`
    )
  }
  const url = getYoutubeWatchUrl(role)
  return (
    `⚡ ${VIDEO_LIBRARY[role]}:\n${roleBullets(role)}\n\n` +
    `📊 This is where most jobsite control actually happens.\n\n` +
    `🚀 Watch now: ${url}`
  )
}

function responseAlreadyHasVideoPointer(text: string): boolean {
  const t = text.toLowerCase()
  return (
    t.includes("youtu.be") ||
    t.includes("youtube.com") ||
    t.includes("#role-demos") ||
    t.includes("role demos") ||
    t.includes("watch demos")
  )
}

function closeToConvert(args: {
  intent: BrainIntent
  companySize: number | null
  askedPricingSession: boolean
}): boolean {
  return (
    args.companySize !== null ||
    args.intent === "COMPANY_SIZE" ||
    args.askedPricingSession ||
    args.intent === "PRICING"
  )
}

/** Short video nudge — not every turn (seed + exchange jitter). */
export function shouldOfferVideoBlock(args: {
  norm: string
  response: string
  exchangeCount: number
  seed: number
  intent: BrainIntent
  companySize: number | null
  askedPricingSession: boolean
}): boolean {
  if (responseAlreadyHasVideoPointer(args.response)) return false
  if ((args.seed + args.exchangeCount) % 6 === 0) return false

  const n = args.norm
  if (/\bshow me\b|\bwatch (a |the )?demo\b|\bsee a demo\b|\bhow does this work\b|\bsee it\b|\bvideo\b/.test(n)) {
    return true
  }
  if (args.exchangeCount >= 2 && /\b(not sure|confused|skeptical|does this actually)\b/.test(n)) {
    return true
  }
  if (args.response.length > 520) return true
  if (closeToConvert(args) && (args.seed % 4) !== 0) return true
  return false
}

export function videoSoftOfferBlock(): string {
  return (
    `🚀 Want to SEE it instead of read it? Quick demos:\n` +
    `• Admin\n` +
    `• Supervisor\n` +
    `• Worker\n\n` +
    `Use the "Watch demos" button above the chat, open /#role-demos, or say "show me admin" / "show me supervisor".`
  )
}

export function videoCloseComboBlock(): string {
  return (
    `📊 You'd see this working in about 60 seconds on video.\n\n` +
    `🚀 Watch the demos—or jump in: /signup`
  )
}

export function pickVideoAppendBlock(args: {
  norm: string
  response: string
  exchangeCount: number
  seed: number
  intent: BrainIntent
  companySize: number | null
  askedPricingSession: boolean
}): string {
  if (!shouldOfferVideoBlock(args)) return ""
  if (
    closeToConvert({
      intent: args.intent,
      companySize: args.companySize,
      askedPricingSession: args.askedPricingSession,
    })
  ) {
    return `\n\n${videoCloseComboBlock()}`
  }
  return `\n\n${videoSoftOfferBlock()}`
}
