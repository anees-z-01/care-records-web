import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '../src/components/Navigation'

export const metadata: Metadata = {
  title: 'Care notes',
  description: 'Browse, summarise and add care notes for a demo care-home API (synthetic data only).',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Providers>
          <Navigation />
          <main id="main" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
