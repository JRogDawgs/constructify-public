"use client"

import { useEffect } from "react"
import { YouTubeEmbed } from "@/components/YouTubeEmbed"
import { DEMO_ROLE_IDS, DEMO_VIDEOS } from "@/lib/demoVideos"

export default function RoleDemosSection() {
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const demo = params.get("demo")
    const valid =
      demo === "admin" || demo === "supervisor" || demo === "worker"
        ? demo
        : null

    if (window.location.hash === "#role-demos" || valid) {
      requestAnimationFrame(() => {
        const el = valid
          ? document.getElementById(`role-demo-${valid}`)
          : document.getElementById("role-demos")
        el?.scrollIntoView({ behavior: "smooth", block: "start" })
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

        <div className="mx-auto mt-14 max-w-4xl space-y-16 md:space-y-20">
          {DEMO_ROLE_IDS.map((role) => {
            const item = DEMO_VIDEOS[role]
            return (
              <div
                key={role}
                id={`role-demo-${role}`}
                className="scroll-mt-28"
              >
                <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-400 md:text-lg">
                  {item.subtitle}
                </p>
                <div className="mt-6">
                  <YouTubeEmbed
                    videoId={item.youtubeId}
                    title={`${item.title} — Constructify demo`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
