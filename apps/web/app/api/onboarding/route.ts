import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { onboardingSchema } from '@/lib/validations/onboarding'
import { prisma } from '@/lib/prisma'

// The default milestone template every new project starts with. The agency can
// adjust these per-project later from a future admin tool — this just gives the
// client something meaningful to see in their portal on day one instead of an
// empty timeline.
const DEFAULT_MILESTONES = [
  { title: 'Discovery & scoping', order: 1 },
  { title: 'Design concepts', order: 2 },
  { title: 'Development', order: 3 },
  { title: 'Client review', order: 4 },
  { title: 'Launch', order: 5 },
]

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const client = await prisma.client.findUnique({ where: { clerkUserId: userId } })
  if (!client) {
    return NextResponse.json({ error: 'No client record found for this account' }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const slugBase = data.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const slug = `${slugBase}-${Date.now().toString(36)}`

  try {
    const project = await prisma.project.create({
      data: {
        clientId: client.id,
        name: data.projectName,
        slug,
        status: 'ONBOARDING',
        industry: data.industry,
        budgetEstimate: data.budgetEstimate,
        targetLaunch: data.targetLaunch ? new Date(data.targetLaunch) : undefined,
        milestones: {
          create: DEFAULT_MILESTONES,
        },
      },
    })
    return NextResponse.json({ success: true, projectId: project.id })
  } catch (err) {
    console.error('Failed to create project during onboarding:', err)
    return NextResponse.json({ error: 'Could not create your project. Please try again.' }, { status: 500 })
  }
}
