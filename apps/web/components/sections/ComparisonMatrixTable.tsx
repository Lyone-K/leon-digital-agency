import { Check, Minus } from 'lucide-react'
import type { ComparisonMatrixDoc } from '@/lib/sanity.queries'

function Cell({ value }: { value: string }) {
  if (value === 'true') return <Check className="mx-auto h-4 w-4 text-emerald" />
  if (value === 'false') return <Minus className="mx-auto h-4 w-4 text-slate-soft/40" />
  return <span className="text-sm text-slate">{value}</span>
}

export default function ComparisonMatrixTable({ matrix }: { matrix: ComparisonMatrixDoc }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="ledger-rule border-b">
            <th className="py-4 text-left text-sm font-medium text-slate-soft">Feature</th>
            {matrix.columns.map((col) => (
              <th key={col.name} className="py-4 text-center">
                <div className={col.recommended ? 'text-emerald' : 'text-ink'}>
                  <p className="font-display text-lg">{col.name}</p>
                  <p className="tabular-figure mt-1 text-sm text-slate-soft">
                    KES {col.priceKES.toLocaleString()}
                  </p>
                  {col.recommended && (
                    <p className="eyebrow mt-1 text-emerald">Recommended</p>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.feature} className="border-b border-gold-hairline">
              <td className="py-4 text-sm text-slate">
                {row.category && (
                  <span className="mr-2 text-xs uppercase tracking-wide text-emerald/70">
                    {row.category}
                  </span>
                )}
                {row.feature}
              </td>
              {row.values.map((v, i) => (
                <td key={i} className="py-4 text-center">
                  <Cell value={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
