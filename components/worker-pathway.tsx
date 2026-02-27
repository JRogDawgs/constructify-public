"use client"

import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { APP_BASE_URL } from "@/lib/appConfig"

export default function WorkerPathway() {
  return (
    <section
      className="bg-slate-100 py-20 md:py-24"
      aria-labelledby="worker-pathway-title"
    >
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <h2
          id="worker-pathway-title"
          className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl"
        >
          Are You a Field Worker?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-700 text-lg leading-relaxed">
          Create your Constructify worker profile. Track certifications, clock time, and stay job-ready.
        </p>
        <div className="mt-8">
          <a href={`${APP_BASE_URL}/auth/register`} target="_self" rel="noopener" className="inline-block p-[6px] rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-lg">
            <Button
              size="lg"
              className="font-semibold rounded-lg px-8 h-12 bg-green-400 hover:bg-green-500 text-constructify-navy border-0"
            >
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Create Worker Profile
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
