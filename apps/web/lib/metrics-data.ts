/**
 * Success metrics for the client dashboard. Traffic/conversion series below are
 * placeholder data shaped exactly like what the GA4 Data API's runReport response
 * would produce, so swapping in the real integration later means replacing the
 * body of getTrafficSeries() with an actual `BetaAnalyticsDataClient.runReport()`
 * call — the chart components don't need to change.
 *
 * To wire up the real thing: create a GA4 service account, share the property
 * with it, add its credentials to env, and call the Data API v1beta with a
 * dateRange + metrics: ["sessions", "conversions"] request.
 */

export type MonthlyMetric = { month: string; sessions: number; conversions: number }

export async function getTrafficSeries(): Promise<MonthlyMetric[]> {
  // TODO: replace with a real GA4 Data API call once NEXT_PUBLIC_GA4_MEASUREMENT_ID
  // and service account credentials are configured.
  return [
    { month: 'Feb', sessions: 420, conversions: 12 },
    { month: 'Mar', sessions: 610, conversions: 19 },
    { month: 'Apr', sessions: 890, conversions: 27 },
    { month: 'May', sessions: 1140, conversions: 41 },
    { month: 'Jun', sessions: 1480, conversions: 58 },
    { month: 'Jul', sessions: 1820, conversions: 74 },
  ]
}
