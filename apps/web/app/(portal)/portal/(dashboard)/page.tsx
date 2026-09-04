import Link from 'next/link'
import { getOrCreatePortalClient } from '@/lib/get-or-create-client'
import { prisma } from '@/lib/prisma'
import ProjectTimeline from '@/components/portal/ProjectTimeline'

export default async function PortalOverviewPage() {
  const client = await getOrCreatePortalClient()
  if (!client) return null

  const projects = await prisma.project.findMany({
    where: { clientId: client.id },
    include: { milestones: { orderBy: { order: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <p className="eyebrow mb-2 text-emerald">Welcome back</p>
      <h1 className="font-display text-3xl text-ink">{client.contactName}</h1>
      <p className="mt-1 text-sm text-slate-soft">{client.companyName}</p>

      {projects.length === 0 ? (
        <div className="mt-10 border border-gold-hairline bg-parchment-dim p-10 text-center">
          <p className="text-slate">
            No active projects yet. Once we kick off, your timeline and milestones will show up here.
          </p>
          <Link
            href="/portal/onboarding"
            className="mt-4 inline-block text-sm text-emerald underline decoration-emerald/40 underline-offset-4 hover:text-gold"
          >
            Start a new project
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {projects.map((project) => {
            const done = project.milestones.filter(
              (m) => m.status === 'DONE'
            ).length

            const total = project.milestones.length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            return (
              <div
                key={project.id}
                className="border border-gold-hairline bg-parchment p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl text-ink">
                      {project.name}
                    </h2>

                    <p className="text-xs uppercase tracking-wide text-emerald">
                      {project.status.replace('_', ' ')}
                    </p>
                  </div>

                  {total > 0 && (
                    <div className="text-right">
                      <p className="tabular-figure text-2xl text-gold">
                        {pct}%
                      </p>

                      <p className="text-xs text-slate-soft">
                        {done} of {total} milestones
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-gold-hairline pt-6">
                  <ProjectTimeline milestones={project.milestones} />
                </div>

                <div className="mt-6 border-t border-gold-hairline pt-4 text-right">
                  <Link
                    href={`/portal/projects/${project.id}/pay`}
                    className="text-sm text-emerald underline decoration-emerald/40 underline-offset-4 hover:text-gold"
                  >
                    Pay a deposit
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}