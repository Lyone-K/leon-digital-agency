import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getServices, getComparisonMatrix } from '@/lib/sanity.queries'
import ComparisonMatrixTable from '@/components/sections/ComparisonMatrixTable'
import { CTABanner } from '@/components/sections/Testimonial'

export const metadata: Metadata = {
  title: 'Services & Pricing',
  description:
    'Custom web design, web applications, CMS integration, and SEO — with transparent package pricing in KES.',
}

export const revalidate = 3600 // re-fetch from Sanity at most once an hour

export default async function ServicesPage() {
  const [services, matrix] = await Promise.all([getServices(), getComparisonMatrix()])

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">Services</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            We work with you <span className="italic text-gold">from start to finish</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            No outsourcing. No middlemen.
            The same team that plans your project is the team that designs, builds and supports it until launch.
          </p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="grid gap-px overflow-hidden bg-gold-hairline md:grid-cols-2">
            {services.map((service) => (
              <div key={service.slug} id={service.slug} className="bg-parchment p-8">
                <h2 className="font-display text-2xl text-ink">{service.name}</h2>
                <p className="mt-3 text-sm text-slate">{service.shortDescription}</p>

                {service.tiers && service.tiers.length > 0 && (
                  <ul className="mt-6 space-y-2 border-t border-gold-hairline pt-4">
                    {service.tiers.map((tier) => (
                      <li key={tier.tierName} className="flex justify-between text-sm">
                        <span className="text-slate">{tier.tierName}</span>
                        <span className="tabular-figure text-emerald">
                          KES {tier.priceKES.toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className="bg-parchment">
        <div className="mx-auto max-w-content px-6 pb-20">
          <p className="eyebrow mb-3 text-emerald">Pricing</p>
          <h2 className="max-w-lg font-display text-3xl text-ink md:text-4xl">
            {matrix.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-slate-soft">
            Choose the package that best fits your business. Every package includes website setup,
            SEO, hosting guidance and 30 days of support after launch.
          </p>

          <div className="mt-10">
            <ComparisonMatrixTable matrix={matrix} />
          </div>

          <Link
            href="/estimator"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-emerald underline decoration-emerald/40 underline-offset-4 hover:text-gold"
          >
            Not sure which package fits? Get a Free Quote
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
