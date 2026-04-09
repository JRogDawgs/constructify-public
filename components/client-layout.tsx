'use client'

import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import I18nProvider from '@/components/i18n-provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CeeboPlaceholder from '@/components/ceebo-placeholder'
import MouseMoveEffect from '@/components/mouse-move-effect'
import { Toaster } from 'sonner'
import { isMarketingPath } from '@/lib/marketingTheme'

function useProcoreEmbedShell(): boolean {
  const pathname = usePathname()
  return pathname === '/procore' || pathname.startsWith('/procore/')
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const procoreShell = useProcoreEmbedShell()
  const forceMarketingDark = isMarketingPath(pathname)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forceMarketingDark ? 'dark' : undefined}
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
