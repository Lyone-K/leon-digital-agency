import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Spectral, Inter, Space_Mono } from 'next/font/google'
import '../globals.css'

// Third independent root layout (see the note in README about (marketing) vs
// (studio)). The portal gets its own shell too: a dashboard frame instead of the
// marketing header/footer, wrapped in ClerkProvider for auth. Nothing here should
// import components/Header or components/Footer.

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
  title: 'Client Portal | Leon Digital Agency',
  robots: { index: false, follow: false },
}

export default function PortalRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#C9A24C',
          colorBackground: '#0E1B2B',
          colorText: '#EDEAE2',
        },
      }}
    >
      <html lang="en" className={`${spectral.variable} ${inter.variable} ${spaceMono.variable}`}>
        <body className="bg-parchment text-slate">{children}</body>
      </html>
    </ClerkProvider>
  )
}
