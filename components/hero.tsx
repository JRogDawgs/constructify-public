import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
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
        <div className="flex gap-4">
          <Link href="/solutions">
            <Button size="lg">
              Explore Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  )
}

