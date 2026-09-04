import Link from 'next/link'
import { caseStudies } from '@/lib/sample-data'

export default function CaseStudyLedger() {
  return (
    <section className="bg-emerald-deep text-bone">
      <div className="mx-auto max-w-content px-6 py-20">
        <p className="eyebrow mb-3">Results, on the record</p>
        <h2 className="max-w-lg font-display text-3xl md:text-4xl">
          A ledger of outcomes, not just designs.
        </h2>

        <div className="ledger-rule mt-12 border-gold-hairline">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/portfolio/${study.slug}`}
              className="group flex flex-col gap-4 border-b border-gold-hairline py-6 transition hover:bg-white/[0.03] md:flex-row md:items-center md:justify-between"
            >
              <div className="md:max-w-md">
                <p className="text-xs uppercase tracking-wide text-gold/80">{study.industry}</p>
                <h3 className="mt-1 font-display text-xl">{study.clientName}</h3>
                <p className="mt-1 text-sm text-bone/60">{study.summary}</p>
              </div>

              <div className="flex gap-8">
                {study.metrics.map((m) => (
                  <div key={m.label} className="text-right">
                    <p className="tabular-figure text-2xl text-gold">
                      {'prefix' in m ? (m as any).prefix : ''}
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
  )
}
