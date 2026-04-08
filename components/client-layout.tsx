'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import I18nProvider from '@/components/i18n-provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CeeboPlaceholder from '@/components/ceebo-placeholder'
import MouseMoveEffect from '@/components/mouse-move-effect'
import { Toaster } from 'sonner'

function useProcoreEmbedShell(): boolean {
  const pathname = usePathname()
  return pathname === '/procore' || pathname.startsWith('/procore/')
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const procoreShell = useProcoreEmbedShell()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative min-h-screen flex flex-col">
        <div className={procoreShell ? 'h-0' : 'h-24'} />
        <main className={`flex-1 ${procoreShell ? 'pt-4' : 'pt-24'}`}>
          {children}
        </main>
        {!procoreShell && <div className="h-64" />}
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
        <div className="relative min-h-screen flex flex-col">
          {!procoreShell && <Navbar />}
          <main className={`flex-1 ${procoreShell ? 'pt-4' : 'pt-24'}`}>
            {!procoreShell && <MouseMoveEffect />}
            {children}
          </main>
          {!procoreShell && <Footer />}
        </div>
        {!procoreShell && <CeeboPlaceholder />}
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  )
}

