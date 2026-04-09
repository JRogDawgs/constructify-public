"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { APP_BASE_URL } from "@/lib/appConfig"

interface MidCTASectionProps {
  headline: string
  subtext: string
  ctaLabel?: string
  /** Amber emphasis line; omit or pass empty string to hide */
  emphasis?: string
  /** Small italic line under emphasis; omit or pass empty string to hide */
  footnote?: string
}

export default function MidCTASection({
  headline,
  subtext,
  ctaLabel = "Get Control Today",
  emphasis = "You're already paying for inefficiency. This fixes it.",
  footnote = "Doing nothing is what keeps costing you.",
}: MidCTASectionProps) {
  return (
    <section className="bg-slate-900 py-16 md:py-20" aria-label="Call to action">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-black text-white sm:text-3xl md:text-4xl leading-tight">
          {headline}
        </h2>
        <p className="mt-4 text-slate-300 text-lg max-w-xl mx-auto">{subtext}</p>
        {emphasis ? (
          <p className="mt-3 text-sm font-bold text-amber-400 uppercase tracking-widest">
            {emphasis}
          </p>
        ) : null}
        {footnote ? (
          <p className="mt-1 text-xs text-slate-500 italic">{footnote}</p>
        ) : null}
        <div className="mt-8">
          <a
            href={`${APP_BASE_URL}/auth/signup`}
            target="_self"
            rel="noopener"
            className="inline-block p-[6px] rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-lg"
          >
            <Button
              size="lg"
              className="font-black px-10 text-lg h-14 uppercase tracking-wide bg-green-400 hover:bg-green-500 text-constructify-navy border-0 rounded-lg"
            >
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
