import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { estimatorSchema } from '@/lib/validations/estimator'
import { calculateEstimate } from '@/lib/estimator-pricing'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import EstimatorLeadEmail from '@/emails/EstimatorLeadEmail'

// Basic in-memory rate limiting per IP — good enough to blunt casual abuse of a
// public form; swap for a durable store (Upstash/Redis) if this needs to survive
// serverless cold starts / multiple instances.
const submissionsByIp = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3

function isRateLimited(ip: string) {
  const now = Date.now()
  const timestamps = (submissionsByIp.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  timestamps.push(now)
  submissionsByIp.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const parsed = estimatorSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data
  const estimate = calculateEstimate({
    projectType: data.projectType,
    addOns: data.addOns as any,
  })

  // Persist the lead. Failure here should still let the person know something
  // went wrong rather than silently pretending to succeed.
  let lead
  try {
    lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        industry: data.industry,
        projectType: data.projectType,
        budgetRangeMin: estimate.min,
        budgetRangeMax: estimate.max,
        featuresWanted: data.addOns,
        source: 'estimator',
      },
    })
  } catch (err) {
    console.error('Failed to save lead:', err)
    return NextResponse.json(
      { error: 'Could not save your request right now. Please try again or email us directly.' },
      { status: 500 }
    )
  }

  // Email notification is best-effort — a delivery failure shouldn't fail the
  // whole request since the lead is already safely stored in the database.
  try {
    const html = await render(
      EstimatorLeadEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        industry: data.industry,
        projectType: data.projectType,
        addOns: data.addOns,
        budgetRange: data.budgetRange,
        estimateMin: estimate.min,
        estimateMax: estimate.max,
      })
    )

    await resend.emails.send({
      from: 'Leon Digital Agency <estimator@leondigitalagency.com>',
      to: process.env.CONTACT_NOTIFICATION_EMAIL || 'hello@leondigitalagency.com',
      subject: `New estimate request — ${data.name}`,
      html,
    })
  } catch (err) {
    console.error('Failed to send notification email:', err)
  }

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    estimate,
  })
}
