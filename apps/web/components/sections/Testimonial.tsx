import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'

type Testimonial = { clientName: string; clientTitle?: string; quote: string }

export function TestimonialBlock({ testimonial }: { testimonial: Testimonial }) {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-content px-6 py-20">
        <blockquote className="mx-auto max-w-2xl text-center">
          <p className="font-display text-2xl italic leading-relaxed text-ink md:text-3xl">
            "{testimonial.quote}"
          </p>
          <footer className="mt-6">
            <p className="text-sm font-medium text-ink">{testimonial.clientName}</p>
            {testimonial.clientTitle && <p className="text-sm text-slate-soft">{testimonial.clientTitle}</p>}
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

export function CTABanner() {
  const t = useTranslations('cta')
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
        <h2 className="max-w-md font-display text-3xl md:text-4xl">
          {t('heading')}
        </h2>
        <Link
          href="/estimator"
          className="group inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink transition hover:bg-gold/90"
        >
          {t('button')}
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  )
}
