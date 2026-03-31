"use client"

import { cn } from "@/lib/utils"

export type YouTubeEmbedProps = {
  videoId: string
  title?: string
  className?: string
}

/**
 * Responsive 16:9 YouTube iframe (embed origin only).
 */
export function YouTubeEmbed({ videoId, title = "Constructify demo", className }: YouTubeEmbedProps) {
  const src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0`

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-slate-700 bg-black shadow-lg",
        "aspect-video",
        className
      )}
    >
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
