"use client"

import { CheckCircle2, XCircle } from "lucide-react"

const painPoints = [
  "Missed clock-ins leave your payroll full of guesswork",
  "Payroll disputes eating time, money, and trust",
  "No real visibility into where your field crews are",
  "Supervisors guessing instead of managing with data",
]

const solutions = [
  "Real-time clock-in/out tracked from any device, anywhere",
  "Automated records eliminate disputes before they start",
  "Live crew status and location — always current",
  "Supervisors get the data to lead, not just react",
]

export default function PainSolutionSection() {
  return (
    <section
      className="bg-white py-20 md:py-28"
      aria-labelledby="pain-solution-heading"
    >
      <div className="container mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Pain side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-600">
              The Problem
            </div>
            <h2
              id="pain-solution-heading"
              className="text-2xl font-black text-slate-900 sm:text-3xl mb-6 leading-tight"
            >
              What You&apos;re Dealing With Right Now
            </h2>
            <ul className="space-y-4">
              {painPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                    aria-hidden="true"
                  />
                  <span className="text-slate-700 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-700">
              The Fix
            </div>
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl mb-6 leading-tight">
              Constructify Fixes All of It
            </h2>
            <ul className="space-y-4">
              {solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <span className="text-slate-700 leading-relaxed">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
