import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getCaseStudyBySlug } from '@/lib/sanity.queries'
import { urlFor } from '@/lib/sanity.client'
import { caseStudyJsonLd } from '@/lib/json-ld'
import AnimatedMetricRow from '@/components/AnimatedMetricRow'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import RichText from '@/components/RichText'
import { CTABanner } from '@/components/sections/Testimonial'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study) return {}
  return {
    title: study.clientName,
    description: study.summary,
  }
}

function resolveImage(image: any): string | null {
  if (!image) return null
  try {
    return urlFor(image).width(1200).url()
  } catch {
    return null
  }
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd(study)) }}
      />
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-xs text-bone/60 hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All work
          </Link>

          <p className="eyebrow mb-4 mt-8">{study.industry}</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            {study.clientName}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-bone/70">{study.summary}</p>

          {study.metrics?.length > 0 && (
            <div className="mt-12">
              <AnimatedMetricRow metrics={study.metrics} />
            </div>
          )}
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-content gap-12 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3 text-emerald">The challenge</p>
            <RichText value={study.challenge} />
          </div>
          <div>
            <p className="eyebrow mb-3 text-emerald">The solution</p>
            <RichText value={study.solution} />
          </div>
        </div>
      </section>

      {study.beforeAfterGallery?.length > 0 && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-content px-6 pb-16">
            <p className="eyebrow mb-3 text-emerald">Before &amp; after</p>
            <h2 className="mb-8 font-display text-3xl text-ink">See the difference</h2>
            <div className="grid gap-10 md:grid-cols-2">
              {study.beforeAfterGallery.map((item: any, i: number) => (
                <BeforeAfterSlider
                  key={i}
                  label={item.label}
                  caption={item.caption}
                  beforeSrc={resolveImage(item.beforeImage)}
                  afterSrc={resolveImage(item.afterImage)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {study.testimonial && (
        <section className="bg-emerald-deep text-bone">
          <div className="mx-auto max-w-content px-6 py-16">
            <blockquote className="mx-auto max-w-2xl text-center">
              <p className="font-display text-2xl italic leading-relaxed md:text-3xl">
                "{study.testimonial.quote}"
              </p>
              <footer className="mt-6">
                <p className="text-sm font-medium">{study.testimonial.clientName}</p>
                <p className="text-sm text-bone/60">{study.testimonial.clientTitle}</p>
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {study.liveUrl && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-content px-6 py-10">
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-emerald hover:text-gold"
            >
              Visit the live site
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
