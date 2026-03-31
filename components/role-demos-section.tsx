"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  DEMO_ROLE_IDS,
  DEMO_VIDEOS,
  getDemoVideoSrc,
  type DemoRoleId,
} from "@/lib/demoVideos"

export default function RoleDemosSection() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<DemoRoleId | null>(null)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleOpen = useCallback((role: DemoRoleId) => {
    setActive(role)
    setOpen(true)
  }, [])

  const handleClose = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) {
      videoRef.current?.pause()
      setActive(null)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    if (
      demo === "admin" ||
      demo === "supervisor" ||
      demo === "worker"
    ) {
      setActive(demo)
      setOpen(true)
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

  useEffect(() => {
    if (!open) {
      videoRef.current?.pause()
      return
    }
    setVideoError(false)
    const v = videoRef.current
    if (!v || !active) return
    v.load()
    void v.play().catch(() => {
      /* autoplay may be blocked until user gesture — controls still work */
    })
  }, [open, active])

  const activeEntry = active ? DEMO_VIDEOS[active] : null
  const activeVideoSrc = active ? getDemoVideoSrc(active) : null

  return (
    <>
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
              See Constructify in Action
            </h2>
            <p className="mt-3 text-lg text-slate-300 md:text-xl">
              Explore how every role operates inside Constructify — from admin to the field.
              Real workflows. Real accountability. Built for how construction actually runs.
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Short demos you can watch now and share with your team in minutes.
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
                  return (
                    <CarouselItem
                      key={role}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/40 shadow-lg backdrop-blur-sm">
                        <button
                          type="button"
                          onClick={() => handleOpen(role)}
                          className="group relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                          aria-label={`Play ${item.title} demo video`}
                        >
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                            <Image
                              src={item.thumbnailPath}
                              alt=""
                              fill
                              className="object-cover transition duration-300 group-hover:scale-[1.02]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              priority={role === "admin"}
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
                          </div>
                        </button>
                        <div className="flex flex-1 flex-col gap-1 p-5">
                          <h3 className="text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-slate-400">
                            {item.subtitle}
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3 w-fit border-slate-600 bg-slate-800/80 text-white hover:bg-slate-700 hover:text-white"
                            onClick={() => handleOpen(role)}
                          >
                            Watch demo
                          </Button>
                        </div>
                      </article>
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

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] w-[min(100vw-2rem,56rem)] max-w-none gap-0 overflow-hidden border border-slate-700 bg-black p-0 text-white sm:rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {activeEntry
                ? `${activeEntry.title} demo — Constructify`
                : "Product demo"}
            </DialogTitle>
            {activeEntry && (
              <DialogDescription>
                Short walkthrough of the {activeEntry.title} experience in
                Constructify.
              </DialogDescription>
            )}
          </DialogHeader>
          {activeEntry && activeVideoSrc && (
            <div className="relative aspect-video w-full bg-black">
              {videoError ? (
                <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                  <p className="text-sm text-slate-300">
                    This video could not be loaded. The app is requesting:{" "}
                    <code className="break-all rounded bg-slate-800 px-1.5 py-0.5 text-xs text-amber-200">
                      {activeVideoSrc}
                    </code>
                  </p>
                  <p className="text-xs text-slate-500">
                    Files over 100MB cannot be pushed to GitHub — use Git LFS, or host MP4s on a CDN and
                    set{" "}
                    <code className="text-slate-400">NEXT_PUBLIC_DEMO_VIDEO_*_URL</code> in Vercel.
                    Rename local files to{" "}
                    <code className="text-slate-400">admin-dashboard.mp4</code> (etc.) under{" "}
                    <code className="text-slate-400">public/videos/demos/</code>.
                  </p>
                  <a
                    href={activeVideoSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
                  >
                    Open video URL directly
                  </a>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  key={activeVideoSrc}
                  className="h-full w-full"
                  controls
                  playsInline
                  preload="auto"
                  onError={() => setVideoError(true)}
                  onLoadedData={() => setVideoError(false)}
                >
                  <source src={activeVideoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {activeEntry && (
            <div className="border-t border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-sm font-medium text-white">{activeEntry.title}</p>
              <p className="text-xs text-slate-400">{activeEntry.subtitle}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
