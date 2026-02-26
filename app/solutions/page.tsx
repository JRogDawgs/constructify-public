"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { APP_BASE_URL } from "@/lib/appConfig"
import { useEffect } from "react"
import { ArrowRight, CheckCircle, Settings, BarChart3, Shield, DollarSign } from "lucide-react"

export default function SolutionsPage() {
  // Handle smooth scrolling to anchor links
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Background gradients matching home page */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-constructify-blue/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] bg-constructify-gold/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-constructify-navy/10 blur-[100px]" />
        </div>

        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src="/videos/construction-bg.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="container relative z-10 flex max-w-screen-2xl flex-col items-center justify-center space-y-12 py-24 text-center md:py-32">
          <div className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                Our Solutions
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Discover how our comprehensive suite of tools and services can transform your construction projects with cutting-edge technology and proven methodologies.
              </p>
            </div>

            {/* Solutions Grid with enhanced styling */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project Management */}
              <div 
                id="project-management"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Settings className="h-12 w-12 text-constructify-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Project Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Real-time collaboration and progress tracking across all job sites.
                  </p>
                </div>
              </div>

              {/* Safety Compliance */}
              <div 
                id="safety-compliance"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-gold/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Shield className="h-12 w-12 text-constructify-gold mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Real-Time Safety & OSHA Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Compliance tools and certifications with automated renewal alerts.
                  </p>
                </div>
              </div>

              {/* Resource Planning */}
              <div 
                id="resource-planning"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <BarChart3 className="h-12 w-12 text-constructify-navy mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Built-In Workforce Scheduling</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    AI-driven resource allocation and forecasting across projects.
                  </p>
                </div>
              </div>

              {/* Quality Control */}
              <div 
                id="quality-control"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <CheckCircle className="h-12 w-12 text-constructify-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Integrated Quality & Inspection Management</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Automated reporting and compliance tracking for inspections.
                  </p>
                </div>
              </div>

              {/* Cost Management */}
              <div 
                id="cost-management"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-gold/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <DollarSign className="h-12 w-12 text-constructify-gold mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">Integrated Time & Payroll Logging</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Budget forecasting, expense tracking, and payroll integration.
                  </p>
                </div>
              </div>

              {/* Analytics & Reporting */}
              <div 
                id="analytics"
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <BarChart3 className="h-12 w-12 text-constructify-navy mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">AI-Powered Project Insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Customizable dashboards and data-driven decision support.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href={`${APP_BASE_URL}/signup?type=company`} target="_self" rel="noopener">
                  <Button 
                    size="lg" 
                    className="font-black border-2 border-constructify-navy shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-black border-2 border-constructify-navy shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 