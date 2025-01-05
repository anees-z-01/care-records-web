import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '../src/components/Navigation'

export const metadata: Metadata = {
  title: 'Care Notes App',
  description: 'Track and manage care notes for nursing home residents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
