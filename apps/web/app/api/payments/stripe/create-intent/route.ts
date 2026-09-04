import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripePaymentSchema } from '@/lib/validations/payment'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })

  const parsed = stripePaymentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten() }, { status: 400 })
  }
  const { projectId, amountUSD } = parsed.data

  const client = await prisma.client.findUnique({ where: { clerkUserId: userId } })
  if (!client) return NextResponse.json({ error: 'No client record found' }, { status: 404 })

  const project = await prisma.project.findFirst({ where: { id: projectId, clientId: client.id } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Create the Payment row first (PENDING) so we have a durable record to
  // reconcile against regardless of what happens with Stripe.
  const payment = await prisma.payment.create({
    data: {
      clientId: client.id,
      projectId: project.id,
      provider: 'STRIPE',
      amount: amountUSD,
      currency: 'USD',
      status: 'PENDING',
    },
  })

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amountUSD * 100), // Stripe expects the smallest currency unit (cents)
      currency: 'usd',
      metadata: {
        paymentId: payment.id,
        projectId: project.id,
        projectSlug: project.slug,
      },
      automatic_payment_methods: { enabled: true },
    })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { providerRef: intent.id },
    })

    return NextResponse.json({ success: true, clientSecret: intent.client_secret, paymentId: payment.id })
  } catch (err) {
    console.error('Stripe PaymentIntent creation failed:', err)
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } })
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 })
  }
}
