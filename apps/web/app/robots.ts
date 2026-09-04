import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leondigitalagency.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/portal', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
