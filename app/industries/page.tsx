import { Button } from "@/components/ui/button"
import Link from "next/link"
import { APP_BASE_URL } from "@/lib/appConfig"
import { ArrowRight, Home, Building2, Factory, HardHat, Construction, GraduationCap } from "lucide-react"

export default function IndustriesPage() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Background gradients matching home page */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-constructify-gold/10 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] bg-constructify-blue/10 blur-[80px]" />
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
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-12">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                Industries We Serve
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                From residential homes to large-scale infrastructure projects, we provide comprehensive solutions tailored to your industry needs with proven expertise and cutting-edge technology.
              </p>
            </div>

            {/* Industries Grid with enhanced styling */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Residential Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Home className="h-12 w-12 text-constructify-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Residential Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Custom homes, multi-family developments, and residential renovations with a focus on quality, comfort, and sustainable living solutions.
                  </p>
                </div>
              </div>

              {/* Commercial Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-gold/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Building2 className="h-12 w-12 text-constructify-gold mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Commercial Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Office buildings, retail spaces, and commercial facilities designed for optimal business operations and customer experiences.
                  </p>
                </div>
              </div>

              {/* Industrial Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Factory className="h-12 w-12 text-constructify-navy mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Industrial Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Manufacturing facilities, warehouses, and industrial complexes built for efficiency, durability, and operational excellence.
                  </p>
                </div>
              </div>

              {/* Infrastructure Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <HardHat className="h-12 w-12 text-constructify-blue mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Infrastructure Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Roads, bridges, and public utilities that connect and serve communities with lasting impact and reliability.
                  </p>
                </div>
              </div>

              {/* Heavy Civil Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-gold/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <Construction className="h-12 w-12 text-constructify-gold mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Heavy Civil Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Large-scale civil engineering projects including dams, airports, and major transportation systems that shape our world.
                  </p>
                </div>
              </div>

              {/* Institutional Construction */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <GraduationCap className="h-12 w-12 text-constructify-navy mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Institutional Construction</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Educational facilities, healthcare buildings, and government structures built to serve public needs with excellence and integrity.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Ready to Transform Your Industry?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of construction professionals who trust Constructify to deliver exceptional results across all sectors.
                </p>
              </div>
              <div className="flex justify-center">
                <a href={`${APP_BASE_URL}/auth/company-signup`} target="_self" rel="noopener">
                  <Button
                    size="lg"
                    className="font-black border-2 border-constructify-navy shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 