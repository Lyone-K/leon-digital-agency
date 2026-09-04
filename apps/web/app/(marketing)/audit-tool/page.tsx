import type { Metadata } from 'next'
import AuditToolForm from '@/components/AuditToolForm'

export const metadata: Metadata = {
  title: 'Free AI Website Audit',
  description: 'Get a free website health check in minutes. Receive a detailed report on your website\'s speed, SEO, user experience and performance, along with easy-to-understand recommendations for improvement.',
}

export default function AuditToolPage() {
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto max-w-content px-6 pb-20 pt-16 md:pt-24">
        <p className="eyebrow mb-6">Free audit tool</p>
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
          Find out what's <span className="italic text-gold">actually wrong.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-bone/70">
          Real Lighthouse data turned into simple recommendations — not just a score.
        </p>

        <div className="mt-12">
          <AuditToolForm />
        </div>
      </div>
    </section>
  )
}
