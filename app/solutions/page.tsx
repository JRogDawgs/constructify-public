import { Button } from "@/components/ui/button"
import CTA from "@/components/cta"

export default function SolutionsPage() {
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
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                Our Solutions
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Discover how our comprehensive suite of tools and services can transform your construction projects.
              </p>
            </div>

            {/* Solutions Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Project Management */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Project Management</h3>
                <p className="mt-2 text-muted-foreground">
                  Streamline your construction projects with our intuitive project management platform.
                </p>
              </div>

              {/* Safety Compliance */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Safety Compliance</h3>
                <p className="mt-2 text-muted-foreground">
                  Ensure workplace safety with our comprehensive safety management and compliance tools.
                </p>
              </div>

              {/* Resource Planning */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Resource Planning</h3>
                <p className="mt-2 text-muted-foreground">
                  Optimize resource allocation and scheduling with our advanced planning tools.
                </p>
              </div>

              {/* Quality Control */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Quality Control</h3>
                <p className="mt-2 text-muted-foreground">
                  Maintain high standards with our quality control and inspection management system.
                </p>
              </div>

              {/* Cost Management */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Cost Management</h3>
                <p className="mt-2 text-muted-foreground">
                  Track and optimize project costs with our comprehensive financial management tools.
                </p>
              </div>

              {/* Analytics & Reporting */}
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
                <h3 className="text-2xl font-semibold">Analytics & Reporting</h3>
                <p className="mt-2 text-muted-foreground">
                  Make data-driven decisions with our powerful analytics and reporting capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section without video background */}
      <div className="relative">
        <CTA />
      </div>
    </div>
  )
} 