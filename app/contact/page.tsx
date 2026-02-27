import { Button } from "@/components/ui/button"
import Link from "next/link"
import { APP_BASE_URL } from "@/lib/appConfig"
import { ContactForm } from "./ContactForm"
import { Card } from "@/components/ui/card"
import { ArrowRight, Users, Bot, Zap } from "lucide-react"

export default function ContactPage() {
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
            {/* Header */}
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
                Get In Touch
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-foreground/90 sm:text-xl sm:leading-8">
                Ready to transform your construction projects? Let&apos;s discuss how Constructify can streamline your workflow.
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
                        <p className="text-sm text-foreground/80">Construction industry veterans with 20+ years experience</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Bot className="h-6 w-6 text-constructify-blue mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">AI Support via Ceebo</h3>
                        <p className="text-sm text-foreground/80">Instant operational assistance powered by Constructify&apos;s AI agent.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Zap className="h-6 w-6 text-constructify-navy mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">Fast Implementation</h3>
                        <p className="text-sm text-foreground/80">Get up and running in less than 48 hours</p>
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
                <h2 className="text-2xl font-semibold text-foreground">Ready to Get Started?</h2>
                <p className="text-foreground/80 max-w-2xl mx-auto">
                  Join thousands of construction professionals who trust Constructify to deliver exceptional results.
                </p>
              </div>
              <div className="flex justify-center">
                <a href={`${APP_BASE_URL}/auth/create-company`} target="_self" rel="noopener">
                  <Button
                    size="lg"
                    className="font-black border-2 border-constructify-navy shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    Get Started
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
