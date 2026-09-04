import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getIndustryPageBySlug } from '@/lib/sanity.queries'
import { CTABanner } from '@/components/sections/Testimonial'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await getIndustryPageBySlug(params.slug)
  if (!page) return {}
  return {
    title: `Web Design for ${page.industryName}`,
    description: page.heroSubheading,
  }
}

export default async function IndustryPage({ params }: { params: { slug: string } }) {
  const page = await getIndustryPageBySlug(params.slug)
  if (!page) notFound()

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">{page.industryName}</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            {page.heroHeading}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">{page.heroSubheading}</p>
        </div>
      </section>

      {page.painPoints?.length > 0 && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-content px-6 py-16">
            <p className="eyebrow mb-3 text-emerald">What we see constantly</p>
            <h2 className="mb-8 max-w-lg font-display text-3xl text-ink md:text-4xl">
              Common problems we solve
            </h2>
            <ul className="ledger-rule border-t border-gold-hairline">
              {page.painPoints.map((point: string, i: number) => (
                <li key={i} className="flex gap-4 border-b border-gold-hairline py-5">
                  <span className="tabular-figure text-sm text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-slate">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {page.relevantCaseStudies?.length > 0 && (
        <section className="bg-emerald-deep text-bone">
          <div className="mx-auto max-w-content px-6 py-16">
            <p className="eyebrow mb-3">Relevant work</p>
            <h2 className="mb-8 font-display text-3xl">
              What this looked like for a real client
            </h2>
            <div className="border-t border-gold-hairline">
              {page.relevantCaseStudies.map((study: any) => (
                <a
                  key={study.slug}
                  href={`/portfolio/${study.slug}`}
                  className="flex items-center justify-between border-b border-gold-hairline py-5 hover:bg-white/[0.03]"
                >
                  <span>{study.clientName}</span>
                  <span className="text-sm text-gold">{study.summary}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
