const STATUS_STYLES: Record<string, string> = {
  PENDING: 'text-slate-soft border-slate-soft/30',
  IN_PROGRESS: 'text-gold border-gold/40',
  BLOCKED: 'text-red-600 border-red-600/40',
  DONE: 'text-emerald border-emerald/40',
}

type Milestone = {
  id: string
  title: string
  description?: string | null
  status: string
  dueDate?: Date | string | null
}

export default function ProjectTimeline({ milestones }: { milestones: Milestone[] }) {
  if (milestones.length === 0) {
    return <p className="text-sm text-slate-soft">No milestones set yet — check back after kickoff.</p>
  }

  return (
    <ol className="border-l border-gold-hairline pl-6">
      {milestones.map((m) => (
        <li key={m.id} className="relative mb-8 last:mb-0">
          <span
            className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 bg-parchment ${STATUS_STYLES[m.status] || ''}`}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-medium text-ink">{m.title}</h4>
            <span
              className={`border px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLES[m.status] || 'text-slate-soft border-slate-soft/30'}`}
            >
              {m.status.replace('_', ' ')}
            </span>
          </div>
          {m.description && <p className="mt-1 text-sm text-slate-soft">{m.description}</p>}
          {m.dueDate && (
            <p className="tabular-figure mt-1 text-xs text-slate-soft">
              Due {new Date(m.dueDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}
