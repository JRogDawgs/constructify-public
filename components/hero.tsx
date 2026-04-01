"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight } from "lucide-react"
import { APP_BASE_URL } from "@/lib/appConfig"
import { cn } from "@/lib/utils"

const SALES_VIDEO_ID = "u_80ihIIxMQ"

function buildHeroEmbedSrc(): string {
  const p = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: SALES_VIDEO_ID,
    controls: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    showinfo: "0",
  })
  return `https://www.youtube.com/embed/${SALES_VIDEO_ID}?${p.toString()}`
}

function buildModalEmbedSrc(): string {
  const p = new URLSearchParams({
    autoplay: "1",
    mute: "0",
    controls: "1",
    modestbranding: "1",
    rel: "0",
  })
  return `https://www.youtube.com/embed/${SALES_VIDEO_ID}?${p.toString()}`
}

export default function Hero() {
  const { t } = useTranslation()
  const [embedSrc, setEmbedSrc] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setEmbedSrc(buildHeroEmbedSrc())
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const openSalesModal = useCallback(() => setModalOpen(true), [])
  const scrollToRoleDemos = () => {
    document.getElementById("role-demos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }

  return (
    <>
      <section
        className="relative flex min-h-[calc(100vh-3.5rem)] w-full flex-col justify-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background: YouTube (deferred) + poster while loading */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            {!embedSrc && (
              <img
                src={`https://img.youtube.com/vi/${SALES_VIDEO_ID}/maxresdefault.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            )}
            {embedSrc && (
              <iframe
                title="Constructify sales video"
                src={embedSrc}
                className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[100vw] min-w-[177.77vh] max-w-none -translate-x-1/2 -translate-y-1/2 border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )}
          </div>
          {/* Conversion overlay — rgba(0,0,0,0.35) */}
          <div
            className="hero-sales-video-overlay absolute inset-0 z-[1]"
            aria-hidden="true"
          />
          {/* Extra legibility on small screens */}
          <div
            className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-transparent to-black/30 sm:from-black/10 sm:to-black/25"
            aria-hidden="true"
          />
        </div>

        {/* CTA stack */}
        <div className="container relative z-10 mx-auto flex max-w-screen-2xl flex-col items-center px-4 py-10 text-center md:px-6 md:py-14">
          <div className="mb-6 flex flex-col items-center sm:mb-8">
            <img
              src="/images/3d logo.png"
              alt="Constructify"
              className="h-20 w-auto drop-shadow-2xl md:h-24"
            />
            <span className="mt-1 text-lg font-bold tracking-tight text-white/95 md:text-xl">
              Constructify
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>

          <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-white/95 drop-shadow sm:text-xl md:text-2xl">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex w-full max-w-lg flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <a
              href={`${APP_BASE_URL}/auth/signup`}
              target="_self"
              rel="noopener"
              className="inline-block rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 p-[6px] shadow-lg"
            >
              <Button
                size="lg"
                className="h-14 w-full min-w-[200px] border-0 bg-green-400 px-10 text-lg font-black uppercase tracking-wide text-constructify-navy hover:bg-green-500 sm:w-auto"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={() => {
                openSalesModal()
              }}
              className={cn(
                "h-14 border-white/40 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm",
                "hover:bg-white/20 hover:text-white"
              )}
            >
              {t("hero.ctaSecondary")}
            </Button>
          </div>

          <p className="mt-6 text-xs text-white/65">
            <button
              type="button"
              onClick={openSalesModal}
              className="font-medium underline decoration-white/40 underline-offset-2 hover:text-white"
            >
              {t("hero.videoFallback")}
            </button>
            {" · "}
            <button
              type="button"
              onClick={scrollToRoleDemos}
              className="underline decoration-white/40 underline-offset-2 hover:text-white"
            >
              {t("hero.moreDemosLink")}
            </button>
          </p>
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[90vh] w-[min(100vw-1rem,56rem)] max-w-none gap-0 overflow-hidden border border-slate-700 bg-black p-0 text-white sm:rounded-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Constructify — full demo</DialogTitle>
            <DialogDescription>
              Sales overview video with playback controls.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              title="Constructify sales video — full player"
              src={modalOpen ? buildModalEmbedSrc() : undefined}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
