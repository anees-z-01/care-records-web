'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-gray-900 hover:text-blue-600 font-medium ${pathname === '/' ? 'text-blue-600' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`text-gray-900 hover:text-blue-600 font-medium ${pathname === '/dashboard' ? 'text-blue-600' : ''}`}
            >
              Dashboard
            </Link>
          </div>
          <Link
            href="/add-note"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add Note
          </Link>
        </div>
      </div>
    </nav>
  )
}