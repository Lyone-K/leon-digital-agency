// Wraps the Google PageSpeed Insights API (v5). No auth is strictly required for
// low volume, but GOOGLE_PAGESPEED_API_KEY raises the rate limit substantially —
// worth setting once this gets real traffic.

export type PageSpeedResult = {
  performanceScore: number
  seoScore: number
  accessibilityScore: number
  bestPracticesScore: number
  coreWebVitals: {
    lcp: string | null
    cls: string | null
    fcp: string | null
  }
}

export async function runPageSpeedAudit(targetUrl: string): Promise<PageSpeedResult> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  endpoint.searchParams.set('url', targetUrl)
  endpoint.searchParams.set('strategy', 'mobile')
  ;['performance', 'seo', 'accessibility', 'best-practices'].forEach((c) =>
    endpoint.searchParams.append('category', c)
  )
  if (apiKey) endpoint.searchParams.set('key', apiKey)

  const res = await fetch(endpoint.toString())
  if (!res.ok) {
    throw new Error(`PageSpeed API request failed: ${res.status}`)
  }
  const data = await res.json()

  const categories = data?.lighthouseResult?.categories
  const audits = data?.lighthouseResult?.audits

  const toScore = (val: number | undefined) => (typeof val === 'number' ? Math.round(val * 100) : 0)

  return {
    performanceScore: toScore(categories?.performance?.score),
    seoScore: toScore(categories?.seo?.score),
    accessibilityScore: toScore(categories?.accessibility?.score),
    bestPracticesScore: toScore(categories?.['best-practices']?.score),
    coreWebVitals: {
      lcp: audits?.['largest-contentful-paint']?.displayValue ?? null,
      cls: audits?.['cumulative-layout-shift']?.displayValue ?? null,
      fcp: audits?.['first-contentful-paint']?.displayValue ?? null,
    },
  }
}
