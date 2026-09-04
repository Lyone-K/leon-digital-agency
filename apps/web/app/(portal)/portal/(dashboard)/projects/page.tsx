import Link from 'next/link'
import { getOrCreatePortalClient } from '@/lib/get-or-create-client'
import { prisma } from '@/lib/prisma'

export default async function PortalProjectsPage() {
  const client = await getOrCreatePortalClient()
  if (!client) return null

  const projects = await prisma.project.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <p className="eyebrow mb-2 text-emerald">All projects</p>
      <h1 className="font-display text-3xl text-ink">Projects</h1>

      <div className="mt-8 border border-gold-hairline">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="ledger-rule border-b bg-parchment-dim text-left">
              <th className="px-4 py-3 font-medium text-slate-soft">Project</th>
              <th className="px-4 py-3 font-medium text-slate-soft">Status</th>
              <th className="px-4 py-3 font-medium text-slate-soft">Industry</th>
              <th className="px-4 py-3 text-right font-medium text-slate-soft">Est. budget</th>
              <th className="px-4 py-3 text-right font-medium text-slate-soft">Target launch</th>
              <th className="px-4 py-3 text-right font-medium text-slate-soft"></th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-soft">
                  No projects yet.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-gold-hairline">
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-emerald">{p.status.replace('_', ' ')}</td>
                <td className="px-4 py-3 text-slate-soft">{p.industry || '—'}</td>
                <td className="tabular-figure px-4 py-3 text-right text-slate">
                  {p.budgetEstimate ? `KES ${Number(p.budgetEstimate).toLocaleString()}` : '—'}
                </td>
                <td className="tabular-figure px-4 py-3 text-right text-slate-soft">
                  {p.targetLaunch ? new Date(p.targetLaunch).toLocaleDateString('en-KE') : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/portal/projects/${p.id}/pay`} className="text-xs text-emerald underline decoration-emerald/40 underline-offset-4 hover:text-gold">
                    Pay deposit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
