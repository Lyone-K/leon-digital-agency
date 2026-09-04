import type { Metadata } from 'next'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on web design, development, and what actually works for Kenyan businesses online.',
}

export const revalidate = 3600

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-16 pt-16 md:pt-24">
          <p className="eyebrow mb-6">From the studio</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            Notes on what <span className="italic text-gold">actually works.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            No SEO filler. Just what we've learned building for real clients.
          </p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="border-t border-gold-hairline">
            {posts.length === 0 && (
              <p className="py-10 text-center text-slate-soft">No posts yet — check back soon.</p>
            )}
            {posts.map((post: any) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 border-b border-gold-hairline py-8 transition hover:bg-white/40 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div className="sm:max-w-xl">
                  <h2 className="font-display text-xl text-ink group-hover:text-emerald">{post.title}</h2>
                  <p className="mt-2 text-sm text-slate-soft">{post.excerpt}</p>
                </div>
                <p className="tabular-figure whitespace-nowrap text-xs text-slate-soft">
                  {formatDate(post.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
