"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

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
          <Link href="/signup?type=worker" target="_self" rel="noopener">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold rounded-lg px-8 h-12 border-2 border-constructify-blue text-constructify-blue hover:bg-constructify-blue hover:text-white"
            >
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              Create Worker Profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
