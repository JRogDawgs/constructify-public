"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import DemoModal from "./demo-modal"

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = useCallback(() => setIsModalOpen(true), [])
  const handleModalClose = useCallback(() => setIsModalOpen(false), [])

  return (
    <>
      <section className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden" aria-label="Hero section">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="/images/construction-bg-poster.jpg"
            preload="auto"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
            <p>Your browser does not support the video tag.</p>
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              Constructify
              <br />
              <span className="text-[54%] font-light">Safer.&nbsp;&nbsp;&nbsp;Faster.&nbsp;&nbsp;&nbsp;Better.</span>
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Empowering businesses with cutting-edge software solutions. From AI-driven analytics to seamless project
              management, we're shaping the future of construction.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/solutions">
              <Button size="lg" className="w-full sm:w-auto">
                Explore Solutions
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleModalOpen}
              className="w-full sm:w-auto"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <DemoModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
      />
    </>
  )
}

