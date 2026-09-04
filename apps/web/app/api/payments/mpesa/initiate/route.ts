import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { mpesaPaymentSchema } from '@/lib/validations/payment'
import { initiateStkPush } from '@/lib/mpesa'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const parsed = mpesaPaymentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
  }
  const { projectId, amountKES, phone } = parsed.data

  const client = await prisma.client.findUnique({ where: { clerkUserId: userId } })
  if (!client) return NextResponse.json({ error: 'No client record found' }, { status: 404 })

  // Never trust a projectId from the client without confirming it actually
  // belongs to the authenticated account — otherwise anyone could pay a deposit
  // against (or worse, probe the existence of) someone else's project.
  const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Create the Payment row before calling Safaricom so we have a durable record
  // even if the STK push request itself fails partway through.
  const payment = await prisma.payment.create({
    data: {
      clientId: client.id,
      projectId: project.id,
      provider: 'MPESA',
      amount: amountKES,
      currency: 'KES',
      status: 'PENDING',
      phoneNumber: phone,
    },
  })

  try {
    const stk = await initiateStkPush({
      phone,
      amountKES,
      accountReference: project.slug,
      transactionDesc: 'Deposit',
    })

    // CheckoutRequestID is what the callback references — store it now so the
    // webhook can find this row.
    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerRef: stk.CheckoutRequestID },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: stk.CustomerMessage,
    })
  } catch (err) {
    console.error('STK push failed:', err)
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })
    return NextResponse.json(
      { error: 'Could not initiate the M-Pesa prompt. Check the phone number and try again.' },
      { status: 500 }
    )
  }
}
