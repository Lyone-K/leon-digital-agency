import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
}

// True once a real Sanity project has been created and its ID dropped into .env.
// Pages should check this and fall back to lib/sample-data.ts when false, so the
// site is fully buildable and demoable before Sanity is provisioned.
export const isSanityConfigured = Boolean(sanityConfig.projectId)

// Read-only client for public pages (uses CDN in production)
export const sanityClient = createClient(
  isSanityConfigured ? sanityConfig : { ...sanityConfig, projectId: 'placeholder' }
)

// Server-only client with write token, for revalidation/webhooks/admin actions
export const sanityWriteClient = createClient({
  ...sanityConfig,
  projectId: isSanityConfigured ? sanityConfig.projectId : 'placeholder',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)
