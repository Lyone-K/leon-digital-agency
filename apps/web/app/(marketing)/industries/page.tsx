import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getIndustryPages } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'Industries',
  description: 'Leon Digital Agency builds websites and digital solutions for tourism, healthcare, real estate and hospitality businesses across Kenya and East Africa.',
}

export const revalidate = 3600

export default async function IndustriesPage() {
  const industries = await getIndustryPages()

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">Industries</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            We understand the <span className="italic text-gold">challenges in your industry</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            We build websites and applications that solve real business problems.
          </p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="grid gap-px overflow-hidden bg-gold-hairline sm:grid-cols-2">
            {industries.map((ind: any) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex flex-col justify-between bg-parchment p-8 transition hover:bg-ink"
              >
                <div>
                  <h2 className="font-display text-xl text-ink group-hover:text-bone">
                    {ind.industryName}
                  </h2>
                  <p className="mt-3 text-sm text-slate group-hover:text-bone/70">
                    {ind.heroHeading}
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
    </>
  )
}
