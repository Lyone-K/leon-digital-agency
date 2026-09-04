'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, FolderKanban, BarChart3, Rocket } from 'lucide-react'

const NAV = [
  { label: 'Overview', href: '/portal', icon: LayoutDashboard },
  { label: 'Start a project', href: '/portal/onboarding', icon: Rocket },
  { label: 'Projects', href: '/portal/projects', icon: FolderKanban },
  { label: 'Metrics', href: '/portal/metrics', icon: BarChart3 },
]

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-ink text-bone md:flex">
        <div className="border-b border-gold-hairline px-6 py-6">
          <Link href="/" className="font-display text-lg">
            Leon <span className="text-gold">Digital</span>
          </Link>
          <p className="eyebrow mt-1 text-[10px]">Client Portal</p>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {NAV.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition ${
                  active ? 'bg-gold/10 text-gold' : 'text-bone/70 hover:text-gold'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gold-hairline px-6 py-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      <div className="flex-1 bg-parchment">
        <header className="flex items-center justify-between border-b border-gold-hairline px-6 py-4 md:hidden">
          <span className="font-display text-lg text-ink">Portal</span>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  )
}
