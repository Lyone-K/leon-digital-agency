import type { Metadata } from 'next'
import Link from 'next/link'
import { getCaseStudies } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'Our Work',
  description: 'Case studies from Leon Digital Agency — real clients, real measurable results.',
}

export const revalidate = 3600

export default async function PortfolioPage() {
  const caseStudies = await getCaseStudies()

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">Our work</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            Every project, <span className="italic text-gold">with real results.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            No made-up examples.
            See our actual work, results, and live websites where available.
          </p>
        </div>
      </section>

      <section className="bg-emerald-deep text-bone">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="border-t border-gold-hairline">
            {caseStudies.map((study: any) => (
              <Link
                key={study.slug}
                href={`/portfolio/${study.slug}`}
                className="group flex flex-col gap-4 border-b border-gold-hairline py-6 transition hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
              >
                <div className="md:max-w-md">
                  <p className="text-xs uppercase tracking-wide text-gold/80">{study.industry}</p>
                  <h2 className="mt-1 font-display text-xl">{study.clientName}</h2>
                  <p className="mt-1 text-sm text-bone/60">{study.summary}</p>
                </div>

                <div className="flex gap-8">
                  {study.metrics?.slice(0, 2).map((m: any) => (
                    <div key={m.label} className="text-right">
                      <p className="tabular-figure text-2xl text-gold">
                        {m.prefix || ''}
                        {m.value}
                        {m.suffix}
                      </p>
                      <p className="text-xs text-bone/50">{m.label}</p>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
