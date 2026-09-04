import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  const COLUMNS = [
    {
      heading: t('services'),
      links: [
        { label: 'Custom Web Design', href: '/services#web-design' },
        { label: 'Web Applications', href: '/services#web-apps' },
        { label: 'SEO & Performance', href: '/services#seo' },
        { label: 'CMS Integration', href: '/services#cms' },
      ],
    },
    {
      heading: t('industries'),
      links: [
        { label: 'Tourism & Safari', href: '/industries/tourism' },
        { label: 'Healthcare', href: '/industries/healthcare' },
        { label: 'Real Estate', href: '/industries/real-estate' },
        { label: 'Hospitality', href: '/industries/hospitality' },
      ],
    },
    {
      heading: t('company'),
      links: [
        { label: t('ourWork'), href: '/portfolio' },
        { label: t('about'), href: '/about' },
        { label: t('blog'), href: '/blog' },
        { label: t('auditTool'), href: '/audit-tool' },
        { label: t('bookCall'), href: '/book' },
        { label: t('clientPortal'), href: '/portal' },
      ],
    },
  ]

  return (
    <footer className="bg-emerald-deep text-bone">
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="ledger-rule grid grid-cols-2 gap-10 py-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-2xl">
              Leon <span className="text-gold">Digital</span>
            </p>
            <p className="mt-4 max-w-xs text-sm text-bone/70">{t('tagline')}</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-bone/70 transition hover:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ledger-rule flex flex-col items-start justify-between gap-4 py-6 text-xs text-bone/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {t('rights')}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold">{t('privacy')}</Link>
            <Link href="/contact" className="hover:text-gold">{t('contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
