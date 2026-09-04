export const metadata = {
  title: 'Leon Digital Agency — Studio',
  robots: { index: false, follow: false },
}

// This is a separate ROOT layout (its own <html>/<body>) scoped to the (studio)
// route group only. Sanity Studio renders a full-screen app of its own — it must
// NOT inherit the marketing site's Header/Footer/fonts. Do not import globals.css
// or the marketing Header/Footer here.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
