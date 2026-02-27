"use client"

import { Button } from "@/components/ui/button"
import { APP_BASE_URL } from "@/lib/appConfig"

export default function CTA() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
          <img
            alt="Construction"
            src="/images/construction.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="lg:py-24">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to streamline your construction projects?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Experience how our platform can transform your construction management process.
          </p>

          <a href={`${APP_BASE_URL}/auth/create-company`} target="_self" rel="noopener">
            <Button size="lg" className="mt-8">
              Get Started
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

