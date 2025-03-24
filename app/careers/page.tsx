"use client"

import { Button } from "@/components/ui/button"
import CTA from "@/components/cta"
import { Mail } from "lucide-react"

export default function CareersPage() {
  const handleEmailClick = () => {
    window.location.href = "mailto:careers@constructify.com"
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Main Content Section with Video Background */}
      <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/90" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-12">
            {/* Header Section */}
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text pb-4 text-4xl font-medium tracking-tight text-transparent leading-[1.4] sm:text-5xl md:text-6xl lg:text-7xl">
                Join Our Team
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Help us revolutionize the construction industry with innovative technology solutions.
              </p>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-3xl space-y-12">
              {/* About Section */}
              <div className="rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Why Join Constructify?</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      At Constructify, we're building the future of construction management. Our team is dedicated to creating innovative solutions that transform how construction projects are planned, executed, and managed.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="font-medium">What We Offer</h3>
                        <ul className="list-disc pl-4 text-muted-foreground">
                          <li>Competitive compensation</li>
                          <li>Flexible work arrangements</li>
                          <li>Health and wellness benefits</li>
                          <li>Professional development</li>
                          <li>Modern tech stack</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">What We Value</h3>
                        <ul className="list-disc pl-4 text-muted-foreground">
                          <li>Innovation and creativity</li>
                          <li>Collaboration and teamwork</li>
                          <li>Customer-focused mindset</li>
                          <li>Continuous learning</li>
                          <li>Work-life balance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Openings */}
              <div className="rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">Current Openings</h2>
                  <p className="text-muted-foreground">
                    We're always looking for talented individuals to join our team. While we may not have specific positions listed at the moment, we encourage you to reach out if you're passionate about construction technology and want to make a difference.
                  </p>
                  <div className="space-y-4">
                    <h3 className="font-medium">Areas of Interest</h3>
                    <ul className="list-disc pl-4 text-muted-foreground">
                      <li>Software Development</li>
                      <li>Product Management</li>
                      <li>Customer Success</li>
                      <li>Sales and Marketing</li>
                      <li>Construction Technology</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="rounded-lg border bg-card p-8 shadow-sm">
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-semibold">Get in Touch</h2>
                  <p className="text-muted-foreground">
                    Interested in joining our team? Send us your resume and a brief introduction. We'd love to hear from you!
                  </p>
                  <Button 
                    onClick={handleEmailClick}
                    size="lg"
                    className="gap-2"
                  >
                    <Mail className="h-5 w-5" />
                    Contact Us
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Or email us directly at{" "}
                    <a 
                      href="mailto:careers@constructify.com" 
                      className="text-primary hover:underline"
                    >
                      careers@constructify.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative">
        <CTA />
      </div>
    </div>
  )
} 