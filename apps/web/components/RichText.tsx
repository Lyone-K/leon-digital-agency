import { PortableText } from '@portabletext/react'

// Case study copy comes either as a plain string (sample-data.ts, before Sanity is
// connected) or as Portable Text blocks (real Sanity content). This normalizes both
// into the same rendered output so the page component doesn't need to care which.
export default function RichText({ value }: { value: string | any[] | undefined }) {
  if (!value) return null

  if (typeof value === 'string') {
    const paragraphs = value.split(/\n\n+/).filter(Boolean)
    return (
      <div className="space-y-4 text-slate">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="prose-sm text-slate [&_p]:mb-4">
      <PortableText value={value} />
    </div>
  )
}
