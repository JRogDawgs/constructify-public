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
    title: "Admin Dashboard",
    subtitle:
      "See every crew, every job, every project — from one screen. Total visibility for the people running the operation.",
    youtubeId: "mBcd2ZYKKYs",
    thumbnailUrl: "https://img.youtube.com/vi/mBcd2ZYKKYs/hqdefault.jpg",
  },
  supervisor: {
    id: "supervisor",
    title: "Supervisor Dashboard",
    subtitle:
      "Assign jobs, track crews in real time, and hold your team accountable — without the back-and-forth.",
    youtubeId: "9WLFjxS8OE8",
    thumbnailUrl: "https://img.youtube.com/vi/9WLFjxS8OE8/hqdefault.jpg",
  },
  worker: {
    id: "worker",
    title: "Worker Dashboard",
    subtitle:
      "Clock in, see your tasks, and track your hours and certs — everything a worker needs, nothing they don't.",
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
