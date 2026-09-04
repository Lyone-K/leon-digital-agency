import type { Metadata } from 'next'
import { Spectral, Inter, Space_Mono } from 'next/font/google'
import '../globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { organizationJsonLd } from '@/lib/json-ld'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

// This is a ROOT layout (defines <html>/<body>) scoped to the (marketing) route
// group only. The (studio) route group has its own separate root layout with no
// header/footer, so the Sanity Studio gets a clean full-screen shell instead of
// inheriting the marketing site's chrome. See Next.js "multiple root layouts".

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://leondigitalagency.com'),
  title: {
    default: 'Leon Digital Agency — Custom Web Design & Development, Nairobi',
    template: '%s | Leon Digital Agency',
  },
  description:
    'Leon Digital Agency Transforming visions into powerful digital experiences — websites, web applications, and brands built to help businesses across Kenya and East Africa grow with confidence.',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: 'Leon Digital Agency',
  },
}

export default async function MarketingRootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${spectral.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
