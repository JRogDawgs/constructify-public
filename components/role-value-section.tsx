"use client"

import { BarChart3, Users, HardHat } from "lucide-react"

const roles = [
  {
    icon: BarChart3,
    role: "Admin",
    headline: "Run the entire operation from one system.",
    color: "text-blue-600",
    iconBg: "bg-blue-50",
    borderColor: "border-blue-200",
    cardBg: "bg-blue-50/40",
    benefits: [
      "See all crews, jobs, and activity instantly",
      "Manage everything without spreadsheets",
      "Get real-time reporting without digging",
    ],
  },
  {
    icon: Users,
    role: "Supervisor",
    headline: "Know exactly what's happening on your jobs.",
    color: "text-amber-600",
    iconBg: "bg-amber-50",
    borderColor: "border-amber-200",
    cardBg: "bg-amber-50/40",
    benefits: [
      "Assign work clearly before the shift starts",
      "Track crews in real time",
      "Hold teams accountable without chasing",
    ],
  },
  {
    icon: HardHat,
    role: "Worker",
    headline: "Know your job. Get it done. Move on.",
    color: "text-green-600",
    iconBg: "bg-green-50",
    borderColor: "border-green-200",
    cardBg: "bg-green-50/40",
    benefits: [
      "Clear daily tasks",
      "Fast mobile clock-in/out",
      "Track hours and certifications easily",
    ],
  },
]

export default function RoleValueSection() {
  return (
    <section
      className="bg-slate-50 py-20 md:py-28"
      aria-labelledby="role-value-heading"
    >
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2
            id="role-value-heading"
            className="text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl leading-tight"
          >
            Every Role. Fully Under Control.
          </h2>
          <p className="mt-4 text-slate-600 sm:text-lg max-w-2xl mx-auto">
            Everyone knows exactly what to do, when to do it, and where to be.
            No confusion. No overlap. No chasing.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.role}
                className={`rounded-2xl border ${role.borderColor} ${role.cardBg} p-8 transition-shadow hover:shadow-md`}
              >
                <div className="mb-5">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${role.iconBg} shadow-sm`}
                  >
                    <Icon className={`h-6 w-6 ${role.color}`} aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{role.role}</h3>
                <p className={`text-sm font-bold mb-5 ${role.color}`}>{role.headline}</p>
                <ul className="space-y-2.5">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${role.color.replace("text-", "bg-")}`}
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="mt-12 text-center text-lg font-semibold text-slate-600">
          No confusion. No overlap. No chasing.
        </p>
      </div>
    </section>
  )
}
