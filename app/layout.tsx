import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/Google Auth/AuthContext"
import I18nProvider from "@/components/i18n-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Constructify - Cutting-Edge Software Solutions",
  description: "Constructify delivers innovative, high-performance software solutions for businesses of the future.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>
              <div className="relative min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <MouseMoveEffect />
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


