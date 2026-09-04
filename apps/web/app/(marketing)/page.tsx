import Hero from '@/components/sections/Hero'
import TrustStatsBar from '@/components/sections/TrustStatsBar'
import ServiceGrid from '@/components/sections/ServiceGrid'
import CaseStudyLedger from '@/components/sections/CaseStudyLedger'
import { TestimonialBlock, CTABanner } from '@/components/sections/Testimonial'
import { getSiteSettings, getFeaturedTestimonial } from '@/lib/sanity.queries'

export const revalidate = 3600

export default async function HomePage() {
  const [settings, testimonial] = await Promise.all([getSiteSettings(), getFeaturedTestimonial()])

  return (
    <>
      <Hero />
      <TrustStatsBar stats={settings.trustStats || []} />
      <ServiceGrid />
      <CaseStudyLedger />
      <TestimonialBlock testimonial={testimonial} />
      <CTABanner />
    </>
  )
}
