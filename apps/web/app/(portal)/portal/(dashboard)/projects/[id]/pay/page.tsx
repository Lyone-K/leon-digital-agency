import { notFound } from 'next/navigation'
import { getOrCreatePortalClient } from '@/lib/get-or-create-client'
import { prisma } from '@/lib/prisma'
import DepositTabs from '@/components/portal/DepositTabs'

export default async function ProjectPaymentPage({ params }: { params: { id: string } }) {
  const client = await getOrCreatePortalClient()
  if (!client) return null

  // Ownership check happens here too, not just in the API routes — a signed-in
  // client should never even see the payment form for a project that isn't
  // theirs, regardless of what the API would separately reject.
  const project = await prisma.project.findFirst({ where: { id: params.id, clientId: client.id } })
  if (!project) notFound()

  return (
    <div>
      <p className="eyebrow mb-2 text-emerald">Deposit</p>
      <h1 className="font-display text-3xl text-ink">{project.name}</h1>
      <p className="mt-2 max-w-xl text-sm text-slate-soft">
        Pay via M-Pesa (Kenyan shillings) or card through Stripe (USD). Both are processed securely — we never see or store your card or PIN.
      </p>

      <div className="mt-8 max-w-xl">
        <DepositTabs projectId={project.id} />
      </div>
    </div>
  )
}
