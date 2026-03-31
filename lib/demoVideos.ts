import { PUBLIC_SITE_URL } from "@/lib/appConfig"

/** Maps to files in public/videos/demos/ (spaces encoded for URLs). */
function demoVideoPath(filename: string): string {
  return `/videos/demos/${encodeURIComponent(filename)}`
}

/** Role demos on the public landing page — stable paths under public/ */
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
  videoPath: string
  thumbnailPath: string
}

/**
 * Role demo video entries.
 *
 * Ceebo references:
 *   adminDemo     → DEMO_VIDEOS.admin
 *   supervisorDemo → DEMO_VIDEOS.supervisor
 *   workerDemo    → DEMO_VIDEOS.worker
 *
 * To get a shareable URL for Ceebo: getDemoLandingPageUrl(role)
 * To get a direct MP4 URL:          getDemoVideoAbsoluteFileUrl(role)
 */
export const DEMO_VIDEOS: Record<DemoRoleId, DemoVideoEntry> = {
  admin: {
    id: "admin",
    title: "Admin Dashboard",
    subtitle:
      "Full org-wide control — manage users, crews, and projects. See how leadership runs the entire operation from one place.",
    videoPath: demoVideoPath("Admin Dashboard.mp4"),
    thumbnailPath: "/images/demo-videos/thumb-admin.svg",
  },
  supervisor: {
    id: "supervisor",
    title: "Supervisor Dashboard",
    subtitle:
      "Assign work, track crews, and hold teams accountable in real time — coordinate the field without chaos.",
    videoPath: demoVideoPath("Supervisor Dashboard.mp4"),
    thumbnailPath: "/images/demo-videos/thumb-supervisor.svg",
  },
  worker: {
    id: "worker",
    title: "Worker Dashboard",
    subtitle:
      "Simple clock in/out, clear daily tasks, and personal compliance tracking — so every worker knows exactly what to do.",
    videoPath: demoVideoPath("Worker Dashboard.mp4"),
    thumbnailPath: "/images/demo-videos/thumb-worker.svg",
  },
}

/** Direct file URL to the MP4 (best for Ceebo: pasteable, stable on deploy). */
export function getDemoVideoAbsoluteFileUrl(role: DemoRoleId): string {
  const path = DEMO_VIDEOS[role].videoPath
  return PUBLIC_SITE_URL ? `${PUBLIC_SITE_URL}${path}` : path
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
