'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/components/Google Auth/AuthContext'
import I18nProvider from '@/components/i18n-provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CeeboPlaceholder from '@/components/ceebo-placeholder'
import MouseMoveEffect from '@/components/mouse-move-effect'
import { Toaster } from 'sonner'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <div className="h-24" />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <div className="h-64" />
      </div>
    )
  }

  return (
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
            <main className="flex-1 pt-24">
              <MouseMoveEffect />
              {children}
            </main>
            <Footer />
          </div>
          <CeeboPlaceholder />
          <Toaster />
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

