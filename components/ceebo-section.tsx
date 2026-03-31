"use client"

import { useCallback } from "react"
import Image from "next/image"

export default function CeeboSection() {
  const openCeebo = useCallback(() => {
    const ceeboButton = document.querySelector(
      '[aria-label="Ceebo AI Assistant"]'
    ) as HTMLButtonElement | null
    ceeboButton?.click()
  }, [])

  return (
    <section
      className="bg-slate-50 py-20 md:py-24"
      aria-labelledby="ceebo-section-title"
    >
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <h2
          id="ceebo-section-title"
          className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl"
        >
          Meet Ceebo — Your AI Assistant
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-700 text-lg leading-relaxed">
          Ask questions. Check schedules. Get answers instantly.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Try Ceebo
          </p>
          <button
            type="button"
            onClick={openCeebo}
            className="rounded-full p-1 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-constructify-blue focus-visible:ring-offset-4"
            aria-label="Open Ceebo AI Assistant"
          >
            <Image
              src="/images/Ceebo.png"
              alt=""
              width={120}
              height={120}
              className="h-24 w-24 md:h-[120px] md:w-[120px]"
              priority
            />
          </button>
        </div>
      </div>
    </section>
  )
}
