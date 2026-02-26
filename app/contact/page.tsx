import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, ArrowRight, MessageSquare, Users, Headphones } from "lucide-react"

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
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Ready to transform your construction projects? Let's discuss how Constructify can revolutionize your workflow and boost your productivity.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid gap-8 md:grid-cols-3 mb-16">
              {/* Phone */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-blue/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative text-center">
                  <Phone className="h-12 w-12 text-constructify-blue mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Call Us</h3>
                  <p className="text-base text-muted-foreground mb-4">
                    Speak directly with our construction experts
                  </p>
                  <a href="tel:+1-555-CONSTRUCT" className="text-constructify-blue hover:text-constructify-blue-dark font-semibold">
                    +1 (555) CONSTRUCT
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-gold/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative text-center">
                  <Mail className="h-12 w-12 text-constructify-gold mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Email Us</h3>
                  <p className="text-base text-muted-foreground mb-4">
                    Get detailed information and proposals
                  </p>
                  <a href="mailto:hello@constructify.com" className="text-constructify-gold hover:text-constructify-gold-dark font-semibold">
                    hello@constructify.com
                  </a>
                </div>
              </div>

              {/* Live Chat */}
              <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-navy/50 hover:shadow-2xl hover:scale-105 page-card">
                <div className="absolute inset-0 bg-gradient-to-br from-constructify-navy/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative text-center">
                  <MessageSquare className="h-12 w-12 text-constructify-navy mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h3 className="mb-3 text-xl font-medium text-foreground">Live Chat</h3>
                  <p className="text-base text-muted-foreground mb-4">
                    Instant support from our team
                  </p>
                  <span className="text-constructify-navy font-semibold">
                    Available 24/7
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 page-card">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">Send Us a Message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  <form className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" className="bg-white/5 border-white/20" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" className="bg-white/5 border-white/20" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@company.com" className="bg-white/5 border-white/20" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Your Construction Company" className="bg-white/5 border-white/20" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <select 
                        id="projectType" 
                        name="projectType"
                        title="Select your project type"
                        className="w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground"
                      >
                        <option value="">Select project type</option>
                        <option value="residential">Residential Construction</option>
                        <option value="commercial">Commercial Construction</option>
                        <option value="industrial">Industrial Construction</option>
                        <option value="infrastructure">Infrastructure</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us about your project and how we can help..."
                        className="bg-white/5 border-white/20 min-h-[120px]"
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                      Send Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Company Info & Office */}
              <div className="space-y-8">
                {/* Office Location */}
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 page-card">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-8 w-8 text-constructify-blue" />
                      <h2 className="text-2xl font-semibold text-foreground">Our Office</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-foreground mb-2">Headquarters</h3>
                        <p className="text-muted-foreground">
                          123 Construction Avenue<br />
                          Builder's District, CD 12345<br />
                          United States
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Mon-Fri: 8:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Choose Us */}
                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 page-card">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground">Why Choose Constructify?</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-6 w-6 text-constructify-gold mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-foreground">Expert Team</h3>
                          <p className="text-sm text-muted-foreground">Construction industry veterans with 20+ years experience</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Headphones className="h-6 w-6 text-constructify-blue mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-foreground">24/7 Support</h3>
                          <p className="text-sm text-muted-foreground">Round-the-clock assistance when you need it most</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <ArrowRight className="h-6 w-6 text-constructify-navy mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium text-foreground">Fast Implementation</h3>
                          <p className="text-sm text-muted-foreground">Get up and running in less than 48 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-blue/60 via-constructify-blue via-constructify-blue/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Ready to Get Started?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of construction professionals who trust Constructify to deliver exceptional results.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="https://app.constructifylabs.com/login" target="_self" rel="noopener">
                  <Button 
                    size="lg" 
                    className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 