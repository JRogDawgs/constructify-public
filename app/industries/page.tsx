import { Button } from "@/components/ui/button"
import CTA from "@/components/cta"

export default function IndustriesPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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
              Industries We Serve
            </h1>
            <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              From residential homes to large-scale infrastructure projects, we provide comprehensive solutions tailored to your industry needs.
            </p>
          </div>

          {/* Industries Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Residential Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Residential Construction</h3>
                <p className="text-base text-muted-foreground">
                  Custom homes, multi-family developments, and residential renovations with a focus on quality and comfort.
                </p>
              </div>
            </div>

            {/* Commercial Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Commercial Construction</h3>
                <p className="text-base text-muted-foreground">
                  Office buildings, retail spaces, and commercial facilities designed for optimal business operations.
                </p>
              </div>
            </div>

            {/* Industrial Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Industrial Construction</h3>
                <p className="text-base text-muted-foreground">
                  Manufacturing facilities, warehouses, and industrial complexes built for efficiency and durability.
                </p>
              </div>
            </div>

            {/* Infrastructure Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Infrastructure Construction</h3>
                <p className="text-base text-muted-foreground">
                  Roads, bridges, and public utilities that connect and serve communities.
                </p>
              </div>
            </div>

            {/* Heavy Civil Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Heavy Civil Construction</h3>
                <p className="text-base text-muted-foreground">
                  Large-scale civil engineering projects including dams, airports, and major transportation systems.
                </p>
              </div>
            </div>

            {/* Institutional Construction */}
            <div className="group relative overflow-hidden rounded-lg bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <h3 className="mb-2 text-xl font-medium">Institutional Construction</h3>
                <p className="text-base text-muted-foreground">
                  Educational facilities, healthcare buildings, and government structures built to serve public needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <CTA />
      </div>
    </div>
  )
} 