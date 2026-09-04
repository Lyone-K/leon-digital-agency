import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { auditSchema } from '@/lib/validations/audit'
import { runPageSpeedAudit } from '@/lib/audit/pagespeed'
import { generateAiSummary } from '@/lib/audit/ai-analysis'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import AuditReportEmail from '@/emails/AuditReportEmail'

const submissionsByIp = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 2 // audits are expensive (PageSpeed + LLM call) — tighter limit than other forms

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
    return NextResponse.json(
      { error: 'Too many audit requests. Please wait a minute and try again.' },
      { status: 429 }
    )
  }

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const parsed = auditSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
  }

  const { url, email } = parsed.data

  const auditRequest = await prisma.auditRequest.create({
    data: { targetUrl: url, requesterEmail: email, status: 'RUNNING' },
  })

  try {
    const scores = await runPageSpeedAudit(url)
    const aiSummary = await generateAiSummary(url, scores)

    await prisma.auditRequest.update({
      where: { id: auditRequest.id },
      data: {
        status: 'COMPLETE',
        seoScore: scores.seoScore,
        performanceScore: scores.performanceScore,
        accessibilityScore: scores.accessibilityScore,
        summary: aiSummary.summary,
        fullReport: { scores, aiSummary } as any,
        completedAt: new Date(),
      },
    })

    // Best-effort email — the audit result is already returned in the response
    // regardless of whether the email send succeeds.
    try {
      const html = await render(AuditReportEmail({ url, scores, aiSummary }))
      await resend.emails.send({
        from: 'Leon Digital Agency <audit@leondigitalagency.com>',
        to: email,
        subject: `Your website audit for ${url}`,
        html,
      })
    } catch (err) {
      console.error('Failed to send audit report email:', err)
    }

    return NextResponse.json({ success: true, scores, aiSummary })
  } catch (err) {
    console.error('Audit failed:', err)
    await prisma.auditRequest.update({
      where: { id: auditRequest.id },
      data: { status: 'FAILED' },
    })
    return NextResponse.json(
      { error: 'Could not complete the audit. The site may be unreachable or blocking automated requests.' },
      { status: 500 }
    )
  }
}
