import { ProfileCard } from "@/components/profile-card"
import CTA from "@/components/cta"

export default function AboutPage() {
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
                About Us
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Meet the team behind Constructify, revolutionizing construction management through technology.
              </p>
            </div>

            <div className="mx-auto max-w-[50%] space-y-6">
              <ProfileCard
                name="Tim Hamilton"
                role="Chief Executive Officer"
                description="With over 25 years of experience in construction technology, Tim founded Constructify with a vision to transform how construction projects are managed. His expertise in construction has been instrumental in shaping our platform to match our clients' needs."
              />
              <ProfileCard
                name="Jeff Rogers"
                role="Chief Operating Officer"
                description="Jeff brings a unique blend of construction industry knowledge and product development expertise. Jeff leads our product team in creating intuitive solutions that address real construction challenges."
              />
              <ProfileCard
                name="Rob Hourigan"
                role="Chief Technology Officer"
                description="Rob is a seasoned software engineer with a passion for building scalable, reliable systems. His technical leadership ensures that Constructify's platform remains cutting-edge and performant."
              />
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