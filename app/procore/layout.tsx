import type { ReactNode } from "react"

/**
 * Minimal chrome for Procore embedded entry — avoids duplicating marketing layout tweaks.
 */
export default function ProcoreSegmentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[60vh] bg-background px-4 py-8 text-foreground md:px-6">
      <div className="mx-auto w-full max-w-lg">{children}</div>
    </div>
  )
}
