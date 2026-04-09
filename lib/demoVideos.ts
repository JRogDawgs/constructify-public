import { PUBLIC_SITE_URL } from "@/lib/appConfig"

/** Role demo content — hosted on YouTube (landing page embeds + Ceebo links). */
export type DemoRoleId = "admin" | "supervisor" | "worker"

export const DEMO_ROLE_IDS: readonly DemoRoleId[] = [
  "admin",
  "supervisor",
  "worker",
] as const

export type DemoVideoEntry = {
  id: DemoRoleId
  title: string
  subtitle: string
  youtubeId: string
  thumbnailUrl: string
}

export const DEMO_VIDEOS: Record<DemoRoleId, DemoVideoEntry> = {
  admin: {
    id: "admin",
    title: "Admin",
    subtitle:
      "See everything happening across every job — instantly. Know who's working, where they are, and what's getting done — without digging or chasing.",
    youtubeId: "mBcd2ZYKKYs",
    thumbnailUrl: "https://img.youtube.com/vi/mBcd2ZYKKYs/hqdefault.jpg",
  },
  supervisor: {
    id: "supervisor",
    title: "Supervisor",
    subtitle:
      "Run your crews without the constant back-and-forth. Assign work clearly. Track progress live. Hold your team accountable without babysitting.",
    youtubeId: "9WLFjxS8OE8",
    thumbnailUrl: "https://img.youtube.com/vi/9WLFjxS8OE8/hqdefault.jpg",
  },
  worker: {
    id: "worker",
    title: "Worker",
    subtitle:
      "Show up, clock in, and know exactly what to do. Simple, fast, and built for the field — no confusion, no wasted time.",
    youtubeId: "MT3HWUy034k",
    thumbnailUrl: "https://img.youtube.com/vi/MT3HWUy034k/hqdefault.jpg",
  },
}

export function getYoutubeEmbedUrl(role: DemoRoleId): string {
  const id = DEMO_VIDEOS[role].youtubeId
  return `https://www.youtube.com/embed/${id}?rel=0`
}

/** Public watch URL for Ceebo, email, and sharing. */
export function getYoutubeWatchUrl(role: DemoRoleId): string {
  return `https://youtu.be/${DEMO_VIDEOS[role].youtubeId}`
}

/** Landing page with scroll target + optional demo deep link. */
export function getDemoLandingPageUrl(role: DemoRoleId): string {
  const base = PUBLIC_SITE_URL || ""
  const path = base ? `${base}/` : "/"
  return `${path}?demo=${role}#role-demos`
}

export function getDemoSectionHashUrl(): string {
  const base = PUBLIC_SITE_URL || ""
  return base ? `${base}/#role-demos` : "/#role-demos"
}
