/** Split assistant copy for staggered reveal; total schedule stays under ~800ms budget. */
const MAX_CHUNKS = 5
/** Pause before first visible chunk (hook anticipation). */
export const CEEBO_HOOK_PAUSE_MS = 150
const TOTAL_BUDGET_MS = 800

export function splitRevealChunks(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return [""]

  let parts = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return mergeDown(parts, MAX_CHUNKS)
  }

  const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean)
  if (lines.length <= 3) return [trimmed]

  const target = Math.min(MAX_CHUNKS, Math.max(2, Math.ceil(lines.length / 3)))
  const per = Math.ceil(lines.length / target)
  const out: string[] = []
  for (let i = 0; i < lines.length; i += per) {
    out.push(lines.slice(i, i + per).join("\n"))
  }
  return mergeDown(out, MAX_CHUNKS)
}

function mergeDown(parts: string[], max: number): string[] {
  if (parts.length <= max) return parts
  const merged: string[] = []
  const group = Math.ceil(parts.length / max)
  for (let i = 0; i < parts.length; i += group) {
    merged.push(parts.slice(i, i + group).join("\n\n"))
  }
  return merged.length > max ? mergeDown(merged, max) : merged
}

export function revealScheduleMs(chunkCount: number): {
  initialPause: number
  gapMs: number
} {
  if (chunkCount <= 1) return { initialPause: 0, gapMs: 0 }
  const remaining = TOTAL_BUDGET_MS - CEEBO_HOOK_PAUSE_MS
  const gaps = chunkCount - 1
  const gapMs = Math.min(250, Math.max(90, Math.floor(remaining / gaps)))
  return { initialPause: CEEBO_HOOK_PAUSE_MS, gapMs }
}
