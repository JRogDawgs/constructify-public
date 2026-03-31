"use client"

import { UserPlus2, ClipboardList, Activity } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus2,
    title: "Add Your Crew",
    description:
      "Set up workers, roles, and certifications in minutes. No IT needed. No long onboarding.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Assign Work",
    description:
      "Supervisors assign jobs clearly before the shift starts. Every worker knows exactly what to do.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Track Everything",
    description:
      "Clock-ins, tasks, and progress — all in real time. No chasing. No guessing.",
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
            Get Up and Running Fast
          </h2>
          <p className="mt-4 text-slate-600 sm:text-lg">
            Three steps. Minutes to set up. Immediate results.
          </p>
          <p className="mt-2 text-sm font-bold text-amber-600 uppercase tracking-widest">
            Set up today. Run better tomorrow.
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
