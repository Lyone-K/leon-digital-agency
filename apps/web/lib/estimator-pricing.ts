// Pricing engine for the interactive project estimator. Numbers are aligned with
// the comparisonMatrix tiers seeded in Sanity (Starter 80k / Growth 180k / Enterprise
// 400k KES) so the estimator and the pricing page never contradict each other.
// If those seeded prices change, update BASE_PRICES to match.

export const PROJECT_TYPES = [
  { id: 'new-website', label: 'New marketing website', basePriceKES: 80_000 },
  { id: 'redesign', label: 'Redesign of an existing site', basePriceKES: 100_000 },
  { id: 'ecommerce', label: 'E-commerce store', basePriceKES: 180_000 },
  { id: 'web-app', label: 'Custom web application', basePriceKES: 280_000 },
] as const

export const INDUSTRIES = [
  'Tourism & Safari',
  'Healthcare',
  'Real Estate',
  'Hospitality',
  'Finance',
  'Legal',
  'Education',
  'Other',
] as const

export const ADD_ON_FEATURES = [
  { id: 'cms', label: 'CMS integration (Sanity)', priceKES: 25_000 },
  { id: 'client-portal', label: 'Client portal with project tracking', priceKES: 90_000 },
  { id: 'multilingual', label: 'Multilingual support', priceKES: 40_000 },
  { id: 'payments', label: 'M-Pesa / Stripe payments', priceKES: 55_000 },
  { id: 'booking', label: 'Booking / scheduling flow', priceKES: 35_000 },
  { id: 'audit-tool', label: 'AI website audit tool', priceKES: 60_000 },
  { id: 'dashboard', label: 'Analytics / success metrics dashboard', priceKES: 45_000 },
] as const

export const BUDGET_RANGES = [
  { id: 'under-150k', label: 'Under KES 150,000' },
  { id: '150k-350k', label: 'KES 150,000 – 350,000' },
  { id: '350k-750k', label: 'KES 350,000 – 750,000' },
  { id: 'over-750k', label: 'Over KES 750,000' },
] as const

export type ProjectTypeId = (typeof PROJECT_TYPES)[number]['id']
export type AddOnId = (typeof ADD_ON_FEATURES)[number]['id']

export function calculateEstimate(input: {
  projectType: ProjectTypeId | null
  addOns: AddOnId[]
}) {
  const base = PROJECT_TYPES.find((p) => p.id === input.projectType)?.basePriceKES ?? 0
  const addOnTotal = input.addOns.reduce((sum, id) => {
    const feature = ADD_ON_FEATURES.find((f) => f.id === id)
    return sum + (feature?.priceKES ?? 0)
  }, 0)

  const subtotal = base + addOnTotal
  if (subtotal === 0) return { min: 0, max: 0 }

  // Present as a range rather than a false-precision single number — real scoping
  // always narrows it, this just sets expectations.
  return {
    min: Math.round((subtotal * 0.9) / 1000) * 1000,
    max: Math.round((subtotal * 1.25) / 1000) * 1000,
  }
}
