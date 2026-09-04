import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getBlogPostBySlug } from '@/lib/sanity.queries'
import RichText from '@/components/RichText'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <article className="bg-parchment">
      <div className="mx-auto max-w-2xl px-6 pb-20 pt-16 md:pt-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-slate-soft hover:text-emerald"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All posts
        </Link>

        <p className="tabular-figure mt-8 text-xs text-slate-soft">
          {formatDate(post.publishedAt)}
          {(post as any).author && ` · ${(post as any).author}`}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-ink md:text-4xl">{post.title}</h1>

        <div className="mt-10 border-t border-gold-hairline pt-10 text-lg leading-relaxed">
          <RichText value={(post as any).body} />
        </div>
      </div>
    </article>
  )
}
