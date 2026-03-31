"use client"

import { UserPlus2, ClipboardList, Activity } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus2,
    title: "Add Your Crew",
    description:
      "Onboard workers in minutes. Set roles, permissions, and certifications from the admin dashboard — no IT required.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Assign Work",
    description:
      "Supervisors assign jobs to workers or teams with a few taps. Everyone sees their tasks clearly before the shift starts.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Track Everything in Real Time",
    description:
      "Monitor clock-ins, job progress, and compliance automatically. No chasing. No guessing. Just data.",
  },
]

export default function HowItWorksSection() {
  return (
    <section
      className="bg-white py-20 md:py-28"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-14">
          <h2
            id="how-it-works-heading"
            className="text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl"
          >
            How It Works
          </h2>
          <p className="mt-4 text-slate-600 sm:text-lg">
            Up and running in minutes. Not months.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step connector — visible on md+ screens */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gradient-to-r from-slate-300 to-slate-200"
                    aria-hidden="true"
                  />
                )}

                {/* Icon badge */}
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
