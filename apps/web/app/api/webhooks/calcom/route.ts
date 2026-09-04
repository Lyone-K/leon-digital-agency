import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

// Cal.com signs webhook payloads with HMAC SHA-256 over the raw body, sent in the
// `X-Cal-Signature-256` header. We verify against the raw text (not the parsed
// JSON) since re-serializing JSON can change byte-for-byte formatting and break
// the signature check.
function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET
  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256')

  if (secret) {
    const valid = verifySignature(rawBody, signature, secret)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } else {
    console.warn('CALCOM_WEBHOOK_SECRET not set — skipping signature verification. Do not run this in production without it.')
  }

  const body = JSON.parse(rawBody)
  const { triggerEvent, payload } = body

  if (triggerEvent !== 'BOOKING_CREATED' && triggerEvent !== 'BOOKING_RESCHEDULED') {
    // Cal.com sends many event types (cancelled, rescheduled, etc). We only
    // need to persist new/rescheduled bookings here — extend this switch if
    // cancellations should also update the Booking record's status.
    return NextResponse.json({ received: true, ignored: triggerEvent })
  }

  const attendee = payload?.attendees?.[0]
  if (!attendee?.email) {
    return NextResponse.json({ error: 'No attendee email in payload' }, { status: 400 })
  }

  const existingClient = await prisma.client.findUnique({ where: { email: attendee.email } })

  await prisma.booking.create({
    data: {
      clientId: existingClient?.id,
      leadEmail: attendee.email,
      leadName: attendee.name || 'Unknown',
      calComBookingUid: payload.uid,
      purpose: payload.title || 'discovery-call',
      scheduledAt: new Date(payload.startTime),
      status: 'SCHEDULED',
    },
  })

  return NextResponse.json({ received: true })
}
