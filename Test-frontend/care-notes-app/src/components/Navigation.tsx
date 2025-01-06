'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Notes' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-line bg-white">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-xl font-semibold text-pine-800">
          Care notes
        </Link>
        <ul className="flex gap-1">
          {LINKS.map(link => {
            const active = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${active ? 'bg-pine-50 text-pine-800' : 'text-muted hover:text-ink'}`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
        <Link href="/add-note" className="btn-primary ml-auto">
          Add note
        </Link>
      </nav>
    </header>
  )
}
