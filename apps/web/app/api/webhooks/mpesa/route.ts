import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// IMPORTANT: unlike Stripe, Safaricom's Daraja API does not sign callback
// payloads, so we cannot cryptographically verify the sender the way the Stripe
// webhook does below. The mitigations available are: (1) treat the callback URL
// itself as a secret (don't publish it, rotate it if leaked), (2) ideally put
// it behind an allowlist of Safaricom's published IP ranges at the
// infrastructure/firewall level, and (3) always re-derive amounts from our own
// Payment record rather than trusting anything in the callback body. This
// handler does (3) — it never writes an amount from the callback, only a status.

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const callback = body?.Body?.stkCallback
  if (!callback) {
    return NextResponse.json({ error: 'Malformed callback payload' }, { status: 400 })
  }

  const { CheckoutRequestID, ResultCode } = callback

  const payment = await prisma.payment.findFirst({
    where: { providerRef: CheckoutRequestID, provider: 'MPESA' },
  })

  if (!payment) {
    // Acknowledge anyway — Safaricom retries on non-200 responses, and we don't
    // want retries piling up for a payment we'll never recognize.
    console.warn(`M-Pesa callback for unknown CheckoutRequestID: ${CheckoutRequestID}`)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  // Idempotency: Safaricom can deliver the same callback more than once. If
  // we've already resolved this payment, don't process it again.
  if (payment.status === 'SUCCESS' || payment.status === 'FAILED') {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Already processed' })
  }

  if (ResultCode === 0) {
    // CallbackMetadata contains the confirmed amount/receipt on success — worth
    // logging for reconciliation even though we don't let it override our own
    // stored amount.
    const metadata = callback.CallbackMetadata?.Item ?? []
    const receiptItem = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        providerRef: receiptItem?.Value ? String(receiptItem.Value) : payment.providerRef,
      },
    })
  } else {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })
  }

  // Safaricom expects this exact shape acknowledging receipt.
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
