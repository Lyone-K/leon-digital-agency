import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto max-w-content px-6 pb-20 pt-16 md:pt-24">
        <p className="eyebrow mb-6">{t('eyebrow')}</p>

        <h1 className="max-w-3xl font-display text-4xl leading-[1.1] md:text-6xl">
          {t('headlinePrefix')}{' '}
          <span className="italic text-gold">{t('headlineEmphasis')}</span>
          {t('headlineSuffix')}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-bone/70">{t('body')}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/estimator"
            className="group inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink transition hover:bg-gold/90"
          >
            {t('ctaEstimate')}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/portfolio"
            className="text-sm text-bone/80 underline decoration-gold/40 underline-offset-4 hover:text-gold"
          >
            {t('ctaWork')}
          </Link>
        </div>
      </div>
    </section>
  )
}
