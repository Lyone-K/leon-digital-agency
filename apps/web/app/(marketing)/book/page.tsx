import type { Metadata } from 'next'
import BookingEmbed from '@/components/BookingEmbed'

export const metadata: Metadata = {
  title: 'Book a Discovery Call',
  description: 'Schedule a free discovery call with Leon Digital Agency.',
}

export default function BookPage() {
  return (
    <>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-content px-6 pb-10 pt-16 md:pt-24">
          <p className="eyebrow mb-6">Book a call</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
            30 minutes. <span className="italic text-gold">No pressure, no pitch deck.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            We'll discuss your project, timeline and budget before you commit.
          </p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-content px-6 py-12">
          <div className="border border-gold-hairline bg-white">
            <BookingEmbed />
          </div>
        </div>
      </section>
    </>
  )
}
