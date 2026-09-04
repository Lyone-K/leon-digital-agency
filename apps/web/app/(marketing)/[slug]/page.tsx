import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/sanity.queries'
import PageSections from '@/components/PageSections'

// This only matches when no static route at this level claims the slug first —
// Next.js prioritizes static segments (services, about, contact, portfolio,
// industries, blog, estimator, book, audit-tool, privacy) over this dynamic
// catch-all, so it's safe to sit alongside them. It exists so that pages built
// from Studio's generic page builder (see packages/sanity-schema/schemas/page.ts)
// actually render somewhere — previously that schema had no frontend at all.

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await getPageBySlug(params.slug)
  if (!page) return {}
  return {
    title: page.seo?.metaTitle || page.title,
    description: page.seo?.metaDescription,
  }
}

export default async function GenericPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug)
  if (!page) notFound()

  return <PageSections sections={page.sections || []} />
}
