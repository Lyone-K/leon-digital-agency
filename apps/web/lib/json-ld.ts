const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leondigitalagency.com'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Leon Digital Agency',
    url: baseUrl,
    description:
      'Websites, web applications and brands built to help businesses across Kenya and East Africa grow with confidence.',
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    sameAs: [] as string[],
  }
}

export function caseStudyJsonLd(study: { clientName: string; summary?: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: `${study.clientName} — Case Study`,
    description: study.summary,
    url: `${baseUrl}/portfolio/${study.slug}`,
    creator: {
      '@type': 'Organization',
      name: 'Leon Digital Agency',
    },
  }
}
