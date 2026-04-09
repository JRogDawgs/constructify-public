import { Button } from "@/components/ui/button"
import Link from "next/link"
import { APP_BASE_URL } from "@/lib/appConfig"
import { ArrowRight, type LucideIcon, Rocket, Handshake, Lightbulb } from "lucide-react"
import PageBackdrop from "@/components/page-backdrop"

const ProfileCard = ({
  name,
  role,
  description,
  icon: Icon,
}: {
  name: string
  role: string
  description: string
  icon: LucideIcon
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
    <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="relative space-y-4">
      <div
        className="w-20 h-20 bg-gradient-to-br from-constructify-blue to-constructify-gold rounded-full mx-auto flex items-center justify-center transition-transform group-hover:scale-105"
        aria-hidden
      >
        <Icon className="h-9 w-9 text-white" strokeWidth={1.75} />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-constructify-gold font-medium uppercase tracking-wide">{role}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
)

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <PageBackdrop />

        {/* Content */}
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-12">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                About Us
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                We built Constructify because we saw what bad systems cost construction companies — in time, money, and people. Here&apos;s the team fixing it.
              </p>
            </div>

            {/* Company Mission Section */}
            <div className="text-center space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Construction companies lose thousands every month to bad data, missed clock-ins, and payroll disputes. We built Constructify to fix that — with tools that are practical, fast to set up, and built specifically for how construction actually runs. Our mission is simple: give every person on the job site the information they need to do their job right.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Leadership Team</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  People who&apos;ve worked in construction, lived with the problems, and built the tools to solve them.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                <ProfileCard
                  name="Tim Hamilton"
                  role="Founder"
                  icon={Rocket}
                  description="Tim has spent 25+ years inside construction operations. He founded Constructify after watching companies lose money daily to systems that weren't built for the field. He built the platform he always wished existed."
                />
                <ProfileCard
                  name="Jeff Rogers"
                  role="Founder"
                  icon={Handshake}
                  description="Jeff has worked both in the field and in operations management. He leads the product side of Constructify with one question in mind: does this actually make a foreman's job easier? If not, it doesn't ship."
                />
                <ProfileCard
                  name="Rob Hourigan"
                  role="Founder"
                  icon={Lightbulb}
                  description="Rob builds systems that work in the real world — fast, reliable, and secure. He makes sure Constructify performs whether you have 5 workers or 500, and that your data is never at risk."
                />
              </div>
            </div>

            {/* Values Section */}
            <div className="space-y-8">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Our Core Values</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  How we make decisions and what we hold ourselves to.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-2xl">🏗️</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Build tools that actually move the needle for people doing real work</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-gold/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-gold font-bold text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Partnership</h3>
                  <p className="text-sm text-muted-foreground">Your success is ours. We win when your operation runs better</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-navy/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-navy font-bold text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Excellence</h3>
                  <p className="text-sm text-muted-foreground">No half-built features. No cutting corners. It works or it doesn&apos;t ship</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Impact</h3>
                  <p className="text-sm text-muted-foreground">Every feature should save you time, money, or stress. If it doesn&apos;t, we cut it</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Ready to Run a Tighter Operation?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get set up in minutes. See what Constructify looks like for your crew size.
                </p>
              </div>
              <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
                <a
                  href={`${APP_BASE_URL}/auth/signup`}
                  target="_self"
                  rel="noopener"
                  className="min-w-0 flex-1 block w-full"
                >
                  <Button
                    size="lg"
                    className="h-14 w-full font-black uppercase tracking-wide shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden rounded-none border-2 border-constructify-navy px-8 text-lg navbar-demo-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    Get Control Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <div className="min-w-0 flex-1 w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full font-black uppercase tracking-wide shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden rounded-none border-2 border-constructify-navy px-8 text-lg navbar-auth-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    See It In Action
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 