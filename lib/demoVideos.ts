import { PUBLIC_SITE_URL } from "@/lib/appConfig"

/**
 * Static files in public/videos/demos/ — kebab-case, no spaces (Linux deploys are case-sensitive;
 * encoded spaces in URLs are easy to get wrong).
 *
 * Place: admin-dashboard.mp4, supervisor-dashboard.mp4, worker-dashboard.mp4
 *
 * If any file is >100MB, GitHub will reject the push — use Git LFS or set NEXT_PUBLIC_DEMO_VIDEO_*_URL
 * to a full https URL (Vercel Blob, S3, Cloudflare R2, etc.).
 */
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
  /** Same-origin path under public/ when not using env CDN URLs */
  videoPath: string
  thumbnailPath: string
}

const DEMO_VIDEO_URL_FROM_ENV: Record<DemoRoleId, string | undefined> = {
  admin: process.env.NEXT_PUBLIC_DEMO_VIDEO_ADMIN_URL,
  supervisor: process.env.NEXT_PUBLIC_DEMO_VIDEO_SUPERVISOR_URL,
  worker: process.env.NEXT_PUBLIC_DEMO_VIDEO_WORKER_URL,
}

export const DEMO_VIDEOS: Record<DemoRoleId, DemoVideoEntry> = {
  admin: {
    id: "admin",
    title: "Admin Dashboard",
    subtitle:
      "Full org-wide control — manage users, crews, and projects. See how leadership runs the entire operation from one place.",
    videoPath: "/videos/demos/admin-dashboard.mp4",
    thumbnailPath: "/images/demo-videos/thumb-admin.svg",
  },
  supervisor: {
    id: "supervisor",
    title: "Supervisor Dashboard",
    subtitle:
      "Assign work, track crews, and hold teams accountable in real time — coordinate the field without chaos.",
    videoPath: "/videos/demos/supervisor-dashboard.mp4",
    thumbnailPath: "/images/demo-videos/thumb-supervisor.svg",
  },
  worker: {
    id: "worker",
    title: "Worker Dashboard",
    subtitle:
      "Simple clock in/out, clear daily tasks, and personal compliance tracking — so every worker knows exactly what to do.",
    videoPath: "/videos/demos/worker-dashboard.mp4",
    thumbnailPath: "/images/demo-videos/thumb-worker.svg",
  },
}

/** Resolved src for <video> — prefers CDN env URL when set (required for huge files not in git). */
export function getDemoVideoSrc(role: DemoRoleId): string {
  const fromEnv = DEMO_VIDEO_URL_FROM_ENV[role]?.trim()
  if (fromEnv) return fromEnv
  return DEMO_VIDEOS[role].videoPath
}

/** Direct MP4 URL for Ceebo / sharing (handles absolute env URLs). */
export function getDemoVideoAbsoluteFileUrl(role: DemoRoleId): string {
  const src = getDemoVideoSrc(role)
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  return PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}${src}` : src
}

/** Landing page with section scroll + optional auto-open via ?demo= */
export function getDemoLandingPageUrl(role: DemoRoleId): string {
  const base = PUBLIC_SITE_URL || ""
  const path = base ? `${base}/` : "/"
  return `${path}?demo=${role}#role-demos`
}

/** Section-only anchor (scroll to carousel). */
export function getDemoSectionHashUrl(): string {
  const base = PUBLIC_SITE_URL || ""
  return base ? `${base}/#role-demos` : "/#role-demos"
}
