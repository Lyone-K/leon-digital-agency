'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')

  const NAV_LINKS = [
    { label: t('work'), href: '/portfolio' },
    { label: t('services'), href: '/services' },
    { label: t('industries'), href: '/industries' },
    { label: t('pricing'), href: '/services#comparison' },
    { label: t('about'), href: '/about' },
    { label: t('bookCall'), href: '/book' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-ink text-bone">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-xl tracking-tight">
          Leon <span className="text-gold">Digital</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-bone/80 transition hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <LanguageSwitcher />
          <Link
            href="/estimator"
            className="group inline-flex items-center gap-2 border border-gold px-5 py-2.5 text-sm text-gold transition hover:bg-gold hover:text-ink"
          >
            {t('startProject')}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="ledger-rule flex flex-col gap-1 px-6 pb-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-bone/90"
            >
              {link.label}
            </Link>
          ))}
          <div className="py-3">
            <LanguageSwitcher />
          </div>
          <Link
            href="/estimator"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 border border-gold px-5 py-3 text-sm text-gold"
          >
            {t('startProject')}
          </Link>
        </div>
      )}
    </header>
  )
}
