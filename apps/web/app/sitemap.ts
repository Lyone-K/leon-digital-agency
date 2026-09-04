import type { MetadataRoute } from 'next'
import { getCaseStudies, getIndustryPages, getBlogPosts } from '@/lib/sanity.queries'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leondigitalagency.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/industries`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/estimator`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/audit-tool`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/book`, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const [caseStudies, industries, posts] = await Promise.all([
    getCaseStudies(),
    getIndustryPages(),
    getBlogPosts(),
  ])

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((study: any) => ({
    url: `${baseUrl}/portfolio/${study.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const industryRoutes: MetadataRoute.Sitemap = industries.map((ind: any) => ({
    url: `${baseUrl}/industries/${ind.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...caseStudyRoutes, ...industryRoutes, ...blogRoutes]
}
