import { NextRequest, NextResponse } from 'next/server'
import { render } from '@react-email/render'
import { contactSchema } from '@/lib/validations/contact'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'
import ContactLeadEmail from '@/emails/ContactLeadEmail'

const submissionsByIp = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

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

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        notes: data.message,
        source: 'contact-form',
      },
    })
  } catch (err) {
    console.error('Failed to save contact lead:', err)
    return NextResponse.json(
      { error: 'Could not send your message right now. Please try again or email us directly.' },
      { status: 500 }
    )
  }

  try {
    const html = await render(ContactLeadEmail(data))
    await resend.emails.send({
      from: 'Leon Digital Agency <contact@leondigitalagency.com>',
      to: process.env.CONTACT_NOTIFICATION_EMAIL || 'hello@leondigitalagency.com',
      reply_to: data.email,
      subject: `New contact message — ${data.name}`,
      html,
    })
  } catch (err) {
    console.error('Failed to send contact notification email:', err)
  }

  return NextResponse.json({ success: true })
}
