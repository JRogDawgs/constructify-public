import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Linkedin, Twitter } from "lucide-react"

// Enhanced profile card component with glassmorphism styling
const ProfileCard = ({ name, role, description }: { name: string, role: string, description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 hover:shadow-2xl hover:scale-105 page-card">
    <div className="absolute inset-0 bg-gradient-to-br from-constructify-blue/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="relative space-y-4">
      <div className="w-20 h-20 bg-gradient-to-br from-constructify-blue to-constructify-gold rounded-full mx-auto flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{name.split(' ').map(n => n[0]).join('')}</span>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">{name}</h3>
        <p className="text-sm text-constructify-gold font-medium uppercase tracking-wide">{role}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex justify-center space-x-4 pt-4">
        <div className="w-8 h-8 bg-constructify-blue/20 rounded-full flex items-center justify-center transition-colors hover:bg-constructify-blue/40">
          <Mail className="w-4 h-4 text-constructify-blue" />
        </div>
        <div className="w-8 h-8 bg-constructify-gold/20 rounded-full flex items-center justify-center transition-colors hover:bg-constructify-gold/40">
          <Linkedin className="w-4 h-4 text-constructify-gold" />
        </div>
        <div className="w-8 h-8 bg-constructify-navy/20 rounded-full flex items-center justify-center transition-colors hover:bg-constructify-navy/40">
          <Twitter className="w-4 h-4 text-constructify-navy" />
        </div>
      </div>
    </div>
  </div>
)

export default function AboutPage() {
  return (
    <div className="relative">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Background gradients matching home page */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-constructify-navy/10 blur-[100px]" />
          <div className="absolute top-1/2 left-1/4 h-[300px] w-[300px] bg-constructify-gold/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-constructify-blue/10 blur-[100px]" />
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
                About Us
              </h1>
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Meet the team behind Constructify, revolutionizing construction management through technology, innovation, and unwavering commitment to excellence.
              </p>
            </div>

            {/* Company Mission Section */}
            <div className="text-center space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At Constructify, we believe that construction is more than just building structures—it's about creating the foundation for communities, dreams, and the future. Our mission is to empower construction professionals with cutting-edge technology that simplifies complex projects, enhances collaboration, and delivers exceptional results every time.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Leadership Team</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our experienced leadership team combines decades of construction industry expertise with cutting-edge technology vision.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                <ProfileCard
                  name="Tim Hamilton"
                  role="Chief Executive Officer"
                  description="With over 25 years of experience in construction technology, Tim founded Constructify with a vision to transform how construction projects are managed. His expertise in construction operations and strategic leadership has been instrumental in shaping our platform to exceed our clients' expectations and industry standards."
                />
                <ProfileCard
                  name="Jeff Rogers"
                  role="Chief Operating Officer"
                  description="Jeff brings a unique blend of construction industry knowledge and product development expertise to Constructify. With a background in both field operations and technology innovation, Jeff leads our product team in creating intuitive solutions that address real construction challenges and drive operational efficiency."
                />
                <ProfileCard
                  name="Rob Hourigan"
                  role="Chief Technology Officer"
                  description="Rob is a seasoned software engineer with a passion for building scalable, reliable systems that power the construction industry. His technical leadership and architectural vision ensure that Constructify's platform remains cutting-edge, performant, and secure as we scale to serve construction professionals worldwide."
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
                  These principles guide everything we do and shape how we serve our construction community.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-2xl">🏗️</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Continuously pushing boundaries to deliver cutting-edge solutions</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-gold/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-gold font-bold text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Partnership</h3>
                  <p className="text-sm text-muted-foreground">Building lasting relationships with our clients and community</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-navy/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-navy font-bold text-2xl">⚡</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Excellence</h3>
                  <p className="text-sm text-muted-foreground">Delivering exceptional quality in everything we create</p>
                </div>

                <div className="text-center space-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-constructify-gold/50 page-card">
                  <div className="w-16 h-16 bg-constructify-blue/20 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-constructify-blue font-bold text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-foreground">Impact</h3>
                  <p className="text-sm text-muted-foreground">Creating meaningful change that transforms the industry</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 space-y-6 text-center">
              <div className="w-full max-w-2xl mx-auto">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-constructify-gold/60 via-constructify-gold via-constructify-gold/60 to-transparent animate-pulse shadow-sm"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Join Our Mission</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ready to be part of the construction technology revolution? Let's build the future together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-demo-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="font-black border-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-none px-8 text-lg h-14 uppercase tracking-wide relative overflow-hidden group navbar-auth-button"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-700"></div>
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 