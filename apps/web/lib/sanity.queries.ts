import { sanityClient, isSanityConfigured } from './sanity.client'
import { services as sampleServices, caseStudies as sampleCaseStudies, teamMembers as sampleTeamMembers, industryPages as sampleIndustryPages, blogPosts as sampleBlogPosts, trustStats as sampleTrustStats, testimonial as sampleTestimonial } from './sample-data'

// Every query function follows the same shape: try Sanity first (once configured),
// fall back to sample-data.ts otherwise. This means pages can be built and demoed
// end-to-end before a real Sanity project exists, and nothing needs to change in
// components when the project ID is finally dropped into .env — only these
// functions start returning live data instead of the fallback.

export type ServiceDoc = {
  name: string
  slug: string
  shortDescription: string
  icon?: any
  tiers?: {
    tierName: string
    priceKES: number
    priceUSD?: number
    features: string[]
    highlighted?: boolean
  }[]
}

export async function getServices(): Promise<ServiceDoc[]> {
  if (!isSanityConfigured) return sampleServices as ServiceDoc[]
  try {
    const query = `*[_type == "service"] | order(order asc) {
      name,
      "slug": slug.current,
      shortDescription,
      icon,
      tiers
    }`
    const result = await sanityClient.fetch(query)
    return result?.length ? result : (sampleServices as ServiceDoc[])
  } catch {
    return sampleServices as ServiceDoc[]
  }
}

export type ComparisonMatrixDoc = {
  title: string
  columns: { name: string; priceKES: number; recommended?: boolean }[]
  rows: { feature: string; category?: string; values: string[] }[]
}

const sampleMatrix: ComparisonMatrixDoc = {
  title: 'Package Comparison',
  columns: [
    { name: 'Starter', priceKES: 80000, recommended: false },
    { name: 'Growth', priceKES: 180000, recommended: true },
    { name: 'Enterprise', priceKES: 400000, recommended: false },
  ],
  rows: [
    { feature: 'Custom design (no templates)', category: 'Design', values: ['true', 'true', 'true'] },
    { feature: 'CMS integration', category: 'CMS', values: ['false', 'true', 'true'] },
    { feature: 'Client portal', category: 'Web App', values: ['false', 'false', 'true'] },
    { feature: 'M-Pesa + Stripe payments', category: 'Payments', values: ['false', 'true', 'true'] },
    { feature: 'Multilingual support', category: 'Content', values: ['false', 'false', 'true'] },
  ],
}

export async function getComparisonMatrix(): Promise<ComparisonMatrixDoc> {
  if (!isSanityConfigured) return sampleMatrix
  try {
    const query = `*[_type == "comparisonMatrix"][0] { title, columns, rows }`
    const result = await sanityClient.fetch(query)
    return result || sampleMatrix
  } catch {
    return sampleMatrix
  }
}

export async function getCaseStudies() {
  if (!isSanityConfigured) return sampleCaseStudies
  try {
    const query = `*[_type == "caseStudy"] | order(publishedAt desc) {
      clientName,
      "slug": slug.current,
      industry,
      summary,
      metrics
    }`
    const result = await sanityClient.fetch(query)
    return result?.length ? result : sampleCaseStudies
  } catch {
    return sampleCaseStudies
  }
}

export async function getCaseStudyBySlug(slug: string) {
  if (!isSanityConfigured) {
    return sampleCaseStudies.find((c) => c.slug === slug) ?? null
  }
  try {
    const query = `*[_type == "caseStudy" && slug.current == $slug][0] {
      clientName,
      "slug": slug.current,
      industry,
      summary,
      challenge,
      solution,
      metrics,
      beforeAfterGallery,
      liveUrl,
      coverImage,
      "testimonial": testimonial-> { clientName, clientTitle, quote }
    }`
    const result = await sanityClient.fetch(query, { slug })
    return result ?? sampleCaseStudies.find((c) => c.slug === slug) ?? null
  } catch {
    return sampleCaseStudies.find((c) => c.slug === slug) ?? null
  }
}

export async function getTeamMembers() {
  if (!isSanityConfigured) return sampleTeamMembers
  try {
    const query = `*[_type == "teamMember"] | order(order asc) { name, role, bio, photo }`
    const result = await sanityClient.fetch(query)
    return result?.length ? result : sampleTeamMembers
  } catch {
    return sampleTeamMembers
  }
}

export async function getIndustryPages() {
  if (!isSanityConfigured) return sampleIndustryPages
  try {
    const query = `*[_type == "industryPage"] { industryName, "slug": slug.current, heroHeading, heroSubheading, painPoints }`
    const result = await sanityClient.fetch(query)
    return result?.length ? result : sampleIndustryPages
  } catch {
    return sampleIndustryPages
  }
}

export async function getIndustryPageBySlug(slug: string) {
  if (!isSanityConfigured) {
    return sampleIndustryPages.find((p) => p.slug === slug) ?? null
  }
  try {
    const query = `*[_type == "industryPage" && slug.current == $slug][0] {
      industryName,
      "slug": slug.current,
      heroHeading,
      heroSubheading,
      painPoints,
      "relevantCaseStudies": relevantCaseStudies[]-> {
        clientName, "slug": slug.current, industry, summary, metrics
      }
    }`
    const result = await sanityClient.fetch(query, { slug })
    return result ?? sampleIndustryPages.find((p) => p.slug === slug) ?? null
  } catch {
    return sampleIndustryPages.find((p) => p.slug === slug) ?? null
  }
}

export async function getBlogPosts() {
  if (!isSanityConfigured) return sampleBlogPosts
  try {
    const query = `*[_type == "blogPost"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      publishedAt,
      coverImage,
      "author": author->name
    }`
    const result = await sanityClient.fetch(query)
    return result?.length ? result : sampleBlogPosts
  } catch {
    return sampleBlogPosts
  }
}

export async function getBlogPostBySlug(slug: string) {
  if (!isSanityConfigured) {
    return sampleBlogPosts.find((p) => p.slug === slug) ?? null
  }
  try {
    const query = `*[_type == "blogPost" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      excerpt,
      body,
      publishedAt,
      coverImage,
      "author": author->name
    }`
    const result = await sanityClient.fetch(query, { slug })
    return result ?? sampleBlogPosts.find((p) => p.slug === slug) ?? null
  } catch {
    return sampleBlogPosts.find((p) => p.slug === slug) ?? null
  }
}

// siteSettings is a singleton document (see sanity.config.ts desk structure,
// which pins it to a fixed _id: 'siteSettings'). Previously this schema was
// defined and seeded but never actually fetched anywhere — trust stats and
// contact details were hardcoded from sample-data.ts regardless of what an
// editor set in Studio. This wires it up for real.
export type SiteSettings = {
  siteName: string
  phone?: string
  email?: string
  address?: string
  trustStats?: { label: string; value: number; suffix?: string }[]
}

const fallbackSiteSettings: SiteSettings = {
  siteName: 'Leon Digital Agency',
  phone: '+254 719 628 766',
  email: 'hello@leondigitalagency.com',
  address: 'Nairobi, Kenya',
  trustStats: sampleTrustStats,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return fallbackSiteSettings
  try {
    const query = `*[_type == "siteSettings"][0] { siteName, phone, email, address, trustStats }`
    const result = await sanityClient.fetch(query)
    return result || fallbackSiteSettings
  } catch {
    return fallbackSiteSettings
  }
}

// testimonial was also defined and seeded but never queried — the homepage
// testimonial section was permanently frozen on sample-data.ts, so editing or
// adding testimonials in Studio had no visible effect anywhere.
export async function getFeaturedTestimonial() {
  if (!isSanityConfigured) return sampleTestimonial
  try {
    const query = `*[_type == "testimonial"] | order(_createdAt desc) [0] { clientName, clientTitle, quote }`
    const result = await sanityClient.fetch(query)
    return result || sampleTestimonial
  } catch {
    return sampleTestimonial
  }
}

// The generic `page` schema (hero/trustStats/serviceGrid/featuredCaseStudies/
// testimonialSlider/faq/richText/ctaBanner sections) existed since Phase 1 but
// had no frontend route — an editor could build a page in Studio and it would
// never render anywhere. There is no sample-data fallback here on purpose:
// this schema only makes sense once Sanity is actually configured, since it's
// entirely editor-authored content with no fixed shape to hardcode a fallback
// for.
export async function getPageBySlug(slug: string) {
  if (!isSanityConfigured) return null
  try {
    const query = `*[_type == "page" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      sections[] {
        _type,
        _key,
        heading,
        subheading,
        ctaLabel,
        ctaHref,
        backgroundImage,
        stats,
        services[]-> { name, "slug": slug.current, shortDescription },
        caseStudies[]-> { clientName, "slug": slug.current, industry, summary, metrics },
        testimonials[]-> { clientName, clientTitle, quote },
        items,
        content
      },
      seo
    }`
    const result = await sanityClient.fetch(query, { slug })
    return result ?? null
  } catch {
    return null
  }
}
