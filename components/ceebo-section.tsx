"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Bot } from "lucide-react"

export default function CeeboSection() {
  const scrollToCeebo = useCallback(() => {
    const ceeboButton = document.querySelector('[aria-label="Ceebo AI Assistant"]') as HTMLButtonElement
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
          Meet Ceebo — Your AI Operations Assistant
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-700 text-lg leading-relaxed">
          Ask questions. Check compliance. Review schedules. Get answers instantly.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            onClick={scrollToCeebo}
            className="font-semibold rounded-lg px-8 h-12 bg-constructify-blue hover:bg-constructify-blue/90 text-white"
            aria-label="Open Ceebo AI Assistant"
          >
            <Bot className="mr-2 h-5 w-5" aria-hidden="true" />
            Try Ceebo
          </Button>
        </div>
      </div>
    </section>
  )
}
