import type { ComponentType } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import RichText from '@/components/RichText'

// Maps each section _type from the `page` schema to actual UI. This is
// deliberately its own lightweight renderer rather than reusing the homepage's
// section components directly — those (Hero, TrustStatsBar, ServiceGrid,
// CaseStudyLedger) are hardcoded to homepage-specific copy and sample-data
// fallbacks, which doesn't fit editor-authored content with no fixed shape.
// This renderer trusts whatever Studio content it's given and renders nothing
// (rather than guessing) for a section it doesn't recognize.

type Section = { _type: string; _key: string; [key: string]: any }

function HeroSection({ section }: { section: Section }) {
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
        {section.heading && (
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">{section.heading}</h1>
        )}
        {section.subheading && <p className="mt-6 max-w-xl text-lg text-bone/70">{section.subheading}</p>}
        {section.ctaLabel && section.ctaHref && (
          <Link
            href={section.ctaHref}
            className="group mt-10 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90"
          >
            {section.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </section>
  )
}

function TrustStatsSection({ section }: { section: Section }) {
  const stats = section.stats || []
  if (stats.length === 0) return null
  return (
    <section className="bg-ink text-bone">
      <div className="ledger-rule mx-auto max-w-content px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat: any, i: number) => (
            <div key={i} className={`border-gold-hairline py-8 pr-6 ${i > 0 ? 'border-l' : ''}`}>
              <p className="tabular-figure text-3xl text-gold md:text-4xl">
                {stat.prefix}
                {stat.value}
                {stat.suffix === 'none' ? '' : stat.suffix}
              </p>
              <p className="mt-2 text-xs text-bone/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceGridSection({ section }: { section: Section }) {
  const services = section.services || []
  if (services.length === 0) return null
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-content px-6 py-16">
        {section.heading && <h2 className="mb-8 font-display text-3xl text-ink">{section.heading}</h2>}
        <div className="grid gap-px overflow-hidden bg-gold-hairline md:grid-cols-2">
          {services.map((s: any) => (
            <Link key={s.slug} href={`/services#${s.slug}`} className="bg-parchment p-8 hover:bg-ink hover:text-bone">
              <h3 className="font-display text-xl">{s.name}</h3>
              <p className="mt-3 text-sm opacity-80">{s.shortDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedCaseStudiesSection({ section }: { section: Section }) {
  const caseStudies = section.caseStudies || []
  if (caseStudies.length === 0) return null
  return (
    <section className="bg-emerald-deep text-bone">
      <div className="mx-auto max-w-content px-6 py-16">
        {section.heading && <h2 className="mb-8 font-display text-3xl">{section.heading}</h2>}
        <div className="border-t border-gold-hairline">
          {caseStudies.map((study: any) => (
            <Link
              key={study.slug}
              href={`/portfolio/${study.slug}`}
              className="flex items-center justify-between border-b border-gold-hairline py-5 hover:bg-white/[0.03]"
            >
              <span>{study.clientName}</span>
              <span className="text-sm text-gold">{study.summary}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialSliderSection({ section }: { section: Section }) {
  const testimonials = section.testimonials || []
  if (testimonials.length === 0) return null
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-content space-y-10 px-6 py-16">
        {testimonials.map((t: any, i: number) => (
          <blockquote key={i} className="mx-auto max-w-2xl text-center">
            <p className="font-display text-xl italic leading-relaxed text-ink">"{t.quote}"</p>
            <footer className="mt-4">
              <p className="text-sm font-medium text-ink">{t.clientName}</p>
              {t.clientTitle && <p className="text-sm text-slate-soft">{t.clientTitle}</p>}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

function FaqSection({ section }: { section: Section }) {
  const items = section.items || []
  if (items.length === 0) return null
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-content px-6 py-16">
        {section.heading && <h2 className="mb-8 font-display text-3xl text-ink">{section.heading}</h2>}
        <div className="border-t border-gold-hairline">
          {items.map((item: any, i: number) => (
            <details key={i} className="group border-b border-gold-hairline py-4">
              <summary className="cursor-pointer text-ink marker:content-none">{item.question}</summary>
              <p className="mt-3 text-sm text-slate">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function RichTextSection({ section }: { section: Section }) {
  if (!section.content) return null
  return (
    <section className="bg-parchment">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <RichText value={section.content} />
      </div>
    </section>
  )
}

function CtaBannerSection({ section }: { section: Section }) {
  if (!section.heading) return null
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center">
        <h2 className="max-w-md font-display text-3xl md:text-4xl">{section.heading}</h2>
        {section.ctaLabel && section.ctaHref && (
          <Link
            href={section.ctaHref}
            className="group inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold/90"
          >
            {section.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>
    </section>
  )
}

const SECTION_COMPONENTS: Record<string, ComponentType<{ section: Section }>> = {
  hero: HeroSection,
  trustStats: TrustStatsSection,
  serviceGrid: ServiceGridSection,
  featuredCaseStudies: FeaturedCaseStudiesSection,
  testimonialSlider: TestimonialSliderSection,
  faq: FaqSection,
  richText: RichTextSection,
  ctaBanner: CtaBannerSection,
}

export default function PageSections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section._type]
        if (!Component) return null
        return <Component key={section._key} section={section} />
      })}
    </>
  )
}
