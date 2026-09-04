import { getTrafficSeries } from '@/lib/metrics-data'
import TrafficChart from '@/components/portal/TrafficChart'

export default async function PortalMetricsPage() {
  const series = await getTrafficSeries()
  const latest = series[series.length - 1]
  const first = series[0]
  const sessionsGrowth = Math.round(((latest.sessions - first.sessions) / first.sessions) * 100)
  const conversionsGrowth = Math.round(((latest.conversions - first.conversions) / first.conversions) * 100)

  return (
    <div>
      <p className="eyebrow mb-2 text-emerald">Success metrics</p>
      <h1 className="font-display text-3xl text-ink">Traffic & conversions</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-soft">
        Connected to Google Analytics 4 once your property is linked. Shown below
        is sample data illustrating the report shape.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="border border-gold-hairline bg-parchment p-6">
          <p className="text-xs uppercase tracking-wide text-slate-soft">Sessions growth (6mo)</p>
          <p className="tabular-figure mt-2 text-3xl text-gold">+{sessionsGrowth}%</p>
        </div>
        <div className="border border-gold-hairline bg-parchment p-6">
          <p className="text-xs uppercase tracking-wide text-slate-soft">Conversion growth (6mo)</p>
          <p className="tabular-figure mt-2 text-3xl text-emerald">+{conversionsGrowth}%</p>
        </div>
      </div>

      <div className="mt-8 border border-gold-hairline bg-parchment p-6">
        <TrafficChart data={series} />
      </div>
    </div>
  )
}
