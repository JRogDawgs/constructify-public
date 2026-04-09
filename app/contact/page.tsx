import { Button } from "@/components/ui/button"
import Link from "next/link"
import { APP_BASE_URL } from "@/lib/appConfig"
import { ContactForm } from "./ContactForm"
import { Card } from "@/components/ui/card"
import { ArrowRight, Users, Bot, Zap } from "lucide-react"
import PageBackdrop from "@/components/page-backdrop"

export default function ContactPage() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <PageBackdrop />

        {/* Content */}
        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                Let&apos;s Get Your Operation Under Control
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-foreground/90 sm:text-xl sm:leading-8">
                Tell us about your team. We&apos;ll show you exactly what Constructify looks like for your operation.
              </p>
              <p className="mx-auto max-w-[36rem] text-amber-500 font-semibold text-base sm:text-lg">
                If your crews aren&apos;t dialed in, you&apos;re losing money. Let&apos;s fix that.
              </p>
            </div>

            {/* Contact Form - Centered */}
            <div className="mx-auto max-w-2xl">
              <Card className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 page-card">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Send Us a Message</h2>
                    <p className="text-foreground/80">
                      Fill out the form below and we&apos;ll get back to you within 24 hours.
                    </p>
                  </div>

                  <ContactForm />

                  <div className="text-center text-sm text-muted-foreground mt-6">
                    Prefer direct email? Contact us at{" "}
                    <a
                      href="mailto:support@ConstructifyLabs.com"
                      className="font-medium text-primary hover:underline"
                    >
                      support@ConstructifyLabs.com
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div className="max-w-4xl mx-auto">
              <Card className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-constructify-navy p-8 page-card">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-foreground">Why Choose Constructify?</h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-6 w-6 text-constructify-gold mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">Expert Team</h3>
                        <p className="text-sm text-foreground/80">Built by people who understand construction, not just software</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Bot className="h-6 w-6 text-constructify-blue mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">AI Support via Ceebo</h3>
                        <p className="text-sm text-foreground/80">Ask Ceebo anything — scheduling, compliance, navigation — and get an answer fast.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-constructify-navy mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">Fast Implementation</h3>
                        <p className="text-sm text-foreground/80">Up and running in under 48 hours — no IT, no long onboarding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Stop Losing Money. Start Today.</h2>
                <p className="text-foreground/80 max-w-2xl mx-auto">
                  Get set up in minutes. Immediate visibility across your jobs.
                </p>
              </div>
              <div className="flex justify-center">
                <a href={`${APP_BASE_URL}/auth/signup`} target="_self" rel="noopener" className="inline-block p-[6px] rounded-xl bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-lg">
                  <Button
                    size="lg"
                    className="font-black px-8 text-lg h-14 uppercase tracking-wide bg-green-400 hover:bg-green-500 text-constructify-navy border-0 rounded-lg"
                  >
                    Get Control Today
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
