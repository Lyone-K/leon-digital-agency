import type { Metadata } from 'next'
import { Mail, MapPin, Phone } from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import { getSiteSettings } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Leon Digital Agency, Nairobi.',
}

export const revalidate = 3600

export default async function ContactPage() {
  const settings = await getSiteSettings()

  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto max-w-content px-6 pb-20 pt-16 md:pt-24">
        <p className="eyebrow mb-6">Get in touch</p>
        <h1 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl">
          Tell us what you're <span className="italic text-gold">building.</span>
        </h1>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-gold" />
              <p className="text-sm text-bone/70">{settings.address}</p>
            </div>
            {settings.email && (
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold" />
                <a href={`mailto:${settings.email}`} className="text-sm text-bone/70 hover:text-gold">
                  {settings.email}
                </a>
              </div>
            )}
            {settings.phone && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-sm text-bone/70 hover:text-gold">
                  {settings.phone}
                </a>
              </div>
            )}
            <p className="pt-4 text-sm text-bone/50">
              Prefer a quick number first? Try the{' '}
              <a href="/estimator" className="underline decoration-gold/40 underline-offset-4 hover:text-gold">
                project estimator
              </a>{' '}
              instead.
            </p>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  )
}
