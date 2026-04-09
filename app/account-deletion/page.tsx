import CTA from "@/components/cta"
import PageBackdrop from "@/components/page-backdrop"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Delete Your Constructify Account | Constructify Labs",
  description:
    "Request deletion of your Constructify account and associated personal data by contacting Constructify Labs support.",
}

export default function AccountDeletionPage() {
  return (
    <div className="relative min-h-screen w-full">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <PageBackdrop />

        <div className="container relative z-10 mx-auto max-w-screen-2xl py-24 md:py-32">
          <div className="space-y-8">
            <div className="space-y-6 text-center">
              <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text pb-4 text-4xl font-medium tracking-tight text-transparent leading-[1.4] sm:text-5xl md:text-6xl">
                Delete Your Constructify Account
              </h1>
              <p className="mx-auto max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                You may request deletion of your Constructify account and associated personal data. We will process
                verified requests as described below.
              </p>
            </div>

            <div className="mx-auto max-w-2xl space-y-6 text-muted-foreground">
              <p>
                To request account deletion, email{" "}
                <a
                  href="mailto:support@constructifylabs.com"
                  className="text-primary underline underline-offset-4 font-medium text-foreground"
                >
                  support@constructifylabs.com
                </a>
                . Please include your full name, email address, company name, and any details that help us locate your
                account (for example, the email you use to sign in).
              </p>
              <p>
                We aim to process complete, verifiable requests within <strong className="text-foreground">48 hours</strong>.
              </p>
              <p className="text-sm leading-relaxed border-l-4 border-muted-foreground pl-4">
                Certain records may need to be retained where required for legal, regulatory, compliance, or billing
                purposes. In those cases, we will delete or anonymize personal data to the extent permitted by law and
                retain only limited information necessary to meet those obligations.
              </p>
              <p className="text-sm text-center pt-2">
                <a href="/privacy" className="text-primary underline underline-offset-4">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <CTA />
      </div>
    </div>
  )
}
