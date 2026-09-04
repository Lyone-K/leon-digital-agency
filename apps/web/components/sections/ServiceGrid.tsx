import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { services } from '@/lib/sample-data'

export default function ServiceGrid() {
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-content px-6 py-20">
        <p className="eyebrow mb-3 text-emerald">What we build</p>
        <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">
          Everything you need to grow your business online.
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden bg-gold-hairline md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services#${service.slug}`}
              className="group flex flex-col justify-between bg-parchment p-8 transition hover:bg-ink"
            >
              <div>
                <h3 className="font-display text-xl text-ink group-hover:text-bone">
                  {service.name}
                </h3>
                <p className="mt-3 text-sm text-slate group-hover:text-bone/70">
                  {service.shortDescription}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-xs text-emerald group-hover:text-gold">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
