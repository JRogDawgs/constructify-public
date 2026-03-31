"use client"

import { useCallback, useEffect, useState } from "react"
import { Play, X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  DEMO_ROLE_IDS,
  DEMO_VIDEOS,
  type DemoRoleId,
} from "@/lib/demoVideos"

export default function RoleDemosSection() {
  const [playing, setPlaying] = useState<DemoRoleId | null>(null)

  const handlePlay = useCallback((role: DemoRoleId) => {
    setPlaying(role)
  }, [])

  const handleStop = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaying(null)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    if (demo === "admin" || demo === "supervisor" || demo === "worker") {
      setPlaying(demo)
    }
    if (window.location.hash === "#role-demos" || demo) {
      requestAnimationFrame(() => {
        document.getElementById("role-demos")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    }
  }, [])

  return (
    <section
      id="role-demos"
      className="relative z-10 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-14 md:py-20"
      aria-labelledby="role-demos-heading"
    >
      <div className="container max-w-screen-2xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="role-demos-heading"
            className="text-3xl font-bold tracking-tight text-white md:text-4xl"
          >
            See It Working in Real Jobs
          </h2>
          <p className="mt-3 text-lg text-slate-300 md:text-xl">
            Watch how admins, supervisors, and workers actually use Constructify day to day.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Short walkthroughs. Real workflows. Share with your team in minutes.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-6xl px-2 md:px-10">
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {DEMO_ROLE_IDS.map((role) => {
                const item = DEMO_VIDEOS[role]
                const isPlaying = playing === role

                return (
                  <CarouselItem
                    key={role}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    {/* Silver gradient border wrapper */}
                    <div className="h-full rounded-2xl p-[2.5px] bg-gradient-to-br from-white via-slate-300 to-slate-400 shadow-[0_0_12px_rgba(200,210,220,0.25)]">
                    <article className="flex h-full flex-col overflow-hidden rounded-[14px] bg-slate-900">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                        {isPlaying ? (
                          <>
                            <iframe
                              className="absolute inset-0 h-full w-full border-0"
                              src={`https://www.youtube.com/embed/${item.youtubeId}?rel=0&autoplay=1`}
                              title={`${item.title} — Constructify demo`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                            <button
                              type="button"
                              onClick={handleStop}
                              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white transition hover:bg-slate-900"
                              aria-label="Close video"
                            >
                              <X className="h-4 w-4" aria-hidden />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePlay(role)}
                            className="group absolute inset-0 flex w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            aria-label={`Play ${item.title} demo video`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-slate-950/25 transition group-hover:bg-slate-950/40"
                              aria-hidden
                            >
                              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg transition group-hover:scale-105">
                                <Play
                                  className="ml-1 h-7 w-7"
                                  fill="currentColor"
                                  aria-hidden
                                />
                              </span>
                            </div>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 p-5">
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </article>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious
              variant="outline"
              className="left-0 top-[42%] border-slate-600 bg-slate-800/90 text-white hover:bg-slate-700 hover:text-white md:-left-4"
            />
            <CarouselNext
              variant="outline"
              className="right-0 top-[42%] border-slate-600 bg-slate-800/90 text-white hover:bg-slate-700 hover:text-white md:-right-4"
            />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
